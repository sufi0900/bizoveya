import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { getSite, WorkspaceError, checkDatabaseError } from '@/features/workspaces/store';
import { agencyRecordSchema } from './agency-contracts';
import { meetingSnapshotCandidateSchema, meetingSnapshotInputSchema, meetingSnapshotReviewSchema } from './meeting-snapshot-contracts';

function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Meeting snapshot preparation needs migration 060 after 059. No execution was started.');
  const messages: Record<string, string> = {
    bz_conflict: 'The meeting or schedule changed. Reload before reviewing again.',
    bz_meeting_snapshot_changed: 'Approved context or qualification changed. Load and review the current snapshot again.',
    bz_meeting_snapshot_not_ready: 'The deliberation schedule must be ready with the unchanged meeting.',
    bz_meeting_qualification_required: 'Approved knowledge, current selected agents, checked model credentials, recent connectivity and compatible token limits are required.',
    bz_meeting_cost_ceiling: 'The full planned turn estimate exceeds the saved meeting or model cost ceiling. No spending was reserved.',
    bz_spending_unresolved: 'Resolve unknown, overrun or expired reservations before preparing this meeting.',
    bz_site_roster_paused: 'The site team is paused. No snapshot was prepared.',
    bz_site_roster_changed: 'The selected site team changed. This plan cannot admit a new snapshot.',
    bz_meeting_receipts_required: 'Every pinned participant must have an acknowledged packet.',
    bz_deliberation_plan_required: 'Prepare an acknowledged bounded deliberation plan first.',
    bz_agency_snapshot_limit: 'Approved context exceeds the private snapshot size limit.',
  };
  if (error?.message && messages[error.message]) throw new WorkspaceError(409, messages[error.message]);
  if (error?.message === 'bz_invalid_meeting_snapshot') throw new WorkspaceError(400, 'Review the exact meeting, schedule and snapshot confirmation.');
  checkDatabaseError(error);
}
async function requireOwner(db: SupabaseClient, userId: string, wid: string, sid: string) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can review or prepare meeting execution snapshots.');
}
export async function reviewMeetingSnapshot(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingSnapshotReviewSchema>) {
  await requireOwner(db, userId, wid, sid);
  const value = meetingSnapshotReviewSchema.parse(input);
  const result = await db.rpc('bz_review_meeting_execution_snapshot', { p_workspace_id: wid, p_site_id: sid, p_meeting_id: value.id, p_plan_id: value.planId, p_meeting_version: value.expectedMeetingVersion, p_schedule_version: value.expectedScheduleVersion });
  check(result.error);
  const candidate = meetingSnapshotCandidateSchema.parse(result.data);
  if (candidate.summary.meetingId !== value.id || candidate.summary.planId !== value.planId || candidate.summary.meetingVersion !== value.expectedMeetingVersion || candidate.summary.scheduleVersion !== value.expectedScheduleVersion) throw new WorkspaceError(503, 'The returned snapshot does not match the reviewed meeting.');
  return candidate;
}
export async function prepareMeetingSnapshot(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingSnapshotInputSchema>) {
  await requireOwner(db, userId, wid, sid);
  const value = meetingSnapshotInputSchema.parse(input);
  const result = await db.rpc('bz_prepare_meeting_execution_snapshot', { p_workspace_id: wid, p_site_id: sid, p_input: value });
  check(result.error);
  const record = agencyRecordSchema.parse(result.data), saved = record.meetingExecutionSnapshot;
  if (record.id !== value.id || !saved || saved.id !== value.snapshotId || saved.fingerprint !== value.fingerprint || saved.summary.planId !== value.planId || saved.actorId !== userId) throw new WorkspaceError(503, 'Snapshot confirmation is incomplete. Reload before continuing.');
  return record;
}
