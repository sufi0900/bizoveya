'use client';
import React, { useRef, useState, type MutableRefObject } from 'react';
import type { z } from 'zod';
import { agencyRecordSchema, type AgencyRecord } from './agency-contracts';
import { meetingSnapshotCandidateSchema, meetingSnapshotInputSchema } from './meeting-snapshot-contracts';

export function MeetingSnapshotPanel({ record, owner, endpoint, busy, lock, onBusy, onSaved }: { record: AgencyRecord; owner: boolean; endpoint: string; busy: boolean; lock: MutableRefObject<boolean>; onBusy: (value: boolean) => void; onSaved: (record: AgencyRecord) => void }) {
  const [review, setReview] = useState<{ key: string; candidate: z.infer<typeof meetingSnapshotCandidateSchema> } | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const attempt = useRef<{ key: string; snapshotId: string } | null>(null);
  const key = JSON.stringify({ id: record.id, planId: record.meetingDeliberation?.id, expectedMeetingVersion: record.version, expectedScheduleVersion: record.meetingSchedule?.version });
  const candidate = review?.key === key ? review.candidate : null;
  const saved = record.meetingExecutionSnapshot;
  const available = owner && record.status === 'decision-recorded' && record.meetingSchedule?.state === 'ready' && Boolean(record.meetingDeliberation) && !saved;
  async function loadReview() {
    if (lock.current || !available) return;
    lock.current = true; onBusy(true); setConfirmed(null); setReview(null); setMessage('');
    try {
      const response = await fetch(`${endpoint}/snapshot-review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: key });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Snapshot review is unavailable.');
      const value = meetingSnapshotCandidateSchema.parse(data);
      if (value.summary.meetingId !== record.id || value.summary.planId !== record.meetingDeliberation?.id || value.summary.meetingVersion !== record.version || value.summary.scheduleVersion !== record.meetingSchedule?.version) throw new Error('Reload before reviewing this meeting.');
      setReview({ key, candidate: value }); setMessage('Review the current approved context, pinned roles and limits. No snapshot has been saved.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Snapshot review is unavailable.'); }
    finally { lock.current = false; onBusy(false); }
  }
  async function prepare() {
    if (lock.current || !available || !candidate || confirmed !== candidate.fingerprint) return;
    const attemptKey = `${key}:${candidate.fingerprint}`;
    if (attempt.current?.key !== attemptKey) attempt.current = { key: attemptKey, snapshotId: crypto.randomUUID() };
    const input = meetingSnapshotInputSchema.parse({ ...JSON.parse(key), snapshotId: attempt.current.snapshotId, fingerprint: candidate.fingerprint, reviewed: true });
    lock.current = true; onBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/snapshot`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Snapshot preparation failed.');
      const value = agencyRecordSchema.parse(data);
      if (value.id !== record.id || value.meetingExecutionSnapshot?.id !== input.snapshotId || value.meetingExecutionSnapshot.fingerprint !== candidate.fingerprint) throw new Error('Reload to inspect snapshot confirmation before retrying.');
      onSaved(value); setConfirmed(null); setReview(null); attempt.current = null; setMessage('Qualified snapshot saved; no AI turn or spending started.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Snapshot preparation failed.'); }
    finally { lock.current = false; onBusy(false); }
  }
  if (!record.meetingDeliberation) return null;
  return <section aria-label="Meeting execution snapshot">
    {saved ? <><p>Execution snapshot: prepared · {saved.summary.turns.length} pinned turns · estimated ceiling ${(saved.summary.estimatedCeilingMicros / 1000000).toFixed(6)}. This saved snapshot grants no execution authority; current dependencies must be rechecked before a future worker runs.</p><details><summary>Immutable qualified snapshot review</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(saved, null, 2)}</pre></details></> : <>
      <p>Prepare a qualified execution snapshot from a ready schedule. This starts no AI turn, spending reservation or publication.</p>
      {available && <fieldset disabled={busy}><legend>Review qualified meeting snapshot</legend><button className="bz-button" onClick={() => void loadReview()}>Load current snapshot review</button>
        {candidate && <><p>{candidate.summary.turns.length} pinned turns · {candidate.summary.maxInputTokensPerTurn} input / {candidate.summary.maxOutputTokensPerTurn} output tokens per turn · estimated ceiling ${(candidate.summary.estimatedCeilingMicros / 1000000).toFixed(6)} of ${(candidate.summary.maxTotalCostMicros / 1000000).toFixed(2)} saved limit.</p><details><summary>Approved context and qualification to review</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(candidate.summary, null, 2)}</pre></details><label><input type="checkbox" checked={confirmed === candidate.fingerprint} onChange={event => setConfirmed(event.target.checked ? candidate.fingerprint : null)} />I reviewed this approved context, pinned turns and exact limits. Save the snapshot only.</label><button className="bz-button" disabled={confirmed !== candidate.fingerprint} onClick={() => void prepare()}>Save qualified snapshot</button></>}
      </fieldset>}
    </>}
    <p role="status" aria-live="polite">{message}</p>
  </section>;
}
