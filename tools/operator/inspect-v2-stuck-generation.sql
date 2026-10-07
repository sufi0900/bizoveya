-- Read-only founder diagnostic. Run in Supabase SQL Editor, not as a migration.
-- Does not reveal claims, private prompts or credentials; does not change data.
select r.id as snapshot_id,r.status as run_status,
 s.kind as stage,s.status as stage_status,s.spending_state,
 s.provider_started_at is not null as request_recorded,
 s.request_document->>'runtimeVersion' as runtime_version,
 s.error_code,
 coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false) as active_dispatch
from bizoveya_private.generation_runs r
left join bizoveya_private.generation_stage_runs s on s.generation_run_id=r.id
left join bizoveya_private.generation_dispatches d on d.generation_id=r.id
where r.id='29293e34-e773-4ffe-88f1-dc9645dd60c6'::uuid;
