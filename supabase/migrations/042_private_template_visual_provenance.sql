-- P04.3.4.3d: atomically copy a creator-private recipe and pinned identity into a visual artifact.
begin;
create or replace function bizoveya_private.valid_visual_document(p_document jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare base_ jsonb;templates_ jsonb;item jsonb;reference_ jsonb;recipe_ jsonb;begin
 if p_document is null or jsonb_typeof(p_document) is distinct from 'object' or octet_length(p_document::text)>24000 then return false;end if;
 if p_document->>'schema'='campaign-visuals-v1' then return bizoveya_private.valid_visual_document_v1(p_document);end if;
 if p_document->>'schema' not in ('campaign-visuals-v2','campaign-visuals-v3') then return false;end if;
 if p_document->>'schema'='campaign-visuals-v2' and ((select count(*) from jsonb_object_keys(p_document))<>6 or not(p_document ?& array['schema','brand','pins','slides','templates','linkedin'])) then return false;end if;
 if p_document->>'schema'='campaign-visuals-v3' then
  if (select count(*) from jsonb_object_keys(p_document))<>8 or not(p_document ?& array['schema','brand','pins','slides','templates','linkedin','templateReference','templateRecipe']) then return false;end if;
  reference_:=p_document->'templateReference';recipe_:=p_document->'templateRecipe';
  if jsonb_typeof(reference_) is distinct from 'object' or (select count(*) from jsonb_object_keys(reference_))<>3 or not(reference_ ?& array['templateId','version','renderer']) then return false;end if;
  begin perform (reference_->>'templateId')::uuid;exception when others then return false;end;
  if (reference_->>'version')!~ '^[1-9][0-9]*$' or (reference_->>'version')::integer not between 1 and 50 or reference_->>'renderer' is distinct from 'campaign-scenes-v2' then return false;end if;
  if not bizoveya_private.valid_template_recipe(recipe_) or reference_->>'renderer' is distinct from recipe_->>'renderer' then return false;end if;
 end if;
 base_:=(p_document-'templates'-'linkedin'-'templateReference'-'templateRecipe')||jsonb_build_object('schema','campaign-visuals-v1');
 if not bizoveya_private.valid_visual_document_v1(base_) then return false;end if;
 templates_:=p_document->'templates';
 if jsonb_typeof(templates_) is distinct from 'object' or (select count(*) from jsonb_object_keys(templates_))<>3 or not(templates_ ?& array['pins','carousel','linkedin']) or jsonb_typeof(templates_->'pins') is distinct from 'array' or jsonb_array_length(templates_->'pins')<>2 then return false;end if;
 for item in select value from jsonb_array_elements(templates_->'pins') union all select templates_->'carousel' union all select templates_->'linkedin' loop
  if jsonb_typeof(item) is distinct from 'string' or (item#>>'{}') not in ('classic','midnight','editorial','headline') then return false;end if;
 end loop;
 item:=p_document->'linkedin';
 if jsonb_typeof(item) is distinct from 'object' or (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',100) or not bizoveya_private.valid_visual_text(item->'body',420) then return false;end if;
 return true;
end;$$;

create function bizoveya_private.save_campaign_visual_internal(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid,p_expected_version integer,p_source_review_version integer,p_document jsonb,p_reviewed boolean,p_allow_new_provenance boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare role_ text;r bizoveya_private.generation_runs%rowtype;review_ bizoveya_private.generation_reviews%rowtype;v bizoveya_private.campaign_visuals%rowtype;begin
 select role into role_ from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=auth.uid() for share;
 if role_ is distinct from 'owner' then raise exception 'bz_forbidden' using errcode='42501';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for share;if not found then raise exception 'bz_not_found';end if;
 if p_expected_version is null or p_expected_version<0 or p_source_review_version is null or p_source_review_version<1 or p_reviewed is distinct from true or not bizoveya_private.valid_visual_document(p_document) then raise exception 'bz_invalid_visual';end if;
 select * into r from bizoveya_private.generation_runs where id=p_generation_id and site_id=p_site_id for update;
 if r.id is null then raise exception 'bz_not_found';end if;
 if r.status<>'succeeded' or r.output_document is null or (r.output_document#>>'{stages,quality,approved}') is distinct from 'true' or exists(select 1 from jsonb_array_elements(coalesce(r.output_document#>'{stages,quality,issues}','[]'::jsonb)) i where i->>'severity'='blocker') then raise exception 'bz_visual_source_unaccepted';end if;
 select * into review_ from bizoveya_private.generation_reviews where generation_id=r.id order by version desc limit 1;
 if review_.decision is distinct from 'accepted' or review_.version is distinct from p_source_review_version then raise exception 'bz_visual_source_unaccepted';end if;
 select * into v from bizoveya_private.campaign_visuals where generation_id=r.id for update;
 if coalesce(v.version,0)<>p_expected_version then raise exception 'bz_conflict';end if;
 if p_document->>'schema'='campaign-visuals-v3' and not p_allow_new_provenance and (v.document->>'schema' is distinct from 'campaign-visuals-v3' or v.document->'templateReference' is distinct from p_document->'templateReference' or v.document->'templateRecipe' is distinct from p_document->'templateRecipe') then raise exception 'bz_invalid_visual';end if;
 if v.document=p_document and v.source_review_version=p_source_review_version then return public.bz_campaign_visual(p_workspace_id,p_site_id,p_generation_id);end if;
 if coalesce(v.version,0)>=50 then raise exception 'bz_visual_limit';end if;
 insert into bizoveya_private.campaign_visuals(generation_id,version,source_review_version,document,updated_by) values(r.id,coalesce(v.version,0)+1,p_source_review_version,p_document,auth.uid()) on conflict(generation_id) do update set version=excluded.version,source_review_version=excluded.source_review_version,document=excluded.document,updated_at=clock_timestamp(),updated_by=auth.uid();
 insert into bizoveya_private.campaign_visual_revisions(generation_id,version,source_review_version,document,actor_id) values(r.id,coalesce(v.version,0)+1,p_source_review_version,p_document,auth.uid());
 return public.bz_campaign_visual(p_workspace_id,p_site_id,p_generation_id);
end;$$;
create or replace function public.bz_save_campaign_visual(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid,p_expected_version integer,p_source_review_version integer,p_document jsonb,p_reviewed boolean) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.save_campaign_visual_internal(p_workspace_id,p_site_id,p_generation_id,p_expected_version,p_source_review_version,p_document,p_reviewed,false);
$$;

create function public.bz_apply_private_template_to_visual(p_workspace_id uuid,p_site_id uuid,p_generation_id uuid,p_expected_version integer,p_source_review_version integer,p_template_id uuid,p_template_version integer,p_document jsonb,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;recipe_ jsonb;next_ jsonb;begin
 actor_:=bizoveya_private.template_actor();
 if p_template_id is null or p_template_version is null or p_template_version not between 1 and 50 or p_document->>'schema' is distinct from 'campaign-visuals-v2' or not bizoveya_private.valid_visual_document(p_document) then raise exception 'bz_invalid_template';end if;
 select v.recipe into recipe_ from bizoveya_private.private_templates t join bizoveya_private.private_template_versions v on v.template_id=t.id and v.version=p_template_version where t.id=p_template_id and t.creator_id=actor_ and not t.archived for share of t;
 if recipe_ is null then raise exception 'bz_template_unavailable';end if;
 next_:=(p_document-'schema'-'brand'-'templates')||jsonb_build_object('schema','campaign-visuals-v3','brand',recipe_->'brand','templates',recipe_->'templates','templateReference',jsonb_build_object('templateId',p_template_id,'version',p_template_version,'renderer',recipe_->>'renderer'),'templateRecipe',recipe_);
 if not bizoveya_private.valid_visual_document(next_) then raise exception 'bz_invalid_visual';end if;
 return bizoveya_private.save_campaign_visual_internal(p_workspace_id,p_site_id,p_generation_id,p_expected_version,p_source_review_version,next_,p_reviewed,true);
end;$$;
revoke all on function bizoveya_private.save_campaign_visual_internal(uuid,uuid,uuid,integer,integer,jsonb,boolean,boolean) from public,anon,authenticated,service_role;
revoke all on function public.bz_apply_private_template_to_visual(uuid,uuid,uuid,integer,integer,uuid,integer,jsonb,boolean) from public,anon,authenticated,service_role;
grant execute on function public.bz_apply_private_template_to_visual(uuid,uuid,uuid,integer,integer,uuid,integer,jsonb,boolean) to authenticated;
commit;
