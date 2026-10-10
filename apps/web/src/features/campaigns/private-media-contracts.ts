import { z } from 'zod';

// Metadata admission only. A future server must decode, sanitize and hash bytes itself.
export const PRIVATE_MEDIA_LIMITS = Object.freeze({ maxBytes: 5 * 1024 * 1024, maxSide: 4096, maxPixels: 12_000_000, maxVersions: 20 });
const note = z.string().trim().min(1).max(500).refine(value => !/[\u0000-\u001f]/.test(value));
export const privateMediaDescriptorSchema = z.object({
  schema: z.literal('private-media-descriptor-v1'),
  mime: z.enum(['image/png', 'image/jpeg']),
  bytes: z.number().int().min(1).max(PRIVATE_MEDIA_LIMITS.maxBytes),
  width: z.number().int().min(1).max(PRIVATE_MEDIA_LIMITS.maxSide),
  height: z.number().int().min(1).max(PRIVATE_MEDIA_LIMITS.maxSide),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  alt: z.string().trim().min(1).max(300).refine(value => !/[\u0000-\u001f]/.test(value)),
  origin: z.literal('user-upload'),
  rights: z.object({ basis: z.enum(['own-work', 'licensed', 'permission']), evidence: note, attested: z.literal(true) }).strict(),
}).strict().refine(value => value.width * value.height <= PRIVATE_MEDIA_LIMITS.maxPixels, 'Image exceeds pixel limit.');
export type PrivateMediaDescriptor = z.infer<typeof privateMediaDescriptorSchema>;
const reviewSchema = z.object({ decision: z.enum(['accepted', 'rejected']), actorId: z.uuid(), reason: note, reviewedAt: z.iso.datetime() }).strict();
export const privateMediaRecordSchema = z.object({
  schema: z.literal('private-media-record-v1'),
  mediaId: z.uuid(), creatorId: z.uuid(), workspaceId: z.uuid(), siteId: z.uuid(),
  revision: z.number().int().positive(), archived: z.boolean(),
  versions: z.array(z.object({ version: z.number().int().min(1).max(PRIVATE_MEDIA_LIMITS.maxVersions), descriptor: privateMediaDescriptorSchema, createdAt: z.iso.datetime(), review: reviewSchema.nullable() }).strict()).min(1).max(PRIVATE_MEDIA_LIMITS.maxVersions),
}).strict().superRefine((record, ctx) => {
  record.versions.forEach((version, index) => {
    if (version.version !== index + 1 || (version.review && version.review.actorId !== record.creatorId)) ctx.addIssue({ code: 'custom', message: 'Media versions/reviewer must retain order and creator identity.', path: ['versions', index] });
  });
});
export type PrivateMediaRecord = z.infer<typeof privateMediaRecordSchema>;
export type PrivateMediaScope = { actorId: string; workspaceId: string; siteId: string };
export const privateMediaReferenceSchema = z.object({ mediaId: z.uuid(), version: z.number().int().min(1).max(PRIVATE_MEDIA_LIMITS.maxVersions), sha256: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
export class PrivateMediaError extends Error {
  constructor(public readonly reason: 'unavailable' | 'conflict' | 'limit' | 'review-required') { super(`Private media ${reason}.`); }
}
function owned(raw: unknown, scope: PrivateMediaScope) {
  const record = privateMediaRecordSchema.parse(raw);
  if (record.creatorId !== scope.actorId || record.workspaceId !== scope.workspaceId || record.siteId !== scope.siteId) throw new PrivateMediaError('unavailable');
  return record;
}
function writable(raw: unknown, scope: PrivateMediaScope, expectedRevision: number) {
  const record = owned(raw, scope);
  if (record.revision !== expectedRevision) throw new PrivateMediaError('conflict');
  if (record.archived) throw new PrivateMediaError('unavailable');
  return record;
}
// Scope must come from authenticated membership; these pure helpers perform no authorization RPC.
export function createPrivateMedia(mediaId: string, scope: PrivateMediaScope, descriptor: unknown, createdAt: string): PrivateMediaRecord {
  return privateMediaRecordSchema.parse({ schema: 'private-media-record-v1', mediaId, creatorId: scope.actorId, workspaceId: scope.workspaceId, siteId: scope.siteId, revision: 1, archived: false, versions: [{ version: 1, descriptor: privateMediaDescriptorSchema.parse(descriptor), createdAt, review: null }] });
}
export function revisePrivateMedia(raw: unknown, scope: PrivateMediaScope, expectedRevision: number, descriptor: unknown, createdAt: string): PrivateMediaRecord {
  const record = writable(raw, scope, expectedRevision);
  if (record.versions.length >= PRIVATE_MEDIA_LIMITS.maxVersions) throw new PrivateMediaError('limit');
  return privateMediaRecordSchema.parse({ ...record, revision: record.revision + 1, versions: [...record.versions, { version: record.versions.length + 1, descriptor: privateMediaDescriptorSchema.parse(descriptor), createdAt, review: null }] });
}
export function reviewPrivateMedia(raw: unknown, scope: PrivateMediaScope, expectedRevision: number, version: number, decision: 'accepted' | 'rejected', reason: string, reviewedAt: string): PrivateMediaRecord {
  const record = writable(raw, scope, expectedRevision);
  // One immutable decision per byte/rights version. Corrections require a new version.
  const selected = record.versions[version - 1];
  if (!selected) throw new PrivateMediaError('unavailable');
  if (selected.review) throw new PrivateMediaError('conflict');
  const review = reviewSchema.parse({ decision, actorId: scope.actorId, reason, reviewedAt });
  return privateMediaRecordSchema.parse({ ...record, revision: record.revision + 1, versions: record.versions.map(item => item.version === version ? { ...item, review } : item) });
}
export function archivePrivateMedia(raw: unknown, scope: PrivateMediaScope, expectedRevision: number): PrivateMediaRecord {
  const record = owned(raw, scope);
  if (record.revision !== expectedRevision) throw new PrivateMediaError('conflict');
  return record.archived ? record : privateMediaRecordSchema.parse({ ...record, archived: true, revision: record.revision + 1 });
}
export function resolvePrivateMedia(raw: unknown, scope: PrivateMediaScope, reference: unknown) {
  const record = owned(raw, scope), ref = privateMediaReferenceSchema.parse(reference);
  const selected = record.versions[ref.version - 1];
  if (record.archived || record.mediaId !== ref.mediaId || !selected || selected.descriptor.sha256 !== ref.sha256) throw new PrivateMediaError('unavailable');
  if (selected.review?.decision !== 'accepted') throw new PrivateMediaError('review-required');
  // A copy cannot be mutated through the inventory record. No URL or credential enters an artifact.
  return { reference: ref, descriptor: privateMediaDescriptorSchema.parse(selected.descriptor), review: reviewSchema.parse(selected.review) };
}
