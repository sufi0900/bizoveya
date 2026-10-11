-- P04.3.3 checkpoint 1: private manually authored campaign drafts. No provider execution.
begin;
create function bizoveya_private.valid_campaign_document(d jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare k text; cap integer;
begin
 if jsonb_typeof(d) is distinct from 'object' or octet_length(d::text)>150000 or (select count(*) from jsonb_object_keys(d))<>5 then return false;end if;
 foreach k in array array['title','brief','blog','pinterest','linkedin'] loop
  cap:=case k when 'title' then 120 when 'brief' then 4000 when 'blog' then 24000 when 'pinterest' then 2000 else 5000 end;
  if jsonb_typeof(d->k) is distinct from 'string' or length(d->>k)>cap then return false;end if;
  if k in ('title','brief') and length(btrim(d->>k))=0 then return false;end if;
 end loop;
 return true;
end;$$;
revoke all on function bizoveya_private.valid_campaign_document(jsonb) from public,anon,authenticated;
create table public.bizoveya_campaigns(
 id uuid primary key,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 document jsonb not null check(bizoveya_private.valid_campaign_document(document)),
 version integer not null check(version between 1 and 100),updated_at timestamptz not null default now(),updated_by uuid references auth.users(id) on delete set null
);
create table public.bizoveya_campaign_revisions(
 campaign_id uuid not null references public.bizoveya_campaigns(id) on delete cascade,
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 version integer not null,document jsonb not null,actor_id uuid references auth.users(id) on delete set null,occurred_at timestamptz not null default now(),primary key(campaign_id,version)
);
alter table public.bizoveya_campaigns enable row level security;
alter table public.bizoveya_campaign_revisions enable row level security;
revoke all on public.bizoveya_campaigns,public.bizoveya_campaign_revisions from public,anon,authenticated;
grant select on public.bizoveya_campaigns,public.bizoveya_campaign_revisions to authenticated;
create policy "members read private campaigns" on public.bizoveya_campaigns for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create policy "members read campaign history" on public.bizoveya_campaign_revisions for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create function public.bz_save_campaign(p_workspace_id uuid,p_site_id uuid,p_id uuid,p_document jsonb,p_expected_version integer)
returns setof public.bizoveya_campaigns language plpgsql security definer set search_path='' as $$
declare v_role text; old public.bizoveya_campaigns%rowtype; cur public.bizoveya_campaigns%rowtype;
begin
 select role into v_role from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if v_role is null or v_role='viewer' then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_id is null or not bizoveya_private.valid_campaign_document(p_document) then raise exception 'bz_invalid_campaign';end if;
 select * into old from public.bizoveya_campaigns where id=p_id for update;
 if old.id is not null and old.site_id<>p_site_id then raise exception 'bz_not_found';end if;
 if coalesce(old.version,0) is distinct from p_expected_version then raise exception 'bz_conflict';end if;
 if old.document=p_document then return next old;return;end if;
 if coalesce(old.version,0)>=100 or (old.id is null and (select count(*) from public.bizoveya_campaigns where site_id=p_site_id)>=50) then raise exception 'bz_campaign_limit';end if;
 insert into public.bizoveya_campaigns(id,site_id,document,version,updated_by) values(p_id,p_site_id,p_document,coalesce(old.version,0)+1,auth.uid())
 on conflict(id) do update set document=excluded.document,version=excluded.version,updated_by=excluded.updated_by,updated_at=now() returning * into cur;
 insert into public.bizoveya_campaign_revisions(campaign_id,site_id,version,document,actor_id) values(cur.id,cur.site_id,cur.version,cur.document,auth.uid());
 return next cur;
end;$$;
revoke all on function public.bz_save_campaign(uuid,uuid,uuid,jsonb,integer) from public,anon;
grant execute on function public.bz_save_campaign(uuid,uuid,uuid,jsonb,integer) to authenticated;
commit;
