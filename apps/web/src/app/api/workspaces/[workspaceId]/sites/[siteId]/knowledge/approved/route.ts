import {approvedKnowledge} from "@/features/knowledge/store";
import {workspaceApi,workspaceJson} from "@/features/workspaces/api";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{workspaceId:string;siteId:string}>}){return workspaceApi(async({db,userId})=>{const p=await params;return workspaceJson({sources:await approvedKnowledge(db,userId,p.workspaceId,p.siteId)});});}
