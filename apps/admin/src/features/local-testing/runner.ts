import {z} from 'zod';
import {agentKinds,type AgentKind} from '@bizoveya/agent-contract';
import {outputSchemas,stagePrompt,validateOutput,type Snapshot,type ProviderResult} from '../generation/contracts';
import {usageToken} from '../generation/diagnostics';

// Deliberately fixed loopback transport. Never accepts a remote URL, credentials or tools.
export async function ollamaStage(kind:AgentKind,snapshot:Snapshot,prior:Record<string,unknown>,model:string,signal:AbortSignal,transport:typeof fetch=fetch):Promise<ProviderResult>{
 const stage=snapshot.stages.find(s=>s.kind===kind)!;
 const outputLimit=Math.min(stage.agent.maxOutputTokens,stage.profile.maxOutputTokens,4096);
 const {instructions,prompt}=stagePrompt(kind,{execute:true,snapshot,prior,inputLimit:32768,outputLimit});
 let inputTokens:number|null=null,outputTokens:number|null=null;
 let phase:'transport'|'response'|'output'='transport';
 const boundedSignal=AbortSignal.any([signal,AbortSignal.timeout(300000)]);
 try{
  const response=await transport('http://127.0.0.1:11434/api/chat',{method:'POST',redirect:'error',signal:boundedSignal,headers:{'Content-Type':'application/json'},body:JSON.stringify({model,stream:false,think:false,messages:[{role:'system',content:instructions},{role:'user',content:prompt}],format:z.toJSONSchema(outputSchemas[kind],{unrepresentable:'any'}),options:{temperature:0,num_predict:outputLimit,num_ctx:16384}})});
  if(!response.ok)return {output:null,error:response.status===404?'local_model_missing':'local_provider_error',inputTokens,outputTokens};
  phase='response';
  // Bound the streamed response before JSON parsing, including any unwanted thinking text.
  const reader=response.body?.getReader();if(!reader)throw Error('empty');let text='';let size=0;const decoder=new TextDecoder();
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>262144){await reader.cancel();throw Error('large');}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{reader.releaseLock();}
  const data=JSON.parse(text);inputTokens=usageToken(data.prompt_eval_count);outputTokens=usageToken(data.eval_count);
  if(data.done!==true||data.done_reason!=='stop')return {output:null,error:data.done_reason==='length'?'output_limit':'local_incomplete',inputTokens,outputTokens};
  if(data.model!==model)return {output:null,error:'local_model_mismatch',inputTokens,outputTokens};
  if(outputTokens!==null&&outputTokens>outputLimit)return {output:null,error:'output_limit',inputTokens,outputTokens};
  phase='output';
  const output=validateOutput(kind,JSON.parse(data.message.content),snapshot);
  return {output,error:null,inputTokens,outputTokens};
 }catch{return {output:null,error:signal.aborted?'cancelled':boundedSignal.aborted?'local_timeout':phase==='transport'?'local_connection_failed':phase==='response'?'local_response_invalid':'local_output_invalid',inputTokens,outputTokens};}
}

export function fixtureStage(kind:AgentKind,snapshot:Snapshot):ProviderResult{
 const source=snapshot.knowledge[0],fact=source.facts[0];
 if(!fact)throw Error('Fixture requires an approved fact');
 const citation={sourceId:source.sourceId,sourceVersion:source.sourceVersion,factId:fact.id};
 const output={coordinator:{schema:'campaign-plan-v1',topic:'Synthetic workflow fixture',audience:'Internal testers',objective:'Exercise validation only',requiredFacts:[citation],channelNotes:{blog:'Fixture',pinterest:'Fixture',linkedin:'Fixture'}},content:{schema:'campaign-drafts-v1',blog:{title:'Synthetic fixture',summary:'Validation fixture, not AI work.',body:fact.text,citations:[citation]},pinterest:{title:'Synthetic fixture',description:fact.text.slice(0,450),altText:'Synthetic fixture',citations:[citation]},linkedin:{post:fact.text,citations:[citation]}},quality:{schema:'campaign-quality-v1',approved:false,issues:[{channel:'shared',severity:'warning',message:'Synthetic fixture: no AI quality review occurred.'}],checkedCitations:[citation]}}[kind];
 return {output:validateOutput(kind,output,snapshot),error:null,inputTokens:null,outputTokens:null};
}

export async function rehearse(snapshot:Snapshot,mode:'ollama'|'fixture',model:string,signal:AbortSignal,transport:typeof fetch=fetch,checkpoint?:(stages:({kind:AgentKind}&ProviderResult)[])=>Promise<void>){
 const prior:Record<string,unknown>={};const stages:({kind:AgentKind}&ProviderResult)[]=[];
 for(const kind of agentKinds){
  if(signal.aborted)return {status:'cancelled',stages};
  const result=mode==='fixture'?fixtureStage(kind,snapshot):await ollamaStage(kind,snapshot,prior,model,signal,transport);
  stages.push({kind,...result});await checkpoint?.(stages);if(result.error)return {status:'failed',stages};prior[kind]=result.output;
 }
 return {status:mode==='fixture'?'synthetic_workflow_checked':'local_outputs_for_review',stages};
}
