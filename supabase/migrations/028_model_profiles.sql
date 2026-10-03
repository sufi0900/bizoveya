-- P04.2.1: candidate profiles and environment-backed references. No secrets/models executed.
begin;
create table bizoveya_private.model_credentials(id text primary key,provider text not null unique check(provider in('nebius','openai','gemini')),enabled boolean not null default false,version integer not null default 1 check(version>0),check(id='platform-'||provider));
insert into bizoveya_private.model_credentials(id,provider) values('platform-nebius','nebius'),('platform-openai','openai'),('platform-gemini','gemini');
create function bizoveya_private.valid_model_profile(d jsonb) returns boolean language plpgsql immutable set search_path='' as $$begin
 if jsonb_typeof(d) is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(d))<>7 or octet_length(d::text)>4000 then return false;end if;
 if jsonb_typeof(d->'name') is distinct from 'string' or length(btrim(d->>'name')) not between 1 and 80 or d->>'name' ~ '[\x01-\x1F]' then return false;end if;
 if jsonb_typeof(d->'provider') is distinct from 'string' or d->>'provider' not in('nebius','openai','gemini') or jsonb_typeof(d->'credentialRef') is distinct from 'string' or d->>'credentialRef'<>'platform-'||(d->>'provider') then return false;end if;
 if jsonb_typeof(d->'modelId') is distinct from 'string' or d->>'modelId' !~ '^[A-Za-z0-9][A-Za-z0-9._/-]{0,119}$' or jsonb_typeof(d->'tier') is distinct from 'string' or d->>'tier' not in('economical','reasoning') then return false;end if;
 if jsonb_typeof(d->'maxOutputTokens') is distinct from 'number' or d->>'maxOutputTokens' !~ '^[0-9]{3,5}$' or jsonb_typeof(d->'dailyBudgetCents') is distinct from 'number' or d->>'dailyBudgetCents' !~ '^[0-9]{1,6}$' then return false;end if;
 return (d->>'maxOutputTokens')::int between 128 and 32768 and (d->>'dailyBudgetCents')::int between 1 and 100000;
end;$$;
revoke all on function bizoveya_private.valid_model_profile(jsonb) from public,anon,authenticated,service_role;
create table bizoveya_private.model_profiles(id uuid primary key,slug text not null unique check(slug ~ '^[a-z][a-z0-9-]{2,39}$'),version integer not null default 1 check(version>0),revision integer not null default 1 check(revision>0));
create table bizoveya_private.model_profile_versions(profile_id uuid references bizoveya_private.model_profiles(id),version integer not null,document jsonb not null check(bizoveya_private.valid_model_profile(document)),actor_id uuid references auth.users(id) on delete set null,reason text not null,created_at timestamptz not null default clock_timestamp(),primary key(profile_id,version));
alter table bizoveya_private.model_profiles add foreign key(id,version) references bizoveya_private.model_profile_versions(profile_id,version) deferrable initially deferred;
create table bizoveya_private.model_profile_checks(profile_id uuid,version integer,credential_id text references bizoveya_private.model_credentials(id),credential_version integer not null,primary key(profile_id,version),foreign key(profile_id,version) references bizoveya_private.model_profile_versions(profile_id,version));
create table bizoveya_private.model_events(id uuid primary key default gen_random_uuid(),resource text not null,resource_id text not null,version integer not null,action text not null,actor_id uuid references auth.users(id) on delete set null,reason text not null,occurred_at timestamptz not null default clock_timestamp());
alter table bizoveya_private.model_credentials enable row level security;alter table bizoveya_private.model_profiles enable row level security;alter table bizoveya_private.model_profile_versions enable row level security;alter table bizoveya_private.model_profile_checks enable row level security;alter table bizoveya_private.model_events enable row level security;
revoke all on bizoveya_private.model_credentials,bizoveya_private.model_profiles,bizoveya_private.model_profile_versions,bizoveya_private.model_profile_checks,bizoveya_private.model_events from public,anon,authenticated,service_role;
create function public.bz_admin_model_registry() returns jsonb language plpgsql security definer set search_path='' as $$begin perform bizoveya_private.require_admin();return jsonb_build_object('credentials',coalesce((select jsonb_agg(to_jsonb(c) order by c.id) from bizoveya_private.model_credentials c),'[]'::jsonb),'profiles',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'slug',p.slug,'version',p.version,'revision',p.revision,'document',v.document,'checked',exists(select 1 from bizoveya_private.model_profile_checks c join bizoveya_private.model_credentials cr on cr.id=c.credential_id and cr.version=c.credential_version and cr.enabled where c.profile_id=p.id and c.version=p.version)) order by p.slug) from bizoveya_private.model_profiles p join bizoveya_private.model_profile_versions v on v.profile_id=p.id and v.version=p.version),'[]'::jsonb));end;$$;
create function public.bz_admin_mutate_model(p_id uuid,p_action text,p_slug text,p_document jsonb,p_expected_revision integer,p_reason text) returns jsonb language plpgsql security definer set search_path='' as $$declare p bizoveya_private.model_profiles%rowtype;v integer;c bizoveya_private.model_credentials%rowtype;d jsonb;begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 perform pg_advisory_xact_lock(28041);
 if p_id is null or p_action is null or p_action not in('save','check') or length(btrim(coalesce(p_reason,''))) not between 10 and 300 then raise exception 'bz_invalid_model';end if;
 select * into p from bizoveya_private.model_profiles where id=p_id for update;
 if coalesce(p.revision,0) is distinct from p_expected_revision then raise exception 'bz_conflict';end if;
 if p_action='save' then
 if bizoveya_private.valid_model_profile(p_document) is distinct from true or p_slug is null or p_slug !~ '^[a-z][a-z0-9-]{2,39}$' or p.id is not null and p.slug<>p_slug then raise exception 'bz_invalid_model';end if;
 if exists(select 1 from bizoveya_private.model_profiles where slug=p_slug and id<>p_id) then raise exception 'bz_duplicate_model';end if;
 if p.id is null and(select count(*) from bizoveya_private.model_profiles)>=32 or coalesce(p.version,0)>=100 then raise exception 'bz_model_limit';end if;
 if p.id is not null and(select document from bizoveya_private.model_profile_versions where profile_id=p_id and version=p.version)=p_document then return public.bz_admin_model_registry();end if;
 v:=coalesce(p.version,0)+1;if p.id is null then insert into bizoveya_private.model_profiles(id,slug) values(p_id,p_slug);else update bizoveya_private.model_profiles set version=v,revision=revision+1 where id=p_id;end if;
 insert into bizoveya_private.model_profile_versions(profile_id,version,document,actor_id,reason) values(p_id,v,p_document,auth.uid(),btrim(p_reason));
 else
 if p.id is null then raise exception 'bz_not_found';end if;v:=p.version;select document into d from bizoveya_private.model_profile_versions where profile_id=p_id and version=v;
 select * into c from bizoveya_private.model_credentials where id=d->>'credentialRef' for share;
 if c.enabled is distinct from true then raise exception 'bz_credential_disabled';end if;
 insert into bizoveya_private.model_profile_checks(profile_id,version,credential_id,credential_version) values(p_id,v,c.id,c.version) on conflict(profile_id,version) do update set credential_id=excluded.credential_id,credential_version=excluded.credential_version;
 update bizoveya_private.model_profiles set revision=revision+1 where id=p_id;
 end if;
 insert into bizoveya_private.model_events(resource,resource_id,version,action,actor_id,reason) values('profile',p_id::text,v,p_action,auth.uid(),btrim(p_reason));return public.bz_admin_model_registry();
