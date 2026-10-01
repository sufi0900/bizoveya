-- Disposable/staging SQL regression. Requires migrations through 020.
-- A grant must remain revocable after an Auth user has been soft-deleted.
begin;
create temporary table bz_recovery_fixture(user_id uuid, absent_id uuid);
insert into bz_recovery_fixture values(gen_random_uuid(),gen_random_uuid());
insert into auth.users(id) select user_id from bz_recovery_fixture;
select bizoveya_private.set_platform_admin(user_id,true,'recovery-test-operator','Grant for account lifecycle test') from bz_recovery_fixture;
update auth.users set deleted_at=now() where id=(select user_id from bz_recovery_fixture);
-- Before fix: bz_user_not_found. Revoke must not depend on account eligibility.
select bizoveya_private.set_platform_admin(user_id,false,'recovery-test-operator','Revoke soft-deleted account access') from bz_recovery_fixture;
do $$ begin
  if exists(select 1 from bizoveya_private.platform_admins where user_id=(select user_id from bz_recovery_fixture)) then raise exception 'Soft-deleted grant was not revoked'; end if;
  if (select count(*) from bizoveya_private.admin_audit where subject_id=(select user_id from bz_recovery_fixture) and action='admin_revoked') <> 1 then raise exception 'Revocation audit missing'; end if;
end; $$;
-- Repeated/absent revocation remains safe and does not invent events.
select bizoveya_private.set_platform_admin(user_id,false,'recovery-test-operator','Repeated revocation should be a no-op') from bz_recovery_fixture;
select bizoveya_private.set_platform_admin(absent_id,false,'recovery-test-operator','Absent account revocation is a no-op') from bz_recovery_fixture;
do $$ declare rejected boolean:=false; begin
  begin
    perform bizoveya_private.set_platform_admin((select user_id from bz_recovery_fixture),true,'recovery-test-operator','Do not restore a deleted account');
  exception when invalid_parameter_value then rejected:=true; end;
  if not rejected then raise exception 'Soft-deleted account was regranted'; end if;
  if (select count(*) from bizoveya_private.admin_audit where subject_id=(select user_id from bz_recovery_fixture)) <> 2 then raise exception 'Duplicate audit event'; end if;
end; $$;
rollback;
