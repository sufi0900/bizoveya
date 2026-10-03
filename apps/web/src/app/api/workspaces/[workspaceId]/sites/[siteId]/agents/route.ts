import {workspaceApi,workspaceJson,readInput} from "@/features/workspaces/api";
import {savePreferencesSchema} from "@bizoveya/agent-contract";
import {loadReadiness,savePreferences} from "@/features/agents/store";
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(_r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await loadReadiness(db,userId,p.workspaceId,p.siteId));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;const i=await readInput(r,savePreferencesSchema);return workspaceJson(await savePreferences(db,userId,p.workspaceId,p.siteId,i.document,i.expectedVersion));});
