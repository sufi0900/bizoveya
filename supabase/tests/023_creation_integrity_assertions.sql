-- Disposable/staging DB only. Rolls all fixtures back. Never deploy this as migration.
begin;
create temporary table creation_fixture(owner_id uuid,viewer_id uuid,outsider_id uuid,workspace_id uuid,site_id uuid,external_id uuid,doc jsonb);
insert into creation_fixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,null,'{"schemaVersion":2,"templateId":"local-services-v1","accent":"blue","name":"Local Business","headline":"Approved introduction","description":"","about":"","location":"","email":"","phone":"","services":[{"title":"Service","description":""}],"font":"modern","hours":"","sections":[{"id":"hero","type":"hero","layout":"centered","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]}]}'::jsonb);
do $$ begin execute format('grant usage on schema %I to authenticated,anon',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end; $$;
grant select,update on creation_fixture to authenticated;
insert into auth.users(id) select owner_id from creation_fixture union all select viewer_id from creation_fixture union all select outsider_id from creation_fixture;
create function pg_temp.creation_error(sql text, expected text) returns void language plpgsql as $$
declare caught boolean:=false;
begin
 begin execute sql; exception when others then if sqlerrm=expected then caught:=true; else raise; end if; end;
 if not caught then raise exception 'Expected %: %',expected,sql; end if;
end; $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from creation_fixture),true);
update creation_fixture set workspace_id=(select id from public.bz_create_workspace('Main Business'));
select pg_temp.creation_error('select public.bz_create_workspace(''  main   business  '')','bz_duplicate_workspace');
update creation_fixture set site_id=(select id from public.bz_register_business_site(workspace_id,'Local Business','active',true,doc));
do $$ begin if (select count(*) from public.bizoveya_business_drafts where document->>'templateId'='local-services-v1' and version=1)<>1 then raise exception 'Initial template draft not saved'; end if; end; $$;
select pg_temp.creation_error(format('select public.bz_register_business_site(%L,'' local   business '', ''active'',true,%L)',workspace_id,jsonb_set(doc,'{name}','"local   business"')),'bz_duplicate_name') from creation_fixture;
update creation_fixture set external_id=(select id from public.bz_register_site(workspace_id,'Existing Site','external','business','https://www.doitwithai.tools/',null,'active',true));
select pg_temp.creation_error(format('select public.bz_register_site(%L,''Different label'',''external'',''business'',''http://doitwithai.tools:80'',null,''active'',true)',workspace_id),'bz_duplicate_url') from creation_fixture;
select pg_temp.creation_error(format('select public.bz_update_site(%L,%L,''LOCAL BUSINESS'',''active'',1,null,false)',workspace_id,external_id),'bz_duplicate_name') from creation_fixture;
-- Failed initial-draft validation is atomic: no registry record is left behind.
select pg_temp.creation_error(format('select public.bz_register_business_site(%L,''Invalid draft'',''active'',true,%L)',workspace_id,doc||'{"name":"Invalid draft","accent":"invalid"}'::jsonb),'bz_invalid_business_document') from creation_fixture;
do $$ begin if (select count(*) from public.bizoveya_sites)<>2 then raise exception 'Duplicate or failed creation left orphan'; end if; end; $$;
-- Owner renaming must respect the same normalized name rule as creation.
select pg_temp.creation_error(format('select public.bz_rename_workspace(%L,''Main Business'',1)',(select id from public.bz_create_workspace('Rename Fixture'))),'bz_duplicate_workspace');
-- Same business label in a different workspace is valid, no cross-tenant enumeration.
select public.bz_register_site((select id from public.bz_create_workspace('Other Business')),'Local Business','native_business','business',null,null,'active',true);
reset role;
insert into public.bizoveya_memberships select workspace_id,viewer_id,'viewer',now() from creation_fixture;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select viewer_id::text from creation_fixture),true);
select pg_temp.creation_error(format('select public.bz_register_business_site(%L,''Local Business'',''active'',true,%L)',workspace_id,doc),'bz_forbidden') from creation_fixture;
select set_config('request.jwt.claim.sub',(select outsider_id::text from creation_fixture),true);
select pg_temp.creation_error(format('select public.bz_register_business_site(%L,''Local Business'',''active'',true,%L)',workspace_id,doc),'bz_forbidden') from creation_fixture;
reset role;
-- Legacy duplicates preserved; unchanged identity edits work, new conflict blocked.
alter table public.bizoveya_sites disable trigger bz_site_identity;
insert into public.bizoveya_sites(workspace_id,name,mode,kind,url,status,created_by) select workspace_id,'Existing Site','external','business','https://www.doitwithai.tools/','active',owner_id from creation_fixture;
alter table public.bizoveya_sites enable trigger bz_site_identity;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from creation_fixture),true);
select public.bz_update_site(workspace_id,external_id,'Existing Site','paused',1,null,false) from creation_fixture;
do $$ begin if (select count(*) from public.bizoveya_sites where name='Existing Site')<>2 then raise exception 'Legacy duplicate removed'; end if; end; $$;
reset role;
rollback;
