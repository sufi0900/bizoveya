-- Owner-scoped role activation and safe checkpoint pause. No provider call or publication.
begin;
create table bizoveya_private.site_agent_rosters(site_id uuid primary key references public.bizoveya_sites(id) on delete cascade,version integer not null check(version between 1 and 50),document jsonb not null,actor_id uuid not null,updated_at timestamptz not null default clock_timestamp());
create table bizoveya_private.site_agent_roster_revisions(site_id uuid not null references public.bizoveya_sites(id) on delete cascade,version integer not null,document jsonb not null,reason text not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),primary key(site_id,version));
alter table bizoveya_private.site_agent_rosters enable row level security;
alter table bizoveya_private.site_agent_roster_revisions enable row level security;
revoke all on bizoveya_private.site_agent_rosters,bizoveya_private.site_agent_roster_revisions from public,anon,authenticated,service_role;
create trigger roster_revision_immutable before update on bizoveya_private.site_agent_roster_revisions for each row execute function bizoveya_private.onboarding_immutable();
create function public.bz_site_agent_roster(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id);
 return jsonb_build_object('version',coalesce((select version from bizoveya_private.site_agent_rosters where site_id=p_site_id),0),'document',(select document from bizoveya_private.site_agent_rosters where site_id=p_site_id),'catalog',public.bz_site_agent_catalog(p_workspace_id,p_site_id),'history',coalesce((select jsonb_agg(jsonb_build_object('version',version,'document',document,'reason',reason,'actorId',actor_id,'createdAt',created_at) order by version desc) from bizoveya_private.site_agent_roster_revisions where site_id=p_site_id),'[]'::jsonb));
