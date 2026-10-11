'use client';
import React, { useRef, useState } from 'react';
import type { z } from 'zod';
import { meetingConsentInputSchema, meetingExecutionQueueSchema, meetingTurnExecutionInputSchema } from './consent-contracts';
type Meeting = z.infer<typeof meetingExecutionQueueSchema>[number];
export function MeetingConsentRoom({ initial }: { initial: { meetings: z.infer<typeof meetingExecutionQueueSchema> } }) {
  const [meetings, setMeetings] = useState(initial.meetings), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const [consentReason, setConsentReason] = useState(''), [revokeReason, setRevokeReason] = useState(''), [confirmed, setConfirmed] = useState<string | null>(null);
  const lock = useRef(false), attempts = useRef(new Map<string, string>()), turnAttempts = useRef(new Map<string,{turnId:string;claimId:string}>());
  const consentKey = (meeting: Meeting) => JSON.stringify({ action: 'consent', snapshotId: meeting.snapshotId, expectedMeetingVersion: meeting.meetingVersion, expectedScheduleVersion: meeting.scheduleVersion, expectedRosterVersion: meeting.summary.rosterVersion, fingerprint: meeting.fingerprint, reason: consentReason.trim() });
  const revokeKey = (id: string) => JSON.stringify({ action: 'revoke', consentId: id, reason: revokeReason.trim() });
  async function refresh() {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try {
      const response = await fetch('/api/admin/deliberations', { cache: 'no-store' }), data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Consent history could not be refreshed.');
      setMeetings(meetingExecutionQueueSchema.parse(data.meetings)); setConfirmed(null); setMessage('Consent history refreshed. Status is as of this refresh; no work was started.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Refresh failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function submit(key: string) {
    if (lock.current || confirmed !== key) return;
    const value = JSON.parse(key);
    if (value.action === 'consent') {
      if (!attempts.current.has(key)) attempts.current.set(key, crypto.randomUUID());
      value.consentId = attempts.current.get(key);
    }
    const input = meetingConsentInputSchema.safeParse({ ...value, reviewed: true });
    if (!input.success) { setMessage('Review the reason, selected identity and exact versions.'); return; }
    lock.current = true; setBusy(true); setMessage('Saving the reviewed consent action; no AI work will start.');
    try {
      const response = await fetch('/api/admin/deliberations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input.data) }), data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Consent action could not be confirmed. Refresh its history.');
      const next = meetingExecutionQueueSchema.parse(data.meetings), saved = next.flatMap(meeting => meeting.consents).find(consent => consent.id === input.data.consentId);
      if (!saved || (input.data.action === 'revoke' ? saved.state !== 'revoked' || saved.revocationReason !== input.data.reason : saved.reason !== input.data.reason || saved.snapshotId !== input.data.snapshotId)) throw new Error('Refresh consent history before another attempt.');
      setMeetings(next); setConfirmed(null); setConsentReason(''); setRevokeReason(''); attempts.current.delete(key); setMessage(input.data.action === 'consent' ? 'Consent recorded with its original expiry. This did not start execution or spending.' : 'Consent revoked. Existing snapshot and history are preserved.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Consent action failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function execute(meeting:Meeting,consentId:string,ordinal:number,key:string){if(lock.current||confirmed!==key)return;if(!turnAttempts.current.has(key))turnAttempts.current.set(key,{turnId:crypto.randomUUID(),claimId:crypto.randomUUID()});const attempt=turnAttempts.current.get(key)!,input=meetingTurnExecutionInputSchema.safeParse({snapshotId:meeting.snapshotId,consentId,...attempt,ordinal,reviewed:true});if(!input.success){setMessage('Refresh the exact meeting, consent and next-turn identity.');return}lock.current=true;setBusy(true);setMessage('Running one private bounded turn. Do not retry if the outcome becomes uncertain.');try{const response=await fetch('/api/admin/deliberations/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input.data)}),data=await response.json();if(!response.ok)throw new Error(data.error??'Turn stopped. Refresh before any further action.');setMeetings(meetingExecutionQueueSchema.parse(data.meetings));setConfirmed(null);turnAttempts.current.delete(key);setMessage(data.result.status==='completed'?'Private turn saved and spending settled. Review it before starting the next turn.':'Turn did not complete. Review its immutable request and spending status; do not retry blindly.')}catch(error){setMessage(error instanceof Error?error.message:'Turn stopped. Refresh before any further action.')}finally{lock.current=false;setBusy(false)}}
  return <section className="ba-agent-room"><p className="ba-eyebrow">PRIVATE DELIBERATION EXECUTION</p><h1>Meeting execution consent</h1><p>Your latest 50 prepared snapshots in currently owned workspaces. Consent lasts 15 minutes and can be revoked. Each explicit action runs only the next ordered private turn, with one provider attempt and durable request, result and spending evidence. Nothing is published and no external tool is available.</p><button disabled={busy} onClick={() => void refresh()}>Refresh consent and turn history</button><p role="status" aria-live="polite">{message}</p>
    {meetings.length === 0 ? <p>Save a qualified meeting snapshot in the Founder desk first.</p> : meetings.map(meeting => {
      const key = consentKey(meeting), active = meeting.consents.some(consent => consent.state === 'active'), eligible = !meeting.blocked && !active && meeting.consents.length < 25;
      return <article key={meeting.snapshotId}><h2>{meeting.agenda}</h2><p>Snapshot {meeting.snapshotId} · meeting v{meeting.meetingVersion} · schedule v{meeting.scheduleVersion ?? 'unavailable'} · pinned team v{meeting.summary.rosterVersion}</p><details><summary>Approved snapshot context and limits</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(meeting.summary, null, 2)}</pre></details>{meeting.blocked ? <p>The parent, schedule or team changed. New consent is blocked; revocation remains available.</p> : null}<p>Eligibility and current qualification are rechecked on save. Displayed consent status is as of the last refresh.</p>
        <fieldset disabled={busy || !eligible}><legend>Consent to bounded execution</legend><label>Execution consent review reason<textarea maxLength={300} value={consentReason} onChange={event => { setConsentReason(event.target.value); setConfirmed(null); }} /></label><label><input type="checkbox" checked={confirmed === key} onChange={event => setConfirmed(event.target.checked ? key : null)} />I reviewed this snapshot, approved context, exact limits and reason. Save 15-minute consent only.</label><button disabled={confirmed !== key || consentReason.trim().length < 10} onClick={() => void submit(key)}>Save execution consent</button></fieldset>
        {meeting.turns.length?<details><summary>Private immutable turn receipts</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(meeting.turns,null,2)}</pre></details>:<p>No meeting turn has started.</p>}
        {meeting.consents.map(consent => {const ordinal=meeting.turns.length+1,key=`execute:${meeting.snapshotId}:${consent.id}:${ordinal}`,canExecute=consent.state==='active'&&!meeting.blocked&&ordinal<=meeting.summary.turns.length&&meeting.turns.every(turn=>turn.status==='succeeded'&&(turn.spendingState==='settled'||turn.spendingState==='reconciled'));return <div key={consent.id}><p>Consent {consent.id} · {consent.state} · expires {consent.expiresAt}</p><details><summary>Immutable consent event history</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(consent, null, 2)}</pre></details>{canExecute&&<fieldset disabled={busy}><legend>Run ordered turn {ordinal}</legend><label><input type="checkbox" checked={confirmed===key} onChange={event=>setConfirmed(event.target.checked?key:null)}/>I reviewed the active consent, next role and exact limits. Run one private provider attempt.</label><button disabled={confirmed!==key} onClick={()=>void execute(meeting,consent.id,ordinal,key)}>Run private turn {ordinal}</button></fieldset>}{consent.state !== 'revoked' && <fieldset disabled={busy}><legend>Revoke this consent</legend><label>Revocation review reason<textarea maxLength={300} value={revokeReason} onChange={event => { setRevokeReason(event.target.value); setConfirmed(null); }} /></label><label><input type="checkbox" checked={confirmed === revokeKey(consent.id)} onChange={event => setConfirmed(event.target.checked ? revokeKey(consent.id) : null)} />I reviewed this consent identity and reason. Revoke consent.</label><button disabled={confirmed !== revokeKey(consent.id) || revokeReason.trim().length < 10} onClick={() => void submit(revokeKey(consent.id))}>Revoke selected consent</button></fieldset>}</div>})}
      </article>;
    })}
  </section>;
}
