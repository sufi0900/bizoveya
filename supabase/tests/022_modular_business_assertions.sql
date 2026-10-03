-- Staging/disposable DB only, after 001–022. All fixtures roll back.
begin;
create temporary table modular_fixture(owner_id uuid,editor_id uuid,viewer_id uuid,outsider_id uuid,workspace_id uuid,site_id uuid,external_id uuid,doc jsonb);
insert into modular_fixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,null,'{"schemaVersion":2,"templateId":"service-studio-v1","accent":"mint","name":"Modular test business","headline":"Approved headline","description":"","about":"","location":"","email":"","phone":"","services":[{"title":"Service","description":"Details"}],"font":"editorial","hours":"","sections":[{"id":"hero","type":"hero","layout":"split","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]},{"id":"services","type":"services","layout":"cards","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]},{"id":"contact","type":"contact","layout":"panel","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]}]}'::jsonb);
do $$ begin execute format('grant usage on schema %I to authenticated, anon',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end; $$;
grant select,update on modular_fixture to authenticated;
grant select on modular_fixture to anon;
insert into auth.users(id) select owner_id from modular_fixture union all select editor_id from modular_fixture union all select viewer_id from modular_fixture union all select outsider_id from modular_fixture;
create function pg_temp.modular_expect_error(sql text, expected text) returns void language plpgsql as $$
declare caught boolean := false;
begin
  begin execute sql; exception when others then if sqlerrm = expected or (expected='permission' and sqlstate='42501') then caught:=true; else raise; end if; end;
  if not caught then raise exception 'Expected %: %',expected,sql; end if;
end; $$;
-- Exhaustive supported layout pairs, both additional preset IDs and unsafe assets.
do $$
declare pair text; parts text[]; candidate jsonb; fixture_doc jsonb;
begin
  select doc into fixture_doc from modular_fixture;
  foreach pair in array array['hero:split','hero:centered','hero:editorial','services:cards','services:list','services:rows','about:split','about:text','testimonials:cards','testimonials:featured','testimonials:slider','projects:grid','projects:featured','faq:accordion','faq:list','contact:panel','contact:compact','cta:banner','cta:centered'] loop
    parts := string_to_array(pair,':');
    candidate := jsonb_set(jsonb_set(fixture_doc,'{sections,0,type}',to_jsonb(parts[1])),'{sections,0,layout}',to_jsonb(parts[2]));
    if not bizoveya_private.valid_business_document(candidate) then raise exception 'Registered layout rejected: %',pair; end if;
  end loop;
  foreach pair in array array['local-services-v1','creative-business-v1'] loop
    if not bizoveya_private.valid_business_document(jsonb_set(fixture_doc,'{templateId}',to_jsonb(pair))) then raise exception 'Preset rejected: %',pair; end if;
  end loop;
  foreach pair in array array['javascript:alert(1)','http://example.com/a','data:image/png,a','https://user:pass@example.com/a','https://localhost/a','https://127.0.0.1/a'] loop
    if bizoveya_private.valid_business_document(jsonb_set(fixture_doc,'{sections,0,image}',to_jsonb(pair))) then raise exception 'Unsafe asset accepted: %',pair; end if;
  end loop;
  if not bizoveya_private.valid_business_document(jsonb_set(fixture_doc,'{sections,0,image}','"https://example.com/photo.jpg"')) then raise exception 'HTTPS photo rejected'; end if;
end; $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from modular_fixture),true);
update modular_fixture set workspace_id=(select id from public.bz_create_workspace('Business acceptance'));
update modular_fixture set site_id=(select id from public.bz_register_site(workspace_id,'Native','native_business','business',null,null,'active',true));
update modular_fixture set external_id=(select id from public.bz_register_site(workspace_id,'External','external','business','https://sufianmustafa.com/',null,'active',true));
select public.bz_save_business_draft(workspace_id,site_id,doc,0) from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,0)',workspace_id,site_id,doc),'bz_conflict') from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,1)',workspace_id,site_id,doc||'{"accent":"evil"}'::jsonb),'bz_invalid_business_document') from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,1)',workspace_id,site_id,doc-'name'),'bz_invalid_business_document') from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,0)',workspace_id,external_id,doc),'bz_not_found') from modular_fixture;
select pg_temp.modular_expect_error('update public.bizoveya_business_drafts set version=99','permission');
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,1)',workspace_id,site_id,jsonb_set(doc,'{sections,0,layout}','"accordion"')),'bz_invalid_business_document') from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,1)',workspace_id,site_id,jsonb_set(doc,'{sections,1,id}','"hero"')),'bz_invalid_business_document') from modular_fixture;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,1)',workspace_id,site_id,jsonb_set(doc,'{sections,0,image}','"javascript:alert(1)"')),'bz_invalid_business_document') from modular_fixture;

reset role;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select workspace_id,editor_id,'editor' from modular_fixture union all select workspace_id,viewer_id,'viewer' from modular_fixture;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select editor_id::text from modular_fixture),true);
select public.bz_save_business_draft(workspace_id,site_id,doc||'{"headline":"Editor updated"}'::jsonb,1) from modular_fixture;
do $$ begin if (select version from public.bizoveya_business_drafts)<>2 then raise exception 'Editor save failed'; end if; end; $$;
select set_config('request.jwt.claim.sub',(select viewer_id::text from modular_fixture),true);
do $$ begin if (select count(*) from public.bizoveya_business_drafts)<>1 then raise exception 'Viewer read failed'; end if; end; $$;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,2)',workspace_id,site_id,doc),'bz_forbidden') from modular_fixture;
select set_config('request.jwt.claim.sub',(select outsider_id::text from modular_fixture),true);
do $$ begin if exists(select 1 from public.bizoveya_business_drafts) then raise exception 'Cross-tenant draft leaked'; end if; end; $$;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,2)',workspace_id,site_id,doc),'bz_forbidden') from modular_fixture;
reset role;
delete from public.bizoveya_memberships where user_id=(select editor_id from modular_fixture);
set local role authenticated;
select set_config('request.jwt.claim.sub',(select editor_id::text from modular_fixture),true);
do $$ begin if exists(select 1 from public.bizoveya_business_drafts) then raise exception 'Revoked editor retained access'; end if; end; $$;
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,2)',workspace_id,site_id,doc),'bz_forbidden') from modular_fixture;
reset role;
set local role anon;
select pg_temp.modular_expect_error('select * from public.bizoveya_business_drafts','permission');
select pg_temp.modular_expect_error(format('select public.bz_save_business_draft(%L,%L,%L,2)',workspace_id,site_id,doc),'permission') from modular_fixture;
reset role;
rollback;
