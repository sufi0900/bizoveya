import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { checkDatabaseError, getSite, WorkspaceError } from '@/features/workspaces/store';
import { agencyRecordSchema } from './agency-contracts';
import { specialistDelegationInputSchema, specialistRosterRecordSchema, specialistRosterReviewSchema } from './specialist-contracts';

function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Channel specialists need migration 068 after 067. Existing campaigns and team settings remain unchanged.');
  if (['bz_conflict', 'bz_channel_specialists_changed'].includes(error?.message ?? '')) throw new WorkspaceError(409, 'The request or channel specialist roster changed. Reload and review again.');
  if (error?.message === 'bz_channel_specialists_not_ready') throw new WorkspaceError(409, 'Every selected channel specialist needs a current approved Content-agent version and qualified model binding.');
  if (error?.message === 'bz_channel_specialists_paused') throw new WorkspaceError(409, 'Channel specialist delegation is paused for this site.');
  if (error?.message === 'bz_channel_specialists_limit') throw new WorkspaceError(409, 'This pilot retains at most 50 channel specialist revisions.');
  if (error?.message === 'bz_invalid_channel_specialists') throw new WorkspaceError(400, 'Select one reviewed Content specialist for Blog, Pinterest and LinkedIn, or pause the saved roster.');
  if (error?.message === 'bz_invalid_specialist_delegation') throw new WorkspaceError(400, 'Review the current private request version and delegation reason.');
  if (error?.message === 'bz_specialist_request_required') throw new WorkspaceError(409, 'Only a current proposed founder request can be delegated.');
  checkDatabaseError(error);
}
export async function loadSpecialists(db: SupabaseClient, userId: string, wid: string, sid: string) {
  await getSite(db, userId, wid, sid); const result = await db.rpc('bz_site_channel_specialists', { p_workspace_id: wid, p_site_id: sid }); check(result.error); return specialistRosterRecordSchema.parse(result.data);
}
export async function saveSpecialists(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof specialistRosterReviewSchema>) {
  const { workspace } = await getSite(db, userId, wid, sid); if (workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can enable or pause channel specialists.');
  const result = await db.rpc('bz_save_site_channel_specialists', { p_workspace_id: wid, p_site_id: sid, p_input: specialistRosterReviewSchema.parse(input) }); check(result.error); return specialistRosterRecordSchema.parse(result.data);
}
export async function delegateSpecialists(db: SupabaseClient, userId: string, wid: string, sid: string, input: z.infer<typeof specialistDelegationInputSchema>) {
  const { workspace } = await getSite(db, userId, wid, sid); if (workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can delegate a founder request to channel specialists.');
  const result = await db.rpc('bz_delegate_agency_request_specialists', { p_workspace_id: wid, p_site_id: sid, p_input: specialistDelegationInputSchema.parse(input) }); check(result.error); return agencyRecordSchema.parse(result.data);
}
