-- Local-only synthetic data inserted AFTER inherited migration 017.
insert into auth.users(id) values ('11111111-1111-4111-8111-111111111111');
insert into public.projects(id,owner_id,name,creation_mode,document)
values('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','Preserved legacy portfolio','guided','{"fixture":"legacy document unchanged"}');
