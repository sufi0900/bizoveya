import {describe,it,expect,vi,beforeEach} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('@/features/workspaces/store',()=>({getSite:vi.fn(),WorkspaceError:class extends Error{constructor(public status:number,message:string){super(message);}}}));
import {getSite} from '@/features/workspaces/store';
import {localCampaignRequest} from './local-execution-server';
import {localCustomerEnabled,localRequest,localReceipt,newerLocalReceipt} from './local-execution-contracts';
const id='11111111-1111-4111-8111-111111111111',rid='22222222-2222-4222-8222-222222222222';
const input={action:'run' as const,id,requestId:rid,mode:'ollama' as const,reason:'Local verification only',reviewed:true as const};
const env={NODE_ENV:'development',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'};
const receipt={schema:'local-rehearsal-v1',requestId:rid,snapshotId:id,mode:'ollama',provider:'ollama-loopback',model:'qwen3:4b',productionAcceptance:false,productionWrites:false,status:'running',stages:[]};
function request(origin='http://localhost:3000'){return new Request(`${origin}/api/test`,{headers:{origin,host:new URL(origin).host,cookie:'session=opaque'}});}
function db(){return {rpc:vi.fn().mockResolvedValue({data:[{id}],error:null})};}
beforeEach(()=>{vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);});
describe('customer local execution boundary',()=>{
 it('is unavailable in hosted/production environments even with flag',()=>{expect(localCustomerEnabled({...env,NODE_ENV:'production'})).toBe(false);expect(localCustomerEnabled({...env,VERCEL:'false'})).toBe(false);expect(localCustomerEnabled(env)).toBe(true);});
 it('forwards only to fixed local admin with the existing identity and no redirects',async()=>{const client=db(),transport=vi.fn().mockResolvedValue(Response.json(receipt));const r=await localCampaignRequest(client as unknown as SupabaseClient,id,id,id,request(),input,transport,env);expect(r.status).toBe('running');expect(transport.mock.calls[0][0]).toBe('http://localhost:3001/api/admin/local-testing');expect(transport.mock.calls[0][1]).toMatchObject({redirect:'error',cache:'no-store',headers:{Cookie:'session=opaque',Origin:'http://localhost:3001'}});expect(client.rpc).toHaveBeenCalledWith('bz_campaign_generation_history',{p_workspace_id:id,p_site_id:id});});
 it('reads through a separate endpoint that cannot start execution',async()=>{const transport=vi.fn().mockResolvedValue(Response.json(receipt));await localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request(),{...input,action:'read'},transport,env);expect(transport.mock.calls[0][0].endsWith('/read')).toBe(true);});
 it('denies readers/editors before forwarding',async()=>{vi.mocked(getSite).mockResolvedValue({workspace:{role:'editor'}} as never);const transport=vi.fn();await expect(localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request(),input,transport,env)).rejects.toMatchObject({status:403});expect(transport).not.toHaveBeenCalled();});
 it('denies a snapshot from a different site',async()=>{const client=db();client.rpc.mockResolvedValue({data:[],error:null});const transport=vi.fn();await expect(localCampaignRequest(client as unknown as SupabaseClient,id,id,id,request(),input,transport,env)).rejects.toMatchObject({status:403});expect(transport).not.toHaveBeenCalled();});
 it('denies external or mismatched origins',async()=>{const transport=vi.fn();await expect(localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request('https://example.com'),input,transport,env)).rejects.toMatchObject({status:403});expect(transport).not.toHaveBeenCalled();});
 it('keeps MFA failures actionable without returning raw server errors',async()=>{const transport=vi.fn().mockResolvedValue(Response.json({code:'MFA_REQUIRED',error:'private internals'},{status:403}));await expect(localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request(),input,transport,env)).rejects.toThrow('authenticator');});
 it('does not retry an unreachable local admin',async()=>{const transport=vi.fn().mockRejectedValue(Error('socket'));await expect(localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request(),input,transport,env)).rejects.toThrow('saved receipt');expect(transport).toHaveBeenCalledTimes(1);});
 it('rejects a receipt for another snapshot or production acceptance',async()=>{for(const bad of [{...receipt,snapshotId:rid},{...receipt,productionAcceptance:true}]){const transport=vi.fn().mockResolvedValue(Response.json(bad));await expect(localCampaignRequest(db() as unknown as SupabaseClient,id,id,id,request(),input,transport,env)).rejects.toThrow('does not match');}});
 it('requires consent and bounds review reasons',()=>{expect(localRequest.safeParse({...input,reviewed:false}).success).toBe(false);expect(localRequest.safeParse({...input,action:'review',decision:'accepted',expectedVersion:0,reviewReason:'x'.repeat(301)}).success).toBe(false);expect(localReceipt.parse(receipt).reviews).toEqual([]);});
});

it('does not regress completed output or reviews when polling finishes out of order',()=>{const complete=localReceipt.parse({...receipt,status:'local_outputs_for_review',reviews:[{version:1,decision:'changes_requested',reason:'Review feedback',at:'2026-10-18'}]});expect(newerLocalReceipt(complete,localReceipt.parse(receipt))).toBe(complete);expect(newerLocalReceipt(complete,localReceipt.parse({...receipt,status:'local_outputs_for_review'}))).toBe(complete);});

it('accepts truthful cancelled receipts for read-only recovery',()=>{expect(localReceipt.parse({...receipt,status:'cancelled'}).status).toBe('cancelled');});
