-- Expiring, revocable founder-admin consent only. No worker, reservation or provider call.
begin;
create table bizoveya_private.meeting_execution_consents(
 id uuid primary key,snapshot_id uuid not null references bizoveya_private.meeting_execution_snapshots(id) on delete cascade,
 command jsonb not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),expires_at timestamptz not null,
 revoked_at timestamptz,revocation_reason text,
 check(expires_at>created_at and expires_at<=created_at+interval '15 minutes'),
 check((revoked_at is null and revocation_reason is null) or (revoked_at is not null and revocation_reason is not null and length(revocation_reason) between 10 and 300))
);
create index meeting_execution_consent_snapshot_idx on bizoveya_private.meeting_execution_consents(snapshot_id,created_at desc);
create table bizoveya_private.meeting_execution_consent_events(
 consent_id uuid not null references bizoveya_private.meeting_execution_consents(id) on delete cascade,
 version integer not null check(version between 1 and 2),action text not null check(action in('consent','revoke')),
 reason text not null,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),primary key(consent_id,version)
);
alter table bizoveya_private.meeting_execution_consents enable row level security;
alter table bizoveya_private.meeting_execution_consent_events enable row level security;
revoke all on bizoveya_private.meeting_execution_consents,bizoveya_private.meeting_execution_consent_events from public,anon,authenticated,service_role;
create function bizoveya_private.guard_meeting_consent_update() returns trigger language plpgsql set search_path='' as $$begin
 if old.revoked_at is not null or new.id<>old.id or new.snapshot_id<>old.snapshot_id or new.command<>old.command or new.actor_id<>old.actor_id or new.created_at<>old.created_at or new.expires_at<>old.expires_at or new.revoked_at is null then raise exception 'bz_immutable_meeting_consent';end if;return new;
end;$$;
create trigger meeting_consent_immutable before update on bizoveya_private.meeting_execution_consents for each row execute function bizoveya_private.guard_meeting_consent_update();
create trigger meeting_consent_event_immutable before update on bizoveya_private.meeting_execution_consent_events for each row execute function bizoveya_private.agency_handoff_immutable();

create function bizoveya_private.meeting_consent_json(p_snapshot_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'snapshotId',c.snapshot_id,'actorId',c.actor_id,'reason',c.command->>'reason','createdAt',c.created_at,'expiresAt',c.expires_at,'revokedAt',c.revoked_at,'revocationReason',c.revocation_reason,
 'state',case when c.revoked_at is not null then 'revoked' when c.expires_at<=statement_timestamp() then 'expired' else 'active' end,
 'events',(select jsonb_agg(jsonb_build_object('version',e.version,'action',e.action,'reason',e.reason,'actorId',e.actor_id,'createdAt',e.created_at) order by e.version) from bizoveya_private.meeting_execution_consent_events e where e.consent_id=c.id)) order by c.created_at desc,c.id),'[]'::jsonb) from bizoveya_private.meeting_execution_consents c where c.snapshot_id=p_snapshot_id;
$$;
alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_meeting_consent;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_meeting_consent(p_id)||jsonb_build_object('meetingExecutionConsents',coalesce((select bizoveya_private.meeting_consent_json(x.id) from bizoveya_private.meeting_execution_snapshots x join bizoveya_private.meeting_deliberation_plans p on p.id=x.plan_id where p.meeting_id=p_id),'[]'::jsonb));
$$;

