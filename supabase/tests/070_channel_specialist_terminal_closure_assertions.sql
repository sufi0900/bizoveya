-- Structural guard for the additive terminal-state wrapper. Behavioral coverage lives in 069's full runtime fixture.
begin;
do $$declare definition_ text;begin
 select pg_get_functiondef('bizoveya_private.agency_json(uuid)'::regprocedure) into definition_;
 if position('output_missing' in definition_)=0 or to_regprocedure('bizoveya_private.agency_json_before_specialist_terminal_closure(uuid)') is null then
  raise exception 'Specialist terminal closure is not installed';
 end if;
 if has_function_privilege('authenticated','bizoveya_private.agency_json(uuid)','execute') then
  raise exception 'Private specialist projection is callable by authenticated';
 end if;
end;$$;
rollback;
