import 'server-only';
import { z } from 'zod';
import { WorkspaceError } from '@/features/workspaces/store';

const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const imageResponseSchema = z.object({
  candidates: z.array(z.object({ finishReason: z.string().optional(), content: z.object({ parts: z.array(z.object({ inlineData: z.object({ mimeType: z.string(), data: z.string() }).optional() }).passthrough()) }).optional() }).passthrough()).optional(),
  usageMetadata: z.object({ promptTokenCount: z.unknown().optional(), totalTokenCount: z.unknown().optional() }).passthrough().optional(),
}).passthrough();
function count(value: unknown) { return Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 2_000_000 ? Number(value) : null; }
async function boundedJson(response: Response) {
  if (!response.ok) throw new WorkspaceError(response.status === 429 ? 429 : 502, response.status === 429 ? 'Gemini image quota is unavailable. No automatic retry occurred.' : 'Gemini image generation failed. No automatic retry occurred.');
  if (Number(response.headers.get('content-length') ?? 0) > MAX_RESPONSE_BYTES) throw new WorkspaceError(502, 'Gemini image response exceeded the private processing limit.');
  const reader = response.body?.getReader(); if (!reader) throw new WorkspaceError(502, 'Gemini image response was empty.');
  let size = 0; const chunks: Uint8Array[] = [];
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_RESPONSE_BYTES) { await reader.cancel(); throw new WorkspaceError(502, 'Gemini image response exceeded the private processing limit.'); } chunks.push(value); } } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)) as unknown; } catch { throw new WorkspaceError(502, 'Gemini returned an invalid image response.'); }
}
export async function generateGeminiImage(modelId: string, prompt: string, aspectRatio: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new WorkspaceError(503, 'Gemini image generation is not configured. Uploads, templates and text workflows remain available.');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/.test(modelId)) throw new WorkspaceError(503, 'The qualified image model is invalid.');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20_000), headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio, imageSize: '1K' } } }) });
  const result = imageResponseSchema.parse(await boundedJson(response));
  if (result.candidates?.length !== 1 || result.candidates[0].finishReason !== 'STOP') throw new WorkspaceError(502, 'Gemini image output was incomplete or blocked. No automatic retry occurred.');
  const images = result.candidates[0].content?.parts.flatMap(part => part.inlineData ? [part.inlineData] : []) ?? [];
  if (images.length !== 1 || !['image/png', 'image/jpeg'].includes(images[0].mimeType)) throw new WorkspaceError(502, 'Gemini did not return exactly one PNG or JPEG.');
  const image = images[0];
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data)) throw new WorkspaceError(502, 'Gemini returned invalid image encoding.');
  const bytes = Buffer.from(image.data, 'base64');
  if (!bytes.length || bytes.length > 5 * 1024 * 1024 || bytes.toString('base64') !== image.data) throw new WorkspaceError(502, 'Gemini image bytes exceeded the private limit or were invalid.');
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if ((image.mimeType === 'image/png' && !png) || (image.mimeType === 'image/jpeg' && !jpeg)) throw new WorkspaceError(502, 'Gemini image signature did not match its media type.');
  const promptTokens = count(result.usageMetadata?.promptTokenCount), totalTokens = count(result.usageMetadata?.totalTokenCount);
  const outputTokens = promptTokens !== null && totalTokens !== null && totalTokens >= promptTokens ? totalTokens - promptTokens : null;
  const inputTokens = outputTokens === null ? null : promptTokens;
  return { bytes, mime: image.mimeType as 'image/png' | 'image/jpeg', inputTokens, outputTokens };
}
