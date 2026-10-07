import {z} from 'zod';
import {canAcceptOutput,type OutputRecord} from './output-contracts';

const text=(max:number)=>z.string().trim().min(1).max(max).refine(value=>!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value),'Remove hidden control characters.');
const pin=z.object({title:text(120),body:text(600)}).strict();
const slide=z.object({title:text(100),body:text(420)}).strict();
export const visualDocumentSchema=z.object({
 schema:z.literal('campaign-visuals-v1'),
 brand:z.object({name:text(60),accent:z.string().regex(/^#[0-9a-fA-F]{6}$/,'Use a six-digit hex color.'),footer:text(100)}).strict(),
 pins:z.tuple([pin,pin]),slides:z.array(slide).length(6),
}).strict();
export type VisualDocument=z.infer<typeof visualDocumentSchema>;
const revisionSchema=z.object({version:z.number().int().positive(),sourceReviewVersion:z.number().int().positive(),document:visualDocumentSchema,occurredAt:z.string()}).strict();
export const visualRecordSchema=z.object({generationId:z.uuid(),version:z.number().int().positive(),sourceReviewVersion:z.number().int().positive(),document:visualDocumentSchema,updatedAt:z.string(),revisions:z.array(revisionSchema).max(50)}).strict();
export type VisualRecord=z.infer<typeof visualRecordSchema>;
export const saveVisualSchema=z.object({generationId:z.uuid(),expectedVersion:z.number().int().nonnegative(),sourceReviewVersion:z.number().int().positive(),reviewed:z.literal(true),document:visualDocumentSchema}).strict();
export function canComposeVisuals(record:OutputRecord){return canAcceptOutput(record)&&record.reviews[0]?.decision==='accepted';}

/** Starter excerpts only: preserve source words rather than inventing social claims. */
export function starterVisuals(record:OutputRecord,brandName:string):VisualDocument {
 const {content}=record.output.stages;
 const words=content.linkedin.post.trim().split(/\s+/).filter(Boolean);
 const sentences=content.linkedin.post.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
 const groups=sentences.length>=6?Array.from({length:6},(_,index)=>sentences.slice(Math.floor(index*sentences.length/6),Math.floor((index+1)*sentences.length/6)).join(' ')):Array.from({length:6},(_,index)=>words.slice(Math.floor(index*words.length/6),Math.floor((index+1)*words.length/6)).join(' '));
 return {schema:'campaign-visuals-v1',brand:{name:brandName.slice(0,60)||'Your brand',accent:'#5271FF',footer:'Private draft · review before sharing'},
  pins:[{title:content.pinterest.title,body:content.pinterest.description},{title:content.pinterest.title,body:content.pinterest.description}],
  slides:groups.map((body,index)=>({title:index===0?content.blog.title.slice(0,100):body.split(/\s+/).slice(0,5).join(' ').replace(/[.!?,;:]$/,'').slice(0,100)||`From the draft · ${index+1}`,body})),
 };
}
