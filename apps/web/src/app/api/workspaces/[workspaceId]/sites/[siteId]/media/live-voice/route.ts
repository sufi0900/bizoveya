import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { liveVoiceCommandSchema } from '@/features/voice/gemini-live-contracts';
import { startLiveVoice } from '@/features/voice/gemini-live-server';
import { WorkspaceError, getSite } from '@/features/workspaces/store';
import { mediaRequestSchema } from '@bizoveya/agent-contract';
export const dynamic='force-dynamic';
type Context={params:Promise<{workspaceId:string;siteId:string}>};
export const POST=(request:Request,context:Context)=>workspaceApi(async({db,userId})=>{const p=await context.params,input=await readInput(request,liveVoiceCommandSchema,4096);if(input.action==='start')return workspaceJson(await startLiveVoice(db,userId,p.workspaceId,p.siteId,input));const site=await getSite(db,userId,p.workspaceId,p.siteId);if(site.workspace.role!=='owner')throw new WorkspaceError(403,'Only the workspace owner can close a voice session.');const result=await db.rpc('bz_close_media_voice_session',{p_workspace_id:p.workspaceId,p_site_id:p.siteId,p_id:input.id,p_input:input.input});if(result.error)throw new WorkspaceError(['42P01','PGRST202'].includes(result.error.code??'')?503:409,'Voice session closure could not be recorded. Review its durable media state before starting another session.');return workspaceJson(mediaRequestSchema.parse(result.data));});
