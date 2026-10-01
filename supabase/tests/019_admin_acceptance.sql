-- Disposable/staging Supabase only, as trusted database operator, after 001–019.
-- Fixtures roll back. JWT claims here simulate DB callers, NOT real MFA verification.
begin;
create temporary table bz_admin_fixture(admin_id uuid, outsider_id uuid, baseline_events bigint);
insert into bz_admin_fixture values(gen_random_uuid(),gen_random_uuid(),(select count(*) from bizoveya_private.admin_audit));
do $$ begin execute format('grant usage on schema %I to authenticated, anon', (select nspname from pg_namespace where oid=pg_my_temp_schema())); end; $$;
grant select on bz_admin_fixture to authenticated, anon;
insert into auth.users(id) select admin_id from bz_admin_fixture union all select outsider_id from bz_admin_fixture;
create function pg_temp.expect_admin_denied(p_sql text) returns void language plpgsql as $$
declare denied boolean := false;
begin
  begin execute p_sql; exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'Expected permission denial: %',p_sql; end if;
end; $$;
grant execute on function pg_temp.expect_admin_denied(text) to authenticated, anon;
select bizoveya_private.set_platform_admin(admin_id,true,'staging-test-operator','Fixture bootstrap acceptance test') from bz_admin_fixture;
-- Repeated grant is idempotent; no invented second grant event.
select bizoveya_private.set_platform_admin(admin_id,true,'staging-test-operator','Repeated fixture grant is a no-op') from bz_admin_fixture;
do $$ begin
  if (select count(*) from bizoveya_private.admin_audit) <> (select baseline_events+1 from bz_admin_fixture) then raise exception 'Missing or duplicate bootstrap audit'; end if;
end; $$;
set local role authenticated;
select set_config('request.jwt.claim.sub',admin_id::text,true),set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated','aal','aal1')::text,true) from bz_admin_fixture;
do $$ begin
  if public.bz_admin_identity() <> '{"isAdmin":true,"aal2":false}'::jsonb then raise exception 'AAL1 identity mismatch'; end if;
end; $$;
select pg_temp.expect_admin_denied('select public.bz_admin_summary()');
select pg_temp.expect_admin_denied('select public.bz_admin_audit()');
select pg_temp.expect_admin_denied('select * from bizoveya_private.platform_admins');
select pg_temp.expect_admin_denied('select * from bizoveya_private.admin_audit');
select pg_temp.expect_admin_denied(format('select bizoveya_private.set_platform_admin(%L::uuid,true,%L,%L)',outsider_id,'attacker','Attempt to self grant')) from bz_admin_fixture;
select pg_temp.expect_admin_denied(format('insert into bizoveya_private.platform_admins(user_id) values(%L::uuid)',outsider_id)) from bz_admin_fixture;
select pg_temp.expect_admin_denied('delete from bizoveya_private.admin_audit');
select set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated','aal','aal2')::text,true) from bz_admin_fixture;
do $$ declare summary jsonb; begin
  summary := public.bz_admin_summary();
  if not (summary ?& array['workspaces','sites','workspaceMembers','admins']) or (summary->>'admins')::int < 1 then raise exception 'Summary missing'; end if;
  if not exists(select 1 from public.bz_admin_audit() where subject_id=(select admin_id from bz_admin_fixture) and action='admin_granted') then raise exception 'Admin cannot read audit'; end if;
  if exists(select 1 from public.bizoveya_workspaces) then raise exception 'Admin grant leaked tenant rows to a fresh unrelated user'; end if;
end; $$;
-- AAL2 never makes an ordinary user an admin.
select set_config('request.jwt.claim.sub',outsider_id::text,true),set_config('request.jwt.claims',jsonb_build_object('sub',outsider_id,'role','authenticated','aal','aal2','user_metadata',jsonb_build_object('role','admin'))::text,true) from bz_admin_fixture;
select pg_temp.expect_admin_denied('select public.bz_admin_summary()');
select pg_temp.expect_admin_denied('select public.bz_admin_audit()');
reset role;
select bizoveya_private.set_platform_admin(admin_id,false,'staging-test-operator','Fixture revocation acceptance test') from bz_admin_fixture;
set local role authenticated;
select set_config('request.jwt.claim.sub',admin_id::text,true),set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated','aal','aal2')::text,true) from bz_admin_fixture;
select pg_temp.expect_admin_denied('select public.bz_admin_summary()');
select pg_temp.expect_admin_denied('select public.bz_admin_audit()');
reset role;
do $$ begin
  if not exists(select 1 from bizoveya_private.admin_audit where subject_id=(select admin_id from bz_admin_fixture) and action='admin_revoked') then raise exception 'Revocation audit missing'; end if;
end; $$;
set local role anon;
select set_config('request.jwt.claim.sub','',true),set_config('request.jwt.claims','{}',true);
select pg_temp.expect_admin_denied('select public.bz_admin_identity()');
select pg_temp.expect_admin_denied('select public.bz_admin_summary()');
select pg_temp.expect_admin_denied('select public.bz_admin_audit()');
reset role;
rollback;
