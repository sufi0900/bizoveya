-- Trusted server object lifecycle. No hosted execution or public bucket policy.
begin;
create unique index private_media_versions_object_path on bizoveya_private.private_media_versions(object_path);
create table bizoveya_private.media_upload_attempts (
 id uuid primary key, actor_id uuid not null, workspace_id uuid not null, site_id uuid not null,
 media_id uuid not null, expected_revision integer not null check(expected_revision>=0), version integer not null check(version between 1 and 20),
 descriptor jsonb not null check(bizoveya_private.valid_private_media_descriptor(descriptor)), object_path text not null unique check(object_path~'^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[1-9][0-9]?/[a-f0-9]{64}\.(png|jpg)$'),
 state text not null default 'pending' check(state in ('pending','committed','cleaning')),
 created_at timestamptz not null default clock_timestamp(), cleanup_at timestamptz
);
create index media_attempt_actor on bizoveya_private.media_upload_attempts(actor_id,site_id,created_at);
alter table bizoveya_private.media_upload_attempts enable row level security;
revoke all on bizoveya_private.media_upload_attempts from public,anon,authenticated,service_role;
create table bizoveya_private.media_upload_rate(actor_id uuid primary key references auth.users(id) on delete cascade,window_start timestamptz not null,admissions integer not null,processing integer not null default 0);
alter table bizoveya_private.media_upload_rate enable row level security;
revoke all on bizoveya_private.media_upload_rate from public,anon,authenticated,service_role;

create function bizoveya_private.media_service_actor(p_actor uuid,p_workspace uuid,p_site uuid,p_owner boolean default true)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 -- Acquire the creator lock first; avoid concurrent SHARE-to-UPDATE upgrades.
 perform 1 from auth.users where id=p_actor and deleted_at is null for update;
 if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_memberships x join public.bizoveya_sites s on s.workspace_id=x.workspace_id
 where x.user_id=p_actor and x.workspace_id=p_workspace and s.id=p_site and (not p_owner or x.role='owner') for share;
 if not found then raise exception 'bz_forbidden';end if;
end;$$;

