-- Local fixture only. Never run this file on hosted customer data.
begin;
create temporary table cfixture(o uuid,e uuid,v uuid,x uuid,w uuid,s uuid,s2 uuid,c uuid);
insert into cfixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,null,gen_random_uuid());
insert into auth.users(id) select o from cfixture union all select e from cfixture union all select v from cfixture union all select x from cfixture;
create function pg_temp.cexpect(q text,needle text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,needle)>0 then return;else raise exception 'Unexpected: %',sqlerrm;end if;end;raise exception 'Expected: %',needle;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;
grant all on cfixture to authenticated;
set local role authenticated;select set_config('request.jwt.claim.sub',(select o::text from cfixture),true);
update cfixture set w=(select id from public.bz_create_workspace('Campaign workspace'));
update cfixture set s=(select id from public.bz_register_site(w,'Campaign site','external','business','https://campaign-fixture.com/',null,'active',true));
update cfixture set s2=(select id from public.bz_register_site(w,'Other campaign site','external','business','https://other-campaign-fixture.com/',null,'active',true));
reset role;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select w,e,'editor' from cfixture union all select w,v,'viewer' from cfixture;
set local role authenticated;select set_config('request.jwt.claim.sub',(select o::text from cfixture),true);
do $$declare f record;d jsonb:='{"title":"AI SEO","brief":"Practical tips for founders","blog":"Draft one","pinterest":"Pin copy","linkedin":"LinkedIn copy"}';begin
 select * into f from cfixture;
 perform public.bz_save_campaign(f.w,f.s,f.c,d,0);
 perform public.bz_save_campaign(f.w,f.s,f.c,d,1);
 if (select version from public.bizoveya_campaigns where id=f.c)<>1 or (select count(*) from public.bizoveya_campaign_revisions where campaign_id=f.c)<>1 then raise exception 'Unchanged save generated duplicate';end if;
 perform public.bz_save_campaign(f.w,f.s,f.c,jsonb_set(d,'{blog}','"Revised draft"'),1);
 if (select count(*) from public.bizoveya_campaign_revisions where campaign_id=f.c)<>2 then raise exception 'History missing';end if;
 perform pg_temp.cexpect(format('select public.bz_save_campaign(%L,%L,%L,%L::jsonb,1)',f.w,f.s,f.c,d),'bz_conflict');
 perform pg_temp.cexpect(format('select public.bz_save_campaign(%L,%L,%L,%L::jsonb,2)',f.w,f.s2,f.c,d),'bz_not_found');
 perform pg_temp.cexpect(format('select public.bz_save_campaign(%L,%L,%L,%L::jsonb,0)',f.w,f.s,gen_random_uuid(),d||'{"publish":true}'),'bz_invalid_campaign');
 perform pg_temp.cexpect('update public.bizoveya_campaigns set version=99','permission denied');
end;$$;
select set_config('request.jwt.claim.sub',(select e::text from cfixture),true);
do $$declare f record;begin select * into f from cfixture;perform public.bz_save_campaign(f.w,f.s,f.c,'{"title":"AI SEO","brief":"Editor revision","blog":"","pinterest":"","linkedin":""}',2);end;$$;
select set_config('request.jwt.claim.sub',(select v::text from cfixture),true);
do $$declare f record;begin select * into f from cfixture;if(select count(*) from public.bizoveya_campaigns)<>1 then raise exception 'Viewer read missing';end if;perform pg_temp.cexpect(format('select public.bz_save_campaign(%L,%L,%L,''{}'',3)',f.w,f.s,f.c),'bz_forbidden');end;$$;
select set_config('request.jwt.claim.sub',(select x::text from cfixture),true);
do $$declare f record;begin select * into f from cfixture;if(select count(*) from public.bizoveya_campaigns)<>0 or(select count(*) from public.bizoveya_campaign_revisions)<>0 then raise exception 'Outsider leak';end if;perform pg_temp.cexpect(format('select public.bz_save_campaign(%L,%L,%L,''{}'',3)',f.w,f.s,f.c),'bz_forbidden');end;$$;
reset role;
do $$begin if has_table_privilege('anon','public.bizoveya_campaigns','select') or has_function_privilege('anon','public.bz_save_campaign(uuid,uuid,uuid,jsonb,integer)','execute') then raise exception 'Anonymous exposed';end if;end;$$;
-- Existing site removal cascade includes the new campaign tables.
delete from public.bizoveya_sites where id=(select s from cfixture);
do $$begin if exists(select 1 from public.bizoveya_campaigns) or exists(select 1 from public.bizoveya_campaign_revisions) then raise exception 'Deletion left campaign content';end if;end;$$;
rollback;
