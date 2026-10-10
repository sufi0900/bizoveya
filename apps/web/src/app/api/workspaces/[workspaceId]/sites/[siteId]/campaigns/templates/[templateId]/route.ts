import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {archivePrivateTemplateSchema} from '@/features/campaigns/private-template-contracts';
import {archiveStoredPrivateTemplate,loadPrivateTemplate} from '@/features/campaigns/private-template-store';
type Context={params:Promise<{workspaceId:string;siteId:string;templateId:string}>};
export const GET=(_:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await loadPrivateTemplate(db,userId,p.workspaceId,p.siteId,p.templateId));});
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await archiveStoredPrivateTemplate(db,userId,p.workspaceId,p.siteId,p.templateId,await readInput(r,archivePrivateTemplateSchema)));});
