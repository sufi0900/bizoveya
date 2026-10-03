import { knowledgeMutationSchema, knowledgeLimits } from "@/domain/knowledge";
import { loadKnowledge,mutateKnowledge } from "@/features/knowledge/store";
import { readInput,workspaceApi,workspaceJson } from "@/features/workspaces/api";
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const dynamic="force-dynamic";
export async function GET(_request:Request,context:Context){return workspaceApi(async({db,userId})=>{const p=await context.params;const data=await loadKnowledge(db,userId,p.workspaceId,p.siteId);return workspaceJson({sources:data.sources});});}
export async function POST(request:Request,context:Context){return workspaceApi(async({db,userId})=>{const p=await context.params;const input=await readInput(request,knowledgeMutationSchema,knowledgeLimits.requestBytes);return workspaceJson(await mutateKnowledge(db,userId,p.workspaceId,p.siteId,input));});}
