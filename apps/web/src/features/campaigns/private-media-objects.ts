import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { checkDatabaseError, getSite, WorkspaceError } from '@/features/workspaces/store';
import { privateMediaDescriptorSchema, privateMediaRecordSchema } from './private-media-contracts';
import { sanitizePrivateMedia } from './private-media-sanitize';
import { MEDIA_UPLOAD_INPUT_LIMIT, type MediaUploadInput } from './private-media-upload-contracts';
const bucket = 'campaign-private-media';
const preparedSchema = z.discriminatedUnion('state', [z.object({ state: z.literal('committed'), record: privateMediaRecordSchema }).strict(), z.object({ state: z.literal('pending'), path: z.string(), version: z.number().int().min(1).max(20) }).strict()]);
const objectSchema = z.object({ path: z.string(), descriptor: privateMediaDescriptorSchema }).strict();
const cleanupSchema = z.array(z.object({ id: z.uuid(), path: z.string() }).strict()).max(8);
function check(error: { code?: string; message?: string } | null) {
  if (['42P01', '42703', 'PGRST202', 'PGRST205'].includes(error?.code ?? '')) throw new WorkspaceError(503, 'Private media bytes need migration 046 after 045.');
  if (error?.message === 'bz_media_unavailable') throw new WorkspaceError(404, 'This private media item is unavailable.');
  if (error?.message === 'bz_conflict') throw new WorkspaceError(409, 'Media changed. Reload before retrying.');
  if (['bz_upload_expired', 'bz_upload_busy', 'bz_upload_path_used'].includes(error?.message ?? '')) throw new WorkspaceError(409, 'An upload is incomplete or expired. After ten minutes, recover incomplete uploads, then retry.');
  if (error?.message === 'bz_upload_rate_limit') throw new WorkspaceError(429, 'The private media pilot allows 12 new upload admissions per hour window. Wait before retrying.');
  if (error?.message === 'bz_upload_processing_limit') throw new WorkspaceError(429, 'The private media pilot allows 36 processing attempts per hour window, including failed files and retries. Wait before retrying.');
  if (['bz_media_limit', 'bz_media_byte_limit', 'bz_cleanup_required'].includes(error?.message ?? '')) throw new WorkspaceError(409, 'Private media quota reached. Recover incomplete uploads; retained saved versions still count.');
  if (error?.message === 'bz_invalid_media') throw new WorkspaceError(400, 'Check the image and rights fields.');
  checkDatabaseError(error);
}
async function authorize(db: SupabaseClient, actor: string, wid: string, sid: string, owner: boolean) {
  const value = await getSite(db, actor, wid, sid);
  if (owner && value.workspace.role !== 'owner') throw new WorkspaceError(403, 'Only the workspace owner can upload or recover private media.');
}
function scope(actor: string, wid: string, sid: string) { return { p_actor: actor, p_workspace: wid, p_site: sid }; }
function verifyBytes(bytes: Uint8Array, descriptor: z.infer<typeof privateMediaDescriptorSchema>) {
  if (bytes.byteLength !== descriptor.bytes || createHash('sha256').update(bytes).digest('hex') !== descriptor.sha256) throw new WorkspaceError(503, 'Stored image integrity check failed. No bytes were returned.');
}
function verifyPath(path: string, actor: string, wid: string, sid: string, mediaId: string, version: number, hash: string, mime: string) {
  if (path !== `${actor}/${wid}/${sid}/${mediaId}/${version}/${hash}.${mime === 'image/png' ? 'png' : 'jpg'}`) throw new WorkspaceError(503, 'Private image path contract failed.');
}
export async function uploadPrivateMedia(db: SupabaseClient, service: SupabaseClient, actor: string, wid: string, sid: string, input: MediaUploadInput) {
  await authorize(db, actor, wid, sid, true);
  const raw = Buffer.from(input.base64, 'base64');
  if (!raw.length || raw.length > MEDIA_UPLOAD_INPUT_LIMIT || raw.toString('base64') !== input.base64) throw new WorkspaceError(400, 'Use a PNG or JPEG no larger than 3 MiB.');
  const parameters = scope(actor, wid, sid);
  const processing = await service.rpc('bz_admit_media_processing', parameters); check(processing.error);
  let image;
  try { image = await sanitizePrivateMedia(raw, { alt: input.alt, rights: input.rights }); }
  catch { throw new WorkspaceError(400, 'Use a valid single PNG/JPEG within 4096 pixels per side and 12 million pixels, with reviewed rights.'); }
  const admission = await service.rpc('bz_prepare_media_upload', { ...parameters, p_attempt: input.attemptId, p_media: input.mediaId, p_revision: input.expectedRevision, p_descriptor: image.descriptor }); check(admission.error);
  const prepared = preparedSchema.parse(admission.data);
  if (prepared.state === 'committed') return prepared.record;
  verifyPath(prepared.path, actor, wid, sid, input.mediaId, prepared.version, image.descriptor.sha256, image.descriptor.mime);
  const storage = service.storage.from(bucket);
  const result = await storage.upload(prepared.path, image.bytes, { contentType: image.descriptor.mime, upsert: false, cacheControl: '0' });
  if (result.error) {
    // A retry can encounter an earlier successful write with a lost response. Never overwrite it.
    const previous = await storage.download(prepared.path);
    if (previous.error || !previous.data) throw new WorkspaceError(503, 'Upload incomplete. Retry the same image; recovery becomes available after ten minutes.');
    const bytes = new Uint8Array(await previous.data.arrayBuffer()); verifyBytes(bytes, image.descriptor);
  }
  const committed = await service.rpc('bz_commit_media_upload', { ...parameters, p_attempt: input.attemptId }); check(committed.error);
  // Never delete here: a timeout can hide a successful commit. Guarded durable recovery handles orphan writes.
  return privateMediaRecordSchema.parse(committed.data);
}
export async function readPrivateMediaBytes(db: SupabaseClient, service: SupabaseClient, actor: string, wid: string, sid: string, mediaId: string, version: number) {
  await authorize(db, actor, wid, sid, false);
  const result = await service.rpc('bz_private_media_object', { ...scope(actor, wid, sid), p_media: mediaId, p_version: version }); check(result.error);
  const object = objectSchema.parse(result.data);
  verifyPath(object.path, actor, wid, sid, mediaId, version, object.descriptor.sha256, object.descriptor.mime);
  const downloaded = await service.storage.from(bucket).download(object.path);
  if (downloaded.error || !downloaded.data) throw new WorkspaceError(503, 'Private image bytes are unavailable.');
  const bytes = new Uint8Array(await downloaded.data.arrayBuffer()); verifyBytes(bytes, object.descriptor);
  return { bytes, descriptor: object.descriptor };
}
export async function recoverPrivateMediaUploads(db: SupabaseClient, service: SupabaseClient, actor: string, wid: string, sid: string) {
  await authorize(db, actor, wid, sid, true);
  const parameters = scope(actor, wid, sid);
  const result = await service.rpc('bz_claim_media_cleanup', parameters); check(result.error);
  const attempts = cleanupSchema.parse(result.data); let recovered = 0;
  for (const attempt of attempts) {
    if (!attempt.path.startsWith(`${actor}/${wid}/${sid}/`) || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\/[1-9][0-9]?\/[a-f0-9]{64}\.(png|jpg)$/.test(attempt.path)) throw new WorkspaceError(503, 'Cleanup path contract failed.');
    const removed = await service.storage.from(bucket).remove([attempt.path]);
    if (removed.error) continue;
    const finished = await service.rpc('bz_finish_media_cleanup', { ...parameters, p_attempt: attempt.id });
    if (!finished.error) recovered++;
  }
  return { recovered, pending: attempts.length - recovered, notice: 'Only expired tracked uploads were processed. Saved image versions were retained.' };
}
