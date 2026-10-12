import {describe,it,expect,vi} from 'vitest';
vi.mock('server-only',()=>({}));
import {claimMedia,startMediaProvider,finishMedia} from './admission';
import {mediaAdmissionSchema,mediaQualificationSchema} from '@bizoveya/agent-contract';
import type {SupabaseClient} from '@supabase/supabase-js';
const id='11111111-1111-4111-8111-111111111111';
const db=(rpc:ReturnType<typeof vi.fn>)=>({rpc}) as unknown as SupabaseClient;
describe('trusted media admission',()=>{
 it('does not expose provider errors or treat denied claims as executable',async()=>{const rpc=vi.fn().mockResolvedValue({data:null,error:{message:'SECRET_KEY'}});await expect(claimMedia(db(rpc),id,id,id)).rejects.toThrow('Media admission denied');await expect(claimMedia(db(rpc),id,id,id)).rejects.not.toThrow('SECRET_KEY');});
 it('returns a non-executing claim replay without private context',async()=>{const rpc=vi.fn().mockResolvedValue({data:{id,execute:false},error:null});expect(await claimMedia(db(rpc),id,id,id)).toEqual({id,execute:false});});
 it('rejects a malformed executable response before a caller can use it',async()=>{const rpc=vi.fn().mockResolvedValue({data:{id,execute:true,token:'leak'},error:null});await expect(claimMedia(db(rpc),id,id,id)).rejects.toThrow();});
 it('never permits a malformed claim or a client token in settlement',async()=>{const rpc=vi.fn();await expect(startMediaProvider(db(rpc),'wrong',id,id)).rejects.toThrow();await expect(finishMedia(db(rpc),id,id,{succeeded:true,inputTokens:null,outputTokens:null,receipt:{token:'secret'},error:null} as never)).rejects.toThrow();expect(rpc).not.toHaveBeenCalled();});
 it('rejects unknown admission fields and unreviewed voice work',()=>{expect(mediaAdmissionSchema.safeParse({id,capability:'live-voice',expectedQualificationVersion:1,document:{purpose:'founder-assistant'},reviewed:false}).success).toBe(false);expect(mediaAdmissionSchema.safeParse({id,capability:'live-voice',expectedQualificationVersion:1,document:{purpose:'founder-assistant',publish:true},reviewed:true}).success).toBe(false);});
 it('requires zero prices for a free attestation and matching credential provider',()=>{const q={provider:'gemini',modelId:'fixture',credentialRef:'platform-gemini',credentialVersion:1,budgetProfileId:id,costMode:'free-attested',inputTokenLimit:256,outputTokenLimit:128,durationSeconds:60,maxDailyRequests:1,maxConcurrent:1,inputRateMicros:1,outputRateMicros:0,requestFeeMicros:0,validUntil:'2026-10-13T00:00:00Z',evidenceUrl:'https://example.com/evidence',apiVerified:true,commercialReviewed:true};expect(mediaQualificationSchema.safeParse(q).success).toBe(false);expect(mediaQualificationSchema.safeParse({...q,inputRateMicros:0}).success).toBe(true);expect(mediaQualificationSchema.safeParse({...q,inputRateMicros:0,credentialRef:'platform-openai'}).success).toBe(false);});
});
