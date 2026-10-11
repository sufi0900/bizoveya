-- Operator visibility for deterministic participant packet delivery. No AI execution.
begin;
create function public.bz_admin_meeting_delivery_queue() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object(
  'meetingId',b.meeting_id,'siteId',a.site_id,'meetingVersion',a.version,'sourceVersion',b.source_version,'rosterVersion',b.roster_version,
  'agenda',a.document->>'agenda','createdAt',b.created_at,
  'blocked',a.status<>'decision-recorded' or a.version<>b.source_version+1 or r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb or r.version is distinct from b.roster_version or exists(select 1 from bizoveya_private.meeting_participant_invitations x where x.meeting_id=b.meeting_id and not exists(select 1 from jsonb_array_elements(r.document->'agents') y where y->>'kind'=x.role and (y->>'agentId')::uuid=x.agent_id and (y->>'agentVersion')::integer=x.agent_version)),
  'participants',coalesce((select jsonb_agg(jsonb_build_object('role',i.role,'agentId',i.agent_id,'agentVersion',i.agent_version,'state',i.state,'claimId',i.claim,'leaseActive',coalesce(i.state='claimed' and i.claim_expires_at>statement_timestamp(),false),'note',i.note) order by i.role) from bizoveya_private.meeting_participant_invitations i where i.meeting_id=b.meeting_id),'[]'::jsonb)
 ) order by b.created_at desc,b.meeting_id)
 from (select ib.* from bizoveya_private.meeting_invitation_batches ib join bizoveya_private.agency_records ar on ar.id=ib.meeting_id join public.bizoveya_sites s on s.id=ar.site_id join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner' where ib.actor_id=auth.uid() order by ib.created_at desc,ib.meeting_id limit 100)b
 join bizoveya_private.agency_records a on a.id=b.meeting_id left join bizoveya_private.site_agent_rosters r on r.site_id=a.site_id),'[]'::jsonb);
end;$$;
revoke all on function public.bz_admin_meeting_delivery_queue() from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_meeting_delivery_queue() to authenticated;
commit;
