'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MeetingSnapshotPanel } from './meeting-snapshot-panel';
import { agencyCommandSchema, agencyGenerationSchema, agencyHandoffSchema, agencyRecordSchema, meetingDeliberationSchema, meetingScheduleSchema, meetingDistributionSchema, meetingDistributionResultSchema, meetingInvitationSchema, channels, delegationProposal, voiceEntryState, type AgencyRecord } from './agency-contracts';

export function AgencyRoom({ initial, owner, endpoint }: { initial: AgencyRecord[]; owner: boolean; endpoint: string }) {
  const [records, setRecords] = useState(initial);
  const [kind, setKind] = useState<'request' | 'meeting'>('request');
  const [body, setBody] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'corrected-transcript'>('text');
  const [mode, setMode] = useState<'announcement' | 'deliberation'>('announcement');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([...channels]);
  const [roles, setRoles] = useState<string[]>(['coordinator', 'content', 'quality']);
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState('');
  const [decisionConfirmed, setDecisionConfirmed] = useState(false);
  const [title, setTitle] = useState('');
  const [handoffConfirmed, setHandoffConfirmed] = useState(false);
  const [generationConfirmed, setGenerationConfirmed] = useState<string | null>(null);
  const generationAttempts = useRef(new Map<string, { key: string; runId: string }>());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  const attempt = useRef<{ body: string; id: string } | null>(null);
  const handoffAttempts = useRef(new Map<string, { key: string; campaignId: string }>());
  const [distributionInstruction, setDistributionInstruction] = useState('');
  const [distributionChannels, setDistributionChannels] = useState<string[]>([...channels]);
  const [distributionConfirmed, setDistributionConfirmed] = useState<string | null>(null);
  const distributionAttempts = useRef(new Map<string, { key: string; requestId: string }>());
  const [invitationConfirmed, setInvitationConfirmed] = useState<string | null>(null);
  const [deliberationConfirmed, setDeliberationConfirmed] = useState<string | null>(null);
  const [rounds, setRounds] = useState(1);
  const [maxInputTokens, setMaxInputTokens] = useState(1200);
  const [maxOutputTokens, setMaxOutputTokens] = useState(600);
  const [maxCostCents, setMaxCostCents] = useState(5);
  const deliberationAttempts = useRef(new Map<string, { key: string; planId: string }>());
  const [scheduleReason, setScheduleReason] = useState('');
  const [scheduleAction, setScheduleAction] = useState<'queue'|'pause'|'resume'|'cancel'>('queue');
  const [scheduleConfirmed, setScheduleConfirmed] = useState<string | null>(null);
  const scheduleAttempts = useRef(new Map<string, string>());
  function scheduleKey(record: AgencyRecord) { return JSON.stringify({id:record.id,planId:record.meetingDeliberation?.id,expectedMeetingVersion:record.version,expectedVersion:record.meetingSchedule?.version ?? 0,action:scheduleAction,reason:scheduleReason.trim()}); }
  async function controlSchedule(record: AgencyRecord) {
    if (lock.current || !owner || !record.meetingDeliberation) return;
    const key = scheduleKey(record);
    if (!scheduleAttempts.current.has(key)) scheduleAttempts.current.set(key, crypto.randomUUID());
    const parsed = meetingScheduleSchema.safeParse({...JSON.parse(key), operationId:scheduleAttempts.current.get(key), reviewed:scheduleConfirmed === key, intentOnly:true});
    if (!parsed.success) { setMessage('Review the scheduling reason, action and exact meeting and schedule versions.'); return; }
    lock.current=true;setBusy(true);setMessage('');
    try {
      const response=await fetch(`${endpoint}/schedule`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data)});
      const data=await response.json();if(!response.ok) throw new Error(data.error ?? 'Scheduling control failed.');
      const saved=agencyRecordSchema.parse(data);setRecords(previous=>previous.map(item=>item.id===saved.id?saved:item));
      setScheduleConfirmed(null);setScheduleReason('');scheduleAttempts.current.delete(key);
      setMessage('Scheduling intent saved. No AI turn, execution authorization or spending occurred.');
    } catch(error) { setMessage(error instanceof Error?error.message:'Scheduling control failed.'); }
    finally {lock.current=false;setBusy(false);}
  }
  const dirty = Boolean(scheduleReason.trim() || body.trim() || reason.trim() || title.trim() || distributionInstruction.trim() || rounds !== 1 || maxInputTokens !== 1200 || maxOutputTokens !== 600 || maxCostCents !== 5);
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => event.preventDefault();
    const leave = (event: Event) => { if (!window.confirm('Discard unsaved proposal or decision text?')) event.preventDefault(); };
    const link = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('a[href]')) leave(event); };
    window.addEventListener('beforeunload', unload); window.addEventListener('bizoveya:before-signout', leave); document.addEventListener('click', link, true);
    return () => { window.removeEventListener('beforeunload', unload); window.removeEventListener('bizoveya:before-signout', leave); document.removeEventListener('click', link, true); };
  }, [dirty]);
  function change() { setConfirmed(false); }
  async function prepareDeliberation(record: AgencyRecord) {
    if (lock.current || !owner || record.meetingDeliberation || record.document.mode !== 'deliberation' || !record.meetingInvitations?.participants.every(item => item.state === 'acknowledged')) return;
    const key = JSON.stringify({ id: record.id, version: record.version, rounds, maxInputTokens, maxOutputTokens, maxCostCents });
    let attempt = deliberationAttempts.current.get(record.id);
    if (attempt?.key !== key) { attempt = { key, planId: crypto.randomUUID() }; deliberationAttempts.current.set(record.id, attempt); }
    const parsed = meetingDeliberationSchema.safeParse({ id: record.id, planId: attempt.planId, expectedVersion: record.version, rounds, maxInputTokensPerTurn: maxInputTokens, maxOutputTokensPerTurn: maxOutputTokens, maxTotalCostCents: maxCostCents, reviewed: deliberationConfirmed === key });
    if (!parsed.success) { setMessage('Review the exact meeting version and bounded turn, token and future cost limits.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/deliberation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Deliberation planning failed.');
      const saved = agencyRecordSchema.parse(data); setRecords(previous => previous.map(item => item.id === saved.id ? saved : item));
      setDeliberationConfirmed(null); setRounds(1); setMaxInputTokens(1200); setMaxOutputTokens(600); setMaxCostCents(5); deliberationAttempts.current.delete(record.id);
      setMessage('Bounded deliberation plan saved. No participant reasoning, model call, spending reservation or execution occurred.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Deliberation planning failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function invite(record: AgencyRecord) {
    if (lock.current || !owner || !record.meetingDistribution || record.meetingInvitations) return;
    const parsed = meetingInvitationSchema.safeParse({ id: record.id, expectedVersion: record.version, reviewed: invitationConfirmed === `${record.id}:${record.version}` });
    if (!parsed.success) { setMessage('Confirm the exact reviewed meeting version before preparing invitations.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/invitations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Invitation preparation failed.');
      const saved = agencyRecordSchema.parse(data);
      setRecords(previous => previous.map(item => item.id === saved.id ? saved : item)); setInvitationConfirmed(null);
      setMessage('Versioned private invitations prepared for the pinned site team. No attendance, reasoning, execution or provider call was recorded.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Invitation preparation failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function distribute(record: AgencyRecord) {
    if (lock.current || !owner || record.meetingDistribution || record.status !== 'decision-recorded') return;
    const key = JSON.stringify({ version: record.version, instruction: distributionInstruction.trim(), channels: distributionChannels });
    let attempt = distributionAttempts.current.get(record.id);
    if (attempt?.key !== key) { attempt = { key, requestId: crypto.randomUUID() }; distributionAttempts.current.set(record.id, attempt); }
    const parsed = meetingDistributionSchema.safeParse({ id: record.id, requestId: attempt.requestId, expectedVersion: record.version, instruction: distributionInstruction, channels: distributionChannels, reviewed: distributionConfirmed === record.id });
    if (!parsed.success) { setMessage('Review the instruction, selected channels and exact meeting decision.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/distribution`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Distribution failed.');
      const saved = meetingDistributionResultSchema.parse(data);
      setRecords(previous => [saved.request, saved.meeting, ...previous.filter(item => item.id !== saved.request.id && item.id !== saved.meeting.id)]);
      setDistributionInstruction(''); setDistributionConfirmed(null); distributionAttempts.current.delete(record.id);
      setMessage('One private draft request saved with the reviewed meeting decision. Campaign preparation and execution remain separately authorized.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Distribution failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function handoff(record: AgencyRecord) {
    if (lock.current || !owner || record.handoff) return;
    const key = JSON.stringify({ title: title.trim(), version: record.version });
    let attempt = handoffAttempts.current.get(record.id);
    if (attempt?.key !== key) { attempt = { key, campaignId: crypto.randomUUID() }; handoffAttempts.current.set(record.id, attempt); }
    const parsed = agencyHandoffSchema.safeParse({ id: record.id, campaignId: attempt.campaignId, expectedVersion: record.version, title, reviewed: handoffConfirmed });
    if (!parsed.success) { setMessage('Enter a campaign title and confirm the private handoff.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/handoff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Handoff failed.');
      const saved = agencyRecordSchema.parse(data);
      setRecords(previous => previous.map(item => item.id === saved.id ? saved : item));
      setTitle(''); setHandoffConfirmed(false); handoffAttempts.current.delete(record.id);
      setMessage('Private campaign saved. Open it to review the brief. Generation requires a separate readiness and spending check; no provider call was made.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Handoff failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function prepareRun(record: AgencyRecord) {
    if (lock.current || !owner || record.execution || !record.executionPreparation) return;
    const key = JSON.stringify({ requestVersion: record.version, campaignVersion: record.executionPreparation.campaignVersion });
    let attempt = generationAttempts.current.get(record.id);
    if (attempt?.key !== key) { attempt = { key, runId: crypto.randomUUID() }; generationAttempts.current.set(record.id, attempt); }
    const parsed = agencyGenerationSchema.safeParse({ id: record.id, runId: attempt.runId, expectedVersion: record.version, expectedCampaignVersion: record.executionPreparation.campaignVersion, reviewed: generationConfirmed === record.id });
    if (!parsed.success) { setMessage('Confirm the exact linked campaign and request versions.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(`${endpoint}/generation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Preparation failed.');
      const saved = agencyRecordSchema.parse(data);
      setRecords(previous => previous.map(item => item.id === saved.id ? saved : item));
      setGenerationConfirmed(null); generationAttempts.current.delete(record.id);
      setMessage('Generation snapshot linked privately. No provider call or spending reservation was started. Execution requires separate authorized admin dispatch.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Preparation failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function save(record?: AgencyRecord, action?: 'accept-decision' | 'defer' | 'cancel') {
    if (lock.current || !owner) return;
    const draft = kind === 'request' ? { action: kind, instruction: body, channels: selectedChannels, reviewed: confirmed, inputMode } : { action: kind, agenda: body, participants: roles, mode, reviewed: confirmed, inputMode };
    const key = JSON.stringify(draft);
    if (!record && attempt.current?.body !== key) attempt.current = { body: key, id: crypto.randomUUID() };
    const command = record ? { action, id: record.id, expectedVersion: record.version, reason, reviewed: decisionConfirmed } : { ...draft, id: attempt.current!.id };
    const parsed = agencyCommandSchema.safeParse(command);
    if (!parsed.success) { setMessage('Check the fields and explicitly confirm the proposal or decision.'); return; }
    lock.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Save failed.');
      const saved = agencyRecordSchema.parse(data);
      setRecords(previous => [saved, ...previous.filter(item => item.id !== saved.id)]);
      if (record) { setDistributionConfirmed(null); setGenerationConfirmed(null); setDecisionConfirmed(false); setReason(''); } else { setConfirmed(false); setBody(''); attempt.current = null; }
      setMessage('Saved privately. This proposal change does not execute agents or alter its linked run, approved knowledge or publication.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  return <section className="bz-agent-room">
    <div className="bz-card"><h2>Founder desk</h2><p>Requests become proposed channel tasks for the existing content role. Pinterest and LinkedIn are channels, not separate hired agents. Saving costs no provider call.</p><p>{voiceEntryState.reason}</p>
      <fieldset disabled={busy || !owner}><legend>{owner ? 'Prepare a private proposal' : 'Read-only proposals'}</legend>
        <label>Proposal type<select value={kind} onChange={event => { setKind(event.target.value as typeof kind); change(); }}><option value="request">Content request</option><option value="meeting">Meeting agenda</option></select></label>
        <label>Input source<select value={inputMode} onChange={event => { setInputMode(event.target.value as typeof inputMode); change(); }}><option value="text">Typed text</option><option value="corrected-transcript">Pasted and corrected transcript</option></select></label>
        <label>{kind === 'request' ? 'Instruction' : 'Agenda'}<textarea maxLength={2000} value={body} onChange={event => { setBody(event.target.value); change(); }} /></label>
        {kind === 'request' ? <fieldset><legend>Requested channels</legend>{channels.map(channel => <label key={channel}><input type="checkbox" checked={selectedChannels.includes(channel)} onChange={event => { setSelectedChannels(previous => event.target.checked ? [...previous, channel] : previous.filter(value => value !== channel)); change(); }} />{channel}</label>)}</fieldset> : <>
          <label>Meeting mode<select value={mode} onChange={event => { setMode(event.target.value as typeof mode); change(); }}><option value="announcement">Announcement</option><option value="deliberation">Deliberation agenda</option></select></label>
          <fieldset><legend>Requested roles (attendance has not occurred)</legend>{['coordinator', 'content', 'quality'].map(role => <label key={role}><input type="checkbox" checked={roles.includes(role)} onChange={event => { setRoles(previous => event.target.checked ? [...previous, role] : previous.filter(value => value !== role)); change(); }} />{role}</label>)}</fieldset>
        </>}
        <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />I reviewed the exact text and selections. Save a private proposal only.</label>
        <button className="bz-button" disabled={!confirmed || !body.trim()} onClick={() => void save()}>Save proposal</button>
      </fieldset><p role="status" aria-live="polite">{message}</p>
    </div>
    <div className="bz-card"><h2>Saved proposals and decisions</h2><p>Snapshots preserve the authorized catalog, approved sources and preferences at creation. They do not automatically become current knowledge or grant execution permission. Future execution must recheck current approvals and budget.</p>
      <fieldset disabled={busy || !owner}><legend>Prepare a campaign from a saved request</legend>
        <p>The current draft runtime produces all three channels. Your selections identify the requested focus. Preparing a campaign does not run agents. Deferring or cancelling a proposal later does not cancel its linked campaign or generation.</p>
        <label>Campaign title<input maxLength={120} value={title} onChange={event => { setTitle(event.target.value); setHandoffConfirmed(false); }} /></label>
        <label><input type="checkbox" checked={handoffConfirmed} onChange={event => setHandoffConfirmed(event.target.checked)} />I reviewed the selected saved request and title. Create one private campaign without starting generation.</label>
      </fieldset>
      <fieldset disabled={busy || !owner}><legend>Founder decision</legend><label>Decision reason<textarea maxLength={500} value={reason} onChange={event => { setReason(event.target.value); setDecisionConfirmed(false); }} /></label><label><input type="checkbox" checked={decisionConfirmed} onChange={event => setDecisionConfirmed(event.target.checked)} />I confirm this decision applies only to the selected saved proposal.</label></fieldset>
      {!records.length ? <p>No saved proposals yet.</p> : records.map(record => {
        const command = agencyCommandSchema.safeParse(record.document);
        const tasks = command.success && command.data.action === 'request' ? delegationProposal(command.data) : [];
        return <article key={record.id}><h3>{record.kind} · {record.status} · v{record.version}</h3><p style={{ whiteSpace: 'pre-wrap' }}>{String(record.document.instruction ?? record.document.agenda ?? '')}</p>
          <p>Input source: {record.document.inputMode === 'corrected-transcript' ? 'Pasted and corrected transcript' : 'Typed text'}{record.kind === 'meeting' ? ` · ${record.document.mode === 'deliberation' ? 'Deliberation agenda' : 'Announcement'}` : ''}</p>
          {tasks.length ? <ul>{tasks.map(task => <li key={task.channel}>{task.channel}: {task.role} · proposed · execution prerequisites pending</li>)}</ul> : <p>Requested roles: {Array.isArray(record.document.participants) ? record.document.participants.join(', ') : ''}. No agent attendance is inferred; recorded delivery receipts appear below.</p>}
          <details><summary>Saved context and event history</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify({ snapshot: record.snapshot, events: record.events, execution: record.execution }, null, 2)}</pre></details>
          {record.meetingDistribution ? <div><p>Reviewed meeting v{record.meetingDistribution.sourceVersion} linked to private request {record.meetingDistribution.requestId}. No agent attendance or acknowledgement is inferred.</p><details><summary>Immutable meeting decision and distribution</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(record.meetingDistribution, null, 2)}</pre></details></div> : record.kind === 'meeting' && record.status === 'decision-recorded' && record.version < 100 ? <fieldset disabled={busy || !owner}><legend>Distribute this reviewed meeting decision</legend><p>Creates one content request for the selected channels. Review the saved agenda and decision above; this does not change approved knowledge or start generation.</p><label>Distribution instruction<textarea maxLength={1400} value={distributionInstruction} onChange={event => { setDistributionInstruction(event.target.value); setDistributionConfirmed(null); }} /></label><fieldset><legend>Distribution channels</legend>{channels.map(channel => <label key={channel}><input type="checkbox" checked={distributionChannels.includes(channel)} onChange={event => { setDistributionChannels(previous => event.target.checked ? [...previous, channel] : previous.filter(value => value !== channel)); setDistributionConfirmed(null); }} />{channel}</label>)}</fieldset><label><input type="checkbox" checked={distributionConfirmed === record.id} onChange={event => setDistributionConfirmed(event.target.checked ? record.id : null)} />I reviewed meeting v{record.version}, its decision and this instruction. Create one private request only.</label><button className="bz-button" disabled={distributionConfirmed !== record.id || !distributionInstruction.trim() || !distributionChannels.length} onClick={() => void distribute(record)}>Create request from decision</button></fieldset> : null}
          {record.meetingInvitations ? <div><p>Participant delivery: {record.meetingInvitations.participants.map(item => `${item.role} · ${item.state}`).join(' · ')}. Acknowledged means the pinned server worker recorded receipt, not attendance, understanding or task completion.</p><details><summary>Versioned participant invitations</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(record.meetingInvitations, null, 2)}</pre></details></div> : record.kind === 'meeting' && record.meetingDistribution && record.status === 'decision-recorded' && record.version < 100 ? <fieldset disabled={busy || !owner}><legend>Prepare participant invitations</legend><p>Pin the requested roles to the current enabled site team and prepare private delivery packets. This does not start agents or mark acknowledgement.</p><label><input type="checkbox" checked={invitationConfirmed === `${record.id}:${record.version}`} onChange={event => setInvitationConfirmed(event.target.checked ? `${record.id}:${record.version}` : null)} />I reviewed meeting v{record.version}, its requested roles and distributed task. Prepare invitations only.</label><button className="bz-button" disabled={invitationConfirmed !== `${record.id}:${record.version}`} onClick={() => void invite(record)}>Prepare participant invitations</button></fieldset> : null}
          {record.meetingDeliberation ? <div><p>Deliberation plan: {record.meetingDeliberation.turns.length} planned turns · {record.meetingDeliberation.maxInputTokensPerTurn} input / {record.meetingDeliberation.maxOutputTokensPerTurn} output tokens per turn · future execution ceiling ${Number(record.meetingDeliberation.maxTotalCostCents / 100).toFixed(2)}. Planned is not participation or execution.</p><details><summary>Immutable bounded deliberation plan</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(record.meetingDeliberation, null, 2)}</pre></details></div> : record.kind === 'meeting' && record.document.mode === 'deliberation' && record.status === 'decision-recorded' && record.version < 100 && record.meetingInvitations?.participants.every(item => item.state === 'acknowledged') ? <fieldset disabled={busy || !owner}><legend>Prepare bounded deliberation plan</legend><p>All pinned packets are acknowledged. Record deterministic turn and future execution limits only; this makes no model call, reservation or participation claim.</p><label>Rounds per participant<input type="number" min="1" max="2" value={rounds} onChange={event => { setRounds(Number(event.target.value)); setDeliberationConfirmed(null); }} /></label><label>Maximum input tokens per turn<input type="number" min="256" max="2000" value={maxInputTokens} onChange={event => { setMaxInputTokens(Number(event.target.value)); setDeliberationConfirmed(null); }} /></label><label>Maximum output tokens per turn<input type="number" min="128" max="1000" value={maxOutputTokens} onChange={event => { setMaxOutputTokens(Number(event.target.value)); setDeliberationConfirmed(null); }} /></label><label>Future execution cost ceiling (US cents)<input type="number" min="1" max="25" value={maxCostCents} onChange={event => { setMaxCostCents(Number(event.target.value)); setDeliberationConfirmed(null); }} /></label>{(() => { const key=JSON.stringify({id:record.id,version:record.version,rounds,maxInputTokens,maxOutputTokens,maxCostCents}); return <><label><input type="checkbox" checked={deliberationConfirmed === key} onChange={event => setDeliberationConfirmed(event.target.checked ? key : null)} />I reviewed meeting v{record.version} and these exact limits. Save a plan only.</label><button className="bz-button" disabled={deliberationConfirmed !== key} onClick={() => void prepareDeliberation(record)}>Prepare bounded plan</button></>; })()}</fieldset> : null}
          {record.meetingDeliberation && <div>
            <MeetingSnapshotPanel record={record} owner={owner} endpoint={endpoint} busy={busy} lock={lock} onBusy={setBusy} onSaved={saved => setRecords(current => current.map(item => item.id === saved.id ? saved : item))} />
            <p>Scheduling intent: {record.meetingSchedule ? `${record.meetingSchedule.state} · v${record.meetingSchedule.version}` : 'not queued'}. Execution is unavailable until the qualified bounded turn executor is implemented. Ready does not mean running.</p>
            {record.meetingSchedule && <details><summary>Scheduling event history</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(record.meetingSchedule,null,2)}</pre></details>}
            {record.meetingSchedule?.state !== 'cancelled' && <fieldset disabled={busy || !owner}><legend>Review scheduling intent</legend>
              <label>Scheduling action<select value={scheduleAction} onChange={event=>{setScheduleAction(event.target.value as typeof scheduleAction);setScheduleConfirmed(null);}}><option value="queue">Queue intent</option><option value="pause">Pause intent</option><option value="resume">Resume intent</option><option value="cancel">Cancel intent permanently</option></select></label>
              <p>Queue once, pause ready intent, resume paused intent, or permanently cancel. Queue and resume require the unchanged enabled team. Pause and cancel remain available after team changes.</p>
              <label>Scheduling review reason<textarea maxLength={300} value={scheduleReason} onChange={event=>{setScheduleReason(event.target.value);setScheduleConfirmed(null);}} /></label>
              <label><input type="checkbox" checked={scheduleConfirmed === scheduleKey(record)} onChange={event=>setScheduleConfirmed(event.target.checked?scheduleKey(record):null)} />I reviewed meeting v{record.version}, schedule v{record.meetingSchedule?.version ?? 0}, this action and reason. Save intent only.</label>
              <button className="bz-button" disabled={scheduleConfirmed !== scheduleKey(record) || scheduleReason.trim().length < 10} onClick={()=>void controlSchedule(record)}>Save scheduling intent</button>
            </fieldset>}
          </div>}
          {record.handoff ? <div><p>Campaign prepared from request v{record.handoff.sourceVersion}. No generation was started by this handoff.</p><Link className="bz-button" href={`${endpoint.replace(/^\/api/, '').replace(/\/agency$/, '/campaigns')}/${record.handoff.campaignId}`}>Open linked campaign</Link><details><summary>Original campaign handoff</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{JSON.stringify(record.handoff, null, 2)}</pre></details></div> : record.kind === 'request' && record.status === 'proposed' ? <button className="bz-button" disabled={busy || !owner || !handoffConfirmed || !title.trim()} onClick={() => void handoff(record)}>Prepare campaign from this request</button> : null}
          {record.execution ? <><p>Linked generation {record.execution.run.id} · {record.execution.run.status} · campaign v{record.execution.run.campaignVersion}. Refresh this page for current status; completion and human acceptance are separate. Cancelling this proposal does not cancel this run.</p>{record.executionTask&&<p>Assistant task: {record.executionTask.state} · v{record.executionTask.version}{record.executionTask.leaseActive?' · active dispatch':record.executionTask.leaseExpired?' · expired dispatch requires admin inspection':''}. {record.executionTask.lastReason}</p>}</> : record.handoff && record.executionPreparation && record.status === 'proposed' ? <fieldset disabled={busy || !owner}><legend>Prepare the linked request for dispatch</legend><p>Linked campaign: {record.executionPreparation.campaignTitle} · v{record.executionPreparation.campaignVersion}. Open the campaign to review its current brief first. This creates one snapshot through current readiness checks and makes no provider call.</p><label><input type="checkbox" checked={generationConfirmed === record.id} onChange={event => setGenerationConfirmed(event.target.checked ? record.id : null)} />I reviewed this request v{record.version} and linked campaign v{record.executionPreparation.campaignVersion}. Prepare one snapshot only; keep execution separately authorized.</label><button className="bz-button" disabled={generationConfirmed !== record.id} onClick={() => void prepareRun(record)}>Prepare linked generation snapshot</button></fieldset> : null}
          <fieldset disabled={busy || !owner || !decisionConfirmed || !reason.trim() || record.status === 'cancelled'}><legend>Update this proposal</legend>{record.kind === 'meeting' ? <button className="bz-button" onClick={() => void save(record, 'accept-decision')}>Record founder decision</button> : null}<button className="bz-button" onClick={() => void save(record, 'defer')}>Defer proposal</button><button className="bz-button" onClick={() => void save(record, 'cancel')}>Cancel proposal</button></fieldset>
        </article>;
      })}
    </div>
  </section>;
}
