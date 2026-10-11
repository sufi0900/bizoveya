import { z } from 'zod';
import { privateMediaDescriptorSchema } from './private-media-contracts';
export const MEDIA_UPLOAD_INPUT_LIMIT = 3 * 1024 * 1024;
export const mediaUploadInputSchema = z.object({
  attemptId: z.uuid(), mediaId: z.uuid(), expectedRevision: z.number().int().nonnegative(),
  base64: z.string().min(4).max(4 * Math.ceil(MEDIA_UPLOAD_INPUT_LIMIT / 3)).regex(/^[A-Za-z0-9+/]+={0,2}$/).refine(value => value.length % 4 === 0),
  alt: privateMediaDescriptorSchema.shape.alt, rights: privateMediaDescriptorSchema.shape.rights, reviewed: z.literal(true),
}).strict();
export type MediaUploadInput = z.infer<typeof mediaUploadInputSchema>;
export const mediaCleanupInputSchema = z.object({ confirmed: z.literal(true) }).strict();
export const mediaVersionSchema = z.coerce.number().int().min(1).max(20);
