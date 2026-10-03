import type {SupabaseClient} from '@supabase/supabase-js';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {AdminError,requireAdmin} from '../admin/access';
import {loadModels} from '../models/store';
import {profileDocumentSchema} from '../models/contracts';
import {reportSchema,executionSetup,type TestRequest,type TestResult} from './contracts';
import {checkSpending} from '../spending/store';
import {testProvider} from './provider';
function check(error:{code?:string;message?:string}|null){if(!error)return;const message=error.message??'';if(['bz_spending_not_ready','bz_pricing_expired','bz_spending_unresolved','bz_run_budget','bz_daily_budget'].includes(message)){checkSpending(error);return;}if(['PGRST202','42P01'].includes(error.code??''))throw new AdminError(503,'SETUP_REQUIRED','Apply migration 030 after029.');if(error.code==='42501')throw new AdminError(403,'FORBIDDEN','Current admin access and MFA are required.');if(message==='bz_conflict')throw new AdminError(409,'CONFLICT','The profile or credential changed. Reload before testing.');const known:Record<string,string>={bz_test_daily_limit:'Daily limit reached: five test attempts across the platform per UTC day.',bz_test_busy:'Another model test is running. Refresh its result before starting another.',bz_test_not_ready:'Enable the reference and check the saved model profile first.',bz_test_expired:'The result could not be recorded before the test lease expired.'};throw new AdminError(409,'TEST_UNAVAILABLE',known[message]??'Model test storage is unavailable. Refresh before retrying.');}
export async function loadTests(db:SupabaseClient){const r=await db.rpc('bz_admin_model_tests');check(r.error);return reportSchema.parse(r.data);}
export async function loadRoom(db:SupabaseClient){const [registry,report]=await Promise.all([loadModels(db),loadTests(db)]);return {registry,report,setup:executionSetup(process.env)};}
const beginSchema=z.discriminatedUnion('execute',[z.object({execute:z.literal(false),id:z.uuid()}),z.object({execute:z.literal(true),id:z.uuid(),document:profileDocumentSchema})]);
export async function executeTest(db:SupabaseClient,i:TestRequest,deps?:{env:Record<string,string|undefined>;provider:typeof testProvider;recorder:SupabaseClient}){
 const env=deps?.env??process.env;const setup=executionSetup(env);
 if(!setup.enabled)throw new AdminError(409,'TESTS_DISABLED','Live tests are disabled. Set BIZOVEYA_ENABLE_MODEL_TESTS=true on the admin deployment when ready.');
 if(!setup.recorderConfigured)throw new AdminError(503,'RECORDER_REQUIRED','Configure the admin server recording key before enabling paid tests.');
 const registry=await loadModels(db);const profile=registry.profiles.find(p=>p.id===i.profileId);if(!profile||profile.revision!==i.expectedRevision)throw new AdminError(409,'CONFLICT','The profile changed. Reload before testing.');
 if(!setup.keys[profile.document.provider])throw new AdminError(409,'KEY_REQUIRED','This provider key is absent from the admin deployment.');
 const recorder=deps?.recorder??createClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const claim=crypto.randomUUID();const begin=await db.rpc('bz_admin_begin_model_test',{p_id:i.id,p_profile_id:i.profileId,p_expected_revision:i.expectedRevision,p_expected_credential_version:i.credentialVersion,p_claim:claim,p_reviewed:i.reviewed,p_reason:i.reason});check(begin.error);const reservation=beginSchema.parse(begin.data);
 if(!reservation.execute)return {report:await loadTests(db),replayed:true};
 let result:TestResult;
 try{await requireAdmin(db);const current=await loadModels(db);const p=current.profiles.find(p=>p.id===i.profileId);const c=current.credentials.find(c=>c.id===reservation.document.credentialRef);if(!p?.checked||p.revision!==i.expectedRevision||!c?.enabled||c.version!==i.credentialVersion)throw new Error('Configuration changed');result=await (deps?.provider??testProvider)(reservation.document,env);}catch{result={code:'provider_error',inputTokens:null,outputTokens:null};}
 const saved=await recorder.rpc('bz_finish_model_test',{p_id:i.id,p_claim:claim,p_code:result.code,p_input_tokens:result.inputTokens,p_output_tokens:result.outputTokens});check(saved.error);
 return {report:await loadTests(db),replayed:false};
}
