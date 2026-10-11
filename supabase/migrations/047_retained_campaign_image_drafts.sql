-- Immutable site-shared image artifacts, separate from existing visual/text histories.
begin;
create table bizoveya_private.campaign_image_drafts(
 generation_id uuid primary key references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null check(version between 1 and 50),base_visual_version integer not null check(base_visual_version between 1 and 50),
 source_review_version integer not null check(source_review_version>0),document jsonb not null,
 updated_at timestamptz not null default clock_timestamp(),actor_id uuid references auth.users(id) on delete set null
);
create table bizoveya_private.campaign_image_revisions(
 generation_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null check(version between 1 and 50),base_visual_version integer not null check(base_visual_version between 1 and 50),
 source_review_version integer not null check(source_review_version>0),document jsonb not null,
 occurred_at timestamptz not null default clock_timestamp(),actor_id uuid references auth.users(id) on delete set null,
 primary key(generation_id,version)
);
-- No creator FK: the explicitly shared artifact survives creator/library deletion.
-- The physical object is immutable and reference-retained, rather than duplicated in Storage.
create table bizoveya_private.campaign_image_objects(
 generation_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 media_id uuid not null,media_version integer not null check(media_version between 1 and 20),
 creator_id uuid not null,descriptor jsonb not null check(bizoveya_private.valid_private_media_descriptor(descriptor)),
 review jsonb not null,object_path text not null,
 primary key(generation_id,media_id,media_version)
);
create index campaign_image_object_path on bizoveya_private.campaign_image_objects(object_path);
alter table bizoveya_private.campaign_image_drafts enable row level security;
alter table bizoveya_private.campaign_image_revisions enable row level security;
alter table bizoveya_private.campaign_image_objects enable row level security;
revoke all on bizoveya_private.campaign_image_drafts,bizoveya_private.campaign_image_revisions,bizoveya_private.campaign_image_objects from public,anon,authenticated,service_role;

