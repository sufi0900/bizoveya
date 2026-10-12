-- Make incomplete succeeded specialist output explicit instead of projecting it as prepared.
-- This read-model repair adds no provider call, retry, spending path or publication capability.
begin;

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_specialist_terminal_closure;

create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 with source as (
  select bizoveya_private.agency_json_before_specialist_terminal_closure(p_id) document
 ), runtime as (
  select s.document,l.run_id
  from source s
  left join bizoveya_private.agency_specialist_runtime_lineage l on l.record_id=p_id
 )
 select case
  when r.run_id is null then r.document
  else jsonb_set(r.document,'{specialistRuntime,channels}',(
   select jsonb_agg(channel_.value||jsonb_build_object('state',case
    when task.state='recovery_required' then 'recovery_required'
    when task.state='cancelled' then 'cancelled'
    when task.state='failed' or generation.status='failed' then 'failed'
    when generation.status='succeeded' and not (channel_.value->>'outputAvailable')::boolean then 'output_missing'
    when task.state='running' then 'running'
    else channel_.value->>'state' end) order by channel_.ordinality)
   from jsonb_array_elements(r.document#>'{specialistRuntime,channels}') with ordinality channel_(value,ordinality)
   join bizoveya_private.generation_runs generation on generation.id=r.run_id
   left join bizoveya_private.agency_execution_tasks task on task.record_id=p_id
  ),false)
 end
 from runtime r;
$$;

revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_specialist_terminal_closure(uuid) from public,anon,authenticated,service_role;

commit;
