-- P01.4.Fix-1: allow revocation after Auth account soft deletion.
-- Additive replacement; do not edit already-delivered migration 019.
begin;
create or replace function bizoveya_private.set_platform_admin(p_user_id uuid,p_enabled boolean,p_operator text,p_reason text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_user_id is null or p_enabled is null or length(trim(coalesce(p_operator,''))) not between 3 and 100
    or length(trim(coalesce(p_reason,''))) not between 10 and 300 then
    raise exception 'bz_invalid_operator_request' using errcode='22023';
  end if;
  -- Eligibility gates new grants only. Revocation must still work for deleted accounts.
  if p_enabled and not exists(select 1 from auth.users where id=p_user_id and deleted_at is null) then
    raise exception 'bz_user_not_found' using errcode='22023';
  end if;
  perform set_config('bizoveya.operator_label',trim(p_operator),true);
  perform set_config('bizoveya.operator_reason',trim(p_reason),true);
  if p_enabled then
    insert into bizoveya_private.platform_admins(user_id) values(p_user_id) on conflict(user_id) do nothing;
  else
    delete from bizoveya_private.platform_admins where user_id=p_user_id;
  end if;
  perform set_config('bizoveya.operator_label','',true);
  perform set_config('bizoveya.operator_reason','',true);
end; $$;
revoke all on function bizoveya_private.set_platform_admin(uuid,boolean,text,text) from public, anon, authenticated, service_role;

commit;
