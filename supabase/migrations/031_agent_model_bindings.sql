-- P04.3.1: reviewed version-pinned assignments; does not activate any runtime.
begin;
create table bizoveya_private.agent_model_bindings (
 agent_id uuid primary key references bizoveya_private.agent_definitions(id),
 agent_version integer not null,
 profile_id uuid not null,
 profile_version integer not null,
 credential_version integer not null,
 test_id uuid not null references bizoveya_private.model_test_runs(id),
 revision integer not null check(revision > 0),
 enabled boolean not null,
 actor_id uuid references auth.users(id) on delete set null,
 reason text not null check(length(btrim(reason)) between 10 and 300),
 updated_at timestamptz not null default clock_timestamp(),
 foreign key(agent_id,agent_version) references bizoveya_private.agent_versions(agent_id,version),
 foreign key(profile_id,profile_version) references bizoveya_private.model_profile_versions(profile_id,version)
);
create table bizoveya_private.agent_binding_events (
 id uuid primary key default gen_random_uuid(),
 agent_id uuid not null references bizoveya_private.agent_definitions(id),
 revision integer not null, action text not null check(action in ('assign','disable')),
 snapshot jsonb not null, actor_id uuid references auth.users(id) on delete set null,
 reason text not null, occurred_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.agent_model_bindings enable row level security;
alter table bizoveya_private.agent_binding_events enable row level security;
revoke all on bizoveya_private.agent_model_bindings,bizoveya_private.agent_binding_events from public,anon,authenticated,service_role;
create function bizoveya_private.binding_issue(b bizoveya_private.agent_model_bindings) returns text language plpgsql stable security definer set search_path='' as $$
declare a bizoveya_private.agent_definitions%rowtype; p bizoveya_private.model_profiles%rowtype; c bizoveya_private.model_credentials%rowtype; t bizoveya_private.model_test_runs%rowtype; ad jsonb; pd jsonb;
begin
 if not b.enabled then return 'disabled'; end if;
 select * into a from bizoveya_private.agent_definitions where id=b.agent_id;
 if a.latest_version<>b.agent_version or a.preview_version is distinct from b.agent_version or not exists(select 1 from bizoveya_private.agent_checks where agent_id=a.id and version=b.agent_version) then return 'agent_changed';end if;
 select * into p from bizoveya_private.model_profiles where id=b.profile_id;
 if p.version<>b.profile_version then return 'profile_changed';end if;
 select document into pd from bizoveya_private.model_profile_versions where profile_id=p.id and version=p.version;
 select document into ad from bizoveya_private.agent_versions where agent_id=a.id and version=a.latest_version;
 if ad->>'modelTier' is distinct from pd->>'tier' then return 'tier_mismatch';end if;
 select * into c from bizoveya_private.model_credentials where id=pd->>'credentialRef';
 if c.enabled is distinct from true or c.version<>b.credential_version then return 'credential_changed';end if;
 if not exists(select 1 from bizoveya_private.model_profile_checks where profile_id=p.id and version=p.version and credential_id=c.id and credential_version=c.version) then return 'profile_unchecked';end if;
 select * into t from bizoveya_private.model_test_runs where id=b.test_id;
 if t.status<>'passed' or t.result_code<>'response_matched' or t.profile_id<>p.id or t.profile_version<>p.version or t.credential_id<>c.id or t.credential_version<>c.version or t.adapter_version<>'connectivity-v1-ai7.0.127' then return 'test_mismatch';end if;
 if t.finished_at is null or t.finished_at<statement_timestamp()-interval '24 hours' then return 'test_expired';end if;
 return null;
end;$$;
revoke all on function bizoveya_private.binding_issue(bizoveya_private.agent_model_bindings) from public,anon,authenticated,service_role;
create function public.bz_admin_binding_registry() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return jsonb_build_object('bindings',coalesce((select jsonb_agg(to_jsonb(b)||jsonb_build_object('issue',bizoveya_private.binding_issue(b)) order by b.updated_at desc) from bizoveya_private.agent_model_bindings b),'[]'::jsonb),
 'events',coalesce((select jsonb_agg(to_jsonb(e)) from(select id,agent_id,revision,action,snapshot,actor_id,reason,occurred_at from bizoveya_private.agent_binding_events order by occurred_at desc,id desc limit 100)e),'[]'::jsonb));
end;$$;
create function public.bz_admin_mutate_binding(p_agent_id uuid,p_profile_id uuid,p_test_id uuid,p_expected_revision integer,p_agent_revision integer,p_profile_revision integer,p_credential_version integer,p_action text,p_reviewed boolean,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$
declare b bizoveya_private.agent_model_bindings%rowtype; a bizoveya_private.agent_definitions%rowtype;p bizoveya_private.model_profiles%rowtype;issue text;
begin
 perform bizoveya_private.require_admin();
 perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;
 if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_reviewed is distinct from true or p_action is null or p_action not in('assign','disable') or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_binding';end if;
 perform pg_advisory_xact_lock(31043);
 select * into b from bizoveya_private.agent_model_bindings where agent_id=p_agent_id for update;
 if coalesce(b.revision,0) is distinct from p_expected_revision then raise exception 'bz_conflict';end if;
 if p_action='disable' then
  if b.agent_id is null then raise exception 'bz_binding_missing';end if;
  if not b.enabled then return public.bz_admin_binding_registry();end if;
  update bizoveya_private.agent_model_bindings set enabled=false,revision=revision+1,actor_id=auth.uid(),reason=btrim(p_reason),updated_at=clock_timestamp() where agent_id=p_agent_id returning * into b;
 else
  select * into a from bizoveya_private.agent_definitions where id=p_agent_id for share;
  select * into p from bizoveya_private.model_profiles where id=p_profile_id for share;
  if a.id is null or p.id is null then raise exception 'bz_binding_missing';end if;
  if a.revision is distinct from p_agent_revision or p.revision is distinct from p_profile_revision then raise exception 'bz_conflict';end if;
  perform 1 from bizoveya_private.model_credentials c join bizoveya_private.model_profile_versions v on v.profile_id=p.id and v.version=p.version and c.id=v.document->>'credentialRef' for share of c;
  b.agent_id:=a.id;b.agent_version:=a.latest_version;b.profile_id:=p.id;b.profile_version:=p.version;b.credential_version:=p_credential_version;b.test_id:=p_test_id;b.enabled:=true;
  if p_test_id is null or p_credential_version is null or not exists(select 1 from bizoveya_private.model_test_runs where id=p_test_id) then raise exception 'bz_binding_test_required';end if;
  issue:=bizoveya_private.binding_issue(b);
  if issue is not null then raise exception 'bz_binding_%',issue;end if;
  insert into bizoveya_private.agent_model_bindings(agent_id,agent_version,profile_id,profile_version,credential_version,test_id,revision,enabled,actor_id,reason)
  values(b.agent_id,b.agent_version,b.profile_id,b.profile_version,b.credential_version,b.test_id,coalesce(b.revision,0)+1,true,auth.uid(),btrim(p_reason))
  on conflict(agent_id) do update set agent_version=excluded.agent_version,profile_id=excluded.profile_id,profile_version=excluded.profile_version,credential_version=excluded.credential_version,test_id=excluded.test_id,revision=excluded.revision,enabled=true,actor_id=excluded.actor_id,reason=excluded.reason,updated_at=clock_timestamp() returning * into b;
 end if;
 insert into bizoveya_private.agent_binding_events(agent_id,revision,action,snapshot,actor_id,reason) values(b.agent_id,b.revision,p_action,to_jsonb(b),auth.uid(),btrim(p_reason));
 return public.bz_admin_binding_registry();
end;$$;
revoke all on function public.bz_admin_binding_registry(),public.bz_admin_mutate_binding(uuid,uuid,uuid,integer,integer,integer,integer,text,boolean,text) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_binding_registry(),public.bz_admin_mutate_binding(uuid,uuid,uuid,integer,integer,integer,integer,text,boolean,text) to authenticated;
commit;
