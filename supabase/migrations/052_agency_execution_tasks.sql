-- Durable assistant execution-task state and explicit expired-dispatch recovery.
-- This migration never starts a provider request.
begin;

create table bizoveya_private.agency_execution_tasks(
 record_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 run_id uuid not null unique references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null check(version between 1 and 100),
 state text not null check(state in('awaiting_authorization','running','awaiting_human_review','failed','recovery_required','cancelled')),
 last_reason text not null,
 created_at timestamptz not null default clock_timestamp(),
 updated_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.agency_execution_task_events(
 id uuid primary key default gen_random_uuid(),
 record_id uuid not null references bizoveya_private.agency_execution_tasks(record_id) on delete cascade,
 version integer not null check(version between 1 and 100),
 action text not null check(action in('prepared','authorized','finished','safe_resume','cancelled_unstarted','reconciliation_required','synchronized')),
 state text not null check(state in('awaiting_authorization','running','awaiting_human_review','failed','recovery_required','cancelled')),
 reason text not null,
 actor_id uuid references auth.users(id),
 created_at timestamptz not null default clock_timestamp(),
 unique(record_id,version)
);
alter table bizoveya_private.agency_execution_tasks enable row level security;
alter table bizoveya_private.agency_execution_task_events enable row level security;
revoke all on bizoveya_private.agency_execution_tasks,bizoveya_private.agency_execution_task_events from public,anon,authenticated,service_role;
create trigger agency_execution_task_event_immutable before update on bizoveya_private.agency_execution_task_events for each row execute function bizoveya_private.agency_handoff_immutable();

create function bizoveya_private.create_agency_execution_task() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into bizoveya_private.agency_execution_tasks(record_id,run_id,version,state,last_reason,created_at,updated_at)
 values(new.record_id,new.run_id,1,'awaiting_authorization','Reviewed snapshot awaits separate admin authorization.',new.created_at,new.created_at);
 insert into bizoveya_private.agency_execution_task_events(record_id,version,action,state,reason,actor_id,created_at)
 values(new.record_id,1,'prepared','awaiting_authorization','Reviewed snapshot prepared; no provider request or spending reservation.',new.actor_id,new.created_at);
 return new;
end;$$;
create trigger agency_generation_handoff_task after insert on bizoveya_private.agency_generation_handoffs for each row execute function bizoveya_private.create_agency_execution_task();

-- Preserve any rows created after 051 and before this successor is installed.
insert into bizoveya_private.agency_execution_tasks(record_id,run_id,version,state,last_reason,created_at,updated_at)
select h.record_id,h.run_id,1,
 case g.status when 'succeeded' then 'awaiting_human_review' when 'failed' then 'failed' when 'cancelled' then 'cancelled' when 'running' then 'recovery_required' else 'awaiting_authorization' end,
 'Backfilled from the durable run state when execution-task tracking was installed.',h.created_at,clock_timestamp()
from bizoveya_private.agency_generation_handoffs h join bizoveya_private.generation_runs g on g.id=h.run_id
on conflict(record_id) do nothing;
insert into bizoveya_private.agency_execution_task_events(record_id,version,action,state,reason,actor_id,created_at)
select t.record_id,1,'synchronized',t.state,t.last_reason,h.actor_id,t.updated_at
from bizoveya_private.agency_execution_tasks t join bizoveya_private.agency_generation_handoffs h on h.record_id=t.record_id
on conflict(record_id,version) do nothing;

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_tasks;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_tasks(p_id)||jsonb_build_object(
 'executionTask',(select jsonb_build_object(
  'recordId',t.record_id,'runId',t.run_id,'version',t.version,'state',t.state,'lastReason',t.last_reason,
  'createdAt',t.created_at,'updatedAt',t.updated_at,
  'leaseActive',coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false),
  'leaseExpired',coalesce(d.finished_at is null and d.expires_at<=statement_timestamp(),false),
  'events',coalesce((select jsonb_agg(jsonb_build_object('version',e.version,'action',e.action,'state',e.state,'reason',e.reason,'actorId',e.actor_id,'createdAt',e.created_at) order by e.version) from bizoveya_private.agency_execution_task_events e where e.record_id=t.record_id),'[]'::jsonb)
 ) from bizoveya_private.agency_execution_tasks t left join bizoveya_private.generation_dispatches d on d.generation_id=t.run_id where t.record_id=p_id));
$$;

