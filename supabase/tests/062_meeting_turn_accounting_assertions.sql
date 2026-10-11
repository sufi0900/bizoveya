-- Local fixture only; planning must require real receipts and must not execute a model.
begin;
create temporary table dpf(actor uuid,viewer uuid,wid uuid,sid uuid,meeting uuid,request uuid,coord uuid,content uuid,plan uuid,c1 uuid,c2 uuid);
insert into dpf values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid());
insert into auth.users(id) select actor from dpf union all select viewer from dpf;
insert into public.bizoveya_workspaces(id,owner_id,name) select wid,actor,'Deliberation fixture' from dpf;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select wid,actor,'owner' from dpf union all select wid,viewer,'viewer' from dpf;
insert into public.bizoveya_sites(id,workspace_id,name,mode,kind,status,created_by) select sid,wid,'Deliberation site','native_business','business','active',actor from dpf;
insert into bizoveya_private.site_agent_rosters(site_id,version,document,actor_id) select sid,1,jsonb_build_object('enabled',true,'agents',jsonb_build_array(jsonb_build_object('kind','coordinator','agentId',coord,'agentVersion',1),jsonb_build_object('kind','content','agentId',content,'agentVersion',1))),actor from dpf;
create function pg_temp.dexpect(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;end if;raise;end;raise exception 'Expected %',n;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;grant all on dpf to authenticated,service_role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from dpf),true);
select public.bz_agency_command(wid,sid,jsonb_build_object('action','meeting','id',meeting,'agenda','Compare safe launch options using approved context.','mode','deliberation','participants',jsonb_build_array('coordinator','content'),'reviewed',true,'inputMode','text')) from dpf;
select public.bz_agency_command(wid,sid,jsonb_build_object('action','accept-decision','id',meeting,'expectedVersion',1,'reason','Prepare a bounded private recommendation only.','reviewed',true)) from dpf;
select public.bz_distribute_meeting_request(wid,sid,jsonb_build_object('id',meeting,'requestId',request,'expectedVersion',2,'instruction','Prepare private approved-context options.','channels',jsonb_build_array('blog'),'reviewed',true)) from dpf;
select public.bz_invite_meeting_participants(wid,sid,jsonb_build_object('id',meeting,'expectedVersion',3,'reviewed',true)) from dpf;
select pg_temp.dexpect(format('select public.bz_prepare_meeting_deliberation(%L,%L,%L)',wid,sid,jsonb_build_object('id',meeting,'planId',plan,'expectedVersion',4,'rounds',1,'maxInputTokensPerTurn',1200,'maxOutputTokensPerTurn',600,'maxTotalCostCents',5,'reviewed',true)),'bz_meeting_receipts_required') from dpf;
reset role;
set local role service_role;
select public.bz_claim_meeting_invitation(meeting,'coordinator',c1,coord,1) from dpf;
select public.bz_finish_meeting_invitation(meeting,'coordinator',c1,coord,1,'acknowledged','Packet received; no reasoning started.') from dpf;
select public.bz_claim_meeting_invitation(meeting,'content',c2,content,1) from dpf;
select public.bz_finish_meeting_invitation(meeting,'content',c2,content,1,'acknowledged','Packet received; no reasoning started.') from dpf;
reset role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from dpf),true);
select pg_temp.dexpect(format('select public.bz_prepare_meeting_deliberation(%L,%L,%L)',wid,sid,jsonb_build_object('id',meeting,'planId',plan,'expectedVersion',4,'rounds',3,'maxInputTokensPerTurn',1200,'maxOutputTokensPerTurn',600,'maxTotalCostCents',5,'reviewed',true)),'bz_invalid_deliberation_plan') from dpf;
select public.bz_prepare_meeting_deliberation(wid,sid,jsonb_build_object('id',meeting,'planId',plan,'expectedVersion',4,'rounds',2,'maxInputTokensPerTurn',1200,'maxOutputTokensPerTurn',600,'maxTotalCostCents',5,'reviewed',true)) from dpf;
select public.bz_prepare_meeting_deliberation(wid,sid,jsonb_build_object('id',meeting,'planId',plan,'expectedVersion',4,'rounds',2,'maxInputTokensPerTurn',1200,'maxOutputTokensPerTurn',600,'maxTotalCostCents',5,'reviewed',true)) from dpf;



