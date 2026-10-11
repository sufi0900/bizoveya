-- Durable owner planning/meeting decisions only; no worker, provider, publication or automatic knowledge change.
begin;
create table bizoveya_private.agency_records(
 id uuid primary key,site_id uuid not null references public.bizoveya_sites(id) on delete cascade,
 kind text not null check(kind in('request','meeting')),version integer not null default 1 check(version between 1 and 100),
 status text not null default 'proposed' check(status in('proposed','decision-recorded','deferred','cancelled')),
 document jsonb not null,snapshot jsonb not null,created_at timestamptz not null default clock_timestamp()
);
create table bizoveya_private.agency_events(
 record_id uuid not null references bizoveya_private.agency_records(id) on delete cascade,version integer not null,
 action text not null,reason text,actor_id uuid not null,created_at timestamptz not null default clock_timestamp(),primary key(record_id,version)
);
alter table bizoveya_private.agency_records enable row level security;
alter table bizoveya_private.agency_events enable row level security;
revoke all on bizoveya_private.agency_records,bizoveya_private.agency_events from public,anon,authenticated,service_role;
create function bizoveya_private.agency_json(p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('id',a.id,'kind',a.kind,'version',a.version,'status',a.status,'document',a.document,'snapshot',a.snapshot,'createdAt',a.created_at,'events',coalesce((select jsonb_agg(jsonb_build_object('version',e.version,'action',e.action,'reason',e.reason,'actorId',e.actor_id,'createdAt',e.created_at) order by e.version) from bizoveya_private.agency_events e where e.record_id=a.id),'[]'::jsonb)) from bizoveya_private.agency_records a where a.id=p_id;
$$;
create function public.bz_agency_inventory(p_workspace_id uuid,p_site_id uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin perform bizoveya_private.media_actor(p_workspace_id,p_site_id);return coalesce((select jsonb_agg(bizoveya_private.agency_json(a.id) order by a.created_at desc,a.id) from bizoveya_private.agency_records a where a.site_id=p_site_id),'[]'::jsonb);end;$$;
create function public.bz_agency_command(p_workspace_id uuid,p_site_id uuid,p_command jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare actor_ uuid;action_ text;id_ uuid;a bizoveya_private.agency_records%rowtype;snapshot_ jsonb;list_ jsonb;field_ text;next_ integer;begin
 actor_:=bizoveya_private.media_actor(p_workspace_id,p_site_id,true);
 perform 1 from public.bizoveya_memberships where workspace_id=p_workspace_id and user_id=actor_ and role='owner' for share;
 if not found then raise exception 'bz_forbidden';end if;
 if p_command is null or jsonb_typeof(p_command) is distinct from 'object' or octet_length(p_command::text)>12000 or p_command->'reviewed' is distinct from 'true'::jsonb then raise exception 'bz_invalid_agency_command';end if;
 action_:=p_command->>'action';begin id_:=(p_command->>'id')::uuid;exception when others then raise exception 'bz_invalid_agency_command';end;if id_ is null then raise exception 'bz_invalid_agency_command';end if;
 -- Same site lock protects quota, new IDs and current approved-source snapshot against site removal.
 perform 1 from public.bizoveya_sites where id=p_site_id and workspace_id=p_workspace_id for update;
 select * into a from bizoveya_private.agency_records where id=id_ for update;
 if action_ in('request','meeting') then
  if a.id is not null then
   if a.site_id=p_site_id and a.document=p_command then return bizoveya_private.agency_json(id_);end if;
   raise exception 'bz_conflict';
  end if;
  if (select count(*) from bizoveya_private.agency_records where site_id=p_site_id)>=64 then raise exception 'bz_agency_limit';end if;
  if p_command->>'inputMode' is null or p_command->>'inputMode' not in('text','corrected-transcript') then raise exception 'bz_invalid_agency_command';end if;
  if action_='request' then
   field_:='instruction';list_:=p_command->'channels';
   if (select count(*) from jsonb_object_keys(p_command))<>6 or not(p_command ?& array['action','id','instruction','channels','reviewed','inputMode']) then raise exception 'bz_invalid_agency_command';end if;
  else
   field_:='agenda';list_:=p_command->'participants';
   if (select count(*) from jsonb_object_keys(p_command))<>7 or not(p_command ?& array['action','id','agenda','mode','participants','reviewed','inputMode']) or p_command->>'mode' is null or p_command->>'mode' not in('announcement','deliberation') then raise exception 'bz_invalid_agency_command';end if;
  end if;
  if not bizoveya_private.valid_visual_text(p_command->field_,2000) or (p_command->>field_)~'[\x01-\x08\x0B\x0C\x0E-\x1F]' or jsonb_typeof(list_) is distinct from 'array' then raise exception 'bz_invalid_agency_command';end if;
  if jsonb_array_length(list_) not between 1 and 3 or (select count(distinct value) from jsonb_array_elements(list_))<>jsonb_array_length(list_) or exists(select 1 from jsonb_array_elements(list_) e where jsonb_typeof(e) is distinct from 'string' or (action_='request' and e#>>'{}' not in('blog','pinterest','linkedin')) or (action_='meeting' and e#>>'{}' not in('coordinator','content','quality'))) then raise exception 'bz_invalid_agency_command';end if;
  snapshot_:=jsonb_build_object('runtimeEnabled',false,'providerCalls',0,'catalog',public.bz_site_agent_catalog(p_workspace_id,p_site_id),'approvedSources',(select coalesce(jsonb_agg(to_jsonb(k)),'[]'::jsonb) from public.bz_read_approved_knowledge(p_workspace_id,p_site_id) k),'preferences',(select to_jsonb(p) from public.bizoveya_site_agent_preferences p where p.site_id=p_site_id),'boundary','Proposal only. Specialist execution, meeting attendance, acknowledgements, voice capture and external actions have not occurred.');
  if octet_length(snapshot_::text)>262144 then raise exception 'bz_agency_snapshot_limit';end if;
  insert into bizoveya_private.agency_records(id,site_id,kind,document,snapshot) values(id_,p_site_id,action_,p_command,snapshot_);
  next_:=1;
 else
  if action_ is null or action_ not in('accept-decision','defer','cancel') or (select count(*) from jsonb_object_keys(p_command))<>5 or not(p_command ?& array['action','id','expectedVersion','reason','reviewed']) or jsonb_typeof(p_command->'expectedVersion') is distinct from 'number' or (p_command->>'expectedVersion')!~'^[0-9]{1,3}$' or not bizoveya_private.valid_visual_text(p_command->'reason',500) or (p_command->>'reason')~'[\x01-\x08\x0B\x0C\x0E-\x1F]' then raise exception 'bz_invalid_agency_command';end if;
  if a.id is null or a.site_id<>p_site_id then raise exception 'bz_agency_unavailable';end if;
  if a.version is distinct from (p_command->>'expectedVersion')::integer or a.status='cancelled' then raise exception 'bz_conflict';end if;
  if a.version>=100 then raise exception 'bz_agency_limit';end if;
  if action_='accept-decision' and a.kind<>'meeting' then raise exception 'bz_invalid_agency_command';end if;
  next_:=a.version+1;
  update bizoveya_private.agency_records set version=next_,status=case action_ when 'accept-decision' then 'decision-recorded' when 'defer' then 'deferred' else 'cancelled' end where id=id_;
 end if;
 insert into bizoveya_private.agency_events(record_id,version,action,reason,actor_id) values(id_,next_,action_,p_command->>'reason',actor_);
 return bizoveya_private.agency_json(id_);
end;$$;
revoke all on function bizoveya_private.agency_json(uuid),public.bz_agency_inventory(uuid,uuid),public.bz_agency_command(uuid,uuid,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.bz_agency_inventory(uuid,uuid),public.bz_agency_command(uuid,uuid,jsonb) to authenticated;
commit;
