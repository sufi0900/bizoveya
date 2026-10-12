-- Turn1 review repair: recheck unresolved legacy work immediately before media start.
-- Keeps already-applied071 and all previous migration history intact.
begin;
create or replace function bizoveya_private.check_media_budget(p_profile uuid) returns void language plpgsql security definer set search_path='' as $$
declare policy_ jsonb;profile_ jsonb;begin
 if exists(select 1 from bizoveya_private.media_requests where profile_id=p_profile and (spending_state in('unknown','overrun') or spending_state='reserved' and expires_at<=statement_timestamp()))
 or exists(select 1 from bizoveya_private.spending_ledger where profile_id=p_profile and (state in('unknown','overrun') or state='reserved' and started_at<statement_timestamp()-interval '90 seconds'))
 or exists(select 1 from bizoveya_private.generation_stage_runs where profile_id=p_profile and (spending_state in('unknown','overrun') or spending_state='reserved' and created_at<statement_timestamp()-interval '90 seconds'))
 or exists(select 1 from bizoveya_private.meeting_turn_runs where profile_id=p_profile and (spending_state in('unknown','overrun') or spending_state='reserved' and created_at<statement_timestamp()-interval '90 seconds')) then raise exception 'bz_spending_unresolved';end if;
 select document into policy_ from bizoveya_private.spending_policies where profile_id=p_profile;
 select v.document into profile_ from bizoveya_private.model_profiles p join bizoveya_private.model_profile_versions v on v.profile_id=p.id and v.version=p.version where p.id=p_profile;
 if bizoveya_private.media_budget_total(p_profile)>least((policy_->>'dailyLimitMicros')::bigint,(profile_->>'dailyBudgetCents')::bigint*10000) then raise exception 'bz_daily_budget';end if;
end;$$;
revoke all on function bizoveya_private.check_media_budget(uuid) from public,anon,authenticated,service_role;
commit;
