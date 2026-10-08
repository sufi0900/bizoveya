-- P04.3.4.2: extend validation; preserve records/history and existing access/locks.
begin;
create function bizoveya_private.valid_visual_document_v1(p_document jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare item jsonb;begin
 if p_document is null or jsonb_typeof(p_document)<>'object' or octet_length(p_document::text)>24000 then return false;end if;
 if (select count(*) from jsonb_object_keys(p_document))<>4 or p_document->>'schema' is distinct from 'campaign-visuals-v1' or not(p_document ?& array['schema','brand','pins','slides']) then return false;end if;
 if jsonb_typeof(p_document->'brand') is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(p_document->'brand'))<>3 or not(p_document->'brand' ?& array['name','accent','footer']) then return false;end if;
 if not bizoveya_private.valid_visual_text(p_document#>'{brand,name}',60) or not bizoveya_private.valid_visual_text(p_document#>'{brand,footer}',100) or jsonb_typeof(p_document#>'{brand,accent}') is distinct from 'string' or (p_document#>>'{brand,accent}') !~ '^#[0-9a-fA-F]{6}$' then return false;end if;
 if jsonb_typeof(p_document->'pins') is distinct from 'array' or jsonb_typeof(p_document->'slides') is distinct from 'array' then return false;end if;
 if jsonb_array_length(p_document->'pins')<>2 or jsonb_array_length(p_document->'slides')<>6 then return false;end if;
 for item in select value from jsonb_array_elements(p_document->'pins') loop
  if jsonb_typeof(item)<>'object' then return false;end if;
  if (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',120) or not bizoveya_private.valid_visual_text(item->'body',600) then return false;end if;
 end loop;
 for item in select value from jsonb_array_elements(p_document->'slides') loop
  if jsonb_typeof(item)<>'object' then return false;end if;
  if (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',100) or not bizoveya_private.valid_visual_text(item->'body',420) then return false;end if;
 end loop;return true;
end;$$;
create or replace function bizoveya_private.valid_visual_document(p_document jsonb) returns boolean language plpgsql immutable set search_path='' as $$
declare base_ jsonb;templates_ jsonb;item jsonb;begin
 if p_document->>'schema'='campaign-visuals-v1' then return bizoveya_private.valid_visual_document_v1(p_document);end if;
 if p_document is null or jsonb_typeof(p_document) is distinct from 'object' or octet_length(p_document::text)>24000 then return false;end if;
 if p_document->>'schema' is distinct from 'campaign-visuals-v2' or (select count(*) from jsonb_object_keys(p_document))<>6 or not(p_document ?& array['schema','brand','pins','slides','templates','linkedin']) then return false;end if;
 base_:=(p_document-'templates'-'linkedin')||jsonb_build_object('schema','campaign-visuals-v1');
 if not bizoveya_private.valid_visual_document_v1(base_) then return false;end if;
 templates_:=p_document->'templates';
 if jsonb_typeof(templates_) is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(templates_))<>3 or not(templates_ ?& array['pins','carousel','linkedin']) then return false;end if;
 if jsonb_typeof(templates_->'pins') is distinct from 'array' then return false;end if;
 if jsonb_array_length(templates_->'pins')<>2 then return false;end if;
 for item in select value from jsonb_array_elements(templates_->'pins') union all select templates_->'carousel' union all select templates_->'linkedin' loop
  if jsonb_typeof(item) is distinct from 'string' or (item#>>'{}') not in ('classic','midnight','editorial','headline') then return false;end if;
 end loop;
 item:=p_document->'linkedin';
 if jsonb_typeof(item) is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(item))<>2 or not(item ?& array['title','body']) or not bizoveya_private.valid_visual_text(item->'title',100) or not bizoveya_private.valid_visual_text(item->'body',420) then return false;end if;
 return true;
end;$$;
revoke all on function bizoveya_private.valid_visual_document(jsonb),bizoveya_private.valid_visual_document_v1(jsonb) from public,anon,authenticated,service_role;
commit;
