import {z} from 'zod';
import {visualDocumentSchema} from './visual-contracts';
import {privateMediaDescriptorSchema,privateMediaReferenceSchema,resolvePrivateMedia,type PrivateMediaScope} from './private-media-contracts';
import type {VisualTarget} from './visual-layout';

export const mediaVisualTargets=['pin-1','pin-2','slide-1','slide-2','slide-3','slide-4','slide-5','slide-6','linkedin-1'] as const;
export type MediaVisualTarget=typeof mediaVisualTargets[number];
const attachment=z.object({target:z.enum(mediaVisualTargets),reference:privateMediaReferenceSchema,descriptor:privateMediaDescriptorSchema}).strict().refine(value=>value.reference.sha256===value.descriptor.sha256,'Image hash must match its reference.');
/** Working-copy format only. Existing campaign save RPCs deliberately accept v1–v3. */
export const mediaVisualDocumentSchema=z.object({schema:z.literal('campaign-media-working-copy-v1'),document:visualDocumentSchema,attachments:z.array(attachment).max(9)}).strict().superRefine((value,ctx)=>{
 const targets=new Set<string>(),images=new Set<string>();
 for(const item of value.attachments){
  if(targets.has(item.target))ctx.addIssue({code:'custom',message:'One image per target.',path:['attachments']});
  targets.add(item.target);images.add(`${item.reference.mediaId}:${item.reference.version}`);
  if(item.target==='linkedin-1'&&value.document.schema==='campaign-visuals-v1')ctx.addIssue({code:'custom',message:'Add the LinkedIn image first.',path:['attachments']});
 }
 if(images.size>3)ctx.addIssue({code:'custom',message:'Use at most three distinct images per working copy.',path:['attachments']});
});
export type MediaVisualDocument=z.infer<typeof mediaVisualDocumentSchema>;
const revision=z.object({version:z.number().int().min(1).max(50),baseVisualVersion:z.number().int().min(1).max(50),sourceReviewVersion:z.number().int().positive(),document:mediaVisualDocumentSchema,occurredAt:z.string()}).strict();
export const campaignImageRecordSchema=z.object({generationId:z.uuid(),version:z.number().int().min(1).max(50),baseVisualVersion:z.number().int().min(1).max(50),sourceReviewVersion:z.number().int().positive(),document:mediaVisualDocumentSchema,updatedAt:z.string(),revisions:z.array(revision).max(50)}).strict();
export type CampaignImageRecord=z.infer<typeof campaignImageRecordSchema>;
export const saveCampaignImageSchema=z.object({generationId:z.uuid(),expectedVersion:z.number().int().min(0).max(50),baseVisualVersion:z.number().int().min(1).max(50),sourceReviewVersion:z.number().int().positive(),document:mediaVisualDocumentSchema,reviewed:z.literal(true),shareReviewed:z.literal(true)}).strict();
export function mediaTargetKey(target:VisualTarget):MediaVisualTarget {
 const key=`${target.kind}-${target.index+1}`;
 return z.enum(mediaVisualTargets).parse(key);
}
export function mediaTarget(key:MediaVisualTarget):VisualTarget {
 z.enum(mediaVisualTargets).parse(key);
 const [kind,index]=key.split('-');
 return kind==='pin'?{kind,index:Number(index)-1 as 0|1}:kind==='linkedin'?{kind,index:0}:{kind:'slide',index:Number(index)-1};
}
export function attachReviewedMedia(raw:unknown,target:MediaVisualTarget,record:unknown,scope:PrivateMediaScope,reference:unknown):MediaVisualDocument {
 const value=mediaVisualDocumentSchema.parse(raw),copy=resolvePrivateMedia(record,scope,reference);
 return mediaVisualDocumentSchema.parse({...value,attachments:[...value.attachments.filter(item=>item.target!==target),{target,reference:copy.reference,descriptor:copy.descriptor}]});
}