-- Admit CPU work before decoding, including failed files and retries.
create function public.bz_admit_media_processing(p_actor uuid,p_workspace uuid,p_site uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 insert into bizoveya_private.media_upload_rate(actor_id,window_start,admissions) values(p_actor,clock_timestamp(),0) on conflict(actor_id) do nothing;
 update bizoveya_private.media_upload_rate set window_start=clock_timestamp(),admissions=0,processing=0 where actor_id=p_actor and window_start<clock_timestamp()-interval '1 hour';
 if (select processing from bizoveya_private.media_upload_rate where actor_id=p_actor)>=36 then raise exception 'bz_upload_processing_limit';end if;
 update bizoveya_private.media_upload_rate set processing=processing+1 where actor_id=p_actor;
end;$$;

create function public.bz_prepare_media_upload(p_actor uuid,p_workspace uuid,p_site uuid,p_attempt uuid,p_media uuid,p_revision integer,p_descriptor jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare a bizoveya_private.media_upload_attempts%rowtype;m bizoveya_private.private_media%rowtype;next_ integer;path_ text;used_ bigint;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 if p_attempt is null or p_media is null or p_revision is null or p_revision<0 or not bizoveya_private.valid_private_media_descriptor(p_descriptor)
 or jsonb_typeof(p_descriptor->'bytes') is distinct from 'number' or jsonb_typeof(p_descriptor->'width') is distinct from 'number' or jsonb_typeof(p_descriptor->'height') is distinct from 'number' then raise exception 'bz_invalid_media';end if;
 perform 1 from auth.users where id=p_actor for update;
 select * into a from bizoveya_private.media_upload_attempts where id=p_attempt for update;
 if found then
  if a.actor_id<>p_actor or a.workspace_id<>p_workspace or a.site_id<>p_site or a.media_id<>p_media or a.expected_revision<>p_revision or a.descriptor<>p_descriptor then raise exception 'bz_conflict';end if;
  if a.state='committed' then return jsonb_build_object('state','committed','record',bizoveya_private.private_media_json(a.media_id,p_actor));end if;
  if a.state<>'pending' or a.created_at<clock_timestamp()-interval '2 minutes' then raise exception 'bz_upload_expired';end if;
  return jsonb_build_object('state','pending','path',a.object_path,'version',a.version);
 end if;
 select * into m from bizoveya_private.private_media where id=p_media for update;
 if m.id is not null and (m.creator_id<>p_actor or m.workspace_id<>p_workspace or m.site_id<>p_site or m.archived) then raise exception 'bz_media_unavailable';end if;
 if coalesce(m.revision,0)<>p_revision then raise exception 'bz_conflict';end if;
 if exists(select 1 from bizoveya_private.media_upload_attempts where media_id=p_media and state='pending') then raise exception 'bz_upload_busy';end if;
 insert into bizoveya_private.media_upload_rate(actor_id,window_start,admissions) values(p_actor,clock_timestamp(),0) on conflict(actor_id) do nothing;
 update bizoveya_private.media_upload_rate set window_start=clock_timestamp(),admissions=0,processing=0 where actor_id=p_actor and window_start<clock_timestamp()-interval '1 hour';
 if (select admissions from bizoveya_private.media_upload_rate where actor_id=p_actor)>=12 then raise exception 'bz_upload_rate_limit';end if;
 if (select count(*) from bizoveya_private.media_upload_attempts where actor_id=p_actor and state<>'committed')>=64 then raise exception 'bz_cleanup_required';end if;
 if m.id is null and (select count(*) from bizoveya_private.private_media where creator_id=p_actor and site_id=p_site)+(select count(*) from bizoveya_private.media_upload_attempts where actor_id=p_actor and site_id=p_site and expected_revision=0 and state='pending')>=32 then raise exception 'bz_media_limit';end if;
 next_:=coalesce(m.version,0)+1;if next_>20 then raise exception 'bz_media_limit';end if;
 select coalesce(sum((v.descriptor->>'bytes')::bigint),0) into used_ from bizoveya_private.private_media x join bizoveya_private.private_media_versions v on v.media_id=x.id where x.creator_id=p_actor and x.site_id=p_site;
 used_:=used_+(select coalesce(sum((descriptor->>'bytes')::bigint),0) from bizoveya_private.media_upload_attempts where actor_id=p_actor and site_id=p_site and state='pending');
 if used_+(p_descriptor->>'bytes')::bigint>167772160 then raise exception 'bz_media_byte_limit';end if;
 path_:=concat(p_actor,'/',p_workspace,'/',p_site,'/',p_media,'/',next_,'/',p_descriptor->>'sha256',case p_descriptor->>'mime' when 'image/png' then '.png' else '.jpg' end);
 if exists(select 1 from bizoveya_private.media_upload_attempts where object_path=path_) then raise exception 'bz_upload_path_used';end if;
 insert into bizoveya_private.media_upload_attempts(id,actor_id,workspace_id,site_id,media_id,expected_revision,version,descriptor,object_path) values(p_attempt,p_actor,p_workspace,p_site,p_media,p_revision,next_,p_descriptor,path_);
 update bizoveya_private.media_upload_rate set admissions=admissions+1 where actor_id=p_actor;
 return jsonb_build_object('state','pending','path',path_,'version',next_);
end;$$;

create function public.bz_commit_media_upload(p_actor uuid,p_workspace uuid,p_site uuid,p_attempt uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare a bizoveya_private.media_upload_attempts%rowtype;result_ jsonb;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 perform 1 from auth.users where id=p_actor for update;
 select * into a from bizoveya_private.media_upload_attempts where id=p_attempt for update;
 if a.id is null or a.actor_id<>p_actor or a.workspace_id<>p_workspace or a.site_id<>p_site then raise exception 'bz_media_unavailable';end if;
 if a.state='committed' then return bizoveya_private.private_media_json(a.media_id,p_actor);end if;
 if a.state<>'pending' or a.created_at<clock_timestamp()-interval '2 minutes' then raise exception 'bz_upload_expired';end if;
 result_:=public.bz_record_sanitized_private_media(p_actor,p_workspace,p_site,a.media_id,a.expected_revision,a.descriptor,a.object_path);
 update bizoveya_private.media_upload_attempts set state='committed' where id=a.id;
 return result_;
end;$$;

create function public.bz_private_media_object(p_actor uuid,p_workspace uuid,p_site uuid,p_media uuid,p_version integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site,false);
 select jsonb_build_object('path',v.object_path,'descriptor',v.descriptor) into result_ from bizoveya_private.private_media m join bizoveya_private.private_media_versions v on v.media_id=m.id
 where m.id=p_media and m.creator_id=p_actor and m.workspace_id=p_workspace and m.site_id=p_site and v.version=p_version;
 if result_ is null then raise exception 'bz_media_unavailable';end if;return result_;
end;$$;

-- Claim only old, uncommitted known attempts; never list/delete arbitrary bucket objects.
create function public.bz_claim_media_cleanup(p_actor uuid,p_workspace uuid,p_site uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 perform 1 from auth.users where id=p_actor for update;
 with candidates as (
  select a.id from bizoveya_private.media_upload_attempts a where a.actor_id=p_actor and a.workspace_id=p_workspace and a.site_id=p_site and a.state in('pending','cleaning') and a.created_at<clock_timestamp()-interval '10 minutes'
  and (a.cleanup_at is null or a.cleanup_at<clock_timestamp()-interval '2 minutes')
  and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path)
  order by a.created_at limit 8 for update skip locked
 ), claimed as (update bizoveya_private.media_upload_attempts a set state='cleaning',cleanup_at=clock_timestamp() from candidates c where a.id=c.id returning a.id,a.object_path)
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'path',object_path)),'[]'::jsonb) into result_ from claimed;
 return result_;
