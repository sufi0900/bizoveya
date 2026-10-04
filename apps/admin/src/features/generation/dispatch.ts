import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {AdminError,requireAdmin} from '../admin/access';
import {executeGeneration,type RuntimeDependencies} from './runtime';
import {generationSetup,queueSchema,type DispatchInput} from './dispatch-contracts';
function check(error:{code?:string;message?:string}|null){if(!error)return;
 const messages:Record<string,string>={bz_generation_busy:'A run is already active. Refresh its status; do not send another request.',bz_generation_stale:'This snapshot uses old settings. Prepare a new snapshot after reviewing current assignments and knowledge.',bz_generation_finished:'This run is finished or stopped. Inspect its recorded result before preparing another run.',bz_forbidden:'Only the original requesting workspace owner can run this pilot.',bz_conflict:'The run changed. Refresh before continuing.'};
 if(['PGRST202','42P01'].includes(error.code??''))throw new AdminError(503,'SETUP_REQUIRED','Apply migration 037 after036.');
 throw new AdminError(error.code==='42501'?403:409,'RUN_BLOCKED',messages[error.message??'']??'Run storage or prerequisites are unavailable. Refresh and review setup.');
}
export async function loadGenerationRoom(db:SupabaseClient){const r=await db.rpc('bz_admin_generation_queue');check(r.error);return {runs:queueSchema.parse(r.data),setup:generationSetup(process.env)};}
export async function dispatchGeneration(db:SupabaseClient,actorId:string,input:DispatchInput,deps?:{env:Record<string,string|undefined>;recorder:SupabaseClient;execute:typeof executeGeneration}){
 const env=deps?.env??process.env;const setup=generationSetup(env);
 if(!setup.enabled)throw new AdminError(409,'GENERATION_DISABLED','Generation is disabled. Activate the admin-only pilot flag after completing setup.');
 if(!setup.recorderConfigured)throw new AdminError(503,'RECORDER_REQUIRED','Configure the admin-only recording key first.');
 await requireAdmin(db);
 const claim=crypto.randomUUID();const authorization=await db.rpc('bz_admin_authorize_generation',{p_id:input.id,p_claim:claim,p_reason:input.reason,p_reviewed:input.reviewed});check(authorization.error);
 const recorder=deps?.recorder??createClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 let result:Awaited<ReturnType<typeof executeGeneration>>;
 try{result=await(deps?.execute??executeGeneration)(input.id,actorId,{recorder,env,beforeStage:()=>requireAdmin(db)} satisfies RuntimeDependencies);}catch{
  const finished=await recorder.rpc('bz_finish_generation_dispatch',{p_id:input.id,p_claim:claim,p_result:'blocked'});check(finished.error);
  throw new AdminError(409,'RUN_STOPPED','Execution stopped. Review the run and spending records before taking any further action; do not retry blindly.');
 }
 const finish=await recorder.rpc('bz_finish_generation_dispatch',{p_id:input.id,p_claim:claim,p_result:result.status==='disabled'?'blocked':result.status});check(finish.error);
 return {result,runs:(await loadGenerationRoom(db)).runs};
}
