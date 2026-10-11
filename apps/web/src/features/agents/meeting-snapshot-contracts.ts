import { z } from 'zod';
const version = z.number().int().min(1).max(100);
export const meetingSnapshotReviewSchema = z.object({ id: z.uuid(), planId: z.uuid(), expectedMeetingVersion: version, expectedScheduleVersion: version }).strict().refine(value => value.id !== value.planId);
export const meetingSnapshotInputSchema = meetingSnapshotReviewSchema.safeExtend({ snapshotId: z.uuid(), fingerprint: z.string().regex(/^[a-f0-9]{64}$/), reviewed: z.literal(true) }).refine(value => value.snapshotId !== value.id && value.snapshotId !== value.planId);
export const meetingSnapshotSummarySchema = z.object({
  meetingId: z.uuid(), meetingVersion: version, planId: z.uuid(), scheduleVersion: version, rosterVersion: z.number().int().min(1).max(50),
  preferences: z.object({ version: z.number().int().nonnegative(), document: z.object({ brandVoice: z.string(), audience: z.string(), guidance: z.string() }).strict() }).strict(),
  knowledge: z.array(z.object({ sourceId: z.uuid(), sourceVersion: z.number().int().positive(), title: z.string(), facts: z.array(z.object({ id: z.string(), text: z.string() }).strict()), approvedAt: z.string() }).strict()).min(1),
  turns: z.array(z.object({ ordinal: z.number().int().min(1).max(6), round: z.number().int().min(1).max(2), role: z.enum(['coordinator', 'content', 'quality']), agentId: z.uuid(), agentVersion: z.number().int().positive(), bindingRevision: z.number().int().positive(), profileId: z.uuid(), profileVersion: z.number().int().positive(), connectivityTestId: z.uuid(), spendingPolicyVersion: z.number().int().positive(), pricingValidUntil: z.string(), estimatedCeilingMicros: z.number().int().min(0).max(250000) }).strict()).min(1).max(6),
  maxInputTokensPerTurn: z.number().int().min(256).max(2000), maxOutputTokensPerTurn: z.number().int().min(128).max(1000), maxTotalCostMicros: z.number().int().min(10000).max(250000), estimatedCeilingMicros: z.number().int().min(0).max(250000), executionEnabled: z.literal(false),
}).strict().refine(value => value.estimatedCeilingMicros <= value.maxTotalCostMicros && value.turns.reduce((sum, turn) => sum + turn.estimatedCeilingMicros, 0) === value.estimatedCeilingMicros && value.turns.every((turn, index) => turn.ordinal === index + 1));
export const meetingSnapshotCandidateSchema = z.object({ fingerprint: z.string().regex(/^[a-f0-9]{64}$/), summary: meetingSnapshotSummarySchema }).strict();
export const savedMeetingSnapshotSchema = meetingSnapshotCandidateSchema.extend({ id: z.uuid(), actorId: z.uuid(), createdAt: z.string(), state: z.literal('prepared') }).strict();
