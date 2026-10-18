import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('../admin/access',()=>({requireAdmin:vi.fn().mockResolvedValue({}),AdminError:class extends Error{constructor(public status:number,public code:string,message:string){super(message);}}}));
import {reviewLocalReceipt} from './review';
const actor='11111111-1111-4111-8111-111111111111',rid='22222222-2222-4222-8222-222222222222';
const env={NODE_ENV:'development',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'};
const input={id:actor,requestId:rid,mode:'ollama' as const,reason:'Local verification only',reviewed:true as const,decision:'changes_requested' as const,expectedVersion:0,reviewReason:'Correct unsupported product claims.'};
let dir:string,file:string;const client={rpc:vi.fn().mockResolvedValue({data:{},error:null})};
async function save(approved=false){await writeFile(file,JSON.stringify({snapshotId:actor,mode:'ollama',reason:input.reason,status:'local_outputs_for_review',productionWrites:false,stages:[{kind:'quality',output:{schema:'campaign-quality-v1',approved,issues:[],checkedCitations:[]}}]}));}
beforeEach(async()=>{dir=await mkdtemp(path.join(tmpdir(),'bz-review-'));vi.spyOn(process,'cwd').mockReturnValue(dir);const folder=path.join(dir,'.bizoveya-local-testing',actor);await mkdir(folder,{recursive:true});file=path.join(folder,`${rid}.json`);client.rpc.mockResolvedValue({data:{},error:null});await save();});
afterEach(async()=>{vi.restoreAllMocks();await rm(dir,{recursive:true,force:true});});
describe('local human reviews',()=>{
 it('records feedback locally and makes duplicate review retries idempotent',async()=>{const r=await reviewLocalReceipt(client as unknown as SupabaseClient,actor,input,env);expect(r.reviews).toHaveLength(1);expect(r.productionWrites).toBe(false);expect(await reviewLocalReceipt(client as unknown as SupabaseClient,actor,input,env)).toEqual(r);expect(JSON.parse(await readFile(file,'utf8')).reviews).toHaveLength(1);});
 it('rejects conflicting review versions',async()=>{await reviewLocalReceipt(client as unknown as SupabaseClient,actor,input,env);await expect(reviewLocalReceipt(client as unknown as SupabaseClient,actor,{...input,reviewReason:'A different review reason.'},env)).rejects.toMatchObject({code:'REVIEW_CONFLICT'});});
 it('blocks acceptance when quality did not approve',async()=>{await expect(reviewLocalReceipt(client as unknown as SupabaseClient,actor,{...input,decision:'accepted'},env)).rejects.toMatchObject({code:'QUALITY_BLOCKED'});});
 it('allows acceptance only for completed real quality-approved output',async()=>{await save(true);const r=await reviewLocalReceipt(client as unknown as SupabaseClient,actor,{...input,decision:'accepted'},env);expect(r.reviews[0].decision).toBe('accepted');});
 it('rechecks owner snapshot authorization',async()=>{client.rpc.mockResolvedValue({data:null,error:{message:'forbidden'}} as never);await expect(reviewLocalReceipt(client as unknown as SupabaseClient,actor,input,env)).rejects.toMatchObject({code:'SNAPSHOT_UNAVAILABLE'});});
 it('cannot operate on hosted admin',async()=>{await expect(reviewLocalReceipt(client as unknown as SupabaseClient,actor,input,{...env,VERCEL:'1'})).rejects.toMatchObject({status:404});});
});
