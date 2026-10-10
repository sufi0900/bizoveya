import { describe, expect, it } from 'vitest';
import { archivePrivateMedia, createPrivateMedia, privateMediaDescriptorSchema, privateMediaRecordSchema, resolvePrivateMedia, revisePrivateMedia, reviewPrivateMedia } from './private-media-contracts';

const scope = { actorId: '11111111-1111-4111-8111-111111111111', workspaceId: '22222222-2222-4222-8222-222222222222', siteId: '33333333-3333-4333-8333-333333333333' };
const mediaId = '44444444-4444-4444-8444-444444444444', otherId = '55555555-5555-4555-8555-555555555555';
const time = '2026-10-10T15:20:00Z';
const descriptor = { schema: 'private-media-descriptor-v1', mime: 'image/png', bytes: 1024, width: 1000, height: 1500, sha256: 'a'.repeat(64), alt: 'Blue abstract background', origin: 'user-upload', rights: { basis: 'own-work', evidence: 'Created by me for private draft use.', attested: true } };
const create = () => createPrivateMedia(mediaId, scope, descriptor, time);
const reference = { mediaId, version: 1, sha256: descriptor.sha256 };
const accept = () => reviewPrivateMedia(create(), scope, 1, 1, 'accepted', 'Reviewed image and rights for private draft use.', time);

describe('private media contract foundation', () => {
  it('requires review before resolving a new upload', () => {
    expect(() => resolvePrivateMedia(create(), scope, reference)).toThrow('review-required');
    expect(resolvePrivateMedia(accept(), scope, reference).descriptor).toEqual(descriptor);
  });
  it.each(['actorId', 'workspaceId', 'siteId'] as const)('denies a mismatched %s', field => {
    const foreign = { ...scope, [field]: otherId };
    expect(() => resolvePrivateMedia(accept(), foreign, reference)).toThrow('unavailable');
    expect(() => revisePrivateMedia(create(), foreign, 1, descriptor, time)).toThrow('unavailable');
    expect(() => reviewPrivateMedia(create(), foreign, 1, 1, 'accepted', 'Checked', time)).toThrow('unavailable');
    expect(() => archivePrivateMedia(create(), foreign, 1)).toThrow('unavailable');
  });
  it('rejects unsupported formats, URL/executable fields and false rights attestation', () => {
    for (const change of [{ mime: 'image/svg+xml' }, { mime: 'image/gif' }, { url: 'https://example.com/image.png' }, { script: 'alert(1)' }, { origin: 'ai-provider' }, { rights: { ...descriptor.rights, attested: false } }]) expect(privateMediaDescriptorSchema.safeParse({ ...descriptor, ...change }).success).toBe(false);
  });
  it('enforces byte, dimension, pixel and hash limits without claiming byte decoding', () => {
    for (const change of [{ bytes: 5 * 1024 * 1024 + 1 }, { bytes: 0 }, { width: 4097 }, { width: 4096, height: 4096 }, { width: 1.5 }, { sha256: 'not-a-hash' }, { alt: '\u0000' }]) expect(privateMediaDescriptorSchema.safeParse({ ...descriptor, ...change }).success).toBe(false);
    expect(privateMediaDescriptorSchema.safeParse({ ...descriptor, bytes: 5 * 1024 * 1024, width: 4000, height: 3000 }).success).toBe(true);
  });
  it('preserves old decisions and pins the exact bytes after creating a replacement', () => {
    const original = accept(), snapshot = JSON.stringify(original);
    const revised = revisePrivateMedia(original, scope, 2, { ...descriptor, sha256: 'b'.repeat(64) }, time);
    expect(JSON.stringify(original)).toBe(snapshot);
    expect(revised.versions[1].review).toBeNull();
    expect(resolvePrivateMedia(revised, scope, reference).reference.version).toBe(1);
    expect(() => resolvePrivateMedia(revised, scope, { ...reference, version: 2 })).toThrow('unavailable');
    expect(() => resolvePrivateMedia(revised, scope, { ...reference, version: 2, sha256: 'b'.repeat(64) })).toThrow('review-required');
  });
  it('blocks stale changes and review overwrites using one shared revision', () => {
    const record = accept();
    expect(() => archivePrivateMedia(record, scope, 1)).toThrow('conflict');
    expect(() => revisePrivateMedia(record, scope, 1, descriptor, time)).toThrow('conflict');
    expect(() => reviewPrivateMedia(record, scope, 2, 1, 'rejected', 'Changed mind', time)).toThrow('conflict');
  });
  it('keeps rejected media unavailable for application', () => {
    const rejected = reviewPrivateMedia(create(), scope, 1, 1, 'rejected', 'Rights unclear', time);
    expect(() => resolvePrivateMedia(rejected, scope, reference)).toThrow('review-required');
  });
  it('archives inventory without mutating an already copied descriptor', () => {
    const record = accept(), copied = resolvePrivateMedia(record, scope, reference);
    copied.descriptor.alt = 'Edited artifact label';
    expect(record.versions[0].descriptor.alt).toBe(descriptor.alt);
    const archived = archivePrivateMedia(record, scope, 2);
    expect(archived.versions).toEqual(record.versions);
    expect(() => resolvePrivateMedia(archived, scope, reference)).toThrow('unavailable');
    expect(() => revisePrivateMedia(archived, scope, 3, descriptor, time)).toThrow('unavailable');
    expect(archivePrivateMedia(archived, scope, 3).revision).toBe(3);
    expect(copied.reference.sha256).toBe(descriptor.sha256);
  });
  it('bounds history and rejects reordered versions or foreign reviewer records', () => {
    let record = create();
    for (let i = 1; i < 20; i++) record = revisePrivateMedia(record, scope, i, descriptor, time);
    expect(() => revisePrivateMedia(record, scope, 20, descriptor, time)).toThrow('limit');
    expect(privateMediaRecordSchema.safeParse({ ...record, versions: [...record.versions].reverse() }).success).toBe(false);
    const reviewed = accept();
    expect(privateMediaRecordSchema.safeParse({ ...reviewed, versions: [{ ...reviewed.versions[0], review: { ...reviewed.versions[0].review, actorId: otherId } }] }).success).toBe(false);
  });
});
