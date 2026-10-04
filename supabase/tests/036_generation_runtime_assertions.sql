-- Local synthetic fixture only. Never run on hosted data; no provider request is made.
begin;
create temporary table gs(owner_id uuid,outsider uuid,w uuid,s uuid,c uuid,run uuid,profile uuid,test_run uuid,coordinator uuid,content uuid,quality uuid,claim1 uuid,claim2 uuid,claim3 uuid);
insert into gs values(gen_random_uuid(),gen_random_uuid(),null,null,gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid());
insert into auth.users(id) select owner_id from gs union all select outsider from gs;
create function pg_temp.gsexpect(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;else raise exception 'Unexpected: %',sqlerrm;end if;end;raise exception 'Expected %',n;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated,anon,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;grant all on gs to authenticated,anon,service_role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from gs),true);
update gs set w=(select id from public.bz_create_workspace('Stage accounting fixture'));
update gs set s=(select id from public.bz_register_site(w,'Draft pilot','external','business','https://stage-fixture.com/',null,'active',true));
select public.bz_save_site_agent_preferences(w,s,'{"brandVoice":"practical","audience":"small business owners","guidance":"Draft only"}',0) from gs;
select public.bz_mutate_knowledge(w,s,gen_random_uuid(),'save','{"title":"Approved facts","filename":"facts.md","sourceText":"Bizoveya prepares private reviewable drafts.","facts":[{"id":"f1","text":"Bizoveya prepares private reviewable drafts."}]}',0) from gs;
select public.bz_mutate_knowledge(w,s,(select id from public.bizoveya_knowledge_sources where site_id=s),'approve',null,1) from gs;
select public.bz_save_campaign(w,s,c,'{"title":"Pilot","brief":"Prepare three draft formats","blog":"","pinterest":"","linkedin":""}',0) from gs;
reset role;
update bizoveya_private.model_credentials set enabled=true where id='platform-gemini';
insert into bizoveya_private.model_profiles(id,slug,version,revision) select profile,'stage-fixture',1,1 from gs;
insert into bizoveya_private.model_profile_versions(profile_id,version,document,reason) select profile,1,'{"name":"Fixture Gemini","provider":"gemini","credentialRef":"platform-gemini","modelId":"fixture-model","tier":"economical","maxOutputTokens":1500,"dailyBudgetCents":100}','Synthetic stage fixture' from gs;
insert into bizoveya_private.model_profile_checks(profile_id,version,credential_id,credential_version) select profile,1,'platform-gemini',1 from gs;
insert into bizoveya_private.model_test_runs(id,profile_id,profile_version,credential_id,credential_version,claim,status,result_code,input_tokens,output_tokens,reason,finished_at) select test_run,profile,1,'platform-gemini',1,gen_random_uuid(),'passed','response_matched',20,7,'Synthetic connectivity evidence',clock_timestamp() from gs;
insert into bizoveya_private.spending_policies(profile_id,version,profile_version,document,reason) select profile,1,1,jsonb_build_object('enabled',true,'inputRateMicros',0,'outputRateMicros',0,'requestFeeMicros',0,'dailyLimitMicros',10000,'runLimitMicros',10000,'validUntil',clock_timestamp()+interval '7 days','source','https://example.com/fictional-pricing','reviewed',true),'Synthetic reviewed prices' from gs;
update bizoveya_private.agent_versions set document=jsonb_set(document,'{modelTier}','"economical"') where version=1 and agent_id in(select id from bizoveya_private.agent_definitions where kind in('coordinator','content','quality'));
update bizoveya_private.agent_definitions set preview_version=1 where kind in('coordinator','content','quality');
insert into bizoveya_private.agent_checks(agent_id,version) select id,1 from bizoveya_private.agent_definitions where kind in('coordinator','content','quality') on conflict do nothing;
insert into bizoveya_private.agent_model_bindings(agent_id,agent_version,profile_id,profile_version,credential_version,test_id,revision,enabled,reason) select a.id,1,g.profile,1,1,g.test_run,1,true,'Synthetic generation binding' from bizoveya_private.agent_definitions a cross join gs g where a.kind in('coordinator','content','quality');
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from gs),true);select public.bz_prepare_campaign_generation(w,s,c,1,run) from gs;
select pg_temp.gsexpect(format('select public.bz_begin_campaign_generation_stage(%L,%L,''coordinator'',%L,%L)',run,coordinator,claim1,owner_id),'permission denied') from gs;

