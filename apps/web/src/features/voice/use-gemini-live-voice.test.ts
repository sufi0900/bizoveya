import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('react', () => ({
  useState: (initial: unknown) => [initial, vi.fn()],
  useRef: (initial: unknown) => ({ current: initial }),
  useCallback: (callback: unknown) => callback,
  useEffect: vi.fn(),
}));
import { useGeminiLiveVoice } from './use-gemini-live-voice';
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('pending voice-start resource cleanup', () => {
  it('stops microphone and audio context immediately while token HTTP remains pending', async () => {
    const stop = vi.fn(), close = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] }) } });
    vi.stubGlobal('AudioContext', class { resume = vi.fn().mockResolvedValue(undefined); close = close; });
    let resolve!: (response: Response) => void;
    const fetcher = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
    const voice = useGeminiLiveVoice('/voice', 1);
    const starting = voice.start();
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    await voice.stop();
    expect(stop).toHaveBeenCalled(); expect(close).toHaveBeenCalled();
    expect(fetcher.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
    resolve(Response.json({ error: 'Cancelled test request' }, { status: 503 }));
    await starting;
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('releases a late microphone permission result without starting a provider request', async () => {
    const stop = vi.fn(); let grant!: (stream: unknown) => void;
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: vi.fn().mockImplementation(() => new Promise(done => { grant = done; })) } });
    const fetcher = vi.spyOn(globalThis, 'fetch');
    const voice = useGeminiLiveVoice('/voice', 1), starting = voice.start();
    await voice.stop(); grant({ getTracks: () => [{ stop }] }); await starting;
    expect(stop).toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled();
  });
});
