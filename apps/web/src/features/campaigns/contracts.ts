import { z } from "zod";
const text = (max: number) => z.string().max(max);
export const campaignDocumentSchema = z.object({
 title: z.string().trim().min(1).max(120), brief: z.string().trim().min(1).max(4000),
 blog: text(24000), pinterest: text(2000), linkedin: text(5000),
}).strict();
export const saveCampaignSchema = z.object({id:z.uuid(),expectedVersion:z.number().int().min(0),document:campaignDocumentSchema}).strict();
export const prepareGenerationSchema = z.object({id:z.uuid(),campaignId:z.uuid(),expectedCampaignVersion:z.number().int().positive()}).strict();
export const campaignRecordSchema = z.object({id:z.uuid(),site_id:z.uuid(),document:campaignDocumentSchema,version:z.number().int().positive(),updated_at:z.string(),updated_by:z.uuid().nullable()});
const generationStageSummarySchema=z.object({id:z.uuid(),kind:z.enum(["coordinator","content","quality"]),status:z.enum(["reserved","succeeded","failed"]),spendingState:z.enum(["reserved","settled","unknown","overrun","reconciled"]),createdAt:z.string(),finishedAt:z.string().nullable()}).strict();
export const generationSummarySchema = z.object({id:z.uuid(),campaignId:z.uuid(),campaignVersion:z.number().int().positive(),status:z.enum(["prepared","running","succeeded","failed","cancelled"]),createdAt:z.string(),startedAt:z.string().nullable(),finishedAt:z.string().nullable(),stageCount:z.number().int().min(0),outputAvailable:z.boolean(),stages:z.array(generationStageSummarySchema).default([])});
export type CampaignDocument = z.infer<typeof campaignDocumentSchema>;
export type CampaignRecord = z.infer<typeof campaignRecordSchema>;
export type GenerationSummary = z.infer<typeof generationSummarySchema>;
export const starterCampaign: CampaignDocument = {
 title: "AI SEO workflow for a small business",
 brief: "Audience: freelancers and small business owners. Explain a practical AI-assisted SEO workflow. Create a blog, Pinterest copy and a LinkedIn post. Use only approved site knowledge. Avoid invented statistics, guarantees and unsupported product claims. End with a relevant next step to explore Do It With AI Tools. These are drafts for human review; do not publish.",
 blog:"",pinterest:"",linkedin:""
};
export const reviewGenerationSchema=z.object({id:z.uuid(),expectedVersion:z.number().int().nonnegative(),decision:z.enum(['accepted','changes_requested']),reason:z.string().trim().min(10).max(300).refine(s=>!/[\u0000-\u001f]/.test(s))}).strict();
