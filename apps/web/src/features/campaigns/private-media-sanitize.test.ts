import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { sanitizeGeneratedMedia, sanitizePrivateMedia } from './private-media-sanitize';
const attestation = { alt: 'Blue background', rights: { basis: 'own-work' as const, evidence: 'Original test fixture', attested: true as const } };
describe('server media sanitization', () => {
  it('reencodes bytes, strips metadata, retains alpha and hashes only the actual output', async () => {
    const input = await sharp({ create: { width: 24, height: 32, channels: 4, background: { r: 0, g: 0, b: 255, alpha: 0.5 } } }).png().withMetadata({ orientation: 6 }).toBuffer();
    const result = await sanitizePrivateMedia(input, attestation);
    const metadata = await sharp(result.bytes).metadata();
    expect(result.descriptor.width).toBe(32); expect(result.descriptor.height).toBe(24);
    expect(metadata.hasAlpha).toBe(true); expect(metadata.exif).toBeUndefined(); expect(metadata.icc).toBeUndefined();
    expect(result.descriptor.sha256).toBe(createHash('sha256').update(result.bytes).digest('hex'));
  });
  it('rejects unsupported vector content, invalid bytes, dimensions and missing rights', async () => {
    await expect(sanitizePrivateMedia(new TextEncoder().encode('<svg width="10" height="10"></svg>'), attestation)).rejects.toThrow();
    await expect(sanitizePrivateMedia(new Uint8Array([1, 2, 3]), attestation)).rejects.toThrow();
    const wide = await sharp({ create: { width: 4097, height: 1, channels: 3, background: 'blue' } }).png().toBuffer();
    await expect(sanitizePrivateMedia(wide, attestation)).rejects.toThrow('4096');
    const image = await sharp({ create: { width: 1, height: 1, channels: 3, background: 'blue' } }).png().toBuffer();
    await expect(sanitizePrivateMedia(image, { ...attestation, alt: '' })).rejects.toThrow();
  });
  it('rejects input beyond the transport limit before decoding', async () => {
    await expect(sanitizePrivateMedia(new Uint8Array(5 * 1024 * 1024 + 1), attestation)).rejects.toThrow('input limit');
  });
  it('reencodes provider bytes with sanitized provenance and an unresolved rights review', async () => {
    const input = await sharp({ create: { width: 16, height: 24, channels: 3, background: 'blue' } }).png().withMetadata({ orientation: 6 }).toBuffer();
    const result = await sanitizeGeneratedMedia(input, 'image/png', 'Blue generated assistant', { requestId: '11111111-1111-4111-8111-111111111111', provider: 'gemini', modelId: 'gemini-image', promptHash: 'a'.repeat(64) });
    expect(result.descriptor).toMatchObject({ schema: 'private-media-descriptor-v2', origin: 'ai-generated', rights: { basis: 'provider-output', attested: false }, provenance: { provider: 'gemini' } });
    expect((await sharp(result.bytes).metadata()).exif).toBeUndefined();
  });
});
