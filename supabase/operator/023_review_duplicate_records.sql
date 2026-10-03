-- READ ONLY: Supabase SQL Editor, operator account, after migration023.
-- Review with founder. This script never removes records or drafts.
select workspace_id,bizoveya_private.site_name_key(name) as name_key,
 count(*) as records,array_agg(id order by created_at) as site_ids
from public.bizoveya_sites group by workspace_id,bizoveya_private.site_name_key(name) having count(*)>1;
select workspace_id,bizoveya_private.site_url_key(url) as url_key,
 count(*) as records,array_agg(id order by created_at) as site_ids
from public.bizoveya_sites where mode='external'
group by workspace_id,bizoveya_private.site_url_key(url) having count(*)>1;
