-- P04.3.3.4: one-attempt server runtime claims; no activation or provider calls.
begin;
alter table bizoveya_private.generation_stage_runs add column request_document jsonb, add column provider_started_at timestamptz;
create or replace function public.bz_admin_begin_model_test(p_id uuid,p_profile_id uuid,p_expected_revision integer,p_expected_credential_version integer,p_claim uuid,p_reviewed boolean,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare p bizoveya_private.model_profiles;b bizoveya_private.spending_policies;amount bigint;spent bigint;r jsonb;begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);
 -- Existing ID replay goes through original authorization checks and never spends again.
 if exists(select 1 from bizoveya_private.model_test_runs where id=p_id) then return bizoveya_private.begin_model_test_legacy(p_id,p_profile_id,p_expected_revision,p_expected_credential_version,p_claim,p_reviewed,p_reason);end if;
 select * into p from bizoveya_private.model_profiles where id=p_profile_id for share;
 select * into b from bizoveya_private.spending_policies where profile_id=p_profile_id for share;
 if b.profile_id is null or b.profile_version<>p.version or b.document->>'enabled'<>'true' then raise exception 'bz_spending_not_ready';end if;
 if (b.document->>'validUntil')::timestamptz<=statement_timestamp() then raise exception 'bz_pricing_expired';end if;
 if exists(select 1 from bizoveya_private.spending_ledger where profile_id=p_profile_id and (state in('unknown','overrun') or state='reserved' and started_at<statement_timestamp()-interval '90 seconds')) or exists(select 1 from bizoveya_private.generation_stage_runs where profile_id=p_profile_id and (spending_state in('unknown','overrun') or spending_state='reserved' and created_at<statement_timestamp()-interval '90 seconds')) then raise exception 'bz_spending_unresolved';end if;
 -- Fixed synthetic prompt: conservative4096 input bound,128 output bound,25%margin plus declared per-request fee.
 amount:=ceil(((4096::numeric*(b.document->>'inputRateMicros')::numeric+128::numeric*(b.document->>'outputRateMicros')::numeric)/1000000+(b.document->>'requestFeeMicros')::numeric)*1.25);
 if amount>(b.document->>'runLimitMicros')::bigint then raise exception 'bz_run_budget';end if;
 select coalesce(sum(charged_micros),0) into spent from bizoveya_private.spending_ledger where profile_id=p_profile_id and started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC';
 spent:=spent+coalesce((select sum(charged_micros) from bizoveya_private.generation_stage_runs where profile_id=p_profile_id and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0);
 if spent+amount>least((b.document->>'dailyLimitMicros')::bigint,(select (document->>'dailyBudgetCents')::bigint*10000 from bizoveya_private.model_profile_versions where profile_id=p.id and version=p.version)) then raise exception 'bz_daily_budget';end if;
 r:=bizoveya_private.begin_model_test_legacy(p_id,p_profile_id,p_expected_revision,p_expected_credential_version,p_claim,p_reviewed,p_reason);
 insert into bizoveya_private.spending_ledger(run_id,profile_id,policy_version,policy_snapshot,reserved_micros,charged_micros,state) values(p_id,p.id,b.version,b.document,amount,amount,'reserved');
 insert into bizoveya_private.spending_events(run_id,action,amount_micros,actor_id,reason) values(p_id,'reserved',amount,auth.uid(),btrim(p_reason));return r;
end;$$;

create function public.bz_claim_campaign_generation_stage(p_generation_id uuid,p_stage_id uuid,p_kind text,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;stage jsonb;b bizoveya_private.agent_model_bindings%rowtype;sp bizoveya_private.spending_policies%rowtype;k jsonb;reserved jsonb;prior jsonb;existing bizoveya_private.generation_stage_runs%rowtype;
begin
 perform pg_advisory_xact_lock(817030);
 select * into r from bizoveya_private.generation_runs where id=p_generation_id for update;
 if r.id is null then raise exception 'bz_not_found';end if;
 if r.requested_by is distinct from p_actor_id or not exists(select 1 from public.bizoveya_sites x join public.bizoveya_memberships m on m.workspace_id=x.workspace_id where x.id=r.site_id and m.user_id=p_actor_id and m.role<>'viewer') then raise exception 'bz_forbidden';end if;
 -- A claim is never replayed into a second billable attempt, even after a crash.
 select * into existing from bizoveya_private.generation_stage_runs where generation_run_id=r.id and kind=p_kind;
 if existing.id is not null then return jsonb_build_object('execute',false,'status',existing.status,'spendingState',existing.spending_state);end if;
 if r.status not in('prepared','running') then raise exception 'bz_generation_terminal';end if;
 if not exists(select 1 from public.bizoveya_campaigns where id=r.campaign_id and version=r.campaign_version) or coalesce((select version from public.bizoveya_site_agent_preferences where site_id=r.site_id),0)<>(r.input_snapshot->'preferences'->>'version')::integer then raise exception 'bz_generation_stale';end if;
 for k in select value from jsonb_array_elements(r.input_snapshot->'knowledge') loop
  if not exists(select 1 from public.bizoveya_knowledge_sources where id=(k->>'sourceId')::uuid and site_id=r.site_id and approved and version=(k->>'sourceVersion')::integer) then raise exception 'bz_generation_stale';end if;
 end loop;
 select value into stage from jsonb_array_elements(r.input_snapshot->'stages') where value->>'kind'=p_kind;
 if stage is null then raise exception 'bz_generation_not_ready';end if;
 select * into b from bizoveya_private.agent_model_bindings where agent_id=(stage->>'agentId')::uuid for share;
 if b.agent_id is null or b.revision<>(stage->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null then raise exception 'bz_generation_stale';end if;
 select * into sp from bizoveya_private.spending_policies where profile_id=b.profile_id for share;
 if sp.version is distinct from (stage->>'spendingPolicyVersion')::integer or sp.document is distinct from stage->'spendingPolicy' then raise exception 'bz_generation_stale';end if;
 reserved:=public.bz_begin_campaign_generation_stage(p_generation_id,p_stage_id,p_kind,p_claim,p_actor_id);
 select coalesce(jsonb_object_agg(kind,output_document),'{}'::jsonb) into prior from bizoveya_private.generation_stage_runs where generation_run_id=r.id and status='succeeded' and spending_state='settled';
 return jsonb_build_object('execute',true,'snapshot',r.input_snapshot,'prior',prior,'inputLimit',case p_kind when 'quality' then 16384 else 32768 end,'outputLimit',least((stage->'agent'->>'maxOutputTokens')::integer,(stage->'profile'->>'maxOutputTokens')::integer,8192));
end;$$;
revoke all on function public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid) to service_role;
create function public.bz_cancel_unstarted_generation_stage(p_stage_id uuid,p_claim uuid) returns void language plpgsql security definer set search_path='' as $$
declare s bizoveya_private.generation_stage_runs%rowtype;
begin
 perform pg_advisory_xact_lock(817030);
 select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id for update;
 if s.id is null or s.claim is distinct from p_claim then raise exception 'bz_conflict';end if;
 if s.status<>'reserved' then return;end if;
 if s.provider_started_at is not null then raise exception 'bz_provider_already_started';end if;
 update bizoveya_private.generation_stage_runs set status='failed',spending_state='settled',charged_micros=0,input_tokens=0,output_tokens=0,error_code='preflight_failed',finished_at=clock_timestamp() where id=s.id;
 update bizoveya_private.generation_runs set status='failed',error_code='preflight_failed',finished_at=clock_timestamp() where id=s.generation_run_id;
 insert into bizoveya_private.generation_spending_events(stage_id,action,amount_micros,reason) values(s.id,'settled',0,'Server preflight failed before any provider request');
end;$$;
revoke all on function public.bz_cancel_unstarted_generation_stage(uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_cancel_unstarted_generation_stage(uuid,uuid) to service_role;
create function public.bz_record_generation_request(p_stage_id uuid,p_claim uuid,p_request jsonb) returns void language plpgsql security definer set search_path='' as $$
declare s bizoveya_private.generation_stage_runs%rowtype;
begin
 perform pg_advisory_xact_lock(817030);
 select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id for update;
 if s.id is null or s.claim is distinct from p_claim or s.status<>'reserved' or s.provider_started_at is not null then raise exception 'bz_conflict';end if;
 if p_request is null or jsonb_typeof(p_request)<>'object' or p_request->>'runtimeVersion' is distinct from 'draft-runtime-v1-ai7.0.127' or length(p_request::text)>100000 or p_request->>'instructions' is null or p_request->>'prompt' is null then raise exception 'bz_invalid_generation';end if;
 update bizoveya_private.generation_stage_runs set request_document=p_request,provider_started_at=clock_timestamp() where id=s.id;
end;$$;
revoke all on function public.bz_record_generation_request(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_record_generation_request(uuid,uuid,jsonb) to service_role;
create or replace function public.bz_finish_campaign_generation_stage(p_stage_id uuid,p_claim uuid,p_output jsonb,p_error_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$
declare s bizoveya_private.generation_stage_runs%rowtype;cost bigint;spend_state text;stage_status text;combined jsonb;
begin
 perform pg_advisory_xact_lock(817030);select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id for update;
 if s.id is null or s.claim is distinct from p_claim then raise exception 'bz_conflict';end if;
 if s.status<>'reserved' then return;end if;
 if p_input_tokens is null or p_output_tokens is null then cost:=s.reserved_micros;spend_state:='unknown';stage_status:='failed';
 else
  if p_input_tokens<0 or p_output_tokens<0 then raise exception 'bz_invalid_generation';end if;
  cost:=ceil((p_input_tokens::numeric*(s.policy_snapshot->>'inputRateMicros')::numeric+p_output_tokens::numeric*(s.policy_snapshot->>'outputRateMicros')::numeric)/1000000+(s.policy_snapshot->>'requestFeeMicros')::numeric);
  spend_state:=case when cost>s.reserved_micros or p_input_tokens>s.input_token_limit or p_output_tokens>s.output_token_limit then 'overrun' else 'settled' end;
  stage_status:=case when p_output is not null and p_error_code is null and spend_state='settled' then 'succeeded' else 'failed' end;
 end if;
 update bizoveya_private.generation_stage_runs set status=stage_status,spending_state=spend_state,charged_micros=cost,input_tokens=p_input_tokens,output_tokens=p_output_tokens,output_document=p_output,error_code=left(p_error_code,120),finished_at=clock_timestamp() where id=s.id;
 insert into bizoveya_private.generation_spending_events(stage_id,action,amount_micros,reason) values(s.id,spend_state,cost,'Server-recorded campaign generation usage; USD estimate from captured pricing');
 if stage_status='failed' then update bizoveya_private.generation_runs set status='failed',error_code=coalesce(left(p_error_code,120),spend_state),finished_at=clock_timestamp() where id=s.generation_run_id;
 elsif s.kind='quality' then
  select jsonb_object_agg(kind,output_document) into combined from bizoveya_private.generation_stage_runs where generation_run_id=s.generation_run_id and status='succeeded';
  update bizoveya_private.generation_runs set status='succeeded',output_document=jsonb_build_object('schema','campaign-generation-output-v1','stages',combined),finished_at=clock_timestamp() where id=s.generation_run_id;
 end if;
end;$$;


commit;
