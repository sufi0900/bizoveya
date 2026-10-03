import {workspaceApi,workspaceJson,readInput} from "@/features/workspaces/api";
import {previewRequestSchema} from "@bizoveya/agent-contract";
import {previewContext} from "@/features/agents/store";
export const POST=(r:Request,{params}:{params:Promise<{workspaceId:string;siteId:string}>})=>workspaceApi(async({db,userId})=>{const p=await params;const i=await readInput(r,previewRequestSchema);return workspaceJson(await previewContext(db,userId,p.workspaceId,p.siteId,i.agentId,i.agentVersion,i.preferencesVersion));});
