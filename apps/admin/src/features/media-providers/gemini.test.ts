import { describe, expect, it, vi } from 'vitest';
import { createGeminiMediaAdapter } from './gemini';
import { mediaAvailability, selectMediaAdapter } from './contracts';
const png = Buffer.from([137,80,78,71,13,10,26,10,0]);
const response = (data = png.toString('base64'), mimeType = 'image/png') => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ inlineData: { data, mimeType } }] } }], usageMetadata: { promptTokenCount: 12, candidatesTokenCount: 1120, totalTokenCount: 1132 } });
const input = { prompt: 'Create a private illustration of a founder desk.', aspectRatio: '2:3' as const };
function fixture(body: unknown = response()) {
  const call = vi.fn<typeof fetch>().mockResolvedValue(Response.json(body));
  const adapter = createGeminiMediaAdapter({ apiKey: 'synthetic-key', imageModelId: 'gemini-3.1-flash-lite-image', voiceModelId: 'gemini-2.5-flash-native-audio-preview-12-2025', fetch: call, now: () => 0 });
  return { call, adapter };
}
describe('separate Gemini media transports', () => {
  it('makes exactly one image attempt and captures bytes/provenance/usage', async () => {
    const { call, adapter } = fixture(), result = await adapter.generateImage(input);
    expect(call).toHaveBeenCalledTimes(1); expect(result.bytes).toEqual(png); expect(result.inputTokens).toBe(12); expect(result.outputTokens).toBe(1120);
    const [url, init] = call.mock.calls[0]; expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-image:generateContent'); expect(init?.redirect).toBe('error');
    expect(JSON.parse(String(init?.body)).generationConfig.imageConfig.aspectRatio).toBe('2:3');
  });
  it('never treats missing usage as zero spending', async () => {
    const body = response(); delete (body as { usageMetadata?: unknown }).usageMetadata;
    const result = await fixture(body).adapter.generateImage(input); expect(result.inputTokens).toBeNull(); expect(result.outputTokens).toBeNull();
  });
  it('includes thinking usage and treats incomplete totals as unknown', async () => {
    const body = response(); body.usageMetadata.totalTokenCount = 1232; expect((await fixture(body).adapter.generateImage(input)).outputTokens).toBe(1220);
    delete (body.usageMetadata as { totalTokenCount?: number }).totalTokenCount; expect((await fixture(body).adapter.generateImage(input)).outputTokens).toBeNull();
  });
  it('rejects safety-blocked or incomplete images', async () => {
    const body = response(); body.candidates[0].finishReason = 'SAFETY'; await expect(fixture(body).adapter.generateImage(input)).rejects.toThrow('incomplete or blocked');
  });
  it('rejects multiple candidates rather than selecting arbitrary output', async () => {
    const body = response(); body.candidates.push(body.candidates[0]); await expect(fixture(body).adapter.generateImage(input)).rejects.toThrow();
  });
  it('rejects invalid base64 and mime-signature mismatch', async () => {
    await expect(fixture(response('invalid!')).adapter.generateImage(input)).rejects.toThrow('encoding');
    await expect(fixture(response(png.toString('base64'), 'image/jpeg')).adapter.generateImage(input)).rejects.toThrow('signature');
  });
  it('rejects unsupported image types and text-only responses', async () => {
    await expect(fixture(response('AAAA', 'image/svg+xml')).adapter.generateImage(input)).rejects.toThrow('PNG or JPEG');
    await expect(fixture({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'No image' }] } }] }).adapter.generateImage(input)).rejects.toThrow('PNG or JPEG');
  });
  it('stops on quota errors without retry or provider fallback', async () => {
    const { call, adapter } = fixture(); call.mockResolvedValue(new Response('private provider diagnostic', { status: 429 })); await expect(adapter.generateImage(input)).rejects.toThrow('quota'); expect(call).toHaveBeenCalledTimes(1);
  });
  it('limits streamed response bytes before parsing', async () => {
    const { call, adapter } = fixture(); call.mockResolvedValue(new Response('x', { headers: { 'content-length': String(9 * 1024 * 1024) } })); await expect(adapter.generateImage(input)).rejects.toThrow('exceeds limit');
  });
  it('rejects invalid model IDs and prompt before a provider call', async () => {
    expect(() => createGeminiMediaAdapter({ apiKey: 'test', imageModelId: '../redirect', voiceModelId: 'voice' })).toThrow();
    const { call, adapter } = fixture(); await expect(adapter.generateImage({ ...input, prompt: 'short' })).rejects.toThrow(); expect(call).not.toHaveBeenCalled();
  });
  it('provisions one short-lived voice token constrained to voice and transcript review', async () => {
    const { call, adapter } = fixture({ name: 'auth_tokens/synthetic' }), result = await adapter.provisionVoice();
    expect(result.token).toBe('auth_tokens/synthetic'); expect(result.expiresAt).toBe('1970-01-01T00:02:00.000Z');
    const body = JSON.parse(String(call.mock.calls[0][1]?.body)); expect(body.uses).toBe(1); expect(body.newSessionExpireTime).toBe('1970-01-01T00:00:30.000Z'); expect(body.liveConnectConstraints.config.responseModalities).toEqual(['AUDIO']); expect(body.liveConnectConstraints.config.tools).toBeUndefined(); expect(body.liveConnectConstraints.config.systemInstruction.parts[0].text).toContain('cannot save, execute, publish');
    expect(JSON.stringify(result)).not.toContain('synthetic-key'); expect(call).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed voice-token response', async () => { await expect(fixture({}).adapter.provisionVoice()).rejects.toThrow(); });
  it('keeps agency workflows available when optional artwork is off and allows adapter selection', () => {
    expect(mediaAvailability(false)).toEqual({ templates: true, uploads: true, textDrafts: true, meetings: true, aiArtwork: false });
    const { adapter } = fixture(); expect(selectMediaAdapter('gemini', [adapter])).toBe(adapter); expect(() => selectMediaAdapter('openai', [adapter])).toThrow('not installed');
  });
});
