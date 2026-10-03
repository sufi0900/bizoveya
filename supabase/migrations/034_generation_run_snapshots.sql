-- P04.3.3 checkpoint 2: immutable, private generation preparation.
-- This migration makes no provider call, spending reservation, visual composition or publication.
begin;
create table bizoveya_private.generation_runs(
 id uuid primary key,campaign_id uuid not null references public.bizoveya_campaigns(id) on delete cascade,
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,campaign_version integer not null check(campaign_version>0),
 status text not null check(status in('prepared','running','succeeded','failed','cancelled')),
 input_snapshot jsonb not null,output_document jsonb,error_code text,
 requested_by uuid references auth.users(id) on delete set null,created_at timestamptz not null default clock_timestamp(),started_at timestamptz,finished_at timestamptz,
 check((status='prepared' and started_at is null and finished_at is null and output_document is null and error_code is null) or status<>'prepared')
);
create index generation_runs_site_created_idx on bizoveya_private.generation_runs(site_id,created_at desc);
alter table bizoveya_private.generation_runs enable row level security;
revoke all on bizoveya_private.generation_runs from public,anon,authenticated,service_role;

create function public.bz_campaign_generation_history(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid();if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id;if not found then raise exception 'bz_not_found';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'campaignId',r.campaign_id,'campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,'startedAt',r.started_at,'finishedAt',r.finished_at,'stageCount',jsonb_array_length(r.input_snapshot->'stages'),'outputAvailable',r.output_document is not null) order by r.created_at desc) from (select * from bizoveya_private.generation_runs where site_id=p_site_id order by created_at desc limit 100)r),'[]'::jsonb);
end;$$;

create function public.bz_prepare_campaign_generation(p_workspace_id uuid,p_site_id uuid,p_campaign_id uuid,p_expected_campaign_version integer,p_run_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare role_ text;c public.bizoveya_campaigns%rowtype;prefs public.bizoveya_site_agent_preferences%rowtype;knowledge jsonb;stages jsonb;snapshot jsonb;existing bizoveya_private.generation_runs%rowtype;
begin
 select role into role_ from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if role_ is null or role_='viewer' then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for share;if not found then raise exception 'bz_not_found';end if;
 if p_run_id is null or p_campaign_id is null then raise exception 'bz_invalid_generation';end if;
 select * into existing from bizoveya_private.generation_runs where id=p_run_id;
 if existing.id is not null then
  if existing.site_id<>p_site_id or existing.campaign_id<>p_campaign_id or existing.campaign_version<>p_expected_campaign_version then raise exception 'bz_conflict';end if;
  return jsonb_build_object('id',existing.id,'campaignId',existing.campaign_id,'campaignVersion',existing.campaign_version,'status',existing.status,'createdAt',existing.created_at,'startedAt',existing.started_at,'finishedAt',existing.finished_at,'stageCount',jsonb_array_length(existing.input_snapshot->'stages'),'outputAvailable',existing.output_document is not null);
 end if;
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
 where a.kind in('coordinator','content','quality') and bizoveya_private.binding_issue(b) is null and sp.document->>'enabled'='true' and (sp.document->>'validUntil')::timestamptz>statement_timestamp();
 if jsonb_array_length(knowledge)=0 or jsonb_array_length(stages)<>3 or (select count(distinct value->>'kind') from jsonb_array_elements(stages))<>3 then raise exception 'bz_generation_not_ready';end if;
 snapshot:=jsonb_build_object('schema','campaign-generation-input-v1','campaign',jsonb_build_object('id',c.id,'version',c.version,'document',c.document),'preferences',jsonb_build_object('version',coalesce(prefs.version,0),'document',coalesce(prefs.document,'{"brandVoice":"","audience":"","guidance":""}'::jsonb)),'knowledge',knowledge,'stages',stages,'limits',jsonb_build_object('maxStages',3,'maxAttemptsPerStage',1,'publish',false,'externalTools',false));
 insert into bizoveya_private.generation_runs(id,campaign_id,site_id,campaign_version,status,input_snapshot,requested_by) values(p_run_id,c.id,p_site_id,c.version,'prepared',snapshot,auth.uid()) returning * into existing;
 return jsonb_build_object('id',existing.id,'campaignId',existing.campaign_id,'campaignVersion',existing.campaign_version,'status',existing.status,'createdAt',existing.created_at,'startedAt',existing.started_at,'finishedAt',existing.finished_at,'stageCount',jsonb_array_length(existing.input_snapshot->'stages'),'outputAvailable',false);
end;$$;
revoke all on function public.bz_campaign_generation_history(uuid,uuid),public.bz_prepare_campaign_generation(uuid,uuid,uuid,integer,uuid) from public,anon,authenticated,service_role;
grant execute on function public.bz_campaign_generation_history(uuid,uuid),public.bz_prepare_campaign_generation(uuid,uuid,uuid,integer,uuid) to authenticated;
commit;