reset role;
alter table dpf add column profile uuid default gen_random_uuid(),add column test_run uuid default gen_random_uuid(),add column execution_id uuid default gen_random_uuid();
update bizoveya_private.model_credentials set enabled=true where id='platform-gemini';
insert into bizoveya_private.model_profiles(id,slug,version,revision) select profile,'meeting-execution-fixture',1,1 from dpf;
insert into bizoveya_private.model_profile_versions(profile_id,version,document,reason) select profile,1,'{"name":"Fixture Gemini","provider":"gemini","credentialRef":"platform-gemini","modelId":"fixture-model","tier":"economical","maxOutputTokens":1500,"dailyBudgetCents":100}','Synthetic meeting fixture' from dpf;
insert into bizoveya_private.model_profile_checks(profile_id,version,credential_id,credential_version) select profile,1,'platform-gemini',1 from dpf;
insert into bizoveya_private.model_test_runs(id,profile_id,profile_version,credential_id,credential_version,claim,status,result_code,input_tokens,output_tokens,reason,finished_at) select test_run,profile,1,'platform-gemini',1,gen_random_uuid(),'passed','response_matched',20,7,'Synthetic connectivity evidence',clock_timestamp() from dpf;
insert into bizoveya_private.spending_policies(profile_id,version,profile_version,document,reason) select profile,1,1,jsonb_build_object('enabled',true,'inputRateMicros',1000000,'outputRateMicros',1000000,'requestFeeMicros',0,'dailyLimitMicros',100000,'runLimitMicros',10000,'validUntil',clock_timestamp()+interval '7 days','source','https://example.com/fictional-pricing','reviewed',true),'Synthetic reviewed prices' from dpf;
insert into bizoveya_private.agent_definitions(id,slug,kind,latest_version,preview_version,revision) select coord,'meeting-fixture-coordinator','coordinator',1,1,1 from dpf union all select content,'meeting-fixture-content','content',1,1,1 from dpf;
insert into bizoveya_private.agent_versions(agent_id,version,document,reason) select x.id,1,jsonb_set(v.document,'{modelTier}','"economical"'),'Synthetic meeting role' from dpf f cross join lateral(values(f.coord,'coordinator'),(f.content,'content')) x(id,kind) cross join lateral(select av.document from bizoveya_private.agent_versions av join bizoveya_private.agent_definitions ad on ad.id=av.agent_id where ad.kind=x.kind and ad.id<>x.id order by ad.slug limit 1)v;
insert into bizoveya_private.agent_checks(agent_id,version) select coord,1 from dpf union all select content,1 from dpf;
insert into bizoveya_private.agent_model_bindings(agent_id,agent_version,profile_id,profile_version,credential_version,test_id,revision,enabled,reason) select x.id,1,f.profile,1,1,f.test_run,1,true,'Synthetic meeting binding' from dpf f cross join lateral(values(f.coord),(f.content))x(id);
set local role authenticated;
select public.bz_mutate_knowledge(wid,sid,gen_random_uuid(),'save','{"title":"Approved facts","filename":"facts.md","sourceText":"Bizoveya prepares private reviewable drafts.","facts":[{"id":"f1","text":"Bizoveya prepares private reviewable drafts."}]}',0) from dpf;
select public.bz_mutate_knowledge(wid,sid,(select id from public.bizoveya_knowledge_sources where site_id=sid),'approve',null,1) from dpf;
select public.bz_control_meeting_schedule(wid,sid,jsonb_build_object('id',meeting,'planId',plan,'operationId',gen_random_uuid(),'expectedMeetingVersion',5,'expectedVersion',0,'action','queue','reason','Reviewed private bounded scheduling intent.','reviewed',true,'intentOnly',true)) from dpf;
create temporary table candidate060 as select public.bz_review_meeting_execution_snapshot(wid,sid,meeting,plan,5,1) as value from dpf;
reset role;
grant all on candidate060 to authenticated,service_role;
create function pg_temp.snapshotcmd() returns jsonb language sql as $$select jsonb_build_object('id',meeting,'planId',plan,'snapshotId',execution_id,'expectedMeetingVersion',5,'expectedScheduleVersion',1,'fingerprint',value->>'fingerprint','reviewed',true) from dpf,candidate060$$;

