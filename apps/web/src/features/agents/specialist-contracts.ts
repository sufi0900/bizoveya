import { z } from 'zod';
import { previewAgentSchema } from '@bizoveya/agent-contract';

export const specialistChannels = ['blog', 'pinterest', 'linkedin'] as const;
const assignmentSchema = z.object({ channel: z.enum(specialistChannels), agentId: z.uuid(), agentVersion: z.number().int().positive().max(999999999) }).strict();
export const specialistRosterDocumentSchema = z.object({ enabled: z.boolean(), assignments: z.array(assignmentSchema).max(3) }).strict().refine(value => {
  const channels = new Set(value.assignments.map(item => item.channel));
  return (value.assignments.length === 0 || value.assignments.length === 3)
    && (!value.enabled || value.assignments.length === 3)
    && channels.size === value.assignments.length
    && (!value.enabled || specialistChannels.every(channel => channels.has(channel)));
});
export const specialistRosterReviewSchema = z.object({
  document: specialistRosterDocumentSchema,
  expectedVersion: z.number().int().min(0).max(50),
  reason: z.string().trim().min(10).max(500),
  reviewed: z.literal(true),
}).strict();
const historySchema = z.object({ version: z.number().int().positive(), document: specialistRosterDocumentSchema, reason: z.string(), actorId: z.uuid(), createdAt: z.string() }).strict();
export const specialistRosterRecordSchema = z.object({ version: z.number().int().min(0).max(50), document: specialistRosterDocumentSchema.nullable(), catalog: z.array(previewAgentSchema), history: z.array(historySchema).max(50) }).strict();
export const specialistDelegationInputSchema = z.object({ id: z.uuid(), expectedVersion: z.number().int().positive().max(99), reason: z.string().trim().min(10).max(500), reviewed: z.literal(true) }).strict();
export const channelDelegationSchema = z.object({
  requestId: z.uuid(), sourceVersion: z.number().int().positive().max(99), rosterVersion: z.number().int().positive().max(50),
  instruction: z.string().min(1).max(2000), reason: z.string().min(1).max(500),
  assignments: z.array(z.object({ channel: z.enum(specialistChannels), specialistKind: z.literal('content'), agentId: z.uuid(), agentVersion: z.number().int().positive(), state: z.literal('delegated') }).strict()).min(1).max(3),
  actorId: z.uuid(), createdAt: z.string(),
}).strict();
const specialistRuntimeStateSchema = z.enum(['prepared', 'running', 'awaiting_human_review', 'accepted', 'changes_requested', 'failed', 'recovery_required', 'cancelled']);
export const specialistRuntimeSchema = z.object({
  runId: z.uuid(), delegationSourceVersion: z.number().int().positive(), rosterVersion: z.number().int().positive(),
  campaignId: z.uuid(), campaignVersion: z.number().int().positive(), executionMode: z.literal('shared-content-stage'), providerCallsPerContentStage: z.literal(1), actorId: z.uuid(), createdAt: z.string(),
  sharedContentExecution: z.object({ agentId: z.uuid(), agentVersion: z.number().int().positive(), status: z.string(), spendingState: z.string() }).strict(),
  channels: z.array(z.object({ channel: z.enum(specialistChannels), specialistKind: z.literal('content'), agentId: z.uuid(), agentVersion: z.number().int().positive(), state: specialistRuntimeStateSchema, outputAvailable: z.boolean() }).strict()).min(1).max(3),
}).strict();
export type SpecialistRoster = z.infer<typeof specialistRosterRecordSchema>;
