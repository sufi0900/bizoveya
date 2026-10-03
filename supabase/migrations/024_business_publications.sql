-- P02.3.1: explicit publication snapshots; apply once after001–023.
begin;
create table public.bizoveya_business_publications (
 site_id uuid primary key references public.bizoveya_sites(id) on delete cascade,
 document jsonb not null check(bizoveya_private.valid_business_document(document)),
 source_version integer not null check(source_version > 0),
 version integer not null check(version > 0), active boolean not null,
 published_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.bizoveya_business_publication_history (
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 version integer not null, document jsonb not null, source_version integer not null,
 action text not null check(action in ('publish','unpublish')),
 actor_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(),
 primary key(site_id,version)
);
alter table public.bizoveya_business_publications enable row level security;
alter table public.bizoveya_business_publication_history enable row level security;
revoke all on public.bizoveya_business_publications,public.bizoveya_business_publication_history from public,anon,authenticated;
grant select on public.bizoveya_business_publications,public.bizoveya_business_publication_history to authenticated;
create policy "members read publication state" on public.bizoveya_business_publications for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create policy "members read publication history" on public.bizoveya_business_publication_history for select to authenticated using(exists(select 1 from public.bizoveya_sites s where s.id=site_id and bizoveya_private.workspace_role(s.workspace_id) is not null));
create function public.bz_set_business_publication(p_workspace_id uuid,p_site_id uuid,p_expected_draft_version integer,p_expected_publication_version integer,p_publish boolean)
returns setof public.bizoveya_business_publications language plpgsql security definer set search_path='' as $$
declare d public.bizoveya_business_drafts; current public.bizoveya_business_publications; next_version integer;
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() and role in ('owner','editor') for share;
 if not found then raise exception 'bz_forbidden'; end if;
 perform 1 from public.bizoveya_sites where workspace_id=p_workspace_id and id=p_site_id and mode='native_business' for update;
 if not found then raise exception 'bz_not_found'; end if;
 if p_publish is null then raise exception 'bz_invalid_publication'; end if;
 select * into current from public.bizoveya_business_publications where site_id=p_site_id;
 if coalesce(current.version,0) is distinct from p_expected_publication_version then raise exception 'bz_conflict'; end if;
 select * into d from public.bizoveya_business_drafts where site_id=p_site_id;
 if p_publish then
  if d.version is null or d.version is distinct from p_expected_draft_version then raise exception 'bz_conflict'; end if;
  if d.document->'schemaVersion' is distinct from '2'::jsonb or not exists(select 1 from jsonb_array_elements(d.document->'sections') s where s->>'type'='hero' and s->'visible'='true'::jsonb)
    or not exists(select 1 from jsonb_array_elements(d.document->'sections') s where s->>'type'='contact' and s->'visible'='true'::jsonb)
    or (btrim(d.document->>'email')='' and regexp_replace(d.document->>'phone','[^0-9]','','g')='') then raise exception 'bz_publication_not_ready'; end if;
  if current.active and current.source_version=d.version then return query select * from public.bizoveya_business_publications where site_id=p_site_id; return; end if;
 else
  if current.version is null then raise exception 'bz_not_found'; end if;
  if not current.active then return query select * from public.bizoveya_business_publications where site_id=p_site_id; return; end if;
 end if;
 next_version:=coalesce(current.version,0)+1;
 insert into public.bizoveya_business_publications(site_id,document,source_version,version,active,published_at) values(p_site_id,case when p_publish then d.document else current.document end,case when p_publish then d.version else current.source_version end,next_version,p_publish,case when p_publish then now() else current.published_at end)
 on conflict(site_id) do update set document=excluded.document,source_version=excluded.source_version,version=excluded.version,active=excluded.active,published_at=excluded.published_at,updated_at=now();
 insert into public.bizoveya_business_publication_history(site_id,version,document,source_version,action,actor_id)
 select site_id,version,document,source_version,case when p_publish then 'publish' else 'unpublish' end,auth.uid() from public.bizoveya_business_publications where site_id=p_site_id;
 return query select * from public.bizoveya_business_publications where site_id=p_site_id;
end; $$;
revoke all on function public.bz_set_business_publication(uuid,uuid,integer,integer,boolean) from public,anon,authenticated;
grant execute on function public.bz_set_business_publication(uuid,uuid,integer,integer,boolean) to authenticated;
-- Public projection excludes hidden sections and fields not used by visible sections.
-- The full approved snapshot/history remains private to members.
create function bizoveya_private.public_business_document(d jsonb)
returns jsonb language sql immutable set search_path='' as $$
 select jsonb_set(jsonb_set(jsonb_set(d,'{sections}',coalesce((select jsonb_agg(
  jsonb_set(jsonb_set(jsonb_set(s,'{body}',case when s->>'type' in ('hero','about') and (s->>'image'='' or (s->>'type'='about' and s->>'layout'<>'split')) then '""'::jsonb else s->'body' end),'{items}',case when s->>'type' in ('testimonials','projects','faq') then case when s->>'type'='testimonials' and s->>'layout'='featured' and jsonb_array_length(s->'items')>0 then jsonb_build_array(s->'items'->0) else case when s->>'type'='faq' then coalesce((select jsonb_agg(jsonb_set(item,'{image}','""'::jsonb)) from jsonb_array_elements(s->'items') item),'[]'::jsonb) else s->'items' end end else '[]'::jsonb end),'{image}',case when (s->>'type'='hero' or (s->>'type'='about' and s->>'layout'='split')) then s->'image' else '""'::jsonb end)
  order by ord) from jsonb_array_elements(d->'sections') with ordinality as rows(s,ord) where s->'visible'='true'::jsonb and (s->>'type'<>'about' or btrim(d->>'about')<>'') and (s->>'type' not in ('testimonials','projects','faq') or jsonb_array_length(s->'items')>0)),'[]'::jsonb)),
 '{about}',case when exists(select 1 from jsonb_array_elements(d->'sections') s where s->'visible'='true'::jsonb and s->>'type'='about') then d->'about' else '""'::jsonb end),
 '{services}',case when exists(select 1 from jsonb_array_elements(d->'sections') s where s->'visible'='true'::jsonb and s->>'type'='services') then d->'services' else '[{"title":"Service","description":""}]'::jsonb end);
$$;
revoke all on function bizoveya_private.public_business_document(jsonb) from public,anon,authenticated;
create function public.bz_read_public_business(p_site_id uuid)
returns table(site_id uuid,document jsonb,version integer,published_at timestamptz) language sql stable security definer set search_path='' as $$
 select p.site_id,bizoveya_private.public_business_document(p.document),p.version,p.published_at from public.bizoveya_business_publications p join public.bizoveya_sites s on s.id=p.site_id where p.site_id=p_site_id and p.active and s.mode='native_business';
$$;
revoke all on function public.bz_read_public_business(uuid) from public,anon,authenticated;
grant execute on function public.bz_read_public_business(uuid) to anon,authenticated;
commit;
