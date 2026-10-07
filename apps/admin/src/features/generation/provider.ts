import {providerFailure,usageToken} from './diagnostics';
import {geminiOutputSchema} from './gemini-schema';
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
 const agent=new ToolLoopAgent({model,instructions,stopWhen:isStepCount(1),maxRetries:0,maxOutputTokens:claim.outputLimit,output:Output.object<unknown>({schema:d.provider==='gemini'?geminiOutputSchema(kind):outputSchemas[kind]}),...(d.provider==='openai'?{providerOptions:{openai:{store:false}}}:{})});
 try{const result=await agent.generate({prompt,abortSignal:signal});
 const inputTokens=usageToken(result.totalUsage.inputTokens),outputTokens=usageToken(result.totalUsage.outputTokens);
 try{return {output:result.output,error:null,inputTokens,outputTokens};}catch(error){return {...providerFailure(error,signal.aborted),error:result.finishReason==='length'?'output_limit':'structured_output_invalid',inputTokens,outputTokens};}
 }catch(error){return providerFailure(error,signal.aborted);}
}
