-- Grounded deterministic onboarding assessment; no agent activation, provider or budget reservation.
begin;
create table bizoveya_private.agency_onboarding_reviews(
 site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 version integer not null check(version between 1 and 50),fingerprint text not null,
 snapshot jsonb not null,note text not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),primary key(site_id,version)
);
alter table bizoveya_private.agency_onboarding_reviews enable row level security;
revoke all on bizoveya_private.agency_onboarding_reviews from public,anon,authenticated,service_role;
create function bizoveya_private.onboarding_immutable() returns trigger language plpgsql set search_path='' as $$begin raise exception 'bz_immutable_onboarding_review';end;$$;
create trigger onboarding_immutable before update on bizoveya_private.agency_onboarding_reviews for each row execute function bizoveya_private.onboarding_immutable();
create function bizoveya_private.onboarding_snapshot(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare snapshot_ jsonb;facts_ jsonb;roles_ jsonb;prefs_ jsonb;begin
 perform bizoveya_private.media_actor(p_workspace_id,p_site_id);
 select coalesce(jsonb_agg(jsonb_build_object('sourceId',k.id,'sourceVersion',k.version,'title',k.title,'factId',f->>'id','text',f->>'text','approvedAt',k.approved_at) order by k.id,f->>'id'),'[]'::jsonb) into facts_ from public.bz_read_approved_knowledge(p_workspace_id,p_site_id) k cross join lateral jsonb_array_elements(k.facts) f;
 select jsonb_build_object('version',coalesce(p.version,0),'document',coalesce(p.document,'{"brandVoice":"","audience":"","guidance":""}'::jsonb)) into prefs_ from (select 1) n left join public.bizoveya_site_agent_preferences p on p.site_id=p_site_id;
 select jsonb_agg(jsonb_build_object('kind',k.kind,'previewCount',(select count(*) from bizoveya_private.agent_definitions a where a.kind=k.kind and a.preview_version is not null),
 'qualificationFingerprint',(select encode(sha256(convert_to(coalesce(jsonb_agg(jsonb_build_object('agentId',a.id,'previewVersion',a.preview_version,'bindingRevision',b.revision,'agentVersion',b.agent_version,'profileVersion',b.profile_version,'credentialVersion',b.credential_version,'testId',b.test_id,'enabled',b.enabled,'policyVersion',sp.version,'validUntil',sp.document->>'validUntil','policyEnabled',sp.document->>'enabled') order by a.id)::text,'[]'),'UTF8')),'hex') from bizoveya_private.agent_definitions a left join bizoveya_private.agent_model_bindings b on b.agent_id=a.id left join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version where a.kind=k.kind),
 'qualifiedCount',(select count(*) from bizoveya_private.agent_definitions a join bizoveya_private.agent_model_bindings b on b.agent_id=a.id and b.agent_version=a.preview_version and b.enabled join bizoveya_private.model_profile_versions pv on pv.profile_id=b.profile_id and pv.version=b.profile_version join bizoveya_private.spending_policies sp on sp.profile_id=b.profile_id and sp.profile_version=b.profile_version where a.kind=k.kind and bizoveya_private.binding_issue(b) is null and sp.document->>'enabled'='true' and (sp.document->>'validUntil')::timestamptz>statement_timestamp())) order by k.ord) into roles_ from (values ('coordinator',1),('content',2),('quality',3)) k(kind,ord);
 snapshot_:=jsonb_build_object('schema','agency-onboarding-v1','siteId',p_site_id,'facts',facts_,'preferences',prefs_,'catalog',public.bz_site_agent_catalog(p_workspace_id,p_site_id),'roles',roles_,'mode','deterministic-approved-context','executionEnabled',false);
 if octet_length(snapshot_::text)>262144 then raise exception 'bz_onboarding_snapshot_limit';end if;
 return snapshot_;
end;$$;
create function public.bz_agency_onboarding(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare snapshot_ jsonb;latest_ jsonb;begin
 snapshot_:=bizoveya_private.onboarding_snapshot(p_workspace_id,p_site_id);
 select jsonb_build_object('version',r.version,'fingerprint',r.fingerprint,'snapshot',r.snapshot,'note',r.note,'actorId',r.actor_id,'createdAt',r.created_at) into latest_ from bizoveya_private.agency_onboarding_reviews r where site_id=p_site_id order by version desc limit 1;
 return jsonb_build_object('current',snapshot_,'fingerprint',encode(sha256(convert_to(snapshot_::text,'UTF8')),'hex'),'latest',latest_,'history',coalesce((select jsonb_agg(jsonb_build_object('version',r.version,'fingerprint',r.fingerprint,'note',r.note,'actorId',r.actor_id,'createdAt',r.created_at) order by r.version desc) from bizoveya_private.agency_onboarding_reviews r where site_id=p_site_id),'[]'::jsonb));
end;$$;
create function public.bz_review_agency_onboarding(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;snapshot_ jsonb;hash_ text;old_ bizoveya_private.agency_onboarding_reviews%rowtype;expected_ integer;begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>4000 then raise exception 'bz_invalid_onboarding_review';end if;
 if (select count(*) from jsonb_object_keys(p_input))<>4 or not(p_input ?& array['fingerprint','expectedVersion','note','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'fingerprint') is distinct from 'string' or (p_input->>'fingerprint')!~'^[a-f0-9]{64}$' or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or not bizoveya_private.valid_visual_text(p_input->'note',500) or (p_input->>'note')~'[\x01-\x08\x0B\x0C\x0E-\x1F]' then raise exception 'bz_invalid_onboarding_review';end if;
 expected_:=(p_input->>'expectedVersion')::integer;if expected_>50 then raise exception 'bz_invalid_onboarding_review';end if;
 select * into old_ from bizoveya_private.agency_onboarding_reviews where site_id=p_site_id order by version desc limit 1;
 -- An exact lost-response retry does not create another review or grant new authority.
 if old_.version in(expected_,expected_+1) and old_.actor_id=actor_ and old_.fingerprint=p_input->>'fingerprint' and old_.note=p_input->>'note' then return public.bz_agency_onboarding(p_workspace_id,p_site_id);end if;
 if coalesce(old_.version,0) is distinct from expected_ then raise exception 'bz_conflict';end if;
 if coalesce(old_.version,0)>=50 then raise exception 'bz_onboarding_limit';end if;
 snapshot_:=bizoveya_private.onboarding_snapshot(p_workspace_id,p_site_id);hash_:=encode(sha256(convert_to(snapshot_::text,'UTF8')),'hex');
 if hash_ is distinct from p_input->>'fingerprint' then raise exception 'bz_onboarding_changed';end if;
 insert into bizoveya_private.agency_onboarding_reviews(site_id,version,fingerprint,snapshot,note,actor_id) values(p_site_id,expected_+1,hash_,snapshot_,p_input->>'note',actor_);
 return public.bz_agency_onboarding(p_workspace_id,p_site_id);
end;$$;
revoke all on function bizoveya_private.onboarding_immutable(),bizoveya_private.onboarding_snapshot(uuid,uuid),public.bz_agency_onboarding(uuid,uuid),public.bz_review_agency_onboarding(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_agency_onboarding(uuid,uuid),public.bz_review_agency_onboarding(uuid,uuid,jsonb) to authenticated;
commit;
