-- Local-only synthetic workspace inserted AFTER migration 018.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
select public.bz_create_workspace('Preserved workspace');
select public.bz_register_site((select id from public.bizoveya_workspaces where name='Preserved workspace'),'Preserved portfolio link','native_portfolio','portfolio',null,'22222222-2222-4222-8222-222222222222','active',true);
commit;
