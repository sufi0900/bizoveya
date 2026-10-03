import {workspaceApi,workspaceJson,readInput} from "@/features/workspaces/api";
import {prepareGenerationSchema} from "@/features/campaigns/contracts";
import {prepareGeneration} from "@/features/campaigns/store";
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;const input=await readInput(r,prepareGenerationSchema,2000);return workspaceJson(await prepareGeneration(db,userId,p.workspaceId,p.siteId,input));});
