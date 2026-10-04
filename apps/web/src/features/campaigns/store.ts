import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSite, checkDatabaseError, WorkspaceError } from "@/features/workspaces/store";
import { canWriteWorkspace } from "@/domain/workspaces";
import { campaignRecordSchema, generationSummarySchema, type prepareGenerationSchema, type reviewGenerationSchema, type saveCampaignSchema } from "./contracts";
import {outputRecordSchema} from "./output-contracts";
function check(error:{code?:string;message?:string}|null){
 if (["42P01","PGRST202","PGRST205"].includes(error?.code??"")) throw new WorkspaceError(503,"Campaign outputs and review need migration 037 after036. Ask the operator to complete setup.");
 if(error?.message==="bz_campaign_limit") throw new WorkspaceError(400,"This pilot supports 50 campaigns per site and 100 revisions per campaign.");
 if(error?.message==="bz_generation_not_ready") throw new WorkspaceError(409,"Generation is not ready. Approve one coordinator, content and quality agent; bind each to a current checked model; then review current spending policies and approved site knowledge.");
 if(error?.message==="bz_conflict") throw new WorkspaceError(409,"The campaign or review changed. Reload before continuing.");
 checkDatabaseError(error);
}
export async function loadCampaigns(db:SupabaseClient,userId:string,wid:string,sid:string){
 const context=await getSite(db,userId,wid,sid);
 const result=await db.from("bizoveya_campaigns").select("*").eq("site_id",sid).order("updated_at",{ascending:false});check(result.error);
 const history=await db.from("bizoveya_campaign_revisions").select("campaign_id,version,document,occurred_at").eq("site_id",sid).order("occurred_at",{ascending:false}).limit(100);check(history.error);
 const generations=await db.rpc("bz_campaign_generation_history",{p_workspace_id:wid,p_site_id:sid});check(generations.error);
 const outputs=await db.rpc("bz_campaign_generation_outputs",{p_workspace_id:wid,p_site_id:sid});const outputSetupRequired=["42P01","PGRST202","PGRST205"].includes(outputs.error?.code??"");if(!outputSetupRequired)check(outputs.error);
 return {...context,outputSetupRequired,outputs:z.array(outputRecordSchema).parse(outputSetupRequired?[]:outputs.data??[]),campaigns:z.array(campaignRecordSchema).parse(result.data??[]),history:z.array(z.object({campaign_id:z.uuid(),version:z.number().int().positive(),document:campaignRecordSchema.shape.document,occurred_at:z.string()})).parse(history.data??[]),generations:z.array(generationSummarySchema).parse(generations.data??[])};
}
export async function prepareGeneration(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof prepareGenerationSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);if(!canWriteWorkspace(workspace.role))throw new WorkspaceError(403,"Your workspace role is read-only.");
 const result=await db.rpc("bz_prepare_campaign_generation",{p_workspace_id:wid,p_site_id:sid,p_campaign_id:input.campaignId,p_expected_campaign_version:input.expectedCampaignVersion,p_run_id:input.id});check(result.error);
 return generationSummarySchema.parse(result.data);
}
export async function saveCampaign(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof saveCampaignSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);
 if(!canWriteWorkspace(workspace.role))throw new WorkspaceError(403,"Your workspace role is read-only.");
 const result=await db.rpc("bz_save_campaign",{p_workspace_id:wid,p_site_id:sid,p_id:input.id,p_document:input.document,p_expected_version:input.expectedVersion});check(result.error);
 return campaignRecordSchema.parse(Array.isArray(result.data)?result.data[0]:result.data);
}

export async function reviewGeneration(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof reviewGenerationSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can record a human review.');
 const r=await db.rpc('bz_review_campaign_generation',{p_workspace_id:wid,p_site_id:sid,p_id:input.id,p_expected_version:input.expectedVersion,p_decision:input.decision,p_reason:input.reason});
 if(r.error?.message==='bz_quality_blocked')throw new WorkspaceError(409,'Quality review has blocking issues. Request changes instead of accepting.');
 check(r.error);return (await loadCampaigns(db,userId,wid,sid)).outputs;
}
