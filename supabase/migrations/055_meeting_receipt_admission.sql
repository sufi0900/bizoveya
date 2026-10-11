-- Harden receipt identity and new-delivery admission; preserve existing migrations/history.
begin;
alter function public.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer) set schema bizoveya_private;
alter function bizoveya_private.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer) rename to claim_meeting_invitation_before_admission;
alter function public.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) set schema bizoveya_private;
alter function bizoveya_private.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) rename to finish_meeting_invitation_before_admission;

create function public.bz_claim_meeting_invitation(p_meeting_id uuid,p_role text,p_claim uuid,p_agent_id uuid,p_agent_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare a bizoveya_private.agency_records%rowtype;b bizoveya_private.meeting_invitation_batches%rowtype;r bizoveya_private.site_agent_rosters%rowtype;
begin
 if p_meeting_id is null or p_role is null or p_role not in('coordinator','content','quality') or p_claim is null or p_agent_id is null or p_agent_version is null or p_agent_version<1 then raise exception 'bz_invalid_meeting_receipt';end if;
 select * into a from bizoveya_private.agency_records where id=p_meeting_id;
 if a.id is null then raise exception 'bz_not_found';end if;
 -- Same site -> meeting -> roster order as owner invitation preparation.
 perform 1 from public.bizoveya_sites where id=a.site_id for share;if not found then raise exception 'bz_not_found';end if;
 select * into a from bizoveya_private.agency_records where id=p_meeting_id for share;
 select * into b from bizoveya_private.meeting_invitation_batches where meeting_id=p_meeting_id;
 if b.meeting_id is null then raise exception 'bz_not_found';end if;
 if not exists(select 1 from bizoveya_private.meeting_participant_invitations i where i.meeting_id=p_meeting_id and i.role=p_role and i.agent_id=p_agent_id and i.agent_version=p_agent_version) then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=a.site_id and m.user_id=b.actor_id and m.role='owner' for share of m;
 if not found then raise exception 'bz_forbidden';end if;
 if a.status is distinct from 'decision-recorded' or a.version is distinct from b.source_version+1 then raise exception 'bz_conflict';end if;
 select * into r from bizoveya_private.site_agent_rosters where site_id=a.site_id for share;
 if r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 if r.version is distinct from b.roster_version or not exists(select 1 from jsonb_array_elements(r.document->'agents') x where x->>'kind'=p_role and (x->>'agentId')::uuid=p_agent_id and (x->>'agentVersion')::integer=p_agent_version) then raise exception 'bz_site_roster_changed';end if;
 return bizoveya_private.claim_meeting_invitation_before_admission(p_meeting_id,p_role,p_claim,p_agent_id,p_agent_version);
end;$$;

create function public.bz_finish_meeting_invitation(p_meeting_id uuid,p_role text,p_claim uuid,p_agent_id uuid,p_agent_version integer,p_outcome text,p_note text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if p_meeting_id is null or p_role is null or p_role not in('coordinator','content','quality') or p_claim is null or p_agent_id is null or p_agent_version is null or p_agent_version<1 then raise exception 'bz_invalid_meeting_receipt';end if;
 -- A claimed delivery may finish truthfully after pause/revocation. This records receipt only.
 -- The original function still enforces exact identity, claim expiry, outcome, note and quota.
 return bizoveya_private.finish_meeting_invitation_before_admission(p_meeting_id,p_role,p_claim,p_agent_id,p_agent_version,p_outcome,p_note);
end;$$;
revoke all on function bizoveya_private.claim_meeting_invitation_before_admission(uuid,text,uuid,uuid,integer),bizoveya_private.finish_meeting_invitation_before_admission(uuid,text,uuid,uuid,integer,text,text),public.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer),public.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) from public,anon,authenticated,service_role;
grant execute on function public.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer),public.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) to service_role;
commit;
