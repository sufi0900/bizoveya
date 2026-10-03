import {describe,it,expect,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {bindingInputSchema} from './contracts';
import {mutateBinding,loadBindings} from './store';
const uuid='11111111-1111-4111-8111-111111111111';
const input={action:'assign' as const,agentId:uuid,profileId:uuid,testId:uuid,expectedRevision:0,agentRevision:4,profileRevision:2,credentialVersion:2,reviewed:true as const,reason:'Assign reviewed model to agent'};
function mock(data:unknown,error:unknown=null){const rpc=vi.fn().mockResolvedValue({data,error});return {db:{rpc} as unknown as SupabaseClient,rpc};}
describe('reviewed model assignments',()=>{
 it('requires explicit consent and rejects extra runtime activation',()=>{expect(bindingInputSchema.safeParse({...input,reviewed:false}).success).toBe(false);expect(bindingInputSchema.safeParse({...input,activate:true}).success).toBe(false);});
 it('requires all pinned revisions for assignment',()=>{expect(bindingInputSchema.safeParse({...input,credentialVersion:undefined}).success).toBe(false);});
 it('allows disable without a current model or test',async()=>{const i=bindingInputSchema.parse({action:'disable',agentId:uuid,expectedRevision:1,reviewed:true,reason:'Disable pending review'});const {db,rpc}=mock({bindings:[],events:[]});await mutateBinding(db,i);expect(rpc.mock.calls[0][1]).toMatchObject({p_action:'disable',p_profile_id:null,p_test_id:null,p_expected_revision:1});});
 it('forwards expected versions and consent to the database',async()=>{const {db,rpc}=mock({bindings:[],events:[]});await mutateBinding(db,input);expect(rpc).toHaveBeenCalledWith('bz_admin_mutate_binding',expect.objectContaining({p_agent_revision:4,p_profile_revision:2,p_credential_version:2,p_reviewed:true}));});
 it('surfaces stale state without hiding conflict',async()=>{const {db}=mock(null,{message:'bz_conflict'});await expect(mutateBinding(db,input)).rejects.toMatchObject({status:409,code:'CONFLICT'});});
 it('redacts unknown database errors',async()=>{const {db}=mock(null,{message:'private credential detail'});await expect(loadBindings(db)).rejects.not.toThrow('private credential detail');});
 it('explains stale test evidence',async()=>{const {db}=mock(null,{message:'bz_binding_test_expired'});await expect(mutateBinding(db,input)).rejects.toThrow('older than 24 hours');});
 it('requires migration setup',async()=>{const {db}=mock(null,{code:'PGRST202'});await expect(loadBindings(db)).rejects.toMatchObject({status:503});});
});
