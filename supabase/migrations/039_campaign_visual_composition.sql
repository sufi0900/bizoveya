-- P04.3.4.1: private, versioned text/layout composition. No model calls or publication.
begin;
create table bizoveya_private.campaign_visuals(
 generation_id uuid primary key references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null check(version between 1 and 50),source_review_version integer not null check(source_review_version>0),
 document jsonb not null,updated_at timestamptz not null default clock_timestamp(),updated_by uuid references auth.users(id) on delete set null
);
create table bizoveya_private.campaign_visual_revisions(
 generation_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null check(version between 1 and 50),source_review_version integer not null check(source_review_version>0),
 document jsonb not null,occurred_at timestamptz not null default clock_timestamp(),actor_id uuid references auth.users(id) on delete set null,
 primary key(generation_id,version)
);
alter table bizoveya_private.campaign_visuals enable row level security;
alter table bizoveya_private.campaign_visual_revisions enable row level security;
revoke all on bizoveya_private.campaign_visuals,bizoveya_private.campaign_visual_revisions from public,anon,authenticated,service_role;

create function bizoveya_private.valid_visual_text(p_value jsonb,p_max integer) returns boolean language sql immutable set search_path='' as $$
 select coalesce(jsonb_typeof(p_value)='string' and length(btrim(p_value#>>'{}')) between 1 and p_max and (p_value#>>'{}') !~ '[\x01-\x08\x0B\x0C\x0E-\x1F]',false);
$$;
create function bizoveya_private.valid_visual_document(p_document jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare item jsonb;begin
 if p_document is null or jsonb_typeof(p_document)<>'object' or octet_length(p_document::text)>24000 then return false;end if;
 if (select count(*) from jsonb_object_keys(p_document))<>4 or p_document->>'schema' is distinct from 'campaign-visuals-v1' or not(p_document ?& array['schema','brand','pins','slides']) then return false;end if;
 if jsonb_typeof(p_document->'brand') is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(p_document->'brand'))<>3 or not(p_document->'brand' ?& array['name','accent','footer']) then return false;end if;
 if not bizoveya_private.valid_visual_text(p_document#>'{brand,name}',60) or not bizoveya_private.valid_visual_text(p_document#>'{brand,footer}',100) or jsonb_typeof(p_document#>'{brand,accent}') is distinct from 'string' or (p_document#>>'{brand,accent}') !~ '^#[0-9a-fA-F]{6}$' then return false;end if;
 if jsonb_typeof(p_document->'pins') is distinct from 'array' or jsonb_typeof(p_document->'slides') is distinct from 'array' then return false;end if;
 if jsonb_array_length(p_document->'pins')<>2 or jsonb_array_length(p_document->'slides')<>6 then return false;end if;
 for item in select value from jsonb_array_elements(p_document->'pins') loop
  if jsonb_typeof(item)<>'object' then return false;end if;
  if (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',120) or not bizoveya_private.valid_visual_text(item->'body',600) then return false;end if;
 end loop;
 for item in select value from jsonb_array_elements(p_document->'slides') loop
  if jsonb_typeof(item)<>'object' then return false;end if;
  if (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',100) or not bizoveya_private.valid_visual_text(item->'body',420) then return false;end if;
 end loop;return true;
end;$$;

create function public.bz_campaign_visual(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;begin
 if not exists(select 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=p_site_id and s.workspace_id=p_workspace_id and m.user_id=auth.uid()) then raise exception 'bz_forbidden' using errcode='42501';end if;
 if not exists(select 1 from bizoveya_private.generation_runs where id=p_generation_id and site_id=p_site_id) then raise exception 'bz_not_found';end if;
 select jsonb_build_object('generationId',v.generation_id,'version',v.version,'sourceReviewVersion',v.source_review_version,'document',v.document,'updatedAt',v.updated_at,'revisions',coalesce((select jsonb_agg(jsonb_build_object('version',h.version,'sourceReviewVersion',h.source_review_version,'document',h.document,'occurredAt',h.occurred_at) order by h.version desc) from bizoveya_private.campaign_visual_revisions h where h.generation_id=v.generation_id),'[]'::jsonb)) into result from bizoveya_private.campaign_visuals v where generation_id=p_generation_id;
 return result;
end;$$;
create function public.bz_save_campaign_visual(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid,p_expected_version integer,p_source_review_version integer,p_document jsonb,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare role_ text;r bizoveya_private.generation_runs%rowtype;review_ bizoveya_private.generation_reviews%rowtype;v bizoveya_private.campaign_visuals%rowtype;begin
 select role into role_ from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if role_ is distinct from 'owner' then raise exception 'bz_forbidden' using errcode='42501';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for share;if not found then raise exception 'bz_not_found';end if;
 if p_expected_version is null or p_expected_version<0 or p_source_review_version is null or p_source_review_version<1 or p_reviewed is distinct from true or not bizoveya_private.valid_visual_document(p_document) then raise exception 'bz_invalid_visual';end if;
 -- Match the review function's run-row lock: source review cannot change mid-save.
 select * into r from bizoveya_private.generation_runs where id=p_generation_id and site_id=p_site_id for update;
 if r.id is null then raise exception 'bz_not_found';end if;
 if r.status<>'succeeded' or r.output_document is null or (r.output_document#>>'{stages,quality,approved}') is distinct from 'true' or exists(select 1 from jsonb_array_elements(coalesce(r.output_document#>'{stages,quality,issues}','[]'::jsonb)) i where i->>'severity'='blocker') then raise exception 'bz_visual_source_unaccepted';end if;
 select * into review_ from bizoveya_private.generation_reviews where generation_id=r.id order by version desc limit 1;
 if review_.decision is distinct from 'accepted' or review_.version is distinct from p_source_review_version then raise exception 'bz_visual_source_unaccepted';end if;
 select * into v from bizoveya_private.campaign_visuals where generation_id=r.id for update;
 if coalesce(v.version,0)<>p_expected_version then raise exception 'bz_conflict';end if;
 if v.document=p_document and v.source_review_version=p_source_review_version then return public.bz_campaign_visual(p_workspace_id,p_site_id,p_generation_id);end if;
 if coalesce(v.version,0)>=50 then raise exception 'bz_visual_limit';end if;
 insert into bizoveya_private.campaign_visuals(generation_id,version,source_review_version,document,updated_by) values(r.id,coalesce(v.version,0)+1,p_source_review_version,p_document,auth.uid()) on conflict(generation_id) do update set version=excluded.version,source_review_version=excluded.source_review_version,document=excluded.document,updated_at=clock_timestamp(),updated_by=auth.uid();
 insert into bizoveya_private.campaign_visual_revisions(generation_id,version,source_review_version,document,actor_id) values(r.id,coalesce(v.version,0)+1,p_source_review_version,p_document,auth.uid());
 return public.bz_campaign_visual(p_workspace_id,p_site_id,p_generation_id);
end;$$;
revoke all on function bizoveya_private.valid_visual_text(jsonb,integer),bizoveya_private.valid_visual_document(jsonb),public.bz_campaign_visual(uuid,uuid,uuid),public.bz_save_campaign_visual(uuid,uuid,uuid,integer,integer,jsonb,boolean) from public,anon,authenticated,service_role;
grant execute on function public.bz_campaign_visual(uuid,uuid,uuid),public.bz_save_campaign_visual(uuid,uuid,uuid,integer,integer,jsonb,boolean) to authenticated;
commit;
