-- Immutable, bounded deliberation plans. Planning is deterministic and starts no model or provider work.
begin;
create table bizoveya_private.meeting_deliberation_plans(
 id uuid primary key, meeting_id uuid not null unique references bizoveya_private.meeting_invitation_batches(meeting_id) on delete cascade,
 request_id uuid not null references bizoveya_private.agency_records(id) on delete cascade,
 source_version integer not null check(source_version between 1 and 99), roster_version integer not null check(roster_version between 1 and 50),
 rounds integer not null check(rounds between 1 and 2), max_input_tokens_per_turn integer not null check(max_input_tokens_per_turn between 256 and 2000),
 max_output_tokens_per_turn integer not null check(max_output_tokens_per_turn between 128 and 1000), max_total_cost_cents integer not null check(max_total_cost_cents between 1 and 25),
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.meeting_deliberation_turns(
 plan_id uuid not null references bizoveya_private.meeting_deliberation_plans(id) on delete cascade,
 ordinal integer not null check(ordinal between 1 and 6), round integer not null check(round between 1 and 2),
 role text not null check(role in('coordinator','content','quality')), agent_id uuid not null, agent_version integer not null check(agent_version>0),
 purpose text not null check(length(purpose) between 1 and 240), state text not null default 'planned' check(state='planned'),
 primary key(plan_id,ordinal), unique(plan_id,round,role)
);
alter table bizoveya_private.meeting_deliberation_plans enable row level security;
alter table bizoveya_private.meeting_deliberation_turns enable row level security;
revoke all on bizoveya_private.meeting_deliberation_plans,bizoveya_private.meeting_deliberation_turns from public,anon,authenticated,service_role;
create trigger meeting_deliberation_plan_immutable before update on bizoveya_private.meeting_deliberation_plans for each row execute function bizoveya_private.agency_handoff_immutable();
create trigger meeting_deliberation_turn_immutable before update on bizoveya_private.meeting_deliberation_turns for each row execute function bizoveya_private.agency_handoff_immutable();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_deliberation;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_deliberation(p_id)||jsonb_build_object('meetingDeliberation',(
  select jsonb_build_object('id',p.id,'meetingId',p.meeting_id,'requestId',p.request_id,'sourceVersion',p.source_version,'rosterVersion',p.roster_version,
   'rounds',p.rounds,'maxInputTokensPerTurn',p.max_input_tokens_per_turn,'maxOutputTokensPerTurn',p.max_output_tokens_per_turn,'maxTotalCostCents',p.max_total_cost_cents,
   'actorId',p.actor_id,'createdAt',p.created_at,'turns',coalesce((select jsonb_agg(jsonb_build_object('ordinal',t.ordinal,'round',t.round,'role',t.role,'agentId',t.agent_id,'agentVersion',t.agent_version,'purpose',t.purpose,'state',t.state) order by t.ordinal) from bizoveya_private.meeting_deliberation_turns t where t.plan_id=p.id),'[]'::jsonb))
  from bizoveya_private.meeting_deliberation_plans p where p.meeting_id=p_id));
$$;

create function public.bz_prepare_meeting_deliberation(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;meeting_ uuid;plan_ uuid;a bizoveya_private.agency_records%rowtype;b bizoveya_private.meeting_invitation_batches%rowtype;p bizoveya_private.meeting_deliberation_plans%rowtype;r bizoveya_private.site_agent_rosters%rowtype;i record;round_ integer;ordinal_ integer:=0;purpose_ text;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>8 or not(p_input ?& array['id','planId','expectedVersion','rounds','maxInputTokensPerTurn','maxOutputTokensPerTurn','maxTotalCostCents','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb then raise exception 'bz_invalid_deliberation_plan';end if;
 begin meeting_:=(p_input->>'id')::uuid;plan_:=(p_input->>'planId')::uuid;exception when others then raise exception 'bz_invalid_deliberation_plan';end;
 if meeting_=plan_ then raise exception 'bz_invalid_deliberation_plan';end if;
 if jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or jsonb_typeof(p_input->'rounds') is distinct from 'number' or jsonb_typeof(p_input->'maxInputTokensPerTurn') is distinct from 'number' or jsonb_typeof(p_input->'maxOutputTokensPerTurn') is distinct from 'number' or jsonb_typeof(p_input->'maxTotalCostCents') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or (p_input->>'rounds')!~'^[1-2]$' or (p_input->>'maxInputTokensPerTurn')!~'^[0-9]{3,4}$' or (p_input->>'maxOutputTokensPerTurn')!~'^[0-9]{3,4}$' or (p_input->>'maxTotalCostCents')!~'^[0-9]{1,2}$' or (p_input->>'expectedVersion')::integer not between 1 and 99 or (p_input->>'maxInputTokensPerTurn')::integer not between 256 and 2000 or (p_input->>'maxOutputTokensPerTurn')::integer not between 128 and 1000 or (p_input->>'maxTotalCostCents')::integer not between 1 and 25 then raise exception 'bz_invalid_deliberation_plan';end if;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into p from bizoveya_private.meeting_deliberation_plans where meeting_id=meeting_;
 if p.meeting_id is not null then
  if p.id=plan_ and p.actor_id=actor_ and p.source_version=(p_input->>'expectedVersion')::integer and p.rounds=(p_input->>'rounds')::integer and p.max_input_tokens_per_turn=(p_input->>'maxInputTokensPerTurn')::integer and p.max_output_tokens_per_turn=(p_input->>'maxOutputTokensPerTurn')::integer and p.max_total_cost_cents=(p_input->>'maxTotalCostCents')::integer then return bizoveya_private.agency_json(meeting_);end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'meeting' or a.status<>'decision-recorded' or a.document->>'mode'<>'deliberation' then raise exception 'bz_deliberation_required';end if;
 if a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 if a.version>=100 then raise exception 'bz_agency_limit';end if;
 select * into b from bizoveya_private.meeting_invitation_batches where meeting_id=meeting_;if b.meeting_id is null then raise exception 'bz_meeting_receipts_required';end if;
 if a.version is distinct from b.source_version+1 then raise exception 'bz_conflict';end if;
 if (select count(*) from bizoveya_private.meeting_participant_invitations x where x.meeting_id=meeting_)<>jsonb_array_length(a.document->'participants') or exists(select 1 from bizoveya_private.meeting_participant_invitations x where x.meeting_id=meeting_ and (x.state<>'acknowledged' or x.responded_at is null)) then raise exception 'bz_meeting_receipts_required';end if;
 select * into r from bizoveya_private.site_agent_rosters where site_id=p_site_id for share;
 if r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 if r.version is distinct from b.roster_version or exists(select 1 from bizoveya_private.meeting_participant_invitations x where x.meeting_id=meeting_ and not exists(select 1 from jsonb_array_elements(r.document->'agents') y where y->>'kind'=x.role and (y->>'agentId')::uuid=x.agent_id and (y->>'agentVersion')::integer=x.agent_version)) then raise exception 'bz_site_roster_changed';end if;
 insert into bizoveya_private.meeting_deliberation_plans(id,meeting_id,request_id,source_version,roster_version,rounds,max_input_tokens_per_turn,max_output_tokens_per_turn,max_total_cost_cents,actor_id) values(plan_,meeting_,b.request_id,a.version,b.roster_version,(p_input->>'rounds')::integer,(p_input->>'maxInputTokensPerTurn')::integer,(p_input->>'maxOutputTokensPerTurn')::integer,(p_input->>'maxTotalCostCents')::integer,actor_);
 for round_ in 1..(p_input->>'rounds')::integer loop
  for i in select * from bizoveya_private.meeting_participant_invitations x where x.meeting_id=meeting_ order by case x.role when 'coordinator' then 1 when 'content' then 2 else 3 end loop
   ordinal_:=ordinal_+1;purpose_:=case i.role when 'coordinator' then 'Identify decision constraints, dependencies and a bounded recommendation.' when 'content' then 'Propose an approved-context draft direction and flag unsupported claims.' else 'Review facts, tone, risk and required human checks.' end;
   insert into bizoveya_private.meeting_deliberation_turns(plan_id,ordinal,round,role,agent_id,agent_version,purpose) values(plan_,ordinal_,round_,i.role,i.agent_id,i.agent_version,purpose_);
  end loop;
 end loop;
 update bizoveya_private.agency_records set version=version+1 where id=meeting_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(meeting_,a.version+1,'prepare-deliberation','Bounded turns and future execution ceiling recorded; no reasoning, provider call or spending occurred.',actor_);
 return bizoveya_private.agency_json(meeting_);
exception when unique_violation then raise exception 'bz_conflict';
end;$$;
revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_deliberation(uuid),public.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_meeting_deliberation(uuid,uuid,jsonb) to authenticated;
commit;
