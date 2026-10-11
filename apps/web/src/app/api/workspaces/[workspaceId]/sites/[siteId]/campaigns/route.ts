import {workspaceApi,workspaceJson,readInput} from "@/features/workspaces/api";
import {saveCampaignSchema} from "@/features/campaigns/contracts";
import {loadCampaigns,saveCampaign} from "@/features/campaigns/store";
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(_r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await loadCampaigns(db,userId,p.workspaceId,p.siteId));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;const input=await readInput(r,saveCampaignSchema,160000);return workspaceJson(await saveCampaign(db,userId,p.workspaceId,p.siteId,input));});
