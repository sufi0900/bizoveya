-- P04.3.3 checkpoint 3: durable generation stages and shared spending enforcement.
-- No provider call is made by this migration. Stage reservation/settlement RPCs are service-role only.
begin;

create table bizoveya_private.generation_stage_runs(
 id uuid primary key,
 generation_run_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 kind text not null check(kind in('coordinator','content','quality')),
 ordinal smallint not null check(ordinal between 1 and 3),
 profile_id uuid not null references bizoveya_private.model_profiles(id),
 profile_version integer not null,
 policy_version integer not null,
 policy_snapshot jsonb not null,
 claim uuid not null,
 status text not null check(status in('reserved','succeeded','failed')),
 spending_state text not null check(spending_state in('reserved','settled','unknown','overrun','reconciled')),
 reserved_micros bigint not null check(reserved_micros>=0),
 charged_micros bigint not null check(charged_micros>=0),
 input_token_limit integer not null check(input_token_limit>0),
 output_token_limit integer not null check(output_token_limit>0),
 input_tokens integer,
 output_tokens integer,
 output_document jsonb,
 error_code text,
 actor_id uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default clock_timestamp(),
 finished_at timestamptz,
 unique(generation_run_id,kind),
 unique(generation_run_id,ordinal),
 check((status='reserved' and finished_at is null and output_document is null and error_code is null) or status<>'reserved'),
 check((status='succeeded' and output_document is not null and error_code is null) or status<>'succeeded')
);
create index generation_stage_profile_created_idx on bizoveya_private.generation_stage_runs(profile_id,created_at desc);
create table bizoveya_private.generation_spending_events(
 id uuid primary key default gen_random_uuid(),stage_id uuid not null references bizoveya_private.generation_stage_runs(id) on delete cascade,
 action text not null,amount_micros bigint not null check(amount_micros>=0),actor_id uuid references auth.users(id) on delete set null,
 reason text not null,occurred_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.generation_stage_runs enable row level security;
alter table bizoveya_private.generation_spending_events enable row level security;
revoke all on bizoveya_private.generation_stage_runs,bizoveya_private.generation_spending_events from public,anon,authenticated,service_role;

create or replace function public.bz_campaign_generation_history(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid();if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id;if not found then raise exception 'bz_not_found';end if;
 return coalesce((select jsonb_agg(jsonb_build_object(
  'id',r.id,'campaignId',r.campaign_id,'campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,
  'startedAt',r.started_at,'finishedAt',r.finished_at,'stageCount',jsonb_array_length(r.input_snapshot->'stages'),
  'outputAvailable',r.output_document is not null,'stages',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'kind',s.kind,'status',s.status,'spendingState',s.spending_state,'createdAt',s.created_at,'finishedAt',s.finished_at) order by s.ordinal) from bizoveya_private.generation_stage_runs s where s.generation_run_id=r.id),'[]'::jsonb)
 ) order by r.created_at desc) from (select * from bizoveya_private.generation_runs where site_id=p_site_id order by created_at desc limit 100)r),'[]'::jsonb);
end;$$;

