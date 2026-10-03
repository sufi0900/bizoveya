-- Bizoveya 1.10 / P02.2.F1. Apply once after 001–022.
-- Preserve all existing rows, including legacy duplicates; reject new conflicts.
begin;
create function bizoveya_private.site_name_key(v text) returns text language sql immutable set search_path = '' as $$
 select lower(regexp_replace(btrim(v), '[[:space:]]+', ' ', 'g'));
$$;
create function bizoveya_private.site_url_key(v text) returns text language sql immutable set search_path = '' as $$
 select regexp_replace(regexp_replace(regexp_replace(regexp_replace(v, '^https?://', ''), '^www\.', ''), '^([^/]+):(80|443)(/|$)', '\1\3'), '/+$', '');
$$;
-- Volatile function SELECT obtains a fresh READ COMMITTED snapshot after lock wait.
create function bizoveya_private.guard_site_identity() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if tg_op='UPDATE' and (new.id is distinct from old.id or new.workspace_id is distinct from old.workspace_id) then raise exception 'bz_invalid_identity'; end if;
 perform 1 from public.bizoveya_workspaces where id=new.workspace_id for update;
 if tg_op='INSERT' or bizoveya_private.site_name_key(new.name) is distinct from bizoveya_private.site_name_key(old.name) then
  if exists(select 1 from public.bizoveya_sites s where s.workspace_id=new.workspace_id and s.id<>new.id and bizoveya_private.site_name_key(s.name)=bizoveya_private.site_name_key(new.name)) then raise exception 'bz_duplicate_name'; end if;
 end if;
 if new.mode='external' and (tg_op='INSERT' or bizoveya_private.site_url_key(new.url) is distinct from bizoveya_private.site_url_key(old.url)) then
  if exists(select 1 from public.bizoveya_sites s where s.workspace_id=new.workspace_id and s.id<>new.id and s.mode='external' and bizoveya_private.site_url_key(s.url)=bizoveya_private.site_url_key(new.url)) then raise exception 'bz_duplicate_url'; end if;
 end if;
 return new;
end; $$;
create trigger bz_site_identity before insert or update on public.bizoveya_sites for each row execute function bizoveya_private.guard_site_identity();
create index bizoveya_site_name_lookup on public.bizoveya_sites(workspace_id,bizoveya_private.site_name_key(name));
create index bizoveya_site_url_lookup on public.bizoveya_sites(workspace_id,bizoveya_private.site_url_key(url)) where mode='external';
create or replace function public.bz_create_workspace(p_name text)
returns setof public.bizoveya_workspaces language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_user uuid := auth.uid();
begin
 if v_user is null then raise exception 'bz_forbidden'; end if;
 if p_name is null or char_length(btrim(p_name)) not between 1 and 80 then raise exception 'bz_invalid_name'; end if;
 perform 1 from auth.users where id=v_user for update;
 if exists(select 1 from public.bizoveya_workspaces where owner_id=v_user and bizoveya_private.site_name_key(name)=bizoveya_private.site_name_key(p_name)) then raise exception 'bz_duplicate_workspace'; end if;
 insert into public.bizoveya_workspaces(owner_id,name) values(v_user,btrim(p_name)) returning id into v_id;
 insert into public.bizoveya_memberships(workspace_id,user_id,role) values(v_id,v_user,'owner');
 return query select * from public.bizoveya_workspaces where id=v_id;
end; $$;
create function public.bz_register_business_site(p_workspace_id uuid,p_name text,p_status text,p_ownership_confirmed boolean,p_document jsonb)
returns setof public.bizoveya_sites language plpgsql security definer set search_path = '' as $$
declare v_site public.bizoveya_sites;
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() and role in ('owner','editor') for share;
 if not found then raise exception 'bz_forbidden'; end if;
 if not bizoveya_private.valid_business_document(p_document) or p_document->>'name' is distinct from btrim(p_name) then raise exception 'bz_invalid_business_document'; end if;
 select * into v_site from public.bz_register_site(p_workspace_id,p_name,'native_business','business',null,null,p_status,p_ownership_confirmed);
 perform public.bz_save_business_draft(p_workspace_id,v_site.id,p_document,0);
 return next v_site;
end; $$;
revoke all on function bizoveya_private.site_name_key(text),bizoveya_private.site_url_key(text),bizoveya_private.guard_site_identity() from public,anon,authenticated;
revoke all on function public.bz_register_business_site(uuid,text,text,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.bz_register_business_site(uuid,text,text,boolean,jsonb) to authenticated;
create or replace function public.bz_update_site(p_workspace_id uuid, p_site_id uuid, p_name text, p_status text, p_expected_version integer, p_url text, p_ownership_confirmed boolean)
returns setof public.bizoveya_sites language plpgsql security definer set search_path = '' as $$
declare v_site public.bizoveya_sites;
begin
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner','editor') for share;
  if not found then raise exception 'bz_forbidden'; end if;
  perform 1 from public.bizoveya_workspaces where id=p_workspace_id for update;
  select * into v_site from public.bizoveya_sites where id = p_site_id and workspace_id = p_workspace_id for update;
  if not found then raise exception 'bz_not_found'; end if;
  if v_site.version is distinct from p_expected_version then raise exception 'bz_conflict'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 or p_status is null or p_status not in ('active','paused') then raise exception 'bz_invalid_details'; end if;
  if p_url is not null and (v_site.mode <> 'external' or p_ownership_confirmed is distinct from true or not bizoveya_private.valid_site_url(p_url)) then raise exception 'bz_invalid_url'; end if;
  return query update public.bizoveya_sites set name = btrim(p_name), status = p_status, url = coalesce(p_url, url), version = version + 1, updated_at = now(),
    ownership_declared_at = case when p_url is not null then now() else ownership_declared_at end where id = p_site_id returning *;
end; $$;


create or replace function public.bz_rename_workspace(p_workspace_id uuid,p_name text,p_expected_version integer)
returns setof public.bizoveya_workspaces language plpgsql security definer set search_path = '' as $$
declare v_owner uuid;
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() and role='owner' for share;
 if not found then raise exception 'bz_forbidden'; end if;
 if p_name is null or char_length(btrim(p_name)) not between 1 and 80 then raise exception 'bz_invalid_name'; end if;
 select owner_id into v_owner from public.bizoveya_workspaces where id=p_workspace_id;
 perform 1 from auth.users where id=v_owner for update;
 if exists(select 1 from public.bizoveya_workspaces where owner_id=v_owner and id<>p_workspace_id and bizoveya_private.site_name_key(name)=bizoveya_private.site_name_key(p_name)) then raise exception 'bz_duplicate_workspace'; end if;
 return query update public.bizoveya_workspaces set name=btrim(p_name),version=version+1,updated_at=now() where id=p_workspace_id and version=p_expected_version returning *;
 if not found then raise exception 'bz_conflict'; end if;
end; $$;

commit;
