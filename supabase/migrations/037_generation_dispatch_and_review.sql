-- P04.3.3.5: explicit founder-owner dispatch and private human review. No activation.
begin;
create table bizoveya_private.generation_dispatches(
 generation_id uuid primary key references bizoveya_private.generation_runs(id) on delete cascade,
 claim uuid not null,actor_id uuid references auth.users(id),reason text not null,
 expires_at timestamptz not null,finished_at timestamptz,result text,attempt integer not null default 1
);
create table bizoveya_private.generation_dispatch_events(
 id uuid primary key default gen_random_uuid(),generation_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 actor_id uuid references auth.users(id),reason text not null,occurred_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.generation_reviews(
 id uuid primary key default gen_random_uuid(),generation_id uuid not null references bizoveya_private.generation_runs(id) on delete cascade,
 version integer not null,decision text not null check(decision in('accepted','changes_requested')),reason text not null,
 actor_id uuid references auth.users(id),occurred_at timestamptz not null default clock_timestamp(),unique(generation_id,version)
);
alter table bizoveya_private.generation_dispatches enable row level security;
alter table bizoveya_private.generation_reviews enable row level security;
alter table bizoveya_private.generation_dispatch_events enable row level security;
revoke all on bizoveya_private.generation_dispatches,bizoveya_private.generation_reviews,bizoveya_private.generation_dispatch_events from public,anon,authenticated,service_role;
create function public.bz_admin_generation_queue() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'campaignId',r.campaign_id,'siteId',r.site_id,'title',c.document->>'title','campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,'outputAvailable',r.output_document is not null,'leaseActive',coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false),'stale',c.version<>r.campaign_version or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s left join bizoveya_private.agent_model_bindings b on b.agent_id=(s->>'agentId')::uuid where b.revision is distinct from (s->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null)) order by r.created_at desc)
 from(select g.* from bizoveya_private.generation_runs g join public.bizoveya_sites s on s.id=g.site_id join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner' where g.requested_by=auth.uid() order by g.created_at desc limit 100)r
 join public.bizoveya_campaigns c on c.id=r.campaign_id left join bizoveya_private.generation_dispatches d on d.generation_id=r.id),'[]'::jsonb);
end;$$;
create function public.bz_admin_authorize_generation(p_id uuid,p_claim uuid,p_reason text,p_reviewed boolean) returns void language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;d bizoveya_private.generation_dispatches%rowtype;begin
 perform bizoveya_private.require_admin();
 if p_claim is null or p_reviewed is distinct from true or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_generation';end if;
 perform pg_advisory_xact_lock(817030);select * into r from bizoveya_private.generation_runs where id=p_id for update;
 if r.id is null or r.requested_by is distinct from auth.uid() or not exists(select 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=r.site_id and m.user_id=auth.uid() and m.role='owner') then raise exception 'bz_forbidden' using errcode='42501';end if;
 if r.status not in('prepared','running') then raise exception 'bz_generation_finished';end if;
 if exists(select 1 from public.bizoveya_campaigns c where c.id=r.campaign_id and c.version<>r.campaign_version) or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s left join bizoveya_private.agent_model_bindings b on b.agent_id=(s->>'agentId')::uuid where b.revision is distinct from (s->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null) then raise exception 'bz_generation_stale';end if;
 select * into d from bizoveya_private.generation_dispatches where generation_id=r.id;
 if d.generation_id is not null and d.finished_at is null and d.expires_at>statement_timestamp() then raise exception 'bz_generation_busy';end if;
 insert into bizoveya_private.generation_dispatches(generation_id,claim,actor_id,reason,expires_at) values(r.id,p_claim,auth.uid(),btrim(p_reason),clock_timestamp()+interval '120 seconds') on conflict(generation_id) do update set claim=excluded.claim,actor_id=excluded.actor_id,reason=excluded.reason,expires_at=excluded.expires_at,finished_at=null,result=null,attempt=bizoveya_private.generation_dispatches.attempt+1;
 insert into bizoveya_private.generation_dispatch_events(generation_id,actor_id,reason) values(r.id,auth.uid(),btrim(p_reason));
