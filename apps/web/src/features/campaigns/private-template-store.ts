import type {SupabaseClient} from '@supabase/supabase-js';
import type {z} from 'zod';
import {getSite,requireId,checkDatabaseError,WorkspaceError} from '@/features/workspaces/store';
import {archivePrivateTemplateSchema,privateTemplateInventorySchema,privateTemplateRecordSchema,savePrivateTemplateSchema} from './private-template-contracts';

function check(error:{code?:string;message?:string}|null){
 if(['42P01','42703','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Private template storage needs migration 041 after 040. Existing campaign visuals are unchanged.');
 if(error?.message==='bz_template_unavailable')throw new WorkspaceError(404,'This private template is unavailable.');
 if(error?.message==='bz_template_conflict')throw new WorkspaceError(409,'This private template changed in another session. Reload before saving.');
 if(error?.message==='bz_template_limit')throw new WorkspaceError(409,'This private pilot supports 20 templates and 50 versions per template.');
 if(error?.message==='bz_invalid_template')throw new WorkspaceError(400,'Check the private template name and design fields.');
 checkDatabaseError(error);
}
export async function listPrivateTemplates(db:SupabaseClient,userId:string,wid:string,sid:string,includeArchived=false){
 await getSite(db,userId,wid,sid);
 const r=await db.rpc('bz_private_templates',{p_include_archived:includeArchived});check(r.error);
 return privateTemplateInventorySchema.parse(r.data);
}
export async function loadPrivateTemplate(db:SupabaseClient,userId:string,wid:string,sid:string,templateId:string){
 await getSite(db,userId,wid,sid);requireId(templateId);
 const r=await db.rpc('bz_private_template',{p_template_id:templateId});check(r.error);
 if(r.data===null)throw new WorkspaceError(404,'This private template is unavailable.');
 return privateTemplateRecordSchema.parse(r.data);
}
export async function savePrivateTemplate(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof savePrivateTemplateSchema>){
 await getSite(db,userId,wid,sid);
 const r=await db.rpc('bz_save_private_template',{p_template_id:input.templateId,p_expected_version:input.expectedVersion,p_recipe:input.recipe});check(r.error);
 return privateTemplateRecordSchema.parse(r.data);
}
export async function archiveStoredPrivateTemplate(db:SupabaseClient,userId:string,wid:string,sid:string,templateId:string,input:z.infer<typeof archivePrivateTemplateSchema>){
 await getSite(db,userId,wid,sid);requireId(templateId);
 const r=await db.rpc('bz_archive_private_template',{p_template_id:templateId,p_expected_version:input.expectedVersion});check(r.error);
 return privateTemplateRecordSchema.parse(r.data);
}
