-- One-attempt private meeting execution. Requests are durable before provider start.
begin;
create table bizoveya_private.meeting_turn_requests(
 turn_id uuid primary key references bizoveya_private.meeting_turn_runs(id) on delete cascade,
 document jsonb not null,request_hash text not null check(request_hash~'^[a-f0-9]{64}$'),created_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.meeting_turn_results(
 turn_id uuid primary key references bizoveya_private.meeting_turn_runs(id) on delete cascade,
 document jsonb not null,created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.meeting_turn_requests enable row level security;
alter table bizoveya_private.meeting_turn_results enable row level security;
revoke all on bizoveya_private.meeting_turn_requests,bizoveya_private.meeting_turn_results from public,anon,authenticated,service_role;
create trigger meeting_turn_request_immutable before update on bizoveya_private.meeting_turn_requests for each row execute function bizoveya_private.agency_handoff_immutable();
create trigger meeting_turn_result_immutable before update on bizoveya_private.meeting_turn_results for each row execute function bizoveya_private.agency_handoff_immutable();

alter function public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) rename to begin_meeting_turn_before_receipts;
create function public.bz_begin_meeting_turn(p_snapshot_id uuid,p_consent_id uuid,p_turn_id uuid,p_ordinal integer,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare base_ jsonb;m bizoveya_private.meeting_turn_runs%rowtype;x bizoveya_private.meeting_execution_snapshots%rowtype;turn_ jsonb;prior_ jsonb;
begin
 base_:=bizoveya_private.begin_meeting_turn_before_receipts(p_snapshot_id,p_consent_id,p_turn_id,p_ordinal,p_claim,p_actor_id);
 select * into m from bizoveya_private.meeting_turn_runs where id=p_turn_id;
 if m.id is null or m.claim is distinct from p_claim or m.status<>'reserved' or exists(select 1 from bizoveya_private.meeting_turn_requests where turn_id=m.id) then return base_;end if;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=m.snapshot_id;
 select value into turn_ from jsonb_array_elements(x.input_snapshot->'turns') where (value->>'ordinal')::integer=m.ordinal;
 select coalesce(jsonb_agg(jsonb_build_object('ordinal',r.ordinal,'role',x2.input_snapshot->'turns'->(r.ordinal-1)->'role','result',z.document) order by r.ordinal),'[]'::jsonb) into prior_
 from bizoveya_private.meeting_turn_runs r join bizoveya_private.meeting_turn_results z on z.turn_id=r.id join bizoveya_private.meeting_execution_snapshots x2 on x2.id=r.snapshot_id
 where r.snapshot_id=m.snapshot_id and r.ordinal<m.ordinal and r.status='succeeded' and r.spending_state in('settled','reconciled');
 return jsonb_build_object('execute',true,'snapshot',x.input_snapshot,'turn',turn_,'prior',prior_,'inputLimit',m.input_token_limit,'outputLimit',m.output_token_limit);
end;$$;

create function public.bz_record_meeting_turn_request(p_turn_id uuid,p_claim uuid,p_request jsonb) returns void language plpgsql security definer set search_path='' as $$
declare m bizoveya_private.meeting_turn_runs%rowtype;existing_ jsonb;hash_ text;
begin
 perform pg_advisory_xact_lock(817030);select * into m from bizoveya_private.meeting_turn_runs where id=p_turn_id for update;
 if m.id is null or m.claim is distinct from p_claim or m.status<>'reserved' or m.provider_started_at is not null then raise exception 'bz_conflict';end if;
 if p_request is null or jsonb_typeof(p_request) is distinct from 'object' or octet_length(p_request::text)>32768 or (select count(*) from jsonb_object_keys(p_request))<>5 or not(p_request ?& array['runtimeVersion','instructions','prompt','outputSchema','maxOutputTokens'])
  or p_request->>'runtimeVersion'<>'meeting-runtime-v1-ai7.0.127' or p_request->>'outputSchema'<>'meeting-turn-result-v1' or jsonb_typeof(p_request->'instructions') is distinct from 'string' or jsonb_typeof(p_request->'prompt') is distinct from 'string' or jsonb_typeof(p_request->'maxOutputTokens') is distinct from 'number' or (p_request->>'maxOutputTokens')!~'^[0-9]{3,4}$' or (p_request->>'maxOutputTokens')::integer<>m.output_token_limit then raise exception 'bz_invalid_meeting_request';end if;
 hash_:=encode(sha256(convert_to(p_request::text,'UTF8')),'hex');
 select document into existing_ from bizoveya_private.meeting_turn_requests where turn_id=m.id;
 if existing_ is not null then if existing_-'requestHash'=p_request then return;end if;raise exception 'bz_conflict';end if;
 insert into bizoveya_private.meeting_turn_requests(turn_id,document,request_hash) values(m.id,jsonb_set(p_request,'{requestHash}',to_jsonb(hash_)),hash_);
end;$$;

create function public.bz_finish_meeting_turn_execution(p_turn_id uuid,p_claim uuid,p_result jsonb,p_error_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$
declare succeeded_ boolean:=p_error_code is null;existing_ jsonb;
begin
 perform pg_advisory_xact_lock(817030);
 if not exists(select 1 from bizoveya_private.meeting_turn_requests q join bizoveya_private.meeting_turn_runs m on m.id=q.turn_id where q.turn_id=p_turn_id and m.claim=p_claim and m.provider_started_at is not null) then raise exception 'bz_meeting_request_required';end if;
 if succeeded_ and (p_result is null or jsonb_typeof(p_result) is distinct from 'object' or octet_length(p_result::text)>32768 or p_result->>'schema'<>'meeting-turn-result-v1' or jsonb_typeof(p_result->'summary') is distinct from 'string' or jsonb_typeof(p_result->'recommendations') is distinct from 'array' or jsonb_typeof(p_result->'concerns') is distinct from 'array' or jsonb_typeof(p_result->'citations') is distinct from 'array') then raise exception 'bz_invalid_meeting_result';end if;
 if not succeeded_ and p_result is not null then raise exception 'bz_invalid_meeting_result';end if;
 select document into existing_ from bizoveya_private.meeting_turn_results where turn_id=p_turn_id;
 if existing_ is not null then if existing_=p_result then return;end if;raise exception 'bz_conflict';end if;
 perform public.bz_finish_meeting_turn_spending(p_turn_id,p_claim,succeeded_,p_error_code,p_input_tokens,p_output_tokens);
 if p_result is not null then insert into bizoveya_private.meeting_turn_results(turn_id,document) values(p_turn_id,p_result);end if;
end;$$;

alter function public.bz_admin_meeting_execution_queue() set schema bizoveya_private;
alter function bizoveya_private.bz_admin_meeting_execution_queue() rename to admin_meeting_execution_queue_before_turns;
create function public.bz_admin_meeting_execution_queue() returns jsonb language plpgsql security definer set search_path='' as $$
declare queue_ jsonb;begin perform bizoveya_private.require_admin();queue_:=bizoveya_private.admin_meeting_execution_queue_before_turns();
 return coalesce((select jsonb_agg(item||jsonb_build_object('turns',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'ordinal',m.ordinal,'status',m.status,'spendingState',m.spending_state,'providerStartedAt',m.provider_started_at,'inputTokens',m.input_tokens,'outputTokens',m.output_tokens,'errorCode',m.error_code,'requestHash',q.request_hash,'result',z.document,'createdAt',m.created_at,'finishedAt',m.finished_at) order by m.ordinal) from bizoveya_private.meeting_turn_runs m left join bizoveya_private.meeting_turn_requests q on q.turn_id=m.id left join bizoveya_private.meeting_turn_results z on z.turn_id=m.id where m.snapshot_id=(item->>'snapshotId')::uuid),'[]'::jsonb))) from jsonb_array_elements(queue_) item),'[]'::jsonb);
end;$$;

revoke all on function bizoveya_private.begin_meeting_turn_before_receipts(uuid,uuid,uuid,integer,uuid,uuid),bizoveya_private.admin_meeting_execution_queue_before_turns(),public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid),public.bz_record_meeting_turn_request(uuid,uuid,jsonb),public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer),public.bz_admin_meeting_execution_queue() from public,anon,authenticated,service_role;
grant execute on function public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid),public.bz_record_meeting_turn_request(uuid,uuid,jsonb),public.bz_record_meeting_turn_provider_start(uuid,uuid),public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer) to service_role;
grant execute on function public.bz_admin_meeting_execution_queue() to authenticated;
commit;
