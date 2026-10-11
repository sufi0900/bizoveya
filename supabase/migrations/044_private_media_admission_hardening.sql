-- Repair 043 without rewriting delivered migration history. No upload activation.
begin;
alter function public.bz_record_sanitized_private_media(uuid,uuid,uuid,uuid,integer,jsonb,text) rename to bz_record_sanitized_private_media_043;
revoke all on function public.bz_record_sanitized_private_media_043(uuid,uuid,uuid,uuid,integer,jsonb,text) from public,anon,authenticated,service_role;
create function public.bz_record_sanitized_private_media(p_actor_id uuid,p_workspace_id uuid,p_site_id uuid,p_media_id uuid,p_expected_revision integer,p_descriptor jsonb,p_object_path text) returns jsonb language plpgsql security definer set search_path='' as $$
declare m bizoveya_private.private_media%rowtype;used_ bigint;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden' using errcode='42501';end if;
 if p_actor_id is null or p_media_id is null or p_expected_revision is null or p_expected_revision<0 or not bizoveya_private.valid_private_media_descriptor(p_descriptor) then raise exception 'bz_invalid_media';end if;
 if jsonb_typeof(p_descriptor->'bytes') is distinct from 'number' or jsonb_typeof(p_descriptor->'width') is distinct from 'number' or jsonb_typeof(p_descriptor->'height') is distinct from 'number' then raise exception 'bz_invalid_media';end if;
 -- Serialize every creator admission, including first inserts with no existing media row.
 perform 1 from auth.users where id=p_actor_id and deleted_at is null for update;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites s join public.bizoveya_memberships x on x.workspace_id=s.workspace_id where s.id=p_site_id and s.workspace_id=p_workspace_id and x.user_id=p_actor_id and x.role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 select * into m from bizoveya_private.private_media where id=p_media_id for update;
 if m.id is not null and (m.creator_id<>p_actor_id or m.workspace_id<>p_workspace_id or m.site_id<>p_site_id or m.archived) then raise exception 'bz_media_unavailable';end if;
 if coalesce(m.revision,0) is distinct from p_expected_revision then raise exception 'bz_conflict';end if;
 select coalesce(sum((v.descriptor->>'bytes')::bigint),0) into used_ from bizoveya_private.private_media m2 join bizoveya_private.private_media_versions v on v.media_id=m2.id where m2.creator_id=p_actor_id and m2.site_id=p_site_id;
 if used_+(p_descriptor->>'bytes')::bigint>167772160 then raise exception 'bz_media_byte_limit';end if;
 return public.bz_record_sanitized_private_media_043(p_actor_id,p_workspace_id,p_site_id,p_media_id,p_expected_revision,p_descriptor,p_object_path);
end;$$;
create or replace function public.bz_private_media(p_workspace_id uuid,p_site_id uuid,p_media_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id);
 perform 1 from bizoveya_private.private_media where id=p_media_id and creator_id=actor_ and workspace_id=p_workspace_id and site_id=p_site_id;if not found then raise exception 'bz_media_unavailable';end if;
 return bizoveya_private.private_media_json(p_media_id,actor_);
end;$$;
alter function public.bz_review_private_media(uuid,uuid,uuid,integer,integer,text,text) rename to bz_review_private_media_043;
revoke all on function public.bz_review_private_media_043(uuid,uuid,uuid,integer,integer,text,text) from public,anon,authenticated,service_role;
create function public.bz_review_private_media(p_workspace_id uuid,p_site_id uuid,p_media_id uuid,p_expected_revision integer,p_version integer,p_decision text,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 if p_decision is null or p_decision not in('accepted','rejected') or p_version is null or p_version not between 1 and 20 or not bizoveya_private.valid_visual_text(to_jsonb(p_reason),500) or p_reason~'[\x01-\x1F]' then raise exception 'bz_invalid_media';end if;
 return public.bz_review_private_media_043(p_workspace_id,p_site_id,p_media_id,p_expected_revision,p_version,p_decision,p_reason);
end;$$;
-- Reviewer identity is already bound to creator via CHECK and parent FK. Avoid redundant RESTRICT blocking authorized account cascades.
alter table bizoveya_private.private_media_versions drop constraint private_media_versions_reviewed_by_fkey;
create function bizoveya_private.guard_media_version() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='DELETE' then
  if not exists(select 1 from bizoveya_private.private_media where id=old.media_id) then return old;end if;
  raise exception 'bz_media_immutable';
 end if;
 if new.media_id is distinct from old.media_id or new.creator_id is distinct from old.creator_id or new.version is distinct from old.version or new.descriptor is distinct from old.descriptor or new.object_path is distinct from old.object_path or new.created_at is distinct from old.created_at or old.review_decision is not null or new.review_decision is null then raise exception 'bz_media_immutable';end if;
 return new;
end;$$;
create trigger private_media_version_immutable before update or delete on bizoveya_private.private_media_versions for each row execute function bizoveya_private.guard_media_version();
revoke all on function public.bz_record_sanitized_private_media(uuid,uuid,uuid,uuid,integer,jsonb,text),public.bz_review_private_media(uuid,uuid,uuid,integer,integer,text,text),bizoveya_private.guard_media_version() from public,anon,authenticated,service_role;
grant execute on function public.bz_record_sanitized_private_media(uuid,uuid,uuid,uuid,integer,jsonb,text) to service_role;
grant execute on function public.bz_review_private_media(uuid,uuid,uuid,integer,integer,text,text) to authenticated;
commit;
