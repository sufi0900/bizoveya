-- Local isolated fixtures only; never run against hosted customer data.
begin;
create temporary table ci(owner_id uuid,member_id uuid,outside_id uuid,w uuid,s uuid,s2 uuid,c uuid,run uuid,mid uuid,attempt uuid,base jsonb,d jsonb,doc jsonb);
insert into ci values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),
 jsonb_build_object('schema','campaign-visuals-v2','brand',jsonb_build_object('name','Brand','accent','#123456','footer','Private test'),'pins',jsonb_build_array(jsonb_build_object('title','Pin one','body','Source excerpt'),jsonb_build_object('title','Pin two','body','Source excerpt')),'slides',(select jsonb_agg(jsonb_build_object('title','Slide '||n,'body','Source excerpt')) from generate_series(1,6)n),'templates',jsonb_build_object('pins',jsonb_build_array('classic','midnight'),'carousel','classic','linkedin','headline'),'linkedin',jsonb_build_object('title','LinkedIn','body','Source excerpt')),
 '{"schema":"private-media-descriptor-v1","mime":"image/png","bytes":1024,"width":1000,"height":1500,"sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","alt":"Owned blue image","origin":"user-upload","rights":{"basis":"own-work","evidence":"My work","attested":true}}',null);
insert into auth.users(id) select owner_id from ci union all select member_id from ci union all select outside_id from ci;
insert into public.bizoveya_workspaces(id,owner_id,name) select w,owner_id,'Campaign image fixture' from ci;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select w,owner_id,'owner' from ci union all select w,member_id,'viewer' from ci;
insert into public.bizoveya_sites(id,workspace_id,name,mode,kind,status,created_by) select s,w,'Image site','native_business','business','active',owner_id from ci union all select s2,w,'Other site','native_business','business','active',owner_id from ci;
create function pg_temp.ciexpect(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;end if;raise;end;raise exception 'Expected %',n;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;grant all on ci to authenticated,service_role;
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from ci),true);
select public.bz_save_campaign(w,s,c,'{"title":"Image fixture","brief":"Reviewed source","blog":"","pinterest":"","linkedin":""}',0) from ci;
reset role;
insert into bizoveya_private.generation_runs(id,campaign_id,site_id,campaign_version,status,input_snapshot,output_document,requested_by) select run,c,s,1,'succeeded','{}','{"schema":"campaign-generation-output-v1","stages":{"quality":{"approved":true,"issues":[]}}}',owner_id from ci;
set local role authenticated;
select public.bz_review_campaign_generation(w,s,run,0,'accepted','Reviewed source fixture') from ci;
select public.bz_save_campaign_visual(w,s,run,0,1,base,true) from ci;
reset role;set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
select public.bz_prepare_media_upload(owner_id,w,s,attempt,mid,0,d) from ci;
select public.bz_commit_media_upload(owner_id,w,s,attempt) from ci;
reset role;set local role authenticated;select set_config('request.jwt.claim.role','authenticated',true);
update ci set doc=jsonb_build_object('schema','campaign-media-working-copy-v1','document',base,'attachments',jsonb_build_array(jsonb_build_object('target','pin-1','reference',jsonb_build_object('mediaId',mid,'version',1,'sha256',d->>'sha256'),'descriptor',d)));
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,0,1,1,%L::jsonb,true,true)',w,s,run,doc),'bz_media_unavailable') from ci;
select public.bz_review_private_media(w,s,mid,1,1,'accepted','Reviewed image and rights') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,0,1,1,%L::jsonb,true,false)',w,s,run,doc),'bz_invalid_media_visual') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,0,2,1,%L::jsonb,true,true)',w,s,run,doc),'bz_image_base_changed') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,0,1,1,%L::jsonb,true,true)',w,s,run,jsonb_set(doc,'{attachments,0,descriptor,alt}','"Forged alt"')),'bz_media_unavailable') from ci;
select public.bz_save_campaign_image_draft(w,s,run,0,1,1,doc,true,true) from ci;
select public.bz_save_campaign_image_draft(w,s,run,1,1,1,doc,true,true) from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,0,1,1,%L::jsonb,true,true)',w,s,run,doc),'bz_conflict') from ci;
select pg_temp.ciexpect(format('select public.bz_campaign_image_draft(%L,%L,%L)',w,s2,run),'bz_not_found') from ci;
select public.bz_archive_private_media(w,s,mid,2) from ci;
select public.bz_save_campaign_image_draft(w,s,run,1,1,1,jsonb_set(doc,'{attachments}','[]'),true,true) from ci;
select public.bz_save_campaign_image_draft(w,s,run,2,1,1,doc,true,true) from ci;
-- Latest source review, not a historical acceptance, authorizes a new save.
select public.bz_review_campaign_generation(w,s,run,1,'changes_requested','Source requires another check') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,3,1,1,%L::jsonb,true,true)',w,s,run,doc),'bz_visual_source_unaccepted') from ci;
select public.bz_review_campaign_generation(w,s,run,2,'accepted','Source checked again for private use') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,3,1,3,%L::jsonb,true,true)',w,s,run,doc),'bz_image_base_changed') from ci;
select public.bz_save_campaign_visual(w,s,run,1,3,base,true) from ci;
select public.bz_save_campaign_image_draft(w,s,run,3,2,3,doc,true,true) from ci;
reset role;
create temporary table ciquota(mid uuid,attempt uuid,d jsonb);
insert into ciquota select gen_random_uuid(),gen_random_uuid(),jsonb_set(jsonb_set(d,'{bytes}','5242880'),'{sha256}',to_jsonb(repeat('c',64))) from ci;
grant all on ciquota to authenticated,service_role;
-- Simulate prior retained historical objects just below the site quota.
insert into bizoveya_private.campaign_image_objects(generation_id,media_id,media_version,creator_id,descriptor,review,object_path)
select f.run,m.id,1,f.owner_id,jsonb_set(jsonb_set(f.d,'{bytes}','5242880'),'{sha256}',to_jsonb(repeat('b',64))),'{}',concat(f.owner_id,'/',f.w,'/',f.s,'/',m.id,'/1/',repeat('b',64),'.png') from ci f cross join lateral (select gen_random_uuid() id from generate_series(1,31)) m;
set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
select public.bz_prepare_media_upload(f.owner_id,f.w,f.s,q.attempt,q.mid,0,q.d) from ci f cross join ciquota q;
select public.bz_commit_media_upload(f.owner_id,f.w,f.s,q.attempt) from ci f cross join ciquota q;
reset role;set local role authenticated;select set_config('request.jwt.claim.role','authenticated',true);
select public.bz_review_private_media(f.w,f.s,q.mid,1,1,'accepted','Reviewed quota fixture') from ci f cross join ciquota q;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,4,2,3,%L::jsonb,true,true)',f.w,f.s,f.run,jsonb_set(f.doc,'{attachments}',jsonb_build_array(jsonb_build_object('target','pin-1','reference',jsonb_build_object('mediaId',q.mid,'version',1,'sha256',q.d->>'sha256'),'descriptor',q.d)))),'bz_image_retained_limit') from ci f cross join ciquota q;
reset role;
do $$begin if exists(select 1 from bizoveya_private.campaign_image_objects where media_id=(select mid from ciquota)) or (select version from bizoveya_private.campaign_image_drafts where generation_id=(select run from ci))<>4 then raise exception 'Quota failure was not atomic';end if;end;$$;
delete from bizoveya_private.campaign_image_objects where descriptor->>'sha256'=repeat('b',64);
-- The failed copy leaves its original creator-private upload intact; remove only this fixture.
delete from bizoveya_private.private_media where id=(select mid from ciquota);
delete from bizoveya_private.media_upload_attempts where id=(select attempt from ciquota);
set local role authenticated;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,4,2,3,%L::jsonb,true,true)',w,s,run,jsonb_set(doc,'{attachments}',jsonb_build_array(doc#>'{attachments,0}',doc#>'{attachments,0}'))),'bz_invalid_media_visual') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,4,2,3,%L::jsonb,true,true)',w,s,run,jsonb_set(doc,'{attachments,0,reference,version}','"1"')),'bz_invalid_media_visual') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,4,2,3,%L::jsonb,true,true)',w,s,run,jsonb_set(doc,'{attachments,0,descriptor,bytes}','"1024"')),'bz_invalid_media_visual') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,4,2,3,%L::jsonb,true,true)',w,s,run,jsonb_set(doc,'{attachments,0,url}','"https://example.com/image.png"')),'bz_invalid_media_visual') from ci;
select set_config('request.jwt.claim.sub',(select member_id::text from ci),true);
do $$declare result_ jsonb;begin select public.bz_campaign_image_draft(w,s,run) into result_ from ci;if result_->>'version'<>'4' or jsonb_array_length(result_->'revisions')<>4 or result_#>>'{document,attachments,0,descriptor,alt}'<>'Owned blue image' then raise exception 'Retention/no-op/history failed';end if;if result_::text like '%object_path%' or result_::text like '%/1/aaa%' then raise exception 'Private path leaked';end if;end;$$;
select pg_temp.ciexpect(format('select public.bz_private_media(%L,%L,%L)',w,s,mid),'bz_media_unavailable') from ci;
select pg_temp.ciexpect(format('select public.bz_save_campaign_image_draft(%L,%L,%L,3,1,1,%L::jsonb,true,true)',w,s,run,doc),'bz_forbidden') from ci;
select set_config('request.jwt.claim.sub',(select outside_id::text from ci),true);
select pg_temp.ciexpect(format('select public.bz_campaign_image_draft(%L,%L,%L)',w,s,run),'bz_forbidden') from ci;
reset role;
select pg_temp.ciexpect('update bizoveya_private.campaign_image_objects set object_path=''changed''','bz_immutable_media');
select pg_temp.ciexpect('update bizoveya_private.campaign_image_revisions set base_visual_version=2','bz_immutable_media');
do $$begin if has_function_privilege('authenticated','public.bz_campaign_image_object(uuid,uuid,uuid,uuid,uuid,integer)','execute') then raise exception 'Browser path resolver exposed';end if;end;$$;
update public.bizoveya_workspaces set owner_id=(select member_id from ci) where id=(select w from ci);
update public.bizoveya_memberships set role='owner' where user_id=(select member_id from ci);
-- Isolate retention from the existing restrictive source-review account FK.
-- Production account deletion is not enabled or changed by this migration.
delete from bizoveya_private.generation_reviews where generation_id=(select run from ci);
delete from auth.users where id=(select owner_id from ci);
do $$begin if exists(select 1 from bizoveya_private.private_media where id=(select mid from ci)) or not exists(select 1 from bizoveya_private.campaign_image_objects where generation_id=(select run from ci)) then raise exception 'Creator deletion retention failed';end if;end;$$;
update bizoveya_private.media_upload_attempts set created_at=clock_timestamp()-interval '11 minutes' where id=(select attempt from ci);
set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
do $$declare result_ jsonb;f record;begin select * into f from ci;select public.bz_claim_media_cleanup_global() into result_;if jsonb_array_length(result_)<>0 then raise exception 'Cleanup selected retained artifact';end if;result_:=public.bz_campaign_image_object(f.member_id,f.w,f.s,f.run,f.mid,1);if result_#>>'{descriptor,sha256}'<>repeat('a',64) then raise exception 'Shared retained object resolution failed';end if;perform pg_temp.ciexpect(format('select public.bz_campaign_image_object(%L,%L,%L,%L,%L,1)',f.member_id,f.w,f.s2,f.run,f.mid),'bz_media_unavailable');end;$$;
reset role;
delete from bizoveya_private.generation_runs where id=(select run from ci);
set local role service_role;
do $$declare result_ jsonb;begin select public.bz_claim_media_cleanup_global() into result_;if jsonb_array_length(result_)<>1 then raise exception 'Removed campaign orphan not selected';end if;perform public.bz_finish_media_cleanup_global((result_#>>'{0,id}')::uuid);end;$$;
reset role;
rollback;
