import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';
vi.mock('../workspaces/store', async original => ({ ...await original<typeof import('../workspaces/store')>(), getSite: vi.fn() }));
import { getSite } from '../workspaces/store';
import { agencyRecordSchema, type AgencyRecord } from './agency-contracts';
import { meetingSnapshotCandidateSchema, meetingSnapshotInputSchema } from './meeting-snapshot-contracts';
import { prepareMeetingSnapshot, reviewMeetingSnapshot } from './meeting-snapshot-store';
import { MeetingSnapshotPanel } from './meeting-snapshot-panel';

let candidate: z.infer<typeof meetingSnapshotCandidateSchema>, command: z.infer<typeof meetingSnapshotInputSchema>, record: AgencyRecord;
beforeAll(() => {
  const directory = mkdtempSync(path.join(tmpdir(), 'bizoveya-snapshot-contract-')), output = path.join(directory, 'fixture.json');
  try {
    execFileSync(process.execPath, ['tools/phase1-verification/run-visual-sql.mjs', '--snapshot-contract', output], { cwd: path.resolve(process.cwd(), '../..'), timeout: 60000 });
    const fixture = JSON.parse(readFileSync(output, 'utf8'));
    candidate = meetingSnapshotCandidateSchema.parse(fixture.candidate); command = meetingSnapshotInputSchema.parse(fixture.command); record = agencyRecordSchema.parse(fixture.record);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}, 60000);
beforeEach(() => vi.mocked(getSite).mockResolvedValue({ workspace: { role: 'owner' } } as never));
const fixture = (data: unknown = null, error: unknown = null) => { const rpc = vi.fn(async () => ({ data, error })); return { rpc, db: { rpc } as unknown as SupabaseClient }; };
const reviewInput = () => ({ id: command.id, planId: command.planId, expectedMeetingVersion: command.expectedMeetingVersion, expectedScheduleVersion: command.expectedScheduleVersion });
const actor = () => record.meetingExecutionSnapshot!.actorId;
const wid = '22222222-2222-4222-8222-222222222222', sid = '33333333-3333-4333-8333-333333333333';
describe('actual SQL meeting snapshot contract', () => {
  it('parses the real review and saved record without execution authority or private runtime configuration', () => {
    expect(candidate.summary.turns).toHaveLength(4); expect(candidate.summary.estimatedCeilingMicros).toBe(9000);
    expect(candidate.summary.executionEnabled).toBe(false); expect(record.meetingExecutionSnapshot?.state).toBe('prepared');
    expect(JSON.stringify(candidate)).not.toMatch(/credentialRef|spendingPolicy"|"agent"|"snapshot"/);
  });
  it('rejects null identities, unreviewed mutations and altered bounded summaries', () => {
    for (const field of Object.keys(command)) expect(meetingSnapshotInputSchema.safeParse({ ...command, [field]: null }).success).toBe(false);
    expect(meetingSnapshotInputSchema.safeParse({ ...command, reviewed: false }).success).toBe(false);
    expect(meetingSnapshotInputSchema.safeParse({ ...command, snapshotId: command.planId }).success).toBe(false);
    expect(meetingSnapshotCandidateSchema.safeParse({ ...candidate, summary: { ...candidate.summary, executionEnabled: true } }).success).toBe(false);
    expect(meetingSnapshotCandidateSchema.safeParse({ ...candidate, summary: { ...candidate.summary, estimatedCeilingMicros: 1 } }).success).toBe(false);
  });
});
describe('snapshot server boundaries', () => {
  it('denies editors and viewers before any review or mutation RPC', async () => {
    for (const role of ['editor', 'viewer']) {
      vi.mocked(getSite).mockResolvedValue({ workspace: { role } } as never);
      const f = fixture();
      await expect(reviewMeetingSnapshot(f.db, actor(), wid, sid, reviewInput())).rejects.toMatchObject({ status: 403 });
      await expect(prepareMeetingSnapshot(f.db, actor(), wid, sid, command)).rejects.toMatchObject({ status: 403 });
      expect(f.rpc).not.toHaveBeenCalled();
    }
  });
  it('reports setup, qualification, cost, stale context and accounting blockers without retrying', async () => {
    for (const error of [{ code: 'PGRST202' }, ...['bz_meeting_qualification_required', 'bz_meeting_cost_ceiling', 'bz_spending_unresolved', 'bz_meeting_snapshot_changed', 'bz_conflict', 'bz_site_roster_paused', 'bz_site_roster_changed'].map(message => ({ message }))]) {
      const f = fixture(null, error);
      await expect(prepareMeetingSnapshot(f.db, actor(), wid, sid, command)).rejects.toMatchObject({ status: 'code' in error ? 503 : 409 });
      expect(f.rpc).toHaveBeenCalledTimes(1);
    }
  });
  it('pins review response identity and makes one authenticated preparation call', async () => {
    const review = fixture(candidate), save = fixture(record);
    expect(await reviewMeetingSnapshot(review.db, actor(), wid, sid, reviewInput())).toEqual(candidate);
    expect(await prepareMeetingSnapshot(save.db, actor(), wid, sid, command)).toEqual(record);
    expect(save.rpc).toHaveBeenCalledWith('bz_prepare_meeting_execution_snapshot', { p_workspace_id: wid, p_site_id: sid, p_input: command });
    const wrong = fixture({ ...candidate, summary: { ...candidate.summary, meetingVersion: 99 } });
    await expect(reviewMeetingSnapshot(wrong.db, actor(), wid, sid, reviewInput())).rejects.toMatchObject({ status: 503 });
  });
  it('rejects incomplete or wrong saved confirmation without another call', async () => {
    for (const value of [{ ...record, meetingExecutionSnapshot: null }, { ...record, meetingExecutionSnapshot: { ...record.meetingExecutionSnapshot, id: wid } }]) {
      const f = fixture(value); await expect(prepareMeetingSnapshot(f.db, actor(), wid, sid, command)).rejects.toMatchObject({ status: 503 }); expect(f.rpc).toHaveBeenCalledTimes(1);
    }
  });
});
describe('snapshot presentation', () => {
  const render = (value: AgencyRecord, owner: boolean, busy = false) => renderToStaticMarkup(<MeetingSnapshotPanel record={value} owner={owner} endpoint="/api/agency" busy={busy} lock={{ current: false }} onBusy={() => {}} onSaved={() => {}} />);
  it('projects saved immutable preparation even after pause without offering execution', () => {
    const html = render(record, false);
    expect(html).toContain('Execution snapshot: prepared'); expect(html).toContain('grants no execution authority'); expect(html).toContain('0.009000'); expect(html).not.toContain('Save qualified snapshot'); expect(html).not.toContain('Load current snapshot review');
  });
  it('offers current review only to owners of ready meetings and disables it while busy', () => {
    const ready = agencyRecordSchema.parse({ ...record, meetingExecutionSnapshot: null, meetingSchedule: { ...record.meetingSchedule, state: 'ready', version: 1 } });
    expect(render(ready, true)).toContain('Load current snapshot review'); expect(render(ready, true)).not.toContain('Save qualified snapshot');
    expect(render(ready, true, true)).toContain('<fieldset disabled=""'); expect(render(ready, false)).not.toContain('Load current snapshot review');
    expect(render(record, true)).not.toContain('Load current snapshot review');
    for (const state of ['paused', 'cancelled']) expect(render(agencyRecordSchema.parse({ ...ready, meetingSchedule: { ...ready.meetingSchedule, state } }), true)).not.toContain('Load current snapshot review');
  });
});