set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from dpf),true);
select public.bz_prepare_meeting_execution_snapshot(wid,sid,pg_temp.snapshotcmd()) from dpf;
select pg_temp.dexpect('select public.bz_admin_meeting_execution_queue()','bz_admin_forbidden');
reset role;
alter table dpf add column consent_id uuid default gen_random_uuid(),add column foreign_admin uuid default gen_random_uuid();
insert into auth.users(id) select foreign_admin from dpf;
select bizoveya_private.set_platform_admin(actor,true,'fixture','Synthetic consent operator') from dpf;
select bizoveya_private.set_platform_admin(foreign_admin,true,'fixture','Synthetic unrelated operator') from dpf;
create function pg_temp.consentcmd(id_ uuid default null) returns jsonb language sql as $$select jsonb_build_object('snapshotId',execution_id,'consentId',coalesce(id_,consent_id),'expectedMeetingVersion',5,'expectedScheduleVersion',1,'expectedRosterVersion',1,'fingerprint',value->>'fingerprint','reason','Consent to bounded private deliberation only.','reviewed',true) from dpf,candidate060$$;
create function pg_temp.revokecmd(id_ uuid default null) returns jsonb language sql as $$select jsonb_build_object('consentId',coalesce(id_,consent_id),'reason','Withdraw this private meeting execution consent.','reviewed',true) from dpf$$;
set local role authenticated;select set_config('request.jwt.claims','{"aal":"aal1"}',true);
select pg_temp.dexpect('select public.bz_admin_meeting_execution_queue()','bz_mfa_required');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()),'bz_mfa_required');
select set_config('request.jwt.claims','{"aal":"aal2"}',true);
select public.bz_admin_meeting_execution_queue();
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object(k,null)),'bz_invalid_meeting_consent') from unnest(array['snapshotId','consentId','expectedMeetingVersion','expectedScheduleVersion','expectedRosterVersion','fingerprint','reason','reviewed'])k;
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('extra',true)),'bz_invalid_meeting_consent');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('expectedMeetingVersion',4)),'bz_conflict');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('expectedScheduleVersion',2)),'bz_conflict');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('expectedRosterVersion',2)),'bz_conflict');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('fingerprint',repeat('0',64))),'bz_conflict');
select set_config('request.jwt.claim.sub',(select foreign_admin::text from dpf),true);
do $$begin if public.bz_admin_meeting_execution_queue()<>'[]'::jsonb then raise exception 'Foreign admin saw a founder snapshot';end if;end;$$;
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()),'bz_forbidden');
select set_config('request.jwt.claim.sub',(select actor::text from dpf),true);
reset role;
-- A changed binding/context, expired qualification, paused team or schedule blocks NEW consent.
do $$declare f dpf%rowtype;expected_ text;case_ integer;begin select * into f from dpf;
 for case_ in 1..5 loop begin
  case case_
  when 1 then update bizoveya_private.agent_model_bindings set revision=revision+1 where agent_id=f.coord;expected_:='bz_meeting_snapshot_changed';
  when 2 then update bizoveya_private.model_test_runs set finished_at=clock_timestamp()-interval '25 hours' where id=f.test_run;expected_:='bz_meeting_qualification_required';
  when 3 then update public.bizoveya_knowledge_sources set version=version+1 where site_id=f.sid;expected_:='bz_meeting_snapshot_changed';
  when 4 then update bizoveya_private.site_agent_rosters set document=jsonb_set(document,'{enabled}','false') where site_id=f.sid;expected_:='bz_site_roster_paused';
  when 5 then update bizoveya_private.meeting_deliberation_schedules set state='paused' where plan_id=f.plan;expected_:='bz_meeting_snapshot_not_ready';
  end case;
  perform pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()),expected_);
  raise exception 'fixture_restore';
 exception when others then if sqlerrm<>'fixture_restore' then raise;end if;end;end loop;
end;$$;
set local role authenticated;
select public.bz_admin_consent_meeting_execution(pg_temp.consentcmd());
select public.bz_admin_consent_meeting_execution(pg_temp.consentcmd());
create temporary table active061 as select public.bz_admin_meeting_execution_queue() as value;
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd()||jsonb_build_object('reason','Changed reason cannot replay an identity.')),'bz_conflict');
select pg_temp.dexpect(format('select public.bz_admin_consent_meeting_execution(%L)',pg_temp.consentcmd(gen_random_uuid())),'bz_meeting_consent_active');
select pg_temp.dexpect('select * from bizoveya_private.meeting_execution_consents','permission denied');
reset role;

