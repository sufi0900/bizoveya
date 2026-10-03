import {z} from 'zod';
export const bindingSchema=z.object({agent_id:z.uuid(),agent_version:z.number().int().positive(),profile_id:z.uuid(),profile_version:z.number().int().positive(),credential_version:z.number().int().positive(),test_id:z.uuid(),revision:z.number().int().positive(),enabled:z.boolean(),actor_id:z.uuid().nullable(),reason:z.string(),updated_at:z.string(),issue:z.string().nullable()});
export const bindingRegistrySchema=z.object({bindings:z.array(bindingSchema),events:z.array(z.object({id:z.uuid(),agent_id:z.uuid(),revision:z.number().int(),action:z.enum(['assign','disable']),actor_id:z.uuid().nullable(),reason:z.string(),occurred_at:z.string()}))});
export type BindingRegistry=z.infer<typeof bindingRegistrySchema>;
const common={agentId:z.uuid(),expectedRevision:z.number().int().nonnegative(),reviewed:z.literal(true),reason:z.string().trim().min(10).max(300).refine(v=>!/[\u0000-\u001f]/.test(v))};
export const bindingInputSchema=z.discriminatedUnion('action',[
 z.object({...common,action:z.literal('assign'),profileId:z.uuid(),testId:z.uuid(),agentRevision:z.number().int().positive(),profileRevision:z.number().int().positive(),credentialVersion:z.number().int().positive()}).strict(),
 z.object({...common,action:z.literal('disable')}).strict(),
]);
export type BindingInput=z.infer<typeof bindingInputSchema>;
export const issueLabels:Record<string,string>={disabled:'Assignment disabled',agent_changed:'Review and approve the latest agent version',profile_changed:'Model profile changed; reassign after testing',tier_mismatch:'Agent tier must match the model routing preference',credential_changed:'Credential reference changed or disabled',profile_unchecked:'Check the current model configuration',test_mismatch:'Select a matching successful model test',test_expired:'Connectivity evidence is older than 24 hours'};
