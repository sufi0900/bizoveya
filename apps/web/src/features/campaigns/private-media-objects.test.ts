import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../workspaces/store', async original => ({ ...await original<typeof import('../workspaces/store')>(), getSite: vi.fn() }));
vi.mock('./private-media-sanitize', () => ({ sanitizePrivateMedia: vi.fn() }));
import { getSite } from '../workspaces/store';
import { sanitizePrivateMedia } from './private-media-sanitize';
import { createPrivateMedia } from './private-media-contracts';
import { readPrivateMediaBytes, recoverPrivateMediaUploads, uploadPrivateMedia } from './private-media-objects';
import { mediaUploadInputSchema } from './private-media-upload-contracts';
const actor = '11111111-1111-4111-8111-111111111111', wid = '22222222-2222-4222-8222-222222222222', sid = '33333333-3333-4333-8333-333333333333', mediaId = '44444444-4444-4444-8444-444444444444', attemptId = '55555555-5555-4555-8555-555555555555';
const bytes = Buffer.from('clean-image');
const descriptor = { schema: 'private-media-descriptor-v1' as const, mime: 'image/png' as const, bytes: bytes.length, width: 24, height: 32, sha256: createHash('sha256').update(bytes).digest('hex'), alt: 'Blue original image', origin: 'user-upload' as const, rights: { basis: 'own-work' as const, evidence: 'Original work', attested: true as const } };
const path = `${actor}/${wid}/${sid}/${mediaId}/1/${descriptor.sha256}.png`;
const record = createPrivateMedia(mediaId, { actorId: actor, workspaceId: wid, siteId: sid }, descriptor, '2026-10-11T01:00:00Z');
const input = { attemptId, mediaId, expectedRevision: 0, base64: Buffer.from('input').toString('base64'), alt: descriptor.alt, rights: descriptor.rights, reviewed: true as const };
const db = {} as SupabaseClient;
beforeEach(() => { vi.clearAllMocks(); vi.mocked(getSite).mockResolvedValue({ workspace: { role: 'owner' } } as never); vi.mocked(sanitizePrivateMedia).mockResolvedValue({ bytes, descriptor }); });
function fixture() {
  const upload = vi.fn(async () => ({ error: null as unknown }));
  const download = vi.fn(async () => ({ error: null, data: new Blob([bytes]) }));
  const remove = vi.fn(async () => ({ error: null as unknown }));
  const rpc = vi.fn(async (name: string) => ({ error: null as unknown, data: name === 'bz_prepare_media_upload' ? { state: 'pending', path, version: 1 } : name === 'bz_private_media_object' ? { path, descriptor } : name === 'bz_claim_media_cleanup' ? [{ id: attemptId, path }] : record }));
  const service = { rpc, storage: { from: vi.fn(() => ({ upload, download, remove })) } } as unknown as SupabaseClient;
  return { service, rpc, upload, download, remove };
}
describe('private media object lifecycle', () => {
  it('checks owner admission before any sanitizer or Storage/RPC call', async () => {
    vi.mocked(getSite).mockResolvedValue({ workspace: { role: 'editor' } } as never); const f = fixture();
    await expect(uploadPrivateMedia(db, f.service, actor, wid, sid, input)).rejects.toMatchObject({ status: 403 }); expect(f.rpc).not.toHaveBeenCalled(); expect(f.upload).not.toHaveBeenCalled(); expect(sanitizePrivateMedia).not.toHaveBeenCalled();
  });
  it('uses derived bytes/hash, immutable upsert=false and commits only after successful write', async () => {
    const f = fixture(); expect(await uploadPrivateMedia(db, f.service, actor, wid, sid, input)).toEqual(record);
    expect(f.upload).toHaveBeenCalledWith(path, bytes, expect.objectContaining({ upsert: false, contentType: 'image/png' }));
    expect(f.rpc.mock.calls.map(call => call[0])).toEqual(['bz_admit_media_processing', 'bz_prepare_media_upload', 'bz_commit_media_upload']);
  });
  it('stops at quota denial before writing bytes', async () => {
    const f = fixture(); f.rpc.mockResolvedValueOnce({ error: null, data: null as never }).mockResolvedValueOnce({ error: { message: 'bz_media_byte_limit' }, data: null as never });
    await expect(uploadPrivateMedia(db, f.service, actor, wid, sid, input)).rejects.toMatchObject({ status: 409 }); expect(f.upload).not.toHaveBeenCalled();
    vi.mocked(sanitizePrivateMedia).mockClear(); const limited = fixture(); limited.rpc.mockResolvedValueOnce({ error: { message: 'bz_upload_processing_limit' }, data: null as never });
    await expect(uploadPrivateMedia(db, limited.service, actor, wid, sid, input)).rejects.toMatchObject({ status: 429 }); expect(sanitizePrivateMedia).not.toHaveBeenCalled(); expect(limited.upload).not.toHaveBeenCalled();
  });
  it('resumes an earlier immutable upload only when existing output bytes match', async () => {
    const f = fixture(); f.upload.mockResolvedValue({ error: { message: 'Already exists' } });
    expect(await uploadPrivateMedia(db, f.service, actor, wid, sid, input)).toEqual(record); expect(f.download).toHaveBeenCalledWith(path);
    const bad = fixture(); bad.upload.mockResolvedValue({ error: {} }); bad.download.mockResolvedValue({ error: null, data: new Blob(['wrong']) });
    await expect(uploadPrivateMedia(db, bad.service, actor, wid, sid, input)).rejects.toMatchObject({ status: 503 }); expect(bad.rpc).toHaveBeenCalledTimes(2); expect(bad.remove).not.toHaveBeenCalled();
  });
  it('never deletes on an uncertain commit response', async () => {
    const f = fixture(); f.rpc.mockResolvedValueOnce({ error: null, data: null as never }).mockResolvedValueOnce({ error: null, data: { state: 'pending', path, version: 1 } }).mockResolvedValueOnce({ error: { code: 'PGRST000' }, data: null as never });
    await expect(uploadPrivateMedia(db, f.service, actor, wid, sid, input)).rejects.toThrow(); expect(f.remove).not.toHaveBeenCalled();
  });
  it('does not write again when a retry is already committed', async () => {
    const f = fixture(); f.rpc.mockResolvedValueOnce({ error: null, data: null as never }).mockResolvedValueOnce({ error: null, data: { state: 'committed', record } as never });
    expect(await uploadPrivateMedia(db, f.service, actor, wid, sid, input)).toEqual(record); expect(f.upload).not.toHaveBeenCalled();
  });
  it('checks authenticated scope and actual hash before returning download bytes', async () => {
    const f = fixture(); expect((await readPrivateMediaBytes(db, f.service, actor, wid, sid, mediaId, 1)).bytes).toEqual(new Uint8Array(bytes));
    f.download.mockResolvedValue({ error: null, data: new Blob(['corrupt']) });
    await expect(readPrivateMediaBytes(db, f.service, actor, wid, sid, mediaId, 1)).rejects.toMatchObject({ status: 503 });
  });
  it('processes only claimed paths and keeps failed removals available for recovery', async () => {
    const f = fixture(); expect(await recoverPrivateMediaUploads(db, f.service, actor, wid, sid)).toMatchObject({ recovered: 1, pending: 0 }); expect(f.remove).toHaveBeenCalledWith([path]);
    const bad = fixture(); bad.remove.mockResolvedValue({ error: {} }); expect(await recoverPrivateMediaUploads(db, bad.service, actor, wid, sid)).toMatchObject({ recovered: 0, pending: 1 }); expect(bad.rpc).toHaveBeenCalledTimes(1);
  });
  it('requires explicit review and rejects URLs, unknown fields and malformed transport', () => {
    expect(mediaUploadInputSchema.safeParse(input).success).toBe(true);
    expect(mediaUploadInputSchema.safeParse({ ...input, base64: 'A'.repeat(4 * 1024 * 1024) }).success).toBe(true);
    for (const value of [{ ...input, reviewed: false }, { ...input, url: 'https://example.com/image' }, { ...input, base64: 'bad!' }]) expect(mediaUploadInputSchema.safeParse(value).success).toBe(false);
  });
});
