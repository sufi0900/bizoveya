-- P02.5: compatible brand/photo metadata, editorial policy, owner site removal.
-- Apply once after028; no existing row is rewritten.
begin;
create or replace function bizoveya_private.valid_business_document_028(d jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare k text; s jsonb; item jsonb; n integer; ids text[] := array[]::text[];
begin
  if jsonb_typeof(d) is distinct from 'object' then return false; end if;
  if d->'schemaVersion' = '1'::jsonb then return bizoveya_private.valid_business_document_v1(d); end if;
  if d->'schemaVersion' is distinct from '2'::jsonb or octet_length(d::text) > 65536 then return false; end if;
  if (select count(*) from jsonb_object_keys(d)) <> 14 then return false; end if;
  if d->>'templateId' not in ('service-studio-v1','local-services-v1','creative-business-v1','wellness-studio-v1','education-academy-v1','product-launch-v1') or jsonb_typeof(d->'templateId') is distinct from 'string' then return false; end if;
  if jsonb_typeof(d->'accent') is distinct from 'string' or d->>'accent' not in ('mint','blue','amber') then return false; end if;
  if jsonb_typeof(d->'font') is distinct from 'string' or d->>'font' not in ('editorial','modern') then return false; end if;
  foreach k in array array['name','headline','description','about','location','email','phone','hours'] loop
    n := case k when 'name' then 80 when 'headline' then 140 when 'description' then 500 when 'about' then 1500 when 'location' then 160 when 'email' then 254 when 'phone' then 60 when 'hours' then 300 end;
    if jsonb_typeof(d->k) is distinct from 'string' or char_length(d->>k) > n then return false; end if;
  end loop;
  if char_length(btrim(d->>'name')) < 1 or char_length(btrim(d->>'headline')) < 1 then return false; end if;
  if d->>'email' <> '' and d->>'email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then return false; end if;
  if jsonb_typeof(d->'services') is distinct from 'array' then return false; end if;
  if jsonb_array_length(d->'services') not between 1 and 6 then return false; end if;
  for item in select value from jsonb_array_elements(d->'services') loop
    if jsonb_typeof(item) is distinct from 'object' then return false; end if;
    if (select count(*) from jsonb_object_keys(item)) <> 2 then return false; end if;
    if jsonb_typeof(item->'title') is distinct from 'string' or char_length(item->>'title') > 80 or char_length(btrim(item->>'title')) < 1 then return false; end if;
    if jsonb_typeof(item->'description') is distinct from 'string' or char_length(item->>'description') > 400 then return false; end if;
  end loop;
  if jsonb_typeof(d->'sections') is distinct from 'array' then return false; end if;
  if jsonb_array_length(d->'sections') not between 1 and 20 then return false; end if;
  for s in select value from jsonb_array_elements(d->'sections') loop
    if jsonb_typeof(s) is distinct from 'object' then return false; end if;
    if (select count(*) from jsonb_object_keys(s)) <> 9 then return false; end if;
    if jsonb_typeof(s->'id') is distinct from 'string' or s->>'id' !~ '^[a-z][a-z0-9-]{0,63}$' or s->>'id' = any(ids) then return false; end if;
    ids := array_append(ids,s->>'id');
    if jsonb_typeof(s->'type') is distinct from 'string' or jsonb_typeof(s->'layout') is distinct from 'string' then return false; end if;
    if not (case s->>'type'
      when 'hero' then s->>'layout' in ('split','centered','editorial')
      when 'services' then s->>'layout' in ('cards','list','rows')
      when 'about' then s->>'layout' in ('split','text')
      when 'testimonials' then s->>'layout' in ('cards','featured','slider')
      when 'projects' then s->>'layout' in ('grid','featured')
      when 'faq' then s->>'layout' in ('accordion','list')
      when 'contact' then s->>'layout' in ('panel','compact')
      when 'cta' then s->>'layout' in ('banner','centered')
      else false end) then return false; end if;
    if jsonb_typeof(s->'visible') is distinct from 'boolean' or jsonb_typeof(s->'tone') is distinct from 'string' or s->>'tone' not in ('base','soft','accent') then return false; end if;
    foreach k in array array['heading','body','image'] loop
      n := case k when 'heading' then 140 when 'body' then 600 when 'image' then 1000 end;
      if jsonb_typeof(s->k) is distinct from 'string' or char_length(s->>k) > n then return false; end if;
    end loop;
    if not bizoveya_private.valid_business_image(s->>'image') then return false; end if;
    if jsonb_typeof(s->'items') is distinct from 'array' then return false; end if;
    if jsonb_array_length(s->'items') > 8 then return false; end if;
    for item in select value from jsonb_array_elements(s->'items') loop
      if jsonb_typeof(item) is distinct from 'object' then return false; end if;
      if (select count(*) from jsonb_object_keys(item)) <> 3 then return false; end if;
      foreach k in array array['title','body','image'] loop
        n := case k when 'title' then 100 when 'body' then 600 when 'image' then 1000 end;
        if jsonb_typeof(item->k) is distinct from 'string' or char_length(item->>k) > n then return false; end if;
      end loop;
      if not bizoveya_private.valid_business_image(item->>'image') then return false; end if;
    end loop;
  end loop;
  return true;
end; $$;

revoke all on function bizoveya_private.valid_business_document_028(jsonb) from public,anon,authenticated;
create or replace function bizoveya_private.valid_business_document(d jsonb)
returns boolean language plpgsql immutable set search_path='' as $$
declare clean jsonb := d; s jsonb; stripped jsonb := '[]'::jsonb;
begin
 if jsonb_typeof(d) is distinct from 'object' then return false;end if;
 if d->'schemaVersion'='1'::jsonb then return bizoveya_private.valid_business_document_028(d);end if;
 if d ? 'logo' then
  if jsonb_typeof(d->'logo') is distinct from 'string' or not bizoveya_private.valid_business_image(d->>'logo') then return false;end if;
  clean:=clean-'logo';
 end if;
 if jsonb_typeof(d->'sections') is distinct from 'array' then return false;end if;
 for s in select value from jsonb_array_elements(d->'sections') loop
  if s ? 'imageFit' and (jsonb_typeof(s->'imageFit') is distinct from 'string' or s->>'imageFit' not in ('cover','contain')) then return false;end if;
  if s ? 'imagePosition' and (jsonb_typeof(s->'imagePosition') is distinct from 'string' or s->>'imagePosition' not in ('center','top','bottom')) then return false;end if;
  stripped:=stripped||jsonb_build_array(s-'imageFit'-'imagePosition');
 end loop;
 return octet_length(d::text)<=65536 and bizoveya_private.valid_business_document_028(jsonb_set(clean,'{sections}',stripped));
end;$$;
revoke all on function bizoveya_private.valid_business_document(jsonb) from public,anon,authenticated;
create function bizoveya_private.valid_business_editing_policy(d jsonb)
returns boolean language plpgsql immutable set search_path='' as $$
declare s jsonb; visible_count integer; idx integer:=0; hero_count integer;
begin
 if d->'schemaVersion'='1'::jsonb then return true;end if;
 if char_length(d->>'headline')>120 or char_length(d->>'description')>320 then return false;end if;
 select count(*) into hero_count from jsonb_array_elements(d->'sections') v where v->>'type'='hero';
 if hero_count>1 then return false;end if;
 select count(*) into visible_count from jsonb_array_elements(d->'sections') v where v->'visible'='true'::jsonb;
 for s in select value from jsonb_array_elements(d->'sections') where value->'visible'='true'::jsonb loop
  if s->>'type'='hero' and idx<>0 then return false;end if;
  if s->>'type'='faq' and idx<visible_count-3 then return false;end if;
  idx:=idx+1;
 end loop;
 return true;
end;$$;
revoke all on function bizoveya_private.valid_business_editing_policy(jsonb) from public,anon,authenticated;
create or replace function public.bz_save_business_draft(p_workspace_id uuid, p_site_id uuid, p_document jsonb, p_expected_version integer)
returns setof public.bizoveya_business_drafts language plpgsql security definer set search_path = '' as $$
declare v_version integer;
begin
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner','editor') for share;
  if not found then raise exception 'bz_forbidden'; end if;
  -- Lock the site even for the first save: concurrent first writes cannot overwrite one another.
  perform 1 from public.bizoveya_sites where id = p_site_id and workspace_id = p_workspace_id and mode = 'native_business' for update;
  if not found then raise exception 'bz_not_found'; end if;
  if not bizoveya_private.valid_business_document(p_document) then raise exception 'bz_invalid_business_document'; end if;
  if not bizoveya_private.valid_business_editing_policy(p_document) then raise exception 'bz_invalid_business_order';end if;
  select version into v_version from public.bizoveya_business_drafts where site_id = p_site_id;
  if coalesce(v_version,0) is distinct from p_expected_version then raise exception 'bz_conflict'; end if;
  return query insert into public.bizoveya_business_drafts(site_id,document,version,updated_by) values(p_site_id,p_document,1,auth.uid())
    on conflict(site_id) do update set document = excluded.document, version = bizoveya_business_drafts.version + 1, updated_by = auth.uid(), updated_at = now() returning *;
end; $$;
create or replace function public.bz_set_business_publication(p_workspace_id uuid,p_site_id uuid,p_expected_draft_version integer,p_expected_publication_version integer,p_publish boolean)
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
  if not bizoveya_private.valid_business_editing_policy(d.document) then raise exception 'bz_invalid_business_order';end if;
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

create table public.bizoveya_site_removal_events(
 id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.bizoveya_workspaces(id) on delete cascade,
 site_id uuid not null,actor_id uuid references auth.users(id) on delete set null,occurred_at timestamptz not null default clock_timestamp(),action text not null default 'owner_removed' check(action='owner_removed')
);
alter table public.bizoveya_site_removal_events enable row level security;
revoke all on public.bizoveya_site_removal_events from public,anon,authenticated;
grant select on public.bizoveya_site_removal_events to authenticated;
create policy "owner reads site removal events" on public.bizoveya_site_removal_events for select to authenticated using(bizoveya_private.workspace_role(workspace_id)='owner');
create function public.bz_delete_site(p_workspace_id uuid,p_site_id uuid,p_expected_version integer,p_confirmation_name text)
returns void language plpgsql security definer set search_path='' as $$
declare current public.bizoveya_sites;
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() and role='owner' for share;
 if not found then raise exception 'bz_forbidden';end if;
 -- Same workspace lock/order as registry create/update; locks site against draft writes.
 perform 1 from public.bizoveya_workspaces where id=p_workspace_id for update;
 select * into current from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;
 if not found then raise exception 'bz_not_found';end if;
 if current.version is distinct from p_expected_version then raise exception 'bz_conflict';end if;
 if p_confirmation_name is distinct from current.name then raise exception 'bz_confirmation_mismatch';end if;
 insert into public.bizoveya_site_removal_events(workspace_id,site_id,actor_id) values(p_workspace_id,p_site_id,auth.uid());
 delete from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id;
 -- Existing FKs cascade business snapshots/history, knowledge/revisions/events and preferences.
 -- projects is a referenced parent and is deliberately never deleted here.
end;$$;
revoke all on function public.bz_delete_site(uuid,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.bz_delete_site(uuid,uuid,integer,text) to authenticated;
commit;
