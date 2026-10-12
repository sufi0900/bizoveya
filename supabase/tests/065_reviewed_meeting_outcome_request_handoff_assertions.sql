begin;
do $$begin
 if not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='bizoveya_private' and c.relname='meeting_outcome_request_handoffs' and c.relrowsecurity) then raise exception 'Outcome handoffs must be private with RLS';end if;
 if has_table_privilege('authenticated','bizoveya_private.meeting_outcome_request_handoffs','select') or has_table_privilege('service_role','bizoveya_private.meeting_outcome_request_handoffs','select') then raise exception 'Outcome handoff table leaked direct read access';end if;
 if not exists(select 1 from pg_trigger where tgname='meeting_outcome_request_handoff_immutable') then raise exception 'Outcome handoff immutability trigger missing';end if;
 if not has_function_privilege('authenticated','public.bz_admin_handoff_meeting_outcome(jsonb)','execute') or has_function_privilege('service_role','public.bz_admin_handoff_meeting_outcome(jsonb)','execute') then raise exception 'Outcome handoff grant mismatch';end if;
 if has_function_privilege('authenticated','bizoveya_private.admin_meeting_execution_queue_before_handoff()','execute') then raise exception 'Prior queue leaked';end if;
end;$$;
set local role authenticated;
create function pg_temp.expect_denied(q text) returns void language plpgsql as $$begin begin execute q;exception when insufficient_privilege then return;end;raise exception 'Expected permission denial';end;$$;
select pg_temp.expect_denied('select * from bizoveya_private.meeting_outcome_request_handoffs');
reset role;
rollback;
