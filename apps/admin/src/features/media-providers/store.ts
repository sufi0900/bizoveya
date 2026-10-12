import 'server-only';
import type {SupabaseClient} from '@supabase/supabase-js';
import {mediaAdminInputSchema,mediaRegistrySchema,mediaRequestSchema,type MediaAdminInput} from '@bizoveya/agent-contract';
import {AdminError} from '../admin/access';
export function checkMedia(error:{code?:string;message?:string}|null){
 if(!error)return;
 if(['42P01','PGRST202','PGRST205'].includes(error.code??''))throw new AdminError(503,'SETUP_REQUIRED','Media admission needs migrations 071–072 after 070.');
 if(error.code==='42501'||['bz_forbidden','bz_admin_forbidden','bz_mfa_required'].includes(error.message??''))throw new AdminError(403,'FORBIDDEN','Owner administrator access with MFA is required.');
 throw new AdminError(409,'MEDIA_BLOCKED','Media qualification, request state or allowance changed. Refresh and review; no provider retry is authorized.');
}
export async function loadMediaRegistry(db:SupabaseClient){const r=await db.rpc('bz_admin_media_registry');checkMedia(r.error);return mediaRegistrySchema.parse(r.data);}
export async function mutateMediaRegistry(db:SupabaseClient,input:MediaAdminInput){
 const i=mediaAdminInputSchema.parse(input);
 const r=i.command==='review'?await db.rpc('bz_admin_review_media_capability',{p_workspace_id:i.workspaceId,p_site_id:i.siteId,p_input:i.input}):await db.rpc('bz_admin_recover_media_request',{p_id:i.input.id,p_expected_state:i.input.expectedState,p_action:i.input.action,p_amount_micros:i.input.amountMicros,p_reason:i.input.reason,p_reviewed:i.input.reviewed});
 checkMedia(r.error);if(i.command==='recover')mediaRequestSchema.parse(r.data);
 return loadMediaRegistry(db);
}
