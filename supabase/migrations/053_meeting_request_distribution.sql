-- Reviewed meeting decision -> one private request. No attendance, provider or publishing side effects.
begin;
create table bizoveya_private.meeting_request_distributions(
 meeting_id uuid primary key references bizoveya_private.agency_records(id) on delete cascade,
 request_id uuid not null unique references bizoveya_private.agency_records(id) on delete cascade,
 source_version integer not null check(source_version between 1 and 99),
 agenda jsonb not null, decision text not null, instruction text not null, command jsonb not null,
 actor_id uuid not null, created_at timestamptz not null default clock_timestamp(),
 check(meeting_id<>request_id)
);
alter table bizoveya_private.meeting_request_distributions enable row level security;
revoke all on bizoveya_private.meeting_request_distributions from public,anon,authenticated,service_role;
create trigger meeting_request_distribution_immutable before update on bizoveya_private.meeting_request_distributions for each row execute function bizoveya_private.agency_handoff_immutable();

alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_distribution;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_distribution(p_id)||jsonb_build_object(
 'meetingDistribution',(select jsonb_build_object('meetingId',h.meeting_id,'requestId',h.request_id,'sourceVersion',h.source_version,'agenda',h.agenda,'decision',h.decision,'instruction',h.instruction,'command',h.command,'actorId',h.actor_id,'createdAt',h.created_at) from bizoveya_private.meeting_request_distributions h where h.meeting_id=p_id or h.request_id=p_id));
$$;

create function public.bz_distribute_meeting_request(p_workspace_id uuid,p_site_id uuid,p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;meeting_ uuid;request_ uuid;a bizoveya_private.agency_records%rowtype;h bizoveya_private.meeting_request_distributions%rowtype;decision_ text;command_ jsonb;
begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;if not found then raise exception 'bz_not_found';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>12000 then raise exception 'bz_invalid_meeting_distribution';end if;
 if (select count(*) from jsonb_object_keys(p_input))<>6 or not(p_input ?& array['id','requestId','expectedVersion','instruction','channels','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'expectedVersion') is distinct from 'number' or (p_input->>'expectedVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedVersion')::integer not between 1 and 99 then raise exception 'bz_invalid_meeting_distribution';end if;
 begin meeting_:=(p_input->>'id')::uuid;request_:=(p_input->>'requestId')::uuid;exception when others then raise exception 'bz_invalid_meeting_distribution';end;
 if meeting_ is null or request_ is null or meeting_=request_ then raise exception 'bz_invalid_meeting_distribution';end if;
 if not bizoveya_private.valid_visual_text(p_input->'instruction',1400) or (p_input->>'instruction')~'[\x01-\x08\x0B\x0C\x0E-\x1F]' or jsonb_typeof(p_input->'channels') is distinct from 'array' then raise exception 'bz_invalid_meeting_distribution';end if;
 if jsonb_array_length(p_input->'channels') not between 1 and 3 or (select count(distinct value) from jsonb_array_elements(p_input->'channels'))<>jsonb_array_length(p_input->'channels') or exists(select 1 from jsonb_array_elements(p_input->'channels') e where jsonb_typeof(e) is distinct from 'string' or e#>>'{}' not in('blog','pinterest','linkedin')) then raise exception 'bz_invalid_meeting_distribution';end if;
 select * into a from bizoveya_private.agency_records where id=meeting_ for update;
 if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
 select * into h from bizoveya_private.meeting_request_distributions where meeting_id=meeting_;
 if h.meeting_id is not null then
  if h.request_id=request_ and h.source_version=(p_input->>'expectedVersion')::integer and h.instruction=p_input->>'instruction' and h.command->'channels'=p_input->'channels' and h.actor_id=actor_ then return jsonb_build_object('meeting',bizoveya_private.agency_json(meeting_),'request',bizoveya_private.agency_json(request_));end if;
  raise exception 'bz_conflict';
 end if;
 if a.kind<>'meeting' or a.status<>'decision-recorded' then raise exception 'bz_meeting_decision_required';end if;
 if a.version is distinct from (p_input->>'expectedVersion')::integer then raise exception 'bz_conflict';end if;
 if a.version>=100 then raise exception 'bz_agency_limit';end if;
 select reason into decision_ from bizoveya_private.agency_events where record_id=meeting_ and version=a.version and action='accept-decision';
 if decision_ is null then raise exception 'bz_meeting_decision_required';end if;
 command_:=jsonb_build_object('action','request','id',request_,'instruction','Reviewed meeting decision: '||decision_||E'\n\nRequested task: '||(p_input->>'instruction'),'channels',p_input->'channels','reviewed',true,'inputMode','text');
 if exists(select 1 from bizoveya_private.agency_records where id=request_) then raise exception 'bz_conflict';end if;
 perform public.bz_agency_command(p_workspace_id,p_site_id,command_);
 insert into bizoveya_private.meeting_request_distributions(meeting_id,request_id,source_version,agenda,decision,instruction,command,actor_id) values(meeting_,request_,a.version,a.document,decision_,p_input->>'instruction',command_,actor_);
 update bizoveya_private.agency_records set version=version+1 where id=meeting_;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(meeting_,a.version+1,'distribute-request','Reviewed decision distributed as one private draft request; no agent attendance or provider call.',actor_);
 return jsonb_build_object('meeting',bizoveya_private.agency_json(meeting_),'request',bizoveya_private.agency_json(request_));
end;$$;
revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_distribution(uuid),public.bz_distribute_meeting_request(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_distribute_meeting_request(uuid,uuid,jsonb) to authenticated;
commit;