create function public.bz_admin_meeting_execution_queue() returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform bizoveya_private.require_admin();
 return coalesce((select jsonb_agg(jsonb_build_object('snapshotId',x.id,'fingerprint',x.fingerprint,'summary',x.summary,'meetingId',a.id,'agenda',a.document->>'agenda','meetingVersion',a.version,'scheduleVersion',s.version,
 'blocked',a.status<>'decision-recorded' or a.version is distinct from (x.summary->>'meetingVersion')::integer or s.state is distinct from 'ready' or s.version is distinct from (x.summary->>'scheduleVersion')::integer or r.document->'enabled' is distinct from 'true'::jsonb or r.version is distinct from (x.summary->>'rosterVersion')::integer,
 'consents',bizoveya_private.meeting_consent_json(x.id)) order by x.created_at desc,x.id)
 from (select snap.* from bizoveya_private.meeting_execution_snapshots snap join bizoveya_private.meeting_deliberation_plans dp on dp.id=snap.plan_id join bizoveya_private.agency_records ar on ar.id=dp.meeting_id join public.bizoveya_sites site on site.id=ar.site_id join public.bizoveya_memberships m on m.workspace_id=site.workspace_id and m.user_id=auth.uid() and m.role='owner' where snap.actor_id=auth.uid() order by snap.created_at desc,snap.id limit 50)x
 join bizoveya_private.meeting_deliberation_plans p on p.id=x.plan_id join bizoveya_private.agency_records a on a.id=p.meeting_id
 left join bizoveya_private.meeting_deliberation_schedules s on s.plan_id=p.id left join bizoveya_private.site_agent_rosters r on r.site_id=a.site_id),'[]'::jsonb);
end;$$;

