'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { assessOnboarding, onboardingReportSchema, onboardingReviewSchema, type OnboardingReport } from './onboarding-contracts';
export function OnboardingPanel({owner,endpoint,sitePath}:{owner:boolean;endpoint:string;sitePath:string}){
 const [report,setReport]=useState<OnboardingReport|null>(null),[note,setNote]=useState(''),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const lock=useRef(false);
 const dirty=Boolean(note.trim());
 useEffect(()=>{if(!dirty)return;const unload=(e:BeforeUnloadEvent)=>e.preventDefault();const leave=(e:Event)=>{if(!window.confirm('Discard the unsaved onboarding review note?'))e.preventDefault();};const link=(e:MouseEvent)=>{if((e.target as HTMLElement).closest('a[href]'))leave(e);};window.addEventListener('beforeunload',unload);window.addEventListener('bizoveya:before-signout',leave);document.addEventListener('click',link,true);return()=>{window.removeEventListener('beforeunload',unload);window.removeEventListener('bizoveya:before-signout',leave);document.removeEventListener('click',link,true);};},[dirty]);
 async function run(save:boolean){
  if(lock.current||save&&(!owner||!report))return;
  if(!save&&dirty&&!window.confirm('Reload the assessment and discard the unsaved review note?'))return;
  const parsed=save&&report?onboardingReviewSchema.safeParse({fingerprint:report.fingerprint,expectedVersion:report.latest?.version??0,note,reviewed}):null;
  if(save&&!parsed?.success){setMessage('Enter a review note and confirm the exact assessment.');return;}
  lock.current=true;setBusy(true);setMessage('');
  try{
   const response=await fetch(endpoint,save?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed!.data)}:{cache:'no-store'});
   const data=await response.json();if(!response.ok)throw new Error(data.error??'Assessment unavailable.');
   setReport(onboardingReportSchema.parse(data));setNote('');setReviewed(false);setMessage(save?'Onboarding review saved privately. No agent was activated and no generation was started.':'Current approved context and qualification checks loaded. No website scraping or AI request was made.');
  }catch(e){setMessage(e instanceof Error?e.message:'Assessment unavailable.');}finally{lock.current=false;setBusy(false);}
 }
 const assessment=report?assessOnboarding(report.current):null;
 return <section className="bz-card"><h2>Onboarding assessment</h2><p>Review approved site facts, audience guidance and current role qualification. This deterministic assessment does not generate an analyst response, hire agents or reserve spending.</p><button className="bz-button" disabled={busy} onClick={()=>void run(false)}>{report?'Reload current assessment':'Load current assessment'}</button><p role="status" aria-live="polite">{message}</p>
  {report&&assessment?<>
   <h3>{assessment.preparationChecksPassed?'Preparation checks passed; generation remains separately gated':'Preparation dependencies need attention'}</h3><p>{assessment.sourceCount} approved sources · {assessment.factCount} approved facts · preferences v{report.current.preferences.version}. Provider calls made by this assessment: 0.</p>
   <table><caption>Current role qualification</caption><thead><tr><th scope="col">Role</th><th scope="col">Preview candidates</th><th scope="col">Qualified candidates</th></tr></thead><tbody>{report.current.roles.map(role=><tr key={role.kind}><th scope="row">{role.kind}</th><td>{role.previewCount}</td><td>{role.qualifiedCount}</td></tr>)}</tbody></table>
   {assessment.blockers.length?<ul>{assessment.blockers.map(item=><li key={item}>{item}</li>)}</ul>:null}{assessment.recommendations.length?<ul>{assessment.recommendations.map(item=><li key={item}>{item}</li>)}</ul>:null}
   <p><Link href={`${sitePath}/knowledge`}>Review site knowledge</Link> · <Link href={`${sitePath}/agents`}>Review audience and brand guidance</Link> · <Link href={`${sitePath}/campaigns`}>Private campaigns</Link></p>
   <details><summary>Approved evidence and current guidance</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify({facts:report.current.facts,preferences:report.current.preferences,catalog:report.current.catalog},null,2)}</pre></details>
   <fieldset disabled={busy||!owner}><legend>{owner?'Record founder review':'Founder review is read-only'}</legend><label>Onboarding review note<textarea maxLength={500} value={note} onChange={e=>{setNote(e.target.value);setReviewed(false);}}/></label><label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>I reviewed this assessment and its blockers. Save my review only; do not activate agents or start generation.</label><button className="bz-button" disabled={!reviewed||!note.trim()} onClick={()=>void run(true)}>Save onboarding review</button></fieldset>
   {report.latest?<div><h3>Saved review v{report.latest.version}</h3><p>{report.latest.fingerprint===report.fingerprint?'Matches the loaded context; reload before a later decision.':'Historical context: sources, preferences or qualification have changed. Review again.'}</p><p>{report.latest.note}</p><details><summary>Original reviewed evidence</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(report.latest.snapshot,null,2)}</pre></details></div>:<p>No founder onboarding review saved yet.</p>}
   <details><summary>Review history ({report.history.length})</summary><ul>{report.history.map(review=><li key={review.version}>v{review.version} · {review.createdAt} · {review.note}</li>)}</ul></details>
  </>:null}
 </section>;
}
