-- Acknowledged announcement -> one owner-reviewed knowledge draft. Never auto-approve or publish.
begin;
create table bizoveya_private.announcement_knowledge_handoffs(
 meeting_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 source_id uuid not null unique references public.bizoveya_knowledge_sources(id) on delete cascade,
 source_meeting_version integer not null check(source_meeting_version between 1 and 99),
 invitation_roster_version integer not null check(invitation_roster_version between 1 and 50),
 agenda jsonb not null,decision text not null,document jsonb not null,command jsonb not null,
 actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),check(meeting_id<>source_id)
);
alter table bizoveya_private.announcement_knowledge_handoffs enable row level security;
revoke all on bizoveya_private.announcement_knowledge_handoffs from public,anon,authenticated,service_role;
create trigger announcement_knowledge_handoff_immutable before update on bizoveya_private.announcement_knowledge_handoffs for each row execute function bizoveya_private.agency_handoff_immutable();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_announcement_knowledge;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_announcement_knowledge(p_id)||jsonb_build_object('announcementKnowledgeDraft',(
  select jsonb_build_object('meetingId',h.meeting_id,'sourceId',h.source_id,'sourceMeetingVersion',h.source_meeting_version,'rosterVersion',h.invitation_roster_version,'title',h.document->>'title','factCount',jsonb_array_length(h.document->'facts'),'createdUnapproved',true,'currentApproved',k.approved,'sourceVersion',k.version,'actorId',h.actor_id,'createdAt',h.created_at)
  from bizoveya_private.announcement_knowledge_handoffs h join public.bizoveya_knowledge_sources k on k.id=h.source_id where h.meeting_id=p_id));
$$;

create function public.bz_prepare_announcement_knowledge(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;meeting_ uuid;source_ uuid;a bizoveya_private.agency_records%rowtype;b bizoveya_private.meeting_invitation_batches%rowtype;h bizoveya_private.announcement_knowledge_handoffs%rowtype;decision_ text;created_ public.bizoveya_knowledge_sources%rowtype;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>180000 or (select count(*) from jsonb_object_keys(p_input))<>6 or not(p_input ?& array['action','meetingId','sourceId','expectedVersion','document','reviewed']) or p_input->>'action'<>'prepare-announcement-knowledge' or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'meetingId') is distinct from 'string' or jsonb_typeof(p_input->'sourceId') is distinct from 'string' or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,2}$' or (p_input->>'expectedVersion')::integer not between 1 and 99 or not bizoveya_private.valid_knowledge_document(p_input->'document') or jsonb_array_length(p_input#>'{document,facts}')<1 then raise exception 'bz_invalid_announcement_knowledge';end if;
 begin meeting_:=(p_input->>'meetingId')::uuid;source_:=(p_input->>'sourceId')::uuid;exception when others then raise exception 'bz_invalid_announcement_knowledge';end;
 if meeting_=source_ then raise exception 'bz_invalid_announcement_knowledge';end if;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into h from bizoveya_private.announcement_knowledge_handoffs where meeting_id=meeting_;
 if h.meeting_id is not null then
  if h.source_id=source_ and h.source_meeting_version=(p_input->>'expectedVersion')::integer and h.document=p_input->'document' and h.command=p_input and h.actor_id=actor_ then return bizoveya_private.agency_json(meeting_);end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'meeting' or a.status<>'decision-recorded' or a.document->>'mode'<>'announcement' then raise exception 'bz_announcement_required';end if;
 if a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 select * into b from bizoveya_private.meeting_invitation_batches where meeting_id=meeting_;
 if b.meeting_id is null or exists(select 1 from bizoveya_private.meeting_participant_invitations i where i.meeting_id=meeting_ and (i.state<>'acknowledged' or i.responded_at is null)) or (select count(*) from bizoveya_private.meeting_participant_invitations i where i.meeting_id=meeting_)<>jsonb_array_length(a.document->'participants') then raise exception 'bz_meeting_receipts_required';end if;
 select reason into decision_ from bizoveya_private.agency_events where record_id=meeting_ and action='accept-decision' order by version desc limit 1;
 if decision_ is null then raise exception 'bz_announcement_required';end if;
 select * into created_ from public.bz_mutate_knowledge(p_workspace_id,p_site_id,source_,'save',p_input->'document',0);
 if created_.id is null or created_.approved or created_.version<>1 then raise exception 'bz_announcement_knowledge_unconfirmed';end if;
 insert into bizoveya_private.announcement_knowledge_handoffs(meeting_id,source_id,source_meeting_version,invitation_roster_version,agenda,decision,document,command,actor_id) values(meeting_,source_,a.version,b.roster_version,a.document,decision_,p_input->'document',p_input,actor_);
 update bizoveya_private.agency_records set version=version+1 where id=meeting_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(meeting_,a.version+1,'prepare-knowledge-draft','Acknowledged announcement saved as an unapproved knowledge draft; owner approval remains separate.',actor_);
 return bizoveya_private.agency_json(meeting_);
exception when unique_violation then raise exception 'bz_conflict';end;$$;

revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_announcement_knowledge(uuid),public.bz_prepare_announcement_knowledge(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_announcement_knowledge(uuid,uuid,jsonb) to authenticated;
commit;
