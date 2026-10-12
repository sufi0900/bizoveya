-- Reviewed channel-specialist roster and immutable private request delegation. No provider, generation or publication.
begin;
create table bizoveya_private.site_channel_specialists(
 site_id uuid primary key references public.bizoveya_sites(id) on delete cascade,
 version integer not null check(version between 1 and 50),document jsonb not null,actor_id uuid not null,updated_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.site_channel_specialist_revisions(
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,version integer not null,document jsonb not null,reason text not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),primary key(site_id,version)
);
create table bizoveya_private.agency_channel_delegations(
 request_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 source_version integer not null check(source_version between 1 and 99),roster_version integer not null check(roster_version between 1 and 50),instruction text not null,reason text not null,assignments jsonb not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.site_channel_specialists enable row level security;
alter table bizoveya_private.site_channel_specialist_revisions enable row level security;
alter table bizoveya_private.agency_channel_delegations enable row level security;
revoke all on bizoveya_private.site_channel_specialists,bizoveya_private.site_channel_specialist_revisions,bizoveya_private.agency_channel_delegations from public,anon,authenticated,service_role;
create trigger channel_specialist_revision_immutable before update on bizoveya_private.site_channel_specialist_revisions for each row execute function bizoveya_private.onboarding_immutable();
create trigger agency_channel_delegation_immutable before update on bizoveya_private.agency_channel_delegations for each row execute function bizoveya_private.agency_handoff_immutable();

create function public.bz_site_channel_specialists(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id);
 return jsonb_build_object('version',coalesce((select version from bizoveya_private.site_channel_specialists where site_id=p_site_id),0),'document',(select document from bizoveya_private.site_channel_specialists where site_id=p_site_id),'catalog',public.bz_site_agent_catalog(p_workspace_id,p_site_id),'history',coalesce((select jsonb_agg(jsonb_build_object('version',version,'document',document,'reason',reason,'actorId',actor_id,'createdAt',created_at) order by version desc) from bizoveya_private.site_channel_specialist_revisions where site_id=p_site_id),'[]'::jsonb));
end;$$;

create function public.bz_save_site_channel_specialists(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;old_ bizoveya_private.site_channel_specialists%rowtype;doc_ jsonb;item_ jsonb;expected_ integer;binding_ bizoveya_private.agent_model_bindings%rowtype;catalog_ jsonb;
begin
 perform pg_advisory_xact_lock(817031);actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>6000 or (select count(*) from jsonb_object_keys(p_input))<>4 or not(p_input ?& array['document','expectedVersion','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or not bizoveya_private.valid_visual_text(p_input->'reason',500) or length(p_input->>'reason')<10 then raise exception 'bz_invalid_channel_specialists';end if;
 expected_:=(p_input->>'expectedVersion')::integer;if expected_>50 then raise exception 'bz_invalid_channel_specialists';end if;doc_:=p_input->'document';
 if jsonb_typeof(doc_) is distinct from 'object' or (select count(*) from jsonb_object_keys(doc_))<>2 or not(doc_ ?& array['enabled','assignments']) or jsonb_typeof(doc_->'enabled') is distinct from 'boolean' or jsonb_typeof(doc_->'assignments') is distinct from 'array' or jsonb_array_length(doc_->'assignments') not in(0,3) or doc_->'enabled'='true'::jsonb and jsonb_array_length(doc_->'assignments')<>3 then raise exception 'bz_invalid_channel_specialists';end if;
 for item_ in select value from jsonb_array_elements(doc_->'assignments') loop
  if jsonb_typeof(item_) is distinct from 'object' or (select count(*) from jsonb_object_keys(item_))<>3 or not(item_ ?& array['channel','agentId','agentVersion']) or item_->>'channel' not in('blog','pinterest','linkedin') or jsonb_typeof(item_->'agentId') is distinct from 'string' or (item_->>'agentId')!~'^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' or jsonb_typeof(item_->'agentVersion') is distinct from 'number' or (item_->>'agentVersion')!~'^[0-9]{1,9}$' or (item_->>'agentVersion')::integer<1 then raise exception 'bz_invalid_channel_specialists';end if;
 end loop;
 if (select count(distinct value->>'channel') from jsonb_array_elements(doc_->'assignments'))<>jsonb_array_length(doc_->'assignments') or doc_->'enabled'='true'::jsonb and exists(select 1 from unnest(array['blog','pinterest','linkedin']) channel where not exists(select 1 from jsonb_array_elements(doc_->'assignments') value where value->>'channel'=channel)) then raise exception 'bz_invalid_channel_specialists';end if;
 select * into old_ from bizoveya_private.site_channel_specialists where site_id=p_site_id for update;
 if old_.document=doc_ and old_.actor_id=actor_ and old_.version in(expected_,expected_+1) and exists(select 1 from bizoveya_private.site_channel_specialist_revisions where site_id=p_site_id and version=old_.version and reason=p_input->>'reason') then return public.bz_site_channel_specialists(p_workspace_id,p_site_id);end if;
 if coalesce(old_.version,0) is distinct from expected_ then raise exception 'bz_conflict';end if;if coalesce(old_.version,0)>=50 then raise exception 'bz_channel_specialists_limit';end if;
 catalog_:=public.bz_site_agent_catalog(p_workspace_id,p_site_id);
 for item_ in select value from jsonb_array_elements(doc_->'assignments') loop
  if doc_->'enabled'='false'::jsonb and coalesce(old_.document->'assignments','[]'::jsonb) @> jsonb_build_array(item_) then continue;end if;
  if not exists(select 1 from jsonb_array_elements(catalog_) c where (c->>'id')::uuid=(item_->>'agentId')::uuid and c->>'kind'='content' and (c->>'version')::integer=(item_->>'agentVersion')::integer) then raise exception 'bz_channel_specialists_changed';end if;
  if doc_->'enabled'='true'::jsonb then select * into binding_ from bizoveya_private.agent_model_bindings where agent_id=(item_->>'agentId')::uuid;if binding_.agent_id is null or binding_.agent_version<>(item_->>'agentVersion')::integer or bizoveya_private.binding_issue(binding_) is not null or not exists(select 1 from bizoveya_private.spending_policies policy where policy.profile_id=binding_.profile_id and policy.profile_version=binding_.profile_version and policy.document->>'enabled'='true' and (policy.document->>'validUntil')::timestamptz>statement_timestamp()) then raise exception 'bz_channel_specialists_not_ready';end if;end if;
 end loop;
 insert into bizoveya_private.site_channel_specialists(site_id,version,document,actor_id) values(p_site_id,coalesce(old_.version,0)+1,doc_,actor_) on conflict(site_id) do update set version=excluded.version,document=excluded.document,actor_id=excluded.actor_id,updated_at=clock_timestamp();
 insert into bizoveya_private.site_channel_specialist_revisions(site_id,version,document,reason,actor_id) values(p_site_id,coalesce(old_.version,0)+1,doc_,p_input->>'reason',actor_);
 return public.bz_site_channel_specialists(p_workspace_id,p_site_id);
end;$$;

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_channel_specialists;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_channel_specialists(p_id)||jsonb_build_object('channelDelegation',(select jsonb_build_object('requestId',d.request_id,'sourceVersion',d.source_version,'rosterVersion',d.roster_version,'instruction',d.instruction,'reason',d.reason,'assignments',d.assignments,'actorId',d.actor_id,'createdAt',d.created_at) from bizoveya_private.agency_channel_delegations d where d.request_id=p_id));
$$;

create function public.bz_delegate_agency_request_specialists(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;request_ uuid;record_ bizoveya_private.agency_records%rowtype;roster_ bizoveya_private.site_channel_specialists%rowtype;existing_ bizoveya_private.agency_channel_delegations%rowtype;selected_ jsonb;item_ jsonb;binding_ bizoveya_private.agent_model_bindings%rowtype;
begin
 perform pg_advisory_xact_lock(817031);actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or (select count(*) from jsonb_object_keys(p_input))<>4 or not(p_input ?& array['id','expectedVersion','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or not bizoveya_private.valid_visual_text(p_input->'reason',500) or length(p_input->>'reason')<10 then raise exception 'bz_invalid_specialist_delegation';end if;
 begin request_:=(p_input->>'id')::uuid;exception when others then raise exception 'bz_invalid_specialist_delegation';end;
 select * into record_ from bizoveya_private.agency_records where id=request_ for update;if record_.id is null or record_.site_id<>p_site_id or record_.kind<>'request' or record_.status<>'proposed' then raise exception 'bz_specialist_request_required';end if;
 select * into existing_ from bizoveya_private.agency_channel_delegations where request_id=request_;
 if existing_.request_id is not null then if existing_.source_version=(p_input->>'expectedVersion')::integer and existing_.reason=p_input->>'reason' and existing_.actor_id=actor_ then return bizoveya_private.agency_json(request_);end if;raise exception 'bz_conflict';end if;
 if record_.version is distinct from (p_input->>'expectedVersion')::integer or record_.version>=100 then raise exception 'bz_conflict';end if;
 select * into roster_ from bizoveya_private.site_channel_specialists where site_id=p_site_id for share;if roster_.site_id is null or roster_.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_channel_specialists_paused';end if;
 select jsonb_agg(jsonb_build_object('channel',requested#>>'{}','specialistKind','content','agentId',chosen.assignment->>'agentId','agentVersion',(chosen.assignment->>'agentVersion')::integer,'state','delegated') order by case requested#>>'{}' when 'blog' then 1 when 'pinterest' then 2 else 3 end) into selected_ from jsonb_array_elements(record_.document->'channels') requested join lateral (select value as assignment from jsonb_array_elements(roster_.document->'assignments') value where value->>'channel'=requested#>>'{}') chosen on true;
 if selected_ is null or jsonb_array_length(selected_)<>jsonb_array_length(record_.document->'channels') then raise exception 'bz_channel_specialists_changed';end if;
 for item_ in select value from jsonb_array_elements(selected_) loop select * into binding_ from bizoveya_private.agent_model_bindings where agent_id=(item_->>'agentId')::uuid;if binding_.agent_id is null or binding_.agent_version<>(item_->>'agentVersion')::integer or bizoveya_private.binding_issue(binding_) is not null or not exists(select 1 from bizoveya_private.spending_policies policy where policy.profile_id=binding_.profile_id and policy.profile_version=binding_.profile_version and policy.document->>'enabled'='true' and (policy.document->>'validUntil')::timestamptz>statement_timestamp()) then raise exception 'bz_channel_specialists_not_ready';end if;end loop;
 insert into bizoveya_private.agency_channel_delegations(request_id,source_version,roster_version,instruction,reason,assignments,actor_id) values(request_,record_.version,roster_.version,record_.document->>'instruction',p_input->>'reason',selected_,actor_);
 update bizoveya_private.agency_records set version=version+1 where id=request_;insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(request_,record_.version+1,'delegate-channel-specialists',p_input->>'reason',actor_);
 return bizoveya_private.agency_json(request_);
end;$$;

revoke all on function public.bz_site_channel_specialists(uuid,uuid),public.bz_save_site_channel_specialists(uuid,uuid,jsonb),public.bz_delegate_agency_request_specialists(uuid,uuid,jsonb),bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_channel_specialists(uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_site_channel_specialists(uuid,uuid),public.bz_save_site_channel_specialists(uuid,uuid,jsonb),public.bz_delegate_agency_request_specialists(uuid,uuid,jsonb) to authenticated;
commit;
