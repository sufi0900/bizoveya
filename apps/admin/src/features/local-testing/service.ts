import {mkdir,open,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {AdminError,requireAdmin} from '../admin/access';
import type {SupabaseClient} from '@supabase/supabase-js';
import {snapshotSchema} from '../generation/contracts';
import {localTestingEnabled,type RehearsalInput} from './contracts';
import {rehearse} from './runner';

export async function runLocalRehearsal(db:SupabaseClient,actorId:string,input:RehearsalInput,signal:AbortSignal,env:Record<string,string|undefined>=process.env){
 if(!localTestingEnabled(env))throw new AdminError(404,'NOT_FOUND','Local testing is disabled.');
 await requireAdmin(db);
 const model=env.BIZOVEYA_OLLAMA_MODEL?.trim()??'';
 if(input.mode==='ollama'&&(!/^[a-zA-Z0-9][a-zA-Z0-9._/:\-]{0,119}$/.test(model)||model.endsWith('-cloud')))throw new AdminError(409,'LOCAL_MODEL_REQUIRED','Set BIZOVEYA_OLLAMA_MODEL to an installed local model such as qwen3:8b.');
 const directory=path.join(process.cwd(),'.bizoveya-local-testing',actorId);await mkdir(directory,{recursive:true,mode:0o700});
 const fingerprint=createHash('sha256').update(JSON.stringify(input)).digest('hex');
 const file=path.join(directory,`${input.requestId}.json`);
 try{const previous=JSON.parse(await readFile(file,'utf8'));if(previous.fingerprint!==fingerprint)throw new AdminError(409,'REQUEST_CHANGED','Use the original request or explicitly start a new rehearsal.');return previous;}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
 const lock=path.join(process.cwd(),'.bizoveya-local-testing','active.lock');
 let handle;try{handle=await open(lock,'wx',0o600);}catch{throw new AdminError(409,'LOCAL_BUSY','A local rehearsal is active or interrupted. Inspect local receipts before removing active.lock; do not retry blindly.');}
 try{
  // Read-only owner+admin/MFA RPC. Never claims or modifies the production run.
  const result=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});
  if(result.error)throw new AdminError(409,'SNAPSHOT_UNAVAILABLE','Apply migration 077 and select an owned, inactive snapshot.');
  const snapshot=snapshotSchema.parse(result.data);
  const base={schema:'local-rehearsal-v1',requestId:input.requestId,snapshotId:input.id,fingerprint,mode:input.mode,provider:input.mode==='fixture'?'synthetic':'ollama-loopback',model:input.mode==='fixture'?null:model,reason:input.reason,productionAcceptance:false,productionWrites:false,startedAt:new Date().toISOString()};
  await writeFile(file,JSON.stringify({...base,status:'started',stages:[]}),{flag:'wx',mode:0o600});
  let outcome;try{outcome=await rehearse(snapshot,input.mode,model,signal,fetch,async stages=>{
   await writeFile(file,JSON.stringify({...base,status:'running',stages},null,2),{mode:0o600});
   await requireAdmin(db);
  });}catch{
   // Preserve successful earlier stages on context, authorization or receipt failure.
   const prior=JSON.parse(await readFile(file,'utf8'));
   outcome={status:'failed',stages:prior.stages,error:'local_context_or_receipt_unavailable'};
  }
  const receipt={...base,...outcome,finishedAt:new Date().toISOString()};
  // A failed local receipt write must never trigger another model call on retry.
  await writeFile(file,JSON.stringify(receipt,null,2),{mode:0o600});return receipt;
 }finally{await handle.close();const {unlink}=await import('node:fs/promises');await unlink(lock);}
}
