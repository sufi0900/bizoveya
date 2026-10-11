'use client';
import { useEffect, useRef, useState } from 'react';
import type { z } from 'zod';
import { privateMediaRecordSchema, privateMediaSummarySchema, type PrivateMediaRecord } from './private-media-contracts';
import { MEDIA_UPLOAD_INPUT_LIMIT, mediaUploadInputSchema } from './private-media-upload-contracts';
type Summary = z.infer<typeof privateMediaSummarySchema>;
function summary(record: PrivateMediaRecord): Summary {
  const last = record.versions.at(-1)!;
  return { mediaId: record.mediaId, revision: record.revision, version: last.version, archived: record.archived, descriptor: last.descriptor, reviewDecision: last.review?.decision ?? null };
}
async function base64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer()); let text = '';
  for (let offset = 0; offset < bytes.length; offset += 16384) text += String.fromCharCode(...bytes.subarray(offset, offset + 16384));
  return btoa(text);
}
export function MediaRoom({ initial, owner, endpoint }: { initial: Summary[]; owner: boolean; endpoint: string }) {
  const [items, setItems] = useState(initial);
  const [record, setRecord] = useState<PrivateMediaRecord | null>(null);
  const [version, setVersion] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [basis, setBasis] = useState<'own-work' | 'licensed' | 'permission'>('own-work');
  const [evidence, setEvidence] = useState('');
  const [attested, setAttested] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reason, setReason] = useState('');
  const [decision, setDecision] = useState<'accepted' | 'rejected'>('accepted');
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const lock = useRef(false); const fileElement = useRef<HTMLInputElement>(null);
  const attempt = useRef<{ key: string; mediaId: string; attemptId: string } | null>(null);
  const dirty = Boolean(file || reason.trim());
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => event.preventDefault();
    const leave = (event: Event) => { if (!window.confirm('Discard unsaved image upload or review?')) event.preventDefault(); };
    const link = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('a[href]')) leave(event); };
    window.addEventListener('beforeunload', unload); window.addEventListener('bizoveya:before-signout', leave); document.addEventListener('click', link, true);
    return () => { window.removeEventListener('beforeunload', unload); window.removeEventListener('bizoveya:before-signout', leave); document.removeEventListener('click', link, true); };
  }, [dirty]);
  function clearUpload() { setFile(null); setReviewed(false); setAttested(false); if (fileElement.current) fileElement.current.value = ''; }
  function accept(next: PrivateMediaRecord) { setRecord(next); setItems(previous => [summary(next), ...previous.filter(item => item.mediaId !== next.mediaId)]); }
  async function run(operation: () => Promise<void>) {
    if (lock.current) return; lock.current = true; setBusy(true); setMessage('');
    try { await operation(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Request failed.'); }
    finally { lock.current = false; setBusy(false); }
  }
  async function json(path: string, body?: unknown) {
    const response = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
    const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Request failed.'); return data;
  }
  function choose(id: string) {
    if (dirty && !window.confirm('Discard unsaved image upload or review?')) return;
    if (!id) { setRecord(null); clearUpload(); setReason(''); setReviewConfirmed(false); attempt.current = null; return; }
    void run(async () => { const next = privateMediaRecordSchema.parse(await json(`${endpoint}/${id}`)); accept(next); setVersion(next.versions.length); clearUpload(); setReason(''); setReviewConfirmed(false); attempt.current = null; });
  }
  async function upload() {
    if (!file || !owner || !reviewed || !attested) throw new Error('Select an image and confirm its rights and upload review.');
    if (file.size > MEDIA_UPLOAD_INPUT_LIMIT) throw new Error('Choose an image no larger than 3 MiB.');
    const encoded = await base64(file);
    const key = JSON.stringify({ id: record?.mediaId, revision: record?.revision, encoded, alt, basis, evidence });
    if (attempt.current?.key !== key) attempt.current = { key, attemptId: crypto.randomUUID(), mediaId: record?.mediaId ?? crypto.randomUUID() };
    const parsed = mediaUploadInputSchema.safeParse({ attemptId: attempt.current.attemptId, mediaId: attempt.current.mediaId, expectedRevision: record?.revision ?? 0, base64: encoded, alt, rights: { basis, evidence, attested }, reviewed });
    if (!parsed.success) throw new Error('Check alternative text, rights evidence and confirmations.');
    const next = privateMediaRecordSchema.parse(await json(`${endpoint}/upload`, parsed.data)); accept(next); setVersion(next.versions.length); clearUpload(); attempt.current = null;
    setMessage('Sanitized image saved privately. Review this new version before using it. No campaign image was changed.');
  }
  const selected = record?.versions[version - 1];
  return <section className="bz-agent-room">
    <div className="bz-card"><h2>Your private images</h2><p>Only your own creator inventory appears here. Saved and archived versions retain their original bytes and rights history.</p>
      <label>Image<select disabled={busy} value={record?.mediaId ?? ''} onChange={event => choose(event.target.value)}><option value="">New image</option>{items.map(item => <option key={item.mediaId} value={item.mediaId}>{item.descriptor.alt} · v{item.version}{item.archived ? ' · archived' : ''}</option>)}</select></label>
      <fieldset disabled={busy || !owner || Boolean(record?.archived)}><legend>{record ? 'Upload a new immutable version' : 'Upload a private image'}</legend>
        <label>PNG or JPEG (maximum 3 MiB)<input ref={fileElement} type="file" accept="image/png,image/jpeg" onChange={event => { setFile(event.target.files?.[0] ?? null); setReviewed(false); setAttested(false); }} /></label>
        <label>Alternative text<textarea value={alt} maxLength={300} onChange={event => { setAlt(event.target.value); setReviewed(false); }} /></label>
        <label>Rights basis<select value={basis} onChange={event => { setBasis(event.target.value as typeof basis); setAttested(false); setReviewed(false); }}><option value="own-work">Own work</option><option value="licensed">Licensed</option><option value="permission">Permission</option></select></label>
        <label>Rights evidence<textarea value={evidence} maxLength={500} onChange={event => { setEvidence(event.target.value); setAttested(false); setReviewed(false); }} /></label>
        <label><input type="checkbox" checked={attested} onChange={event => { setAttested(event.target.checked); setReviewed(false); }} />I have the rights described above to use this image.</label>
        <label><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />I reviewed the image, alternative text and rights. Save privately only.</label>
        <button className="bz-button" disabled={!file || !reviewed || !attested} onClick={() => void run(upload)}>Upload reviewed image</button>
      </fieldset>
      <button className="bz-button" disabled={busy || !owner} onClick={() => { if (window.confirm('Recover tracked uploads that have been incomplete for at least ten minutes? Saved versions will be retained.')) void run(async () => { const result = await json(`${endpoint}/recover`, { confirmed: true }); attempt.current = null; setMessage(`${result.recovered} uploads recovered; ${result.pending} cleanup attempts remain. Saved versions retained.`); }); }}>Recover incomplete uploads</button>
      <p role="status" aria-live="polite">{message}</p>
    </div>
    <div className="bz-card"><h2>Version preview and review</h2>{record && selected ? <>
      <p>{record.archived ? 'Archived' : 'Active'} · revision {record.revision}. Review is immutable; corrections need a new image version.</p>
      <label>Saved version<select disabled={busy} value={version} onChange={event => { setVersion(Number(event.target.value)); setReviewConfirmed(false); }}>{record.versions.map(item => <option key={item.version} value={item.version}>Version {item.version} · {item.review?.decision ?? 'not reviewed'}</option>)}</select></label>
      {/* Authenticated byte route bypasses public image optimization/cache deliberately. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${endpoint}/${record.mediaId}/bytes?version=${version}`} alt={selected.descriptor.alt} onError={() => setMessage('Private preview unavailable. Check the saved version and server setup; metadata and history remain intact.')} style={{ maxWidth: '100%', maxHeight: 480, objectFit: 'contain' }} />
      <p>{selected.descriptor.width} × {selected.descriptor.height} · {selected.descriptor.bytes} bytes · {selected.descriptor.rights.basis}: {selected.descriptor.rights.evidence}</p>
      <a className="bz-button" href={`${endpoint}/${record.mediaId}/bytes?version=${version}`} download={`private-image-v${version}.${selected.descriptor.mime === 'image/png' ? 'png' : 'jpg'}`}>Download this version</a>
      {selected.review ? <p>{selected.review.decision}: {selected.review.reason}</p> : <fieldset disabled={busy || !owner || record.archived}><legend>Review this image version</legend>
        <label>Decision<select value={decision} onChange={event => { setDecision(event.target.value as typeof decision); setReviewConfirmed(false); }}><option value="accepted">Accepted for private use</option><option value="rejected">Rejected</option></select></label>
        <label>Review reason<textarea value={reason} maxLength={500} onChange={event => { setReason(event.target.value); setReviewConfirmed(false); }} /></label>
        <label><input type="checkbox" checked={reviewConfirmed} onChange={event => setReviewConfirmed(event.target.checked)} />I reviewed this saved version and its rights.</label>
        <button className="bz-button" disabled={!reviewConfirmed || !reason.trim()} onClick={() => void run(async () => { accept(privateMediaRecordSchema.parse(await json(`${endpoint}/${record.mediaId}/review`, { expectedRevision: record.revision, version, decision, reason }))); setReason(''); setReviewConfirmed(false); setMessage('Immutable review saved. No content was published.'); })}>Save image review</button>
      </fieldset>}
      <button className="bz-button" disabled={busy || !owner || record.archived} onClick={() => { if (window.confirm('Archive this image? Saved bytes and versions will remain in your private history.')) void run(async () => { accept(privateMediaRecordSchema.parse(await json(`${endpoint}/${record.mediaId}/archive`, { expectedRevision: record.revision }))); setMessage('Image archived; immutable history retained.'); }); }}>Archive image</button>
    </> : <p>Select or upload an image to inspect its saved versions.</p>}</div>
  </section>;
}
