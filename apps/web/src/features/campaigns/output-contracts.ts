import {z} from 'zod';
import {campaignPlanSchema,campaignDraftBundleSchema,campaignQualitySchema} from '@bizoveya/agent-contract';
export const generatedOutputSchema=z.object({schema:z.literal('campaign-generation-output-v1'),stages:z.object({coordinator:campaignPlanSchema,content:campaignDraftBundleSchema,quality:campaignQualitySchema}).strict()}).strict();
export const outputRecordSchema=z.object({id:z.uuid(),campaignId:z.uuid(),campaignVersion:z.number().int().positive(),status:z.enum(['prepared','running','succeeded','failed','cancelled']),output:generatedOutputSchema,reviews:z.array(z.object({version:z.number().int().positive(),decision:z.enum(['accepted','changes_requested']),reason:z.string(),occurredAt:z.string()}))});
export type OutputRecord=z.infer<typeof outputRecordSchema>;
export function canAcceptOutput(record:OutputRecord){return record.status==='succeeded'&&record.output.stages.quality.approved&&!record.output.stages.quality.issues.some(i=>i.severity==='blocker');}
