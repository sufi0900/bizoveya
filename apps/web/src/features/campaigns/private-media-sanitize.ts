import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { PRIVATE_MEDIA_LIMITS, privateMediaDescriptorSchema, type PrivateMediaDescriptor } from './private-media-contracts';

export type MediaAttestation = Pick<PrivateMediaDescriptor, 'alt' | 'rights'>;
// Call only on the server after authenticated owner admission. No URL fetches or client metadata trusted.
export async function sanitizePrivateMedia(input: Uint8Array, attestation: MediaAttestation) {
  if (!input.byteLength || input.byteLength > PRIVATE_MEDIA_LIMITS.maxBytes) throw new Error('Image exceeds the 5 MiB input limit.');
  const source = sharp(input, { limitInputPixels: PRIVATE_MEDIA_LIMITS.maxPixels, failOn: 'warning', sequentialRead: true });
  const metadata = await source.metadata();
  if (!['png', 'jpeg'].includes(metadata.format ?? '') || (metadata.pages ?? 1) !== 1 || !metadata.width || !metadata.height || metadata.width > PRIVATE_MEDIA_LIMITS.maxSide || metadata.height > PRIVATE_MEDIA_LIMITS.maxSide) throw new Error('Use a single PNG or JPEG within 4096 pixels per side.');
  const format = metadata.format === 'png' ? 'png' : 'jpeg';
  const pipeline = source.rotate().toColourspace('srgb');
  // New encoding strips EXIF, ICC, comments and other supplied metadata. Preserve PNG alpha.
  const { data, info } = await (format === 'png' ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 90 })).toBuffer({ resolveWithObject: true });
  const descriptor = privateMediaDescriptorSchema.parse({ schema: 'private-media-descriptor-v1', mime: format === 'png' ? 'image/png' : 'image/jpeg', bytes: data.byteLength, width: info.width, height: info.height, sha256: createHash('sha256').update(data).digest('hex'), origin: 'user-upload', ...attestation });
  return { bytes: data, descriptor };
}
