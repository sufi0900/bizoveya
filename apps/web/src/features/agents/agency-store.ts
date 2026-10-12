import type { SupabaseClient } from '@supabase/supabase-js';
import { checkDatabaseError, getSite, WorkspaceError } from '@/features/workspaces/store';
import { agencyGenerationSchema, agencyHandoffSchema, agencyInventorySchema, agencyRecordSchema, announcementKnowledgeHandoffSchema, meetingDeliberationSchema, meetingScheduleSchema, meetingDistributionSchema, meetingDistributionResultSchema, meetingInvitationSchema, type AgencyCommand } from './agency-contracts';
import type { z } from 'zod';
function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Agency planning needs migration 045 after 044. Existing campaigns are unchanged.');
  if (error?.message === 'bz_conflict') throw new WorkspaceError(409, 'This proposal changed. Reload before continuing.');
  if (error?.message === 'bz_agency_unavailable') throw new WorkspaceError(404, 'This proposal is unavailable.');
  if (error?.message === 'bz_invalid_agency_command') throw new WorkspaceError(400, 'Check the proposal fields and confirmation.');
  if (error?.message === 'bz_agency_limit') throw new WorkspaceError(409, 'The pilot supports 64 proposals per site and 100 events per proposal.');
  if (error?.message === 'bz_agency_snapshot_limit') throw new WorkspaceError(409, 'Approved context exceeds the pilot snapshot limit.');
  if (error?.message === 'bz_invalid_agency_handoff') throw new WorkspaceError(400, 'Check the campaign title and handoff confirmation.');
  if (error?.message === 'bz_campaign_limit') throw new WorkspaceError(409, 'This site already has the maximum 50 campaigns.');
  checkDatabaseError(error);
}
export async function handoffAgency(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof agencyHandoffSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can prepare a campaign from a founder request.');
  const result = await db.rpc('bz_handoff_agency_campaign', { p_workspace_id: wid, p_site_id: sid, p_input: agencyHandoffSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Campaign handoffs need migration 048 after 047. The request remains saved; no campaign or generation was started.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}
export async function loadAgency(db: SupabaseClient, userId: string, wid: string, sid: string) {
  const context = await getSite(db, userId, wid, sid);
  const result = await db.rpc('bz_agency_inventory', { p_workspace_id: wid, p_site_id: sid }); check(result.error);
  return { ...context, records: agencyInventorySchema.parse(result.data) };
}
export async function distributeMeetingRequest(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingDistributionSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can distribute a reviewed meeting decision.');
  const result = await db.rpc('bz_distribute_meeting_request', { p_workspace_id: wid, p_site_id: sid, p_input: meetingDistributionSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Meeting distribution needs migration 053 after 052. Your decision remains saved.');
  if (result.error?.message === 'bz_invalid_meeting_distribution') throw new WorkspaceError(400, 'Review the task instruction, channels and exact meeting version.');
  if (result.error?.message === 'bz_meeting_decision_required') throw new WorkspaceError(409, 'Record a founder decision on this meeting before distributing a request.');
  check(result.error);
  return meetingDistributionResultSchema.parse(result.data);
}
export async function inviteMeetingParticipants(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingInvitationSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can prepare participant invitations.');
  const result = await db.rpc('bz_invite_meeting_participants', { p_workspace_id: wid, p_site_id: sid, p_input: meetingInvitationSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Participant invitations need migration 054 after 053. The meeting and request remain saved.');
  if (result.error?.message === 'bz_invalid_meeting_invitation') throw new WorkspaceError(400, 'Review the exact meeting version and invitation confirmation.');
  if (result.error?.message === 'bz_meeting_distribution_required') throw new WorkspaceError(409, 'Distribute the reviewed meeting decision before preparing invitations.');
  if (result.error?.message === 'bz_site_roster_paused') throw new WorkspaceError(409, 'Enable the reviewed site team before preparing invitations.');
  if (result.error?.message === 'bz_site_roster_changed') throw new WorkspaceError(409, 'The requested participant roles are not pinned to the current site team. Review the team first.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}
export async function prepareAnnouncementKnowledge(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof announcementKnowledgeHandoffSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can prepare a knowledge draft from an announcement.');
  const result = await db.rpc('bz_prepare_announcement_knowledge', { p_workspace_id: wid, p_site_id: sid, p_input: announcementKnowledgeHandoffSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Announcement knowledge handoffs need migration 067 after 066. The announcement remains saved.');
  if (result.error?.message === 'bz_invalid_announcement_knowledge') throw new WorkspaceError(400, 'Review the exact announcement version, source text and proposed facts.');
  if (result.error?.message === 'bz_announcement_required') throw new WorkspaceError(409, 'Use a decision-recorded announcement before preparing a knowledge draft.');
  if (result.error?.message === 'bz_meeting_receipts_required') throw new WorkspaceError(409, 'Every pinned announcement recipient must acknowledge the current packet first.');
  if (result.error?.message === 'bz_announcement_knowledge_unconfirmed') throw new WorkspaceError(503, 'The knowledge draft could not be confirmed. Refresh before retrying.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}
export async function prepareMeetingDeliberation(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingDeliberationSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can prepare a deliberation plan.');
  const result = await db.rpc('bz_prepare_meeting_deliberation', { p_workspace_id: wid, p_site_id: sid, p_input: meetingDeliberationSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Deliberation planning needs migration 056 after 055. No model call or spending was started.');
  if (result.error?.message === 'bz_invalid_deliberation_plan') throw new WorkspaceError(400, 'Review the exact meeting version and bounded turn, token and cost limits.');
  if (result.error?.message === 'bz_deliberation_required') throw new WorkspaceError(409, 'Only a decision-recorded deliberation meeting can receive a plan.');
  if (result.error?.message === 'bz_meeting_receipts_required') throw new WorkspaceError(409, 'Every pinned participant must acknowledge the current invitation before planning.');
  if (result.error?.message === 'bz_site_roster_paused') throw new WorkspaceError(409, 'The site team is paused. No deliberation plan was created.');
  if (result.error?.message === 'bz_site_roster_changed') throw new WorkspaceError(409, 'The pinned participant roster changed. Review the current site team first.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}
export async function commandAgency(db: SupabaseClient, userId: string, wid: string, sid: string, command: AgencyCommand) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can save agency proposals and decisions.');
  const result = await db.rpc('bz_agency_command', { p_workspace_id: wid, p_site_id: sid, p_command: command }); check(result.error);
  return agencyRecordSchema.parse(result.data);
}

export async function prepareAgencyGeneration(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof agencyGenerationSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can prepare a request generation snapshot.');
  const result = await db.rpc('bz_prepare_agency_generation', { p_workspace_id: wid, p_site_id: sid, p_input: agencyGenerationSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Request generation preparation needs migration 051 after 050. No provider call was started.');
  if (result.error?.message === 'bz_invalid_agency_generation') throw new WorkspaceError(400, 'Review the exact request and campaign versions and confirm preparation.');
  if (result.error?.message === 'bz_agency_campaign_required') throw new WorkspaceError(409, 'Prepare a private campaign from this request first.');
  if (result.error?.message === 'bz_site_roster_paused') throw new WorkspaceError(409, 'The site team is paused. No generation snapshot was created.');
  if (result.error?.message === 'bz_generation_not_ready') throw new WorkspaceError(409, 'Current approved knowledge, role bindings, connectivity and spending qualification are required. No generation snapshot was created.');
  if (result.error?.message === 'bz_generation_limit') throw new WorkspaceError(409, 'This campaign already has the maximum 25 generation snapshots.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}

export async function controlMeetingSchedule(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof meetingScheduleSchema>) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can control deliberation scheduling intent.');
  const result = await db.rpc('bz_control_meeting_schedule', { p_workspace_id: wid, p_site_id: sid, p_input: meetingScheduleSchema.parse(input) });
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(result.error?.code ?? '')) throw new WorkspaceError(503, 'Scheduling controls need migration 058 after 057. No execution or spending was started.');
  if (result.error?.message === 'bz_invalid_meeting_schedule') throw new WorkspaceError(400, 'Review the scheduling reason, versions and intent-only confirmation.');
  if (result.error?.message === 'bz_deliberation_plan_required') throw new WorkspaceError(409, 'Prepare the acknowledged bounded deliberation plan first.');
  if (result.error?.message === 'bz_meeting_schedule_transition') throw new WorkspaceError(409, 'This scheduling state cannot accept that action. Reload the meeting.');
  if (result.error?.message === 'bz_deliberation_required') throw new WorkspaceError(409, 'The meeting changed or was cancelled. No scheduling intent was admitted.');
  if (result.error?.message === 'bz_meeting_receipts_required') throw new WorkspaceError(409, 'Every pinned participant must acknowledge the invitation first.');
  if (result.error?.message === 'bz_site_roster_paused') throw new WorkspaceError(409, 'Enable the pinned site team before queuing or resuming.');
  if (result.error?.message === 'bz_site_roster_changed') throw new WorkspaceError(409, 'The pinned team changed. This plan cannot be queued or resumed.');
  check(result.error);
  return agencyRecordSchema.parse(result.data);
}
