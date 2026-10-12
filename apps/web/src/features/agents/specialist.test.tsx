import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../workspaces/store',async original=>({...await original<typeof import('../workspaces/store')>(),getSite:vi.fn()}));
import { getSite } from '../workspaces/store';
import { specialistChannels, specialistDelegationInputSchema, specialistRosterDocumentSchema } from './specialist-contracts';
import { delegateSpecialists, loadSpecialists, saveSpecialists } from './specialist-store';
import { SpecialistPanel } from './specialist-panel';
const owner='11111111-1111-4111-8111-111111111111',agent='22222222-2222-4222-8222-222222222222';
const document={enabled:true,assignments:specialistChannels.map(channel=>({channel,agentId:agent,agentVersion:2}))};
const input={document,expectedVersion:0,reason:'Enable private channel specialists only.',reviewed:true as const};
const record={version:1,document,catalog:[],history:[]};
function fixture(data:unknown=record,error:unknown=null){const rpc=vi.fn(async()=>({data,error}));return{rpc,db:{rpc} as unknown as SupabaseClient};}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);});
describe('private channel specialist controls',()=>{
 it('requires all three channels when enabled and allows a retained pause',()=>{expect(specialistRosterDocumentSchema.safeParse(document).success).toBe(true);expect(specialistRosterDocumentSchema.safeParse({...document,enabled:false}).success).toBe(true);expect(specialistRosterDocumentSchema.safeParse({enabled:true,assignments:document.assignments.slice(0,2)}).success).toBe(false);});
 it('uses one strict reviewed delegation command',()=>{expect(specialistDelegationInputSchema.safeParse({id:owner,expectedVersion:1,reason:'Delegate this reviewed request only.',reviewed:true}).success).toBe(true);expect(specialistDelegationInputSchema.safeParse({id:owner,expectedVersion:1,reason:'short',reviewed:true}).success).toBe(false);});
 it('loads for members and denies non-owner changes before SQL',async()=>{const f=fixture();await loadSpecialists(f.db,owner,owner,owner);expect(f.rpc).toHaveBeenCalledWith('bz_site_channel_specialists',{p_workspace_id:owner,p_site_id:owner});vi.mocked(getSite).mockResolvedValue({workspace:{role:'viewer'}} as never);const blocked=fixture();await expect(saveSpecialists(blocked.db,owner,owner,owner,input)).rejects.toMatchObject({status:403});expect(blocked.rpc).not.toHaveBeenCalled();});
 it('forwards versioned roster and delegation RPCs',async()=>{const f=fixture();expect(await saveSpecialists(f.db,owner,owner,owner,input)).toEqual(record);expect(f.rpc).toHaveBeenCalledWith('bz_save_site_channel_specialists',{p_workspace_id:owner,p_site_id:owner,p_input:input});const base={id:owner,kind:'request',version:2,status:'proposed',document:{action:'request',id:owner,instruction:'Prepare drafts.',channels:['blog'],reviewed:true,inputMode:'text'},snapshot:{},createdAt:'now',events:[],channelDelegation:{requestId:owner,sourceVersion:1,rosterVersion:1,instruction:'Prepare drafts.',reason:'Delegate this private request.',assignments:[{channel:'blog',specialistKind:'content',agentId:agent,agentVersion:2,state:'delegated'}],actorId:owner,createdAt:'now'}};const delegated=fixture(base);await delegateSpecialists(delegated.db,owner,owner,owner,{id:owner,expectedVersion:1,reason:'Delegate this private request.',reviewed:true});expect(delegated.rpc).toHaveBeenCalledWith('bz_delegate_agency_request_specialists',{p_workspace_id:owner,p_site_id:owner,p_input:{id:owner,expectedVersion:1,reason:'Delegate this private request.',reviewed:true}});});
 it('renders honest compatibility and no-execution language',()=>{const html=renderToStaticMarkup(createElement(SpecialistPanel,{owner:false,endpoint:'/api/specialists'}));expect(html).toContain('Private channel specialists');expect(html).toContain('compatible campaign runtime');expect(html).not.toContain('/admin/');});
});
