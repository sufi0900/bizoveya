import { z } from 'zod';
import { campaignDocumentSchema } from '../campaigns/contracts';
const text = (max: number) => z.string().trim().min(1).max(max).refine(value => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value));
export const channels = ['blog', 'pinterest', 'linkedin'] as const;
const participants = z.array(z.enum(['coordinator', 'content', 'quality'])).min(1).max(3).refine(values => new Set(values).size === values.length);
export const agencyCommandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('request'), id: z.uuid(), instruction: text(2000), channels: z.array(z.enum(channels)).min(1).max(3).refine(values => new Set(values).size === values.length), reviewed: z.literal(true), inputMode: z.enum(['text', 'corrected-transcript']) }).strict(),
  z.object({ action: z.literal('meeting'), id: z.uuid(), agenda: text(2000), mode: z.enum(['announcement', 'deliberation']), participants, reviewed: z.literal(true), inputMode: z.enum(['text', 'corrected-transcript']) }).strict(),
  z.object({ action: z.enum(['accept-decision', 'defer', 'cancel']), id: z.uuid(), expectedVersion: z.number().int().positive(), reason: text(500), reviewed: z.literal(true) }).strict(),
]);
export type AgencyCommand = z.infer<typeof agencyCommandSchema>;
export const agencyHandoffSchema = z.object({ id: z.uuid(), campaignId: z.uuid(), expectedVersion: z.number().int().min(1).max(100), title: text(120).refine(value => !/[\u0000-\u001f]/.test(value)), reviewed: z.literal(true) }).strict();
export const agencyRecordSchema = z.object({
  id: z.uuid(), kind: z.enum(['request', 'meeting']), version: z.number().int().positive(),
  status: z.enum(['proposed', 'decision-recorded', 'deferred', 'cancelled']),
  document: z.record(z.string(), z.unknown()), snapshot: z.record(z.string(), z.unknown()),
  createdAt: z.string(), events: z.array(z.object({ version: z.number().int().positive(), action: z.string(), reason: z.string().nullable(), actorId: z.uuid(), createdAt: z.string() }).strict()),
  handoff: z.object({ campaignId: z.uuid(), sourceVersion: z.number().int().positive(), title: text(120), document: campaignDocumentSchema, actorId: z.uuid(), createdAt: z.string() }).strict().nullable().default(null),
}).strict();
export const agencyInventorySchema = z.array(agencyRecordSchema).max(64);
export type AgencyRecord = z.infer<typeof agencyRecordSchema>;
export const voiceEntryState = Object.freeze({ enabled: false, reason: 'Business voice transcription and speech providers have not been qualified. Paste and correct a transcript, then explicitly confirm the same text command.' });
// Preparing work is deterministic and costs no model call. Tasks are proposals, never fake specialist results.
export function delegationProposal(input: Extract<AgencyCommand, { action: 'request' }>) {
  return input.channels.map(channel => ({ channel, role: 'content' as const, state: 'proposed' as const, requires: ['current-approved-knowledge', 'qualified-role-binding', 'budget-admission', 'human-review'] }));
}
