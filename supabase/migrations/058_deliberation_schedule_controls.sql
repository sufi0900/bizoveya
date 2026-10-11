-- Owner-reviewed scheduling intent only. No worker admission, provider call or spending.
begin;
create table bizoveya_private.meeting_deliberation_schedules(
 plan_id uuid primary key references bizoveya_private.meeting_deliberation_plans(id) on delete cascade,
 version integer not null check(version between 1 and 100), state text not null check(state in('ready','paused','cancelled')),
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp(), updated_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.meeting_deliberation_schedule_events(
 plan_id uuid not null references bizoveya_private.meeting_deliberation_schedules(plan_id) on delete cascade,
 version integer not null check(version between 1 and 100), operation_id uuid not null unique, command jsonb not null,
 state text not null check(state in('ready','paused','cancelled')), actor_id uuid not null, created_at timestamptz not null default clock_timestamp(),
 primary key(plan_id,version)
);
alter table bizoveya_private.meeting_deliberation_schedules enable row level security;
alter table bizoveya_private.meeting_deliberation_schedule_events enable row level security;
revoke all on bizoveya_private.meeting_deliberation_schedules,bizoveya_private.meeting_deliberation_schedule_events from public,anon,authenticated,service_role;
create trigger meeting_deliberation_schedule_event_immutable before update on bizoveya_private.meeting_deliberation_schedule_events for each row execute function bizoveya_private.agency_handoff_immutable();
alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_schedule;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_schedule(p_id)||jsonb_build_object('meetingSchedule',(
  select jsonb_build_object('planId',s.plan_id,'version',s.version,'state',s.state,'actorId',s.actor_id,'createdAt',s.created_at,'updatedAt',s.updated_at,
  'events',coalesce((select jsonb_agg(jsonb_build_object('version',e.version,'action',e.command->>'action','state',e.state,'reason',e.command->>'reason','actorId',e.actor_id,'createdAt',e.created_at) order by e.version) from bizoveya_private.meeting_deliberation_schedule_events e where e.plan_id=s.plan_id),'[]'::jsonb))
  from bizoveya_private.meeting_deliberation_schedules s join bizoveya_private.meeting_deliberation_plans p on p.id=s.plan_id where p.meeting_id=p_id));
$$;
create function public.bz_control_meeting_schedule(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid; meeting_ uuid; plan_ uuid; operation_ uuid; action_ text; state_ text; version_ integer;
 a bizoveya_private.agency_records%rowtype; p bizoveya_private.meeting_deliberation_plans%rowtype;
 s bizoveya_private.meeting_deliberation_schedules%rowtype; e bizoveya_private.meeting_deliberation_schedule_events%rowtype; r bizoveya_private.site_agent_rosters%rowtype;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>9 or not(p_input ?& array['id','planId','operationId','expectedMeetingVersion','expectedVersion','action','reason','reviewed','intentOnly']) or p_input->'reviewed' is distinct from 'true'::jsonb or p_input->'intentOnly' is distinct from 'true'::jsonb then raise exception 'bz_invalid_meeting_schedule';end if;
 if jsonb_typeof(p_input->'id') is distinct from 'string' or jsonb_typeof(p_input->'planId') is distinct from 'string' or jsonb_typeof(p_input->'operationId') is distinct from 'string' then raise exception 'bz_invalid_meeting_schedule';end if;
 begin meeting_:=(p_input->>'id')::uuid;plan_:=(p_input->>'planId')::uuid;operation_:=(p_input->>'operationId')::uuid;exception when others then raise exception 'bz_invalid_meeting_schedule';end;
 if meeting_ is null or plan_ is null or operation_ is null or meeting_=plan_ then raise exception 'bz_invalid_meeting_schedule';end if;
 if jsonb_typeof(p_input->'expectedMeetingVersion') is distinct from 'number' or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedMeetingVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or (p_input->>'expectedMeetingVersion')::integer not between 1 and 100 or (p_input->>'expectedVersion')::integer not between 0 and 99 or jsonb_typeof(p_input->'action') is distinct from 'string' or (p_input->>'action') not in('queue','pause','resume','cancel') or jsonb_typeof(p_input->'reason') is distinct from 'string' or length(p_input->>'reason') not between 10 and 300 or btrim(p_input->>'reason')<>(p_input->>'reason') or (p_input->>'reason')~'[[:cntrl:]]' then raise exception 'bz_invalid_meeting_schedule';end if;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;
 if a.id is null or a.site_id<>p_site_id or a.kind<>'meeting' then raise exception 'bz_agency_unavailable';end if;
 select * into p from bizoveya_private.meeting_deliberation_plans where id=plan_ and meeting_id=meeting_;if p.id is null then raise exception 'bz_deliberation_plan_required';end if;
 select * into e from bizoveya_private.meeting_deliberation_schedule_events where operation_id=operation_;
 if e.operation_id is not null then
  if e.plan_id=plan_ and e.actor_id=actor_ and e.command=p_input then return bizoveya_private.agency_json(meeting_);end if;raise exception 'bz_conflict';
 end if;
 select * into s from bizoveya_private.meeting_deliberation_schedules where plan_id=plan_ for update;
 if a.version is distinct from (p_input->>'expectedMeetingVersion')::integer or coalesce(s.version,0) is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 action_:=p_input->>'action';
 if (action_='queue' and s.plan_id is not null) or (action_='pause' and s.state is distinct from 'ready') or (action_='resume' and s.state is distinct from 'paused') or (action_='cancel' and (s.plan_id is null or s.state='cancelled')) then raise exception 'bz_meeting_schedule_transition';end if;
 if coalesce(s.version,0)>=100 or (action_ in('queue','resume') and coalesce(s.version,0)>=98) then raise exception 'bz_agency_limit';end if;
 if action_ in('queue','resume') then
  if a.status<>'decision-recorded' or a.version<>p.source_version+1 then raise exception 'bz_deliberation_required';end if;
  if exists(select 1 from bizoveya_private.meeting_participant_invitations x where x.meeting_id=meeting_ and (x.state<>'acknowledged' or x.responded_at is null)) or (select count(*) from bizoveya_private.meeting_participant_invitations where meeting_id=meeting_)<>jsonb_array_length(a.document->'participants') then raise exception 'bz_meeting_receipts_required';end if;
  select * into r from bizoveya_private.site_agent_rosters where site_id=p_site_id for share;
  if r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
  if r.version is distinct from p.roster_version or exists(select 1 from bizoveya_private.meeting_deliberation_turns t where t.plan_id=plan_ and not exists(select 1 from jsonb_array_elements(r.document->'agents') y where y->>'kind'=t.role and (y->>'agentId')::uuid=t.agent_id and (y->>'agentVersion')::integer=t.agent_version)) then raise exception 'bz_site_roster_changed';end if;
 end if;
 state_:=case action_ when 'pause' then 'paused' when 'cancel' then 'cancelled' else 'ready' end;version_:=coalesce(s.version,0)+1;
 if s.plan_id is null then insert into bizoveya_private.meeting_deliberation_schedules(plan_id,version,state,actor_id) values(plan_,version_,state_,actor_);
 else update bizoveya_private.meeting_deliberation_schedules set version=version_,state=state_,actor_id=actor_,updated_at=clock_timestamp() where plan_id=plan_;end if;
 insert into bizoveya_private.meeting_deliberation_schedule_events(plan_id,version,operation_id,command,state,actor_id) values(plan_,version_,operation_,p_input,state_,actor_);
 return bizoveya_private.agency_json(meeting_);
exception when unique_violation then raise exception 'bz_conflict';
end;$$;
revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_schedule(uuid),public.bz_control_meeting_schedule(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_control_meeting_schedule(uuid,uuid,jsonb) to authenticated;
commit;
