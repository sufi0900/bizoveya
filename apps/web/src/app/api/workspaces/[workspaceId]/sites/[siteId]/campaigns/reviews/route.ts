import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {reviewGenerationSchema} from '@/features/campaigns/contracts';
import {reviewGeneration} from '@/features/campaigns/store';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await reviewGeneration(db,userId,p.workspaceId,p.siteId,await readInput(r,reviewGenerationSchema,2048)));});
