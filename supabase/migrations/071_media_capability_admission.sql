-- Turn 1/5: independent media qualification and durable one-attempt admission.
-- No credential values, ephemeral tokens, provider requests or customer publication.
begin;
create table bizoveya_private.media_capabilities(
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 capability text not null check(capability in('image','live-voice')),
 version integer not null check(version between 1 and 50), enabled boolean not null,
 document jsonb not null, actor_id uuid not null references auth.users(id),updated_at timestamptz not null default clock_timestamp(),
 primary key(site_id,capability)
);
create table bizoveya_private.media_capability_events(
 operation_id uuid primary key,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 capability text not null,version integer not null,command jsonb not null,actor_id uuid not null references auth.users(id),created_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.media_requests(
 id uuid primary key,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 actor_id uuid not null references auth.users(id),capability text not null check(capability in('image','live-voice')),
 qualification_version integer not null,profile_id uuid not null references bizoveya_private.model_profiles(id),policy_version integer not null,
 snapshot jsonb not null,command jsonb not null,request_hash text not null,
 status text not null check(status in('reserved','claimed','running','issued','succeeded','failed','cancelled')),
 spending_state text not null check(spending_state in('reserved','settled','unknown','overrun','reconciled')),
 reserved_micros bigint not null check(reserved_micros>=0),charged_micros bigint not null check(charged_micros>=0),
 claim uuid,provider_started_at timestamptz,input_tokens integer,output_tokens integer,receipt jsonb,error_code text,
 created_at timestamptz not null default clock_timestamp(),expires_at timestamptz not null,finished_at timestamptz,
 check(input_tokens is null or input_tokens between 0 and 2000000),check(output_tokens is null or output_tokens between 0 and 2000000)
);
create index media_request_budget_idx on bizoveya_private.media_requests(profile_id,created_at);
create index media_request_site_capability_idx on bizoveya_private.media_requests(site_id,capability,created_at);
create table bizoveya_private.media_request_events(
 id uuid primary key default gen_random_uuid(),request_id uuid not null references bizoveya_private.media_requests(id) on delete cascade,
 action text not null,state text not null,amount_micros bigint not null check(amount_micros>=0),details jsonb not null,created_at timestamptz not null default clock_timestamp()
);
create index media_request_events_request_idx on bizoveya_private.media_request_events(request_id,created_at);
alter table bizoveya_private.media_capabilities enable row level security;
alter table bizoveya_private.media_capability_events enable row level security;
alter table bizoveya_private.media_requests enable row level security;
alter table bizoveya_private.media_request_events enable row level security;
revoke all on bizoveya_private.media_capabilities,bizoveya_private.media_capability_events,bizoveya_private.media_requests,bizoveya_private.media_request_events from public,anon,authenticated,service_role;
create trigger media_capability_events_immutable before update on bizoveya_private.media_capability_events for each row execute function bizoveya_private.agency_handoff_immutable();
create trigger media_request_events_immutable before update on bizoveya_private.media_request_events for each row execute function bizoveya_private.agency_handoff_immutable();

create function bizoveya_private.valid_media_capability(d jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare k text;begin
 if d is null or jsonb_typeof(d) is distinct from 'object' or (select count(*) from jsonb_object_keys(d))<>18 then return false;end if;
 if not(d ?& array['provider','modelId','credentialRef','credentialVersion','budgetProfileId','costMode','inputTokenLimit','outputTokenLimit','durationSeconds','maxDailyRequests','maxConcurrent','inputRateMicros','outputRateMicros','requestFeeMicros','validUntil','evidenceUrl','apiVerified','commercialReviewed']) then return false;end if;
 if jsonb_typeof(d->'provider') is distinct from 'string' or jsonb_typeof(d->'credentialRef') is distinct from 'string' or d->>'provider' not in('gemini','openai') or d->>'credentialRef'<>('platform-'||(d->>'provider')) or jsonb_typeof(d->'modelId') is distinct from 'string' or d->>'modelId' !~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$' then return false;end if;
 if jsonb_typeof(d->'costMode') is distinct from 'string' or d->>'costMode' not in('free-attested','metered') or d->'apiVerified' is distinct from 'true'::jsonb or d->'commercialReviewed' is distinct from 'true'::jsonb then return false;end if;
 if jsonb_typeof(d->'evidenceUrl') is distinct from 'string' or length(d->>'evidenceUrl') not between 8 and 300 or d->>'evidenceUrl' !~ '^https://[^[:space:]]+$' then return false;end if;
 perform (d->>'budgetProfileId')::uuid;perform (d->>'validUntil')::timestamptz;
 if d->>'budgetProfileId' is null or d->>'validUntil' is null then return false;end if;
 foreach k in array array['credentialVersion','inputTokenLimit','outputTokenLimit','durationSeconds','maxDailyRequests','maxConcurrent','inputRateMicros','outputRateMicros','requestFeeMicros'] loop
  if jsonb_typeof(d->k) is distinct from 'number' or d->>k !~ '^[0-9]+$' or (d->>k)::numeric>1000000000 then return false;end if;
 end loop;
 if (d->>'credentialVersion')::integer<1 or (d->>'inputTokenLimit')::integer not between 256 and 100000 or (d->>'outputTokenLimit')::integer not between 128 and 16000 or (d->>'durationSeconds')::integer not between 30 and 120 or (d->>'maxDailyRequests')::integer not between 1 and 50 or (d->>'maxConcurrent')::integer not between 1 and 3 then return false;end if;
 if d->>'costMode'='free-attested' and ((d->>'inputRateMicros')::bigint<>0 or (d->>'outputRateMicros')::bigint<>0 or (d->>'requestFeeMicros')::bigint<>0) then return false;end if;
 return true;exception when others then return false;end;$$;

create function bizoveya_private.media_budget_total(p_profile uuid) returns bigint language sql security definer set search_path='' as $$
 select coalesce((select sum(charged_micros) from bizoveya_private.spending_ledger where profile_id=p_profile and started_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0)
 +coalesce((select sum(charged_micros) from bizoveya_private.generation_stage_runs where profile_id=p_profile and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0)
 +coalesce((select sum(charged_micros) from bizoveya_private.meeting_turn_runs where profile_id=p_profile and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0)
 +coalesce((select sum(charged_micros) from bizoveya_private.media_requests where profile_id=p_profile and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC'),0);
$$;
create function bizoveya_private.check_media_budget(p_profile uuid) returns void language plpgsql security definer set search_path='' as $$
declare policy_ jsonb;profile_ jsonb;begin
 if exists(select 1 from bizoveya_private.media_requests where profile_id=p_profile and (spending_state in('unknown','overrun') or spending_state='reserved' and expires_at<=statement_timestamp())) then raise exception 'bz_spending_unresolved';end if;
 select document into policy_ from bizoveya_private.spending_policies where profile_id=p_profile;
 select v.document into profile_ from bizoveya_private.model_profiles p join bizoveya_private.model_profile_versions v on v.profile_id=p.id and v.version=p.version where p.id=p_profile;
 if bizoveya_private.media_budget_total(p_profile)>least((policy_->>'dailyLimitMicros')::bigint,(profile_->>'dailyBudgetCents')::bigint*10000) then raise exception 'bz_daily_budget';end if;
end;$$;
create function bizoveya_private.media_qualification(p_site uuid,p_capability text) returns bizoveya_private.media_capabilities language plpgsql security definer set search_path='' as $$
declare q bizoveya_private.media_capabilities;sp bizoveya_private.spending_policies;begin
 select * into q from bizoveya_private.media_capabilities where site_id=p_site and capability=p_capability;
 if q.site_id is null or not q.enabled or (q.document->>'validUntil')::timestamptz<=statement_timestamp() then raise exception 'bz_media_unqualified';end if;
 if not exists(select 1 from bizoveya_private.model_credentials where id=q.document->>'credentialRef' and enabled and version=(q.document->>'credentialVersion')::integer) then raise exception 'bz_media_credential_changed';end if;
 select * into sp from bizoveya_private.spending_policies where profile_id=(q.document->>'budgetProfileId')::uuid;
 if sp.profile_id is null or sp.document->'enabled' is distinct from 'true'::jsonb or (sp.document->>'validUntil')::timestamptz<=statement_timestamp() or not exists(select 1 from bizoveya_private.model_profiles p join bizoveya_private.model_profile_checks c on c.profile_id=p.id and c.version=p.version where p.id=sp.profile_id and p.version=sp.profile_version) then raise exception 'bz_media_budget_unqualified';end if;
 return q;
end;$$;
create function bizoveya_private.media_request_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('id',id,'siteId',site_id,'actorId',actor_id,'capability',capability,'qualificationVersion',qualification_version,'profileId',profile_id,'status',status,'spendingState',spending_state,'reservedMicros',reserved_micros,'chargedMicros',charged_micros,'inputTokens',input_tokens,'outputTokens',output_tokens,'providerStarted',provider_started_at is not null,'expiresAt',expires_at,'createdAt',created_at,'finishedAt',finished_at,'receipt',receipt,'errorCode',error_code,'requestHash',request_hash) from bizoveya_private.media_requests where id=p_id;
$$;
create function public.bz_media_inventory(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$begin
 if bizoveya_private.workspace_role(p_workspace_id) is null or not exists(select 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id) then raise exception 'bz_forbidden';end if;
 return jsonb_build_object('capabilities',coalesce((select jsonb_agg(jsonb_build_object('siteId',site_id,'capability',capability,'version',version,'enabled',enabled,'document',document,'actorId',actor_id,'updatedAt',updated_at) order by capability) from bizoveya_private.media_capabilities where site_id=p_site_id),'[]'::jsonb),'requests',coalesce((select jsonb_agg(bizoveya_private.media_request_json(x.id) order by x.created_at desc) from(select id,created_at from bizoveya_private.media_requests where site_id=p_site_id order by created_at desc limit 100)x),'[]'::jsonb));
end;$$;
create function public.bz_admin_review_media_capability(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare q bizoveya_private.media_capabilities;e bizoveya_private.media_capability_events;operation_ uuid;cap_ text;version_ integer;doc_ jsonb;begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);
 if bizoveya_private.workspace_role(p_workspace_id) is distinct from 'owner' or not exists(select 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id) then raise exception 'bz_forbidden';end if;
 if p_input is null or jsonb_typeof(p_input)<>'object' or not(p_input ?& array['operationId','capability','expectedVersion','action','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or p_input->>'capability' not in('image','live-voice') or p_input->>'action' not in('qualify','pause') or length(btrim(coalesce(p_input->>'reason',''))) not between 10 and 500 or p_input->>'reason' ~ '[\x01-\x1F]' or (select count(*) from jsonb_object_keys(p_input))<>(case when p_input->>'action'='qualify' then 7 else 6 end) then raise exception 'bz_invalid_media_capability';end if;
 begin operation_:=(p_input->>'operationId')::uuid;version_:=(p_input->>'expectedVersion')::integer;exception when others then raise exception 'bz_invalid_media_capability';end;
 if operation_ is null or version_ is null or version_<0 then raise exception 'bz_invalid_media_capability';end if;
 cap_:=p_input->>'capability';select * into e from bizoveya_private.media_capability_events where operation_id=operation_;
 if e.operation_id is not null then if e.site_id=p_site_id and e.capability=cap_ and e.actor_id=auth.uid() and e.command=p_input then return public.bz_media_inventory(p_workspace_id,p_site_id);end if;raise exception 'bz_conflict';end if;
 select * into q from bizoveya_private.media_capabilities where site_id=p_site_id and capability=cap_;
 if coalesce(q.version,0)<>version_ then raise exception 'bz_conflict';end if;
 if p_input->>'action'='pause' then
  if q.site_id is null then raise exception 'bz_media_unqualified';end if;
  update bizoveya_private.media_capabilities set enabled=false,actor_id=auth.uid(),updated_at=clock_timestamp() where site_id=p_site_id and capability=cap_;
 else
  doc_:=p_input->'document';if bizoveya_private.valid_media_capability(doc_) is distinct from true or version_>=50 then raise exception 'bz_invalid_media_capability';end if;
  if (doc_->>'validUntil')::timestamptz<=statement_timestamp() or (doc_->>'validUntil')::timestamptz>statement_timestamp()+interval '7 days' then raise exception 'bz_media_qualification_expired';end if;
  insert into bizoveya_private.media_capabilities(site_id,capability,version,enabled,document,actor_id) values(p_site_id,cap_,version_+1,true,doc_,auth.uid()) on conflict(site_id,capability) do update set version=excluded.version,enabled=true,document=excluded.document,actor_id=excluded.actor_id,updated_at=clock_timestamp();
  perform bizoveya_private.media_qualification(p_site_id,cap_);version_:=version_+1;
 end if;
 insert into bizoveya_private.media_capability_events(operation_id,site_id,capability,version,command,actor_id) values(operation_,p_site_id,cap_,version_,p_input,auth.uid());
 return public.bz_media_inventory(p_workspace_id,p_site_id);
end;$$;

create function public.bz_admit_media_request(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare q bizoveya_private.media_capabilities;r bizoveya_private.media_requests;sp bizoveya_private.spending_policies;id_ uuid;cap_ text;amount_ bigint;doc_ jsonb;duration_ integer;begin
 perform pg_advisory_xact_lock(817030);
 if bizoveya_private.workspace_role(p_workspace_id) is distinct from 'owner' or not exists(select 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id) then raise exception 'bz_forbidden';end if;
 if p_input is null or jsonb_typeof(p_input)<>'object' or (select count(*) from jsonb_object_keys(p_input))<>5 or not(p_input ?& array['id','capability','expectedQualificationVersion','document','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or p_input->>'capability' not in('image','live-voice') then raise exception 'bz_invalid_media_request';end if;
 begin id_:=(p_input->>'id')::uuid;exception when others then raise exception 'bz_invalid_media_request';end;
 if id_ is null then raise exception 'bz_invalid_media_request';end if;
 cap_:=p_input->>'capability';select * into r from bizoveya_private.media_requests where id=id_;
 if r.id is not null then if r.site_id=p_site_id and r.actor_id=auth.uid() and r.command=p_input then return bizoveya_private.media_request_json(r.id)||jsonb_build_object('execute',false);end if;raise exception 'bz_conflict';end if;
 q:=bizoveya_private.media_qualification(p_site_id,cap_);
 if p_input->'expectedQualificationVersion' is distinct from to_jsonb(q.version) then raise exception 'bz_conflict';end if;
 doc_:=p_input->'document';
 if cap_='image' then
  if jsonb_typeof(doc_) is distinct from 'object' or not(doc_ ?& array['prompt','aspectRatio']) or jsonb_typeof(doc_->'aspectRatio') is distinct from 'string' or (select count(*) from jsonb_object_keys(doc_))<>2 or jsonb_typeof(doc_->'prompt') is distinct from 'string' or length(btrim(doc_->>'prompt')) not between 10 and 2000 or doc_->>'prompt' ~ '[\x01-\x1F]' or doc_->>'aspectRatio' not in('1:1','2:3','3:2','3:4','4:3','9:16','16:9') or octet_length(doc_->>'prompt')>(q.document->>'inputTokenLimit')::integer then raise exception 'bz_invalid_media_request';end if;
 else
  if doc_ is distinct from '{"purpose":"founder-assistant"}'::jsonb then raise exception 'bz_invalid_media_request';end if;
 end if;
 if (select count(*) from bizoveya_private.media_requests where site_id=p_site_id and capability=cap_ and created_at>=date_trunc('day',statement_timestamp() at time zone 'UTC') at time zone 'UTC')>=(q.document->>'maxDailyRequests')::integer then raise exception 'bz_media_daily_quota';end if;
 if (select count(*) from bizoveya_private.media_requests where site_id=p_site_id and capability=cap_ and status in('reserved','claimed','running','issued'))>=(q.document->>'maxConcurrent')::integer then raise exception 'bz_media_concurrency';end if;
 select * into sp from bizoveya_private.spending_policies where profile_id=(q.document->>'budgetProfileId')::uuid;
 perform bizoveya_private.check_media_budget(sp.profile_id);
 if exists(select 1 from bizoveya_private.spending_ledger where profile_id=sp.profile_id and (state in('unknown','overrun') or state='reserved' and started_at<statement_timestamp()-interval '90 seconds')) or exists(select 1 from bizoveya_private.generation_stage_runs where profile_id=sp.profile_id and (spending_state in('unknown','overrun') or spending_state='reserved' and created_at<statement_timestamp()-interval '90 seconds')) or exists(select 1 from bizoveya_private.meeting_turn_runs where profile_id=sp.profile_id and (spending_state in('unknown','overrun') or spending_state='reserved' and created_at<statement_timestamp()-interval '90 seconds')) then raise exception 'bz_spending_unresolved';end if;
 amount_:=ceil(((q.document->>'inputTokenLimit')::numeric*(q.document->>'inputRateMicros')::numeric+(q.document->>'outputTokenLimit')::numeric*(q.document->>'outputRateMicros')::numeric)/1000000+(q.document->>'requestFeeMicros')::numeric);
 if amount_>(sp.document->>'runLimitMicros')::bigint then raise exception 'bz_run_budget';end if;
 duration_:=(q.document->>'durationSeconds')::integer;
 insert into bizoveya_private.media_requests(id,site_id,actor_id,capability,qualification_version,profile_id,policy_version,snapshot,command,request_hash,status,spending_state,reserved_micros,charged_micros,expires_at)
 values(id_,p_site_id,auth.uid(),cap_,q.version,sp.profile_id,sp.version,jsonb_build_object('qualification',q.document,'budgetPolicy',sp.document),p_input,encode(sha256(convert_to(p_input::text,'UTF8')),'hex'),'reserved','reserved',amount_,amount_,statement_timestamp()+make_interval(secs=>duration_+30));
 perform bizoveya_private.check_media_budget(sp.profile_id);
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(id_,'admitted','reserved',amount_,jsonb_build_object('qualificationVersion',q.version,'accountingBasis',q.document->>'costMode'));
 return bizoveya_private.media_request_json(id_)||jsonb_build_object('execute',false);
end;$$;

create function bizoveya_private.check_media_request_actor(r bizoveya_private.media_requests,p_actor uuid) returns void language plpgsql security definer set search_path='' as $$
declare q bizoveya_private.media_capabilities;workspace_ uuid;begin
 select workspace_id into workspace_ from public.bizoveya_sites where id=r.site_id;
 if p_actor is null or r.actor_id is distinct from p_actor or not exists(select 1 from public.bizoveya_memberships where workspace_id=workspace_ and user_id=p_actor and role='owner') then raise exception 'bz_forbidden';end if;
 q:=bizoveya_private.media_qualification(r.site_id,r.capability);
 if q.version<>r.qualification_version or q.document is distinct from r.snapshot->'qualification' or (select version from bizoveya_private.spending_policies where profile_id=r.profile_id) is distinct from r.policy_version then raise exception 'bz_media_qualification_changed';end if;
 if r.expires_at<=statement_timestamp() then raise exception 'bz_media_request_expired';end if;
end;$$;
create function public.bz_claim_media_request(p_id uuid,p_claim uuid,p_actor uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;begin
 if p_id is null or p_claim is null or p_actor is null then raise exception 'bz_invalid_media_request';end if;
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;
 if r.id is null then raise exception 'bz_media_unavailable';end if;
 perform bizoveya_private.check_media_request_actor(r,p_actor);
 if r.status<>'reserved' then return jsonb_build_object('id',r.id,'execute',false);end if;
 perform bizoveya_private.check_media_budget(r.profile_id);
 update bizoveya_private.media_requests set status='claimed',claim=p_claim where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'claimed','reserved',r.reserved_micros,'{}');
 return jsonb_build_object('id',r.id,'execute',true,'actorId',r.actor_id,'siteId',r.site_id,'capability',r.capability,'document',r.command->'document','qualification',r.snapshot->'qualification','requestHash',r.request_hash,'expiresAt',r.expires_at);
end;$$;
create function public.bz_start_media_provider(p_id uuid,p_claim uuid,p_actor uuid) returns void language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;
 if r.id is null or p_claim is null or r.claim is distinct from p_claim or r.status<>'claimed' or r.provider_started_at is not null then raise exception 'bz_conflict';end if;
 perform bizoveya_private.check_media_request_actor(r,p_actor);perform bizoveya_private.check_media_budget(r.profile_id);
 update bizoveya_private.media_requests set status='running',provider_started_at=clock_timestamp(),expires_at=statement_timestamp()+make_interval(secs=>(r.snapshot#>>'{qualification,durationSeconds}')::integer) where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'provider_started','reserved',r.reserved_micros,jsonb_build_object('requestHash',r.request_hash));
end;$$;
create function public.bz_finish_media_request(p_id uuid,p_claim uuid,p_succeeded boolean,p_input_tokens integer,p_output_tokens integer,p_receipt jsonb,p_error text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;cost_ bigint;state_ text;status_ text;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;
 if r.id is null or p_claim is null or r.claim is distinct from p_claim then raise exception 'bz_conflict';end if;
 if r.status not in('running','issued') then return bizoveya_private.media_request_json(r.id);end if;
 if r.status='issued' then raise exception 'bz_media_session_active';end if;
 if p_succeeded is null or p_input_tokens is not null and p_input_tokens not between 0 and 2000000 or p_output_tokens is not null and p_output_tokens not between 0 and 2000000 or p_error is not null and p_error !~ '^[a-z_]{1,80}$' then raise exception 'bz_invalid_media_result';end if;
 if p_receipt is not null and (jsonb_typeof(p_receipt)<>'object' or octet_length(p_receipt::text)>2000 or exists(select 1 from jsonb_object_keys(p_receipt) k where k not in('artifactHash','mime','tokenExpiresAt'))) then raise exception 'bz_invalid_media_result';end if;
 if p_succeeded then
  if r.capability='image' and (p_receipt->>'artifactHash' is null or p_receipt->>'artifactHash' !~ '^[a-f0-9]{64}$' or p_receipt->>'mime' is null or p_receipt->>'mime' not in('image/png','image/jpeg')) then raise exception 'bz_invalid_media_result';end if;
  if r.capability='live-voice' then
   if p_receipt->>'tokenExpiresAt' is null or (p_receipt->>'tokenExpiresAt')::timestamptz>r.expires_at or (p_receipt->>'tokenExpiresAt')::timestamptz<=statement_timestamp() then raise exception 'bz_invalid_media_result';end if;
   update bizoveya_private.media_requests set status='issued',receipt=p_receipt where id=r.id;
   insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'token_issued','reserved',r.reserved_micros,p_receipt);
   return bizoveya_private.media_request_json(r.id);
  end if;
 end if;
 if p_input_tokens is null or p_output_tokens is null then cost_:=r.reserved_micros;state_:='unknown';
 else cost_:=ceil((p_input_tokens::numeric*(r.snapshot#>>'{qualification,inputRateMicros}')::numeric+p_output_tokens::numeric*(r.snapshot#>>'{qualification,outputRateMicros}')::numeric)/1000000+(r.snapshot#>>'{qualification,requestFeeMicros}')::numeric);state_:=case when cost_>r.reserved_micros or p_input_tokens>(r.snapshot#>>'{qualification,inputTokenLimit}')::integer or p_output_tokens>(r.snapshot#>>'{qualification,outputTokenLimit}')::integer then 'overrun' else 'settled' end;end if;
 status_:=case when p_succeeded and state_='settled' then 'succeeded' else 'failed' end;
 update bizoveya_private.media_requests set status=status_,spending_state=state_,charged_micros=cost_,input_tokens=p_input_tokens,output_tokens=p_output_tokens,receipt=p_receipt,error_code=case when status_='succeeded' then null else coalesce(p_error,state_) end,finished_at=clock_timestamp() where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'finished',state_,cost_,jsonb_build_object('inputTokens',p_input_tokens,'outputTokens',p_output_tokens));
 return bizoveya_private.media_request_json(r.id);
end;$$;
create function public.bz_cancel_unstarted_media_request(p_id uuid,p_actor uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;
 if r.id is null or p_actor is null or r.actor_id is distinct from p_actor then raise exception 'bz_forbidden';end if;
 if r.provider_started_at is not null then raise exception 'bz_media_provider_started';end if;
 if r.status not in('reserved','claimed') then return bizoveya_private.media_request_json(r.id);end if;
 update bizoveya_private.media_requests set status='cancelled',spending_state='settled',charged_micros=0,input_tokens=0,output_tokens=0,error_code='preflight_failed',finished_at=clock_timestamp() where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'cancelled_unstarted','settled',0,'{"providerCalled":false}');
 return bizoveya_private.media_request_json(r.id);
end;$$;
create function public.bz_admin_recover_media_request(p_id uuid,p_expected_state text,p_action text,p_amount_micros bigint,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;workspace_ uuid;state_ text;amount_ bigint;begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;select workspace_id into workspace_ from public.bizoveya_sites where id=r.site_id;
 if r.id is null or bizoveya_private.workspace_role(workspace_) is distinct from 'owner' then raise exception 'bz_forbidden';end if;
 if p_reviewed is distinct from true or p_expected_state is null or p_action is null or p_action not in('recover','reconcile') or length(btrim(coalesce(p_reason,''))) not between 10 and 500 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_media_recovery';end if;
 if r.spending_state is distinct from p_expected_state then raise exception 'bz_conflict';end if;
 if p_action='reconcile' then
  if r.spending_state not in('unknown','overrun') or p_amount_micros is null or p_amount_micros not between 0 and 1000000000 then raise exception 'bz_invalid_media_recovery';end if;state_:='reconciled';amount_:=p_amount_micros;
 else
  if p_amount_micros is not null or r.spending_state<>'reserved' or r.expires_at>statement_timestamp() then raise exception 'bz_media_request_active';end if;
  if r.provider_started_at is null then state_:='settled';amount_:=0;else state_:='unknown';amount_:=r.reserved_micros;end if;
 end if;
 update bizoveya_private.media_requests set status=case when status='succeeded' then status else 'failed' end,spending_state=state_,charged_micros=amount_,finished_at=clock_timestamp(),error_code=case when state_='unknown' then 'interrupted_usage_unknown' else coalesce(error_code,'recovered_without_output') end where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,p_action,state_,amount_,jsonb_build_object('reason',btrim(p_reason),'actorId',auth.uid(),'providerRetry',false));
 return bizoveya_private.media_request_json(r.id);
end;$$;
-- Existing runtime admissions must include media charges and unresolved media usage.
alter function public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) set schema bizoveya_private;
alter function bizoveya_private.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text) rename to begin_model_test_before_media_budget;
create function public.bz_admin_begin_model_test(p_id uuid,p_profile_id uuid,p_expected_revision integer,p_expected_credential_version integer,p_claim uuid,p_reviewed boolean,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;old_ boolean;begin
 perform pg_advisory_xact_lock(817030);old_:=exists(select 1 from bizoveya_private.spending_ledger where run_id=p_id);
 if not old_ then perform bizoveya_private.check_media_budget(p_profile_id);end if;
 result_:=bizoveya_private.begin_model_test_before_media_budget(p_id,p_profile_id,p_expected_revision,p_expected_credential_version,p_claim,p_reviewed,p_reason);
 if not old_ then perform bizoveya_private.check_media_budget(p_profile_id);end if;return result_;
end;$$;
alter function public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) rename to begin_generation_before_media_budget;
create function public.bz_begin_campaign_generation_stage(p_generation_id uuid,p_stage_id uuid,p_kind text,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;old_ boolean;profile_ uuid;begin
 perform pg_advisory_xact_lock(817030);old_:=exists(select 1 from bizoveya_private.generation_stage_runs where id=p_stage_id);
 select (s->'profile'->>'id')::uuid into profile_ from bizoveya_private.generation_runs g cross join jsonb_array_elements(g.input_snapshot->'stages') s where g.id=p_generation_id and s->>'kind'=p_kind;
 if not old_ and profile_ is not null then perform bizoveya_private.check_media_budget(profile_);end if;
 result_:=bizoveya_private.begin_generation_before_media_budget(p_generation_id,p_stage_id,p_kind,p_claim,p_actor_id);
 select profile_id into profile_ from bizoveya_private.generation_stage_runs where id=p_stage_id;
 if not old_ and profile_ is not null then perform bizoveya_private.check_media_budget(profile_);end if;return result_;
end;$$;
alter function public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) rename to begin_meeting_turn_before_media_budget;
create function public.bz_begin_meeting_turn(p_snapshot_id uuid,p_consent_id uuid,p_turn_id uuid,p_ordinal integer,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare result_ jsonb;old_ boolean;profile_ uuid;begin
 perform pg_advisory_xact_lock(817030);old_:=exists(select 1 from bizoveya_private.meeting_turn_runs where id=p_turn_id);
 select (t->>'profileId')::uuid into profile_ from bizoveya_private.meeting_execution_snapshots x cross join jsonb_array_elements(x.input_snapshot->'turns') t where x.id=p_snapshot_id and (t->>'ordinal')::integer=p_ordinal;
 if not old_ and profile_ is not null then perform bizoveya_private.check_media_budget(profile_);end if;
 result_:=bizoveya_private.begin_meeting_turn_before_media_budget(p_snapshot_id,p_consent_id,p_turn_id,p_ordinal,p_claim,p_actor_id);
 select profile_id into profile_ from bizoveya_private.meeting_turn_runs where id=p_turn_id;
 if not old_ and profile_ is not null then perform bizoveya_private.check_media_budget(profile_);end if;return result_;
end;$$;

create function public.bz_admin_media_registry() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return jsonb_build_object('sites',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'workspaceId',s.workspace_id,'name',s.name,'inventory',public.bz_media_inventory(s.workspace_id,s.id)) order by s.id) from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner'),'[]'::jsonb));
end;$$;

create function bizoveya_private.guard_media_request_identity() returns trigger language plpgsql set search_path='' as $$begin
 if (new.id,new.site_id,new.actor_id,new.capability,new.qualification_version,new.profile_id,new.policy_version,new.snapshot,new.command,new.request_hash,new.reserved_micros,new.created_at) is distinct from (old.id,old.site_id,old.actor_id,old.capability,old.qualification_version,old.profile_id,old.policy_version,old.snapshot,old.command,old.request_hash,old.reserved_micros,old.created_at) then raise exception 'bz_immutable_media_request';end if;return new;
end;$$;
create trigger media_request_identity before update on bizoveya_private.media_requests for each row execute function bizoveya_private.guard_media_request_identity();

-- Private internals and replaced entry points never inherit PUBLIC execution.
revoke all on function bizoveya_private.valid_media_capability(jsonb),bizoveya_private.media_budget_total(uuid),bizoveya_private.check_media_budget(uuid),bizoveya_private.media_qualification(uuid,text),bizoveya_private.media_request_json(uuid),bizoveya_private.check_media_request_actor(bizoveya_private.media_requests,uuid),bizoveya_private.guard_media_request_identity(),bizoveya_private.begin_model_test_before_media_budget(uuid,uuid,integer,integer,uuid,boolean,text),bizoveya_private.begin_generation_before_media_budget(uuid,uuid,text,uuid,uuid),bizoveya_private.begin_meeting_turn_before_media_budget(uuid,uuid,uuid,integer,uuid,uuid) from public,anon,authenticated,service_role;
revoke all on function public.bz_media_inventory(uuid,uuid),public.bz_admin_review_media_capability(uuid,uuid,jsonb),public.bz_admit_media_request(uuid,uuid,jsonb),public.bz_claim_media_request(uuid,uuid,uuid),public.bz_start_media_provider(uuid,uuid,uuid),public.bz_finish_media_request(uuid,uuid,boolean,integer,integer,jsonb,text),public.bz_cancel_unstarted_media_request(uuid,uuid),public.bz_admin_recover_media_request(uuid,text,text,bigint,text,boolean),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text),public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid),public.bz_admin_media_registry() from public,anon,authenticated,service_role;
grant execute on function public.bz_media_inventory(uuid,uuid),public.bz_admit_media_request(uuid,uuid,jsonb),public.bz_admin_review_media_capability(uuid,uuid,jsonb),public.bz_admin_recover_media_request(uuid,text,text,bigint,text,boolean),public.bz_admin_begin_model_test(uuid,uuid,integer,integer,uuid,boolean,text),public.bz_admin_media_registry() to authenticated;
grant execute on function public.bz_claim_media_request(uuid,uuid,uuid),public.bz_start_media_provider(uuid,uuid,uuid),public.bz_finish_media_request(uuid,uuid,boolean,integer,integer,jsonb,text),public.bz_cancel_unstarted_media_request(uuid,uuid),public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) to service_role;
commit;
