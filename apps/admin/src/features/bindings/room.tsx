'use client';
import Link from 'next/link';
import {useRef,useState} from 'react';
import type {loadBindingRoom} from './store';
import {bindingInputSchema,bindingRegistrySchema,issueLabels} from './contracts';
type Data=Awaited<ReturnType<typeof loadBindingRoom>>;
export function BindingsRoom({initial}:{initial:Data}){
 const [data,setData]=useState(initial.assignments);const [agentId,setAgentId]=useState(initial.agents[0]?.id??'');const [profileId,setProfileId]=useState(initial.models.profiles[0]?.id??'');
 const [reason,setReason]=useState('');const [reviewed,setReviewed]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [refreshNeeded,setRefreshNeeded]=useState(false);const lock=useRef(false);
 const agent=initial.agents.find(a=>a.id===agentId);const profile=initial.models.profiles.find(p=>p.id===profileId);const binding=data.bindings.find(b=>b.agent_id===agentId);const credential=initial.models.credentials.find(c=>c.id===profile?.document.credentialRef);
 const test=initial.tests.runs.find(t=>t.profile_id===profileId&&t.current&&t.adapter_version==='connectivity-v1-ai7.0.127');
 const eligible=!!(agent?.checked&&agent.preview_version===agent.latest_version&&profile?.checked&&credential?.enabled&&test&&agent.document.modelTier===profile.document.tier);
 async function save(action:'assign'|'disable'){
  if(lock.current)return;
  const parsed=bindingInputSchema.safeParse({action,agentId,expectedRevision:binding?.revision??0,reviewed,reason,...(action==='assign'?{profileId,testId:test?.id,agentRevision:agent?.revision,profileRevision:profile?.revision,credentialVersion:credential?.version}:{})});
  if(!parsed.success){setMessage('Review your selections, provide a reason and confirm the assignment.');return;}
  lock.current=true;setBusy(true);setMessage('');
  try{const r=await fetch('/api/admin/bindings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data)});const j=await r.json();if(!r.ok)throw new Error(j.error??'Assignment could not be saved.');setData(bindingRegistrySchema.parse(j));setReason('');setReviewed(false);setMessage(action==='assign'?'Assignment saved. Customer generation remains disabled.':'Assignment disabled. History retained.');}
  catch(e){setMessage(e instanceof Error?e.message:'The result is uncertain. Refresh before retrying.');setRefreshNeeded(true);setReviewed(false);}
  finally{lock.current=false;setBusy(false);}
 }
 return <section className="ba-agent-room"><p className="ba-kicker">DRAFT WORKFLOW SETUP</p><h1>Agent model assignments</h1><p>Choose which tested model a reviewed agent will use. Assignments prepare the next drafting stage; they do not send a model request or enable customer generation.</p>
 <p><Link href="/admin/agents">Review agents</Link> · <Link href="/admin/models">Model profiles</Link> · <Link href="/admin/model-tests">Connectivity tests</Link></p>
 <div className="ba-notice">A current assignment requires matching agent, profile and credential versions plus a successful connectivity test from the last 24 hours. The database checks these conditions again when saving. Content quality and spending controls are separate prerequisites.</div>
 <fieldset disabled={busy||refreshNeeded}>
 <label>Agent<select value={agentId} onChange={e=>{setAgentId(e.target.value);setReviewed(false);}}>{initial.agents.map(a=><option key={a.id} value={a.id}>{a.document.name} · v{a.latest_version}</option>)}</select></label>
 {agent&&<p>{agent.kind} · {agent.document.modelTier} · {agent.checked&&agent.preview_version===agent.latest_version?'Latest version checked and approved for context preview':'Review, check and approve the latest agent version first'}</p>}
 <label>Model profile<select value={profileId} onChange={e=>{setProfileId(e.target.value);setReviewed(false);}}><option value="">Select a model profile</option>{initial.models.profiles.map(p=><option key={p.id} value={p.id}>{p.document.name} · v{p.version}</option>)}</select></label>
 {profile&&<p>{profile.document.provider} / {profile.document.modelId} · {profile.document.tier}</p>}
 <p>{test?`Matching passed test completed ${test.finished_at}. Freshness is rechecked on save.`:'No matching successful connectivity test is available.'}</p>
 {!eligible&&<p>To assign: check and approve the latest agent, set its model tier to match the profile, and enable/check/test the model reference.</p>}
 <label>Assignment reason<textarea maxLength={300} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Assign Gemini to this reviewed agent for the draft pilot"/></label>
 <label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/> I reviewed the agent instructions, selected model and recorded test.</label>
 <div className="ba-agent-actions"><button onClick={()=>void save('assign')} disabled={!eligible||!reviewed||reason.trim().length<10}>Save assignment</button><button onClick={()=>void save('disable')} disabled={!binding?.enabled||!reviewed||reason.trim().length<10}>Disable assignment</button></div>
 </fieldset>
 <button disabled={busy} onClick={()=>{window.location.reload();}}>Refresh assignments and configuration</button><p role="status">{message}</p>
 <h2>Saved assignments</h2>{!data.bindings.length&&<p>No assignments saved yet.</p>}{data.bindings.map(b=><article key={b.agent_id}><h3>{initial.agents.find(a=>a.id===b.agent_id)?.document.name??'Recorded agent'}</h3><p><strong>{b.issue?(issueLabels[b.issue]??'Needs review'):'Current assignment — generation not enabled'}</strong></p><p>Agent v{b.agent_version} · model profile v{b.profile_version} · credential reference v{b.credential_version} · assignment revision {b.revision}</p><p>{initial.models.profiles.find(p=>p.id===b.profile_id)?.document.name??b.profile_id}</p><p>{b.reason}</p><p>Updated {b.updated_at} · actor {b.actor_id??'Deleted account'}</p><p>Test: {b.test_id}</p></article>)}
 <h2>Assignment history</h2>{!data.events.length&&<p>No assignment changes recorded.</p>}{data.events.map(e=><article key={e.id}><p>{e.action} · revision {e.revision} · {e.occurred_at}</p><p>{e.reason} · actor {e.actor_id??'Deleted account'}</p></article>)}
 </section>;
}