select pg_temp.gsexpect(format('select public.bz_claim_campaign_generation_stage(%L,%L,''coordinator'',%L,%L)',run,coordinator,claim1,owner_id),'permission denied') from gs;
reset role;
-- Revoked facts must invalidate a prepared snapshot before any reservation.
update public.bizoveya_knowledge_sources set approved=false,approved_at=null,approved_by=null where site_id=(select s from gs);
set local role service_role;
select pg_temp.gsexpect(format('select public.bz_claim_campaign_generation_stage(%L,%L,''coordinator'',%L,%L)',run,coordinator,claim1,owner_id),'bz_generation_stale') from gs;
reset role;update public.bizoveya_knowledge_sources set approved=true,approved_at=clock_timestamp(),approved_by=(select owner_id from gs) where site_id=(select s from gs);
set local role service_role;
select pg_temp.gsexpect(format('select public.bz_claim_campaign_generation_stage(%L,%L,''coordinator'',%L,%L)',run,coordinator,claim1,outsider),'bz_forbidden') from gs;
do $$declare result jsonb;begin
 select public.bz_claim_campaign_generation_stage(run,coordinator,'coordinator',claim1,owner_id) into result from gs;
 if result->>'execute'<>'true' or result->>'inputLimit'<>'32768' or result->'snapshot'->>'schema'<>'campaign-generation-input-v1' then raise exception 'Runtime claim lacks context';end if;
 select public.bz_claim_campaign_generation_stage(run,gen_random_uuid(),'coordinator',gen_random_uuid(),owner_id) into result from gs;
 if result->>'execute'<>'false' then raise exception 'Replay would execute twice';end if;
end;$$;
select pg_temp.gsexpect(format('select public.bz_cancel_unstarted_generation_stage(%L,null)',coordinator),'bz_conflict') from gs;
select pg_temp.gsexpect(format('select public.bz_finish_campaign_generation_stage(%L,null,null,null,0,0)',coordinator),'bz_conflict') from gs;
select public.bz_record_generation_request(coordinator,claim1,'{"runtimeVersion":"draft-runtime-v1-ai7.0.127","instructions":"Use approved facts only","prompt":"Synthetic prompt never sent"}') from gs;
select pg_temp.gsexpect(format('select public.bz_record_generation_request(%L,%L,%L::jsonb)',coordinator,claim1,'{"runtimeVersion":"draft-runtime-v1-ai7.0.127","instructions":"Use approved facts only","prompt":"Replay"}'),'bz_conflict') from gs;
select pg_temp.gsexpect(format('select public.bz_cancel_unstarted_generation_stage(%L,%L)',coordinator,claim1),'bz_provider_already_started') from gs;
reset role;
-- Synthetic preflight fixture: no actual provider request occurred.
update bizoveya_private.generation_stage_runs set provider_started_at=null where id=(select coordinator from gs);
-- Connectivity admission must include the campaign ledger, in both block and budget checks.
select bizoveya_private.set_platform_admin(owner_id,true,'runtime-fixture','Synthetic runtime admin') from gs;
update bizoveya_private.generation_stage_runs set spending_state='unknown' where id=(select coordinator from gs);
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from gs),true);select set_config('request.jwt.claims','{"aal":"aal2"}',true);
select pg_temp.gsexpect(format('select public.bz_admin_begin_model_test(%L,%L,1,1,%L,true,''Synthetic reviewed test request'')',gen_random_uuid(),profile,gen_random_uuid()),'bz_spending_unresolved') from gs;
reset role;update bizoveya_private.generation_stage_runs set spending_state='reserved',charged_micros=10000 where id=(select coordinator from gs);
update bizoveya_private.spending_policies set document=jsonb_set(document,'{requestFeeMicros}','1') where profile_id=(select profile from gs);
set local role authenticated;
select pg_temp.gsexpect(format('select public.bz_admin_begin_model_test(%L,%L,1,1,%L,true,''Synthetic reviewed test request'')',gen_random_uuid(),profile,gen_random_uuid()),'bz_daily_budget') from gs;
reset role;set local role service_role;
select public.bz_cancel_unstarted_generation_stage(coordinator,claim1) from gs;
select public.bz_cancel_unstarted_generation_stage(coordinator,claim1) from gs;
reset role;
do $$begin
 if (select count(*) from bizoveya_private.generation_stage_runs)<>1 then raise exception 'Duplicate claim inserted';end if;
 if (select charged_micros from bizoveya_private.generation_stage_runs)<>0 then raise exception 'Unstarted cancellation charged money';end if;
 if (select status from bizoveya_private.generation_runs)<>'failed' then raise exception 'Cancellation not terminal';end if;
 if has_function_privilege('authenticated','public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid)','execute') then raise exception 'Customer runtime claim exposed';end if;
end;$$;
rollback;
