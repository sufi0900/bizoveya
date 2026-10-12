-- Explicit interrupted-turn recovery and immutable snapshot closure. No provider retries.
begin;
create table bizoveya_private.meeting_recovery_receipts(
 id uuid primary key, snapshot_id uuid not null references bizoveya_private.meeting_execution_snapshots(id) on delete cascade,
 turn_id uuid references bizoveya_private.meeting_turn_runs(id) on delete cascade,
 action text not null check(action in('recover-turn','close-meeting')), state text not null check(state in('preflight_failed','accounting_required','completed','stopped')),
 command jsonb not null, actor_id uuid not null, created_at timestamptz not null default clock_timestamp()
);
create unique index meeting_recovery_turn_once on bizoveya_private.meeting_recovery_receipts(turn_id) where action='recover-turn';
create unique index meeting_closure_once on bizoveya_private.meeting_recovery_receipts(snapshot_id) where action='close-meeting';
alter table bizoveya_private.meeting_recovery_receipts enable row level security;
revoke all on bizoveya_private.meeting_recovery_receipts from public,anon,authenticated,service_role;
create trigger meeting_recovery_immutable before update on bizoveya_private.meeting_recovery_receipts for each row execute function bizoveya_private.agency_handoff_immutable();

alter function public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) set schema bizoveya_private;
alter function bizoveya_private.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) rename to begin_meeting_turn_before_closure;
create function public.bz_begin_meeting_turn(p_snapshot_id uuid,p_consent_id uuid,p_turn_id uuid,p_ordinal integer,p_claim uuid,p_actor_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform pg_advisory_xact_lock(817030);
 if exists(select 1 from bizoveya_private.meeting_recovery_receipts where snapshot_id=p_snapshot_id and action='close-meeting') then raise exception 'bz_meeting_closed';end if;
 return bizoveya_private.begin_meeting_turn_before_closure(p_snapshot_id,p_consent_id,p_turn_id,p_ordinal,p_claim,p_actor_id);
end;$$;

alter function public.bz_admin_meeting_execution_queue() set schema bizoveya_private;
alter function bizoveya_private.bz_admin_meeting_execution_queue() rename to admin_meeting_queue_before_recovery;
create function public.bz_admin_meeting_execution_queue() returns jsonb language plpgsql security definer set search_path='' as $$declare q jsonb;begin
 perform bizoveya_private.require_admin();q:=bizoveya_private.admin_meeting_queue_before_recovery();
 return coalesce((select jsonb_agg(item||jsonb_build_object('blocked',(item->>'blocked')::boolean or exists(select 1 from bizoveya_private.meeting_recovery_receipts where snapshot_id=(item->>'snapshotId')::uuid and action='close-meeting'),'completion',case when exists(select 1 from bizoveya_private.meeting_recovery_receipts where snapshot_id=(item->>'snapshotId')::uuid and action='close-meeting' and state='stopped') then jsonb_set(item->'completion','{state}','"cancelled"'::jsonb) else item->'completion' end,'recoveryReceipts',coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'snapshotId',r.snapshot_id,'turnId',r.turn_id,'action',r.action,'state',r.state,'reason',r.command->>'reason','actorId',r.actor_id,'createdAt',r.created_at) order by r.created_at,r.id) from bizoveya_private.meeting_recovery_receipts r where r.snapshot_id=(item->>'snapshotId')::uuid),'[]'::jsonb))) from jsonb_array_elements(q)item),'[]'::jsonb);
end;$$;

