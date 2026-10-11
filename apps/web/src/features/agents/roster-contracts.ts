import { z } from 'zod';
import { previewAgentSchema } from '@bizoveya/agent-contract';
export const rosterKinds=['coordinator','content','quality'] as const;
const agent=z.object({kind:z.enum(rosterKinds),agentId:z.uuid(),agentVersion:z.number().int().positive().max(999999999)}).strict();
export const rosterDocumentSchema=z.object({enabled:z.boolean(),agents:z.array(agent).max(3)}).strict().refine(d=>(d.agents.length===0||d.agents.length===3)&&(!d.enabled||d.agents.length===3)&&new Set(d.agents.map(a=>a.kind)).size===d.agents.length&&new Set(d.agents.map(a=>a.agentId.toLowerCase())).size===d.agents.length);
export const rosterReviewSchema=z.object({document:rosterDocumentSchema,expectedVersion:z.number().int().min(0).max(50),reason:z.string().trim().min(1).max(500).refine(s=>!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s)),reviewed:z.literal(true)}).strict();
export const rosterRecordSchema=z.object({version:z.number().int().min(0).max(50),document:rosterDocumentSchema.nullable(),catalog:z.array(previewAgentSchema),history:z.array(z.object({version:z.number().int().positive(),document:rosterDocumentSchema,reason:z.string(),actorId:z.uuid(),createdAt:z.string()}).strict()).max(50)}).strict();
export type SiteRoster=z.infer<typeof rosterRecordSchema>;
