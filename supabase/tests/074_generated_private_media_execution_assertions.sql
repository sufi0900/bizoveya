-- Ephemeral generated-media lifecycle only. No provider call or real customer content.
begin;
create temporary table gf(actor uuid,wid uuid,sid uuid,profile uuid,request uuid,claim uuid,op uuid,doc jsonb,descriptor jsonb);
insert into gf(actor,wid,sid,profile,request,claim,op) values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid());
insert into auth.users(id) select actor from gf;
insert into public.bizoveya_workspaces(id,owner_id,name) select wid,actor,'Generated media fixture' from gf;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select wid,actor,'owner' from gf;
insert into public.bizoveya_sites(id,workspace_id,name,mode,kind,status,created_by) select sid,wid,'Generated image site','native_business','business','active',actor from gf;
select bizoveya_private.set_platform_admin(actor,true,'fixture','Synthetic generated-media operator') from gf;
update bizoveya_private.model_credentials set enabled=true where id='platform-gemini';
insert into bizoveya_private.model_profiles(id,slug,version,revision) select profile,'generated-media-fixture',1,1 from gf;
insert into bizoveya_private.model_profile_versions(profile_id,version,document,reason) select profile,1,'{"name":"Fixture","provider":"gemini","credentialRef":"platform-gemini","modelId":"fixture-image","tier":"economical","maxOutputTokens":1500,"dailyBudgetCents":100}','Synthetic fixture' from gf;
insert into bizoveya_private.model_profile_checks(profile_id,version,credential_id,credential_version) select profile,1,'platform-gemini',1 from gf;
insert into bizoveya_private.spending_policies(profile_id,version,profile_version,document,reason) select profile,1,1,jsonb_build_object('enabled',true,'inputRateMicros',0,'outputRateMicros',0,'requestFeeMicros',0,'dailyLimitMicros',100000,'runLimitMicros',10000,'validUntil',clock_timestamp()+interval '7 days','source','https://example.com/fixture','reviewed',true),'Synthetic free fixture' from gf;
update gf set doc=jsonb_build_object('provider','gemini','modelId','fixture-image','credentialRef','platform-gemini','credentialVersion',1,'budgetProfileId',profile,'costMode','free-attested','inputTokenLimit',256,'outputTokenLimit',128,'durationSeconds',60,'maxDailyRequests',5,'maxConcurrent',1,'inputRateMicros',0,'outputRateMicros',0,'requestFeeMicros',0,'validUntil',clock_timestamp()+interval '1 day','evidenceUrl','https://example.com/synthetic-api-evidence','apiVerified',true,'commercialReviewed',true);
create function pg_temp.expect(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;end if;raise;end;raise exception 'Expected %',n;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;grant all on gf to authenticated,service_role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from gf),true);select set_config('request.jwt.claims','{"aal":"aal2"}',true);
select public.bz_admin_review_media_capability(wid,sid,jsonb_build_object('operationId',op,'capability','image','expectedVersion',0,'action','qualify','reason','Synthetic generated image qualification.','reviewed',true,'document',doc)) from gf;
select public.bz_admit_media_request(wid,sid,jsonb_build_object('id',request,'capability','image','expectedQualificationVersion',1,'document','{"prompt":"A synthetic private blue illustration","aspectRatio":"2:3"}'::jsonb,'reviewed',true)) from gf;
select pg_temp.expect(format('select public.bz_prepare_generated_media(%L,%L,%L,%L,10,20)',request,claim,actor,'{}'),'permission denied') from gf;
reset role;set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
select public.bz_claim_media_request(request,claim,actor) from gf;select public.bz_start_media_provider(request,claim,actor) from gf;
update gf set descriptor=jsonb_build_object('schema','private-media-descriptor-v2','mime','image/png','bytes',8,'width',1,'height',1,'sha256',repeat('a',64),'alt','Synthetic blue illustration','origin','ai-generated','rights',jsonb_build_object('basis','provider-output','evidence','Provider output requires owner review.','attested',false),'provenance',jsonb_build_object('requestId',request,'provider','gemini','modelId','fixture-image','promptHash',encode(sha256(convert_to('A synthetic private blue illustration','UTF8')),'hex')));
select pg_temp.expect(format('select public.bz_prepare_generated_media(%L,%L,%L,%L,10,20)',request,claim,actor,descriptor||jsonb_build_object('provenance',(descriptor->'provenance')||jsonb_build_object('promptHash',repeat('f',64)))),'bz_invalid_media') from gf;
select public.bz_prepare_generated_media(request,claim,actor,descriptor,10,20) from gf;
select public.bz_prepare_generated_media(request,claim,actor,descriptor,10,20) from gf; -- exact preparation replay
select public.bz_commit_generated_media(request,actor) from gf;
select public.bz_commit_generated_media(request,actor) from gf; -- lost-response replay
select public.bz_resume_generated_media(request,actor) from gf;
reset role;
do $$begin
 if not exists(select 1 from bizoveya_private.generated_media_attempts where state='committed') then raise exception 'Generated attempt not committed';end if;
 if not exists(select 1 from bizoveya_private.media_requests where status='succeeded' and spending_state='settled' and receipt->>'artifactHash'=repeat('a',64)) then raise exception 'Generated request not truthfully settled';end if;
 if not exists(select 1 from bizoveya_private.private_media_versions where descriptor->>'origin'='ai-generated' and review_decision is null) then raise exception 'Generated artifact skipped review gate';end if;
 if has_function_privilege('authenticated','public.bz_commit_generated_media(uuid,uuid)','EXECUTE') or has_table_privilege('service_role','bizoveya_private.generated_media_attempts','SELECT') then raise exception 'Unsafe generated media grants';end if;
end;$$;
rollback;
