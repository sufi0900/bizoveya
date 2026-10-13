import { afterEach, describe, expect, it, vi } from 'vitest';
import { recordVoiceClose, type VoiceClose } from './voice-close';
const command: VoiceClose = { action: 'close', id: '11111111-1111-4111-8111-111111111111', input: { reason: 'stopped', inputTokens: null, outputTokens: null, transcriptHash: null, providerUsageReported: false, reviewed: true } };
afterEach(() => vi.restoreAllMocks());
describe('voice closure confirmation', () => {
  it('reports HTTP rejection and replays only the same close receipt', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ error: 'conflict' }, { status: 409 }));
    await expect(recordVoiceClose('/voice', command)).rejects.toThrow('Do not start another session');
    await expect(recordVoiceClose('/voice', command)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(2);
    for (const [, options] of fetcher.mock.calls) expect(JSON.parse(String(options?.body))).toEqual(command);
  });
  it('rejects an unconfirmed malformed success rather than claiming settlement', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ status: 'succeeded' }));
    await expect(recordVoiceClose('/voice', command)).rejects.toThrow();
  });
});