end;$$;
create function public.bz_admin_mutate_credential(p_id text,p_action text,p_expected_version integer,p_reason text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$declare c bizoveya_private.model_credentials%rowtype;begin
 perform bizoveya_private.require_admin();perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden' using errcode='42501';end if;
 if p_reviewed is distinct from true or p_action is null or p_action not in('enable','disable','record-rotation') or length(btrim(coalesce(p_reason,''))) not between 10 and 300 then raise exception 'bz_invalid_credential';end if;
 select * into c from bizoveya_private.model_credentials where id=p_id for update;if not found then raise exception 'bz_invalid_credential';end if;
 if c.version is distinct from p_expected_version then raise exception 'bz_conflict';end if;
 if p_action='enable' and c.enabled or p_action='disable' and not c.enabled then return public.bz_admin_model_registry();end if;
 update bizoveya_private.model_credentials set enabled=case p_action when 'enable' then true when 'disable' then false else enabled end,version=version+1 where id=p_id;
 insert into bizoveya_private.model_events(resource,resource_id,version,action,actor_id,reason) values('credential',p_id,c.version+1,p_action,auth.uid(),btrim(p_reason));return public.bz_admin_model_registry();
end;$$;
create function public.bz_admin_model_history(p_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$begin perform bizoveya_private.require_admin();return coalesce((select jsonb_agg(to_jsonb(v)) from(select version,document,actor_id,reason,created_at from bizoveya_private.model_profile_versions where profile_id=p_id order by version desc limit 30)v),'[]'::jsonb);end;$$;
create function public.bz_admin_model_events() returns jsonb language plpgsql security definer set search_path='' as $$begin perform bizoveya_private.require_admin();return coalesce((select jsonb_agg(to_jsonb(e)) from(select * from bizoveya_private.model_events order by occurred_at desc,id desc limit 100)e),'[]'::jsonb);end;$$;
revoke all on function public.bz_admin_model_registry(),public.bz_admin_mutate_model(uuid,text,text,jsonb,integer,text),public.bz_admin_mutate_credential(text,text,integer,text,boolean),public.bz_admin_model_history(uuid),public.bz_admin_model_events() from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_model_registry(),public.bz_admin_mutate_model(uuid,text,text,jsonb,integer,text),public.bz_admin_mutate_credential(text,text,integer,text,boolean),public.bz_admin_model_history(uuid),public.bz_admin_model_events() to authenticated;
commit;
