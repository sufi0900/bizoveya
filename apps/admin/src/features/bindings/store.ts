import type {SupabaseClient} from '@supabase/supabase-js';
import {AdminError} from '../admin/access';
import {loadRegistry} from '../agents/store';
import {loadModels} from '../models/store';
import {loadTests} from '../model-tests/store';
import {bindingRegistrySchema,issueLabels,type BindingInput} from './contracts';
function check(e:{code?:string;message?:string}|null){
 if(!e)return;
 if(['42P01','PGRST202','PGRST205'].includes(e.code??''))throw new AdminError(503,'SETUP_REQUIRED','Apply migration 031 after 030 to enable model assignments.');
 if(e.code==='42501')throw new AdminError(403,'FORBIDDEN','Current administrator access and MFA are required.');
 if(e.message==='bz_conflict')throw new AdminError(409,'CONFLICT','The assignment or configuration changed. Refresh and review again.');
 throw new AdminError(409,'BINDING_UNAVAILABLE',issueLabels[(e.message??'').replace('bz_binding_','')]??'Review the agent, model test and assignment fields before saving.');
}
export async function loadBindings(db:SupabaseClient){const r=await db.rpc('bz_admin_binding_registry');check(r.error);return bindingRegistrySchema.parse(r.data);}
export async function loadBindingRoom(db:SupabaseClient){const [agents,models,tests,assignments]=await Promise.all([loadRegistry(db),loadModels(db),loadTests(db),loadBindings(db)]);return {agents,models,tests,assignments};}
export async function mutateBinding(db:SupabaseClient,i:BindingInput){const assign=i.action==='assign';const r=await db.rpc('bz_admin_mutate_binding',{p_agent_id:i.agentId,p_profile_id:assign?i.profileId:null,p_test_id:assign?i.testId:null,p_expected_revision:i.expectedRevision,p_agent_revision:assign?i.agentRevision:null,p_profile_revision:assign?i.profileRevision:null,p_credential_version:assign?i.credentialVersion:null,p_action:i.action,p_reviewed:i.reviewed,p_reason:i.reason});check(r.error);return bindingRegistrySchema.parse(r.data);}
