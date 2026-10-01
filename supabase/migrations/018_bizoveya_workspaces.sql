-- Bizoveya P01.3 workspace foundation. Apply only after reconciling migrations 001–017.
-- Additive: no ownership/policy/document changes to existing projects or publications.
begin;
create schema if not exists bizoveya_private;
revoke all on schema bizoveya_private from public, anon, authenticated;
grant usage on schema bizoveya_private to authenticated;

create table public.bizoveya_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.bizoveya_memberships (
  workspace_id uuid not null references public.bizoveya_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(), primary key (workspace_id, user_id)
);
create index bizoveya_memberships_user_idx on public.bizoveya_memberships(user_id);
create table public.bizoveya_sites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.bizoveya_workspaces(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  mode text not null check (mode in ('external', 'native_portfolio', 'native_business')),
  kind text not null check (kind in ('business', 'portfolio')),
  url text, project_id uuid unique references public.projects(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'paused')),
  version integer not null default 1 check (version > 0),
  ownership_declared_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check ((mode = 'external' and url is not null and project_id is null) or (mode <> 'external' and url is null)),
  check (mode = 'native_portfolio' or project_id is null),
  check ((mode = 'native_portfolio' and kind = 'portfolio') or (mode = 'native_business' and kind = 'business') or mode = 'external')
);
create index bizoveya_sites_workspace_idx on public.bizoveya_sites(workspace_id, created_at desc);

create function bizoveya_private.workspace_role(p_workspace_id uuid)
returns text language sql stable security definer set search_path = '' as $$
  select m.role from public.bizoveya_memberships m where m.workspace_id = p_workspace_id and m.user_id = (select auth.uid());
$$;
create function bizoveya_private.valid_site_url(p_url text)
returns boolean language sql immutable set search_path = '' as $$
  select p_url is not null and char_length(p_url) <= 2048
    and p_url ~ '^https?://([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]([a-z0-9-]*[a-z0-9])?(:80|:443)?(/[^?#]*)?$'
    and p_url !~ '^https?://[^/]+\.(localhost|local|internal|test|invalid|example)(:|/|$)';
$$;
alter table public.bizoveya_sites add constraint bizoveya_site_public_url check (url is null or bizoveya_private.valid_site_url(url));

revoke all on function bizoveya_private.workspace_role(uuid) from public, anon, authenticated;
revoke all on function bizoveya_private.valid_site_url(text) from public, anon, authenticated;
grant execute on function bizoveya_private.workspace_role(uuid) to authenticated;

alter table public.bizoveya_workspaces enable row level security;
alter table public.bizoveya_memberships enable row level security;
alter table public.bizoveya_sites enable row level security;
create policy "workspace members read" on public.bizoveya_workspaces for select to authenticated using (bizoveya_private.workspace_role(id) is not null);
create policy "members read own grant" on public.bizoveya_memberships for select to authenticated using (user_id = (select auth.uid()));
create policy "workspace members read sites" on public.bizoveya_sites for select to authenticated using (bizoveya_private.workspace_role(workspace_id) is not null);
-- Direct table writes are intentionally unavailable, including self-granted memberships.
revoke all on public.bizoveya_workspaces, public.bizoveya_memberships, public.bizoveya_sites from public, anon, authenticated;
grant select on public.bizoveya_workspaces, public.bizoveya_memberships, public.bizoveya_sites to authenticated;

create function public.bz_create_workspace(p_name text)
returns setof public.bizoveya_workspaces language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'bz_forbidden'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 then raise exception 'bz_invalid_name'; end if;
  insert into public.bizoveya_workspaces(owner_id, name) values (v_user, btrim(p_name)) returning id into v_id;
  insert into public.bizoveya_memberships(workspace_id, user_id, role) values (v_id, v_user, 'owner');
  return query select * from public.bizoveya_workspaces where id = v_id;
end; $$;

