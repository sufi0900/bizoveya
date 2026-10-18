-- Read-only historical input for the isolated local runner; no execution authority.
begin;
create function public.bz_admin_local_rehearsal_snapshot(p_id uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 perform bizoveya_private.require_admin();
 select r.input_snapshot into result
 from bizoveya_private.generation_runs r
 join public.bizoveya_sites s on s.id=r.site_id
 join public.bizoveya_memberships m on m.workspace_id=s.workspace_id and m.user_id=auth.uid() and m.role='owner'
 where r.id=p_id and r.requested_by=auth.uid()
 and not exists(select 1 from bizoveya_private.generation_dispatches d where d.generation_id=r.id and d.finished_at is null and d.expires_at>statement_timestamp());
 if result is null then raise exception 'bz_rehearsal_unavailable';end if;
 return result;
end;$$;
revoke all on function public.bz_admin_local_rehearsal_snapshot(uuid) from public,anon,service_role;
grant execute on function public.bz_admin_local_rehearsal_snapshot(uuid) to authenticated;
commit;
