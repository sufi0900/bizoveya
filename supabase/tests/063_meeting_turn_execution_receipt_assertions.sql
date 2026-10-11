begin;
do $$declare name_ text;begin
 foreach name_ in array array['meeting_turn_requests','meeting_turn_results'] loop
  if not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='bizoveya_private' and c.relname=name_ and c.relrowsecurity) then raise exception '% must be private with RLS',name_;end if;
  if has_table_privilege('authenticated','bizoveya_private.'||name_,'select') or has_table_privilege('service_role','bizoveya_private.'||name_,'select') then raise exception '% leaked direct read access',name_;end if;
 end loop;
 if not exists(select 1 from pg_trigger where tgname='meeting_turn_request_immutable') or not exists(select 1 from pg_trigger where tgname='meeting_turn_result_immutable') then raise exception 'Immutable receipt triggers missing';end if;
 if has_function_privilege('authenticated','public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid)','execute') or not has_function_privilege('service_role','public.bz_record_meeting_turn_request(uuid,uuid,jsonb)','execute') or not has_function_privilege('service_role','public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer)','execute') then raise exception 'Worker execution grants mismatch';end if;
 if not has_function_privilege('authenticated','public.bz_admin_meeting_execution_queue()','execute') then raise exception 'Admin projection grant missing';end if;
end;$$;
set local role authenticated;
create function pg_temp.expect_denied(q text) returns void language plpgsql as $$begin begin execute q;exception when insufficient_privilege then return;end;raise exception 'Expected permission denial';end;$$;
select pg_temp.expect_denied('select public.bz_record_meeting_turn_request(gen_random_uuid(),gen_random_uuid(),''{}''::jsonb)');
select pg_temp.expect_denied('select public.bz_finish_meeting_turn_execution(gen_random_uuid(),gen_random_uuid(),null,''x'',null,null)');
reset role;
rollback;
