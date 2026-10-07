import {z} from 'zod';
import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {WorkspaceError} from '@/features/workspaces/store';
import {saveVisualSchema} from '@/features/campaigns/visual-contracts';
import {loadVisual,saveVisual} from '@/features/campaigns/visual-store';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;const id=z.uuid().safeParse(new URL(r.url).searchParams.get('id'));if(!id.success)throw new WorkspaceError(400,'Choose a generated result.');return workspaceJson(await loadVisual(db,userId,p.workspaceId,p.siteId,id.data));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await saveVisual(db,userId,p.workspaceId,p.siteId,await readInput(r,saveVisualSchema,24000)));});
