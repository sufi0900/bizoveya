import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {savePrivateTemplateSchema} from '@/features/campaigns/private-template-contracts';
import {listPrivateTemplates,savePrivateTemplate} from '@/features/campaigns/private-template-store';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const GET=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await listPrivateTemplates(db,userId,p.workspaceId,p.siteId,new URL(r.url).searchParams.get('archived')==='1'));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await savePrivateTemplate(db,userId,p.workspaceId,p.siteId,await readInput(r,savePrivateTemplateSchema,24000)));});
