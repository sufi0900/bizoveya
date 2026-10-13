-- Additive browser Live-session closure. Browser-reported usage is never treated
-- as authoritative metered billing; free-attested sessions can safely settle $0.
alter table bizoveya_private.media_requests add column voice_close_command jsonb;

create function public.bz_close_media_voice_session(p_workspace_id uuid,p_site_id uuid,p_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;reason_ text;input_ integer;output_ integer;hash_ text;free_ boolean;ok_ boolean;receipt_ jsonb;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.media_requests where id=p_id for update;
 if r.id is null or r.site_id is distinct from p_site_id or r.actor_id is distinct from auth.uid() or r.capability<>'live-voice' or bizoveya_private.workspace_role(p_workspace_id) is distinct from 'owner' or not exists(select 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id) then raise exception 'bz_forbidden';end if;
 if p_input is null or jsonb_typeof(p_input)<>'object' or (select count(*) from jsonb_object_keys(p_input))<>6 or not(p_input ?& array['reason','inputTokens','outputTokens','transcriptHash','providerUsageReported','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or p_input->>'reason' not in('completed','stopped','disconnected','timeout','error') then raise exception 'bz_invalid_voice_session';end if;
 reason_:=p_input->>'reason';hash_:=p_input->>'transcriptHash';
 if p_input->'inputTokens'<>'null'::jsonb then begin input_:=(p_input->>'inputTokens')::integer;exception when others then raise exception 'bz_invalid_voice_session';end;end if;
 if p_input->'outputTokens'<>'null'::jsonb then begin output_:=(p_input->>'outputTokens')::integer;exception when others then raise exception 'bz_invalid_voice_session';end;end if;
 if input_ is not null and input_ not between 0 and 2000000 or output_ is not null and output_ not between 0 and 2000000 or (input_ is null)<>(output_ is null) or (input_ is not null) is distinct from (p_input->'providerUsageReported'='true'::jsonb) or hash_ is not null and hash_!~'^[a-f0-9]{64}$' then raise exception 'bz_invalid_voice_session';end if;
 if r.voice_close_command is not null then if r.voice_close_command=p_input then return bizoveya_private.media_request_json(r.id);end if;raise exception 'bz_conflict';end if;
 if r.status<>'issued' or r.provider_started_at is null then raise exception 'bz_media_session_inactive';end if;
 free_:=(r.snapshot#>>'{qualification,costMode}')='free-attested' and (r.snapshot#>>'{qualification,inputRateMicros}')::bigint=0 and (r.snapshot#>>'{qualification,outputRateMicros}')::bigint=0 and (r.snapshot#>>'{qualification,requestFeeMicros}')::bigint=0;
 ok_:=reason_ in('completed','stopped');
 receipt_:=coalesce(r.receipt,'{}'::jsonb)||jsonb_build_object('transcriptHash',hash_,'endReason',reason_,'usageSource',case when input_ is null then 'unavailable' else 'client-provider-message' end);
 update bizoveya_private.media_requests set voice_close_command=p_input,status=case when ok_ and free_ then 'succeeded' else 'failed' end,spending_state=case when free_ then 'settled' else 'unknown' end,charged_micros=case when free_ then 0 else reserved_micros end,input_tokens=input_,output_tokens=output_,receipt=receipt_,error_code=case when ok_ and free_ then null when free_ then 'voice_'||reason_ else 'client_usage_unverified' end,finished_at=clock_timestamp() where id=r.id;
 insert into bizoveya_private.media_request_events(request_id,action,state,amount_micros,details) values(r.id,'voice_closed',case when free_ then 'settled' else 'unknown' end,case when free_ then 0 else r.reserved_micros end,jsonb_build_object('reason',reason_,'transcriptHash',hash_,'usageSource',case when input_ is null then 'unavailable' else 'client-provider-message' end,'providerRetry',false));
 return bizoveya_private.media_request_json(r.id);
end;$$;

revoke all on function public.bz_close_media_voice_session(uuid,uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_close_media_voice_session(uuid,uuid,uuid,jsonb) to authenticated;