end;$$;
create function public.bz_finish_media_cleanup(p_actor uuid,p_workspace uuid,p_site uuid,p_attempt uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_service_actor(p_actor,p_workspace,p_site);
 delete from bizoveya_private.media_upload_attempts a where a.id=p_attempt and a.actor_id=p_actor and a.workspace_id=p_workspace and a.site_id=p_site and a.state='cleaning'
 and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path);
 if not found then raise exception 'bz_conflict';end if;
end;$$;

revoke all on function bizoveya_private.media_service_actor(uuid,uuid,uuid,boolean),public.bz_prepare_media_upload(uuid,uuid,uuid,uuid,uuid,integer,jsonb),public.bz_commit_media_upload(uuid,uuid,uuid,uuid),public.bz_private_media_object(uuid,uuid,uuid,uuid,integer),public.bz_claim_media_cleanup(uuid,uuid,uuid),public.bz_finish_media_cleanup(uuid,uuid,uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_media_upload(uuid,uuid,uuid,uuid,uuid,integer,jsonb),public.bz_commit_media_upload(uuid,uuid,uuid,uuid),public.bz_private_media_object(uuid,uuid,uuid,uuid,integer),public.bz_claim_media_cleanup(uuid,uuid,uuid),public.bz_finish_media_cleanup(uuid,uuid,uuid,uuid) to service_role;
revoke all on function public.bz_admit_media_processing(uuid,uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_admit_media_processing(uuid,uuid,uuid) to service_role;

-- Operator-only maintenance also handles bytes orphaned by authorized site/account cascades.
create function public.bz_claim_media_cleanup_global() returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 with candidates as (
  select a.id from bizoveya_private.media_upload_attempts a where a.created_at<clock_timestamp()-interval '10 minutes'
  and (a.cleanup_at is null or a.cleanup_at<clock_timestamp()-interval '2 minutes')
  and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path)
  order by a.created_at limit 8 for update skip locked
 ), claimed as (update bizoveya_private.media_upload_attempts a set state='cleaning',cleanup_at=clock_timestamp() from candidates c where a.id=c.id returning a.id,a.object_path)
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'path',object_path)),'[]'::jsonb) into result_ from claimed;
 return result_;
end;$$;
create function public.bz_finish_media_cleanup_global(p_attempt uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 delete from bizoveya_private.media_upload_attempts a where a.id=p_attempt and a.state='cleaning' and not exists(select 1 from bizoveya_private.private_media_versions v where v.object_path=a.object_path);
 if not found then raise exception 'bz_conflict';end if;
end;$$;
revoke all on function public.bz_claim_media_cleanup_global(),public.bz_finish_media_cleanup_global(uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_claim_media_cleanup_global(),public.bz_finish_media_cleanup_global(uuid) to service_role;
commit;
