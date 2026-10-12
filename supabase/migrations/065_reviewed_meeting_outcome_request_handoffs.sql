-- One reviewed private outcome -> one private request. No provider, message or publication.
begin;
create table bizoveya_private.meeting_outcome_request_handoffs(
 outcome_id uuid primary key references bizoveya_private.meeting_deliberation_outcomes(id) on delete cascade,
 request_id uuid not null unique references bizoveya_private.agency_records(id) on delete cascade,
 meeting_id uuid not null references bizoveya_private.agency_records(id) on delete cascade,
 snapshot_id uuid not null references bizoveya_private.meeting_execution_snapshots(id) on delete cascade,
 fingerprint text not null check(fingerprint~'^[a-f0-9]{64}$'),instruction text not null,channels jsonb not null,
 review_command jsonb not null,request_command jsonb not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),
 check(request_id<>meeting_id and request_id<>outcome_id and meeting_id<>outcome_id)
);
alter table bizoveya_private.meeting_outcome_request_handoffs enable row level security;
revoke all on bizoveya_private.meeting_outcome_request_handoffs from public,anon,authenticated,service_role;
create trigger meeting_outcome_request_handoff_immutable before update on bizoveya_private.meeting_outcome_request_handoffs for each row execute function bizoveya_private.agency_handoff_immutable();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_outcome_handoff;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_outcome_handoff(p_id)||jsonb_build_object('outcomeHandoff',(
  select jsonb_build_object('outcomeId',h.outcome_id,'snapshotId',h.snapshot_id,'meetingId',h.meeting_id,'requestId',h.request_id,'fingerprint',h.fingerprint,'instruction',h.instruction,'channels',h.channels,'actorId',h.actor_id,'createdAt',h.created_at)
  from bizoveya_private.meeting_outcome_request_handoffs h where h.request_id=p_id or h.meeting_id=p_id));
$$;

alter function public.bz_admin_meeting_execution_queue() set schema bizoveya_private;
alter function bizoveya_private.bz_admin_meeting_execution_queue() rename to admin_meeting_execution_queue_before_handoff;
create function public.bz_admin_meeting_execution_queue() returns jsonb language plpgsql security definer set search_path='' as $$
declare queue_ jsonb;begin perform bizoveya_private.require_admin();queue_:=bizoveya_private.admin_meeting_execution_queue_before_handoff();
 return coalesce((select jsonb_agg(item||jsonb_build_object('outcomeHandoff',case when h.outcome_id is null then null else jsonb_build_object('outcomeId',h.outcome_id,'snapshotId',h.snapshot_id,'meetingId',h.meeting_id,'requestId',h.request_id,'fingerprint',h.fingerprint,'instruction',h.instruction,'channels',h.channels,'actorId',h.actor_id,'createdAt',h.created_at) end) order by item->>'snapshotId')
 from jsonb_array_elements(queue_) item left join bizoveya_private.meeting_deliberation_outcomes o on o.snapshot_id=(item->>'snapshotId')::uuid left join bizoveya_private.meeting_outcome_request_handoffs h on h.outcome_id=o.id),'[]'::jsonb);
end;$$;

create function public.bz_admin_handoff_meeting_outcome(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare outcome_ uuid;request_ uuid;o bizoveya_private.meeting_deliberation_outcomes%rowtype;h bizoveya_private.meeting_outcome_request_handoffs%rowtype;x bizoveya_private.meeting_execution_snapshots%rowtype;p bizoveya_private.meeting_deliberation_plans%rowtype;a bizoveya_private.agency_records%rowtype;workspace_ uuid;request_command_ jsonb;
begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>12000 or (select count(*) from jsonb_object_keys(p_input))<>7 or not(p_input ?& array['action','outcomeId','requestId','fingerprint','instruction','channels','reviewed']) or p_input->>'action'<>'handoff-outcome' or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'outcomeId') is distinct from 'string' or jsonb_typeof(p_input->'requestId') is distinct from 'string' or jsonb_typeof(p_input->'fingerprint') is distinct from 'string' or (p_input->>'fingerprint')!~'^[a-f0-9]{64}$' or not bizoveya_private.valid_visual_text(p_input->'instruction',1400) or (p_input->>'instruction')~'[\x01-\x08\x0B\x0C\x0E-\x1F]' or jsonb_typeof(p_input->'channels') is distinct from 'array' then raise exception 'bz_invalid_meeting_outcome_handoff';end if;
 if jsonb_array_length(p_input->'channels') not between 1 and 3 or (select count(distinct value) from jsonb_array_elements(p_input->'channels'))<>jsonb_array_length(p_input->'channels') or exists(select 1 from jsonb_array_elements(p_input->'channels') e where jsonb_typeof(e) is distinct from 'string' or e#>>'{}' not in('blog','pinterest','linkedin')) then raise exception 'bz_invalid_meeting_outcome_handoff';end if;
 begin outcome_:=(p_input->>'outcomeId')::uuid;request_:=(p_input->>'requestId')::uuid;exception when others then raise exception 'bz_invalid_meeting_outcome_handoff';end;
 if outcome_=request_ then raise exception 'bz_invalid_meeting_outcome_handoff';end if;
 select * into o from bizoveya_private.meeting_deliberation_outcomes where id=outcome_;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=o.snapshot_id;select * into p from bizoveya_private.meeting_deliberation_plans where id=x.plan_id;select * into a from bizoveya_private.agency_records where id=p.meeting_id;
 select workspace_id into workspace_ from public.bizoveya_sites where id=a.site_id;
 if o.id is null or o.actor_id is distinct from auth.uid() or x.actor_id is distinct from auth.uid() or not exists(select 1 from public.bizoveya_memberships m where m.workspace_id=workspace_ and m.user_id=auth.uid() and m.role='owner') then raise exception 'bz_forbidden';end if;
 if a.kind<>'meeting' or a.status<>'decision-recorded' or a.version is distinct from (x.summary->>'meetingVersion')::integer then raise exception 'bz_conflict';end if;
 select * into h from bizoveya_private.meeting_outcome_request_handoffs where outcome_id=o.id;
 if h.outcome_id is not null then if h.request_id=request_ and h.review_command=p_input and h.actor_id=auth.uid() then return public.bz_admin_meeting_execution_queue();end if;raise exception 'bz_conflict';end if;
 if o.fingerprint is distinct from p_input->>'fingerprint' then raise exception 'bz_meeting_outcome_changed';end if;
 if exists(select 1 from bizoveya_private.agency_records where id=request_) then raise exception 'bz_conflict';end if;
 request_command_:=jsonb_build_object('action','request','id',request_,'instruction','Reviewed private meeting outcome follow-up: '||(p_input->>'instruction'),'channels',p_input->'channels','reviewed',true,'inputMode','text');
 perform public.bz_agency_command(workspace_,a.site_id,request_command_);
 insert into bizoveya_private.meeting_outcome_request_handoffs(outcome_id,request_id,meeting_id,snapshot_id,fingerprint,instruction,channels,review_command,request_command,actor_id) values(o.id,request_,a.id,x.id,o.fingerprint,p_input->>'instruction',p_input->'channels',p_input,request_command_,auth.uid());
 return public.bz_admin_meeting_execution_queue();
exception when unique_violation then raise exception 'bz_conflict';end;$$;

revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_outcome_handoff(uuid),bizoveya_private.admin_meeting_execution_queue_before_handoff(),public.bz_admin_meeting_execution_queue(),public.bz_admin_handoff_meeting_outcome(jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_meeting_execution_queue(),public.bz_admin_handoff_meeting_outcome(jsonb) to authenticated;
commit;
