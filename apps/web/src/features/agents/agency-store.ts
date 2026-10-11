import type { SupabaseClient } from '@supabase/supabase-js';
import { checkDatabaseError, getSite, WorkspaceError } from '@/features/workspaces/store';
import { agencyInventorySchema, agencyRecordSchema, type AgencyCommand } from './agency-contracts';
function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Agency planning needs migration 045 after 044. Existing campaigns are unchanged.');
  if (error?.message === 'bz_conflict') throw new WorkspaceError(409, 'This proposal changed. Reload before continuing.');
  if (error?.message === 'bz_agency_unavailable') throw new WorkspaceError(404, 'This proposal is unavailable.');
  if (error?.message === 'bz_invalid_agency_command') throw new WorkspaceError(400, 'Check the proposal fields and confirmation.');
  if (error?.message === 'bz_agency_limit') throw new WorkspaceError(409, 'The pilot supports 64 proposals per site and 100 events per proposal.');
  if (error?.message === 'bz_agency_snapshot_limit') throw new WorkspaceError(409, 'Approved context exceeds the pilot snapshot limit.');
  checkDatabaseError(error);
}
export async function loadAgency(db: SupabaseClient, userId: string, wid: string, sid: string) {
  const context = await getSite(db, userId, wid, sid);
  const result = await db.rpc('bz_agency_inventory', { p_workspace_id: wid, p_site_id: sid }); check(result.error);
  return { ...context, records: agencyInventorySchema.parse(result.data) };
}
export async function commandAgency(db: SupabaseClient, userId: string, wid: string, sid: string, command: AgencyCommand) {
  const context = await getSite(db, userId, wid, sid);
  if (context.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can save agency proposals and decisions.');
  const result = await db.rpc('bz_agency_command', { p_workspace_id: wid, p_site_id: sid, p_command: command }); check(result.error);
  return agencyRecordSchema.parse(result.data);
}
