import { mediaRequestSchema, voiceSessionCloseSchema } from '@bizoveya/agent-contract';
import type { z } from 'zod';

export type VoiceClose = { action: 'close'; id: string; input: z.infer<typeof voiceSessionCloseSchema> };
/** Replaying this exact close receipt never starts another provider session. */
export async function recordVoiceClose(endpoint: string, command: VoiceClose) {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true, signal: AbortSignal.timeout(8000), body: JSON.stringify(command) });
  if (!response.ok) throw new Error('Voice stopped, but its closure was not confirmed. Retry saving this same receipt or ask the operator to inspect recovery. Do not start another session.');
  const receipt = mediaRequestSchema.parse(await response.json());
  if (receipt.id !== command.id || receipt.capability !== 'live-voice' || !receipt.providerStarted || !['succeeded', 'failed'].includes(receipt.status)) throw new Error('Voice closure returned an unrelated or nonterminal receipt. Ask the operator to inspect recovery before starting another session.');
  return receipt;
}
