-- Additive safe diagnostics. Preserve historical unknown charges; never infer zero.
begin;
alter table bizoveya_private.model_test_runs drop constraint model_test_runs_result_code_check;
alter table bizoveya_private.model_test_runs add constraint model_test_runs_result_code_check check(result_code in(
 'response_matched','unexpected_response','provider_error','timeout','interrupted','preflight_failed',
 'rate_limited','provider_payment_required','provider_access_denied','provider_request_rejected',
 'provider_schema_rejected','provider_precondition_failed','provider_key_invalid','provider_key_blocked','provider_unavailable','provider_model_unavailable'));
-- Keep the existing claim/lease validation, accounting and role boundary intact.
alter function public.bz_finish_model_test(uuid,uuid,text,integer,integer) set schema bizoveya_private;
alter function bizoveya_private.bz_finish_model_test(uuid,uuid,text,integer,integer) rename to finish_model_test_accounted_v75;
revoke all on function bizoveya_private.finish_model_test_accounted_v75(uuid,uuid,text,integer,integer) from public,anon,authenticated,service_role;
create function public.bz_finish_model_test(p_id uuid,p_claim uuid,p_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$
declare legacy_code text;begin
 if p_code is null or p_code not in('response_matched','unexpected_response','provider_error','timeout','preflight_failed','rate_limited','provider_payment_required','provider_access_denied','provider_request_rejected','provider_schema_rejected','provider_precondition_failed','provider_key_invalid','provider_key_blocked','provider_unavailable','provider_model_unavailable') then raise exception 'bz_invalid_test';end if;
 if p_code='preflight_failed' and (p_input_tokens is distinct from 0 or p_output_tokens is distinct from 0) then raise exception 'bz_invalid_test';end if;
 legacy_code:=case when p_code in('response_matched','unexpected_response','timeout') then p_code else 'provider_error' end;
 perform bizoveya_private.finish_model_test_accounted_v75(p_id,p_claim,legacy_code,p_input_tokens,p_output_tokens);
 update bizoveya_private.model_test_runs set result_code=p_code where id=p_id;
 if p_code='preflight_failed' then
  -- Zero tokens alone normally still permits a per-request fee. Here no dispatch occurred.
  update bizoveya_private.spending_ledger set charged_micros=0,state='settled' where run_id=p_id;
  insert into bizoveya_private.spending_events(run_id,action,amount_micros,reason)
   select p_id,'settled',0,'Final server preflight failed before provider adapter invocation; no request fee incurred'
   where exists(select 1 from bizoveya_private.spending_ledger where run_id=p_id);
 end if;
end;$$;
revoke all on function public.bz_finish_model_test(uuid,uuid,text,integer,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_finish_model_test(uuid,uuid,text,integer,integer) to service_role;
create function public.bz_admin_connectivity_diagnostics_ready() returns boolean language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();return true;
end;$$;
revoke all on function public.bz_admin_connectivity_diagnostics_ready() from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_connectivity_diagnostics_ready() to authenticated;
commit;
