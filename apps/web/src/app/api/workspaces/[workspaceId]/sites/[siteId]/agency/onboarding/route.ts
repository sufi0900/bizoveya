import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { onboardingReviewSchema } from '@/features/agents/onboarding-contracts';
import { loadOnboarding, reviewOnboarding } from '@/features/agents/onboarding-store';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(_request:Request,context:Context)=>workspaceApi(async({db,userId})=>{const p=await context.params;return workspaceJson(await loadOnboarding(db,userId,p.workspaceId,p.siteId));});
export const POST=(request:Request,context:Context)=>workspaceApi(async({db,userId})=>{const p=await context.params;const input=await readInput(request,onboardingReviewSchema,4000);return workspaceJson(await reviewOnboarding(db,userId,p.workspaceId,p.siteId,input));});
