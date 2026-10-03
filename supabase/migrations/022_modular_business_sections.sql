-- Bizoveya P02.2. Apply once AFTER 021. No row rewrite/version increment.
-- Schema-v1 rows remain valid; application upgrades on read and saves v2.
begin;
create function bizoveya_private.valid_business_document_v1(d jsonb)
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
revoke all on function bizoveya_private.valid_business_document_v1(jsonb) from public, anon, authenticated;

create function bizoveya_private.valid_business_image(u text)
returns boolean language sql immutable set search_path = '' as $$
  select u = '' or (char_length(u) <= 1000 and u ~* '^https://[^[:space:]/?#@]+([/?#][^[:space:]]*)?$' and u !~* '^https://(localhost([:/?#]|$)|127[.]|\[?::1\]?)');
$$;
revoke all on function bizoveya_private.valid_business_image(text) from public, anon, authenticated;
create or replace function bizoveya_private.valid_business_document(d jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare k text; s jsonb; item jsonb; n integer; ids text[] := array[]::text[];
begin
  if jsonb_typeof(d) is distinct from 'object' then return false; end if;
  if d->'schemaVersion' = '1'::jsonb then return bizoveya_private.valid_business_document_v1(d); end if;
  if d->'schemaVersion' is distinct from '2'::jsonb or octet_length(d::text) > 65536 then return false; end if;
  if (select count(*) from jsonb_object_keys(d)) <> 14 then return false; end if;
  if d->>'templateId' not in ('service-studio-v1','local-services-v1','creative-business-v1') or jsonb_typeof(d->'templateId') is distinct from 'string' then return false; end if;
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
-- Existing CHECK and save RPC use the new validator. RLS, grants, row locking
-- and optimistic expected-version protection remain unchanged from 021.
commit;
