import type { SupabaseClient } from '@supabase/supabase-js';
import { checkDatabaseError, getSite, WorkspaceError } from '@/features/workspaces/store';
import { agencyGenerationSchema, agencyHandoffSchema, agencyInventorySchema, agencyRecordSchema, meetingDistributionSchema, meetingDistributionResultSchema, type AgencyCommand } from './agency-contracts';
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
