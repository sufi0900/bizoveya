import {z} from 'zod';
import {campaignDraftBundleSchema,campaignQualitySchema,campaignPlanSchema} from '@bizoveya/agent-contract';
export function localCustomerEnabled(env:Record<string,string|undefined>){return env.NODE_ENV==='development'&&!env.VERCEL&&env.BIZOVEYA_ENABLE_LOCAL_TESTING==='true';}
export function isLocalOrigin(value:string){try{const u=new URL(value);return u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false;}}
export const localRunInput=z.object({id:z.uuid(),requestId:z.uuid(),mode:z.enum(['ollama','fixture']),reason:z.string().trim().min(10).max(300),reviewed:z.literal(true)}).strict();
export const localReviewInput=localRunInput.extend({decision:z.enum(['accepted','changes_requested']),expectedVersion:z.number().int().nonnegative(),reviewReason:z.string().trim().min(10).max(300)}).strict();
export const localRequest=z.discriminatedUnion('action',[localRunInput.extend({action:z.literal('run')}),localRunInput.extend({action:z.literal('read')}),localReviewInput.extend({action:z.literal('review')})]);
const review=z.object({version:z.number().int().positive(),decision:z.enum(['accepted','changes_requested']),reason:z.string(),at:z.string()});
export const localReceipt=z.object({schema:z.literal('local-rehearsal-v1'),requestId:z.uuid(),snapshotId:z.uuid(),mode:z.enum(['ollama','fixture']),provider:z.enum(['ollama-loopback','synthetic']),model:z.string().nullable(),productionAcceptance:z.literal(false),productionWrites:z.literal(false),fingerprint:z.string().optional(),reason:z.string().optional(),startedAt:z.string().optional(),finishedAt:z.string().optional(),status:z.enum(['started','running','failed','cancelled','synthetic_workflow_checked','local_outputs_for_review']),stages:z.array(z.object({kind:z.enum(['coordinator','content','quality']),output:z.unknown(),error:z.string().nullable(),inputTokens:z.number().nullable(),outputTokens:z.number().nullable()})),error:z.string().optional(),reviews:z.array(review).default([])});
export {campaignDraftBundleSchema,campaignQualitySchema,campaignPlanSchema};
export type LocalReceipt=z.infer<typeof localReceipt>;

export function newerLocalReceipt(current:LocalReceipt|null,next:LocalReceipt):LocalReceipt{
 if(!current||current.requestId!==next.requestId)return next;
 const terminal=(v:LocalReceipt)=>!['started','running'].includes(v.status);
 if((terminal(current)&&!terminal(next))||current.stages.length>next.stages.length||current.reviews.length>next.reviews.length)return current;
 return next;
}
