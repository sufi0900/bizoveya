-- Local only, never run against customer/hosted data.
begin;
create temporary table mh(actor uuid,wid uuid,sid uuid,other_site uuid,mid uuid,d jsonb);
insert into mh values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'{"schema":"private-media-descriptor-v1","mime":"image/png","bytes":1024,"width":1000,"height":1500,"sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","alt":"Background","origin":"user-upload","rights":{"basis":"own-work","evidence":"My work","attested":true}}');
insert into auth.users(id) select actor from mh;
insert into public.bizoveya_workspaces(id,owner_id,name) select wid,actor,'Hardening fixture' from mh;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select wid,actor,'owner' from mh;
insert into public.bizoveya_sites(id,workspace_id,name,mode,kind,status,created_by) select sid,wid,'Site A','native_business','business','active',actor from mh union all select other_site,wid,'Site B','native_business','business','active',actor from mh;
create function pg_temp.expect_media(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;end if;raise;end;raise exception 'Expected %',n;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated,service_role',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;grant all on mh to authenticated,service_role;
set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
select public.bz_record_sanitized_private_media(actor,wid,sid,mid,0,d,concat(actor,'/',wid,'/',sid,'/',mid,'/1/',repeat('a',64),'.png')) from mh;
select pg_temp.expect_media(format('select public.bz_record_sanitized_private_media(%L,%L,%L,%L,1,%L::jsonb,%L)',actor,wid,sid,mid,jsonb_set(d,'{bytes}','"1024"'),''),'bz_invalid_media') from mh;
reset role;set local role authenticated;select set_config('request.jwt.claim.sub',(select actor::text from mh),true);
select pg_temp.expect_media(format('select public.bz_private_media(%L,%L,%L)',wid,other_site,mid),'bz_media_unavailable') from mh;
select pg_temp.expect_media(format('select public.bz_review_private_media(%L,%L,%L,1,1,NULL,NULL)',wid,sid,mid),'bz_invalid_media') from mh;
select public.bz_review_private_media(wid,sid,mid,1,1,'accepted','Reviewed for private draft use') from mh;
select pg_temp.expect_media(format('select public.bz_review_private_media_043(%L,%L,%L,2,1,%L,%L)',wid,sid,mid,'accepted','Bypass'),'permission denied') from mh;
reset role;
select pg_temp.expect_media(format('update bizoveya_private.private_media_versions set descriptor=%L::jsonb where media_id=%L',jsonb_set(d,'{alt}','"Changed"'),mid),'bz_media_immutable') from mh;
select pg_temp.expect_media(format('delete from bizoveya_private.private_media_versions where media_id=%L',mid),'bz_media_immutable') from mh;
set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
do $$declare f record;m1 uuid:=gen_random_uuid();m2 uuid:=gen_random_uuid();m uuid;v integer;r integer;descriptor_ jsonb;path_ text;begin
 select * into f from mh;descriptor_:=jsonb_set(f.d,'{bytes}','5242880');
 for i in 1..31 loop
  m:=case when i<=20 then m1 else m2 end;v:=case when i<=20 then i else i-20 end;r:=v-1;
  path_:=concat(f.actor,'/',f.wid,'/',f.sid,'/',m,'/',v,'/',repeat('a',64),'.png');
  perform public.bz_record_sanitized_private_media(f.actor,f.wid,f.sid,m,r,descriptor_,path_);
 end loop;
 perform pg_temp.expect_media(format('select public.bz_record_sanitized_private_media(%L,%L,%L,%L,11,%L::jsonb,%L)',f.actor,f.wid,f.sid,m2,descriptor_,concat(f.actor,'/',f.wid,'/',f.sid,'/',m2,'/12/',repeat('a',64),'.png')),'bz_media_byte_limit');
end;$$;
reset role;
delete from auth.users where id=(select actor from mh);
do $$begin if exists(select 1 from bizoveya_private.private_media where id=(select mid from mh)) then raise exception 'Account cascade failed';end if;end;$$;
rollback;
