import {describe,it,expect,vi,beforeEach} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('../workspaces/store',async original=>({...await original<typeof import('../workspaces/store')>(),getSite:vi.fn()}));
import {getSite} from '../workspaces/store';
import {loadCampaigns,reviewGeneration} from './store';
const id='11111111-1111-4111-8111-111111111111';
beforeEach(()=>vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'},site:{id}} as never));
function fixture(error:{code?:string;message?:string}|null=null){const query={select:()=>query,eq:()=>query,order:()=>query,limit:()=>query,then:(f:(v:unknown)=>unknown)=>Promise.resolve({data:[],error:null}).then(f)};const rpc=vi.fn(async(name:string)=>({data:[],error:name==='bz_campaign_generation_outputs'?error:null}));return {rpc,db:{from:()=>query,rpc} as unknown as SupabaseClient};}
describe('private output storage boundary',()=>{
 it('keeps saved campaign access available before output migration is applied',async()=>{const f=fixture({code:'PGRST202'});const r=await loadCampaigns(f.db,id,id,id);expect(r.outputSetupRequired).toBe(true);expect(r.outputs).toEqual([]);expect(r.campaigns).toEqual([]);});
 it('never masks a forbidden output read as an empty setup state',async()=>{const f=fixture({code:'42501',message:'bz_forbidden'});await expect(loadCampaigns(f.db,id,id,id)).rejects.toMatchObject({status:403});});
 it('denies non-owner reviews before invoking SQL',async()=>{vi.mocked(getSite).mockResolvedValueOnce({workspace:{role:'viewer'},site:{id}} as never);const f=fixture();await expect(reviewGeneration(f.db,id,id,id,{id,expectedVersion:0,decision:'accepted',reason:'Review this output for draft use'})).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();});
 it('surfaces QA blockers without recording another action',async()=>{const f=fixture();f.rpc.mockResolvedValueOnce({data:null,error:{message:'bz_quality_blocked'}} as never);await expect(reviewGeneration(f.db,id,id,id,{id,expectedVersion:0,decision:'accepted',reason:'Review this output for draft use'})).rejects.toMatchObject({status:409});expect(f.rpc).toHaveBeenCalledTimes(1);});
});
