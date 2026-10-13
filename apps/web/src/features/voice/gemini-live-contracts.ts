import { z } from 'zod';
import { voiceSessionCloseSchema } from '@bizoveya/agent-contract';

const uuid=z.string().uuid();
export const liveVoiceCommandSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('start'),id:uuid,expectedQualificationVersion:z.number().int().min(1).max(50),reviewed:z.literal(true)}).strict(),
 z.object({action:z.literal('close'),id:uuid,input:voiceSessionCloseSchema}).strict(),
]);
export const liveVoiceTokenSchema=z.object({requestId:uuid,token:z.string().min(1).max(8192),modelId:z.string().min(1).max(120),expiresAt:z.iso.datetime({offset:true}),newSessionExpiresAt:z.iso.datetime({offset:true}),websocketEndpoint:z.string().url().startsWith('wss://'),setup:z.object({model:z.string(),responseModalities:z.tuple([z.literal('AUDIO')]),systemInstruction:z.object({parts:z.tuple([z.object({text:z.string()}).strict()])}).strict(),inputAudioTranscription:z.object({}).strict(),outputAudioTranscription:z.object({}).strict()}).strict()}).strict();
export type LiveVoiceToken=z.infer<typeof liveVoiceTokenSchema>;

export type LiveTranscriptItem={speaker:'founder'|'assistant';text:string};
export type LiveVoiceState='idle'|'connecting'|'listening'|'speaking'|'stopping'|'ended'|'error';

export function parseGeminiLiveMessage(raw:string){
 const value=JSON.parse(raw) as Record<string,unknown>;
 const content=value.serverContent&&typeof value.serverContent==='object'?value.serverContent as Record<string,unknown>:null;
 const text=(name:string)=>{const entry=content?.[name];return entry&&typeof entry==='object'&&typeof (entry as {text?:unknown}).text==='string'?(entry as {text:string}).text:'';};
 const audio:string[]=[];const turn=content?.modelTurn;
 if(turn&&typeof turn==='object'&&Array.isArray((turn as {parts?:unknown}).parts))for(const part of (turn as {parts:Array<Record<string,unknown>>}).parts){const data=part.inlineData&&typeof part.inlineData==='object'?(part.inlineData as {data?:unknown,mimeType?:unknown}):null;if(typeof data?.data==='string'&&typeof data.mimeType==='string'&&data.mimeType.startsWith('audio/pcm'))audio.push(data.data);}
 const usage=value.usageMetadata&&typeof value.usageMetadata==='object'?value.usageMetadata as Record<string,unknown>:content?.usageMetadata&&typeof content.usageMetadata==='object'?content.usageMetadata as Record<string,unknown>:null;
 const count=(...names:string[])=>{for(const name of names){const n=usage?.[name];if(Number.isSafeInteger(n)&&Number(n)>=0&&Number(n)<=2_000_000)return Number(n);}return null;};
 return {setupComplete:Boolean(value.setupComplete),inputText:text('inputTranscription'),outputText:text('outputTranscription'),audio,interrupted:content?.interrupted===true,turnComplete:content?.turnComplete===true,inputTokens:count('promptTokenCount','inputTokenCount'),outputTokens:count('responseTokenCount','candidatesTokenCount','outputTokenCount')};
}

export function floatToPcm16Base64(input:Float32Array,inputRate:number){
 const ratio=inputRate/16000,length=Math.max(1,Math.floor(input.length/ratio)),bytes=new Uint8Array(length*2),view=new DataView(bytes.buffer);
 for(let i=0;i<length;i++){const start=Math.floor(i*ratio),end=Math.max(start+1,Math.floor((i+1)*ratio));let sum=0;for(let j=start;j<end&&j<input.length;j++)sum+=input[j];const sample=Math.max(-1,Math.min(1,sum/Math.max(1,end-start)));view.setInt16(i*2,sample<0?sample*0x8000:sample*0x7fff,true);}
 let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary);
}

export function pcm16Base64ToFloat(value:string){
 const binary=atob(value),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);const view=new DataView(bytes.buffer),result=new Float32Array(Math.floor(bytes.length/2));for(let i=0;i<result.length;i++)result[i]=view.getInt16(i*2,true)/0x8000;return result;
}