create function bizoveya_private.valid_campaign_image_document(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare a jsonb;r jsonb;seen_ text[]:=array[]::text[];images_ text[]:=array[]::text[];key_ text;begin
 if p is null or jsonb_typeof(p) is distinct from 'object' or octet_length(p::text)>48000 then return false;end if;
 if (select count(*) from jsonb_object_keys(p))<>3 or not(p ?& array['schema','document','attachments']) or p->>'schema' is distinct from 'campaign-media-working-copy-v1' then return false;end if;
 if not bizoveya_private.valid_visual_document(p->'document') or jsonb_typeof(p->'attachments') is distinct from 'array' or jsonb_array_length(p->'attachments')>9 then return false;end if;
 for a in select value from jsonb_array_elements(p->'attachments') loop
  if jsonb_typeof(a) is distinct from 'object' or (select count(*) from jsonb_object_keys(a))<>3 or not(a ?& array['target','reference','descriptor']) then return false;end if;
  if a->>'target' not in('pin-1','pin-2','slide-1','slide-2','slide-3','slide-4','slide-5','slide-6','linkedin-1') or jsonb_typeof(a->'target') is distinct from 'string' or (a->>'target')=any(seen_) then return false;end if;
  if a->>'target'='linkedin-1' and p#>>'{document,schema}'='campaign-visuals-v1' then return false;end if;
  seen_:=array_append(seen_,a->>'target');r:=a->'reference';
  if jsonb_typeof(r) is distinct from 'object' or (select count(*) from jsonb_object_keys(r))<>3 or not(r ?& array['mediaId','version','sha256']) or jsonb_typeof(r->'mediaId') is distinct from 'string' or jsonb_typeof(r->'version') is distinct from 'number' then return false;end if;
  perform (r->>'mediaId')::uuid;
  if (r->>'version')!~'^[1-9][0-9]*$' or (r->>'version')::integer not between 1 and 20 or jsonb_typeof(r->'sha256') is distinct from 'string' or (r->>'sha256')!~'^[a-f0-9]{64}$' then return false;end if;
  if not bizoveya_private.valid_private_media_descriptor(a->'descriptor') or r->>'sha256' is distinct from a#>>'{descriptor,sha256}' then return false;end if;
  if jsonb_typeof(a#>'{descriptor,bytes}') is distinct from 'number' or jsonb_typeof(a#>'{descriptor,width}') is distinct from 'number' or jsonb_typeof(a#>'{descriptor,height}') is distinct from 'number' or jsonb_typeof(a#>'{descriptor,sha256}') is distinct from 'string' then return false;end if;
  key_:=concat(r->>'mediaId',':',r->>'version');if not key_=any(images_) then images_:=array_append(images_,key_);end if;
 end loop;return cardinality(images_)<=3;
exception when others then return false;end;$$;

create function public.bz_campaign_image_draft(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id);
 perform 1 from bizoveya_private.generation_runs where id=p_generation_id and site_id=p_site_id;if not found then raise exception 'bz_not_found';end if;
 select jsonb_build_object('generationId',d.generation_id,'version',d.version,'baseVisualVersion',d.base_visual_version,'sourceReviewVersion',d.source_review_version,'document',d.document,'updatedAt',d.updated_at,'revisions',coalesce((select jsonb_agg(jsonb_build_object('version',h.version,'baseVisualVersion',h.base_visual_version,'sourceReviewVersion',h.source_review_version,'document',h.document,'occurredAt',h.occurred_at) order by h.version desc) from bizoveya_private.campaign_image_revisions h where h.generation_id=d.generation_id),'[]'::jsonb)) into result_ from bizoveya_private.campaign_image_drafts d where d.generation_id=p_generation_id;
 return result_;
end;$$;

create function public.bz_save_campaign_image_draft(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid,p_expected_version integer,p_base_visual_version integer,p_source_review_version integer,p_document jsonb,p_reviewed boolean,p_share_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;run_ bizoveya_private.generation_runs%rowtype;base_ bizoveya_private.campaign_visuals%rowtype;current_ bizoveya_private.campaign_image_drafts%rowtype;review_ bizoveya_private.generation_reviews%rowtype;a jsonb;r jsonb;v bizoveya_private.private_media_versions%rowtype;stored_ bizoveya_private.campaign_image_objects%rowtype;path_ text;used_ bigint;begin
 actor_:=auth.uid();perform 1 from auth.users where id=actor_ and deleted_at is null for update;if not found then raise exception 'bz_forbidden';end if;
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 -- Serialize retained-byte admission across all generation results on this site.
 perform pg_advisory_xact_lock(hashtextextended('campaign-image-site:'||p_site_id::text,0));
 if p_expected_version is null or p_expected_version<0 or p_base_visual_version is null or p_source_review_version is null or p_reviewed is distinct from true or p_share_reviewed is distinct from true or not bizoveya_private.valid_campaign_image_document(p_document) then raise exception 'bz_invalid_media_visual';end if;
 select * into run_ from bizoveya_private.generation_runs where id=p_generation_id and site_id=p_site_id for update;if not found then raise exception 'bz_not_found';end if;
 select * into review_ from bizoveya_private.generation_reviews where generation_id=run_.id order by version desc limit 1;
 if run_.status<>'succeeded' or run_.output_document#>>'{stages,quality,approved}' is distinct from 'true' or exists(select 1 from jsonb_array_elements(coalesce(run_.output_document#>'{stages,quality,issues}','[]'::jsonb)) x where x->>'severity'='blocker') or review_.decision is distinct from 'accepted' or review_.version is distinct from p_source_review_version then raise exception 'bz_visual_source_unaccepted';end if;
 select * into base_ from bizoveya_private.campaign_visuals where generation_id=run_.id for update;
 if base_.version is distinct from p_base_visual_version or base_.source_review_version is distinct from p_source_review_version or base_.document is distinct from p_document->'document' then raise exception 'bz_image_base_changed';end if;
 select * into current_ from bizoveya_private.campaign_image_drafts where generation_id=run_.id for update;
 if coalesce(current_.version,0)<>p_expected_version then raise exception 'bz_conflict';end if;
 if current_.document=p_document and current_.base_visual_version=p_base_visual_version and current_.source_review_version=p_source_review_version then return public.bz_campaign_image_draft(p_workspace_id,p_site_id,p_generation_id);end if;
 if coalesce(current_.version,0)>=50 then raise exception 'bz_visual_limit';end if;
 for a in select value from jsonb_array_elements(p_document->'attachments') loop
  r:=a->'reference';
  select * into stored_ from bizoveya_private.campaign_image_objects where generation_id=run_.id and media_id=(r->>'mediaId')::uuid and media_version=(r->>'version')::integer;
  if stored_.generation_id is not null then
   if stored_.descriptor is distinct from a->'descriptor' then raise exception 'bz_media_unavailable';end if;
  else
   perform 1 from bizoveya_private.private_media where id=(r->>'mediaId')::uuid and creator_id=actor_ and workspace_id=p_workspace_id and site_id=p_site_id and not archived for share;if not found then raise exception 'bz_media_unavailable';end if;
   select * into v from bizoveya_private.private_media_versions where media_id=(r->>'mediaId')::uuid and version=(r->>'version')::integer for share;
   if v.media_id is null or v.review_decision is distinct from 'accepted' or v.descriptor is distinct from a->'descriptor' then raise exception 'bz_media_unavailable';end if;
   -- Serialize against object cleanup. Only fully committed uploads can become artifacts.
   perform 1 from bizoveya_private.media_upload_attempts where object_path=v.object_path and state='committed' for update;if not found then raise exception 'bz_media_unavailable';end if;
   insert into bizoveya_private.campaign_image_objects(generation_id,media_id,media_version,creator_id,descriptor,review,object_path) values(run_.id,v.media_id,v.version,actor_,v.descriptor,jsonb_build_object('decision','accepted','actorId',actor_,'reason',v.review_reason,'reviewedAt',v.reviewed_at),v.object_path);
  end if;
 end loop;
 select coalesce(sum((x.descriptor->>'bytes')::bigint),0) into used_ from (select distinct on(o.object_path) o.object_path,o.descriptor from bizoveya_private.campaign_image_objects o join bizoveya_private.generation_runs g on g.id=o.generation_id where g.site_id=p_site_id order by o.object_path) x;
 if used_>167772160 then raise exception 'bz_image_retained_limit';end if;
 insert into bizoveya_private.campaign_image_drafts(generation_id,version,base_visual_version,source_review_version,document,actor_id) values(run_.id,coalesce(current_.version,0)+1,p_base_visual_version,p_source_review_version,p_document,actor_) on conflict(generation_id) do update set version=excluded.version,base_visual_version=excluded.base_visual_version,source_review_version=excluded.source_review_version,document=excluded.document,actor_id=excluded.actor_id,updated_at=clock_timestamp();
 insert into bizoveya_private.campaign_image_revisions(generation_id,version,base_visual_version,source_review_version,document,actor_id) values(run_.id,coalesce(current_.version,0)+1,p_base_visual_version,p_source_review_version,p_document,actor_);
 return public.bz_campaign_image_draft(p_workspace_id,p_site_id,p_generation_id);
end;$$;

-- Paths are visible only to the trusted server after current site-member checks.
create function public.bz_campaign_image_object(p_actor uuid,p_workspace uuid,p_site uuid,p_generation uuid,p_media uuid,p_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site,false);
 select jsonb_build_object('path',o.object_path,'creatorId',o.creator_id,'descriptor',o.descriptor) into result_ from bizoveya_private.campaign_image_objects o join bizoveya_private.generation_runs g on g.id=o.generation_id where o.generation_id=p_generation and g.site_id=p_site and o.media_id=p_media and o.media_version=p_version;
 if result_ is null then raise exception 'bz_media_unavailable';end if;return result_;
end;$$;
create function bizoveya_private.immutable_campaign_image_object() returns trigger language plpgsql set search_path='' as $$begin
 if tg_table_name='campaign_image_revisions' and to_jsonb(new)-'actor_id'=to_jsonb(old)-'actor_id' and to_jsonb(new)->>'actor_id' is null and to_jsonb(old)->>'actor_id' is not null and not exists(select 1 from auth.users where id=(to_jsonb(old)->>'actor_id')::uuid) then return new;end if;
 raise exception 'bz_immutable_media';end;$$;
create trigger campaign_image_object_immutable before update on bizoveya_private.campaign_image_objects for each row execute function bizoveya_private.immutable_campaign_image_object();
create trigger campaign_image_revision_immutable before update on bizoveya_private.campaign_image_revisions for each row execute function bizoveya_private.immutable_campaign_image_object();
revoke all on function bizoveya_private.valid_campaign_image_document(jsonb),bizoveya_private.immutable_campaign_image_object(),public.bz_campaign_image_draft(uuid,uuid,uuid),public.bz_save_campaign_image_draft(uuid,uuid,uuid,integer,integer,integer,jsonb,boolean,boolean),public.bz_campaign_image_object(uuid,uuid,uuid,uuid,uuid,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_campaign_image_draft(uuid,uuid,uuid),public.bz_save_campaign_image_draft(uuid,uuid,uuid,integer,integer,integer,jsonb,boolean,boolean) to authenticated;
grant execute on function public.bz_campaign_image_object(uuid,uuid,uuid,uuid,uuid,integer) to service_role;

-- Cleanup replacements follow: both creator and global maintenance protect retained artifacts.

create or replace function public.bz_claim_media_cleanup(p_actor uuid,p_workspace uuid,p_site uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 perform 1 from auth.users where id=p_actor for update;
 with candidates as (
  select a.id from bizoveya_private.media_upload_attempts a where a.actor_id=p_actor and a.workspace_id=p_workspace and a.site_id=p_site and a.state in('pending','cleaning') and a.created_at<clock_timestamp()-interval '10 minutes'
  and (a.cleanup_at is null or a.cleanup_at<clock_timestamp()-interval '2 minutes')
  and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path) and not exists(select 1 from bizoveya_private.campaign_image_objects o where o.object_path=a.object_path)
  order by a.created_at limit 8 for update skip locked
 ), claimed as (update bizoveya_private.media_upload_attempts a set state='cleaning',cleanup_at=clock_timestamp() from candidates c where a.id=c.id returning a.id,a.object_path)
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'path',object_path)),'[]'::jsonb) into result_ from claimed;
 return result_;
end;$$;
create or replace function public.bz_finish_media_cleanup(p_actor uuid,p_workspace uuid,p_site uuid,p_attempt uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 delete from bizoveya_private.media_upload_attempts a where a.id=p_attempt and a.actor_id=p_actor and a.workspace_id=p_workspace and a.site_id=p_site and a.state='cleaning'
 and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path) and not exists(select 1 from bizoveya_private.campaign_image_objects o where o.object_path=a.object_path);
 if not found then raise exception 'bz_conflict';end if;
end;$$;
create or replace function public.bz_claim_media_cleanup_global() returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 with candidates as (
  select a.id from bizoveya_private.media_upload_attempts a where a.created_at<clock_timestamp()-interval '10 minutes'
  and (a.cleanup_at is null or a.cleanup_at<clock_timestamp()-interval '2 minutes')
  and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path) and not exists(select 1 from bizoveya_private.campaign_image_objects o where o.object_path=a.object_path)
  order by a.created_at limit 8 for update skip locked
 ), claimed as (update bizoveya_private.media_upload_attempts a set state='cleaning',cleanup_at=clock_timestamp() from candidates c where a.id=c.id returning a.id,a.object_path)
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'path',object_path)),'[]'::jsonb) into result_ from claimed;
 return result_;
end;$$;
create or replace function public.bz_finish_media_cleanup_global(p_attempt uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 delete from bizoveya_private.media_upload_attempts a where a.id=p_attempt and a.state='cleaning' and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path) and not exists(select 1 from bizoveya_private.campaign_image_objects o where o.object_path=a.object_path);
 if not found then raise exception 'bz_conflict';end if;
end;$$;
commit;
