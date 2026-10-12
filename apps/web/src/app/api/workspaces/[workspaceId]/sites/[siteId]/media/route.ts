import {readInput,workspaceApi,workspaceJson} from '@/features/workspaces/api';
import {mediaAdmissionSchema} from '@bizoveya/agent-contract';
import {loadMedia,admitMedia} from '@/features/agents/media-store';
export const dynamic='force-dynamic';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(_r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await loadMedia(db,userId,p.workspaceId,p.siteId));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await admitMedia(db,userId,p.workspaceId,p.siteId,await readInput(r,mediaAdmissionSchema,8192)));});
