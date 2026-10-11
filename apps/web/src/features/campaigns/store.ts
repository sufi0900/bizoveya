import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSite, checkDatabaseError, WorkspaceError } from "@/features/workspaces/store";
import { canWriteWorkspace } from "@/domain/workspaces";
import { campaignRecordSchema, type saveCampaignSchema } from "./contracts";
function check(error:{code?:string;message?:string}|null){
 if (["42P01","PGRST202","PGRST205"].includes(error?.code??"")) throw new WorkspaceError(503,"Campaign storage needs migration 033. Ask the operator to complete setup.");
 if(error?.message==="bz_campaign_limit") throw new WorkspaceError(400,"This pilot supports 50 campaigns per site and 100 revisions per campaign.");
 checkDatabaseError(error);
}
export async function loadCampaigns(db:SupabaseClient,userId:string,wid:string,sid:string){
 const context=await getSite(db,userId,wid,sid);
 const result=await db.from("bizoveya_campaigns").select("*").eq("site_id",sid).order("updated_at",{ascending:false});check(result.error);
 const history=await db.from("bizoveya_campaign_revisions").select("campaign_id,version,document,occurred_at").eq("site_id",sid).order("occurred_at",{ascending:false}).limit(100);check(history.error);
 return {...context,campaigns:z.array(campaignRecordSchema).parse(result.data??[]),history:z.array(z.object({campaign_id:z.uuid(),version:z.number().int().positive(),document:campaignRecordSchema.shape.document,occurred_at:z.string()})).parse(history.data??[])};
}
export async function saveCampaign(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof saveCampaignSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);
 if(!canWriteWorkspace(workspace.role))throw new WorkspaceError(403,"Your workspace role is read-only.");
 const result=await db.rpc("bz_save_campaign",{p_workspace_id:wid,p_site_id:sid,p_id:input.id,p_document:input.document,p_expected_version:input.expectedVersion});check(result.error);
 return campaignRecordSchema.parse(Array.isArray(result.data)?result.data[0]:result.data);
}
