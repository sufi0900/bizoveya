import {ToolLoopAgent,Output,isStepCount} from 'ai';
import {createGoogleGenerativeAI} from '@ai-sdk/google';
import {createOpenAI} from '@ai-sdk/openai';
import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import {slots} from '../models/contracts';
import {restrictedFetch} from '../model-tests/provider';
import {providerFailure,usageToken} from '../generation/diagnostics';
import {meetingTurnResultSchema} from './consent-contracts';
import {meetingTurnPrompt,type MeetingProviderResult,type MeetingTurnClaim} from './execution-contracts';
export async function generateMeetingTurn(claim:MeetingTurnClaim,env:Record<string,string|undefined>):Promise<MeetingProviderResult>{const d=claim.turn.profile,apiKey=env[slots[d.provider].variable]?.trim();if(!apiKey)throw new Error('Provider key unavailable');const model=d.provider==='gemini'?createGoogleGenerativeAI({apiKey,fetch:restrictedFetch})(d.modelId):d.provider==='openai'?createOpenAI({apiKey,fetch:restrictedFetch}).responses(d.modelId):createOpenAICompatible({name:'nebius',apiKey,baseURL:'https://api.tokenfactory.nebius.com/v1',fetch:restrictedFetch}).chatModel(d.modelId);const {instructions,prompt}=meetingTurnPrompt(claim),signal=AbortSignal.timeout(20000),agent=new ToolLoopAgent({model,instructions,stopWhen:isStepCount(1),maxRetries:0,maxOutputTokens:claim.outputLimit,output:Output.object({schema:meetingTurnResultSchema}),...(d.provider==='openai'?{providerOptions:{openai:{store:false}}}:{})});try{const result=await agent.generate({prompt,abortSignal:signal});return {output:result.output,error:null,inputTokens:usageToken(result.totalUsage.inputTokens),outputTokens:usageToken(result.totalUsage.outputTokens)}}catch(error){return providerFailure(error,signal.aborted)}}
