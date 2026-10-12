import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
import { meetingConsentInputSchema, meetingExecutionQueueSchema, meetingOutcomeHandoffInputSchema, meetingOutcomeReviewInputSchema } from './consent-contracts';
import { controlMeetingExecutionConsent, handoffMeetingDeliberationOutcome, loadMeetingExecutionConsents, reviewMeetingDeliberationOutcome } from './consent-store';
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
    const legacy=JSON.parse(JSON.stringify(active));delete legacy[0].completion;delete legacy[0].reviewedOutcome;await expect(loadMeetingExecutionConsents(client(legacy).db)).rejects.toMatchObject({status:503,code:'MEETING_OUTCOME_SETUP'});
    for (const error of [{ code: 'PGRST202' }, { code: '42501', message: 'bz_forbidden' }, { message: 'bz_meeting_snapshot_changed' }, { message: 'bz_meeting_consent_active' }, { message: 'private credential details' }]) {
      const f = client(null, error); await expect(loadMeetingExecutionConsents(f.db)).rejects.not.toThrow('private credential details'); expect(f.rpc).toHaveBeenCalledTimes(2);
    }
  });
});
describe('consent-only operator interface', () => {
  const render = (meetings = active) => renderToStaticMarkup(<MeetingConsentRoom initial={{ meetings }} />);
  it('shows approved context, explicit one-attempt execution and no credential input', () => {
    const html = render(); expect(html).toContain('Execution consent review reason'); expect(html).toContain('Revocation review reason'); expect(html).toContain('Save 15-minute consent only.'); expect(html).toContain('Run ordered turn 1'); expect(html).toContain('one private provider attempt'); expect(html).not.toContain('apiKey');
  });
  it('disables new consent for active, blocked and capped records while preserving revocation', () => {
    for (const meetings of [active, [{ ...active[0], blocked: true }], history]) {
      const html = render(meetings); expect(html).toContain('<fieldset disabled=""><legend>Consent'); expect(html).toContain('<fieldset><legend>Revoke this consent');
    }
    expect(render([])).toContain('Save a qualified meeting snapshot');
  });
  it('shows founder review only after the whole private deliberation is complete',()=>{
    const completed=[{...active[0],completion:{state:'completed' as const,expectedTurns:active[0].summary.turns.length,recordedTurns:active[0].summary.turns.length,fingerprint:'a'.repeat(64)},reviewedOutcome:null}];
    const html=render(completed);expect(html).toContain('Founder outcome review reason');expect(html).toContain('Save founder outcome review');expect(html).toContain('Save this private outcome only');expect(render()).not.toContain('Save founder outcome review');
  });
});

