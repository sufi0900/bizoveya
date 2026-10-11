import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { rosterReviewSchema } from '@/features/agents/roster-contracts';
import { loadRoster, saveRoster } from '@/features/agents/roster-store';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(_request:Request,context:Context)=>workspaceApi(async({db,userId})=>{const p=await context.params;return workspaceJson(await loadRoster(db,userId,p.workspaceId,p.siteId));});
export const POST=(request:Request,context:Context)=>workspaceApi(async({db,userId})=>{const p=await context.params;const input=await readInput(request,rosterReviewSchema,6000);return workspaceJson(await saveRoster(db,userId,p.workspaceId,p.siteId,input));});
