-- Deterministic whole-deliberation completion and explicit founder review.
-- This migration makes no provider call and creates no downstream task.
begin;
create table bizoveya_private.meeting_deliberation_outcomes(
 id uuid primary key,
 snapshot_id uuid not null unique references bizoveya_private.meeting_execution_snapshots(id) on delete cascade,
 fingerprint text not null check(fingerprint~'^[a-f0-9]{64}$'),
 document jsonb not null,
 command jsonb not null,
 actor_id uuid not null,
 created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.meeting_deliberation_outcomes enable row level security;
revoke all on bizoveya_private.meeting_deliberation_outcomes from public,anon,authenticated,service_role;
create trigger meeting_deliberation_outcome_immutable before update on bizoveya_private.meeting_deliberation_outcomes for each row execute function bizoveya_private.agency_handoff_immutable();

create function bizoveya_private.meeting_deliberation_outcome_candidate(p_snapshot_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare x bizoveya_private.meeting_execution_snapshots%rowtype;p bizoveya_private.meeting_deliberation_plans%rowtype;turns_ jsonb;document_ jsonb;planned_ integer;recorded_ integer;
begin
 select * into x from bizoveya_private.meeting_execution_snapshots where id=p_snapshot_id;
 if x.id is null then return null;end if;
 select * into p from bizoveya_private.meeting_deliberation_plans where id=x.plan_id;
 planned_:=jsonb_array_length(x.input_snapshot->'turns');
 select count(*) into recorded_ from bizoveya_private.meeting_turn_runs where snapshot_id=x.id;
 if planned_ not between 1 and 6 or recorded_<>planned_ or exists(select 1 from bizoveya_private.meeting_turn_runs r left join bizoveya_private.meeting_turn_requests q on q.turn_id=r.id left join bizoveya_private.meeting_turn_results z on z.turn_id=r.id where r.snapshot_id=x.id and (r.status<>'succeeded' or r.spending_state not in('settled','reconciled') or r.provider_started_at is null or r.finished_at is null or r.input_tokens is null or r.output_tokens is null or q.turn_id is null or z.turn_id is null)) then return null;end if;
 select jsonb_agg(jsonb_build_object('turnId',r.id,'ordinal',r.ordinal,'role',x.input_snapshot->'turns'->(r.ordinal-1)->'role','requestHash',q.request_hash,'result',z.document,'inputTokens',r.input_tokens,'outputTokens',r.output_tokens,'spendingState',r.spending_state,'finishedAt',r.finished_at) order by r.ordinal) into turns_ from bizoveya_private.meeting_turn_runs r join bizoveya_private.meeting_turn_requests q on q.turn_id=r.id join bizoveya_private.meeting_turn_results z on z.turn_id=r.id where r.snapshot_id=x.id;
 document_:=jsonb_build_object('schema','meeting-deliberation-outcome-v1','snapshotId',x.id,'meetingId',p.meeting_id,'planId',p.id,'meetingVersion',x.summary->'meetingVersion','scheduleVersion',x.summary->'scheduleVersion','rosterVersion',x.summary->'rosterVersion','status','completed','turns',turns_,'totals',jsonb_build_object('inputTokens',(select sum(input_tokens) from bizoveya_private.meeting_turn_runs where snapshot_id=x.id),'outputTokens',(select sum(output_tokens) from bizoveya_private.meeting_turn_runs where snapshot_id=x.id)),'publish',false,'externalDelivery',false);
 return jsonb_build_object('fingerprint',encode(sha256(convert_to(document_::text,'UTF8')),'hex'),'document',document_);
end;$$;

alter function public.bz_admin_meeting_execution_queue() set schema bizoveya_private;
alter function bizoveya_private.bz_admin_meeting_execution_queue() rename to admin_meeting_execution_queue_before_outcomes;
create function public.bz_admin_meeting_execution_queue() returns jsonb language plpgsql security definer set search_path='' as $$
declare queue_ jsonb;begin perform bizoveya_private.require_admin();queue_:=bizoveya_private.admin_meeting_execution_queue_before_outcomes();
 return coalesce((select jsonb_agg(item||jsonb_build_object('completion',jsonb_build_object(
  'state',case when o.id is not null then 'reviewed' when c.candidate is not null then 'completed' when s.state='cancelled' then 'cancelled' when (item->>'blocked')::boolean or exists(select 1 from bizoveya_private.meeting_turn_runs r where r.snapshot_id=(item->>'snapshotId')::uuid and (r.status='failed' or r.spending_state in('unknown','overrun'))) then 'blocked' else 'in-progress' end,
  'expectedTurns',jsonb_array_length(item->'summary'->'turns'),'recordedTurns',jsonb_array_length(item->'turns'),'fingerprint',c.candidate->'fingerprint'),
  'reviewedOutcome',case when o.id is null then null else jsonb_build_object('id',o.id,'snapshotId',o.snapshot_id,'fingerprint',o.fingerprint,'reason',o.command->>'reason','document',o.document,'actorId',o.actor_id,'createdAt',o.created_at) end) order by item->>'snapshotId')
 from jsonb_array_elements(queue_) item
 left join lateral(select bizoveya_private.meeting_deliberation_outcome_candidate((item->>'snapshotId')::uuid) candidate)c on true
 left join bizoveya_private.meeting_deliberation_outcomes o on o.snapshot_id=(item->>'snapshotId')::uuid
 left join bizoveya_private.meeting_execution_snapshots x on x.id=(item->>'snapshotId')::uuid
 left join bizoveya_private.meeting_deliberation_schedules s on s.plan_id=x.plan_id),'[]'::jsonb);
end;$$;

create function public.bz_admin_review_meeting_outcome(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare snapshot_ uuid;outcome_ uuid;x bizoveya_private.meeting_execution_snapshots%rowtype;o bizoveya_private.meeting_deliberation_outcomes%rowtype;c jsonb;workspace_ uuid;
begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>6 or not(p_input ?& array['action','snapshotId','outcomeId','fingerprint','reason','reviewed']) or p_input->>'action'<>'review-outcome' or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'snapshotId') is distinct from 'string' or jsonb_typeof(p_input->'outcomeId') is distinct from 'string' or jsonb_typeof(p_input->'fingerprint') is distinct from 'string' or (p_input->>'fingerprint')!~'^[a-f0-9]{64}$' or jsonb_typeof(p_input->'reason') is distinct from 'string' or length(p_input->>'reason') not between 10 and 300 or btrim(p_input->>'reason')<>(p_input->>'reason') or (p_input->>'reason')~'[[:cntrl:]]' then raise exception 'bz_invalid_meeting_outcome';end if;
 begin snapshot_:=(p_input->>'snapshotId')::uuid;outcome_:=(p_input->>'outcomeId')::uuid;exception when others then raise exception 'bz_invalid_meeting_outcome';end;
 if snapshot_=outcome_ then raise exception 'bz_invalid_meeting_outcome';end if;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=snapshot_;
 select site.workspace_id into workspace_ from bizoveya_private.meeting_deliberation_plans p join bizoveya_private.agency_records a on a.id=p.meeting_id join public.bizoveya_sites site on site.id=a.site_id where p.id=x.plan_id;
 if x.id is null or x.actor_id is distinct from auth.uid() or not exists(select 1 from public.bizoveya_memberships m where m.workspace_id=workspace_ and m.user_id=auth.uid() and m.role='owner') then raise exception 'bz_forbidden';end if;
 select * into o from bizoveya_private.meeting_deliberation_outcomes where snapshot_id=x.id;
 if o.id is not null then if o.id=outcome_ and o.actor_id=auth.uid() and o.command=p_input then return public.bz_admin_meeting_execution_queue();end if;raise exception 'bz_conflict';end if;
 c:=bizoveya_private.meeting_deliberation_outcome_candidate(x.id);if c is null then raise exception 'bz_meeting_outcome_not_ready';end if;
 if c->>'fingerprint' is distinct from p_input->>'fingerprint' then raise exception 'bz_meeting_outcome_changed';end if;
 insert into bizoveya_private.meeting_deliberation_outcomes(id,snapshot_id,fingerprint,document,command,actor_id) values(outcome_,x.id,c->>'fingerprint',c->'document',p_input,auth.uid());
 return public.bz_admin_meeting_execution_queue();
exception when unique_violation then raise exception 'bz_conflict';end;$$;

revoke all on function bizoveya_private.meeting_deliberation_outcome_candidate(uuid),bizoveya_private.admin_meeting_execution_queue_before_outcomes(),public.bz_admin_meeting_execution_queue(),public.bz_admin_review_meeting_outcome(jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_meeting_execution_queue(),public.bz_admin_review_meeting_outcome(jsonb) to authenticated;
commit;
