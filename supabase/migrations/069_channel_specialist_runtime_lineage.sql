-- Pin reviewed channel responsibility to the existing single Content-stage runtime.
-- This migration adds no provider call, retry, spending path or publication capability.
begin;

create table bizoveya_private.agency_specialist_runtime_lineage(
 record_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 run_id uuid not null unique references bizoveya_private.generation_runs(id) on delete cascade,
 delegation_source_version integer not null check(delegation_source_version between 1 and 99),
 roster_version integer not null check(roster_version between 1 and 50),
 assignments jsonb not null,
 campaign_id uuid not null references public.bizoveya_campaigns(id) on delete cascade,
 campaign_version integer not null check(campaign_version between 1 and 100),
 shared_content_agent_id uuid not null,
 shared_content_agent_version integer not null check(shared_content_agent_version>0),
 actor_id uuid not null references auth.users(id),
 created_at timestamptz not null default clock_timestamp(),
 check(jsonb_typeof(assignments)='array' and jsonb_array_length(assignments) between 1 and 3)
);
alter table bizoveya_private.agency_specialist_runtime_lineage enable row level security;
revoke all on bizoveya_private.agency_specialist_runtime_lineage from public,anon,authenticated,service_role;
create trigger agency_specialist_runtime_lineage_immutable before update on bizoveya_private.agency_specialist_runtime_lineage for each row execute function bizoveya_private.agency_handoff_immutable();

create function bizoveya_private.attach_specialist_runtime_lineage(p_record_id uuid,p_actor_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare delegation_ bizoveya_private.agency_channel_delegations%rowtype;handoff_ bizoveya_private.agency_generation_handoffs%rowtype;run_ bizoveya_private.generation_runs%rowtype;stage_ jsonb;existing_ bizoveya_private.agency_specialist_runtime_lineage%rowtype;
begin
 select * into delegation_ from bizoveya_private.agency_channel_delegations where request_id=p_record_id;
 select * into handoff_ from bizoveya_private.agency_generation_handoffs where record_id=p_record_id;
 if delegation_.request_id is null or handoff_.record_id is null then return;end if;
 select * into run_ from bizoveya_private.generation_runs where id=handoff_.run_id;
 select value into stage_ from jsonb_array_elements(run_.input_snapshot->'stages') value where value->>'kind'='content';
 if stage_ is null or jsonb_typeof(stage_) is distinct from 'object' then raise exception 'bz_channel_specialist_runtime_changed';end if;
 select * into existing_ from bizoveya_private.agency_specialist_runtime_lineage where record_id=p_record_id;
 if existing_.record_id is not null then
  if existing_.run_id=run_.id and existing_.delegation_source_version=delegation_.source_version and existing_.roster_version=delegation_.roster_version and existing_.assignments=delegation_.assignments then return;end if;
  raise exception 'bz_conflict';
 end if;
 insert into bizoveya_private.agency_specialist_runtime_lineage(record_id,run_id,delegation_source_version,roster_version,assignments,campaign_id,campaign_version,shared_content_agent_id,shared_content_agent_version,actor_id)
 values(p_record_id,run_.id,delegation_.source_version,delegation_.roster_version,delegation_.assignments,run_.campaign_id,run_.campaign_version,(stage_->>'agentId')::uuid,(stage_->>'agentVersion')::integer,p_actor_id);
end;$$;
create function bizoveya_private.attach_specialist_runtime_after_delegation() returns trigger language plpgsql security definer set search_path='' as $$begin perform bizoveya_private.attach_specialist_runtime_lineage(new.request_id,new.actor_id);return new;end;$$;
create trigger agency_channel_delegation_runtime after insert on bizoveya_private.agency_channel_delegations for each row execute function bizoveya_private.attach_specialist_runtime_after_delegation();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_specialist_runtime;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_specialist_runtime(p_id)||jsonb_build_object('specialistRuntime',(
  select jsonb_build_object(
   'runId',l.run_id,'delegationSourceVersion',l.delegation_source_version,'rosterVersion',l.roster_version,
   'campaignId',l.campaign_id,'campaignVersion',l.campaign_version,'executionMode','shared-content-stage',
   'providerCallsPerContentStage',1,'actorId',l.actor_id,'createdAt',l.created_at,
   'sharedContentExecution',jsonb_build_object('agentId',l.shared_content_agent_id,'agentVersion',l.shared_content_agent_version,'status',coalesce(s.status,'prepared'),'spendingState',coalesce(s.spending_state,'not_started')),
   'channels',(select jsonb_agg(jsonb_build_object(
    'channel',a.value->>'channel','specialistKind','content','agentId',a.value->>'agentId','agentVersion',(a.value->>'agentVersion')::integer,
    'state',case
      when review.decision='accepted' and jsonb_extract_path(g.output_document,'stages','content',a.value->>'channel') is not null then 'accepted'
      when review.decision='changes_requested' then 'changes_requested'
      when t.state='recovery_required' then 'recovery_required'
      when t.state='cancelled' then 'cancelled'
      when t.state='failed' or g.status='failed' then 'failed'
      when g.status='succeeded' and jsonb_extract_path(g.output_document,'stages','content',a.value->>'channel') is not null then 'awaiting_human_review'
      when t.state='running' then 'running'
      else 'prepared' end,
    'outputAvailable',jsonb_extract_path(g.output_document,'stages','content',a.value->>'channel') is not null
   ) order by case a.value->>'channel' when 'blog' then 1 when 'pinterest' then 2 else 3 end) from jsonb_array_elements(l.assignments) a)
  )
  from bizoveya_private.agency_specialist_runtime_lineage l
  join bizoveya_private.generation_runs g on g.id=l.run_id
  left join bizoveya_private.agency_execution_tasks t on t.record_id=l.record_id
  left join bizoveya_private.generation_stage_runs s on s.generation_run_id=l.run_id and s.kind='content'
  left join lateral(select r.decision,r.version from bizoveya_private.generation_reviews r where r.generation_id=l.run_id order by r.version desc limit 1) review on true
  where l.record_id=p_id));
$$;

alter function public.bz_prepare_agency_generation(uuid,uuid,jsonb) set schema bizoveya_private;
alter function bizoveya_private.bz_prepare_agency_generation(uuid,uuid,jsonb) rename to prepare_agency_generation_before_specialists;
revoke all on function bizoveya_private.prepare_agency_generation_before_specialists(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
create function public.bz_prepare_agency_generation(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;record_ uuid;
begin
 result_:=bizoveya_private.prepare_agency_generation_before_specialists(p_workspace_id,p_site_id,p_input);
 begin record_:=(p_input->>'id')::uuid;exception when others then return result_;end;
 perform bizoveya_private.attach_specialist_runtime_lineage(record_,auth.uid());
 return bizoveya_private.agency_json(record_);
end;$$;

-- Close the brief 068→069 install window without changing legacy runs that have no delegation.
do $$declare row_ record;begin for row_ in select d.request_id,d.actor_id from bizoveya_private.agency_channel_delegations d join bizoveya_private.agency_generation_handoffs h on h.record_id=d.request_id loop perform bizoveya_private.attach_specialist_runtime_lineage(row_.request_id,row_.actor_id);end loop;end;$$;

revoke all on function bizoveya_private.attach_specialist_runtime_lineage(uuid,uuid),bizoveya_private.attach_specialist_runtime_after_delegation(),bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_specialist_runtime(uuid),public.bz_prepare_agency_generation(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_agency_generation(uuid,uuid,jsonb) to authenticated;
commit;
