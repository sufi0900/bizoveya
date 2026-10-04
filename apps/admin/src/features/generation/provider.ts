import {ToolLoopAgent,Output,isStepCount} from 'ai';
import {createGoogleGenerativeAI} from '@ai-sdk/google';
import {createOpenAI} from '@ai-sdk/openai';
import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import type {AgentKind} from '@bizoveya/agent-contract';
import {slots} from '../models/contracts';
import {restrictedFetch} from '../model-tests/provider';
import {outputSchemas,stagePrompt,type Claim,type ProviderResult} from './contracts';
export async function generateStage(kind:AgentKind,claim:Claim,env:Record<string,string|undefined>):Promise<ProviderResult>{
 const {instructions,prompt,stage}=stagePrompt(kind,claim);const d=stage.profile;
 const apiKey=env[slots[d.provider].variable]?.trim();if(!apiKey)throw new Error('Provider key unavailable');
 const model=d.provider==='gemini'?createGoogleGenerativeAI({apiKey,fetch:restrictedFetch})(d.modelId):d.provider==='openai'?createOpenAI({apiKey,fetch:restrictedFetch}).responses(d.modelId):createOpenAICompatible({name:'nebius',apiKey,baseURL:'https://api.tokenfactory.nebius.com/v1',fetch:restrictedFetch}).chatModel(d.modelId);
 const signal=AbortSignal.timeout(20000);
 const agent=new ToolLoopAgent({model,instructions,stopWhen:isStepCount(1),maxRetries:0,maxOutputTokens:claim.outputLimit,output:Output.object<unknown>({schema:outputSchemas[kind]}),...(d.provider==='openai'?{providerOptions:{openai:{store:false}}}:{})});
 try{const result=await agent.generate({prompt,abortSignal:signal});const token=(n:number|undefined)=>Number.isInteger(n)&&n!>=0&&n!<=2000000?n!:null;
 return {output:result.output,error:null,inputTokens:token(result.totalUsage.inputTokens),outputTokens:token(result.totalUsage.outputTokens)};
 }catch{return {output:null,error:signal.aborted?'timeout':'provider_or_output_error',inputTokens:null,outputTokens:null};}
}
