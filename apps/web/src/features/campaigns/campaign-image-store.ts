import {createHash} from 'node:crypto';
import {z} from 'zod';
import type {SupabaseClient} from '@supabase/supabase-js';
import {getSite,requireId,checkDatabaseError,WorkspaceError} from '@/features/workspaces/store';
import {privateMediaDescriptorSchema} from './private-media-contracts';
import {campaignImageRecordSchema,type saveCampaignImageSchema} from './media-visual-contracts';
import {readPrivateMediaBytes} from './private-media-objects';
import {visualProblems} from './visual-layout';
function check(error:{code?:string;message?:string}|null){
 if(['42P01','42703','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Saved campaign images need migration 047 after 046. Existing drafts and exports are unchanged.');
 if(error?.message==='bz_media_unavailable')throw new WorkspaceError(404,'This reviewed campaign image is unavailable. Reload before continuing.');
 if(error?.message==='bz_image_base_changed')throw new WorkspaceError(409,'Save and reload the reviewed text/layout visual first, then use it in this image draft.');
 if(error?.message==='bz_visual_source_unaccepted')throw new WorkspaceError(409,'The source review changed or is no longer accepted. Reload the campaign.');
 if(error?.message==='bz_image_retained_limit')throw new WorkspaceError(409,'This site retains at most 160 MiB of distinct campaign image bytes, including history.');
 if(error?.message==='bz_visual_limit')throw new WorkspaceError(409,'This result supports 50 saved image-draft versions.');
 if(error?.message==='bz_invalid_media_visual')throw new WorkspaceError(400,'Check the image draft and both review confirmations.');
 checkDatabaseError(error);
}
export async function loadCampaignImages(db:SupabaseClient,actor:string,wid:string,sid:string,generationId:string){
 await getSite(db,actor,wid,sid);requireId(generationId);
 const result=await db.rpc('bz_campaign_image_draft',{p_workspace_id:wid,p_site_id:sid,p_generation_id:generationId});check(result.error);
 return campaignImageRecordSchema.nullable().parse(result.data);
}
const objectSchema=z.object({path:z.string(),creatorId:z.uuid(),descriptor:privateMediaDescriptorSchema}).strict();
export async function readCampaignImageBytes(db:SupabaseClient,service:SupabaseClient,actor:string,wid:string,sid:string,generationId:string,mediaId:string,version:number){
 await getSite(db,actor,wid,sid);requireId(generationId);requireId(mediaId);
 const result=await service.rpc('bz_campaign_image_object',{p_actor:actor,p_workspace:wid,p_site:sid,p_generation:generationId,p_media:mediaId,p_version:version});check(result.error);
 const object=objectSchema.parse(result.data),d=object.descriptor;
 const expected=`${object.creatorId}/${wid}/${sid}/${mediaId}/${version}/${d.sha256}.${d.mime==='image/png'?'png':'jpg'}`;
 if(object.path!==expected)throw new WorkspaceError(503,'Retained image path contract failed.');
 const downloaded=await service.storage.from('campaign-private-media').download(object.path);
 if(downloaded.error||!downloaded.data)throw new WorkspaceError(503,'Retained campaign image bytes are unavailable.');
 const bytes=new Uint8Array(await downloaded.data.arrayBuffer());
 if(bytes.length!==d.bytes||createHash('sha256').update(bytes).digest('hex')!==d.sha256)throw new WorkspaceError(503,'Retained campaign image integrity check failed.');
 return {bytes,descriptor:d};
}
export async function saveCampaignImages(db:SupabaseClient,service:SupabaseClient,actor:string,wid:string,sid:string,input:z.infer<typeof saveCampaignImageSchema>){
 const {workspace}=await getSite(db,actor,wid,sid);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can share and save campaign image drafts.');
 const problems=visualProblems(input.document.document);if(problems.length)throw new WorkspaceError(400,problems[0]);
 const checked=new Set<string>();
 for(const item of input.document.attachments){
  const ref=item.reference,key=`${ref.mediaId}:${ref.version}`;if(checked.has(key))continue;checked.add(key);
  let actual;
  try{actual=await readCampaignImageBytes(db,service,actor,wid,sid,input.generationId,ref.mediaId,ref.version);}
  catch(error){if(!(error instanceof WorkspaceError)||error.status!==404)throw error;actual=await readPrivateMediaBytes(db,service,actor,wid,sid,ref.mediaId,ref.version);}
  if(JSON.stringify(actual.descriptor)!==JSON.stringify(item.descriptor))throw new WorkspaceError(409,'The image descriptor changed. Reload before saving.');
 }
 const result=await db.rpc('bz_save_campaign_image_draft',{p_workspace_id:wid,p_site_id:sid,p_generation_id:input.generationId,p_expected_version:input.expectedVersion,p_base_visual_version:input.baseVisualVersion,p_source_review_version:input.sourceReviewVersion,p_document:input.document,p_reviewed:input.reviewed,p_share_reviewed:input.shareReviewed});check(result.error);
 return campaignImageRecordSchema.parse(result.data);
}
