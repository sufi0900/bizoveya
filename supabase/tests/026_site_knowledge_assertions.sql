-- Ephemeral or staging-only assertions; transaction rolled back. Not a migration.
begin;
create temporary table kfixture(owner_id uuid,editor_id uuid,viewer_id uuid,outsider_id uuid,w uuid,s uuid,s2 uuid,k uuid);
insert into kfixture values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),null,null,null,gen_random_uuid());
insert into auth.users(id) select owner_id from kfixture union all select editor_id from kfixture union all select viewer_id from kfixture union all select outsider_id from kfixture;
create function pg_temp.kexpect(q text,needle text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,needle)>0 then return;else raise exception 'Unexpected failure: %',sqlerrm;end if;end;raise exception 'Expected failure %',needle;end;$$;
do $$begin execute format('grant usage on schema %I to authenticated',(select nspname from pg_namespace where oid=pg_my_temp_schema()));end;$$;
grant all on kfixture to authenticated;
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from kfixture),true);
update kfixture set w=(select id from public.bz_create_workspace('Knowledge workspace'));
update kfixture set s=(select id from public.bz_register_site(w,'Knowledge site','external','business','https://knowledge-business.com/',null,'active',true));
update kfixture set s2=(select id from public.bz_register_site(w,'Second site','external','business','https://second-knowledge.com/',null,'active',true));
reset role;
insert into public.bizoveya_memberships(workspace_id,user_id,role) select w,editor_id,'editor' from kfixture union all select w,viewer_id,'viewer' from kfixture;
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from kfixture),true);
do $$declare f record;d jsonb:='{"title":"Service policy","filename":"policy.md","sourceText":"We repair bicycles.","facts":[{"id":"f1","text":"Bicycle repairs are available."}]}'::jsonb;begin
 select * into f from kfixture;
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'save',d,0);
 if (select count(*) from public.bz_read_approved_knowledge(f.w,f.s))<>0 then raise exception 'Draft leaked';end if;
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'approve',null,1);
 if (select version from public.bz_read_approved_knowledge(f.w,f.s))<>2 then raise exception 'Approval revision missing';end if;
 if (select count(*) from public.bz_read_approved_knowledge(f.w,f.s2))<>0 then raise exception 'Cross-site approved leak';end if;
 perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''save'',%L::jsonb,0)',f.w,f.s,gen_random_uuid(),d),'bz_knowledge_duplicate');
 perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''save'',%L::jsonb,1)',f.w,f.s,f.k,d),'bz_conflict');
 perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''revoke'',null,2)',f.w,f.s2,f.k),'bz_not_found');
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'save',jsonb_set(d,'{facts}','[{"id":"f1","text":"Corrected bicycle service."}]'),2);
 if (select count(*) from public.bz_read_approved_knowledge(f.w,f.s))<>0 then raise exception 'Correction retained approval';end if;
 if (select count(*) from public.bizoveya_knowledge_revisions where source_id=f.k)<>3 then raise exception 'History missing';end if;
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'approve',null,3);
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'revoke',null,4);
 if (select count(*) from public.bz_read_approved_knowledge(f.w,f.s))<>0 then raise exception 'Revocation leaked';end if;
end;$$;
select set_config('request.jwt.claim.sub',(select editor_id::text from kfixture),true);
do $$declare f record;begin select * into f from kfixture;perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''approve'',null,5)',f.w,f.s,f.k),'bz_forbidden');perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''delete'',null,5)',f.w,f.s,f.k),'bz_forbidden');end;$$;
select set_config('request.jwt.claim.sub',(select viewer_id::text from kfixture),true);
do $$declare f record;begin select * into f from kfixture;if(select count(*) from public.bizoveya_knowledge_sources where site_id=f.s)<>1 then raise exception 'Viewer source access failed';end if;perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''revoke'',null,5)',f.w,f.s,f.k),'bz_forbidden');perform pg_temp.kexpect('update public.bizoveya_knowledge_sources set approved=true','permission denied');end;$$;
select set_config('request.jwt.claim.sub',(select outsider_id::text from kfixture),true);
do $$declare f record;begin select * into f from kfixture;if(select count(*) from public.bizoveya_knowledge_sources)<>0 or(select count(*) from public.bizoveya_knowledge_revisions)<>0 then raise exception 'Outsider raw data leak';end if;perform pg_temp.kexpect(format('select public.bz_read_approved_knowledge(%L,%L)',f.w,f.s),'bz_forbidden');end;$$;
select set_config('request.jwt.claim.sub',(select owner_id::text from kfixture),true);
do $$declare f record;k2 uuid:=gen_random_uuid();d jsonb:='{"title":"Empty review","filename":"","sourceText":"Different material.","facts":[]}'::jsonb;begin
 select * into f from kfixture;perform public.bz_mutate_knowledge(f.w,f.s,k2,'save',d,0);perform pg_temp.kexpect(format('select public.bz_mutate_knowledge(%L,%L,%L,''approve'',null,1)',f.w,f.s,k2),'bz_knowledge_empty');
 perform public.bz_mutate_knowledge(f.w,f.s,f.k,'delete',null,5);
 if exists(select 1 from public.bizoveya_knowledge_revisions where source_id=f.k) or exists(select 1 from public.bizoveya_knowledge_sources where id=f.k) then raise exception 'Source removal left content';end if;
 if not exists(select 1 from public.bizoveya_knowledge_events where source_id=f.k and action='delete') then raise exception 'Removal audit missing';end if;
end;$$;
reset role;
do $$begin
 if bizoveya_private.valid_knowledge_document('{"title":"T","filename":"../a.txt","sourceText":"S","facts":[]}') then raise exception 'Path filename accepted';end if;
 if bizoveya_private.valid_knowledge_document('{"title":"T","filename":"","sourceText":"S","facts":[{"id":"x","text":"A"},{"id":"x","text":"B"}]}') then raise exception 'Duplicate fact IDs accepted';end if;
 if has_table_privilege('anon','public.bizoveya_knowledge_sources','select') or has_function_privilege('anon','public.bz_read_approved_knowledge(uuid,uuid)','execute') then raise exception 'Anonymous privileges exposed';end if;
end;$$;
-- Emergency revoke remains possible at the normal revision limit.
update public.bizoveya_knowledge_sources set version=100,approved=true,approved_at=now(),approved_by=(select owner_id from kfixture);
set local role authenticated;select set_config('request.jwt.claim.sub',(select owner_id::text from kfixture),true);
do $$declare f record;k uuid;begin select * into f from kfixture;select id into k from public.bizoveya_knowledge_sources where site_id=f.s;perform public.bz_mutate_knowledge(f.w,f.s,k,'revoke',null,100);if(select count(*) from public.bz_read_approved_knowledge(f.w,f.s))<>0 then raise exception 'Cap prevented revoke';end if;end;$$;
reset role;
-- Revoked membership invalidates retrieval immediately, not just the visible UI.
delete from public.bizoveya_memberships where user_id=(select viewer_id from kfixture);
set local role authenticated;select set_config('request.jwt.claim.sub',(select viewer_id::text from kfixture),true);
do $$declare f record;begin select * into f from kfixture;perform pg_temp.kexpect(format('select public.bz_read_approved_knowledge(%L,%L)',f.w,f.s),'bz_forbidden');end;$$;
reset role;rollback;
