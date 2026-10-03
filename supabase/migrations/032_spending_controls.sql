-- P04.3.2: USD pricing snapshots and enforced reservations for NEW connectivity tests.
-- Existing tests/history are untouched. Customer draft runtime remains disabled.
begin;
create table bizoveya_private.spending_policies(
 profile_id uuid primary key references bizoveya_private.model_profiles(id),version integer not null check(version>0),
 profile_version integer not null,document jsonb not null,actor_id uuid references auth.users(id) on delete set null,reason text not null,updated_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.spending_policy_events(id uuid primary key default gen_random_uuid(),profile_id uuid not null,version integer not null,document jsonb not null,actor_id uuid references auth.users(id) on delete set null,reason text not null,occurred_at timestamptz not null default clock_timestamp());
create table bizoveya_private.spending_ledger(
 run_id uuid primary key references bizoveya_private.model_test_runs(id),profile_id uuid not null references bizoveya_private.model_profiles(id),policy_version integer not null,
 policy_snapshot jsonb not null,reserved_micros bigint not null check(reserved_micros>=0),charged_micros bigint not null check(charged_micros>=0),
 state text not null check(state in('reserved','settled','unknown','overrun','reconciled')),input_tokens integer,output_tokens integer,
 started_at timestamptz not null default clock_timestamp(),finished_at timestamptz
);
create table bizoveya_private.spending_events(id uuid primary key default gen_random_uuid(),run_id uuid not null references bizoveya_private.spending_ledger(run_id),action text not null,amount_micros bigint not null,actor_id uuid references auth.users(id) on delete set null,reason text not null,occurred_at timestamptz not null default clock_timestamp());
alter table bizoveya_private.spending_policies enable row level security;alter table bizoveya_private.spending_policy_events enable row level security;alter table bizoveya_private.spending_ledger enable row level security;alter table bizoveya_private.spending_events enable row level security;
revoke all on bizoveya_private.spending_policies,bizoveya_private.spending_policy_events,bizoveya_private.spending_ledger,bizoveya_private.spending_events from public,anon,authenticated,service_role;
create function bizoveya_private.valid_spending_document(d jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare k text;begin
 if jsonb_typeof(d)<>'object' or (select count(*) from jsonb_object_keys(d))<>9 then return false;end if;
 for k in select jsonb_object_keys(d) loop if k not in('enabled','inputRateMicros','outputRateMicros','requestFeeMicros','dailyLimitMicros','runLimitMicros','validUntil','source','reviewed') then return false;end if;end loop;
 if jsonb_typeof(d->'validUntil') is distinct from 'string' or jsonb_typeof(d->'source') is distinct from 'string' or jsonb_typeof(d->'reviewed') is distinct from 'boolean' or jsonb_typeof(d->'enabled')<>'boolean' or d->>'reviewed'<>'true' or length(d->>'source') not between 8 and 300 or d->>'source' !~ '^https://[^[:space:]]+$' then return false;end if;
 foreach k in array array['inputRateMicros','outputRateMicros','requestFeeMicros','dailyLimitMicros','runLimitMicros'] loop if jsonb_typeof(d->k)<>'number' or (d->>k)!~ '^[0-9]+$' or (d->>k)::numeric>1000000000 then return false;end if;end loop;
 if (d->>'dailyLimitMicros')::bigint<1 or (d->>'runLimitMicros')::bigint<1 or (d->>'runLimitMicros')::bigint>(d->>'dailyLimitMicros')::bigint then return false;end if;
 perform (d->>'validUntil')::timestamptz;return true;
 exception when others then return false;end;$$;
create function public.bz_admin_spending() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return jsonb_build_object('policies',coalesce((select jsonb_agg(to_jsonb(p)||jsonb_build_object('spentTodayMicros',coalesce((select sum(l.charged_micros) from bizoveya_private.spending_ledger l where l.profile_id=p.profile_id and l.started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0),'blocked',exists(select 1 from bizoveya_private.spending_ledger l where l.profile_id=p.profile_id and (l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds'))) order by p.updated_at desc) from bizoveya_private.spending_policies p),'[]'::jsonb),
 'runs',coalesce((select jsonb_agg(to_jsonb(x)) from(select * from bizoveya_private.spending_ledger order by started_at desc limit 100)x),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(x)) from(select * from bizoveya_private.spending_events order by occurred_at desc limit 100)x),'[]'::jsonb),
 'policyEvents',coalesce((select jsonb_agg(to_jsonb(x)) from(select * from bizoveya_private.spending_policy_events order by occurred_at desc limit 100)x),'[]'::jsonb));
end;$$;
create function public.bz_admin_save_spending(p_profile_id uuid,p_profile_revision integer,p_expected_version integer,p_document jsonb,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare p bizoveya_private.model_profiles;v integer;begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_reviewed is distinct from true or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' or bizoveya_private.valid_spending_document(p_document) is distinct from true then raise exception 'bz_invalid_spending';end if;
 if (p_document->>'validUntil')::timestamptz<=statement_timestamp() or (p_document->>'validUntil')::timestamptz>statement_timestamp()+interval '30 days' then raise exception 'bz_pricing_expired';end if;
 perform pg_advisory_xact_lock(817030);select * into p from bizoveya_private.model_profiles where id=p_profile_id for share;
 if p.id is null or p.revision is distinct from p_profile_revision then raise exception 'bz_conflict';end if;
 select version into v from bizoveya_private.spending_policies where profile_id=p.id for update;
 if coalesce(v,0) is distinct from p_expected_version then raise exception 'bz_conflict';end if;
 v:=coalesce(v,0)+1;
 insert into bizoveya_private.spending_policies values(p.id,v,p.version,p_document,auth.uid(),btrim(p_reason),clock_timestamp()) on conflict(profile_id) do update set version=excluded.version,profile_version=excluded.profile_version,document=excluded.document,actor_id=excluded.actor_id,reason=excluded.reason,updated_at=excluded.updated_at;
 insert into bizoveya_private.spending_policy_events(profile_id,version,document,actor_id,reason) values(p.id,v,p_document,auth.uid(),btrim(p_reason));return public.bz_admin_spending();
end;$$;
-- Close the old bypass: same external signature now requires pricing and a reservation.
alter function public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) set schema bizoveya_private;
alter function bizoveya_private.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) rename to begin_model_test_legacy;
revoke all on function bizoveya_private.begin_model_test_legacy(uuid,uuid,integer,integer,uuid,boolean,text) from public,anon,authenticated,service_role;
create function public.bz_admin_begin_model_test(p_id uuid,p_profile_id uuid,p_expected_revision integer,p_expected_credential_version integer,p_claim uuid,p_reviewed boolean,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare p bizoveya_private.model_profiles;b bizoveya_private.spending_policies;amount bigint;spent bigint;r jsonb;begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);
 -- Existing ID replay goes through original authorization checks and never spends again.
 if exists(select 1 from bizoveya_private.model_test_runs where id=p_id) then return bizoveya_private.begin_model_test_legacy(p_id,p_profile_id,p_expected_revision,p_expected_credential_version,p_claim,p_reviewed,p_reason);end if;
 select * into p from bizoveya_private.model_profiles where id=p_profile_id for share;
 select * into b from bizoveya_private.spending_policies where profile_id=p_profile_id for share;
 if b.profile_id is null or b.profile_version<>p.version or b.document->>'enabled'<>'true' then raise exception 'bz_spending_not_ready';end if;
 if (b.document->>'validUntil')::timestamptz<=statement_timestamp() then raise exception 'bz_pricing_expired';end if;
 if exists(select 1 from bizoveya_private.spending_ledger where profile_id=p_profile_id and (state in('unknown','overrun') or state='reserved' and started_at<statement_timestamp()-interval '90 seconds')) then raise exception 'bz_spending_unresolved';end if;
 -- Fixed synthetic prompt: conservative4096 input bound,128 output bound,25%margin plus declared per-request fee.
 amount:=ceil(((4096::numeric*(b.document->>'inputRateMicros')::numeric+128::numeric*(b.document->>'outputRateMicros')::numeric)/1000000+(b.document->>'requestFeeMicros')::numeric)*1.25);
 if amount>(b.document->>'runLimitMicros')::bigint then raise exception 'bz_run_budget';end if;
 select coalesce(sum(charged_micros),0) into spent from bizoveya_private.spending_ledger where profile_id=p_profile_id and started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC';
 if spent+amount>least((b.document->>'dailyLimitMicros')::bigint,(select (document->>'dailyBudgetCents')::bigint*10000 from bizoveya_private.model_profile_versions where profile_id=p.id and version=p.version)) then raise exception 'bz_daily_budget';end if;
 r:=bizoveya_private.begin_model_test_legacy(p_id,p_profile_id,p_expected_revision,p_expected_credential_version,p_claim,p_reviewed,p_reason);
 insert into bizoveya_private.spending_ledger(run_id,profile_id,policy_version,policy_snapshot,reserved_micros,charged_micros,state) values(p_id,p.id,b.version,b.document,amount,amount,'reserved');
 insert into bizoveya_private.spending_events(run_id,action,amount_micros,actor_id,reason) values(p_id,'reserved',amount,auth.uid(),btrim(p_reason));return r;
end;$$;
alter function public.bz_finish_model_test(uuid,uuid,text,integer,integer) set schema bizoveya_private;
alter function bizoveya_private.bz_finish_model_test(uuid,uuid,text,integer,integer) rename to finish_model_test_legacy;
revoke all on function bizoveya_private.finish_model_test_legacy(uuid,uuid,text,integer,integer) from public,anon,authenticated,service_role;
create function public.bz_finish_model_test(p_id uuid,p_claim uuid,p_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$
declare l bizoveya_private.spending_ledger;cost bigint;state_ text;begin
 perform pg_advisory_xact_lock(817030);select * into l from bizoveya_private.spending_ledger where run_id=p_id for update;
 -- In-flight legacy tests may finish, but are explicitly absent from this ledger.
 perform bizoveya_private.finish_model_test_legacy(p_id,p_claim,p_code,p_input_tokens,p_output_tokens);
 if l.run_id is null then return;end if;
 if p_input_tokens is null or p_output_tokens is null then cost:=l.reserved_micros;state_:='unknown';
 else cost:=ceil((p_input_tokens::numeric*(l.policy_snapshot->>'inputRateMicros')::numeric+p_output_tokens::numeric*(l.policy_snapshot->>'outputRateMicros')::numeric)/1000000+(l.policy_snapshot->>'requestFeeMicros')::numeric);state_:=case when cost>l.reserved_micros or p_input_tokens>4096 or p_output_tokens>128 then 'overrun' else 'settled' end;end if;
 update bizoveya_private.spending_ledger set charged_micros=cost,state=state_,input_tokens=p_input_tokens,output_tokens=p_output_tokens,finished_at=clock_timestamp() where run_id=p_id;
 insert into bizoveya_private.spending_events(run_id,action,amount_micros,reason) values(p_id,state_,cost,'Server-recorded model usage; USD estimate from captured pricing');
end;$$;
create function public.bz_admin_reconcile_spending(p_id uuid,p_expected_state text,p_amount_micros bigint,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare l bizoveya_private.spending_ledger;begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_reviewed is distinct from true or p_amount_micros is null or p_amount_micros not between 0 and 1000000000 or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_spending';end if;
 perform pg_advisory_xact_lock(817030);select * into l from bizoveya_private.spending_ledger where run_id=p_id for update;
 if l.run_id is null or l.state is distinct from p_expected_state or not(l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds') then raise exception 'bz_conflict';end if;
 update bizoveya_private.spending_ledger set state='reconciled',charged_micros=p_amount_micros,finished_at=clock_timestamp() where run_id=p_id;
 insert into bizoveya_private.spending_events(run_id,action,amount_micros,actor_id,reason) values(p_id,'reconciled',p_amount_micros,auth.uid(),btrim(p_reason));return public.bz_admin_spending();
end;$$;
revoke all on function bizoveya_private.valid_spending_document(jsonb),public.bz_admin_spending(),public.bz_admin_save_spending(uuid,integer,integer,jsonb,text,boolean),public.bz_admin_reconcile_spending(uuid,text,bigint,text,boolean),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text),public.bz_finish_model_test(uuid,uuid,text,integer,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_spending(),public.bz_admin_save_spending(uuid,integer,integer,jsonb,text,boolean),public.bz_admin_reconcile_spending(uuid,text,bigint,text,boolean),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) to authenticated;
grant execute on function public.bz_finish_model_test(uuid,uuid,text,integer,integer) to service_role;
commit;