end;$$;
create function public.bz_save_site_agent_roster(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;old_ bizoveya_private.site_agent_rosters%rowtype;doc_ jsonb;a_ jsonb;catalog_ jsonb;expected_ integer;b_ bizoveya_private.agent_model_bindings%rowtype;begin
 perform pg_advisory_xact_lock(817030);
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>6000 then raise exception 'bz_invalid_site_roster';end if;
 if (select count(*) from jsonb_object_keys(p_input))<>4 or not(p_input ?& array['document','expectedVersion','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or not bizoveya_private.valid_visual_text(p_input->'reason',500) then raise exception 'bz_invalid_site_roster';end if;
 expected_:=(p_input->>'expectedVersion')::integer;if expected_>50 then raise exception 'bz_invalid_site_roster';end if;doc_:=p_input->'document';
 if jsonb_typeof(doc_) is distinct from 'object' then raise exception 'bz_invalid_site_roster';end if;
 if (select count(*) from jsonb_object_keys(doc_))<>2 or not(doc_ ?& array['enabled','agents']) or jsonb_typeof(doc_->'enabled') is distinct from 'boolean' or jsonb_typeof(doc_->'agents') is distinct from 'array' then raise exception 'bz_invalid_site_roster';end if;
 if jsonb_array_length(doc_->'agents') not in(0,3) or doc_->'enabled'='true'::jsonb and jsonb_array_length(doc_->'agents')<>3 then raise exception 'bz_invalid_site_roster';end if;
 for a_ in select value from jsonb_array_elements(doc_->'agents') loop
  if jsonb_typeof(a_) is distinct from 'object' then raise exception 'bz_invalid_site_roster';end if;
  if (select count(*) from jsonb_object_keys(a_))<>3 or not(a_ ?& array['kind','agentId','agentVersion']) or a_->>'kind' is null or a_->>'kind' not in('coordinator','content','quality') or jsonb_typeof(a_->'agentId') is distinct from 'string' or (a_->>'agentId')!~'^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$' or jsonb_typeof(a_->'agentVersion') is distinct from 'number' or (a_->>'agentVersion')!~'^[0-9]{1,9}$' or (a_->>'agentVersion')::integer<1 then raise exception 'bz_invalid_site_roster';end if;
 end loop;
 if (select count(distinct value->>'kind') from jsonb_array_elements(doc_->'agents'))<>jsonb_array_length(doc_->'agents') or (select count(distinct lower(value->>'agentId')) from jsonb_array_elements(doc_->'agents'))<>jsonb_array_length(doc_->'agents') then raise exception 'bz_invalid_site_roster';end if;
 select * into old_ from bizoveya_private.site_agent_rosters where site_id=p_site_id for update;
 if old_.document=doc_ and old_.actor_id=actor_ and old_.version in(expected_,expected_+1) and exists(select 1 from bizoveya_private.site_agent_roster_revisions where site_id=p_site_id and version=old_.version and reason=p_input->>'reason') then return public.bz_site_agent_roster(p_workspace_id,p_site_id);end if;
 if coalesce(old_.version,0) is distinct from expected_ then raise exception 'bz_conflict';end if;
 if coalesce(old_.version,0)>=50 then raise exception 'bz_site_roster_limit';end if;
 catalog_:=public.bz_site_agent_catalog(p_workspace_id,p_site_id);
 for a_ in select value from jsonb_array_elements(doc_->'agents') loop
  -- A paused roster may retain an old saved selection so an expired binding cannot prevent pause.
  if doc_->'enabled'='false'::jsonb and old_.document->'agents' @> jsonb_build_array(a_) then continue;end if;
  if not exists(select 1 from jsonb_array_elements(catalog_) c where (c->>'id')::uuid=(a_->>'agentId')::uuid and c->>'kind'=a_->>'kind' and (c->>'version')::integer=(a_->>'agentVersion')::integer) then raise exception 'bz_site_roster_changed';end if;
  if doc_->'enabled'='true'::jsonb then
   select * into b_ from bizoveya_private.agent_model_bindings where agent_id=(a_->>'agentId')::uuid;
   if b_.agent_id is null or b_.agent_version<>(a_->>'agentVersion')::integer or bizoveya_private.binding_issue(b_) is not null or not exists(select 1 from bizoveya_private.spending_policies sp where sp.profile_id=b_.profile_id and sp.profile_version=b_.profile_version and sp.document->>'enabled'='true' and (sp.document->>'validUntil')::timestamptz>statement_timestamp()) then raise exception 'bz_site_roster_not_ready';end if;
  end if;
 end loop;
 insert into bizoveya_private.site_agent_rosters(site_id,version,document,actor_id) values(p_site_id,coalesce(old_.version,0)+1,doc_,actor_) on conflict(site_id) do update set version=excluded.version,document=excluded.document,actor_id=excluded.actor_id,updated_at=clock_timestamp();
 insert into bizoveya_private.site_agent_roster_revisions(site_id,version,document,reason,actor_id) values(p_site_id,coalesce(old_.version,0)+1,doc_,p_input->>'reason',actor_);
 return public.bz_site_agent_roster(p_workspace_id,p_site_id);
end;$$;
create function bizoveya_private.check_run_roster(r bizoveya_private.generation_runs) returns void language plpgsql security definer set search_path='' as $$
declare roster_ bizoveya_private.site_agent_rosters%rowtype;begin
 select * into roster_ from bizoveya_private.site_agent_rosters where site_id=r.site_id for share;
 if roster_.site_id is null then return;end if;
 if roster_.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 if (r.input_snapshot->>'siteRosterVersion')::integer is distinct from roster_.version or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s where not exists(select 1 from jsonb_array_elements(roster_.document->'agents') a where a->>'kind'=s->>'kind' and (a->>'agentId')::uuid=(s->>'agentId')::uuid and (a->>'agentVersion')::integer=(s->>'agentVersion')::integer)) then raise exception 'bz_site_roster_changed';end if;
end;$$;
create or replace function public.bz_prepare_campaign_generation(p_workspace_id uuid,p_site_id uuid,p_campaign_id uuid,p_expected_campaign_version integer,p_run_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare roster_ bizoveya_private.site_agent_rosters%rowtype;role_ text;c public.bizoveya_campaigns%rowtype;prefs public.bizoveya_site_agent_preferences%rowtype;knowledge jsonb;stages jsonb;snapshot jsonb;existing bizoveya_private.generation_runs%rowtype;
begin
 perform pg_advisory_xact_lock(817030);
 select role into role_ from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if role_ is null or role_='viewer' then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for share;if not found then raise exception 'bz_not_found';end if;
 if p_run_id is null or p_campaign_id is null then raise exception 'bz_invalid_generation';end if;
 select * into existing from bizoveya_private.generation_runs where id=p_run_id;
 if existing.id is not null then
  if existing.site_id<>p_site_id or existing.campaign_id<>p_campaign_id or existing.campaign_version<>p_expected_campaign_version then raise exception 'bz_conflict';end if;
  return jsonb_build_object('id',existing.id,'campaignId',existing.campaign_id,'campaignVersion',existing.campaign_version,'status',existing.status,'createdAt',existing.created_at,'startedAt',existing.started_at,'finishedAt',existing.finished_at,'stageCount',jsonb_array_length(existing.input_snapshot->'stages'),'outputAvailable',existing.output_document is not null);
 end if;
 select * into roster_ from bizoveya_private.site_agent_rosters where site_id=p_site_id for share;
 if roster_.site_id is not null and roster_.document->'enabled' is distinct from 'true'::jsonb then raise exception 'bz_site_roster_paused';end if;
 select * into c from public.bizoveya_campaigns where id=p_campaign_id and site_id=p_site_id for share;if c.id is null then raise exception 'bz_not_found';end if;
 if c.version is distinct from p_expected_campaign_version then raise exception 'bz_conflict';end if;
 if(select count(*) from bizoveya_private.generation_runs where campaign_id=p_campaign_id)>=25 then raise exception 'bz_generation_limit';end if;
 select * into prefs from public.bizoveya_site_agent_preferences where site_id=p_site_id;
 select coalesce(jsonb_agg(jsonb_build_object('sourceId',k.id,'sourceVersion',k.version,'title',k.document->>'title','facts',k.document->'facts','approvedAt',k.approved_at) order by k.id),'[]'::jsonb) into knowledge from public.bizoveya_knowledge_sources k where k.site_id=p_site_id and k.approved;
 select coalesce(jsonb_agg(jsonb_build_object('kind',a.kind,'agentId',a.id,'agentVersion',a.preview_version,'agent',av.document,'bindingRevision',b.revision,'profileId',b.profile_id,'profileVersion',b.profile_version,'profile',pv.document,'credentialVersion',b.credential_version,'connectivityTestId',b.test_id,'spendingPolicyVersion',sp.version,'spendingPolicy',sp.document) order by case a.kind when 'coordinator' then 1 when 'content' then 2 else 3 end),'[]'::jsonb) into stages
 from bizoveya_private.agent_definitions a join bizoveya_private.agent_versions av on av.agent_id=a.id and av.version=a.preview_version
 join bizoveya_private.agent_model_bindings b on b.agent_id=a.id and b.agent_version=a.preview_version and b.enabled
 join bizoveya_private.model_profile_versions pv on pv.profile_id=b.profile_id and pv.version=b.profile_version
 join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version
 where (roster_.site_id is null or exists(select 1 from jsonb_array_elements(roster_.document->'agents') chosen where (chosen->>'agentId')::uuid=a.id and chosen->>'kind'=a.kind and (chosen->>'agentVersion')::integer=a.preview_version)) and a.kind in('coordinator','content','quality') and bizoveya_private.binding_issue(b) is null and sp.document->>'enabled'='true' and (sp.document->>'validUntil')::timestamptz>statement_timestamp();
 if jsonb_array_length(knowledge)=0 or jsonb_array_length(stages)<>3 or (select count(distinct value->>'kind') from jsonb_array_elements(stages))<>3 then raise exception 'bz_generation_not_ready';end if;
 snapshot:=jsonb_build_object('schema','campaign-generation-input-v1','siteRosterVersion',coalesce(roster_.version,0),'campaign',jsonb_build_object('id',c.id,'version',c.version,'document',c.document),'preferences',jsonb_build_object('version',coalesce(prefs.version,0),'document',coalesce(prefs.document,'{"brandVoice":"","audience":"","guidance":""}'::jsonb)),'knowledge',knowledge,'stages',stages,'limits',jsonb_build_object('maxStages',3,'maxAttemptsPerStage',1,'publish',false,'externalTools',false));
 insert into bizoveya_private.generation_runs(id,campaign_id,site_id,campaign_version,status,input_snapshot,requested_by) values(p_run_id,c.id,p_site_id,c.version,'prepared',snapshot,auth.uid()) returning * into existing;
 return jsonb_build_object('id',existing.id,'campaignId',existing.campaign_id,'campaignVersion',existing.campaign_version,'status',existing.status,'createdAt',existing.created_at,'startedAt',existing.started_at,'finishedAt',existing.finished_at,'stageCount',jsonb_array_length(existing.input_snapshot->'stages'),'outputAvailable',false);
end;$$;
alter function public.bz_admin_authorize_generation(uuid,uuid,text,boolean) set schema bizoveya_private;
alter function bizoveya_private.bz_admin_authorize_generation(uuid,uuid,text,boolean) rename to authorize_generation_before_roster;
revoke all on function bizoveya_private.authorize_generation_before_roster(uuid,uuid,text,boolean) from public,anon,authenticated,service_role;
alter function public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid) rename to claim_generation_before_roster;
revoke all on function bizoveya_private.claim_generation_before_roster(uuid,uuid,text,uuid,uuid) from public,anon,authenticated,service_role;
alter function public.bz_record_generation_request(uuid,uuid,jsonb) set schema bizoveya_private;
alter function bizoveya_private.bz_record_generation_request(uuid,uuid,jsonb) rename to record_generation_before_roster;
revoke all on function bizoveya_private.record_generation_before_roster(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
create function public.bz_admin_authorize_generation(p_id uuid,p_claim uuid,p_reason text,p_reviewed boolean) returns void language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;begin
 perform bizoveya_private.require_admin();perform pg_advisory_xact_lock(817030);
 perform bizoveya_private.authorize_generation_before_roster(p_id,p_claim,p_reason,p_reviewed);
 select * into r from bizoveya_private.generation_runs where id=p_id;perform bizoveya_private.check_run_roster(r);
end;$$;
create function public.bz_claim_campaign_generation_stage(p_generation_id uuid,p_stage_id uuid,p_kind text,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.generation_runs where id=p_generation_id for update;
 if r.id is null then raise exception 'bz_not_found';end if;
 if r.requested_by is distinct from p_actor_id or not exists(select 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=r.site_id and m.user_id=p_actor_id and m.role<>'viewer') then raise exception 'bz_forbidden';end if;
 if not exists(select 1 from bizoveya_private.generation_stage_runs where generation_run_id=p_generation_id and kind=p_kind) then perform bizoveya_private.check_run_roster(r);end if;
 return bizoveya_private.claim_generation_before_roster(p_generation_id,p_stage_id,p_kind,p_claim,p_actor_id);
end;$$;
create function public.bz_record_generation_request(p_stage_id uuid,p_claim uuid,p_request jsonb) returns void language plpgsql security definer set search_path='' as $$
declare s bizoveya_private.generation_stage_runs%rowtype;r bizoveya_private.generation_runs%rowtype;begin
 perform pg_advisory_xact_lock(817030);select * into s from bizoveya_private.generation_stage_runs where id=p_stage_id for update;
 if s.id is null or s.claim is distinct from p_claim or s.status<>'reserved' or s.provider_started_at is not null then raise exception 'bz_conflict';end if;
 select * into r from bizoveya_private.generation_runs where id=s.generation_run_id;
 if not exists(select 1 from public.bizoveya_sites x join public.bizoveya_memberships m on m.workspace_id=x.workspace_id where x.id=r.site_id and m.user_id=r.requested_by and m.role<>'viewer') then raise exception 'bz_forbidden';end if;
 perform bizoveya_private.check_run_roster(r);perform bizoveya_private.record_generation_before_roster(p_stage_id,p_claim,p_request);
end;$$;
revoke all on function public.bz_site_agent_roster(uuid,uuid),public.bz_save_site_agent_roster(uuid,uuid,jsonb),bizoveya_private.check_run_roster(bizoveya_private.generation_runs),public.bz_admin_authorize_generation(uuid,uuid,text,boolean),public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_record_generation_request(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_site_agent_roster(uuid,uuid),public.bz_save_site_agent_roster(uuid,uuid,jsonb),public.bz_admin_authorize_generation(uuid,uuid,text,boolean) to authenticated;
grant execute on function public.bz_claim_campaign_generation_stage(uuid,uuid,text,uuid,uuid),public.bz_record_generation_request(uuid,uuid,jsonb) to service_role;
alter function public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) rename to begin_generation_before_roster;
revoke all on function bizoveya_private.begin_generation_before_roster(uuid,uuid,text,uuid,uuid) from public,anon,authenticated,service_role;
create function public.bz_begin_campaign_generation_stage(p_generation_id uuid,p_stage_id uuid,p_kind text,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;begin
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.generation_runs where id=p_generation_id for update;
 if r.id is null then raise exception 'bz_not_found';end if;
 if r.requested_by is distinct from p_actor_id or not exists(select 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=r.site_id and m.user_id=p_actor_id and m.role<>'viewer') then raise exception 'bz_forbidden';end if;
 if not exists(select 1 from bizoveya_private.generation_stage_runs where generation_run_id=p_generation_id and kind=p_kind) then perform bizoveya_private.check_run_roster(r);end if;
 return bizoveya_private.begin_generation_before_roster(p_generation_id,p_stage_id,p_kind,p_claim,p_actor_id);
end;$$;
revoke all on function public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_begin_campaign_generation_stage(uuid,uuid,text,uuid,uuid) to service_role;
create or replace function public.bz_admin_generation_queue() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'campaignId',r.campaign_id,'siteId',r.site_id,'title',c.document->>'title','campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,'outputAvailable',r.output_document is not null,'leaseActive',coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false),'stages',coalesce((select jsonb_agg(jsonb_build_object('kind',g.kind,'status',g.status,'spendingState',g.spending_state,'errorCode',g.error_code,'inputTokens',g.input_tokens,'outputTokens',g.output_tokens) order by g.ordinal) from bizoveya_private.generation_stage_runs g where g.generation_run_id=r.id),'[]'::jsonb),'stale',c.version<>r.campaign_version or exists(select 1 from bizoveya_private.site_agent_rosters roster where roster.site_id=r.site_id and (roster.document->'enabled' is distinct from 'true'::jsonb or (r.input_snapshot->>'siteRosterVersion')::integer is distinct from roster.version)) or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s left join bizoveya_private.agent_model_bindings b on b.agent_id=(s->>'agentId')::uuid where b.revision is distinct from (s->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null)) order by r.created_at desc)
 from(select g.* from bizoveya_private.generation_runs g join public.bizoveya_sites s on s.id=g.site_id join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner' where g.requested_by=auth.uid() order by g.created_at desc limit 100)r
 join public.bizoveya_campaigns c on c.id=r.campaign_id left join bizoveya_private.generation_dispatches d on d.generation_id=r.id),'[]'::jsonb);
end;$$;
create or replace function bizoveya_private.onboarding_snapshot(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare snapshot_ jsonb;facts_ jsonb;roles_ jsonb;prefs_ jsonb;begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id);
 select coalesce(jsonb_agg(jsonb_build_object('sourceId',k.id,'sourceVersion',k.version,'title',k.title,'factId',f->>'id','text',f->>'text','approvedAt',k.approved_at) order by k.id,f->>'id'),'[]'::jsonb) into facts_ from public.bz_read_approved_knowledge(p_workspace_id,p_site_id) k cross join lateral jsonb_array_elements(k.facts) f;
 select jsonb_build_object('version',coalesce(p.version,0),'document',coalesce(p.document,'{"brandVoice":"","audience":"","guidance":""}'::jsonb)) into prefs_ from (select 1) n left join public.bizoveya_site_agent_preferences p on p.site_id=p_site_id;
 select jsonb_agg(jsonb_build_object('kind',k.kind,'previewCount',(select count(*) from bizoveya_private.agent_definitions a where a.kind=k.kind and a.preview_version is not null),
 'qualificationFingerprint',(select encode(sha256(convert_to(coalesce(jsonb_agg(jsonb_build_object('agentId',a.id,'previewVersion',a.preview_version,'bindingRevision',b.revision,'agentVersion',b.agent_version,'profileVersion',b.profile_version,'credentialVersion',b.credential_version,'testId',b.test_id,'enabled',b.enabled,'policyVersion',sp.version,'validUntil',sp.document->>'validUntil','policyEnabled',sp.document->>'enabled') order by a.id)::text,'[]'),'UTF8')),'hex') from bizoveya_private.agent_definitions a left join bizoveya_private.agent_model_bindings b on b.agent_id=a.id left join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version where a.kind=k.kind),
 'qualifiedCount',(select count(*) from bizoveya_private.agent_definitions a join bizoveya_private.agent_model_bindings b on b.agent_id=a.id and b.agent_version=a.preview_version and b.enabled join bizoveya_private.model_profile_versions pv on pv.profile_id=b.profile_id and pv.version=b.profile_version join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version where (not exists(select 1 from bizoveya_private.site_agent_rosters team where team.site_id=p_site_id) or exists(select 1 from bizoveya_private.site_agent_rosters team cross join lateral jsonb_array_elements(team.document->'agents') chosen where team.site_id=p_site_id and (chosen->>'agentId')::uuid=a.id and chosen->>'kind'=a.kind and (chosen->>'agentVersion')::integer=a.preview_version)) and a.kind=k.kind and bizoveya_private.binding_issue(b) is null and sp.document->>'enabled'='true' and (sp.document->>'validUntil')::timestamptz>statement_timestamp())) order by k.ord) into roles_ from (values ('coordinator',1),('content',2),('quality',3)) k(kind,ord);
 snapshot_:=jsonb_build_object('schema','agency-onboarding-v1','siteId',p_site_id,'siteTeam',jsonb_build_object('version',coalesce((select version from bizoveya_private.site_agent_rosters where site_id=p_site_id),0),'enabled',(select document->'enabled' from bizoveya_private.site_agent_rosters where site_id=p_site_id)),'facts',facts_,'preferences',prefs_,'catalog',public.bz_site_agent_catalog(p_workspace_id,p_site_id),'roles',roles_,'mode','deterministic-approved-context','executionEnabled',false);
 if octet_length(snapshot_::text)>262144 then raise exception 'bz_onboarding_snapshot_limit';end if;
 return snapshot_;
end;$$;
commit;
