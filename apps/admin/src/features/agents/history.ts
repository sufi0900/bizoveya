import {z} from "zod";
import {agentDocumentSchema} from "@bizoveya/agent-contract";
export const historySchema=z.object({versions:z.array(z.object({version:z.number(),document:agentDocumentSchema,actor_id:z.string().nullable(),reason:z.string(),created_at:z.string(),checked:z.boolean()})),events:z.array(z.object({id:z.string(),version:z.number().nullable(),action:z.string(),actor_id:z.string().nullable(),reason:z.string(),occurred_at:z.string()}))});
export type AgentHistory=z.infer<typeof historySchema>;