create function public.bz_admin_consent_meeting_execution(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare snapshot_ uuid;consent_ uuid;x bizoveya_private.meeting_execution_snapshots%rowtype;c bizoveya_private.meeting_execution_consents%rowtype;candidate_ jsonb;p bizoveya_private.meeting_deliberation_plans%rowtype;a bizoveya_private.agency_records%rowtype;workspace_ uuid;now_ timestamptz;
begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>8 or not(p_input ?& array['snapshotId','consentId','expectedMeetingVersion','expectedScheduleVersion','expectedRosterVersion','fingerprint','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb then raise exception 'bz_invalid_meeting_consent';end if;
 if jsonb_typeof(p_input->'snapshotId') is distinct from 'string' or jsonb_typeof(p_input->'consentId') is distinct from 'string' or jsonb_typeof(p_input->'fingerprint') is distinct from 'string' or (p_input->>'fingerprint')!~'^[a-f0-9]{64}$' or jsonb_typeof(p_input->'reason') is distinct from 'string' or length(p_input->>'reason') not between 10 and 300 or btrim(p_input->>'reason')<>(p_input->>'reason') or (p_input->>'reason')~'[[:cntrl:]]' then raise exception 'bz_invalid_meeting_consent';end if;
 if jsonb_typeof(p_input->'expectedMeetingVersion') is distinct from 'number' or jsonb_typeof(p_input->'expectedScheduleVersion') is distinct from 'number' or jsonb_typeof(p_input->'expectedRosterVersion') is distinct from 'number' or (p_input->>'expectedMeetingVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedScheduleVersion')!~'^[0-9]{1,3}$' or (p_input->>'expectedRosterVersion')!~'^[0-9]{1,2}$' or (p_input->>'expectedMeetingVersion')::integer not between 1 and 100 or (p_input->>'expectedScheduleVersion')::integer not between 1 and 100 or (p_input->>'expectedRosterVersion')::integer not between 1 and 50 then raise exception 'bz_invalid_meeting_consent';end if;
 begin snapshot_:=(p_input->>'snapshotId')::uuid;consent_:=(p_input->>'consentId')::uuid;exception when others then raise exception 'bz_invalid_meeting_consent';end;
 if snapshot_=consent_ then raise exception 'bz_invalid_meeting_consent';end if;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=snapshot_;select * into p from bizoveya_private.meeting_deliberation_plans where id=x.plan_id;select * into a from bizoveya_private.agency_records where id=p.meeting_id;
 select workspace_id into workspace_ from public.bizoveya_sites where id=a.site_id;
 if x.id is null or x.actor_id is distinct from auth.uid() then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_memberships where workspace_id=workspace_ and user_id=auth.uid() and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=a.site_id for update;
 select * into c from bizoveya_private.meeting_execution_consents where id=consent_;
 if c.id is not null then if c.snapshot_id=x.id and c.actor_id=auth.uid() and c.command=p_input then return public.bz_admin_meeting_execution_queue();end if;raise exception 'bz_conflict';end if;
 if x.fingerprint is distinct from p_input->>'fingerprint' or (x.summary->>'rosterVersion')::integer is distinct from (p_input->>'expectedRosterVersion')::integer then raise exception 'bz_conflict';end if;
 candidate_:=bizoveya_private.deliberation_execution_candidate(workspace_,a.site_id,a.id,p.id,(p_input->>'expectedMeetingVersion')::integer,(p_input->>'expectedScheduleVersion')::integer);
 if candidate_->>'fingerprint' is distinct from x.fingerprint then raise exception 'bz_meeting_snapshot_changed';end if;
 if exists(select 1 from bizoveya_private.meeting_execution_consents where snapshot_id=x.id and revoked_at is null and expires_at>statement_timestamp()) then raise exception 'bz_meeting_consent_active';end if;
 if (select count(*) from bizoveya_private.meeting_execution_consents where snapshot_id=x.id)>=25 then raise exception 'bz_meeting_consent_limit';end if;
 now_:=clock_timestamp();insert into bizoveya_private.meeting_execution_consents(id,snapshot_id,command,actor_id,created_at,expires_at) values(consent_,x.id,p_input,auth.uid(),now_,now_+interval '15 minutes');
 insert into bizoveya_private.meeting_execution_consent_events(consent_id,version,action,reason,actor_id,created_at) values(consent_,1,'consent',p_input->>'reason',auth.uid(),now_);
 return public.bz_admin_meeting_execution_queue();
exception when unique_violation then raise exception 'bz_conflict';end;$$;

create function public.bz_admin_revoke_meeting_execution(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare consent_ uuid;c bizoveya_private.meeting_execution_consents%rowtype;x bizoveya_private.meeting_execution_snapshots%rowtype;site_ uuid;workspace_ uuid;
begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;if not found then raise exception 'bz_admin_forbidden';end if;
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or (select count(*) from jsonb_object_keys(p_input))<>3 or not(p_input ?& array['consentId','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'consentId') is distinct from 'string' or jsonb_typeof(p_input->'reason') is distinct from 'string' or length(p_input->>'reason') not between 10 and 300 or btrim(p_input->>'reason')<>(p_input->>'reason') or (p_input->>'reason')~'[[:cntrl:]]' then raise exception 'bz_invalid_meeting_consent';end if;
 begin consent_:=(p_input->>'consentId')::uuid;exception when others then raise exception 'bz_invalid_meeting_consent';end;
 select * into c from bizoveya_private.meeting_execution_consents where id=consent_;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=c.snapshot_id;
 select a.site_id,s.workspace_id into site_,workspace_ from bizoveya_private.meeting_deliberation_plans p join bizoveya_private.agency_records a on a.id=p.meeting_id join public.bizoveya_sites s on s.id=a.site_id where p.id=x.plan_id;
 if c.id is null or c.actor_id is distinct from auth.uid() or x.actor_id is distinct from auth.uid() then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_memberships where workspace_id=workspace_ and user_id=auth.uid() and role='owner' for share;if not found then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_sites where id=site_ for update;
 select * into c from bizoveya_private.meeting_execution_consents where id=consent_ for update;
 if c.revoked_at is not null then if c.revocation_reason=p_input->>'reason' then return public.bz_admin_meeting_execution_queue();end if;raise exception 'bz_conflict';end if;
 -- Revocation requires no live qualification, ready schedule or unexpired consent.
 update bizoveya_private.meeting_execution_consents set revoked_at=clock_timestamp(),revocation_reason=p_input->>'reason' where id=c.id;
 insert into bizoveya_private.meeting_execution_consent_events(consent_id,version,action,reason,actor_id) values(c.id,2,'revoke',p_input->>'reason',auth.uid());
 return public.bz_admin_meeting_execution_queue();
end;$$;
revoke all on function bizoveya_private.guard_meeting_consent_update(),bizoveya_private.meeting_consent_json(uuid),bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_meeting_consent(uuid),public.bz_admin_meeting_execution_queue(),public.bz_admin_consent_meeting_execution(jsonb),public.bz_admin_revoke_meeting_execution(jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_meeting_execution_queue(),public.bz_admin_consent_meeting_execution(jsonb),public.bz_admin_revoke_meeting_execution(jsonb) to authenticated;
commit;
