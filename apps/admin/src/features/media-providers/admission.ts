import 'server-only';
import type {SupabaseClient} from '@supabase/supabase-js';
import {mediaClaimSchema,mediaReceiptSchema,mediaRequestSchema} from '@bizoveya/agent-contract';
import {z} from 'zod';
// Trusted server worker only. No browser endpoint exports a claim, provider marker or settlement.
function scope(id:string,claim:string,actor:string){return {p_id:z.string().uuid().parse(id),p_claim:z.string().uuid().parse(claim),p_actor:z.string().uuid().parse(actor)};}
function checked(error:unknown){if(error)throw new Error('Media admission denied; review durable state before any provider request.');}
export async function claimMedia(db:SupabaseClient,id:string,claim:string,actor:string){const r=await db.rpc('bz_claim_media_request',scope(id,claim,actor));checked(r.error);return mediaClaimSchema.parse(r.data);}
export async function startMediaProvider(db:SupabaseClient,id:string,claim:string,actor:string){const r=await db.rpc('bz_start_media_provider',scope(id,claim,actor));checked(r.error);}
export async function cancelUnstartedMedia(db:SupabaseClient,id:string,actor:string){const r=await db.rpc('bz_cancel_unstarted_media_request',{p_id:z.string().uuid().parse(id),p_actor:z.string().uuid().parse(actor)});checked(r.error);return mediaRequestSchema.parse(r.data);}
const resultSchema=z.object({succeeded:z.boolean(),inputTokens:z.number().int().min(0).max(2000000).nullable(),outputTokens:z.number().int().min(0).max(2000000).nullable(),receipt:mediaReceiptSchema.nullable(),error:z.string().regex(/^[a-z_]{1,80}$/).nullable()}).strict();
export async function finishMedia(db:SupabaseClient,id:string,claim:string,result:z.infer<typeof resultSchema>){const v=resultSchema.parse(result);const r=await db.rpc('bz_finish_media_request',{p_id:z.string().uuid().parse(id),p_claim:z.string().uuid().parse(claim),p_succeeded:v.succeeded,p_input_tokens:v.inputTokens,p_output_tokens:v.outputTokens,p_receipt:v.receipt,p_error:v.error});checked(r.error);return mediaRequestSchema.parse(r.data);}
