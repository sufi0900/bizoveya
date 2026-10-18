import {mkdir,open,readFile,writeFile,rename,unlink} from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {AdminError,requireAdmin} from '../admin/access';
import type {SupabaseClient} from '@supabase/supabase-js';
import {snapshotSchema} from '../generation/contracts';
import {localTestingEnabled,type RehearsalInput} from './contracts';
import {rehearse} from './runner';

async function admitLocalRehearsal(db:SupabaseClient,actorId:string,input:RehearsalInput,env:Record<string,string|undefined>){
 if(!localTestingEnabled(env))throw new AdminError(404,'NOT_FOUND','Local testing is disabled.');
 await requireAdmin(db);
 const model=env.BIZOVEYA_OLLAMA_MODEL?.trim()??'';
 if(input.mode==='ollama'&&(!/^[a-zA-Z0-9][a-zA-Z0-9._/:\-]{0,119}$/.test(model)||model.endsWith('-cloud')))throw new AdminError(409,'LOCAL_MODEL_REQUIRED','Set BIZOVEYA_OLLAMA_MODEL to an installed local model such as qwen3:8b.');
 const directory=path.join(process.cwd(),'.bizoveya-local-testing',actorId);await mkdir(directory,{recursive:true,mode:0o700});
 const fingerprint=createHash('sha256').update(JSON.stringify(input)).digest('hex');
 const file=path.join(directory,`${input.requestId}.json`);
 try{const previous=JSON.parse(await readFile(file,'utf8'));if(previous.fingerprint!==fingerprint)throw new AdminError(409,'REQUEST_CHANGED','Use the original request or explicitly start a new rehearsal.');const access=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});if(access.error)throw new AdminError(403,'SNAPSHOT_UNAVAILABLE','Snapshot access is no longer available.');return {receipt:previous,execute:null,abandon:null};}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
 const lock=path.join(process.cwd(),'.bizoveya-local-testing','active.lock');
 let handle;try{handle=await open(lock,'wx',0o600);}catch{throw new AdminError(409,'LOCAL_BUSY','A local rehearsal is active or interrupted. Inspect local receipts before removing active.lock; do not retry blindly.');}
 try{
  // Read-only owner+admin/MFA RPC. Never claims or modifies the production run.
  const result=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});
  if(result.error)throw new AdminError(409,'SNAPSHOT_UNAVAILABLE','Apply migration 077 and select an owned, inactive snapshot.');
  const snapshot=snapshotSchema.parse(result.data);
  const base={schema:'local-rehearsal-v1',requestId:input.requestId,snapshotId:input.id,fingerprint,mode:input.mode,provider:input.mode==='fixture'?'synthetic':'ollama-loopback',model:input.mode==='fixture'?null:model,reason:input.reason,productionAcceptance:false,productionWrites:false,startedAt:new Date().toISOString()};
  await writeFile(file,JSON.stringify({...base,status:'started',stages:[]}),{flag:'wx',mode:0o600});
  const receipt={...base,status:'started',stages:[]};let entered=false;
  const release=async()=>{await handle.close();await unlink(lock);};
  const execute=async(signal:AbortSignal)=>{
   if(entered)return;entered=true;
   try{
    let outcome;try{
     await requireAdmin(db);
     const access=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});if(access.error)throw Error('Snapshot access revoked');
     outcome=await rehearse(snapshot,input.mode,model,signal,fetch,async stages=>{
      const stopped=stages.some(s=>s.error);
      await replaceReceipt(file,{...base,status:stopped?'failed':'running',stages,...(stopped?{finishedAt:new Date().toISOString()}:{})});
      await requireAdmin(db);
     });
    }catch{
     const prior=JSON.parse(await readFile(file,'utf8'));
     outcome={status:'failed',stages:prior.stages,error:'local_context_or_receipt_unavailable'};
    }
    const final={...base,...outcome,finishedAt:new Date().toISOString()};
    await replaceReceipt(file,final);return final;
   }finally{await release();}
  };
  const abandon=async()=>{if(entered)return;entered=true;try{await replaceReceipt(file,{...receipt,status:'failed',error:'local_scheduler_unavailable',finishedAt:new Date().toISOString()});}finally{await release();}};
  return {receipt,execute,abandon};
 }catch(error){await handle.close();await unlink(lock);throw error;}
}

// Atomic replacement keeps polling readers from seeing a half-written receipt.
export async function replaceReceipt(file:string,value:unknown){
 const temporary=`${file}.${randomUUID()}.tmp`;
 try{await writeFile(temporary,JSON.stringify(value,null,2),{flag:'wx',mode:0o600});await rename(temporary,file);}catch(error){await unlink(temporary).catch(()=>{});throw error;}
}

// Legacy direct caller remains explicitly cancellable; the HTTP route uses admission below.
export async function runLocalRehearsal(db:SupabaseClient,actorId:string,input:RehearsalInput,signal:AbortSignal,env:Record<string,string|undefined>=process.env){
 const job=await admitLocalRehearsal(db,actorId,input,env);return job.execute?await job.execute(signal):job.receipt;
}
export async function startLocalRehearsal(db:SupabaseClient,actorId:string,input:RehearsalInput,schedule:(job:()=>Promise<void>)=>void,env:Record<string,string|undefined>=process.env){
 const job=await admitLocalRehearsal(db,actorId,input,env);
 if(job.execute){try{schedule(async()=>{await job.execute!(AbortSignal.timeout(16*60*1000));});}catch{await job.abandon!();throw new AdminError(503,'LOCAL_SCHEDULER_UNAVAILABLE','The local worker could not be scheduled. No model call was made.');}}
 return job.receipt;
}
