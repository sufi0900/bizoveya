import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {localRequest,localCustomerEnabled} from '@/features/campaigns/local-execution-contracts';
import {localCampaignRequest} from '@/features/campaigns/local-execution-server';
export const runtime='nodejs';export const dynamic='force-dynamic';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export async function POST(request:Request,context:Context){
 if(!localCustomerEnabled(process.env))return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});
 return workspaceApi(async({db,userId})=>{const p=await context.params;const input=await readInput(request,localRequest,4096);return workspaceJson(await localCampaignRequest(db,userId,p.workspaceId,p.siteId,request,input));});
}
