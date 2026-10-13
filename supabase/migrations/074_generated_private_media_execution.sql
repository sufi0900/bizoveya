-- Turn 3/5: retry-safe generated artwork storage in the existing private media library.
-- Provider calls remain server-side and optional; this migration stores no prompts or credentials.
begin;

create or replace function bizoveya_private.valid_private_media_descriptor(p jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare rights_ jsonb;provenance_ jsonb;begin
 if p is null or jsonb_typeof(p) is distinct from 'object' or octet_length(p::text)>3072 then return false;end if;
 if p->>'schema'='private-media-descriptor-v1' then
  if (select count(*) from jsonb_object_keys(p))<>9 or not(p ?& array['schema','mime','bytes','width','height','sha256','alt','origin','rights']) or p->>'origin'<>'user-upload' then return false;end if;
 elsif p->>'schema'='private-media-descriptor-v2' then
  if (select count(*) from jsonb_object_keys(p))<>10 or not(p ?& array['schema','mime','bytes','width','height','sha256','alt','origin','rights','provenance']) or p->>'origin'<>'ai-generated' then return false;end if;
 else return false;end if;
 if p->>'mime' not in('image/png','image/jpeg') or (p->>'bytes')!~'^[0-9]+$' or (p->>'bytes')::bigint not between 1 and 5242880 then return false;end if;
 if (p->>'width')!~'^[0-9]+$' or (p->>'height')!~'^[0-9]+$' or (p->>'width')::bigint not between 1 and 4096 or (p->>'height')::bigint not between 1 and 4096 or (p->>'width')::bigint*(p->>'height')::bigint>12000000 then return false;end if;
 if (p->>'sha256')!~'^[a-f0-9]{64}$' or not bizoveya_private.valid_visual_text(p->'alt',300) or (p->>'alt')~'[\x01-\x1F]' then return false;end if;
 rights_:=p->'rights';
 if jsonb_typeof(rights_) is distinct from 'object' or (select count(*) from jsonb_object_keys(rights_))<>3 or not(rights_ ?& array['basis','evidence','attested']) or not bizoveya_private.valid_visual_text(rights_->'evidence',500) or (rights_->>'evidence')~'[\x01-\x1F]' then return false;end if;
 if p->>'schema'='private-media-descriptor-v1' then
  if rights_->>'basis' not in('own-work','licensed','permission') or rights_->'attested' is distinct from 'true'::jsonb then return false;end if;
 else
  if rights_->>'basis'<>'provider-output' or rights_->'attested' is distinct from 'false'::jsonb then return false;end if;
  provenance_:=p->'provenance';
  if jsonb_typeof(provenance_) is distinct from 'object' or (select count(*) from jsonb_object_keys(provenance_))<>4 or not(provenance_ ?& array['requestId','provider','modelId','promptHash']) or provenance_->>'provider' not in('gemini','openai') or provenance_->>'modelId'!~'^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$' or provenance_->>'promptHash'!~'^[a-f0-9]{64}$' then return false;end if;
  perform (provenance_->>'requestId')::uuid;if provenance_->>'requestId' is null then return false;end if;
 end if;
 return true;exception when others then return false;end;$$;

create table bizoveya_private.generated_media_attempts(
 request_id uuid primary key references bizoveya_private.media_requests(id) on delete cascade,
 claim uuid not null,actor_id uuid not null references auth.users(id) on delete cascade,
 media_id uuid not null,descriptor jsonb not null check(bizoveya_private.valid_private_media_descriptor(descriptor)),
 object_path text not null unique,input_tokens integer,output_tokens integer,
 state text not null default 'pending' check(state in('pending','committed','failed')),
 created_at timestamptz not null default clock_timestamp(),finished_at timestamptz,
 check((input_tokens is null)=(output_tokens is null)),check(input_tokens is null or input_tokens between 0 and 2000000),check(output_tokens is null or output_tokens between 0 and 2000000)
);
alter table bizoveya_private.generated_media_attempts enable row level security;
revoke all on bizoveya_private.generated_media_attempts from public,anon,authenticated,service_role;

create function public.bz_prepare_generated_media(p_request uuid,p_claim uuid,p_actor uuid,p_descriptor jsonb,p_input_tokens integer,p_output_tokens integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;a bizoveya_private.generated_media_attempts;prepared_ jsonb;prompt_hash_ text;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 select * into r from bizoveya_private.media_requests where id=p_request for update;
 if r.id is null or r.actor_id is distinct from p_actor or r.claim is distinct from p_claim or r.capability<>'image' or r.status<>'running' then raise exception 'bz_conflict';end if;
 if (p_input_tokens is null)<>(p_output_tokens is null) or p_input_tokens is not null and (p_input_tokens not between 0 and 2000000 or p_output_tokens not between 0 and 2000000) then raise exception 'bz_invalid_media_result';end if;
 if not bizoveya_private.valid_private_media_descriptor(p_descriptor) or p_descriptor->>'schema'<>'private-media-descriptor-v2' then raise exception 'bz_invalid_media';end if;
 prompt_hash_:=encode(sha256(convert_to(r.command#>>'{document,prompt}','UTF8')),'hex');
 if p_descriptor#>>'{provenance,requestId}'<>r.id::text or p_descriptor#>>'{provenance,provider}'<>r.snapshot#>>'{qualification,provider}' or p_descriptor#>>'{provenance,modelId}'<>r.snapshot#>>'{qualification,modelId}' or p_descriptor#>>'{provenance,promptHash}'<>prompt_hash_ then raise exception 'bz_invalid_media';end if;
 select * into a from bizoveya_private.generated_media_attempts where request_id=r.id;
 if found then
  if a.claim is distinct from p_claim or a.actor_id<>p_actor or a.descriptor<>p_descriptor or a.input_tokens is distinct from p_input_tokens or a.output_tokens is distinct from p_output_tokens then raise exception 'bz_conflict';end if;
  return jsonb_build_object('state',a.state,'path',a.object_path,'version',1,'descriptor',a.descriptor);
 end if;
 prepared_:=public.bz_prepare_media_upload(p_actor,(select workspace_id from public.bizoveya_sites where id=r.site_id),r.site_id,r.id,r.id,0,p_descriptor);
 if prepared_->>'state'<>'pending' then raise exception 'bz_conflict';end if;
 insert into bizoveya_private.generated_media_attempts(request_id,claim,actor_id,media_id,descriptor,object_path,input_tokens,output_tokens) values(r.id,p_claim,p_actor,r.id,p_descriptor,prepared_->>'path',p_input_tokens,p_output_tokens);
 return jsonb_build_object('state','pending','path',prepared_->>'path','version',prepared_->'version','descriptor',p_descriptor);
end;$$;

create function public.bz_resume_generated_media(p_request uuid,p_actor uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;a bizoveya_private.generated_media_attempts;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 select * into r from bizoveya_private.media_requests where id=p_request;
 if r.id is null or r.actor_id is distinct from p_actor or r.capability<>'image' then raise exception 'bz_media_unavailable';end if;
 select * into a from bizoveya_private.generated_media_attempts where request_id=r.id;
 if a.request_id is null then return jsonb_build_object('state','unavailable','request',bizoveya_private.media_request_json(r.id));end if;
 if a.state='committed' then return jsonb_build_object('state','committed','record',bizoveya_private.private_media_json(a.media_id,p_actor),'request',bizoveya_private.media_request_json(r.id));end if;
 return jsonb_build_object('state',a.state,'path',a.object_path,'descriptor',a.descriptor,'request',bizoveya_private.media_request_json(r.id));
end;$$;

create function public.bz_commit_generated_media(p_request uuid,p_actor uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;a bizoveya_private.generated_media_attempts;record_ jsonb;request_ jsonb;workspace_ uuid;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 select * into r from bizoveya_private.media_requests where id=p_request for update;select * into a from bizoveya_private.generated_media_attempts where request_id=p_request for update;
 if r.id is null or a.request_id is null or r.actor_id is distinct from p_actor or a.actor_id<>p_actor then raise exception 'bz_media_unavailable';end if;
 if a.state='committed' then return jsonb_build_object('record',bizoveya_private.private_media_json(a.media_id,p_actor),'request',bizoveya_private.media_request_json(r.id));end if;
 if a.state<>'pending' or r.status<>'running' or r.claim is distinct from a.claim then raise exception 'bz_conflict';end if;
 select workspace_id into workspace_ from public.bizoveya_sites where id=r.site_id;
 record_:=public.bz_commit_media_upload(p_actor,workspace_,r.site_id,r.id);
 request_:=public.bz_finish_media_request(r.id,a.claim,true,a.input_tokens,a.output_tokens,jsonb_build_object('artifactHash',a.descriptor->>'sha256','mime',a.descriptor->>'mime'),null);
 update bizoveya_private.generated_media_attempts set state='committed',finished_at=clock_timestamp() where request_id=r.id;
 return jsonb_build_object('record',record_,'request',request_);
end;$$;

create function public.bz_fail_generated_media(p_request uuid,p_actor uuid,p_error text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r bizoveya_private.media_requests;a bizoveya_private.generated_media_attempts;request_ jsonb;begin
 if auth.role() is distinct from 'service_role' then raise exception 'bz_forbidden';end if;
 select * into r from bizoveya_private.media_requests where id=p_request for update;select * into a from bizoveya_private.generated_media_attempts where request_id=p_request for update;
 if r.id is null or r.actor_id is distinct from p_actor or p_error!~'^[a-z_]{1,80}$' then raise exception 'bz_media_unavailable';end if;
 if r.status not in('running','failed','succeeded') then raise exception 'bz_conflict';end if;
 if r.status='running' then request_:=public.bz_finish_media_request(r.id,r.claim,false,a.input_tokens,a.output_tokens,null,p_error);else request_:=bizoveya_private.media_request_json(r.id);end if;
 if a.request_id is not null and a.state='pending' then update bizoveya_private.generated_media_attempts set state='failed',finished_at=clock_timestamp() where request_id=r.id;end if;
 return request_;
end;$$;

revoke all on function bizoveya_private.valid_private_media_descriptor(jsonb),public.bz_prepare_generated_media(uuid,uuid,uuid,jsonb,integer,integer),public.bz_resume_generated_media(uuid,uuid),public.bz_commit_generated_media(uuid,uuid),public.bz_fail_generated_media(uuid,uuid,text) from public,anon,authenticated,service_role;
grant execute on function public.bz_prepare_generated_media(uuid,uuid,uuid,jsonb,integer,integer),public.bz_resume_generated_media(uuid,uuid),public.bz_commit_generated_media(uuid,uuid),public.bz_fail_generated_media(uuid,uuid,text) to service_role;
commit;
