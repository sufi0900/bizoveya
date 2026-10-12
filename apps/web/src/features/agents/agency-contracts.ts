import { z } from 'zod';
import { savedMeetingSnapshotSchema } from './meeting-snapshot-contracts';
import { meetingConsentSchema } from './meeting-consent-contracts';
import { campaignDocumentSchema, generationSummarySchema } from '../campaigns/contracts';
import { knowledgeDocumentSchema } from '@/domain/knowledge';
import { channelDelegationSchema } from './specialist-contracts';
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
export const agencyGenerationSchema = z.object({ id: z.uuid(), runId: z.uuid(), expectedVersion: z.number().int().min(1).max(100), expectedCampaignVersion: z.number().int().min(1).max(100), reviewed: z.literal(true) }).strict();
export const meetingDistributionSchema = z.object({ id: z.uuid(), requestId: z.uuid(), expectedVersion: z.number().int().min(1).max(99), instruction: text(1400), channels: z.array(z.enum(channels)).min(1).max(3).refine(values => new Set(values).size === values.length), reviewed: z.literal(true) }).strict().refine(value => value.id !== value.requestId);
export const meetingInvitationSchema = z.object({ id: z.uuid(), expectedVersion: z.number().int().min(1).max(99), reviewed: z.literal(true) }).strict();
export const announcementKnowledgeHandoffSchema = z.object({ action: z.literal('prepare-announcement-knowledge'), meetingId: z.uuid(), sourceId: z.uuid(), expectedVersion: z.number().int().min(1).max(99), document: knowledgeDocumentSchema.refine(value=>value.facts.length>0,'At least one proposed fact is required.'), reviewed: z.literal(true) }).strict().refine(value => value.meetingId !== value.sourceId);
export const meetingDeliberationSchema = z.object({ id: z.uuid(), planId: z.uuid(), expectedVersion: z.number().int().min(1).max(99), rounds: z.number().int().min(1).max(2), maxInputTokensPerTurn: z.number().int().min(256).max(2000), maxOutputTokensPerTurn: z.number().int().min(128).max(1000), maxTotalCostCents: z.number().int().min(1).max(25), reviewed: z.literal(true) }).strict().refine(value => value.id !== value.planId);
export const meetingScheduleSchema = z.object({ id: z.uuid(), planId: z.uuid(), operationId: z.uuid(), expectedMeetingVersion: z.number().int().min(1).max(100), expectedVersion: z.number().int().min(0).max(99), action: z.enum(['queue','pause','resume','cancel']), reason: text(300).refine(value => value.length >= 10 && !/[\u0000-\u001f\u007f]/.test(value)), reviewed: z.literal(true), intentOnly: z.literal(true) }).strict().refine(value => value.id !== value.planId);
const scheduleStateSchema = z.enum(['ready','paused','cancelled']);
const participantInvitationSchema = z.object({ role: z.enum(['coordinator', 'content', 'quality']), agentId: z.uuid(), agentVersion: z.number().int().positive(), state: z.enum(['invited', 'claimed', 'acknowledged', 'declined']), claimExpiresAt: z.string().nullable(), respondedAt: z.string().nullable(), note: z.string().max(500).nullable() }).strict();
const executionTaskStateSchema = z.enum(['awaiting_authorization', 'running', 'awaiting_human_review', 'failed', 'recovery_required', 'cancelled']);
export const agencyRecordSchema = z.object({
  meetingExecutionSnapshot: savedMeetingSnapshotSchema.nullable().default(null),
  meetingClosures:z.array(z.object({snapshotId:z.uuid(),state:z.enum(['completed','stopped']),createdAt:z.string()}).strict()).max(50).default([]),
  meetingExecutionConsents: z.array(meetingConsentSchema).max(25).default([]),
  id: z.uuid(), kind: z.enum(['request', 'meeting']), version: z.number().int().positive(),
  status: z.enum(['proposed', 'decision-recorded', 'deferred', 'cancelled']),
  document: z.record(z.string(), z.unknown()), snapshot: z.record(z.string(), z.unknown()),
  createdAt: z.string(), events: z.array(z.object({ version: z.number().int().positive(), action: z.string(), reason: z.string().nullable(), actorId: z.uuid(), createdAt: z.string() }).strict()),
  executionPreparation: z.object({ campaignVersion: z.number().int().min(1).max(100), campaignTitle: text(120) }).strict().nullable().default(null),
  execution: z.object({ sourceVersion: z.number().int().min(1).max(100), actorId: z.uuid(), createdAt: z.string(), run: generationSummarySchema }).strict().nullable().default(null),
  executionTask: z.object({ recordId: z.uuid(), runId: z.uuid(), version: z.number().int().min(1).max(100), state: executionTaskStateSchema, lastReason: z.string(), createdAt: z.string(), updatedAt: z.string(), leaseActive: z.boolean(), leaseExpired: z.boolean(), events: z.array(z.object({ version: z.number().int().min(1).max(100), action: z.string(), state: executionTaskStateSchema, reason: z.string(), actorId: z.uuid().nullable(), createdAt: z.string() }).strict()).max(100) }).strict().nullable().default(null),
  handoff: z.object({ campaignId: z.uuid(), sourceVersion: z.number().int().positive(), title: text(120), document: campaignDocumentSchema, actorId: z.uuid(), createdAt: z.string() }).strict().nullable().default(null),
  meetingDistribution: z.object({ meetingId: z.uuid(), requestId: z.uuid(), sourceVersion: z.number().int().min(1).max(99), agenda: agencyCommandSchema.refine(value => value.action === 'meeting'), decision: text(500), instruction: text(1400), command: agencyCommandSchema.refine(value => value.action === 'request'), actorId: z.uuid(), createdAt: z.string() }).strict().nullable().default(null),
  outcomeHandoff: z.object({ outcomeId:z.uuid(),snapshotId:z.uuid(),meetingId:z.uuid(),requestId:z.uuid(),fingerprint:z.string().regex(/^[a-f0-9]{64}$/),instruction:text(1400),channels:z.array(z.enum(channels)).min(1).max(3).refine(values=>new Set(values).size===values.length),actorId:z.uuid(),createdAt:z.string() }).strict().nullable().default(null),
  meetingInvitations: z.object({ meetingId: z.uuid(), requestId: z.uuid(), sourceVersion: z.number().int().min(1).max(99), rosterVersion: z.number().int().min(1).max(50), actorId: z.uuid(), createdAt: z.string(), participants: z.array(participantInvitationSchema).min(1).max(3) }).strict().nullable().default(null),
  announcementKnowledgeDraft: z.object({ meetingId:z.uuid(),sourceId:z.uuid(),sourceMeetingVersion:z.number().int().min(1).max(99),rosterVersion:z.number().int().min(1).max(50),title:text(120),factCount:z.number().int().min(1).max(40),createdUnapproved:z.literal(true),currentApproved:z.boolean(),sourceVersion:z.number().int().positive(),actorId:z.uuid(),createdAt:z.string() }).strict().nullable().default(null),
  channelDelegation: channelDelegationSchema.nullable().default(null),
  meetingSchedule: z.object({ planId: z.uuid(), version: z.number().int().min(1).max(100), state: scheduleStateSchema, actorId: z.uuid(), createdAt: z.string(), updatedAt: z.string(), events: z.array(z.object({ version: z.number().int().min(1).max(100), action: z.enum(['queue','pause','resume','cancel']), state: scheduleStateSchema, reason: text(300), actorId: z.uuid(), createdAt: z.string() }).strict()).min(1).max(100) }).strict().nullable().default(null),
  meetingDeliberation: z.object({ id: z.uuid(), meetingId: z.uuid(), requestId: z.uuid(), sourceVersion: z.number().int().min(1).max(99), rosterVersion: z.number().int().min(1).max(50), rounds: z.number().int().min(1).max(2), maxInputTokensPerTurn: z.number().int().min(256).max(2000), maxOutputTokensPerTurn: z.number().int().min(128).max(1000), maxTotalCostCents: z.number().int().min(1).max(25), actorId: z.uuid(), createdAt: z.string(), turns: z.array(z.object({ ordinal: z.number().int().min(1).max(6), round: z.number().int().min(1).max(2), role: z.enum(['coordinator','content','quality']), agentId: z.uuid(), agentVersion: z.number().int().positive(), purpose: text(240), state: z.literal('planned') }).strict()).min(1).max(6) }).strict().nullable().default(null),
}).strict();
export const meetingDistributionResultSchema = z.object({ meeting: agencyRecordSchema, request: agencyRecordSchema }).strict().refine(value => value.meeting.kind === 'meeting' && value.request.kind === 'request' && value.meeting.meetingDistribution?.meetingId === value.meeting.id && value.meeting.meetingDistribution?.requestId === value.request.id && JSON.stringify(value.meeting.meetingDistribution) === JSON.stringify(value.request.meetingDistribution));
export const agencyInventorySchema = z.array(agencyRecordSchema).max(64);
export type AgencyRecord = z.infer<typeof agencyRecordSchema>;
export const voiceEntryState = Object.freeze({ enabled: false, reason: 'Business voice transcription and speech providers have not been qualified. Paste and correct a transcript, then explicitly confirm the same text command.' });
// Preparing work is deterministic and costs no model call. Tasks are proposals, never fake specialist results.
export function delegationProposal(input: Extract<AgencyCommand, { action: 'request' }>) {
  return input.channels.map(channel => ({ channel, role: `${channel}-specialist` as const, specialistKind: 'content' as const, state: 'proposed' as const, requires: ['current-approved-knowledge', 'reviewed-channel-roster', 'qualified-role-binding', 'budget-admission', 'human-review'] }));
}
