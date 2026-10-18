import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('../admin/access',()=>({requireAdmin:vi.fn().mockResolvedValue({}),AdminError:class extends Error{constructor(public status:number,public code:string,message:string){super(message);}}}));
import {runLocalRehearsal} from './service';
import {context} from './fixture';
const actor='11111111-1111-4111-8111-111111111111';
const env={NODE_ENV:'development',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'};
describe('local receipts and production isolation',()=>{
 let directory:string;beforeEach(async()=>{directory=await mkdtemp(path.join(tmpdir(),'bz-rehearsal-'));vi.spyOn(process,'cwd').mockReturnValue(directory);});afterEach(async()=>{vi.restoreAllMocks();await rm(directory,{recursive:true,force:true});});
 const input=()=>({id:crypto.randomUUID(),requestId:crypto.randomUUID(),mode:'fixture' as const,reason:'Synthetic local verification',reviewed:true as const});
 const db=()=>({rpc:vi.fn().mockResolvedValue({data:context().snapshot,error:null})});
 it('reads only and saves retry-safe synthetic results locally',async()=>{
  const client=db(),i=input();const r=await runLocalRehearsal(client as unknown as SupabaseClient,actor,i,new AbortController().signal,env);
  expect(r).toMatchObject({status:'synthetic_workflow_checked',productionWrites:false,productionAcceptance:false,provider:'synthetic'});
  expect(client.rpc.mock.calls).toEqual([['bz_admin_local_rehearsal_snapshot',{p_id:i.id}],['bz_admin_local_rehearsal_snapshot',{p_id:i.id}]]);
  const replay=await runLocalRehearsal(client as unknown as SupabaseClient,actor,i,new AbortController().signal,env);expect(replay).toEqual(r);expect(client.rpc).toHaveBeenCalledTimes(3);
  expect(JSON.parse(await readFile(path.join(directory,'.bizoveya-local-testing',actor,`${i.requestId}.json`),'utf8'))).toEqual(r);
  await expect(runLocalRehearsal(client as unknown as SupabaseClient,actor,{...i,reason:'Changed request reason'},new AbortController().signal,env)).rejects.toThrow('original request');
 });
 it('retains interrupted receipts and does not repeat execution',async()=>{
  const client=db(),i=input();await runLocalRehearsal(client as unknown as SupabaseClient,actor,i,new AbortController().signal,env);
  const file=path.join(directory,'.bizoveya-local-testing',actor,`${i.requestId}.json`),r=JSON.parse(await readFile(file,'utf8'));r.status='started';await writeFile(file,JSON.stringify(r));
  expect(await runLocalRehearsal(client as unknown as SupabaseClient,actor,i,new AbortController().signal,env)).toMatchObject({status:'started'});expect(client.rpc).toHaveBeenCalledTimes(3);
 });
 it('blocks hosted execution even with flag set and never reads the snapshot',async()=>{const client=db();await expect(runLocalRehearsal(client as unknown as SupabaseClient,actor,input(),new AbortController().signal,{...env,VERCEL:'1'})).rejects.toThrow('disabled');expect(client.rpc).not.toHaveBeenCalled();});
 it('rejects cloud model identifiers before snapshot reads',async()=>{const client=db();await expect(runLocalRehearsal(client as unknown as SupabaseClient,actor,{...input(),mode:'ollama'},new AbortController().signal,{...env,BIZOVEYA_OLLAMA_MODEL:'qwen3-cloud'})).rejects.toThrow('installed local model');expect(client.rpc).not.toHaveBeenCalled();});
 it('prevents concurrent sessions using a disk lock',async()=>{const client=db(),i=input();await runLocalRehearsal(client as unknown as SupabaseClient,actor,i,new AbortController().signal,env);await writeFile(path.join(directory,'.bizoveya-local-testing','active.lock'),'interrupted');await expect(runLocalRehearsal(client as unknown as SupabaseClient,actor,input(),new AbortController().signal,env)).rejects.toThrow('active or interrupted');expect(client.rpc).toHaveBeenCalledTimes(2);});
});
