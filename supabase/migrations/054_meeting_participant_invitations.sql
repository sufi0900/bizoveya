-- Versioned private meeting invitations and explicit worker receipts. No provider or publication side effects.
begin;
create table bizoveya_private.meeting_invitation_batches(
 meeting_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 request_id uuid not null references bizoveya_private.agency_records(id) on delete cascade,
 source_version integer not null check(source_version between 1 and 99), roster_version integer not null check(roster_version between 1 and 50),
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.meeting_participant_invitations(
 meeting_id uuid not null references bizoveya_private.meeting_invitation_batches(meeting_id) on delete cascade,
 role text not null check(role in('coordinator','content','quality')), agent_id uuid not null, agent_version integer not null check(agent_version>0),
 state text not null default 'invited' check(state in('invited','claimed','acknowledged','declined')),
 claim uuid, claim_expires_at timestamptz, responded_at timestamptz, note text,
 primary key(meeting_id,role), unique(meeting_id,agent_id)
);
create table bizoveya_private.meeting_participant_receipts(
 id bigint generated always as identity primary key, meeting_id uuid not null, role text not null,
 action text not null check(action in('invited','claimed','claim-expired','acknowledged','declined')),
 claim uuid, agent_id uuid not null, agent_version integer not null, note text, created_at timestamptz not null default clock_timestamp(),
 foreign key(meeting_id,role) references bizoveya_private.meeting_participant_invitations(meeting_id,role) on delete cascade
);
alter table bizoveya_private.meeting_invitation_batches enable row level security;
alter table bizoveya_private.meeting_participant_invitations enable row level security;
alter table bizoveya_private.meeting_participant_receipts enable row level security;
revoke all on bizoveya_private.meeting_invitation_batches,bizoveya_private.meeting_participant_invitations,bizoveya_private.meeting_participant_receipts from public,anon,authenticated,service_role;
create trigger meeting_invitation_batch_immutable before update on bizoveya_private.meeting_invitation_batches for each row execute function bizoveya_private.agency_handoff_immutable();
create trigger meeting_participant_receipt_immutable before update on bizoveya_private.meeting_participant_receipts for each row execute function bizoveya_private.agency_handoff_immutable();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_invitations;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_invitations(p_id)||jsonb_build_object('meetingInvitations',(
  select jsonb_build_object('meetingId',b.meeting_id,'requestId',b.request_id,'sourceVersion',b.source_version,'rosterVersion',b.roster_version,'actorId',b.actor_id,'createdAt',b.created_at,
   'participants',coalesce((select jsonb_agg(jsonb_build_object('role',i.role,'agentId',i.agent_id,'agentVersion',i.agent_version,'state',i.state,'claimExpiresAt',i.claim_expires_at,'respondedAt',i.responded_at,'note',i.note) order by case i.role when 'coordinator' then 1 when 'content' then 2 else 3 end) from bizoveya_private.meeting_participant_invitations i where i.meeting_id=b.meeting_id),'[]'::jsonb))
  from bizoveya_private.meeting_invitation_batches b where b.meeting_id=p_id));
$$;

create function public.bz_invite_meeting_participants(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;meeting_ uuid;a bizoveya_private.agency_records%rowtype;d bizoveya_private.meeting_request_distributions%rowtype;b bizoveya_private.meeting_invitation_batches%rowtype;r bizoveya_private.site_agent_rosters%rowtype;role_ text;chosen_ jsonb;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>3 or not(p_input ?& array['id','expectedVersion','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or (p_input->>'expectedVersion')::integer not between 1 and 99 then raise exception 'bz_invalid_meeting_invitation';end if;
 begin meeting_:=(p_input->>'id')::uuid;exception when others then raise exception 'bz_invalid_meeting_invitation';end;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into b from bizoveya_private.meeting_invitation_batches where meeting_id=meeting_;
 if b.meeting_id is not null then
  if b.source_version=(p_input->>'expectedVersion')::integer and b.actor_id=actor_ then return bizoveya_private.agency_json(meeting_);end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'meeting' or a.status<>'decision-recorded' then raise exception 'bz_meeting_distribution_required';end if;
 if a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 if a.version>=100 then raise exception 'bz_agency_limit';end if;
 select * into d from bizoveya_private.meeting_request_distributions where meeting_id=meeting_;if d.meeting_id is null then raise exception 'bz_meeting_distribution_required';end if;
 select * into r from bizoveya_private.site_agent_rosters where site_id=p_site_id for share;
 if r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 insert into bizoveya_private.meeting_invitation_batches(meeting_id,request_id,source_version,roster_version,actor_id) values(meeting_,d.request_id,a.version,r.version,actor_) returning * into b;
 for role_ in select value#>>'{}' from jsonb_array_elements(a.document->'participants') loop
  select value into chosen_ from jsonb_array_elements(r.document->'agents') where value->>'kind'=role_;
  if chosen_ is null then raise exception 'bz_site_roster_changed';end if;
  insert into bizoveya_private.meeting_participant_invitations(meeting_id,role,agent_id,agent_version) values(meeting_,role_,(chosen_->>'agentId')::uuid,(chosen_->>'agentVersion')::integer);
  insert into bizoveya_private.meeting_participant_receipts(meeting_id,role,action,agent_id,agent_version,note) values(meeting_,role_,'invited',(chosen_->>'agentId')::uuid,(chosen_->>'agentVersion')::integer,'Private packet prepared; receipt not yet acknowledged.');
 end loop;
 update bizoveya_private.agency_records set version=version+1 where id=meeting_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(meeting_,a.version+1,'invite-participants','Versioned private packets prepared for pinned roles; no attendance, reasoning or execution recorded.',actor_);
 return bizoveya_private.agency_json(meeting_);
end;$$;

create function public.bz_claim_meeting_invitation(p_meeting_id uuid,p_role text,p_claim uuid,p_agent_id uuid,p_agent_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare i bizoveya_private.meeting_participant_invitations%rowtype;b bizoveya_private.meeting_invitation_batches%rowtype;d bizoveya_private.meeting_request_distributions%rowtype;
begin
 if p_meeting_id is null or p_claim is null or p_agent_id is null or p_role is null or p_role not in('coordinator','content','quality') or p_agent_version is null or p_agent_version<1 then raise exception 'bz_invalid_meeting_receipt';end if;
 select * into i from bizoveya_private.meeting_participant_invitations where meeting_id=p_meeting_id and role=p_role for update;
 if i.meeting_id is null then raise exception 'bz_not_found';end if;
 if i.agent_id<>p_agent_id or i.agent_version<>p_agent_version then raise exception 'bz_forbidden';end if;
 if i.state='claimed' and i.claim=p_claim and i.claim_expires_at>statement_timestamp() then null;
 elsif i.state in('acknowledged','declined') then raise exception 'bz_conflict';
 elsif i.state='claimed' and i.claim_expires_at>statement_timestamp() then raise exception 'bz_conflict';
 else
  if (select count(*) from bizoveya_private.meeting_participant_receipts where meeting_id=i.meeting_id and role=i.role)>=18 then raise exception 'bz_meeting_receipt_limit';end if;
  if i.state='claimed' then insert into bizoveya_private.meeting_participant_receipts(meeting_id,role,action,claim,agent_id,agent_version,note) values(i.meeting_id,i.role,'claim-expired',i.claim,i.agent_id,i.agent_version,'Expired delivery lease released before retry.');end if;
  update bizoveya_private.meeting_participant_invitations set state='claimed',claim=p_claim,claim_expires_at=statement_timestamp()+interval '5 minutes',responded_at=null,note=null where meeting_id=p_meeting_id and role=p_role returning * into i;
  insert into bizoveya_private.meeting_participant_receipts(meeting_id,role,action,claim,agent_id,agent_version,note) values(i.meeting_id,i.role,'claimed',i.claim,i.agent_id,i.agent_version,'Pinned worker claimed the private packet.');
 end if;
 select * into b from bizoveya_private.meeting_invitation_batches where meeting_id=p_meeting_id;select * into d from bizoveya_private.meeting_request_distributions where meeting_id=p_meeting_id;
 return jsonb_build_object('meetingId',b.meeting_id,'requestId',b.request_id,'sourceVersion',b.source_version,'rosterVersion',b.roster_version,'role',i.role,'agentId',i.agent_id,'agentVersion',i.agent_version,'claimExpiresAt',i.claim_expires_at,'agenda',d.agenda,'decision',d.decision,'instruction',d.instruction,'command',d.command);
end;$$;

create function public.bz_finish_meeting_invitation(p_meeting_id uuid,p_role text,p_claim uuid,p_agent_id uuid,p_agent_version integer,p_outcome text,p_note text) returns jsonb language plpgsql security definer set search_path='' as $$
declare i bizoveya_private.meeting_participant_invitations%rowtype;
begin
 if p_outcome is null or p_outcome not in('acknowledged','declined') or p_note is null or btrim(p_note)='' or length(p_note)>500 or p_note~'[\x01-\x08\x0B\x0C\x0E-\x1F]' then raise exception 'bz_invalid_meeting_receipt';end if;
 select * into i from bizoveya_private.meeting_participant_invitations where meeting_id=p_meeting_id and role=p_role for update;
 if i.meeting_id is null then raise exception 'bz_not_found';end if;
 if i.agent_id<>p_agent_id or i.agent_version<>p_agent_version then raise exception 'bz_forbidden';end if;
 if i.state=p_outcome and i.claim=p_claim and i.note=p_note then return bizoveya_private.agency_json(p_meeting_id)->'meetingInvitations';end if;
 if i.state<>'claimed' or i.claim is distinct from p_claim or i.claim_expires_at<=statement_timestamp() then raise exception 'bz_conflict';end if;
 if (select count(*) from bizoveya_private.meeting_participant_receipts where meeting_id=i.meeting_id and role=i.role)>=20 then raise exception 'bz_meeting_receipt_limit';end if;
 update bizoveya_private.meeting_participant_invitations set state=p_outcome,responded_at=clock_timestamp(),note=p_note where meeting_id=p_meeting_id and role=p_role returning * into i;
 insert into bizoveya_private.meeting_participant_receipts(meeting_id,role,action,claim,agent_id,agent_version,note) values(i.meeting_id,i.role,p_outcome,i.claim,i.agent_id,i.agent_version,p_note);
 return bizoveya_private.agency_json(p_meeting_id)->'meetingInvitations';
end;$$;

revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_invitations(uuid),public.bz_invite_meeting_participants(uuid,uuid,jsonb),public.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer),public.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) from public,anon,authenticated,service_role;
grant execute on function public.bz_invite_meeting_participants(uuid,uuid,jsonb) to authenticated;
grant execute on function public.bz_claim_meeting_invitation(uuid,text,uuid,uuid,integer),public.bz_finish_meeting_invitation(uuid,text,uuid,uuid,integer,text,text) to service_role;
commit;
