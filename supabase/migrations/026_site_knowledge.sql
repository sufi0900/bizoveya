-- P03.1: private site knowledge. Additive after025; no public retrieval or model service.
begin;
create function bizoveya_private.valid_knowledge_document(d jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare f jsonb;
begin
 if jsonb_typeof(d) is distinct from 'object' or octet_length(d::text)>160000 or (select count(*) from jsonb_object_keys(d))<>4 then return false;end if;
 if jsonb_typeof(d->'title') is distinct from 'string' or length(btrim(d->>'title')) not between 1 and 120 then return false;end if;
 if jsonb_typeof(d->'filename') is distinct from 'string' or length(d->>'filename')>120 or d->>'filename' ~ E'[/\\\\\\x01-\\x1F]' then return false;end if;
 if d->>'title' ~ '[\x01-\x08\x0B\x0C\x0E-\x1F]' or d->>'sourceText' ~ '[\x01-\x08\x0B\x0C\x0E-\x1F]' then return false;end if;
 if jsonb_typeof(d->'sourceText') is distinct from 'string' or length(btrim(d->>'sourceText')) not between 1 and 16000 then return false;end if;
 if jsonb_typeof(d->'facts') is distinct from 'array' then return false;end if;
 if jsonb_array_length(d->'facts')>40 then return false;end if;
 for f in select value from jsonb_array_elements(d->'facts') loop
  if jsonb_typeof(f) is distinct from 'object' or (select count(*) from jsonb_object_keys(f))<>2 or jsonb_typeof(f->'id') is distinct from 'string' or f->>'id' !~ '^[a-zA-Z0-9_-]{1,60}$' or jsonb_typeof(f->'text') is distinct from 'string' or length(btrim(f->>'text')) not between 1 and 500 then return false;end if;
  if f->>'text' ~ '[\x01-\x08\x0B\x0C\x0E-\x1F]' then return false;end if;
 end loop;
 if (select count(distinct value->>'id') from jsonb_array_elements(d->'facts'))<>jsonb_array_length(d->'facts') then return false;end if;
 return true;
end;$$;
revoke all on function bizoveya_private.valid_knowledge_document(jsonb) from public,anon,authenticated;
create table public.bizoveya_knowledge_sources(
 id uuid primary key,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 document jsonb not null check(bizoveya_private.valid_knowledge_document(document)),
 source_key text generated always as (md5(btrim(document->>'sourceText'))) stored,
 version integer not null default 1 check(version > 0),approved boolean not null default false,
 approved_by uuid references auth.users(id) on delete set null,approved_at timestamptz,
 updated_by uuid references auth.users(id) on delete set null,updated_at timestamptz not null default now(),
 unique(site_id,source_key),check((approved and approved_at is not null) or(not approved and approved_at is null and approved_by is null))
);
create table public.bizoveya_knowledge_revisions(
 source_id uuid references public.bizoveya_knowledge_sources(id) on delete cascade,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 version integer not null,document jsonb not null,approved boolean not null,actor_id uuid references auth.users(id) on delete set null,occurred_at timestamptz not null default now(),action text not null,primary key(source_id,version)
);
create table public.bizoveya_knowledge_events(
 id uuid primary key default gen_random_uuid(),site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 source_id uuid not null,version integer not null,action text not null,actor_id uuid references auth.users(id) on delete set null,occurred_at timestamptz not null default now()
);
alter table public.bizoveya_knowledge_sources enable row level security;
alter table public.bizoveya_knowledge_revisions enable row level security;
alter table public.bizoveya_knowledge_events enable row level security;
revoke all on public.bizoveya_knowledge_sources,public.bizoveya_knowledge_revisions,public.bizoveya_knowledge_events from public,anon,authenticated;
grant select on public.bizoveya_knowledge_sources,public.bizoveya_knowledge_revisions,public.bizoveya_knowledge_events to authenticated;
create policy "members read scoped knowledge" on public.bizoveya_knowledge_sources for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create policy "members read scoped revisions" on public.bizoveya_knowledge_revisions for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create policy "members read scoped knowledge events" on public.bizoveya_knowledge_events for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create function public.bz_mutate_knowledge(p_workspace_id uuid,p_site_id uuid,p_source_id uuid,p_action text,p_document jsonb,p_expected_version integer)
returns setof public.bizoveya_knowledge_sources language plpgsql security definer set search_path='' as $$
declare v_role text;old public.bizoveya_knowledge_sources%rowtype;cur public.bizoveya_knowledge_sources%rowtype;
begin
 select role into v_role from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if v_role is null or v_role='viewer' or (p_action<>'save' and v_role<>'owner') then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_action is null or p_action not in ('save','approve','revoke','delete') or p_source_id is null then raise exception 'bz_invalid_knowledge';end if;
 select * into old from public.bizoveya_knowledge_sources where id=p_source_id for update;
 if found and old.site_id<>p_site_id then raise exception 'bz_not_found';end if;
 if coalesce(old.version,0) is distinct from p_expected_version then raise exception 'bz_conflict';end if;
 if p_action='delete' then
  if old.id is null then raise exception 'bz_not_found';end if;
  insert into public.bizoveya_knowledge_events(site_id,source_id,version,action,actor_id) values(p_site_id,p_source_id,old.version,'delete',auth.uid());
  delete from public.bizoveya_knowledge_sources where id=p_source_id;return;
 end if;
 if p_action='save' then
  if not bizoveya_private.valid_knowledge_document(p_document) then raise exception 'bz_invalid_knowledge';end if;
  if exists(select 1 from public.bizoveya_knowledge_sources where site_id=p_site_id and source_key=md5(btrim(p_document->>'sourceText')) and id<>p_source_id) then raise exception 'bz_knowledge_duplicate';end if;
  if old.id is not null and old.document=p_document then return next old;return;end if;
  if old.id is null and (select count(*) from public.bizoveya_knowledge_sources where site_id=p_site_id)>=20 then raise exception 'bz_knowledge_limit';end if;
 else
  if old.id is null then raise exception 'bz_not_found';end if;
  if p_action='approve' and jsonb_array_length(old.document->'facts')=0 then raise exception 'bz_knowledge_empty';end if;
  if old.approved=(p_action='approve') then return next old;return;end if;
 end if;
 if coalesce(old.version,0)>=100 and p_action<>'revoke' then raise exception 'bz_knowledge_limit';end if;
 insert into public.bizoveya_knowledge_sources(id,site_id,document,version,approved,approved_by,approved_at,updated_by)
 values(p_source_id,p_site_id,case when p_action='save' then p_document else old.document end,coalesce(old.version,0)+1,p_action='approve',case when p_action='approve' then auth.uid() end,case when p_action='approve' then now() end,auth.uid())
 on conflict(id) do update set document=excluded.document,version=excluded.version,approved=excluded.approved,approved_by=excluded.approved_by,approved_at=excluded.approved_at,updated_by=excluded.updated_by,updated_at=now() returning * into cur;
 insert into public.bizoveya_knowledge_revisions(source_id,site_id,version,document,approved,actor_id,action) values(cur.id,cur.site_id,cur.version,cur.document,cur.approved,auth.uid(),p_action);
 insert into public.bizoveya_knowledge_events(site_id,source_id,version,action,actor_id) values(cur.site_id,cur.id,cur.version,p_action,auth.uid());
 return next cur;
end;$$;
create function public.bz_read_approved_knowledge(p_workspace_id uuid,p_site_id uuid)
returns table(id uuid,title text,filename text,facts jsonb,version integer,approved_at timestamptz) language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where public.bizoveya_sites.id=p_site_id and workspace_id=p_workspace_id;if not found then raise exception 'bz_not_found';end if;
 return query select k.id,k.document->>'title',k.document->>'filename',k.document->'facts',k.version,k.approved_at from public.bizoveya_knowledge_sources k where k.site_id=p_site_id and k.approved order by k.updated_at desc;
end;$$;
revoke all on function public.bz_mutate_knowledge(uuid,uuid,uuid,text,jsonb,integer),public.bz_read_approved_knowledge(uuid,uuid) from public,anon,authenticated;
grant execute on function public.bz_mutate_knowledge(uuid,uuid,uuid,text,jsonb,integer),public.bz_read_approved_knowledge(uuid,uuid) to authenticated;
commit;