-- Authenticated callers cannot access service accounting.
set local role authenticated;
select pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,1,%L,%L)',execution_id,consent_id,gen_random_uuid(),gen_random_uuid(),actor),'permission denied') from dpf;
reset role;
alter table dpf add column turn1 uuid default gen_random_uuid(),add column turn2 uuid default gen_random_uuid(),add column turn3 uuid default gen_random_uuid(),add column turn4 uuid default gen_random_uuid(),add column claim1 uuid default gen_random_uuid(),add column claim2 uuid default gen_random_uuid(),add column claim3 uuid default gen_random_uuid(),add column claim4 uuid default gen_random_uuid();
grant all on dpf to authenticated,service_role;
-- Prior connectivity charges count against a fresh meeting reservation.
do $$declare f dpf%rowtype;begin select * into f from dpf;begin
 insert into bizoveya_private.spending_ledger(run_id,profile_id,policy_version,policy_snapshot,reserved_micros,charged_micros,state,finished_at) select test_run,profile,1,document,98000,98000,'settled',clock_timestamp() from dpf join bizoveya_private.spending_policies on profile_id=profile;
 perform pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,1,%L,%L)',f.execution_id,f.consent_id,f.turn1,f.claim1,f.actor),'bz_daily_budget');
 raise exception 'fixture_restore';
exception when others then if sqlerrm<>'fixture_restore' then raise;end if;end;end;$$;
set local role service_role;
select pg_temp.dexpect('select public.bz_begin_meeting_turn(null,null,null,null,null,null)','bz_invalid_meeting_turn');
select public.bz_begin_meeting_turn(execution_id,consent_id,turn1,1,claim1,actor) from dpf;
select public.bz_begin_meeting_turn(execution_id,consent_id,turn1,1,claim1,actor) from dpf;
select pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,1,%L,%L)',execution_id,consent_id,gen_random_uuid(),gen_random_uuid(),actor),'bz_conflict') from dpf;
select pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,2,%L,%L)',execution_id,consent_id,turn2,claim2,actor),'bz_meeting_turn_order') from dpf;
select pg_temp.dexpect(format('select public.bz_finish_meeting_turn_spending(%L,%L,true,null,10,5)',turn1,claim1),'bz_provider_not_started') from dpf;
reset role;
do $$declare f dpf%rowtype;expected_ text;i integer;begin select * into f from dpf;for i in 1..2 loop begin
 if i=1 then update bizoveya_private.meeting_deliberation_schedules set state='paused' where plan_id=f.plan;expected_:='bz_meeting_snapshot_not_ready';else update bizoveya_private.site_agent_rosters set document=jsonb_set(document,'{enabled}','false') where site_id=f.sid;expected_:='bz_meeting_snapshot_changed';end if;
 perform pg_temp.dexpect(format('select public.bz_record_meeting_turn_provider_start(%L,%L)',f.turn1,f.claim1),expected_);raise exception 'fixture_restore';
exception when others then if sqlerrm<>'fixture_restore' then raise;end if;end;end loop;end;$$;
set local role service_role;
select public.bz_record_meeting_turn_provider_start(turn1,claim1) from dpf;
select public.bz_finish_meeting_turn_spending(turn1,claim1,true,null,1200,600) from dpf;
select public.bz_begin_meeting_turn(execution_id,consent_id,turn2,2,claim2,actor) from dpf;
select public.bz_cancel_unstarted_meeting_turn(turn2,claim2) from dpf;
reset role;
do $$begin
 if not exists(select 1 from bizoveya_private.meeting_turn_runs where id=(select turn1 from dpf) and status='succeeded' and spending_state='settled' and charged_micros=1800) then raise exception 'Meeting settlement mismatch';end if;
 if not exists(select 1 from bizoveya_private.meeting_turn_runs where id=(select turn2 from dpf) and status='failed' and spending_state='settled' and charged_micros=0 and provider_started_at is null) then raise exception 'Unstarted cancellation mismatch';end if;
 if (select count(*) from bizoveya_private.meeting_turn_spending_events where turn_id=(select turn1 from dpf))<>3 then raise exception 'Meeting events mismatch';end if;
