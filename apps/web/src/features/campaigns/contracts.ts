import { z } from "zod";
const text = (max: number) => z.string().max(max);
export const campaignDocumentSchema = z.object({
 title: z.string().trim().min(1).max(120), brief: z.string().trim().min(1).max(4000),
 blog: text(24000), pinterest: text(2000), linkedin: text(5000),
}).strict();
export const saveCampaignSchema = z.object({id:z.uuid(),expectedVersion:z.number().int().min(0),document:campaignDocumentSchema}).strict();
export const campaignRecordSchema = z.object({id:z.uuid(),site_id:z.uuid(),document:campaignDocumentSchema,version:z.number().int().positive(),updated_at:z.string(),updated_by:z.uuid().nullable()});
export type CampaignDocument = z.infer<typeof campaignDocumentSchema>;
export type CampaignRecord = z.infer<typeof campaignRecordSchema>;
export const starterCampaign: CampaignDocument = {
 title: "AI SEO workflow for a small business",
 brief: "Audience: freelancers and small business owners. Explain a practical AI-assisted SEO workflow. Create a blog, Pinterest copy and a LinkedIn post. Use only approved site knowledge. Avoid invented statistics, guarantees and unsupported product claims. End with a relevant next step to explore Do It With AI Tools. These are drafts for human review; do not publish.",
 blog:"",pinterest:"",linkedin:""
};
