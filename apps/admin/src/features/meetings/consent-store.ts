import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminError, requireAdmin } from '../admin/access';
import { meetingAdminInputSchema, meetingConsentInputSchema, meetingExecutionQueueSchema, type MeetingConsentInput, type MeetingOutcomeReviewInput } from './consent-contracts';
function check(error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (['PGRST202', 'PGRST205', '42P01', '42703'].includes(error.code ?? '')) throw new AdminError(503, 'MEETING_OUTCOME_SETUP', 'Meeting execution and completion need migrations 061 through 064 in order. No work was started.');
  const messages: Record<string, string> = {
    bz_forbidden: 'Only your own prepared snapshot in a currently owned workspace is available.',
    bz_conflict: 'The selected identity or versions changed. Refresh before reviewing again.',
    bz_meeting_snapshot_changed: 'The approved context or qualification changed. This immutable snapshot cannot receive new consent.',
    bz_meeting_qualification_required: 'Current checked agents, model credentials, recent connectivity, approved knowledge and compatible token limits are required.',
    bz_meeting_snapshot_not_ready: 'The unchanged deliberation schedule must be ready before new consent.',
    bz_site_roster_paused: 'The site team is paused. Revocation remains available.',
    bz_site_roster_changed: 'The pinned team changed. This snapshot cannot receive new consent.',
    bz_meeting_cost_ceiling: 'The full planned turn estimate exceeds the saved meeting or model limits.',
    bz_spending_unresolved: 'Unresolved or expired accounting blocks new consent.',
    bz_meeting_consent_active: 'An unrevoked, unexpired consent already exists. Refresh its state.',
    bz_meeting_consent_limit: 'This snapshot reached its limit of 25 consent records. Revocation remains available.',
    bz_invalid_meeting_consent: 'Review the reason and exact selected snapshot or consent identity.',
    bz_invalid_meeting_outcome: 'Review the completed outcome identity, fingerprint and reason.',
    bz_meeting_outcome_not_ready: 'Every planned turn must have a successful private result and settled or reconciled spending before review.',
    bz_meeting_outcome_changed: 'The completed result changed before review. Refresh and inspect it again.',
  };
  throw new AdminError(error.code === '42501' || error.message === 'bz_forbidden' ? 403 : 409, 'MEETING_CONSENT_BLOCKED', messages[error.message ?? ''] ?? 'Meeting consent could not be confirmed. Refresh its history.');
}
function parseQueue(data:unknown){const parsed=meetingExecutionQueueSchema.safeParse(data);if(!parsed.success)throw new AdminError(503,'MEETING_OUTCOME_SETUP','Meeting completion needs migration 064 after 063. No work was started.');return parsed.data;}
export async function loadMeetingExecutionConsents(db: SupabaseClient) {
  await requireAdmin(db);
  const result = await db.rpc('bz_admin_meeting_execution_queue'); check(result.error);
  return { meetings: parseQueue(result.data) };
}
export async function controlMeetingExecutionConsent(db: SupabaseClient, input: MeetingConsentInput) {
  await requireAdmin(db);
  const command = meetingConsentInputSchema.parse(input), { action, ...value } = command;
  const result = await db.rpc(action === 'consent' ? 'bz_admin_consent_meeting_execution' : 'bz_admin_revoke_meeting_execution', { p_input: value }); check(result.error);
  const meetings = parseQueue(result.data), meeting = meetings.find(item => item.consents.some(consent => consent.id === command.consentId)), consent = meeting?.consents.find(item => item.id === command.consentId);
  if (!consent || !meeting || (command.action === 'consent' ? meeting.snapshotId !== command.snapshotId || meeting.fingerprint !== command.fingerprint || consent.reason !== command.reason : consent.state !== 'revoked' || consent.revocationReason !== command.reason)) throw new AdminError(503, 'CONSENT_UNCONFIRMED', 'Consent response could not be confirmed. Refresh its history before another attempt.');
  return { meetings };
}
export async function reviewMeetingDeliberationOutcome(db:SupabaseClient,input:MeetingOutcomeReviewInput){
 await requireAdmin(db);const command=meetingAdminInputSchema.parse(input);if(command.action!=='review-outcome')throw new AdminError(400,'INVALID_OUTCOME','Review the completed outcome.');
 const result=await db.rpc('bz_admin_review_meeting_outcome',{p_input:command});check(result.error);const meetings=parseQueue(result.data),meeting=meetings.find(item=>item.snapshotId===command.snapshotId),saved=meeting?.reviewedOutcome;
 if(!saved||saved.id!==command.outcomeId||saved.fingerprint!==command.fingerprint||saved.reason!==command.reason)throw new AdminError(503,'OUTCOME_UNCONFIRMED','Outcome review could not be confirmed. Refresh before another attempt.');
 return {meetings};
}
