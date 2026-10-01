-- Additive P01.4 foundation. Apply after 018, only after reconciling remote history.
-- No first-user bootstrap, no role from auth metadata, no service key in the app.
begin;
create table bizoveya_private.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now()
);
create table bizoveya_private.admin_audit (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default clock_timestamp(),
  action text not null check (action in ('admin_granted','admin_revoked')),
  subject_id uuid not null,
  operator_label text not null,
  database_actor text not null,
  reason text not null
);
alter table bizoveya_private.platform_admins enable row level security;
alter table bizoveya_private.admin_audit enable row level security;
revoke all on bizoveya_private.platform_admins, bizoveya_private.admin_audit from public, anon, authenticated, service_role;

create function bizoveya_private.audit_admin_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into bizoveya_private.admin_audit(action,subject_id,operator_label,database_actor,reason)
  values (case when TG_OP = 'DELETE' then 'admin_revoked' else 'admin_granted' end,
    case when TG_OP = 'DELETE' then OLD.user_id else NEW.user_id end,
    coalesce(nullif(current_setting('bizoveya.operator_label',true),''),'direct database operator'),
    session_user,
    coalesce(nullif(current_setting('bizoveya.operator_reason',true),''),'Direct database change; consult operator logs'));
  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end; $$;
revoke all on function bizoveya_private.audit_admin_role() from public, anon, authenticated, service_role;
create trigger bz_admin_role_audit after insert or delete on bizoveya_private.platform_admins
  for each row execute function bizoveya_private.audit_admin_role();

-- Operator-only; keep the private schema out of the Data API's exposed schemas.
create function bizoveya_private.set_platform_admin(p_user_id uuid,p_enabled boolean,p_operator text,p_reason text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_user_id is null or p_enabled is null or length(trim(coalesce(p_operator,''))) not between 3 and 100
    or length(trim(coalesce(p_reason,''))) not between 10 and 300 then
    raise exception 'bz_invalid_operator_request' using errcode='22023';
  end if;
  if not exists(select 1 from auth.users where id=p_user_id and deleted_at is null) then
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

-- Only own eligibility/assurance; usable at AAL1 to enter MFA setup. No global data.
create function public.bz_admin_identity() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'isAdmin',auth.uid() is not null and exists(select 1 from bizoveya_private.platform_admins where user_id=auth.uid()),
    'aal2',coalesce(auth.jwt()->>'aal','')='aal2'
  );
$$;
create function bizoveya_private.require_admin() returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists(select 1 from bizoveya_private.platform_admins where user_id=auth.uid()) then
    raise exception 'bz_admin_forbidden' using errcode='42501';
  end if;
  if coalesce(auth.jwt()->>'aal','') <> 'aal2' then
    raise exception 'bz_mfa_required' using errcode='42501';
  end if;
end; $$;
revoke all on function bizoveya_private.require_admin() from public, anon, authenticated, service_role;

create function public.bz_admin_summary() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  perform bizoveya_private.require_admin();
  return jsonb_build_object(
    'workspaces',(select count(*) from public.bizoveya_workspaces),
    'sites',(select count(*) from public.bizoveya_sites),
    'workspaceMembers',(select count(distinct user_id) from public.bizoveya_memberships),
    'admins',(select count(*) from bizoveya_private.platform_admins)
  );
end; $$;
create function public.bz_admin_audit() returns setof bizoveya_private.admin_audit
language plpgsql stable security definer set search_path = '' as $$
begin
  perform bizoveya_private.require_admin();
  return query select * from bizoveya_private.admin_audit order by occurred_at desc,id desc limit 100;
end; $$;
revoke all on function public.bz_admin_identity(), public.bz_admin_summary(), public.bz_admin_audit() from public, anon, authenticated, service_role;
grant execute on function public.bz_admin_identity(), public.bz_admin_summary(), public.bz_admin_audit() to authenticated;
commit;
