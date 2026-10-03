import {z} from 'zod';
export const requestSchema=z.object({id:z.uuid(),profileId:z.uuid(),expectedRevision:z.number().int().positive(),credentialVersion:z.number().int().positive(),reviewed:z.literal(true),reason:z.string().trim().min(10).max(300).refine(s=>!/[\u0000-\u001f]/.test(s))}).strict();
export type TestRequest=z.infer<typeof requestSchema>;
export const reportSchema=z.object({dailyLimit:z.number(),usedToday:z.number(),runs:z.array(z.object({id:z.uuid(),adapter_version:z.string(),profile_id:z.uuid(),profile_version:z.number(),credential_version:z.number(),actor_id:z.uuid().nullable(),status:z.enum(['running','passed','failed','unknown']),result_code:z.string().nullable(),input_tokens:z.number().nullable(),output_tokens:z.number().nullable(),reason:z.string(),started_at:z.string(),finished_at:z.string().nullable(),current:z.boolean(),provider:z.string(),model_id:z.string()}))});
export type TestReport=z.infer<typeof reportSchema>;
export function executionSetup(env:Record<string,string|undefined>){return {enabled:env.BIZOVEYA_ENABLE_MODEL_TESTS==='true',recorderConfigured:!!env.SUPABASE_SERVICE_ROLE_KEY?.trim(),keys:{nebius:!!env.BIZOVEYA_NEBIUS_API_KEY?.trim(),openai:!!env.BIZOVEYA_OPENAI_API_KEY?.trim(),gemini:!!env.BIZOVEYA_GEMINI_API_KEY?.trim()}};}
export type TestSetup=ReturnType<typeof executionSetup>;
export const prompt='Connectivity check only. Reply with exactly BIZOVEYA_OK and no other text.';
export type TestResult={code:'response_matched'|'unexpected_response'|'provider_error'|'timeout';inputTokens:number|null;outputTokens:number|null};
