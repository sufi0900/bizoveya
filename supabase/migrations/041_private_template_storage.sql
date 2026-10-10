-- P04.3.4.3b: creator-private recipes only. No campaign format change or publication.
begin;
create function bizoveya_private.valid_template_recipe(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare base_ jsonb;begin
 if p is null or jsonb_typeof(p) is distinct from 'object' or octet_length(p::text)>4096 then return false;end if;
 if (select count(*) from jsonb_object_keys(p))<>5 or not(p ?& array['schema','renderer','name','brand','templates']) or p->>'schema' is distinct from 'private-template-recipe-v1' or p->>'renderer' is distinct from 'campaign-scenes-v2' then return false;end if;
 if not bizoveya_private.valid_visual_text(p->'name',80) or (p->>'name') ~ '[\x01-\x1F]' then return false;end if;
 base_:=jsonb_build_object('schema','campaign-visuals-v2','brand',p->'brand','templates',p->'templates','pins',jsonb_build_array(jsonb_build_object('title','Title','body','Body'),jsonb_build_object('title','Title','body','Body')),'slides',(select jsonb_agg(jsonb_build_object('title','Title','body','Body')) from generate_series(1,6)),'linkedin',jsonb_build_object('title','Title','body','Body'));
 return bizoveya_private.valid_visual_document(base_);
end;$$;
create table bizoveya_private.private_templates(
 id uuid primary key,creator_id uuid not null references auth.users(id) on delete cascade,
 version integer not null check(version between 1 and 50),archived boolean not null default false,
 created_at timestamptz not null default clock_timestamp(),unique(id,creator_id)
);
create index private_templates_creator on bizoveya_private.private_templates(creator_id,id);
create table bizoveya_private.private_template_versions(
 template_id uuid not null,creator_id uuid not null,version integer not null check(version between 1 and 50),
 recipe jsonb not null check(bizoveya_private.valid_template_recipe(recipe)),created_at timestamptz not null default clock_timestamp(),
 primary key(template_id,version),foreign key(template_id,creator_id) references bizoveya_private.private_templates(id,creator_id) on delete cascade
);
alter table bizoveya_private.private_templates enable row level security;
alter table bizoveya_private.private_template_versions enable row level security;
create policy private_templates_creator_read on bizoveya_private.private_templates for select to authenticated using(creator_id=auth.uid());
create policy private_template_versions_creator_read on bizoveya_private.private_template_versions for select to authenticated using(creator_id=auth.uid());
-- Access remains through checked functions; no table privileges even for service_role.
revoke all on bizoveya_private.private_templates,bizoveya_private.private_template_versions from public,anon,authenticated,service_role;

create function bizoveya_private.guard_private_template() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='DELETE' then
  if exists(select 1 from auth.users where id=old.creator_id) then raise exception 'bz_template_immutable';end if;
  return old;
 end if;
 if new.id is distinct from old.id or new.creator_id is distinct from old.creator_id or new.created_at is distinct from old.created_at then raise exception 'bz_template_immutable';end if;
 if new.version<old.version or new.version>old.version+1 or (old.archived and not new.archived) then raise exception 'bz_template_immutable';end if;
 return new;
end;$$;
create trigger private_template_identity before update or delete on bizoveya_private.private_templates for each row execute function bizoveya_private.guard_private_template();
create function bizoveya_private.guard_private_template_version() returns trigger language plpgsql set search_path='' as $$
begin
 if tg_op='DELETE' and not exists(select 1 from bizoveya_private.private_templates where id=old.template_id) then return old;end if;
 raise exception 'bz_template_immutable';
end;$$;
create trigger private_template_version_immutable before update or delete on bizoveya_private.private_template_versions for each row execute function bizoveya_private.guard_private_template_version();

create function bizoveya_private.template_actor(p_lock boolean default false) returns uuid language plpgsql security definer set search_path='' as $$
declare actor_ uuid:=auth.uid();begin
 if p_lock then perform 1 from auth.users where id=actor_ and deleted_at is null for update;
 else perform 1 from auth.users where id=actor_ and deleted_at is null;end if;
 if not found then raise exception 'bz_forbidden' using errcode='42501';end if;
 return actor_;
end;$$;
create function public.bz_private_template(p_template_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;result_ jsonb;begin
 actor_:=bizoveya_private.template_actor();
 select jsonb_build_object('templateId',t.id,'creatorId',t.creator_id,'archived',t.archived,'versions',(select jsonb_agg(jsonb_build_object('templateId',v.template_id,'creatorId',v.creator_id,'version',v.version,'recipe',v.recipe,'createdAt',to_char(v.created_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')) order by v.version) from bizoveya_private.private_template_versions v where v.template_id=t.id)) into result_ from bizoveya_private.private_templates t where t.id=p_template_id and t.creator_id=actor_;
 if result_ is null then raise exception 'bz_template_unavailable';end if;
 return result_;
end;$$;
create function public.bz_private_templates(p_include_archived boolean default false) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;begin
 actor_:=bizoveya_private.template_actor();
 return coalesce((select jsonb_agg(jsonb_build_object('templateId',t.id,'version',t.version,'archived',t.archived,'name',v.recipe->>'name') order by t.created_at desc,t.id) from bizoveya_private.private_templates t join bizoveya_private.private_template_versions v on v.template_id=t.id and v.version=t.version where t.creator_id=actor_ and (p_include_archived is true or not t.archived)),'[]'::jsonb);
end;$$;
create function public.bz_save_private_template(p_template_id uuid,p_expected_version integer,p_recipe jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;t bizoveya_private.private_templates%rowtype;recipe_ jsonb;begin
 actor_:=bizoveya_private.template_actor(true);
 if p_template_id is null or p_expected_version is null or p_expected_version not between 0 and 50 or not bizoveya_private.valid_template_recipe(p_recipe) then raise exception 'bz_invalid_template';end if;
 recipe_:=jsonb_set(jsonb_set(jsonb_set(p_recipe,'{name}',to_jsonb(btrim(p_recipe->>'name'))),'{brand,name}',to_jsonb(btrim(p_recipe#>>'{brand,name}'))),'{brand,footer}',to_jsonb(btrim(p_recipe#>>'{brand,footer}')));
 select * into t from bizoveya_private.private_templates where id=p_template_id for update;
 if t.id is not null and t.creator_id<>actor_ then raise exception 'bz_template_unavailable';end if;
 if t.archived then raise exception 'bz_template_unavailable';end if;
 if coalesce(t.version,0)<>p_expected_version then raise exception 'bz_conflict';end if;
 if t.id is null then
  if (select count(*) from bizoveya_private.private_templates where creator_id=actor_)>=32 then raise exception 'bz_template_limit';end if;
  insert into bizoveya_private.private_templates(id,creator_id,version) values(p_template_id,actor_,1);
 else
  if t.version>=50 then raise exception 'bz_template_limit';end if;
  update bizoveya_private.private_templates set version=t.version+1 where id=t.id;
 end if;
 insert into bizoveya_private.private_template_versions(template_id,creator_id,version,recipe) values(p_template_id,actor_,p_expected_version+1,recipe_);
 return public.bz_private_template(p_template_id);
end;$$;
create function public.bz_archive_private_template(p_template_id uuid,p_expected_version integer) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;t bizoveya_private.private_templates%rowtype;begin
 actor_:=bizoveya_private.template_actor(true);
 select * into t from bizoveya_private.private_templates where id=p_template_id and creator_id=actor_ for update;
 if t.id is null then raise exception 'bz_template_unavailable';end if;
 if p_expected_version is distinct from t.version then raise exception 'bz_conflict';end if;
 update bizoveya_private.private_templates set archived=true where id=t.id;
 return public.bz_private_template(p_template_id);
end;$$;
revoke all on function bizoveya_private.valid_template_recipe(jsonb),bizoveya_private.guard_private_template(),bizoveya_private.guard_private_template_version(),bizoveya_private.template_actor(boolean),public.bz_private_template(uuid),public.bz_private_templates(boolean),public.bz_save_private_template(uuid,integer,jsonb),public.bz_archive_private_template(uuid,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_private_template(uuid),public.bz_private_templates(boolean),public.bz_save_private_template(uuid,integer,jsonb),public.bz_archive_private_template(uuid,integer) to authenticated;
commit;