create function public.bz_begin_campaign_generation_stage(p_generation_id uuid,p_stage_id uuid,p_kind text,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;s bizoveya_private.generation_stage_runs%rowtype;stage jsonb;policy jsonb;profile jsonb;amount bigint;spent bigint;ordinal_ integer;input_limit integer;output_limit integer;role_ text;
begin
 if p_stage_id is null or p_claim is null or p_actor_id is null or p_kind not in('coordinator','content','quality') then raise exception 'bz_invalid_generation';end if;
 perform pg_advisory_xact_lock(817030);
 select * into r from bizoveya_private.generation_runs where id=p_generation_id for update;if r.id is null then raise exception 'bz_not_found';end if;
 select m.role into role_ from public.bizoveya_sites x join public.bizoveya_memberships m on m.workspace_id=x.workspace_id and m.user_id=p_actor_id where x.id=r.site_id;
 if role_ is null or role_='viewer' then raise exception 'bz_forbidden';end if;
 select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id;
 if s.id is not null then
  if s.generation_run_id<>p_generation_id or s.kind<>p_kind or s.claim<>p_claim then raise exception 'bz_conflict';end if;
  return jsonb_build_object('id',s.id,'generationId',s.generation_run_id,'kind',s.kind,'status',s.status,'spendingState',s.spending_state,'reservedMicros',s.reserved_micros,'createdAt',s.created_at);
 end if;
 if r.status not in('prepared','running') then raise exception 'bz_generation_terminal';end if;
 ordinal_:=case p_kind when 'coordinator' then 1 when 'content' then 2 else 3 end;
 if ordinal_>1 and not exists(select 1 from bizoveya_private.generation_stage_runs x where x.generation_run_id=r.id and x.ordinal=ordinal_-1 and x.status='succeeded' and x.spending_state='settled') then raise exception 'bz_stage_order';end if;
 select value into stage from jsonb_array_elements(r.input_snapshot->'stages') where value->>'kind'=p_kind;
 if stage is null then raise exception 'bz_generation_not_ready';end if;
 policy:=stage->'spendingPolicy';profile:=stage->'profile';
 if policy->>'enabled'<>'true' then raise exception 'bz_spending_not_ready';end if;
 if (policy->>'validUntil')::timestamptz<=statement_timestamp() then raise exception 'bz_pricing_expired';end if;
 if exists(select 1 from bizoveya_private.spending_ledger l where l.profile_id=(stage->>'profileId')::uuid and (l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds'))
  or exists(select 1 from bizoveya_private.generation_stage_runs g where g.profile_id=(stage->>'profileId')::uuid and (g.spending_state in('unknown','overrun') or g.spending_state='reserved' and g.created_at<statement_timestamp()-interval '90 seconds')) then raise exception 'bz_spending_unresolved';end if;
 input_limit:=case p_kind when 'quality' then 16384 else 32768 end;
 output_limit:=least(greatest(coalesce((profile->>'maxOutputTokens')::integer,128),128),8192);
 amount:=ceil(((input_limit::numeric*(policy->>'inputRateMicros')::numeric+output_limit::numeric*(policy->>'outputRateMicros')::numeric)/1000000+(policy->>'requestFeeMicros')::numeric)*1.25);
 if amount>(policy->>'runLimitMicros')::bigint then raise exception 'bz_run_budget';end if;
 select coalesce((select sum(charged_micros) from bizoveya_private.spending_ledger where profile_id=(stage->>'profileId')::uuid and started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0)
  +coalesce((select sum(charged_micros) from bizoveya_private.generation_stage_runs where profile_id=(stage->>'profileId')::uuid and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0) into spent;
 if spent+amount>least((policy->>'dailyLimitMicros')::bigint,(profile->>'dailyBudgetCents')::bigint*10000) then raise exception 'bz_daily_budget';end if;
 insert into bizoveya_private.generation_stage_runs(id,generation_run_id,kind,ordinal,profile_id,profile_version,policy_version,policy_snapshot,claim,status,spending_state,reserved_micros,charged_micros,input_token_limit,output_token_limit,actor_id)
 values(p_stage_id,r.id,p_kind,ordinal_,(stage->>'profileId')::uuid,(stage->>'profileVersion')::integer,(stage->>'spendingPolicyVersion')::integer,policy,p_claim,'reserved','reserved',amount,amount,input_limit,output_limit,p_actor_id) returning * into s;
 insert into bizoveya_private.generation_spending_events(stage_id,action,amount_micros,actor_id,reason) values(s.id,'reserved',amount,p_actor_id,'Reserved before campaign generation provider request');
 update bizoveya_private.generation_runs set status='running',started_at=coalesce(started_at,clock_timestamp()) where id=r.id;
 return jsonb_build_object('id',s.id,'generationId',s.generation_run_id,'kind',s.kind,'status',s.status,'spendingState',s.spending_state,'reservedMicros',s.reserved_micros,'createdAt',s.created_at);
end;$$;

create function public.bz_finish_campaign_generation_stage(p_stage_id uuid,p_claim uuid,p_output jsonb,p_error_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$
declare s bizoveya_private.generation_stage_runs%rowtype;cost bigint;spend_state text;stage_status text;combined jsonb;
begin
 perform pg_advisory_xact_lock(817030);select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id for update;
 if s.id is null or s.claim<>p_claim then raise exception 'bz_conflict';end if;
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

create or replace function public.bz_admin_spending() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return jsonb_build_object(
 'policies',coalesce((select jsonb_agg(to_jsonb(p)||jsonb_build_object(
  'spentTodayMicros',coalesce((select sum(l.charged_micros) from bizoveya_private.spending_ledger l where l.profile_id=p.profile_id and l.started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0)+coalesce((select sum(g.charged_micros) from bizoveya_private.generation_stage_runs g where g.profile_id=p.profile_id and g.created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0),
  'blocked',exists(select 1 from bizoveya_private.spending_ledger l where l.profile_id=p.profile_id and (l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds')) or exists(select 1 from bizoveya_private.generation_stage_runs g where g.profile_id=p.profile_id and (g.spending_state in('unknown','overrun') or g.spending_state='reserved' and g.created_at<statement_timestamp()-interval '90 seconds'))
 ) order by p.updated_at desc) from bizoveya_private.spending_policies p),'[]'::jsonb),
 'runs',coalesce((select jsonb_agg(to_jsonb(x) order by x.started_at desc) from(
  select run_id,profile_id,policy_version,reserved_micros,charged_micros,state,input_tokens,output_tokens,started_at,finished_at,'model_test'::text run_kind,null::uuid generation_id,null::text stage_kind from bizoveya_private.spending_ledger
  union all select id,profile_id,policy_version,reserved_micros,charged_micros,spending_state,input_tokens,output_tokens,created_at,finished_at,'campaign_stage',generation_run_id,kind from bizoveya_private.generation_stage_runs
  order by started_at desc limit 100)x),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(x) order by x.occurred_at desc) from(
  select id,run_id,action,amount_micros,actor_id,reason,occurred_at,'model_test'::text run_kind from bizoveya_private.spending_events
  union all select id,stage_id,action,amount_micros,actor_id,reason,occurred_at,'campaign_stage' from bizoveya_private.generation_spending_events
  order by occurred_at desc limit 100)x),'[]'::jsonb),
 'policyEvents',coalesce((select jsonb_agg(to_jsonb(x)) from(select * from bizoveya_private.spending_policy_events order by occurred_at desc limit 100)x),'[]'::jsonb));
end;$$;

create or replace function public.bz_admin_reconcile_spending(p_id uuid,p_expected_state text,p_amount_micros bigint,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare l bizoveya_private.spending_ledger;g bizoveya_private.generation_stage_runs%rowtype;begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_reviewed is distinct from true or p_amount_micros is null or p_amount_micros not between 0 and 1000000000 or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_spending';end if;
 perform pg_advisory_xact_lock(817030);select * into l from bizoveya_private.spending_ledger where run_id=p_id for update;select * into g from bizoveya_private.generation_stage_runs where id=p_id for update;
 if l.run_id is not null and g.id is not null then raise exception 'bz_conflict';
 elsif l.run_id is not null then
  if l.state is distinct from p_expected_state or not(l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds') then raise exception 'bz_conflict';end if;
  update bizoveya_private.spending_ledger set state='reconciled',charged_micros=p_amount_micros,finished_at=clock_timestamp() where run_id=p_id;
  insert into bizoveya_private.spending_events(run_id,action,amount_micros,actor_id,reason) values(p_id,'reconciled',p_amount_micros,auth.uid(),btrim(p_reason));
 elsif g.id is not null then
  if g.spending_state is distinct from p_expected_state or not(g.spending_state in('unknown','overrun') or g.spending_state='reserved' and g.created_at<statement_timestamp()-interval '90 seconds') then raise exception 'bz_conflict';end if;
  update bizoveya_private.generation_stage_runs set spending_state='reconciled',charged_micros=p_amount_micros,finished_at=coalesce(finished_at,clock_timestamp()),status=case when status='reserved' then 'failed' else status end,error_code=case when status='reserved' then 'reconciled_without_result' else error_code end where id=p_id;
  insert into bizoveya_private.generation_spending_events(stage_id,action,amount_micros,actor_id,reason) values(p_id,'reconciled',p_amount_micros,auth.uid(),btrim(p_reason));
 else raise exception 'bz_conflict';end if;
 return public.bz_admin_spending();
end;$$;

revoke all on function public.bz_campaign_generation_history(uuid,uuid),public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_finish_campaign_generation_stage(uuid,uuid,jsonb,text,integer,integer),public.bz_admin_spending(),public.bz_admin_reconcile_spending(uuid,text,bigint,text,boolean) from public,anon,authenticated,service_role;
grant execute on function public.bz_campaign_generation_history(uuid,uuid) to authenticated;
grant execute on function public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_finish_campaign_generation_stage(uuid,uuid,jsonb,text,integer,integer) to service_role;
grant execute on function public.bz_admin_spending(),public.bz_admin_reconcile_spending(uuid,text,bigint,text,boolean) to authenticated;
commit;
