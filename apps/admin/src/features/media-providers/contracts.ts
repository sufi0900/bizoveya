import { z } from 'zod';

export const mediaCapabilitySchema = z.enum(['image', 'live-voice']);
export type MediaCapability = z.infer<typeof mediaCapabilitySchema>;
export const mediaProviderSelectionSchema = z.object({
  provider: z.enum(['gemini', 'openai']),
  capability: mediaCapabilitySchema,
  modelId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,119}$/),
  credentialRef: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/),
  enabled: z.boolean(),
}).strict();
export const imageRequestSchema = z.object({
  prompt: z.string().trim().min(10).max(2000),
  aspectRatio: z.enum(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9']),
}).strict();
export type ImageRequest = z.infer<typeof imageRequestSchema>;
export type ImageArtifact = { bytes: Uint8Array; mime: 'image/png' | 'image/jpeg'; provider: string; modelId: string; inputTokens: number | null; outputTokens: number | null };
export type VoiceToken = { token: string; modelId: string; expiresAt: string; newSessionExpiresAt: string; websocketEndpoint: string };
export interface MediaProviderAdapter {
  provider: string;
  generateImage(input: ImageRequest): Promise<ImageArtifact>;
  provisionVoice(): Promise<VoiceToken>;
}
// This is transport selection, not execution qualification or a billable-work authorization.
export function selectMediaAdapter(provider: string, adapters: readonly MediaProviderAdapter[]) {
  const adapter = adapters.find(value => value.provider === provider);
  if (!adapter) throw new Error('Selected media provider is not installed.');
  return adapter;
}
export function mediaAvailability(artworkEnabled: boolean) {
  return { templates: true, uploads: true, textDrafts: true, meetings: true, aiArtwork: artworkEnabled } as const;
}
