-- Bizoveya P02.1. Additive; run once after reconciling 001–020.
-- No portfolio or publication changes. Workspace drafts have no public-read policy.
begin;
create function bizoveya_private.valid_business_document(d jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare k text; service jsonb; limit_length integer;
begin
  if jsonb_typeof(d) is distinct from 'object' or pg_column_size(d) > 16384 then return false; end if;
  if (select count(*) from jsonb_object_keys(d)) <> 11 then return false; end if;
  if d->'schemaVersion' is distinct from '1'::jsonb or d->>'templateId' is distinct from 'service-studio-v1' then return false; end if;
  if jsonb_typeof(d->'accent') is distinct from 'string' or d->>'accent' not in ('mint','blue','amber') then return false; end if;
  foreach k in array array['name','headline','description','about','location','email','phone'] loop
    limit_length := case k when 'name' then 80 when 'headline' then 140 when 'description' then 500 when 'about' then 1500 when 'location' then 160 when 'email' then 254 when 'phone' then 60 end;
    if jsonb_typeof(d->k) is distinct from 'string' or char_length(d->>k) > limit_length then return false; end if;
  end loop;
  if char_length(btrim(d->>'name')) < 1 or char_length(btrim(d->>'headline')) < 1 then return false; end if;
  if d->>'email' <> '' and d->>'email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then return false; end if;
  if jsonb_typeof(d->'services') is distinct from 'array' then return false; end if;
  if jsonb_array_length(d->'services') not between 1 and 6 then return false; end if;
  for service in select value from jsonb_array_elements(d->'services') loop
    if jsonb_typeof(service) is distinct from 'object' then return false; end if;
    if (select count(*) from jsonb_object_keys(service)) <> 2 then return false; end if;
    if jsonb_typeof(service->'title') is distinct from 'string' or char_length(btrim(service->>'title')) not between 1 and 80 then return false; end if;
    if char_length(service->>'title') > 80 or jsonb_typeof(service->'description') is distinct from 'string' or char_length(service->>'description') > 400 then return false; end if;
  end loop;
  return true;
end; $$;
revoke all on function bizoveya_private.valid_business_document(jsonb) from public, anon, authenticated;
create table public.bizoveya_business_drafts (
  site_id uuid primary key references public.bizoveya_sites(id) on delete cascade,
  document jsonb not null check (bizoveya_private.valid_business_document(document)),
  version integer not null default 1 check(version > 0),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.bizoveya_business_drafts enable row level security;
revoke all on public.bizoveya_business_drafts from public, anon, authenticated;
grant select on public.bizoveya_business_drafts to authenticated;
create policy "members read business drafts" on public.bizoveya_business_drafts for select to authenticated using (
  exists(select 1 from public.bizoveya_sites s where s.id = site_id and s.mode = 'native_business' and bizoveya_private.workspace_role(s.workspace_id) is not null)
);
create function public.bz_save_business_draft(p_workspace_id uuid, p_site_id uuid, p_document jsonb, p_expected_version integer)
returns setof public.bizoveya_business_drafts language plpgsql security definer set search_path = '' as $$
declare v_version integer;
begin
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner','editor') for share;
  if not found then raise exception 'bz_forbidden'; end if;
  -- Lock the site even for the first save: concurrent first writes cannot overwrite one another.
  perform 1 from public.bizoveya_sites where id = p_site_id and workspace_id = p_workspace_id and mode = 'native_business' for update;
  if not found then raise exception 'bz_not_found'; end if;
  if not bizoveya_private.valid_business_document(p_document) then raise exception 'bz_invalid_business_document'; end if;
  select version into v_version from public.bizoveya_business_drafts where site_id = p_site_id;
  if coalesce(v_version,0) is distinct from p_expected_version then raise exception 'bz_conflict'; end if;
  return query insert into public.bizoveya_business_drafts(site_id,document,version,updated_by) values(p_site_id,p_document,1,auth.uid())
    on conflict(site_id) do update set document = excluded.document, version = bizoveya_business_drafts.version + 1, updated_by = auth.uid(), updated_at = now() returning *;
end; $$;
revoke all on function public.bz_save_business_draft(uuid,uuid,jsonb,integer) from public, anon, authenticated;
grant execute on function public.bz_save_business_draft(uuid,uuid,jsonb,integer) to authenticated;
commit;
