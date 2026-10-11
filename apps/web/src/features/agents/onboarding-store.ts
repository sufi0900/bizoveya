import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { getSite, checkDatabaseError, WorkspaceError } from '@/features/workspaces/store';
import { onboardingReportSchema, onboardingReviewSchema } from './onboarding-contracts';
function check(error:{code?:string;message?:string}|null){
 if(['42P01','42703','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Onboarding assessments need migration 049 after 048. Existing proposals and campaigns remain available.');
 if(error?.message==='bz_onboarding_changed'||error?.message==='bz_conflict')throw new WorkspaceError(409,'The context or review changed. Reload the assessment and review it again.');
 if(error?.message==='bz_onboarding_limit')throw new WorkspaceError(409,'This pilot retains at most 50 onboarding reviews per site.');
 if(error?.message==='bz_onboarding_snapshot_limit')throw new WorkspaceError(409,'Approved context exceeds the 256 KiB assessment limit. Review the site knowledge with your operator.');
 if(error?.message==='bz_invalid_onboarding_review')throw new WorkspaceError(400,'Check the review note and explicit confirmation.');
 checkDatabaseError(error);
}
export async function loadOnboarding(db:SupabaseClient,userId:string,wid:string,sid:string){
 await getSite(db,userId,wid,sid);const r=await db.rpc('bz_agency_onboarding',{p_workspace_id:wid,p_site_id:sid});check(r.error);return onboardingReportSchema.parse(r.data);
}
export async function reviewOnboarding(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof onboardingReviewSchema>){
 const {workspace}=await getSite(db,userId,wid,sid);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can save an onboarding review.');
 const r=await db.rpc('bz_review_agency_onboarding',{p_workspace_id:wid,p_site_id:sid,p_input:onboardingReviewSchema.parse(input)});check(r.error);return onboardingReportSchema.parse(r.data);
}
