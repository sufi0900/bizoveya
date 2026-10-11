-- Reviewed request -> private campaign handoff. No provider call or generation admission.
begin;
create table bizoveya_private.agency_campaign_handoffs(
 record_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 campaign_id uuid not null unique references public.bizoveya_campaigns(id) on delete cascade,
 source_version integer not null, title text not null, document jsonb not null,
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
alter table bizoveya_private.agency_campaign_handoffs enable row level security;
revoke all on bizoveya_private.agency_campaign_handoffs from public,anon,authenticated,service_role;
create function bizoveya_private.agency_handoff_immutable() returns trigger language plpgsql set search_path='' as $$begin raise exception 'bz_immutable_agency_handoff';end;$$;
create trigger agency_handoff_immutable before update on bizoveya_private.agency_campaign_handoffs for each row execute function bizoveya_private.agency_handoff_immutable();
create or replace function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('id',a.id,'kind',a.kind,'version',a.version,'status',a.status,'document',a.document,'snapshot',a.snapshot,'createdAt',a.created_at,
 'handoff',(select jsonb_build_object('campaignId',h.campaign_id,'sourceVersion',h.source_version,'title',h.title,'document',h.document,'actorId',h.actor_id,'createdAt',h.created_at) from bizoveya_private.agency_campaign_handoffs h where h.record_id=a.id),
 'events',coalesce((select jsonb_agg(jsonb_build_object('version',e.version,'action',e.action,'reason',e.reason,'actorId',e.actor_id,'createdAt',e.created_at) order by e.version) from bizoveya_private.agency_events e where e.record_id=a.id),'[]'::jsonb)) from bizoveya_private.agency_records a where a.id=p_id;
$$;
create function public.bz_handoff_agency_campaign(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;id_ uuid;campaign_ uuid;a bizoveya_private.agency_records%rowtype;h bizoveya_private.agency_campaign_handoffs%rowtype;doc_ jsonb;cur_ public.bizoveya_campaigns%rowtype;begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 then raise exception 'bz_invalid_agency_handoff';end if;
 if (select count(*) from jsonb_object_keys(p_input))<>5 or not(p_input ?& array['id','campaignId','expectedVersion','title','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedVersion')::integer<1 or not bizoveya_private.valid_visual_text(p_input->'title',120) or (p_input->>'title')~'[\x01-\x1F]' or btrim(p_input->>'title') is distinct from p_input->>'title' then raise exception 'bz_invalid_agency_handoff';end if;
 begin id_:=(p_input->>'id')::uuid;campaign_:=(p_input->>'campaignId')::uuid;exception when others then raise exception 'bz_invalid_agency_handoff';end;
 if id_ is null or campaign_ is null then raise exception 'bz_invalid_agency_handoff';end if;
 select * into a from bizoveya_private.agency_records where id=id_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into h from bizoveya_private.agency_campaign_handoffs where record_id=id_;
 if h.record_id is not null then
  if h.campaign_id=campaign_ and h.source_version=(p_input->>'expectedVersion')::integer and h.title=p_input->>'title' then return bizoveya_private.agency_json(id_);end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'request' or a.status<>'proposed' or a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 if a.version>=100 then raise exception 'bz_agency_limit';end if;
 -- Never overwrite an existing campaign, even with a matching UUID/document.
 if exists(select 1 from public.bizoveya_campaigns where id=campaign_) then raise exception 'bz_conflict';end if;
 doc_:=jsonb_build_object('title',p_input->>'title','brief',(a.document->>'instruction')||E'\n\nRequested channel focus: '||(select string_agg(value,', ' order by ord) from jsonb_array_elements_text(a.document->'channels') with ordinality as c(value,ord))||E'.\nUse only current approved site knowledge. Private drafts for human review; do not publish. The existing draft runtime produces Blog, Pinterest and LinkedIn outputs.','blog','','pinterest','','linkedin','');
 select * into cur_ from public.bz_save_campaign(p_workspace_id,p_site_id,campaign_,doc_,0);
 insert into bizoveya_private.agency_campaign_handoffs(record_id,campaign_id,source_version,title,document,actor_id) values(id_,cur_.id,a.version,p_input->>'title',cur_.document,actor_);
 update bizoveya_private.agency_records set version=version+1 where id=id_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(id_,a.version+1,'prepare-campaign','Reviewed private campaign handoff; no generation or publication.',actor_);
 return bizoveya_private.agency_json(id_);
end;$$;
revoke all on function bizoveya_private.agency_handoff_immutable(),bizoveya_private.agency_json(uuid),public.bz_handoff_agency_campaign(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_handoff_agency_campaign(uuid,uuid,jsonb) to authenticated;
commit;
