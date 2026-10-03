-- Isolated verification only; transaction rolls fixtures back.
begin;
create temporary table pub_fixture(owner_id uuid,viewer_id uuid,outsider_id uuid,workspace_id uuid,site_id uuid,doc jsonb);
insert into pub_fixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,'{"schemaVersion":2,"templateId":"local-services-v1","accent":"blue","name":"Publish Business","headline":"Approved introduction","description":"Public content","about":"","location":"","email":"hello@example.com","phone":"","services":[{"title":"Service","description":""}],"font":"modern","hours":"","sections":[{"id":"hero","type":"hero","layout":"centered","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]},{"id":"contact","type":"contact","layout":"panel","visible":true,"tone":"base","heading":"","body":"","image":"","items":[]}]}'::jsonb);
do $$ begin execute format('grant usage on schema %I to authenticated,anon',(select nspname from pg_namespace where oid=pg_my_temp_schema())); end; $$;
grant select,update on pub_fixture to authenticated;grant select on pub_fixture to anon;
insert into auth.users(id) select owner_id from pub_fixture union all select viewer_id from pub_fixture union all select outsider_id from pub_fixture;
create function pg_temp.pub_error(sql text,expected text) returns void language plpgsql as $$
declare caught boolean:=false;begin begin execute sql;exception when others then if sqlerrm=expected then caught:=true;else raise;end if;end;if not caught then raise exception 'Expected %: %',expected,sql;end if;end;$$;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from pub_fixture),true);
update pub_fixture set workspace_id=(select id from public.bz_create_workspace('Publisher'));
update pub_fixture set site_id=(select id from public.bz_register_business_site(workspace_id,'Publish Business','active',true,doc));
-- Hidden section and unused About must never be downloadable by visitors.
update pub_fixture set doc=jsonb_set(jsonb_set(doc,'{about}','"Private About"'),'{sections}',doc->'sections'||'[{"id":"secret","type":"testimonials","layout":"cards","visible":false,"tone":"base","heading":"Private Testimonial","body":"Private confidential notes","image":"","items":[]}]'::jsonb);
select public.bz_save_business_draft(workspace_id,site_id,doc,1) from pub_fixture;
-- No auto-publication.
do $$begin if exists(select 1 from public.bz_read_public_business((select site_id from pub_fixture))) then raise exception 'Draft leaked';end if;end;$$;
select pg_temp.pub_error(format('select public.bz_set_business_publication(%L,%L,0,0,true)',workspace_id,site_id),'bz_conflict') from pub_fixture;
select public.bz_set_business_publication(workspace_id,site_id,2,0,true) from pub_fixture;
select pg_temp.pub_error(format('select public.bz_set_business_publication(%L,%L,2,0,true)',workspace_id,site_id),'bz_conflict') from pub_fixture;
select public.bz_save_business_draft(workspace_id,site_id,jsonb_set(doc,'{headline}','"Private new headline"'),2) from pub_fixture;
do $$begin if (select document::text from public.bz_read_public_business((select site_id from pub_fixture))) like '%Private About%' or (select document::text from public.bz_read_public_business((select site_id from pub_fixture))) like '%Private confidential%' then raise exception 'Hidden content leaked';end if;end;$$;
-- Saving a new draft must not replace the live snapshot.
do $$begin if (select document->>'headline' from public.bz_read_public_business((select site_id from pub_fixture)))<>'Approved introduction' then raise exception 'Private edit leaked';end if;end;$$;
reset role;
insert into public.bizoveya_memberships select workspace_id,viewer_id,'viewer',now() from pub_fixture;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select viewer_id::text from pub_fixture),true);
select pg_temp.pub_error(format('select public.bz_set_business_publication(%L,%L,2,1,false)',workspace_id,site_id),'bz_forbidden') from pub_fixture;
select set_config('request.jwt.claim.sub',(select outsider_id::text from pub_fixture),true);
do $$begin if exists(select 1 from public.bizoveya_business_publications) or exists(select 1 from public.bizoveya_business_publication_history) then raise exception 'Private publication state exposed';end if;end;$$;
select pg_temp.pub_error(format('select public.bz_set_business_publication(%L,%L,2,1,true)',workspace_id,site_id),'bz_forbidden') from pub_fixture;
reset role;set local role anon;
do $$begin if (select count(*) from public.bz_read_public_business((select site_id from pub_fixture)))<>1 then raise exception 'Anon cannot read public snapshot';end if;end;$$;
select pg_temp.pub_error('select * from public.bizoveya_business_drafts','permission denied for table bizoveya_business_drafts');
select pg_temp.pub_error('select * from public.bizoveya_business_publication_history','permission denied for table bizoveya_business_publication_history');
select pg_temp.pub_error('select * from public.bizoveya_business_publications','permission denied for table bizoveya_business_publications');
reset role;set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from pub_fixture),true);
select public.bz_set_business_publication(workspace_id,site_id,3,1,true) from pub_fixture;
select public.bz_set_business_publication(workspace_id,site_id,3,2,true) from pub_fixture;
do $$begin if (select count(*) from public.bizoveya_business_publication_history)<>2 then raise exception 'Repeated unchanged publish made extra history';end if;end;$$;
select public.bz_set_business_publication(workspace_id,site_id,3,2,false) from pub_fixture;
do $$begin if exists(select 1 from public.bz_read_public_business((select site_id from pub_fixture))) then raise exception 'Unpublish still public';end if;if (select count(*) from public.bizoveya_business_publication_history)<>3 then raise exception 'History missing';end if;if (select count(*) from public.bizoveya_business_drafts)<>1 then raise exception 'Unpublish deleted draft';end if;end;$$;
select public.bz_save_business_draft(workspace_id,site_id,jsonb_set(doc,'{email}','""'),3) from pub_fixture;
select pg_temp.pub_error(format('select public.bz_set_business_publication(%L,%L,4,3,true)',workspace_id,site_id),'bz_publication_not_ready') from pub_fixture;
-- Phone-only publication and omitted/text-only section fields.
update pub_fixture set doc=jsonb_set(jsonb_set(jsonb_set(jsonb_set(doc,'{name}','"Projection Check"'),'{email}','""'),'{phone}','"+92 300 1234567"'),'{about}','"Approved about"');
update pub_fixture set doc=jsonb_set(doc,'{sections}',doc->'sections'||'[{"id":"about-text","type":"about","layout":"text","visible":true,"tone":"base","heading":"About","body":"PrivateUnusedAlt","image":"https://example.com/PrivateUnusedImage.png","items":[]},{"id":"empty-faq","type":"faq","layout":"list","visible":true,"tone":"base","heading":"PrivateEmptyHeading","body":"PrivateEmptyBody","image":"","items":[]}]'::jsonb);
update pub_fixture set site_id=(select id from public.bz_register_business_site(workspace_id,'Projection Check','active',true,doc));
select public.bz_set_business_publication(workspace_id,site_id,1,0,true) from pub_fixture;
reset role;set local role anon;
do $$declare text_value text;begin select document::text into text_value from public.bz_read_public_business((select site_id from pub_fixture));if text_value like '%PrivateUnused%' or text_value like '%PrivateEmpty%' or text_value like '%Private confidential%' then raise exception 'Omitted field leaked';end if;if text_value not like '%Approved about%' or text_value not like '%+92 300%' then raise exception 'Phone-only approved content missing';end if;end;$$;
reset role;rollback;
