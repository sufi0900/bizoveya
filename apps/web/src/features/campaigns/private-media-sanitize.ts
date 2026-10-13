import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { PRIVATE_MEDIA_LIMITS, privateMediaDescriptorSchema, type PrivateMediaDescriptor } from './private-media-contracts';

export type MediaAttestation = Pick<PrivateMediaDescriptor, 'alt' | 'rights'>;
export type GeneratedMediaProvenance = Extract<PrivateMediaDescriptor, { origin: 'ai-generated' }>['provenance'];
// Call only on the server after authenticated owner admission. No URL fetches or client metadata trusted.
export async function sanitizePrivateMedia(input: Uint8Array, attestation: MediaAttestation) {
  if (!input.byteLength || input.byteLength > PRIVATE_MEDIA_LIMITS.maxBytes) throw new Error('Image exceeds the 5 MiB input limit.');
  const source = sharp(input, { limitInputPixels: PRIVATE_MEDIA_LIMITS.maxPixels, failOn: 'warning', sequentialRead: true });
  const metadata = await source.metadata();
  if (!['png', 'jpeg'].includes(metadata.format ?? '') || (metadata.pages ?? 1) !== 1 || !metadata.width || !metadata.height || metadata.width > PRIVATE_MEDIA_LIMITS.maxSide || metadata.height > PRIVATE_MEDIA_LIMITS.maxSide) throw new Error('Use a single PNG or JPEG within 4096 pixels per side.');
  const format = metadata.format === 'png' ? 'png' : 'jpeg';
  const pipeline = source.rotate().toColourspace('srgb').timeout({ seconds: 10 });
  // New encoding strips EXIF, ICC, comments and other supplied metadata. Preserve PNG alpha.
  const { data, info } = await (format === 'png' ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 90 })).toBuffer({ resolveWithObject: true });
  const descriptor = privateMediaDescriptorSchema.parse({ schema: 'private-media-descriptor-v1', mime: format === 'png' ? 'image/png' : 'image/jpeg', bytes: data.byteLength, width: info.width, height: info.height, sha256: createHash('sha256').update(data).digest('hex'), origin: 'user-upload', ...attestation });
  return { bytes: data, descriptor };
}

export async function sanitizeGeneratedMedia(input: Uint8Array, inputMime: 'image/png' | 'image/jpeg', alt: string, provenance: GeneratedMediaProvenance) {
  if (!input.byteLength || input.byteLength > PRIVATE_MEDIA_LIMITS.maxBytes) throw new Error('Image exceeds the 5 MiB input limit.');
  const source = sharp(input, { limitInputPixels: PRIVATE_MEDIA_LIMITS.maxPixels, failOn: 'warning', sequentialRead: true });
  const metadata = await source.metadata();
  const expected = inputMime === 'image/png' ? 'png' : 'jpeg';
  if (metadata.format !== expected || (metadata.pages ?? 1) !== 1 || !metadata.width || !metadata.height || metadata.width > PRIVATE_MEDIA_LIMITS.maxSide || metadata.height > PRIVATE_MEDIA_LIMITS.maxSide) throw new Error('Provider output must be one valid PNG or JPEG within the private media limits.');
  const pipeline = source.rotate().toColourspace('srgb').timeout({ seconds: 10 });
  const { data, info } = await (expected === 'png' ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 90 })).toBuffer({ resolveWithObject: true });
  const descriptor = privateMediaDescriptorSchema.parse({ schema: 'private-media-descriptor-v2', mime: inputMime, bytes: data.byteLength, width: info.width, height: info.height, sha256: createHash('sha256').update(data).digest('hex'), alt, origin: 'ai-generated', rights: { basis: 'provider-output', evidence: 'Provider-generated output; owner review is required before private use.', attested: false }, provenance });
  return { bytes: data, descriptor };
}
