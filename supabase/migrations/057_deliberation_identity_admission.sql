-- Reject malformed identities at the public planning boundary; retain 056 and saved plans.
begin;
alter function public.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) set schema bizoveya_private;
alter function bizoveya_private.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) rename to prepare_deliberation_before_identity;
create function public.bz_prepare_meeting_deliberation(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare meeting_ uuid;plan_ uuid;
begin
 -- Keep authorization ahead of validation, as in the original owner-only boundary.
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or jsonb_typeof(p_input->'id') is distinct from 'string' or jsonb_typeof(p_input->'planId') is distinct from 'string' then raise exception 'bz_invalid_deliberation_plan';end if;
 begin meeting_:=(p_input->>'id')::uuid;plan_:=(p_input->>'planId')::uuid;exception when invalid_text_representation then raise exception 'bz_invalid_deliberation_plan';end;
 if meeting_ is null or plan_ is null or meeting_=plan_ then raise exception 'bz_invalid_deliberation_plan';end if;
 return bizoveya_private.prepare_deliberation_before_identity(p_workspace_id,p_site_id,p_input);
end;$$;
revoke all on function bizoveya_private.prepare_deliberation_before_identity(uuid,uuid,jsonb),public.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) to authenticated;
commit;
