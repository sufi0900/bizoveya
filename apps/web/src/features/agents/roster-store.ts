import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { getSite, checkDatabaseError, WorkspaceError } from '@/features/workspaces/store';
import { rosterRecordSchema, rosterReviewSchema } from './roster-contracts';
function check(error:{code?:string;message?:string}|null){
 if(['42P01','42703','PGRST202','PGRST205'].includes(error?.code??''))throw new WorkspaceError(503,'Site team controls need migration 050 after 049. Existing records remain available.');
 if(['bz_conflict','bz_site_roster_changed'].includes(error?.message??''))throw new WorkspaceError(409,'The site team or selected agent changed. Reload and review again.');
 if(error?.message==='bz_site_roster_not_ready')throw new WorkspaceError(409,'The selected team needs current checked model bindings and spending policies before enabling. Ask the operator to renew qualification.');
 if(error?.message==='bz_site_roster_limit')throw new WorkspaceError(409,'This pilot retains at most 50 site team revisions.');
 if(error?.message==='bz_invalid_site_roster')throw new WorkspaceError(400,'Select one distinct agent for each role or pause with no team, and confirm the change.');
 checkDatabaseError(error);
}
export async function loadRoster(db:SupabaseClient,userId:string,wid:string,sid:string){await getSite(db,userId,wid,sid);const r=await db.rpc('bz_site_agent_roster',{p_workspace_id:wid,p_site_id:sid});check(r.error);return rosterRecordSchema.parse(r.data);}
export async function saveRoster(db:SupabaseClient,userId:string,wid:string,sid:string,input:z.infer<typeof rosterReviewSchema>){const {workspace}=await getSite(db,userId,wid,sid);if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can enable or pause the site team.');const r=await db.rpc('bz_save_site_agent_roster',{p_workspace_id:wid,p_site_id:sid,p_input:rosterReviewSchema.parse(input)});check(r.error);return rosterRecordSchema.parse(r.data);}
