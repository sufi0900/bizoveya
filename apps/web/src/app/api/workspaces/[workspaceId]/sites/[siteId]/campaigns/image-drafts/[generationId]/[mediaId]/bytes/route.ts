import {workspaceApi} from '@/features/workspaces/api';
import {requireId,WorkspaceError} from '@/features/workspaces/store';
import {createMediaServiceClient} from '@/lib/supabase/media-service';
import {mediaVersionSchema} from '@/features/campaigns/private-media-upload-contracts';
import {readCampaignImageBytes} from '@/features/campaigns/campaign-image-store';
export const runtime='nodejs';
type Context={params:Promise<{workspaceId:string;siteId:string;generationId:string;mediaId:string}>};
export const GET=(r:Request,c:Context)=>workspaceApi(async({db,userId})=>{
 const p=await c.params;requireId(p.generationId);requireId(p.mediaId);
 const version=mediaVersionSchema.safeParse(new URL(r.url).searchParams.get('version'));if(!version.success)throw new WorkspaceError(400,'Choose a retained image version.');
 const result=await readCampaignImageBytes(db,createMediaServiceClient(),userId,p.workspaceId,p.siteId,p.generationId,p.mediaId,version.data);
 return new Response(new Uint8Array(result.bytes).buffer,{headers:{'Content-Type':result.descriptor.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`inline; filename="campaign-image-v${version.data}.${result.descriptor.mime==='image/png'?'png':'jpg'}"`}});
});
