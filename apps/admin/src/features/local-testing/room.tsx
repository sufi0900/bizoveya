'use client';
import {useEffect,useRef,useState} from 'react';
import type {z} from 'zod';
import {queueSchema} from '../generation/dispatch-contracts';
import {campaignDraftBundleSchema} from '@bizoveya/agent-contract';
import {z as validator} from 'zod';
const receiptView=validator.object({stages:validator.array(validator.object({kind:validator.string(),output:validator.unknown()}))});
export function LocalTestingRoom({runs,model}:{runs:z.infer<typeof queueSchema>;model:string}){
 const [id,setId]=useState(''),[mode,setMode]=useState<'ollama'|'fixture'>('ollama'),[reason,setReason]=useState(''),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[receipt,setReceipt]=useState<unknown>(null);
 const active=useRef<AbortController|null>(null),requestId=useRef<string|null>(null),locked=useRef(false);
 useEffect(()=>()=>active.current?.abort(),[]);
 const parsed=receiptView.safeParse(receipt);const draft=campaignDraftBundleSchema.safeParse(parsed.success?parsed.data.stages.find(s=>s.kind==='content')?.output:null);
 async function start(){
  if(locked.current)return;locked.current=true;setBusy(true);setReceipt(null);setMessage('Running locally. Production run status stays unchanged.');
  const controller=new AbortController();active.current=controller;const reading=Boolean(requestId.current);requestId.current??=crypto.randomUUID();
  try{
   const payload={id,requestId:requestId.current,mode,reason,reviewed};
   const read=async(url:string)=>{const r=await fetch(url,{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),data=await r.json();if(!r.ok)throw Error(data.error??'Local rehearsal unavailable');setReceipt(data);return data;};
   let data=await read(`/api/admin/local-testing${reading?'/read':''}`);
   while(['started','running'].includes(data.status)){
    setMessage('Admitted local run. Admin works independently; closing this page does not cancel it. Keep the admin process running.');
    await new Promise<void>((resolve,reject)=>{if(controller.signal.aborted){reject(Error('Monitoring paused'));return;}const stop=()=>{clearTimeout(timer);reject(Error('Monitoring paused'));};const timer=setTimeout(()=>{controller.signal.removeEventListener('abort',stop);resolve();},10000);controller.signal.addEventListener('abort',stop,{once:true});});
    data=await read('/api/admin/local-testing/read');
   }
   setMessage(`Local receipt: ${data.status}. No production acceptance or publication.`);
  }catch(error){setMessage(controller.signal.aborted?'Monitoring paused. The admitted admin worker continues; read the existing receipt later without another model call.':error instanceof Error?error.message:'Local rehearsal unavailable');}finally{active.current=null;locked.current=false;setBusy(false);setReviewed(false);}
 }
 function download(){const u=URL.createObjectURL(new Blob([JSON.stringify(receipt,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=`bizoveya-local-${requestId.current}.json`;a.click();URL.revokeObjectURL(u);}
 return <section className="ba-agent-room"><p className="ba-eyebrow">LOCAL DEVELOPMENT ONLY</p><h1>Local agent rehearsal</h1><p className="ba-notice">Uses frozen facts and instructions as historical test input. It does not establish current knowledge approval, Gemini qualification, production accounting or human acceptance. Outputs stay on this PC; they do not appear as generated drafts on the production customer dashboard.</p><p>Endpoint: 127.0.0.1:11434 · Model: <strong>{model||'not configured'}</strong>. One request per stage, up to five minutes each. Admission returns promptly; work continues in this admin process after the HTTP response. Fixture mode makes no model request.</p>
 <fieldset disabled={busy||Boolean(requestId.current)} style={{border:0,padding:0}}>
 <label>Source snapshot<select value={id} onChange={e=>{setId(e.target.value);setReviewed(false);}}><option value="">Select your snapshot</option>{runs.filter(r=>!r.leaseActive).map(r=><option key={r.id} value={r.id}>{r.title} · {r.id.slice(0,8)} · {r.status}{r.stale?' · historical settings':''}</option>)}</select></label>
 <label>Rehearsal mode<select value={mode} onChange={e=>{setMode(e.target.value as 'ollama'|'fixture');setReviewed(false);}}><option value="ollama">Real local Ollama generation</option><option value="fixture">Synthetic workflow fixture — no AI</option></select></label>
 <label>Local test reason<textarea value={reason} maxLength={300} onChange={e=>{setReason(e.target.value);setReviewed(false);}} placeholder="Test this private campaign locally with Ollama; do not publish."/></label></fieldset>
 <label><input type="checkbox" disabled={busy} checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/> I authorize the local rehearsal of this private snapshot. Historical facts may be outdated. Results are local test evidence only.</label>
 <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><button disabled={busy||!id||!reviewed||reason.trim().length<10||(mode==='ollama'&&!model)} onClick={()=>void start()}>{requestId.current?'Read existing receipt':'Run local rehearsal once'}</button><button disabled={!busy} onClick={()=>active.current?.abort()}>Pause progress updates</button><button disabled={busy||!requestId.current} onClick={()=>{requestId.current=null;setReceipt(null);setReviewed(false);setMessage('Review the prior receipt before authorizing a new model attempt.');}}>Prepare another local rehearsal</button></div>
 <p role="status" aria-live="polite">{message}</p>{draft.success&&<section aria-label="Local draft preview"><h2>Local draft preview — human review pending</h2><article><h3>Blog: {draft.data.blog.title}</h3><p>{draft.data.blog.summary}</p><div style={{whiteSpace:'pre-wrap'}}>{draft.data.blog.body}</div></article><article><h3>Pinterest: {draft.data.pinterest.title}</h3><p>{draft.data.pinterest.description}</p><p>Alt text: {draft.data.pinterest.altText}</p></article><article><h3>LinkedIn</h3><p style={{whiteSpace:'pre-wrap'}}>{draft.data.linkedin.post}</p></article></section>}{receipt!==null&&<><button onClick={download}>Download local receipt</button><details><summary>Local outputs, citations and diagnostics</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',maxWidth:'100%'}}>{JSON.stringify(receipt,null,2)}</pre></details></>}
 </section>;
}