create function public.bz_admin_recover_meeting(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare x bizoveya_private.meeting_execution_snapshots%rowtype;r bizoveya_private.meeting_turn_runs%rowtype;saved bizoveya_private.meeting_recovery_receipts%rowtype;snapshot_ uuid;operation_ uuid;turn_ uuid;workspace_ uuid;state_ text;expected_keys integer;
begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 if p_input is null or jsonb_typeof(p_input) is distinct from 'object' or octet_length(p_input::text)>2000 or p_input->>'action' not in('recover-turn','close-meeting') or jsonb_typeof(p_input->'action') is distinct from 'string' then raise exception 'bz_invalid_meeting_recovery';end if;
 expected_keys:=case when p_input->>'action'='recover-turn' then 6 else 5 end;
 if (select count(*) from jsonb_object_keys(p_input))<>expected_keys or not(p_input ?& array['action','snapshotId','operationId','reason','reviewed']) or p_input->'reviewed' is distinct from 'true'::jsonb or jsonb_typeof(p_input->'snapshotId') is distinct from 'string' or jsonb_typeof(p_input->'operationId') is distinct from 'string' or jsonb_typeof(p_input->'reason') is distinct from 'string' or length(p_input->>'reason') not between 10 and 300 or btrim(p_input->>'reason')<>p_input->>'reason' or (p_input->>'reason')~'[[:cntrl:]]' then raise exception 'bz_invalid_meeting_recovery';end if;
 begin snapshot_:=(p_input->>'snapshotId')::uuid;operation_:=(p_input->>'operationId')::uuid;
 if p_input->>'action'='recover-turn' then if jsonb_typeof(p_input->'turnId') is distinct from 'string' then raise exception 'invalid';end if;turn_:=(p_input->>'turnId')::uuid;end if;
 exception when others then raise exception 'bz_invalid_meeting_recovery';end;
 if snapshot_=operation_ or turn_=operation_ or turn_=snapshot_ then raise exception 'bz_invalid_meeting_recovery';end if;
 select * into x from bizoveya_private.meeting_execution_snapshots where id=snapshot_;
 select site.workspace_id into workspace_ from bizoveya_private.meeting_deliberation_plans p join bizoveya_private.agency_records a on a.id=p.meeting_id join public.bizoveya_sites site on site.id=a.site_id where p.id=x.plan_id;
 if x.id is null or x.actor_id is distinct from auth.uid() or not exists(select 1 from public.bizoveya_memberships where workspace_id=workspace_ and user_id=auth.uid() and role='owner') then raise exception 'bz_forbidden';end if;
 perform 1 from public.bizoveya_memberships where workspace_id=workspace_ and user_id=auth.uid() and role='owner' for share;
 if not found then raise exception 'bz_forbidden';end if;
 perform 1 from bizoveya_private.platform_admins where user_id=auth.uid() for share;
 if not found then raise exception 'bz_forbidden';end if;
 select * into saved from bizoveya_private.meeting_recovery_receipts where id=operation_;
 if saved.id is not null then if saved.command=p_input and saved.actor_id=auth.uid() then return public.bz_admin_meeting_execution_queue();end if;raise exception 'bz_conflict';end if;
 if exists(select 1 from bizoveya_private.meeting_recovery_receipts where snapshot_id=x.id and action='close-meeting') then raise exception 'bz_meeting_closed';end if;
 if p_input->>'action'='recover-turn' then
  select * into r from bizoveya_private.meeting_turn_runs where id=turn_ and snapshot_id=x.id for update;
  if r.id is null or r.actor_id is distinct from auth.uid() or r.status<>'reserved' or r.spending_state<>'reserved' then raise exception 'bz_conflict';end if;
  if r.created_at>statement_timestamp()-interval '90 seconds' then raise exception 'bz_meeting_turn_active';end if;
  if r.provider_started_at is null then perform public.bz_cancel_unstarted_meeting_turn(r.id,r.claim);state_:='preflight_failed';
  else update bizoveya_private.meeting_turn_runs set status='failed',spending_state='unknown',error_code='interrupted_provider_outcome',finished_at=clock_timestamp() where id=r.id;
   insert into bizoveya_private.meeting_turn_spending_events(turn_id,action,amount_micros,actor_id,reason) values(r.id,'unknown',r.charged_micros,auth.uid(),p_input->>'reason');state_:='accounting_required';
  end if;
 else
  if exists(select 1 from bizoveya_private.meeting_turn_runs where snapshot_id=x.id and (status='reserved' or spending_state not in('settled','reconciled'))) then raise exception 'bz_spending_unresolved';end if;
  state_:=case when bizoveya_private.meeting_deliberation_outcome_candidate(x.id) is not null then 'completed' else 'stopped' end;
 end if;
 insert into bizoveya_private.meeting_recovery_receipts(id,snapshot_id,turn_id,action,state,command,actor_id) values(operation_,x.id,turn_,p_input->>'action',state_,p_input,auth.uid());
 return public.bz_admin_meeting_execution_queue();
 exception when unique_violation then raise exception 'bz_conflict';end;$$;
revoke all on function bizoveya_private.begin_meeting_turn_before_closure(uuid,uuid,uuid,integer,uuid,uuid),bizoveya_private.admin_meeting_queue_before_recovery(),public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid),public.bz_admin_meeting_execution_queue(),public.bz_admin_recover_meeting(jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_begin_meeting_turn(uuid,uuid,uuid,integer,uuid,uuid) to service_role;
grant execute on function public.bz_admin_meeting_execution_queue(),public.bz_admin_recover_meeting(jsonb) to authenticated;
alter function bizoveya_private.agency_json(uuid) rename to agency_json_before_recovery;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select bizoveya_private.agency_json_before_recovery(p_id)||jsonb_build_object('meetingClosures',coalesce((select jsonb_agg(jsonb_build_object('snapshotId',r.snapshot_id,'state',r.state,'createdAt',r.created_at) order by r.created_at,r.id) from bizoveya_private.meeting_recovery_receipts r join bizoveya_private.meeting_execution_snapshots x on x.id=r.snapshot_id join bizoveya_private.meeting_deliberation_plans p on p.id=x.plan_id where p.meeting_id=p_id and r.action='close-meeting'),'[]'::jsonb));
$$;
revoke all on function bizoveya_private.agency_json(uuid),bizoveya_private.agency_json_before_recovery(uuid) from public,anon,authenticated,service_role;

alter function public.bz_admin_consent_meeting_execution(jsonb) set schema bizoveya_private;
alter function bizoveya_private.bz_admin_consent_meeting_execution(jsonb) rename to consent_meeting_before_closure;
create function public.bz_admin_consent_meeting_execution(p_input jsonb) returns jsonb language plpgsql security definer set search_path='' as $$begin
 perform pg_advisory_xact_lock(817030);perform bizoveya_private.require_admin();
 if exists(select 1 from bizoveya_private.meeting_recovery_receipts where snapshot_id::text=p_input->>'snapshotId' and action='close-meeting') then raise exception 'bz_meeting_closed';end if;
 return bizoveya_private.consent_meeting_before_closure(p_input);end;$$;
revoke all on function bizoveya_private.consent_meeting_before_closure(jsonb),public.bz_admin_consent_meeting_execution(jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_admin_consent_meeting_execution(jsonb) to authenticated;
alter function public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer) set schema bizoveya_private;
alter function bizoveya_private.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer) rename to finish_meeting_turn_before_recovery;
create function public.bz_finish_meeting_turn_execution(p_turn_id uuid,p_claim uuid,p_result jsonb,p_error_code text,p_input_tokens integer,p_output_tokens integer) returns void language plpgsql security definer set search_path='' as $$begin
 perform pg_advisory_xact_lock(817030);
 if exists(select 1 from bizoveya_private.meeting_recovery_receipts where turn_id=p_turn_id and action='recover-turn') then raise exception 'bz_meeting_turn_recovered';end if;
 perform bizoveya_private.finish_meeting_turn_before_recovery(p_turn_id,p_claim,p_result,p_error_code,p_input_tokens,p_output_tokens);end;$$;
revoke all on function bizoveya_private.finish_meeting_turn_before_recovery(uuid,uuid,jsonb,text,integer,integer),public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer) from public,anon,authenticated,service_role;
grant execute on function public.bz_finish_meeting_turn_execution(uuid,uuid,jsonb,text,integer,integer) to service_role;
commit;
