-- One durable reviewed request -> prepared run. Never executes a provider.
begin;
create table bizoveya_private.agency_generation_handoffs(
 record_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 run_id uuid not null unique references bizoveya_private.generation_runs(id) on delete cascade,
 source_version integer not null check(source_version between 1 and 100),
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.agency_generation_handoffs enable row level security;
revoke all on bizoveya_private.agency_generation_handoffs from public,anon,authenticated,service_role;
create trigger agency_generation_handoff_immutable before update on bizoveya_private.agency_generation_handoffs for each row execute function bizoveya_private.agency_handoff_immutable();
alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_execution;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_execution(p_id)||jsonb_build_object(
 'executionPreparation',(select jsonb_build_object('campaignVersion',c.version,'campaignTitle',c.document->>'title') from bizoveya_private.agency_campaign_handoffs h join public.bizoveya_campaigns c on c.id=h.campaign_id where h.record_id=p_id),
 'execution',(select jsonb_build_object('sourceVersion',h.source_version,'actorId',h.actor_id,'createdAt',h.created_at,'run',jsonb_build_object('id',g.id,'campaignId',g.campaign_id,'campaignVersion',g.campaign_version,'status',g.status,'createdAt',g.created_at,'startedAt',g.started_at,'finishedAt',g.finished_at,'stageCount',jsonb_array_length(g.input_snapshot->'stages'),'outputAvailable',g.output_document is not null)) from bizoveya_private.agency_generation_handoffs h join bizoveya_private.generation_runs g on g.id=h.run_id where h.record_id=p_id));
$$;
create function public.bz_prepare_agency_generation(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;id_ uuid;run_ uuid;a bizoveya_private.agency_records%rowtype;h bizoveya_private.agency_campaign_handoffs%rowtype;e bizoveya_private.agency_generation_handoffs%rowtype;g bizoveya_private.generation_runs%rowtype;begin
 -- Use the same global-first lock order as spending, roster and generation admission.
 perform pg_advisory_xact_lock(817030);
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 then raise exception 'bz_invalid_agency_generation';end if;
 if (select count(*) from jsonb_object_keys(p_input))<>5 or not(p_input ?& array['id','runId','expectedVersion','expectedCampaignVersion','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedVersion')::integer not between 1 and 100 or jsonb_typeof(p_input->'expectedCampaignVersion') is distinct from 'number' or (p_input->>'expectedCampaignVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedCampaignVersion')::integer not between 1 and 100 then raise exception 'bz_invalid_agency_generation';end if;
 begin id_:=(p_input->>'id')::uuid;run_:=(p_input->>'runId')::uuid;exception when others then raise exception 'bz_invalid_agency_generation';end;
 if id_ is null or run_ is null then raise exception 'bz_invalid_agency_generation';end if;
 select * into a from bizoveya_private.agency_records where id=id_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into h from bizoveya_private.agency_campaign_handoffs where record_id=id_;
 if h.record_id is null then raise exception 'bz_agency_campaign_required';end if;
 select * into e from bizoveya_private.agency_generation_handoffs where record_id=id_;
 if e.record_id is not null then
  select * into g from bizoveya_private.generation_runs where id=e.run_id;
  if e.run_id=run_ and e.actor_id=actor_ and e.source_version=(p_input->>'expectedVersion')::integer and g.campaign_version=(p_input->>'expectedCampaignVersion')::integer then return bizoveya_private.agency_json(id_);end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'request' or a.status<>'proposed' or a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 if a.version>=100 then raise exception 'bz_agency_limit';end if;
 -- Do not attach an independently prepared run or reuse another request's UUID.
 if exists(select 1 from bizoveya_private.generation_runs where id=run_) then raise exception 'bz_conflict';end if;
 perform public.bz_prepare_campaign_generation(p_workspace_id,p_site_id,h.campaign_id,(p_input->>'expectedCampaignVersion')::integer,run_);
 insert into bizoveya_private.agency_generation_handoffs(record_id,run_id,source_version,actor_id) values(id_,run_,a.version,actor_);
 update bizoveya_private.agency_records set version=version+1 where id=id_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(id_,a.version+1,'prepare-generation','Reviewed generation snapshot prepared. Separate admin authorization required; no provider call.',actor_);
 return bizoveya_private.agency_json(id_);
end;$$;
revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_execution(uuid),public.bz_prepare_agency_generation(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_agency_generation(uuid,uuid,jsonb) to authenticated;
commit;
