import type {SupabaseClient} from '@supabase/supabase-js';
import type {z} from 'zod';
import {getSite,requireId,checkDatabaseError,WorkspaceError} from '@/features/workspaces/store';
import {applyPrivateTemplateSchema,archivePrivateTemplateSchema,privateTemplateInventorySchema,privateTemplateRecordSchema,savePrivateTemplateSchema} from './private-template-contracts';
import {visualRecordSchema} from './visual-contracts';

function check(error:{code?:string;message?:string}|null){
 if(['42P01','42703','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Private template storage needs migration 041 after 040. Existing campaign visuals are unchanged.');
 if(error?.message==='bz_template_unavailable')throw new WorkspaceError(404,'This private template is unavailable.');
 if(error?.message==='bz_template_conflict')throw new WorkspaceError(409,'This private template changed in another session. Reload before saving.');
 if(error?.message==='bz_template_limit')throw new WorkspaceError(409,'This private pilot supports 20 templates and 50 versions per template.');
 if(error?.message==='bz_visual_source_unaccepted')throw new WorkspaceError(409,'The source review changed or is not accepted. Reload the campaign before applying the template.');
 if(error?.message==='bz_visual_limit')throw new WorkspaceError(409,'This private pilot supports 50 saved visual versions per generated result.');
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
export async function applyStoredPrivateTemplate(db:SupabaseClient,userId:string,wid:string,sid:string,templateId:string,input:z.infer<typeof applyPrivateTemplateSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);requireId(templateId);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can apply templates to visual drafts.');
 const r=await db.rpc('bz_apply_private_template_to_visual',{p_workspace_id:wid,p_site_id:sid,p_generation_id:input.generationId,p_expected_version:input.expectedVersion,p_source_review_version:input.sourceReviewVersion,p_template_id:templateId,p_template_version:input.templateVersion,p_document:input.document,p_reviewed:input.reviewed});if(['42P01','42703','PGRST202','PGRST205'].includes(r.error?.code??''))throw new WorkspaceError(503,'Applying private templates needs migration 042 after 041. Existing visual drafts are unchanged.');check(r.error);
 return visualRecordSchema.parse(r.data);
}
