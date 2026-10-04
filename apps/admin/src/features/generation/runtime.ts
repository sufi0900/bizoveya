import type {SupabaseClient} from '@supabase/supabase-js';
import {agentKinds,type AgentKind} from '@bizoveya/agent-contract';
import {slots} from '../models/contracts';
import {claimSchema,stagePrompt,validateOutput,type Claim,type ProviderResult} from './contracts';
import {generateStage} from './provider';
export type RuntimeDependencies={recorder:Pick<SupabaseClient,'rpc'>;env:Record<string,string|undefined>;provider?:(kind:AgentKind,claim:Claim,env:Record<string,string|undefined>)=>Promise<ProviderResult>;beforeStage?:()=>Promise<unknown>;uuid?:()=>string};
/** Server module only. No route imports it yet; activation/review wiring is the next checkpoint. */
export async function executeGeneration(generationId:string,actorId:string,deps:RuntimeDependencies){
 if(deps.env.BIZOVEYA_ENABLE_CAMPAIGN_GENERATION!=='true')return {status:'disabled' as const};
 const uuid=deps.uuid??(()=>crypto.randomUUID());
 for(const kind of agentKinds){
  await deps.beforeStage?.();
  const id=uuid(),claim=uuid();
  const begin=await deps.recorder.rpc('bz_claim_campaign_generation_stage',{p_generation_id:generationId,p_stage_id:id,p_kind:kind,p_claim:claim,p_actor_id:actorId});
  if(begin.error)throw new Error('Generation prerequisites changed or reservation unavailable');
  const parsed=claimSchema.safeParse(begin.data);
  if(!parsed.success){
   // A successful claim may already hold cost. Never retry an undecodable claim.
   await deps.recorder.rpc('bz_finish_campaign_generation_stage',{p_stage_id:id,p_claim:claim,p_output:null,p_error_code:'invalid_runtime_context',p_input_tokens:null,p_output_tokens:null});
   throw new Error('Invalid generation context; operator review required');
  }
  if(!parsed.data.execute){if(parsed.data.status==='succeeded'&&parsed.data.spendingState==='settled')continue;return {status:'already_claimed' as const};}
  const context=parsed.data;let result:ProviderResult;let request:{instructions:string;prompt:string};
  try{
   request=stagePrompt(kind,context);
   const profile=context.snapshot.stages.find(s=>s.kind===kind)!.profile;
   if(!deps.env[slots[profile.provider].variable]?.trim())throw new Error('Key missing');
  }catch{
   const saved=await deps.recorder.rpc('bz_cancel_unstarted_generation_stage',{p_stage_id:id,p_claim:claim});
   if(saved.error)throw new Error('Failed to record preflight failure');
   return {status:'failed' as const,stage:kind};
  }
  const started=await deps.recorder.rpc('bz_record_generation_request',{p_stage_id:id,p_claim:claim,p_request:{runtimeVersion:'draft-runtime-v1-ai7.0.127',instructions:request.instructions,prompt:request.prompt,outputSchema:kind,maxOutputTokens:context.outputLimit}});
  if(started.error)throw new Error('Could not durably record provider request; no request sent');
  try{result=await (deps.provider??generateStage)(kind,context,deps.env);}catch{result={output:null,error:'provider_error',inputTokens:null,outputTokens:null};}
  if(!result.error){try{result.output=validateOutput(kind,result.output,context.snapshot);}catch{result={...result,output:null,error:'invalid_output'};}}
  const finish=await deps.recorder.rpc('bz_finish_campaign_generation_stage',{p_stage_id:id,p_claim:claim,p_output:result.output,p_error_code:result.error,p_input_tokens:result.inputTokens,p_output_tokens:result.outputTokens});
  if(finish.error)throw new Error('Result settlement unavailable; do not retry provider execution');
  if(result.error||result.inputTokens===null||result.outputTokens===null||result.inputTokens>context.inputLimit||result.outputTokens>context.outputLimit)return {status:'failed' as const,stage:kind};
 }
 return {status:'completed_for_human_review' as const};
}
