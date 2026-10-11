-- Qualified preparation only. No execution grant, reservation, provider call or output.
begin;
create table bizoveya_private.meeting_execution_snapshots(
 id uuid primary key, plan_id uuid not null unique references bizoveya_private.meeting_deliberation_plans(id) on delete cascade,
 command jsonb not null, fingerprint text not null, input_snapshot jsonb not null, summary jsonb not null,
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.meeting_execution_snapshots enable row level security;
revoke all on bizoveya_private.meeting_execution_snapshots from public,anon,authenticated,service_role;
create trigger meeting_execution_snapshot_immutable before update on bizoveya_private.meeting_execution_snapshots for each row execute function bizoveya_private.agency_handoff_immutable();

-- Called only under the global spending lock followed by site/meeting/schedule locks.
create function bizoveya_private.deliberation_execution_candidate(p_workspace_id uuid,p_site_id uuid,p_meeting_id uuid,p_plan_id uuid,p_meeting_version integer,p_schedule_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;a bizoveya_private.agency_records%rowtype;p bizoveya_private.meeting_deliberation_plans%rowtype;s bizoveya_private.meeting_deliberation_schedules%rowtype;r bizoveya_private.site_agent_rosters%rowtype;
 knowledge_ jsonb;preferences_ jsonb;turns_ jsonb;summary_turns_ jsonb;full_ jsonb;summary_ jsonb;total_ bigint;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_meeting_id is null or p_plan_id is null or p_meeting_id=p_plan_id or p_meeting_version is null or p_meeting_version not between 1 and 100 or p_schedule_version is null or p_schedule_version not between 1 and 100 then raise exception 'bz_invalid_meeting_snapshot';end if;
 select * into a from bizoveya_private.agency_records where id=p_meeting_id for update;
 if a.id is null or a.site_id<>p_site_id or a.kind<>'meeting' then raise exception 'bz_agency_unavailable';end if;
 select * into p from bizoveya_private.meeting_deliberation_plans where id=p_plan_id and meeting_id=p_meeting_id;
 if p.id is null then raise exception 'bz_deliberation_plan_required';end if;
 select * into s from bizoveya_private.meeting_deliberation_schedules where plan_id=p_plan_id for update;
 if a.version is distinct from p_meeting_version or s.version is distinct from p_schedule_version then raise exception 'bz_conflict';end if;
 if s.state is distinct from 'ready' or a.status<>'decision-recorded' or a.version<>p.source_version+1 then raise exception 'bz_meeting_snapshot_not_ready';end if;
 select * into r from bizoveya_private.site_agent_rosters where site_id=p_site_id for share;
 if r.site_id is null or r.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 if r.version is distinct from p.roster_version or exists(select 1 from bizoveya_private.meeting_deliberation_turns t where t.plan_id=p.id and not exists(select 1 from jsonb_array_elements(r.document->'agents') y where y->>'kind'=t.role and (y->>'agentId')::uuid=t.agent_id and (y->>'agentVersion')::integer=t.agent_version)) then raise exception 'bz_site_roster_changed';end if;
 if (select count(*) from bizoveya_private.meeting_participant_invitations where meeting_id=a.id)<>jsonb_array_length(a.document->'participants') or exists(select 1 from bizoveya_private.meeting_participant_invitations i where i.meeting_id=a.id and (i.state<>'acknowledged' or i.responded_at is null)) then raise exception 'bz_meeting_receipts_required';end if;
 select coalesce(jsonb_agg(jsonb_build_object('sourceId',k.id,'sourceVersion',k.version,'title',k.document->>'title','facts',k.document->'facts','approvedAt',k.approved_at) order by k.id),'[]'::jsonb) into knowledge_ from public.bizoveya_knowledge_sources k where k.site_id=p_site_id and k.approved;
 select jsonb_build_object('version',coalesce(v.version,0),'document',coalesce(v.document,'{"brandVoice":"","audience":"","guidance":""}'::jsonb)) into preferences_ from (select 1)n left join public.bizoveya_site_agent_preferences v on v.site_id=p_site_id;
 -- Exact selected agent versions only; unselected globally qualified roles do not enter this plan.
 select coalesce(jsonb_agg(jsonb_build_object('ordinal',t.ordinal,'round',t.round,'role',t.role,'agentId',t.agent_id,'agentVersion',t.agent_version,'purpose',t.purpose,
  'agent',av.document,'bindingRevision',b.revision,'profileId',b.profile_id,'profileVersion',b.profile_version,'profile',pv.document,'credentialVersion',b.credential_version,'connectivityTestId',b.test_id,'spendingPolicyVersion',sp.version,'spendingPolicy',sp.document,
  'estimatedCeilingMicros',ceil(((p.max_input_tokens_per_turn::numeric*(sp.document->>'inputRateMicros')::numeric+p.max_output_tokens_per_turn::numeric*(sp.document->>'outputRateMicros')::numeric)/1000000+(sp.document->>'requestFeeMicros')::numeric)*1.25)::bigint) order by t.ordinal),'[]'::jsonb) into turns_
 from bizoveya_private.meeting_deliberation_turns t
 join bizoveya_private.agent_definitions ad on ad.id=t.agent_id and ad.kind=t.role and ad.preview_version=t.agent_version and ad.latest_version=t.agent_version
 join bizoveya_private.agent_versions av on av.agent_id=t.agent_id and av.version=t.agent_version
 join bizoveya_private.agent_model_bindings b on b.agent_id=t.agent_id and b.agent_version=t.agent_version and b.enabled
 join bizoveya_private.model_profile_versions pv on pv.profile_id=b.profile_id and pv.version=b.profile_version
 join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version
 where t.plan_id=p.id and bizoveya_private.binding_issue(b) is null and bizoveya_private.valid_spending_document(sp.document) and sp.document->'enabled'='true'::jsonb and (sp.document->>'validUntil')::timestamptz>statement_timestamp()
 and p.max_output_tokens_per_turn<=least((av.document->>'maxOutputTokens')::integer,(pv.document->>'maxOutputTokens')::integer);
 if jsonb_array_length(knowledge_)=0 or jsonb_array_length(turns_)<>(select count(*) from bizoveya_private.meeting_deliberation_turns where plan_id=p.id) or jsonb_array_length(turns_) not between 1 and 6 then raise exception 'bz_meeting_qualification_required';end if;
 if exists(select 1 from jsonb_array_elements(turns_) t where exists(select 1 from bizoveya_private.spending_ledger l where l.profile_id=(t->>'profileId')::uuid and (l.state in('unknown','overrun') or l.state='reserved' and l.started_at<statement_timestamp()-interval '90 seconds')) or exists(select 1 from bizoveya_private.generation_stage_runs g where g.profile_id=(t->>'profileId')::uuid and (g.spending_state in('unknown','overrun') or g.spending_state='reserved' and g.created_at<statement_timestamp()-interval '90 seconds'))) then raise exception 'bz_spending_unresolved';end if;
 select sum((t->>'estimatedCeilingMicros')::bigint) into total_ from jsonb_array_elements(turns_) t;
 if total_>p.max_total_cost_cents::bigint*10000 or exists(select 1 from jsonb_array_elements(turns_) t where (t->>'estimatedCeilingMicros')::bigint>(t->'spendingPolicy'->>'runLimitMicros')::bigint) then raise exception 'bz_meeting_cost_ceiling';end if;
 -- Group repeated turns by profile, rather than testing each turn against a daily ceiling independently.
 if exists(select 1 from jsonb_array_elements(turns_) t group by t->>'profileId',t->'spendingPolicy'->>'dailyLimitMicros',t->'profile'->>'dailyBudgetCents' having sum((t->>'estimatedCeilingMicros')::bigint)>least((t->'spendingPolicy'->>'dailyLimitMicros')::bigint,(t->'profile'->>'dailyBudgetCents')::bigint*10000)) then raise exception 'bz_meeting_cost_ceiling';end if;
 full_:=jsonb_build_object('schema','meeting-execution-input-v1','meetingId',a.id,'meetingVersion',a.version,'planId',p.id,'scheduleVersion',s.version,'rosterVersion',r.version,
 'agenda',a.document,'distribution',bizoveya_private.agency_json(a.id)->'meetingDistribution','knowledge',knowledge_,'preferences',preferences_,'turns',turns_,
 'limits',jsonb_build_object('maxInputTokensPerTurn',p.max_input_tokens_per_turn,'maxOutputTokensPerTurn',p.max_output_tokens_per_turn,'maxTotalCostMicros',p.max_total_cost_cents::bigint*10000,'maxAttemptsPerTurn',1,'publish',false,'externalTools',false));
 if octet_length(full_::text)>262144 then raise exception 'bz_agency_snapshot_limit';end if;
 select jsonb_agg(jsonb_build_object('ordinal',t->'ordinal','round',t->'round','role',t->'role','agentId',t->'agentId','agentVersion',t->'agentVersion','bindingRevision',t->'bindingRevision','profileId',t->'profileId','profileVersion',t->'profileVersion','connectivityTestId',t->'connectivityTestId','spendingPolicyVersion',t->'spendingPolicyVersion','pricingValidUntil',t->'spendingPolicy'->'validUntil','estimatedCeilingMicros',t->'estimatedCeilingMicros') order by (t->>'ordinal')::integer) into summary_turns_ from jsonb_array_elements(turns_) t;
 summary_:=jsonb_build_object('meetingId',a.id,'meetingVersion',a.version,'planId',p.id,'scheduleVersion',s.version,'rosterVersion',r.version,'preferences',preferences_,'knowledge',knowledge_,'turns',summary_turns_,'maxInputTokensPerTurn',p.max_input_tokens_per_turn,'maxOutputTokensPerTurn',p.max_output_tokens_per_turn,'maxTotalCostMicros',p.max_total_cost_cents::bigint*10000,'estimatedCeilingMicros',total_,'executionEnabled',false);
 return jsonb_build_object('fingerprint',encode(sha256(convert_to(full_::text,'UTF8')),'hex'),'summary',summary_,'snapshot',full_);
end;$$;

create function public.bz_review_meeting_execution_snapshot(p_workspace_id uuid,p_site_id uuid,p_meeting_id uuid,p_plan_id uuid,p_meeting_version integer,p_schedule_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare candidate_ jsonb;begin
 perform pg_advisory_xact_lock(817030);
 candidate_:=bizoveya_private.deliberation_execution_candidate(p_workspace_id,p_site_id,p_meeting_id,p_plan_id,p_meeting_version,p_schedule_version);
 return candidate_-'snapshot';
end;$$;

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_meeting_snapshot;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_meeting_snapshot(p_id)||jsonb_build_object('meetingExecutionSnapshot',(
 select jsonb_build_object('id',x.id,'fingerprint',x.fingerprint,'summary',x.summary,'actorId',x.actor_id,'createdAt',x.created_at,'state','prepared') from bizoveya_private.meeting_execution_snapshots x join bizoveya_private.meeting_deliberation_plans p on p.id=x.plan_id where p.meeting_id=p_id));
$$;

create function public.bz_prepare_meeting_execution_snapshot(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;meeting_ uuid;plan_ uuid;snapshot_ uuid;candidate_ jsonb;a bizoveya_private.agency_records%rowtype;x bizoveya_private.meeting_execution_snapshots%rowtype;
begin
 perform pg_advisory_xact_lock(817030);
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>7 or not(p_input ?& array['id','planId','snapshotId','expectedMeetingVersion','expectedScheduleVersion','fingerprint','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb then raise exception 'bz_invalid_meeting_snapshot';end if;
 if jsonb_typeof(p_input->'id') is distinct from 'string' or jsonb_typeof(p_input->'planId') is distinct from 'string' or jsonb_typeof(p_input->'snapshotId') is distinct from 'string' or jsonb_typeof(p_input->'fingerprint') is distinct from 'string' or (p_input->>'fingerprint')!~'^[a-f0-9]{64}$' or jsonb_typeof(p_input->'expectedMeetingVersion') is distinct from 'number' or jsonb_typeof(p_input->'expectedScheduleVersion') is distinct from 'number' or (p_input->>'expectedMeetingVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedScheduleVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedMeetingVersion')::integer not between 1 and 100 or (p_input->>'expectedScheduleVersion')::integer not between 1 and 100 then raise exception 'bz_invalid_meeting_snapshot';end if;
 begin meeting_:=(p_input->>'id')::uuid;plan_:=(p_input->>'planId')::uuid;snapshot_:=(p_input->>'snapshotId')::uuid;exception when others then raise exception 'bz_invalid_meeting_snapshot';end;
 if meeting_=plan_ or snapshot_ in(meeting_,plan_) then raise exception 'bz_invalid_meeting_snapshot';end if;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;if a.id is null or a.site_id<>p_site_id or a.kind<>'meeting' then raise exception 'bz_agency_unavailable';end if;
 select * into x from bizoveya_private.meeting_execution_snapshots where plan_id=plan_;
 if x.id is not null then
  if x.id=snapshot_ and x.actor_id=actor_ and x.command=p_input and exists(select 1 from bizoveya_private.meeting_deliberation_plans where id=plan_ and meeting_id=meeting_) then return bizoveya_private.agency_json(meeting_);end if;raise exception 'bz_conflict';
 end if;
 candidate_:=bizoveya_private.deliberation_execution_candidate(p_workspace_id,p_site_id,meeting_,plan_,(p_input->>'expectedMeetingVersion')::integer,(p_input->>'expectedScheduleVersion')::integer);
 if candidate_->>'fingerprint' is distinct from p_input->>'fingerprint' then raise exception 'bz_meeting_snapshot_changed';end if;
 insert into bizoveya_private.meeting_execution_snapshots(id,plan_id,command,fingerprint,input_snapshot,summary,actor_id) values(snapshot_,plan_,p_input,p_input->>'fingerprint',candidate_->'snapshot',candidate_->'summary',actor_);
 return bizoveya_private.agency_json(meeting_);
exception when unique_violation then raise exception 'bz_conflict';end;$$;
revoke all on function bizoveya_private.deliberation_execution_candidate(uuid,uuid,uuid,uuid,integer,integer),bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_meeting_snapshot(uuid),public.bz_review_meeting_execution_snapshot(uuid,uuid,uuid,uuid,integer,integer),public.bz_prepare_meeting_execution_snapshot(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_review_meeting_execution_snapshot(uuid,uuid,uuid,uuid,integer,integer),public.bz_prepare_meeting_execution_snapshot(uuid,uuid,jsonb) to authenticated;
commit;