describe('founder outcome review boundary',()=>{
 it('accepts only an explicit reviewed private outcome command',()=>{const value={action:'review-outcome',snapshotId:active[0].snapshotId,outcomeId:crypto.randomUUID(),fingerprint:'a'.repeat(64),reason:'Reviewed every private turn and citation.',reviewed:true as const};expect(meetingOutcomeReviewInputSchema.parse(value)).toEqual(value);expect(meetingOutcomeReviewInputSchema.safeParse({...value,reviewed:false}).success).toBe(false);});
 it('calls the dedicated review RPC and confirms the exact immutable receipt',async()=>{const base=active[0],turn=base.summary.turns[0],result={schema:'meeting-turn-result-v1' as const,summary:'Reviewed private result.',recommendations:[],concerns:[],citations:[{sourceId:base.summary.knowledge[0].sourceId,sourceVersion:base.summary.knowledge[0].sourceVersion,factId:base.summary.knowledge[0].facts[0].id}]},outcomeId=crypto.randomUUID(),fingerprint='b'.repeat(64),reason='Reviewed all completed turns and approved facts.',document={schema:'meeting-deliberation-outcome-v1' as const,snapshotId:base.snapshotId,meetingId:base.meetingId,planId:base.summary.planId,meetingVersion:base.meetingVersion,scheduleVersion:base.summary.scheduleVersion,rosterVersion:base.summary.rosterVersion,status:'completed' as const,turns:[{turnId:crypto.randomUUID(),ordinal:1,role:turn.role,requestHash:'c'.repeat(64),result,inputTokens:10,outputTokens:20,spendingState:'settled' as const,finishedAt:'2099-01-01T00:00:00Z'}],totals:{inputTokens:10,outputTokens:20},publish:false as const,externalDelivery:false as const},queue=[{...base,completion:{state:'reviewed' as const,expectedTurns:base.summary.turns.length,recordedTurns:base.turns.length,fingerprint},reviewedOutcome:{id:outcomeId,snapshotId:base.snapshotId,fingerprint,reason,document,actorId:base.consents[0].actorId,createdAt:'2099-01-01T00:00:00Z'}}],input={action:'review-outcome' as const,snapshotId:base.snapshotId,outcomeId,fingerprint,reason,reviewed:true as const},f=client(queue);expect(await reviewMeetingDeliberationOutcome(f.db,input)).toEqual({meetings:queue});expect(f.rpc).toHaveBeenLastCalledWith('bz_admin_review_meeting_outcome',{p_input:input});});
});
describe('reviewed outcome handoff boundary',()=>{
 it('requires an independent request identity, explicit channels and no execution flags',()=>{const value={action:'handoff-outcome',outcomeId:crypto.randomUUID(),requestId:crypto.randomUUID(),fingerprint:'d'.repeat(64),instruction:'Prepare a private approved-context follow-up.',channels:['blog','linkedin'],reviewed:true as const};expect(meetingOutcomeHandoffInputSchema.parse(value)).toEqual(value);for(const invalid of [{...value,requestId:value.outcomeId},{...value,channels:[]},{...value,channels:['blog','blog']},{...value,reviewed:false},{...value,execute:true}])expect(meetingOutcomeHandoffInputSchema.safeParse(invalid).success).toBe(false);});
 it('calls the dedicated RPC and confirms exact sanitized lineage',async()=>{const base=active[0],outcomeId=crypto.randomUUID(),requestId=crypto.randomUUID(),fingerprint='e'.repeat(64),reason='Reviewed all private meeting evidence.',turn=base.summary.turns[0],result={schema:'meeting-turn-result-v1' as const,summary:'Private result.',recommendations:[],concerns:[],citations:[{sourceId:base.summary.knowledge[0].sourceId,sourceVersion:base.summary.knowledge[0].sourceVersion,factId:base.summary.knowledge[0].facts[0].id}]},document={schema:'meeting-deliberation-outcome-v1' as const,snapshotId:base.snapshotId,meetingId:base.meetingId,planId:base.summary.planId,meetingVersion:base.meetingVersion,scheduleVersion:base.summary.scheduleVersion,rosterVersion:base.summary.rosterVersion,status:'completed' as const,turns:[{turnId:crypto.randomUUID(),ordinal:1,role:turn.role,requestHash:'f'.repeat(64),result,inputTokens:1,outputTokens:2,spendingState:'settled' as const,finishedAt:'now'}],totals:{inputTokens:1,outputTokens:2},publish:false as const,externalDelivery:false as const},reviewedOutcome={id:outcomeId,snapshotId:base.snapshotId,fingerprint,reason,document,actorId:base.consents[0].actorId,createdAt:'now'},input={action:'handoff-outcome' as const,outcomeId,requestId,fingerprint,instruction:'Prepare a private approved-context follow-up.',channels:['blog' as const],reviewed:true as const},handoff={outcomeId,snapshotId:base.snapshotId,meetingId:base.meetingId,requestId,fingerprint,instruction:input.instruction,channels:input.channels,actorId:reviewedOutcome.actorId,createdAt:'now'},queue=meetingExecutionQueueSchema.parse([{...base,completion:{state:'reviewed',expectedTurns:base.summary.turns.length,recordedTurns:base.turns.length,fingerprint},reviewedOutcome,outcomeHandoff:handoff}]),f=client(queue);expect(await handoffMeetingDeliberationOutcome(f.db,input)).toEqual({meetings:queue});expect(f.rpc).toHaveBeenLastCalledWith('bz_admin_handoff_meeting_outcome',{p_input:input});});
});
