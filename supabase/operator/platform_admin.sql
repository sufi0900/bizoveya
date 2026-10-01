-- Run manually as the trusted database operator in the intended environment.
-- Do NOT add this file to migrations. Replace every placeholder deliberately.
-- Use the existing auth.users UUID, not an email or client-supplied role.
-- p_enabled=false revokes immediately on the next protected request.
begin;
select bizoveya_private.set_platform_admin(
  'REPLACE_WITH_CONFIRMED_AUTH_USER_UUID'::uuid,
  true,
  'REPLACE_WITH_OPERATOR_IDENTITY',
  'REPLACE_WITH_NON_SECRET_REASON_AND_TICKET'
);
-- Inspect the subject and audit before committing. SQL editor runs this as a batch.
select * from bizoveya_private.admin_audit order by occurred_at desc, id desc limit 5;
commit;
