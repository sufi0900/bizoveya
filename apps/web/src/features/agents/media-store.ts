import 'server-only';
import type {SupabaseClient} from '@supabase/supabase-js';
import {mediaAdmissionSchema,mediaInventorySchema,mediaRequestSchema,type MediaAdmission} from '@bizoveya/agent-contract';
import {getSite,WorkspaceError} from '@/features/workspaces/store';
function check(error:{code?:string;message?:string}|null){
 if(!error)return;
 if(['42P01','PGRST202','PGRST205'].includes(error.code??''))throw new WorkspaceError(503,'Media admission needs migrations 071–072. Core private drafts and templates remain available.');
 if(error.message==='bz_forbidden'||error.code==='42501')throw new WorkspaceError(403,'Only the workspace owner can authorize media requests.');
 throw new WorkspaceError(409,'Media qualification, limits or request state changed. Reload before continuing.');
}
export async function loadMedia(db:SupabaseClient,userId:string,wid:string,sid:string){await getSite(db,userId,wid,sid);const r=await db.rpc('bz_media_inventory',{p_workspace_id:wid,p_site_id:sid});check(r.error);return mediaInventorySchema.parse(r.data);}
export async function admitMedia(db:SupabaseClient,userId:string,wid:string,sid:string,input:MediaAdmission){
 const context=await getSite(db,userId,wid,sid);if(context.workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can authorize media requests.');
 const r=await db.rpc('bz_admit_media_request',{p_workspace_id:wid,p_site_id:sid,p_input:mediaAdmissionSchema.parse(input)});check(r.error);return mediaRequestSchema.parse(r.data);
}

/** Optional readiness must not turn a healthy core page into a setup screen. */
export async function loadOptionalMedia(db:SupabaseClient,userId:string,wid:string,sid:string){
 try{return {inventory:await loadMedia(db,userId,wid,sid),notice:''};}
 catch(error){if(error instanceof WorkspaceError&&error.status===503)return {inventory:{capabilities:[],requests:[]},notice:'Optional voice and AI artwork readiness is unavailable. Typed proposals, uploads and templates remain available.'};throw error;}
}
