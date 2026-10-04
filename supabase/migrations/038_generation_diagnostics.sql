-- Read-only diagnostics; retains admin MFA, requester and workspace-owner isolation.
begin;
create or replace function public.bz_admin_generation_queue() returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'campaignId',r.campaign_id,'siteId',r.site_id,'title',c.document->>'title','campaignVersion',r.campaign_version,'status',r.status,'createdAt',r.created_at,'outputAvailable',r.output_document is not null,'leaseActive',coalesce(d.finished_at is null and d.expires_at>statement_timestamp(),false),'stages',coalesce((select jsonb_agg(jsonb_build_object('kind',g.kind,'status',g.status,'spendingState',g.spending_state,'errorCode',g.error_code,'inputTokens',g.input_tokens,'outputTokens',g.output_tokens) order by g.ordinal) from bizoveya_private.generation_stage_runs g where g.generation_run_id=r.id),'[]'::jsonb),'stale',c.version<>r.campaign_version or exists(select 1 from jsonb_array_elements(r.input_snapshot->'stages') s left join bizoveya_private.agent_model_bindings b on b.agent_id=(s->>'agentId')::uuid where b.revision is distinct from (s->>'bindingRevision')::integer or bizoveya_private.binding_issue(b) is not null)) order by r.created_at desc)
 from(select g.* from bizoveya_private.generation_runs g join public.bizoveya_sites s on s.id=g.site_id join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner' where g.requested_by=auth.uid() order by g.created_at desc limit 100)r
 join public.bizoveya_campaigns c on c.id=r.campaign_id left join bizoveya_private.generation_dispatches d on d.generation_id=r.id),'[]'::jsonb);
end;$$;

commit;