alter function public.bz_admin_authorize_generation(uuid,uuid,text,boolean) set schema bizoveya_private;
alter function bizoveya_private.bz_admin_authorize_generation(uuid,uuid,text,boolean) rename to authorize_generation_before_tasks;
revoke all on function bizoveya_private.authorize_generation_before_tasks(uuid,uuid,text,boolean) from public,anon,authenticated,service_role;
create function public.bz_admin_authorize_generation(p_id uuid,p_claim uuid,p_reason text,p_reviewed boolean) returns void language plpgsql security definer set search_path='' as $$
declare t bizoveya_private.agency_execution_tasks%rowtype;next_ integer;
begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);
 select * into t from bizoveya_private.agency_execution_tasks where run_id=p_id for update;
 if t.record_id is not null and t.state='running' then
  if exists(select 1 from bizoveya_private.generation_dispatches d where d.generation_id=p_id and d.finished_at is null and d.expires_at>statement_timestamp()) then raise exception 'bz_generation_busy';end if;
  raise exception 'bz_agency_execution_blocked';
 end if;
 if t.record_id is not null and (t.state<>'awaiting_authorization' or t.version>=99) then raise exception 'bz_agency_execution_blocked';end if;
 perform bizoveya_private.authorize_generation_before_tasks(p_id,p_claim,p_reason,p_reviewed);
 if t.record_id is not null then
  next_:=t.version+1;
  update bizoveya_private.agency_execution_tasks set version=next_,state='running',last_reason=btrim(p_reason),updated_at=clock_timestamp() where record_id=t.record_id;
  insert into bizoveya_private.agency_execution_task_events(record_id,version,action,state,reason,actor_id) values(t.record_id,next_,'authorized','running',btrim(p_reason),auth.uid());
 end if;
end;$$;

alter function public.bz_finish_generation_dispatch(uuid,uuid,text) set schema bizoveya_private;
alter function bizoveya_private.bz_finish_generation_dispatch(uuid,uuid,text) rename to finish_generation_before_tasks;
revoke all on function bizoveya_private.finish_generation_before_tasks(uuid,uuid,text) from public,anon,authenticated,service_role;
create function public.bz_finish_generation_dispatch(p_id uuid,p_claim uuid,p_result text) returns void language plpgsql security definer set search_path='' as $$
declare t bizoveya_private.agency_execution_tasks%rowtype;r bizoveya_private.generation_runs%rowtype;next_ integer;state_ text;reason_ text;
begin
 perform pg_advisory_xact_lock(817030);
 perform bizoveya_private.finish_generation_before_tasks(p_id,p_claim,p_result);
 select * into t from bizoveya_private.agency_execution_tasks where run_id=p_id for update;
 if t.record_id is null then return;end if;
 if t.version>=100 then raise exception 'bz_agency_execution_limit';end if;
 select * into r from bizoveya_private.generation_runs where id=p_id;
 state_:=case
  when p_result='completed_for_human_review' and r.status='succeeded' and r.output_document is not null then 'awaiting_human_review'
  when r.status='failed' then 'failed'
  when r.status='cancelled' then 'cancelled'
  else 'recovery_required' end;
 reason_:=case state_
  when 'awaiting_human_review' then 'All draft stages settled and output awaits human review.'
  when 'failed' then 'Generation stopped with a recorded failed run; inspect stage and spending evidence.'
  when 'cancelled' then 'Generation was cancelled under the existing runtime boundary.'
  else 'Dispatch ended without a terminal trustworthy output; explicit recovery inspection is required.' end;
 next_:=t.version+1;
 update bizoveya_private.agency_execution_tasks set version=next_,state=state_,last_reason=reason_,updated_at=clock_timestamp() where record_id=t.record_id;
 insert into bizoveya_private.agency_execution_task_events(record_id,version,action,state,reason,actor_id) values(t.record_id,next_,'finished',state_,reason_,null);
end;$$;

