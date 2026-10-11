import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { meetingConsentInputSchema, meetingExecutionQueueSchema } from './consent-contracts';
import { controlMeetingExecutionConsent, loadMeetingExecutionConsents } from './consent-store';
import { MeetingConsentRoom } from './consent-room';

let input: z.infer<typeof meetingConsentInputSchema>, revoke: z.infer<typeof meetingConsentInputSchema>, active: z.infer<typeof meetingExecutionQueueSchema>, history: z.infer<typeof meetingExecutionQueueSchema>;
beforeAll(() => {
  const directory = mkdtempSync(path.join(tmpdir(), 'bizoveya-consent-'));
  try {
    const output = path.join(directory, 'fixture.json');
    execFileSync(process.execPath, ['tools/phase1-verification/run-visual-sql.mjs', '--consent-contract', output], { cwd: path.resolve(process.cwd(), '../..'), timeout: 60000 });
    const fixture = JSON.parse(readFileSync(output, 'utf8'));
    input = meetingConsentInputSchema.parse(fixture.input); revoke = meetingConsentInputSchema.parse(fixture.revokeInput);
    active = meetingExecutionQueueSchema.parse(fixture.activeQueue); history = meetingExecutionQueueSchema.parse(fixture.queue);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}, 60000);
function client(data: unknown, error: unknown = null, identity = { isAdmin: true, aal2: true }) {
  const rpc = vi.fn(async (name: string) => name === 'bz_admin_identity' ? { data: identity, error: null } : { data, error });
  return { db: { rpc } as unknown as SupabaseClient, rpc };
}
describe('actual SQL consent contract and admin boundary', () => {
  it('parses active, expired and revoked SQL records with bounded immutable event history', () => {
    expect(active[0].consents[0].state).toBe('active'); expect(history[0].consents).toHaveLength(25);
    expect(new Set(history[0].consents.map(item => item.state))).toEqual(new Set(['expired', 'revoked']));
    const consent = active[0].consents[0]; expect(Date.parse(consent.expiresAt) - Date.parse(consent.createdAt)).toBe(900000);
    expect(JSON.stringify(active)).not.toMatch(/credentialRef|apiKey/);
  });
  it('rejects null fields, unreviewed consent, control characters and invented worker authority', () => {
    for (const field of Object.keys(input)) expect(meetingConsentInputSchema.safeParse({ ...input, [field]: null }).success).toBe(false);
    for (const change of [{ reviewed: false }, { reason: 'bad\ncontrol reason' }, { execute: true }]) expect(meetingConsentInputSchema.safeParse({ ...input, ...change }).success).toBe(false);
    expect(meetingExecutionQueueSchema.safeParse([{ ...active[0], summary: { ...active[0].summary, executionEnabled: true } }]).success).toBe(false);
    expect(meetingExecutionQueueSchema.safeParse([{ ...active[0], consents: [{ ...active[0].consents[0], state: 'revoked' }] }]).success).toBe(false);
  });
  it('denies non-admin and non-MFA identities before accessing the consent RPC', async () => {
    for (const identity of [{ isAdmin: false, aal2: true }, { isAdmin: true, aal2: false }]) {
      const f = client(active, null, identity); await expect(controlMeetingExecutionConsent(f.db, input)).rejects.toMatchObject({ status: 403 }); expect(f.rpc).toHaveBeenCalledTimes(1);
    }
  });
  it('uses authenticated exact-command RPCs and confirms truthful retry history', async () => {
    const grant = client(active), withdrawal = client(history);
    await controlMeetingExecutionConsent(grant.db, input); await controlMeetingExecutionConsent(withdrawal.db, revoke);
    const { action, ...command } = input; expect(action).toBe('consent');
    expect(grant.rpc).toHaveBeenLastCalledWith('bz_admin_consent_meeting_execution', { p_input: command });
    expect(withdrawal.rpc.mock.calls[1][0]).toBe('bz_admin_revoke_meeting_execution');
    expect(await controlMeetingExecutionConsent(withdrawal.db, input)).toEqual({ meetings: history });
  });
  it('rejects incomplete confirmation and safely reports blockers without retrying', async () => {
    const missing = client([]); await expect(controlMeetingExecutionConsent(missing.db, input)).rejects.toMatchObject({ status: 503 }); expect(missing.rpc).toHaveBeenCalledTimes(2);
    for (const error of [{ code: 'PGRST202' }, { code: '42501', message: 'bz_forbidden' }, { message: 'bz_meeting_snapshot_changed' }, { message: 'bz_meeting_consent_active' }, { message: 'private credential details' }]) {
      const f = client(null, error); await expect(loadMeetingExecutionConsents(f.db)).rejects.not.toThrow('private credential details'); expect(f.rpc).toHaveBeenCalledTimes(2);
    }
  });
});
describe('consent-only operator interface', () => {
  const render = (meetings = active) => renderToStaticMarkup(<MeetingConsentRoom initial={{ meetings }} />);
  it('shows approved context, both explicit review fields and no provider or activation inputs', () => {
    const html = render(); expect(html).toContain('Execution consent review reason'); expect(html).toContain('Revocation review reason'); expect(html).toContain('Save 15-minute consent only.'); expect(html).toContain('independent accounting are not connected yet'); expect(html).not.toContain('apiKey');
  });
  it('disables new consent for active, blocked and capped records while preserving revocation', () => {
    for (const meetings of [active, [{ ...active[0], blocked: true }], history]) {
      const html = render(meetings); expect(html).toContain('<fieldset disabled=""><legend>Consent'); expect(html).toContain('<fieldset><legend>Revoke this consent');
    }
    expect(render([])).toContain('Save a qualified meeting snapshot');
  });
});