end;$$;
create function public.bz_finish_generation_dispatch(p_id uuid,p_claim uuid,p_result text) returns void language plpgsql security definer set search_path='' as $$
begin
 if p_result is null or p_result not in('completed_for_human_review','failed','already_claimed','blocked') then raise exception 'bz_invalid_generation';end if;
 update bizoveya_private.generation_dispatches set finished_at=coalesce(finished_at,clock_timestamp()),result=p_result where generation_id=p_id and claim=p_claim;
 if not found then raise exception 'bz_conflict';end if;
end;$$;
create function public.bz_campaign_generation_outputs(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid()) then raise exception 'bz_forbidden' using errcode='42501';end if;
 if not exists(select 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id) then raise exception 'bz_not_found';end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'campaignId',r.campaign_id,'campaignVersion',r.campaign_version,'status',r.status,'output',r.output_document,'reviews',coalesce((select jsonb_agg(jsonb_build_object('version',v.version,'decision',v.decision,'reason',v.reason,'occurredAt',v.occurred_at) order by v.version desc) from bizoveya_private.generation_reviews v where v.generation_id=r.id),'[]'::jsonb)) order by r.created_at desc) from(select * from bizoveya_private.generation_runs where site_id=p_site_id and output_document is not null order by created_at desc limit 100)r),'[]'::jsonb);
end;$$;
create function public.bz_review_campaign_generation(p_workspace_id uuid,p_site_id uuid,p_id uuid,p_expected_version integer,p_decision text,p_reason text) returns void language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.generation_runs%rowtype;v integer;begin
 if not exists(select 1 from public.bizoveya_sites s join public.bizoveya_memberships m on m.workspace_id=s.workspace_id where s.id=p_site_id and s.workspace_id=p_workspace_id and m.user_id=auth.uid() and m.role='owner') then raise exception 'bz_forbidden' using errcode='42501';end if;
 if p_expected_version is null or p_decision not in('accepted','changes_requested') or p_decision is null or length(btrim(coalesce(p_reason,''))) not between 10 and 300 or p_reason ~ '[\x01-\x1F]' then raise exception 'bz_invalid_generation';end if;
 select * into r from bizoveya_private.generation_runs where id=p_id and site_id=p_site_id for update;
 if r.id is null or r.status<>'succeeded' or r.output_document is null then raise exception 'bz_generation_finished';end if;
 select coalesce(max(version),0) into v from bizoveya_private.generation_reviews where generation_id=r.id;
 if v>=100 then raise exception 'bz_review_limit';end if;
 if v<>p_expected_version then raise exception 'bz_conflict';end if;
 if p_decision='accepted' and ((r.output_document#>>'{stages,quality,approved}') is distinct from 'true' or exists(select 1 from jsonb_array_elements(r.output_document#>'{stages,quality,issues}') i where i->>'severity'='blocker')) then raise exception 'bz_quality_blocked';end if;
 insert into bizoveya_private.generation_reviews(generation_id,version,decision,reason,actor_id) values(r.id,v+1,p_decision,btrim(p_reason),auth.uid());
 -- Acceptance is a review record only. Never writes campaign drafts or publishes.
end;$$;
revoke all on function public.bz_admin_generation_queue(),public.bz_admin_authorize_generation(uuid,uuid,text,boolean),public.bz_finish_generation_dispatch(uuid,uuid,text),public.bz_campaign_generation_outputs(uuid,uuid),public.bz_review_campaign_generation(uuid,uuid,uuid,integer,text,text) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_generation_queue(),public.bz_admin_authorize_generation(uuid,uuid,text,boolean),public.bz_campaign_generation_outputs(uuid,uuid),public.bz_review_campaign_generation(uuid,uuid,uuid,integer,text,text) to authenticated;
grant execute on function public.bz_finish_generation_dispatch(uuid,uuid,text) to service_role;
commit;
