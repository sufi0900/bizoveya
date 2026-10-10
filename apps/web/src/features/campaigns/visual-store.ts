import type {SupabaseClient} from '@supabase/supabase-js';
import type {z} from 'zod';
import {getSite,checkDatabaseError,WorkspaceError} from '@/features/workspaces/store';
import {visualRecordSchema,type saveVisualSchema} from './visual-contracts';
import {visualProblems} from './visual-layout';
function check(error:{code?:string;message?:string}|null){
 if(['42P01','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Visual draft storage needs migration 039 after 038. Existing text drafts are unchanged.');
 if(error?.message==='bz_visual_source_unaccepted')throw new WorkspaceError(409,'The source review changed or is not accepted. Reload the campaign before composing.');
 if(error?.message==='bz_visual_limit')throw new WorkspaceError(409,'This private pilot supports 50 saved visual versions per generated result.');
 if(error?.message==='bz_visual_templates_setup')throw new WorkspaceError(503,'Template storage needs migration 040 after 039. Your saved v1 visuals remain intact.');
 if(error?.message==='bz_invalid_visual')throw new WorkspaceError(400,'Check the visual text, color and review checkbox.');
 checkDatabaseError(error);
}
export async function loadVisual(db:SupabaseClient,userId:string,wid:string,sid:string,generationId:string){
 await getSite(db,userId,wid,sid);
 const r=await db.rpc('bz_campaign_visual',{p_workspace_id:wid,p_site_id:sid,p_generation_id:generationId});check(r.error);return visualRecordSchema.nullable().parse(r.data);
}
export async function saveVisual(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof saveVisualSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can edit visual drafts.');
 const problems=visualProblems(input.document);if(problems.length)throw new WorkspaceError(400,problems[0]);
 const r=await db.rpc('bz_save_campaign_visual',{p_workspace_id:wid,p_site_id:sid,p_generation_id:input.generationId,p_expected_version:input.expectedVersion,p_source_review_version:input.sourceReviewVersion,p_document:input.document,p_reviewed:input.reviewed});if(r.error?.message==='bz_invalid_visual'&&input.document.schema!=='campaign-visuals-v1')throw new WorkspaceError(400,`Check the template fields. If migration ${input.document.schema==='campaign-visuals-v3'?'042':'040'} is missing, apply migrations in order; your saved visuals are unchanged.`);check(r.error);return visualRecordSchema.parse(r.data);
}
