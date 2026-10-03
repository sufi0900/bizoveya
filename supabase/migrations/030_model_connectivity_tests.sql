-- P04.0: bounded model connectivity evidence. Does not activate customer agents.
begin;
create table bizoveya_private.model_test_runs (
 id uuid primary key, adapter_version text not null default 'connectivity-v1-ai7.0.127', profile_id uuid not null, profile_version integer not null,
 credential_id text not null references bizoveya_private.model_credentials(id), credential_version integer not null,
 actor_id uuid references auth.users(id) on delete set null, claim uuid not null,
 status text not null default 'running' check(status in('running','passed','failed','unknown')),
 result_code text check(result_code in('response_matched','unexpected_response','provider_error','timeout','interrupted')),
 input_tokens integer check(input_tokens between 0 and 2000000), output_tokens integer check(output_tokens between 0 and 2000000),
 reason text not null check(length(btrim(reason)) between 10 and 300),
 started_at timestamptz not null default clock_timestamp(), finished_at timestamptz,
 expires_at timestamptz not null default clock_timestamp()+interval '90 seconds',
 foreign key(profile_id,profile_version) references bizoveya_private.model_profile_versions(profile_id,version)
);
alter table bizoveya_private.model_test_runs enable row level security;
revoke all on bizoveya_private.model_test_runs from public,anon,authenticated,service_role;
create index on bizoveya_private.model_test_runs(started_at);
create function public.bz_admin_model_tests() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return jsonb_build_object('dailyLimit',5,'usedToday',(select count(*) from bizoveya_private.model_test_runs where started_at >= date_trunc('day',clock_timestamp() at time zone 'UTC') at time zone 'UTC'),'runs',coalesce((select jsonb_agg(x) from (
 select t.id,t.adapter_version,t.profile_id,t.profile_version,t.credential_version,t.actor_id,
 case when t.status='running' and t.expires_at<clock_timestamp() then 'unknown' else t.status end as status,
 t.result_code,t.input_tokens,t.output_tokens,t.reason,t.started_at,t.finished_at,
 (t.status='passed' and t.expires_at is not null and p.version=t.profile_version and c.version=t.credential_version and c.enabled and exists(select 1 from bizoveya_private.model_profile_checks ck where ck.profile_id=p.id and ck.version=p.version and ck.credential_version=c.version)) as current,
 v.document->>'provider' as provider,v.document->>'modelId' as model_id
 from bizoveya_private.model_test_runs t join bizoveya_private.model_profiles p on p.id=t.profile_id join bizoveya_private.model_profile_versions v on v.profile_id=t.profile_id and v.version=t.profile_version join bizoveya_private.model_credentials c on c.id=t.credential_id order by t.started_at desc limit 50
 ) x),'[]'::jsonb));
end;$$;
create function public.bz_admin_begin_model_test(p_id uuid,p_profile_id uuid,p_expected_revision integer,p_expected_credential_version integer,p_claim uuid,p_reviewed boolean,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare p bizoveya_private.model_profiles; c bizoveya_private.model_credentials; d jsonb; old bizoveya_private.model_test_runs;
begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_id is null or p_claim is null or p_reviewed is distinct from true or p_reason is null or length(btrim(p_reason)) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_test';end if;
 perform pg_advisory_xact_lock(817030);
 select * into old from bizoveya_private.model_test_runs where id=p_id;
 if found then
  if old.actor_id is distinct from auth.uid() or old.profile_id is distinct from p_profile_id then raise exception 'bz_conflict';end if;
  return jsonb_build_object('execute',false,'id',old.id);
 end if;
 select * into p from bizoveya_private.model_profiles where id=p_profile_id for share;
 if not found or p.revision is distinct from p_expected_revision then raise exception 'bz_conflict';end if;
 select document into d from bizoveya_private.model_profile_versions where profile_id=p.id and version=p.version;
 select * into c from bizoveya_private.model_credentials where id=d->>'credentialRef' for share;
 if c.version is distinct from p_expected_credential_version then raise exception 'bz_conflict';end if;
 if not c.enabled or not exists(select 1 from bizoveya_private.model_profile_checks ck where ck.profile_id=p.id and ck.version=p.version and ck.credential_version=c.version) then raise exception 'bz_test_not_ready';end if;
 update bizoveya_private.model_test_runs set status='unknown',result_code='interrupted',finished_at=clock_timestamp() where status='running' and expires_at<clock_timestamp();
 if exists(select 1 from bizoveya_private.model_test_runs where status='running') then raise exception 'bz_test_busy';end if;
 if (select count(*) from bizoveya_private.model_test_runs where started_at >= date_trunc('day',clock_timestamp() at time zone 'UTC') at time zone 'UTC')>=5 then raise exception 'bz_test_daily_limit';end if;
 insert into bizoveya_private.model_test_runs(id,profile_id,profile_version,credential_id,credential_version,actor_id,claim,reason) values(p_id,p.id,p.version,c.id,c.version,auth.uid(),p_claim,btrim(p_reason));
 return jsonb_build_object('execute',true,'id',p_id,'document',d);
end;$$;
create function public.bz_finish_model_test(p_id uuid,p_claim uuid,p_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$begin
 if p_code is null or p_code not in('response_matched','unexpected_response','provider_error','timeout') or p_input_tokens not between 0 and 2000000 or p_output_tokens not between 0 and 2000000 then raise exception 'bz_invalid_test';end if;
 update bizoveya_private.model_test_runs set status=case when p_code='response_matched' then 'passed' else 'failed' end,result_code=p_code,input_tokens=p_input_tokens,output_tokens=p_output_tokens,finished_at=clock_timestamp() where id=p_id and claim=p_claim and status='running' and expires_at>=clock_timestamp();
 if not found then raise exception 'bz_test_expired';end if;
end;$$;
revoke all on function public.bz_admin_model_tests(),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text),public.bz_finish_model_test(uuid,uuid,text,integer,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_model_tests(),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) to authenticated;
grant execute on function public.bz_finish_model_test(uuid,uuid,text,integer,integer) to service_role;
commit;
