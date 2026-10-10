import {workspaceApi,workspaceJson,readInput} from '@/features/workspaces/api';
import {applyPrivateTemplateSchema} from '@/features/campaigns/private-template-contracts';
import {applyStoredPrivateTemplate} from '@/features/campaigns/private-template-store';
type Context={params:Promise<{workspaceId:string;siteId:string;templateId:string}>};
export const POST=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{const p=await c.params;return workspaceJson(await applyStoredPrivateTemplate(db,userId,p.workspaceId,p.siteId,p.templateId,await readInput(r,applyPrivateTemplateSchema,24000)));});