create function public.bz_admin_reconcile_agency_execution(p_id uuid,p_expected_task_version integer,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;t bizoveya_private.agency_execution_tasks%rowtype;r bizoveya_private.generation_runs%rowtype;d bizoveya_private.generation_dispatches%rowtype;s bizoveya_private.generation_stage_runs%rowtype;next_ integer;state_ text;action_ text;reason_ text;
begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);actor_:=auth.uid();
 if p_reviewed is distinct from true or p_expected_task_version is null or p_expected_task_version not between 1 and 100 or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason~'[\x01-\x1F]' then raise exception 'bz_invalid_generation';end if;
 select * into t from bizoveya_private.agency_execution_tasks where run_id=p_id for update;
 if t.record_id is null then raise exception 'bz_agency_execution_unavailable';end if;
 if t.version is distinct from p_expected_task_version then raise exception 'bz_conflict';end if;
 if t.version>=100 then raise exception 'bz_agency_execution_limit';end if;
 select * into r from bizoveya_private.generation_runs where id=p_id for update;
 if r.requested_by is distinct from actor_ or not exists(select 1 from public.bizoveya_sites x join public.bizoveya_memberships m on m.workspace_id=x.workspace_id where x.id=r.site_id and m.user_id=actor_ and m.role='owner') then raise exception 'bz_forbidden';end if;
 select * into d from bizoveya_private.generation_dispatches where generation_id=p_id for update;
 if d.generation_id is not null and d.finished_at is null and d.expires_at>statement_timestamp() then raise exception 'bz_generation_busy';end if;
 if r.status='succeeded' and r.output_document is not null then state_:='awaiting_human_review';action_:='synchronized';reason_:='Stored output is complete and awaits human review.';
 elsif r.status='failed' then state_:='failed';action_:='synchronized';reason_:='Stored run is failed; no automatic retry is permitted.';
 elsif r.status='cancelled' then state_:='cancelled';action_:='synchronized';reason_:='Stored run is cancelled; no automatic retry is permitted.';
 elsif exists(select 1 from bizoveya_private.generation_stage_runs x where x.generation_run_id=p_id and x.spending_state in('unknown','overrun')) then state_:='recovery_required';action_:='reconciliation_required';reason_:='Unknown or overrun spending must be reconciled before another dispatch.';
 else
  select * into s from bizoveya_private.generation_stage_runs x where x.generation_run_id=p_id and x.status='reserved' order by x.ordinal limit 1 for update;
  if s.id is not null and s.provider_started_at is not null then
   state_:='recovery_required';action_:='reconciliation_required';reason_:='A provider-start marker exists; reconcile usage before another dispatch.';
  elsif s.id is not null then
   perform public.bz_cancel_unstarted_generation_stage(s.id,s.claim);
   state_:='failed';action_:='cancelled_unstarted';reason_:='Expired dispatch had no provider-start marker; the reservation was safely settled at zero.';
  else
   state_:='awaiting_authorization';action_:='safe_resume';reason_:='Expired dispatch has no unsettled request; a new explicit authorization may resume remaining stages.';
  end if;
 end if;
 if d.generation_id is not null and d.finished_at is null then update bizoveya_private.generation_dispatches set finished_at=clock_timestamp(),result='blocked' where generation_id=p_id;end if;
 next_:=t.version+1;
 update bizoveya_private.agency_execution_tasks set version=next_,state=state_,last_reason=reason_,updated_at=clock_timestamp() where record_id=t.record_id;
 insert into bizoveya_private.agency_execution_task_events(record_id,version,action,state,reason,actor_id) values(t.record_id,next_,action_,state_,btrim(p_reason)||' Result: '||reason_,actor_);
 return jsonb_build_object('action',action_,'state',state_,'taskVersion',next_,'reason',reason_);
end;$$;

create or replace function public.bz_admin_generation_queue() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object(
  'id',r.id,'campaignId',r.campaign_id,'siteId',r.site_id,'title',c.document->>'title','campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,'outputAvailable',r.output_document is not null,
  'leaseActive',coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false),
  'stale',c.version<>r.campaign_version or exists(select 1 from bizoveya_private.site_agent_rosters roster where roster.site_id=r.site_id and (roster.document->'enabled' is distinct from 'true'::jsonb or (r.input_snapshot->>'siteRosterVersion')::integer is distinct from roster.version)) or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s left join bizoveya_private.agent_model_bindings b on b.agent_id=(s->>'agentId')::uuid where b.revision is distinct from (s->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null),
  'executionTask',(select jsonb_build_object('recordId',t.record_id,'version',t.version,'state',t.state,'lastReason',t.last_reason,'updatedAt',t.updated_at,'leaseExpired',coalesce(d.finished_at is null and d.expires_at<=statement_timestamp(),false)) from bizoveya_private.agency_execution_tasks t where t.run_id=r.id),
  'stages',coalesce((select jsonb_agg(jsonb_build_object('kind',g.kind,'status',g.status,'spendingState',g.spending_state,'errorCode',g.error_code,'inputTokens',g.input_tokens,'outputTokens',g.output_tokens) order by g.ordinal) from bizoveya_private.generation_stage_runs g where g.generation_run_id=r.id),'[]'::jsonb)
 ) order by r.created_at desc)
 from(select g.* from bizoveya_private.generation_runs g join public.bizoveya_sites s on s.id=g.site_id join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner' where g.requested_by=auth.uid() order by g.created_at desc limit 100)r
 join public.bizoveya_campaigns c on c.id=r.campaign_id left join bizoveya_private.generation_dispatches d on d.generation_id=r.id),'[]'::jsonb);
end;$$;

revoke all on function bizoveya_private.create_agency_execution_task(),bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_tasks(uuid),public.bz_admin_authorize_generation(uuid,uuid,text,boolean),public.bz_finish_generation_dispatch(uuid,uuid,text),public.bz_admin_reconcile_agency_execution(uuid,integer,text,boolean),public.bz_admin_generation_queue() from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_authorize_generation(uuid,uuid,text,boolean),public.bz_admin_reconcile_agency_execution(uuid,integer,text,boolean),public.bz_admin_generation_queue() to authenticated;
grant execute on function public.bz_finish_generation_dispatch(uuid,uuid,text) to service_role;
commit;
