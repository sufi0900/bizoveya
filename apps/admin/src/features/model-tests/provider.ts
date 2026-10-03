import {generateText} from 'ai';
import {createOpenAI} from '@ai-sdk/openai';
import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import {createGoogleGenerativeAI} from '@ai-sdk/google';
import {slots,type ProfileDocument} from '../models/contracts';
import {prompt,type TestResult} from './contracts';
const allowedOrigins=new Set(['https://api.openai.com','https://api.tokenfactory.nebius.com','https://generativelanguage.googleapis.com']);
export const restrictedFetch:typeof fetch=(input,init)=>{const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);if(!allowedOrigins.has(url.origin))throw new Error('Unsupported provider origin');return fetch(input,{...init,redirect:'error'});};
export async function testProvider(d:ProfileDocument,env:Record<string,string|undefined>):Promise<TestResult>{
 const apiKey=env[slots[d.provider].variable]?.trim();if(!apiKey)throw new Error('Provider key unavailable');
 const model=d.provider==='openai'?createOpenAI({apiKey,fetch:restrictedFetch}).responses(d.modelId):d.provider==='gemini'?createGoogleGenerativeAI({apiKey,fetch:restrictedFetch})(d.modelId):createOpenAICompatible({name:'nebius',apiKey,baseURL:'https://api.tokenfactory.nebius.com/v1',fetch:restrictedFetch}).chatModel(d.modelId);
 const signal=AbortSignal.timeout(20000);
 try{const result=await generateText({model,prompt,maxOutputTokens:128,maxRetries:0,abortSignal:signal,...(d.provider==='openai'?{providerOptions:{openai:{store:false}}}:{})});const usage=(n:number|undefined)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=2000000?n:null;
 return {code:result.text.trim()==='BIZOVEYA_OK'?'response_matched':'unexpected_response',inputTokens:usage(result.usage.inputTokens),outputTokens:usage(result.usage.outputTokens)};
 }catch{return {code:signal.aborted?'timeout':'provider_error',inputTokens:null,outputTokens:null};}
}
