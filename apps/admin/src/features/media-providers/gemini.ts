import { z } from 'zod';
import { imageRequestSchema, mediaProviderSelectionSchema, type MediaProviderAdapter } from './contracts';

const origin = 'https://generativelanguage.googleapis.com';
const tokenCount = (value: unknown) => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 2_000_000 ? Number(value) : null;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
async function boundedJson(response: Response) {
  if (!response.ok) throw new Error(response.status === 429 ? 'Gemini quota unavailable.' : 'Gemini media request failed.');
  if (Number(response.headers.get('content-length') ?? 0) > MAX_RESPONSE_BYTES) throw new Error('Gemini media response exceeds limit.');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Gemini media response missing.');
  let size = 0; const chunks: Uint8Array[] = [];
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_RESPONSE_BYTES) { await reader.cancel(); throw new Error('Gemini media response exceeds limit.'); } chunks.push(value); } }
  finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
const imageResponseSchema = z.object({
  candidates: z.array(z.object({ finishReason: z.string().optional(), content: z.object({ parts: z.array(z.object({ inlineData: z.object({ mimeType: z.string(), data: z.string() }).optional(), text: z.string().optional() }).passthrough()) }).optional() }).passthrough()).optional(),
  usageMetadata: z.object({ promptTokenCount: z.unknown().optional(), candidatesTokenCount: z.unknown().optional(), totalTokenCount: z.unknown().optional() }).passthrough().optional(),
}).passthrough();
const voiceInstructions = 'You are the Bizoveya founder voice assistant. Converse in English. Help the founder clarify a private content request or meeting agenda. You have no tools and cannot save, execute, publish, approve, hire or change knowledge. Explain that the founder must correct and confirm the transcript in the existing proposal form. Never claim that work has been performed.';

// Transport only: callers must first enforce membership, durable admission, qualification,
// consent and accounting. This module is intentionally not connected to a public endpoint.
export function createGeminiMediaAdapter(options: { apiKey: string; imageModelId: string; voiceModelId: string; fetch?: typeof fetch; now?: () => number }): MediaProviderAdapter {
  if (!options.apiKey.trim()) throw new Error('Gemini media credential unavailable.');
  const imageModelId = mediaProviderSelectionSchema.shape.modelId.parse(options.imageModelId);
  const voiceModelId = mediaProviderSelectionSchema.shape.modelId.parse(options.voiceModelId);
  const request = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  async function post(path: string, body: unknown) {
    return boundedJson(await request(`${origin}${path}`, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20_000), headers: { 'Content-Type': 'application/json', 'x-goog-api-key': options.apiKey }, body: JSON.stringify(body) }));
  }
  return {
    provider: 'gemini',
    async generateImage(raw) {
      const input = imageRequestSchema.parse(raw);
      const result = imageResponseSchema.parse(await post(`/v1beta/models/${imageModelId}:generateContent`, { contents: [{ role: 'user', parts: [{ text: input.prompt }] }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: input.aspectRatio, imageSize: '1K' } } }));
      if (result.candidates?.length !== 1 || result.candidates[0].finishReason !== 'STOP') throw new Error('Gemini image output incomplete or blocked.');
      const images = result.candidates[0].content?.parts.flatMap(part => part.inlineData ? [part.inlineData] : []) ?? [];
      if (images.length !== 1 || !['image/png', 'image/jpeg'].includes(images[0].mimeType)) throw new Error('Gemini must return one PNG or JPEG.');
      const image = images[0];
      if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data)) throw new Error('Gemini image encoding invalid.');
      const bytes = Buffer.from(image.data, 'base64');
      if (!bytes.length || bytes.length > 5 * 1024 * 1024 || bytes.toString('base64') !== image.data) throw new Error('Gemini image bytes exceed limit or encoding invalid.');
      const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      if ((image.mimeType === 'image/png' && !png) || (image.mimeType === 'image/jpeg' && !jpeg)) throw new Error('Gemini image signature mismatch.');
      const inputTokens = tokenCount(result.usageMetadata?.promptTokenCount), totalTokens = tokenCount(result.usageMetadata?.totalTokenCount);
      // Account for thinking/other output tokens too; candidatesTokenCount alone can undercount.
      const outputTokens = inputTokens !== null && totalTokens !== null && totalTokens >= inputTokens ? totalTokens - inputTokens : null;
      return { bytes, mime: image.mimeType as 'image/png' | 'image/jpeg', provider: 'gemini', modelId: imageModelId, inputTokens, outputTokens };
    },
    async provisionVoice() {
      const current = now(), expiresAt = new Date(current + 120_000).toISOString(), newSessionExpiresAt = new Date(current + 30_000).toISOString();
      const result = z.object({ name: z.string().min(1).max(8192) }).passthrough().parse(await post('/v1beta/auth_tokens', { uses: 1, expireTime: expiresAt, newSessionExpireTime: newSessionExpiresAt, liveConnectConstraints: { model: `models/${voiceModelId}`, config: { responseModalities: ['AUDIO'], systemInstruction: { parts: [{ text: voiceInstructions }] }, inputAudioTranscription: {}, outputAudioTranscription: {} } } }));
      return { token: result.name, modelId: voiceModelId, expiresAt, newSessionExpiresAt, websocketEndpoint: 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained' };
    },
  };
}
