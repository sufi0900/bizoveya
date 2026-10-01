-- Run ONLY in a disposable/staging Supabase database after migrations 001–018.
-- Standard PostgreSQL assertions, no pgTAP extension required. Entire fixture rolls back.
-- This script creates temporary auth users and simulates authenticated/anon DB roles;
-- it does NOT prove browser session handling or production migration state.
begin;
create temporary table bz_fixture(owner_id uuid, editor_id uuid, viewer_id uuid, outsider_id uuid, workspace_id uuid, other_workspace_id uuid, site_id uuid, project_id uuid);
insert into bz_fixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,null,gen_random_uuid());
do $$ begin
  execute format('grant usage on schema %I to authenticated, anon', (select nspname from pg_namespace where oid = pg_my_temp_schema()));
end; $$;
grant select, update on bz_fixture to authenticated;
grant select on bz_fixture to anon;
insert into auth.users(id) select owner_id from bz_fixture union all select editor_id from bz_fixture union all select viewer_id from bz_fixture union all select outsider_id from bz_fixture;
insert into public.projects(id, owner_id, name, creation_mode, document) select project_id, owner_id, 'Acceptance portfolio', 'guided', '{}'::jsonb from bz_fixture;
create function pg_temp.expect_denied(p_sql text) returns void language plpgsql as $$
declare denied boolean := false;
begin
  begin execute p_sql; exception when others then
    if sqlstate = '42501' or sqlerrm = 'bz_forbidden' then denied := true; else raise; end if;
  end;
  if not denied then raise exception 'Expected permission denial for %', p_sql; end if;
end; $$;
create function pg_temp.expect_conflict(p_sql text) returns void language plpgsql as $$
declare rejected boolean := false;
begin
  begin execute p_sql; exception when others then
    if sqlerrm = 'bz_conflict' or sqlstate = '23505' then rejected := true; else raise; end if;
  end;
  if not rejected then raise exception 'Expected conflict for %', p_sql; end if;
end; $$;

grant execute on function pg_temp.expect_denied(text), pg_temp.expect_conflict(text) to authenticated, anon;

set local role authenticated;
select set_config('request.jwt.claim.sub', (select owner_id::text from bz_fixture), true);
update bz_fixture set workspace_id = (select id from public.bz_create_workspace('Owner workspace'));
update bz_fixture set site_id = (select id from public.bz_register_site((select workspace_id from bz_fixture), 'Tools', 'external', 'business', 'https://doitwithai.tools/', null, 'active', true));
select public.bz_register_site((select workspace_id from bz_fixture), 'Portfolio', 'native_portfolio', 'portfolio', null, (select project_id from bz_fixture), 'active', true);
select pg_temp.expect_conflict(format('select public.bz_register_site(%L::uuid,%L,%L,%L,null,%L::uuid,%L,true)',workspace_id,'Duplicate','native_portfolio','portfolio',project_id,'active')) from bz_fixture;
select public.bz_update_site((select workspace_id from bz_fixture), (select site_id from bz_fixture), 'Tools paused', 'paused', 1, null, false);
select pg_temp.expect_conflict(format('select public.bz_update_site(%L::uuid,%L::uuid,%L,%L,1,null,false)',workspace_id,site_id,'Stale','active')) from bz_fixture;
do $$ begin
  if (select count(*) from public.bizoveya_sites where workspace_id = (select workspace_id from bz_fixture)) <> 2 then raise exception 'Expected two sites'; end if;
  if (select count(*) from public.bizoveya_memberships where user_id = auth.uid() and role = 'owner') < 1 then raise exception 'Atomic owner membership missing'; end if;
end; $$;
select pg_temp.expect_denied(format('insert into public.bizoveya_memberships(workspace_id,user_id,role) values (%L::uuid,%L::uuid,%L)',workspace_id,outsider_id,'owner')) from bz_fixture;
reset role;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select workspace_id,editor_id,'editor' from bz_fixture union all select workspace_id,viewer_id,'viewer' from bz_fixture;

set local role authenticated;
select set_config('request.jwt.claim.sub',(select editor_id::text from bz_fixture),true);
select public.bz_update_site((select workspace_id from bz_fixture),(select site_id from bz_fixture),'Editor change','paused',2,null,false);
select pg_temp.expect_denied(format('select public.bz_rename_workspace(%L::uuid,%L,1)',workspace_id,'Editor rename')) from bz_fixture;
select pg_temp.expect_denied(format('select public.bz_register_site(%L::uuid,%L,%L,%L,null,%L::uuid,%L,true)',workspace_id,'Not owned','native_portfolio','portfolio',project_id,'active')) from bz_fixture;
do $$ begin
  if exists(select 1 from public.projects where id = (select project_id from bz_fixture)) then raise exception 'Collaborator gained private portfolio access'; end if;
end; $$;
select set_config('request.jwt.claim.sub',(select viewer_id::text from bz_fixture),true);
select pg_temp.expect_denied(format('select public.bz_update_site(%L::uuid,%L::uuid,%L,%L,3,null,false)',workspace_id,site_id,'Viewer change','active')) from bz_fixture;
do $$ begin
  if not exists(select 1 from public.bizoveya_sites where id = (select site_id from bz_fixture)) then raise exception 'Viewer cannot read permitted site'; end if;
end; $$;
select set_config('request.jwt.claim.sub',(select outsider_id::text from bz_fixture),true);
update bz_fixture set other_workspace_id = (select id from public.bz_create_workspace('Separate tenant'));
select pg_temp.expect_denied(format('select public.bz_update_site(%L::uuid,%L::uuid,%L,%L,3,null,false)',workspace_id,site_id,'Outsider change','active')) from bz_fixture;
do $$ begin
  if exists(select 1 from public.bizoveya_workspaces where id = (select workspace_id from bz_fixture)) then raise exception 'Cross-tenant workspace leaked'; end if;
  if exists(select 1 from public.bizoveya_sites where workspace_id = (select workspace_id from bz_fixture)) then raise exception 'Cross-tenant sites leaked'; end if;
end; $$;
reset role;
delete from public.bizoveya_memberships where user_id = (select viewer_id from bz_fixture);
set local role authenticated;
select set_config('request.jwt.claim.sub',(select viewer_id::text from bz_fixture),true);
do $$ begin
  if exists(select 1 from public.bizoveya_sites where workspace_id = (select workspace_id from bz_fixture)) then raise exception 'Revoked viewer retained access'; end if;
end; $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
select set_config('request.jwt.claims','{}',true);
select pg_temp.expect_denied('select * from public.bizoveya_sites');
select pg_temp.expect_denied('select public.bz_create_workspace(''Anonymous'')');
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select owner_id::text from bz_fixture),true);
delete from public.projects where id = (select project_id from bz_fixture);
do $$ begin
  if exists(select 1 from public.bizoveya_sites where workspace_id = (select workspace_id from bz_fixture) and mode = 'native_portfolio' and project_id is not null) then raise exception 'Deleted source mapping was not cleared'; end if;
end; $$;
reset role;
rollback;
