begin;
create function pg_temp.expect(q text,n text) returns void language plpgsql as $$begin begin execute q;exception when others then if strpos(sqlerrm,n)>0 then return;end if;raise;end;raise exception 'Expected %',n;end;$$;
set local role authenticated;
select pg_temp.expect(format('select public.bz_resume_generated_media(%L,%L)',gen_random_uuid(),gen_random_uuid()),'permission denied');
reset role;set local role service_role;select set_config('request.jwt.claim.role','service_role',true);
do $$declare v jsonb;begin select public.bz_resume_generated_media(gen_random_uuid(),gen_random_uuid()) into v;if v is distinct from '{"state":"unavailable"}'::jsonb then raise exception 'Fresh lookup must be unavailable';end if;end;$$;
do $$begin if has_function_privilege('anon','public.bz_resume_generated_media(uuid,uuid)','EXECUTE') or has_function_privilege('authenticated','public.bz_resume_generated_media(uuid,uuid)','EXECUTE') or not has_function_privilege('service_role','public.bz_resume_generated_media(uuid,uuid)','EXECUTE') then raise exception 'Unsafe replay lookup grants';end if;end;$$;
rollback;
