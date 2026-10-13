-- Turn3 review repair: permit a service-only no-record lookup before new admission.
-- Existing committed/pending/failed generated attempts remain unchanged.
begin;
create or replace function public.bz_resume_generated_media(p_request uuid,p_actor uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;a bizoveya_private.generated_media_attempts;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 if p_request is null or p_actor is null then raise exception 'bz_media_unavailable';end if;
 select * into r from bizoveya_private.media_requests where id=p_request;
 if r.id is null then return jsonb_build_object('state','unavailable');end if;
 if r.actor_id is distinct from p_actor or r.capability<>'image' then raise exception 'bz_media_unavailable';end if;
 select * into a from bizoveya_private.generated_media_attempts where request_id=r.id;
 if a.request_id is null then return jsonb_build_object('state','unavailable');end if;
 if a.state='committed' then return jsonb_build_object('state','committed','record',bizoveya_private.private_media_json(a.media_id,p_actor),'request',bizoveya_private.media_request_json(r.id));end if;
 return jsonb_build_object('state',a.state,'path',a.object_path,'descriptor',a.descriptor,'request',bizoveya_private.media_request_json(r.id));
end;$$;
revoke all on function public.bz_resume_generated_media(uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_resume_generated_media(uuid,uuid) to service_role;
commit;