create function public.bz_rename_workspace(p_workspace_id uuid, p_name text, p_expected_version integer)
returns setof public.bizoveya_workspaces language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role = 'owner' for share;
  if not found then raise exception 'bz_forbidden'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 then raise exception 'bz_invalid_name'; end if;
  return query update public.bizoveya_workspaces set name = btrim(p_name), version = version + 1, updated_at = now()
    where id = p_workspace_id and version = p_expected_version returning *;
  if not found then raise exception 'bz_conflict'; end if;
end; $$;

create function public.bz_register_site(p_workspace_id uuid, p_name text, p_mode text, p_kind text, p_url text, p_project_id uuid, p_status text, p_ownership_confirmed boolean)
returns setof public.bizoveya_sites language plpgsql security definer set search_path = '' as $$
begin
  -- Locks the grant until transaction end, serializing revocation against this mutation.
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner', 'editor') for share;
  if not found then raise exception 'bz_forbidden'; end if;
  if p_ownership_confirmed is distinct from true then raise exception 'bz_invalid_ownership'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 or p_status is null or p_status not in ('active','paused') then raise exception 'bz_invalid_details'; end if;
  if p_mode = 'external' then
    if p_kind is null or p_kind not in ('business','portfolio') or not bizoveya_private.valid_site_url(p_url) or p_project_id is not null then raise exception 'bz_invalid_external'; end if;
  elsif p_mode = 'native_portfolio' then
    if p_kind is distinct from 'portfolio' or p_url is not null or p_project_id is null then raise exception 'bz_invalid_portfolio'; end if;
    perform 1 from public.projects where id = p_project_id and owner_id = auth.uid() for share;
    if not found then raise exception 'bz_forbidden'; end if;
  elsif p_mode = 'native_business' then
    if p_kind is distinct from 'business' or p_url is not null or p_project_id is not null then raise exception 'bz_invalid_business'; end if;
  else raise exception 'bz_invalid_mode'; end if;
  return query insert into public.bizoveya_sites(workspace_id, name, mode, kind, url, project_id, status, created_by)
    values (p_workspace_id, btrim(p_name), p_mode, p_kind, p_url, p_project_id, p_status, auth.uid()) returning *;
end; $$;

create function public.bz_update_site(p_workspace_id uuid, p_site_id uuid, p_name text, p_status text, p_expected_version integer, p_url text, p_ownership_confirmed boolean)
returns setof public.bizoveya_sites language plpgsql security definer set search_path = '' as $$
declare v_site public.bizoveya_sites;
begin
  perform 1 from public.bizoveya_memberships where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner','editor') for share;
  if not found then raise exception 'bz_forbidden'; end if;
  select * into v_site from public.bizoveya_sites where id = p_site_id and workspace_id = p_workspace_id for update;
  if not found then raise exception 'bz_not_found'; end if;
  if v_site.version is distinct from p_expected_version then raise exception 'bz_conflict'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 or p_status is null or p_status not in ('active','paused') then raise exception 'bz_invalid_details'; end if;
  if p_url is not null and (v_site.mode <> 'external' or p_ownership_confirmed is distinct from true or not bizoveya_private.valid_site_url(p_url)) then raise exception 'bz_invalid_url'; end if;
  return query update public.bizoveya_sites set name = btrim(p_name), status = p_status, url = coalesce(p_url, url), version = version + 1, updated_at = now(),
    ownership_declared_at = case when p_url is not null then now() else ownership_declared_at end where id = p_site_id returning *;
end; $$;

revoke all on function public.bz_create_workspace(text) from public, anon, authenticated;
revoke all on function public.bz_rename_workspace(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.bz_register_site(uuid,text,text,text,text,uuid,text,boolean) from public, anon, authenticated;
revoke all on function public.bz_update_site(uuid,uuid,text,text,integer,text,boolean) from public, anon, authenticated;
grant execute on function public.bz_create_workspace(text) to authenticated;
grant execute on function public.bz_rename_workspace(uuid,text,integer) to authenticated;
grant execute on function public.bz_register_site(uuid,text,text,text,text,uuid,text,boolean) to authenticated;
grant execute on function public.bz_update_site(uuid,uuid,text,text,integer,text,boolean) to authenticated;
commit;