end;$$;
-- Cancelled turn cannot satisfy ordering; local fixture marks it succeeded to exercise unknown/reconciliation on later turns.
update bizoveya_private.meeting_turn_runs set status='succeeded',error_code=null where id=(select turn2 from dpf);
set local role service_role;
select public.bz_begin_meeting_turn(execution_id,consent_id,turn3,3,claim3,actor) from dpf;
select public.bz_record_meeting_turn_provider_start(turn3,claim3) from dpf;
select public.bz_finish_meeting_turn_spending(turn3,claim3,false,'provider_usage_missing',null,null) from dpf;
select pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,4,%L,%L)',execution_id,consent_id,turn4,claim4,actor),'bz_spending_unresolved') from dpf;
reset role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from dpf),true);select set_config('request.jwt.claims','{"aal":"aal2"}',true);
do $$declare report_ jsonb;begin report_:=public.bz_admin_spending();if not exists(select 1 from jsonb_array_elements(report_->'runs') x where x->>'run_kind'='meeting_turn' and x->>'snapshot_id'=(select execution_id::text from dpf)) then raise exception 'Meeting run absent from admin accounting';end if;if not exists(select 1 from jsonb_array_elements(report_->'policies') x where (x->>'profile_id')::uuid=(select profile from dpf) and (x->>'blocked')::boolean) then raise exception 'Unknown meeting usage did not block profile';end if;end;$$;
select public.bz_admin_reconcile_spending(turn3,'unknown',2100,'Reviewed provider billing for this meeting turn.',true) from dpf;
reset role;
-- Reconciliation unblocks a fresh ordered turn; revocation blocks provider-start after reservation.
update bizoveya_private.meeting_turn_runs set status='succeeded',error_code=null where id=(select turn3 from dpf);
set local role service_role;
select public.bz_begin_meeting_turn(execution_id,consent_id,turn4,4,claim4,actor) from dpf;
reset role;
update bizoveya_private.meeting_execution_consents set revoked_at=clock_timestamp(),revocation_reason='Synthetic safety revocation after reservation.' where id=(select consent_id from dpf);
set local role service_role;
select pg_temp.dexpect(format('select public.bz_record_meeting_turn_provider_start(%L,%L)',turn4,claim4),'bz_meeting_consent_required') from dpf;
select public.bz_cancel_unstarted_meeting_turn(turn4,claim4) from dpf;
select pg_temp.dexpect('select * from bizoveya_private.meeting_turn_runs','permission denied');
reset role;
-- Meeting accounting is included in fresh model-test daily admission.
do $$declare f dpf%rowtype;new_test uuid:=gen_random_uuid();begin select * into f from dpf;begin
 update bizoveya_private.meeting_turn_runs set charged_micros=99999 where id=f.turn1;
 set local role authenticated;perform set_config('request.jwt.claim.sub',f.actor::text,true);perform public.bz_admin_begin_model_test(new_test,f.profile,1,1,gen_random_uuid(),true,'Reviewed shared meeting daily budget check.');
 raise exception 'Expected shared daily budget denial';
exception when others then if strpos(sqlerrm,'bz_daily_budget')=0 then raise;end if;end;end;$$;
reset role;
-- Revoked consent blocks fresh admission after owner loss; exact recorded retries remain non-billable truth.
delete from public.bizoveya_memberships where workspace_id=(select wid from dpf) and user_id=(select actor from dpf);
set local role service_role;
select pg_temp.dexpect(format('select public.bz_begin_meeting_turn(%L,%L,%L,4,%L,%L)',execution_id,consent_id,gen_random_uuid(),gen_random_uuid(),actor),'bz_meeting_consent_required') from dpf;
select public.bz_begin_meeting_turn(execution_id,consent_id,turn1,1,claim1,actor) from dpf;
reset role;
delete from public.bizoveya_sites where id=(select sid from dpf);
do $$begin if exists(select 1 from bizoveya_private.meeting_turn_runs) or exists(select 1 from bizoveya_private.meeting_turn_spending_events) then raise exception 'Meeting accounting failed cascade';end if;end;$$;
rollback;
