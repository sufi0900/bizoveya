-- P04.3.4.4b: private sanitized-media storage boundary. No upload UI, rendering or provider calls.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('campaign-private-media','campaign-private-media',false,5242880,array['image/png','image/jpeg'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
alter table public.bizoveya_sites add constraint bizoveya_sites_id_workspace_unique unique(id,workspace_id);

create function bizoveya_private.valid_private_media_descriptor(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare rights_ jsonb;begin
 if p is null or jsonb_typeof(p) is distinct from 'object' or octet_length(p::text)>2048 then return false;end if;
 if (select count(*) from jsonb_object_keys(p))<>9 or not(p ?& array['schema','mime','bytes','width','height','sha256','alt','origin','rights']) then return false;end if;
 if p->>'schema' is distinct from 'private-media-descriptor-v1' or p->>'mime' not in('image/png','image/jpeg') or p->>'origin' is distinct from 'user-upload' then return false;end if;
 if (p->>'bytes')!~ '^[0-9]+$' or (p->>'bytes')::bigint not between 1 and 5242880 then return false;end if;
 if (p->>'width')!~ '^[0-9]+$' or (p->>'height')!~ '^[0-9]+$' or (p->>'width')::bigint not between 1 and 4096 or (p->>'height')::bigint not between 1 and 4096 or (p->>'width')::bigint*(p->>'height')::bigint>12000000 then return false;end if;
 if (p->>'sha256')!~ '^[a-f0-9]{64}$' or not bizoveya_private.valid_visual_text(p->'alt',300) or (p->>'alt')~'[\x01-\x1F]' then return false;end if;
 rights_:=p->'rights';
 if jsonb_typeof(rights_) is distinct from 'object' or (select count(*) from jsonb_object_keys(rights_))<>3 or not(rights_ ?& array['basis','evidence','attested']) or rights_->>'basis' not in('own-work','licensed','permission') or rights_->'attested'<>'true'::jsonb or not bizoveya_private.valid_visual_text(rights_->'evidence',500) or (rights_->>'evidence')~'[\x01-\x1F]' then return false;end if;
 return true;
exception when others then return false;end;$$;

create table bizoveya_private.private_media(
 id uuid primary key,creator_id uuid not null references auth.users(id) on delete cascade,
 workspace_id uuid not null references public.bizoveya_workspaces(id) on delete cascade,
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 revision integer not null default 1 check(revision>0),version integer not null default 1 check(version between 1 and 20),
 archived boolean not null default false,created_at timestamptz not null default clock_timestamp(),
 unique(id,creator_id),foreign key(site_id,workspace_id) references public.bizoveya_sites(id,workspace_id) on delete cascade
);
create index private_media_creator_site on bizoveya_private.private_media(creator_id,site_id,id);
create table bizoveya_private.private_media_versions(
 media_id uuid not null,creator_id uuid not null,version integer not null check(version between 1 and 20),
 descriptor jsonb not null check(bizoveya_private.valid_private_media_descriptor(descriptor)),
 object_path text not null check(object_path~'^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}/[1-9][0-9]?/[a-f0-9]{64}\.(png|jpg)$'),
 review_decision text check(review_decision in('accepted','rejected')),review_reason text check(review_reason is null or length(btrim(review_reason)) between 1 and 500),
 reviewed_by uuid references auth.users(id) on delete restrict,reviewed_at timestamptz,
 created_at timestamptz not null default clock_timestamp(),primary key(media_id,version),
 foreign key(media_id,creator_id) references bizoveya_private.private_media(id,creator_id) on delete cascade,
 check((review_decision is null and review_reason is null and reviewed_by is null and reviewed_at is null) or (review_decision is not null and review_reason is not null and reviewed_by=creator_id and reviewed_at is not null))
);
alter table bizoveya_private.private_media enable row level security;
alter table bizoveya_private.private_media_versions enable row level security;
revoke all on bizoveya_private.private_media,bizoveya_private.private_media_versions from public,anon,authenticated,service_role;
-- No storage.objects policy is added: browsers cannot upload/read this bucket directly.

create function bizoveya_private.private_media_json(p_id uuid,p_actor uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('schema','private-media-record-v1','mediaId',m.id,'creatorId',m.creator_id,'workspaceId',m.workspace_id,'siteId',m.site_id,'revision',m.revision,'archived',m.archived,'versions',
  coalesce((select jsonb_agg(jsonb_build_object('version',v.version,'descriptor',v.descriptor,'createdAt',to_char(v.created_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),'review',case when v.review_decision is null then 'null'::jsonb else jsonb_build_object('decision',v.review_decision,'actorId',v.reviewed_by,'reason',v.review_reason,'reviewedAt',to_char(v.reviewed_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')) end) order by v.version) from bizoveya_private.private_media_versions v where v.media_id=m.id),'[]'::jsonb))
 from bizoveya_private.private_media m where m.id=p_id and m.creator_id=p_actor;
$$;
create function bizoveya_private.media_actor(p_workspace_id uuid,p_site_id uuid,p_owner boolean default false) returns uuid language plpgsql security definer set search_path='' as $$
declare actor_ uuid:=auth.uid();begin
 perform 1 from auth.users u join public.bizoveya_memberships m on m.user_id=u.id join public.bizoveya_sites s on s.workspace_id=m.workspace_id where u.id=actor_ and u.deleted_at is null and m.workspace_id=p_workspace_id and s.id=p_site_id and (not p_owner or m.role='owner') for share;
 if not found then raise exception 'bz_forbidden' using errcode='42501';end if;return actor_;
end;$$;
create function public.bz_private_media(p_workspace_id uuid,p_site_id uuid,p_media_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;result_ jsonb;begin actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id);result_:=bizoveya_private.private_media_json(p_media_id,actor_);if result_ is null then raise exception 'bz_media_unavailable';end if;return result_;end;$$;
create function public.bz_private_media_inventory(p_workspace_id uuid,p_site_id uuid,p_include_archived boolean default false) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;begin actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id);return coalesce((select jsonb_agg(jsonb_build_object('mediaId',m.id,'revision',m.revision,'version',m.version,'archived',m.archived,'descriptor',v.descriptor,'reviewDecision',v.review_decision) order by m.created_at desc,m.id) from bizoveya_private.private_media m join bizoveya_private.private_media_versions v on v.media_id=m.id and v.version=m.version where m.creator_id=actor_ and m.workspace_id=p_workspace_id and m.site_id=p_site_id and (p_include_archived or not m.archived)),'[]'::jsonb);end;$$;

-- Only a trusted server using service_role may call this after decoding, re-encoding and hashing bytes.
create function public.bz_record_sanitized_private_media(p_actor_id uuid,p_workspace_id uuid,p_site_id uuid,p_media_id uuid,p_expected_revision integer,p_descriptor jsonb,p_object_path text) returns jsonb language plpgsql security definer set search_path='' as $$
declare m bizoveya_private.private_media%rowtype;next_ integer;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden' using errcode='42501';end if;
 if p_actor_id is null or p_media_id is null or p_expected_revision is null or p_expected_revision<0 or not bizoveya_private.valid_private_media_descriptor(p_descriptor) then raise exception 'bz_invalid_media';end if;
 perform 1 from auth.users u join public.bizoveya_memberships x on x.user_id=u.id join public.bizoveya_sites s on s.workspace_id=x.workspace_id where u.id=p_actor_id and u.deleted_at is null and x.workspace_id=p_workspace_id and s.id=p_site_id for share;if not found then raise exception 'bz_forbidden';end if;
 if p_object_path is distinct from concat(p_actor_id,'/',p_workspace_id,'/',p_site_id,'/',p_media_id,'/',case when p_expected_revision=0 then 1 else (select version+1 from bizoveya_private.private_media where id=p_media_id) end,'/',p_descriptor->>'sha256',case p_descriptor->>'mime' when 'image/png' then '.png' else '.jpg' end) then raise exception 'bz_invalid_media';end if;
 select * into m from bizoveya_private.private_media where id=p_media_id for update;
 if m.id is not null and (m.creator_id<>p_actor_id or m.workspace_id<>p_workspace_id or m.site_id<>p_site_id or m.archived) then raise exception 'bz_media_unavailable';end if;
 if coalesce(m.revision,0)<>p_expected_revision then raise exception 'bz_conflict';end if;
 if m.id is null then
  if (select count(*) from bizoveya_private.private_media where creator_id=p_actor_id and site_id=p_site_id)>=32 then raise exception 'bz_media_limit';end if;
  insert into bizoveya_private.private_media(id,creator_id,workspace_id,site_id) values(p_media_id,p_actor_id,p_workspace_id,p_site_id);next_:=1;
 else if m.version>=20 then raise exception 'bz_media_limit';end if;next_:=m.version+1;update bizoveya_private.private_media set version=next_,revision=revision+1 where id=m.id;end if;
 insert into bizoveya_private.private_media_versions(media_id,creator_id,version,descriptor,object_path) values(p_media_id,p_actor_id,next_,p_descriptor,p_object_path);
 return bizoveya_private.private_media_json(p_media_id,p_actor_id);
end;$$;
create function public.bz_review_private_media(p_workspace_id uuid,p_site_id uuid,p_media_id uuid,p_expected_revision integer,p_version integer,p_decision text,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;m bizoveya_private.private_media%rowtype;begin actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);select * into m from bizoveya_private.private_media where id=p_media_id and creator_id=actor_ and workspace_id=p_workspace_id and site_id=p_site_id for update;if m.id is null or m.archived then raise exception 'bz_media_unavailable';end if;if m.revision is distinct from p_expected_revision then raise exception 'bz_conflict';end if;if p_decision not in('accepted','rejected') or length(btrim(p_reason)) not between 1 and 500 then raise exception 'bz_invalid_media';end if;update bizoveya_private.private_media_versions set review_decision=p_decision,review_reason=btrim(p_reason),reviewed_by=actor_,reviewed_at=clock_timestamp() where media_id=m.id and version=p_version and review_decision is null;if not found then raise exception 'bz_conflict';end if;update bizoveya_private.private_media set revision=revision+1 where id=m.id;return bizoveya_private.private_media_json(m.id,actor_);end;$$;
create function public.bz_archive_private_media(p_workspace_id uuid,p_site_id uuid,p_media_id uuid,p_expected_revision integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;m bizoveya_private.private_media%rowtype;begin actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);select * into m from bizoveya_private.private_media where id=p_media_id and creator_id=actor_ and workspace_id=p_workspace_id and site_id=p_site_id for update;if m.id is null then raise exception 'bz_media_unavailable';end if;if m.revision is distinct from p_expected_revision then raise exception 'bz_conflict';end if;if not m.archived then update bizoveya_private.private_media set archived=true,revision=revision+1 where id=m.id;end if;return bizoveya_private.private_media_json(m.id,actor_);end;$$;

revoke all on function bizoveya_private.valid_private_media_descriptor(jsonb),bizoveya_private.private_media_json(uuid,uuid),bizoveya_private.media_actor(uuid,uuid,boolean),public.bz_private_media(uuid,uuid,uuid),public.bz_private_media_inventory(uuid,uuid,boolean),public.bz_record_sanitized_private_media(uuid,uuid,uuid,uuid,integer,jsonb,text),public.bz_review_private_media(uuid,uuid,uuid,integer,integer,text,text),public.bz_archive_private_media(uuid,uuid,uuid,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_private_media(uuid,uuid,uuid),public.bz_private_media_inventory(uuid,uuid,boolean),public.bz_review_private_media(uuid,uuid,uuid,integer,integer,text,text),public.bz_archive_private_media(uuid,uuid,uuid,integer) to authenticated;
grant execute on function public.bz_record_sanitized_private_media(uuid,uuid,uuid,uuid,integer,jsonb,text) to service_role;
commit;
