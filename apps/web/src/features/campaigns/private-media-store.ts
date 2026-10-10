import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { checkDatabaseError, getSite, requireId, WorkspaceError } from '@/features/workspaces/store';
import { archivePrivateMediaInputSchema, privateMediaInventorySchema, privateMediaRecordSchema, reviewPrivateMediaInputSchema } from './private-media-contracts';

function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Private media storage needs migration 043 after 042. Existing campaign visuals are unchanged.');
  if (error?.message === 'bz_media_unavailable') throw new WorkspaceError(404, 'This private media item is unavailable.');
  if (error?.message === 'bz_conflict') throw new WorkspaceError(409, 'This private media item changed in another session. Reload before continuing.');
  if (error?.message === 'bz_media_limit') throw new WorkspaceError(409, 'This private media pilot supports 32 items per creator/site and 20 immutable versions per item.');
  if (error?.message === 'bz_invalid_media') throw new WorkspaceError(400, 'Check the media review fields.');
  checkDatabaseError(error);
}
async function site(db: SupabaseClient, userId: string, wid: string, sid: string, owner = false) {
  const value = await getSite(db, userId, wid, sid);
  if (owner && value.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can review or archive private media.');
}
export async function listPrivateMedia(db: SupabaseClient, userId: string, wid: string, sid: string, includeArchived = false) {
  await site(db, userId, wid, sid);
  const result = await db.rpc('bz_private_media_inventory', { p_workspace_id: wid, p_site_id: sid, p_include_archived: includeArchived }); check(result.error);
  return privateMediaInventorySchema.parse(result.data);
}
export async function loadPrivateMedia(db: SupabaseClient, userId: string, wid: string, sid: string, mediaId: string) {
  await site(db, userId, wid, sid); requireId(mediaId);
  const result = await db.rpc('bz_private_media', { p_workspace_id: wid, p_site_id: sid, p_media_id: mediaId }); check(result.error);
  if (result.data === null) throw new WorkspaceError(404, 'This private media item is unavailable.');
  return privateMediaRecordSchema.parse(result.data);
}
export async function reviewStoredPrivateMedia(db: SupabaseClient, userId: string, wid: string, sid: string, mediaId: string, input: z.infer<typeof reviewPrivateMediaInputSchema>) {
  await site(db, userId, wid, sid, true); requireId(mediaId);
  const result = await db.rpc('bz_review_private_media', { p_workspace_id: wid, p_site_id: sid, p_media_id: mediaId, p_expected_revision: input.expectedRevision, p_version: input.version, p_decision: input.decision, p_reason: input.reason }); check(result.error);
  return privateMediaRecordSchema.parse(result.data);
}
export async function archiveStoredPrivateMedia(db: SupabaseClient, userId: string, wid: string, sid: string, mediaId: string, input: z.infer<typeof archivePrivateMediaInputSchema>) {
  await site(db, userId, wid, sid, true); requireId(mediaId);
  const result = await db.rpc('bz_archive_private_media', { p_workspace_id: wid, p_site_id: sid, p_media_id: mediaId, p_expected_revision: input.expectedRevision }); check(result.error);
  return privateMediaRecordSchema.parse(result.data);
}
