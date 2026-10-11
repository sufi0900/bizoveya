import {describe,it,expect,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {deliveryInputSchema,deliverySetup} from './contracts';
import {deliverMeetingPacket,receivePacket,receiptNote} from './delivery';
const meetingId='11111111-1111-4111-8111-111111111111',agentId='22222222-2222-4222-8222-222222222222',claimId='33333333-3333-4333-8333-333333333333',requestId='44444444-4444-4444-8444-444444444444';
const input={meetingId,agentId,claimId,role:'content' as const,agentVersion:5,meetingVersion:4,sourceVersion:3,rosterVersion:1,reviewed:true as const};
const instruction='Prepare approved private drafts.',decision='Private drafts only.';
const packet={meetingId,requestId,sourceVersion:3,rosterVersion:1,role:'content',agentId,agentVersion:5,claimExpiresAt:'2099-01-01T00:00:00+00:00',agenda:{action:'meeting',id:meetingId,agenda:'Discuss safe options.',mode:'deliberation',participants:['content'],reviewed:true,inputMode:'text'},decision,instruction,command:{action:'request',id:requestId,instruction:`Reviewed meeting decision: ${decision}\n\nRequested task: ${instruction}`,channels:['blog'],reviewed:true,inputMode:'text'}};
function fixture(){
 const participant={role:'content',agentId,agentVersion:5,state:'invited',claimId:null,leaseActive:false,note:null};
 const meeting={meetingId,siteId:agentId,meetingVersion:4,sourceVersion:3,rosterVersion:1,agenda:'Discuss safe options.',createdAt:'now',blocked:false,participants:[participant]};
 const rpc=vi.fn(async(name:string)=>({data:name==='bz_admin_identity'?{isAdmin:true,aal2:true}:[meeting],error:null}));
 const receipt={meetingId,requestId,sourceVersion:3,rosterVersion:1,actorId:claimId,createdAt:'now',participants:[{role:'content',agentId,agentVersion:5,state:'acknowledged',claimExpiresAt:packet.claimExpiresAt,respondedAt:'now',note:receiptNote('content','acknowledged')}]};
 const record=vi.fn(async(name:string,args?:Record<string,unknown>)=>({data:name==='bz_claim_meeting_invitation'?packet:{...receipt,participants:receipt.participants.map(item=>({...item,state:args?.p_outcome,note:args?.p_note}))},error:null}));
 return {rpc,record,participant,meeting,db:{rpc} as unknown as SupabaseClient,deps:{env:{NEXT_PUBLIC_SUPABASE_URL:'synthetic-url',SUPABASE_SERVICE_ROLE_KEY:'synthetic-secret'},recorder:{rpc:record} as unknown as SupabaseClient,now:()=>0}};
}
describe('deterministic meeting packet reception',()=>{
 it('requires explicit reviewed pinned identities and refuses secret/execution fields',()=>{
  expect(deliveryInputSchema.safeParse(input).success).toBe(true);
  for(const invalid of [{...input,reviewed:false},{...input,agentId:null},{...input,agentVersion:0},{...input,apiKey:'secret'},{...input,execute:true}])expect(deliveryInputSchema.safeParse(invalid).success).toBe(false);
  expect(JSON.stringify(deliverySetup({NEXT_PUBLIC_SUPABASE_URL:'url',SUPABASE_SERVICE_ROLE_KEY:'secret'}))).not.toContain('secret');
 });
 it('acknowledges only the exact validated packet, role and unexpired lease',()=>{
  expect(receivePacket(packet,input,0)).toBe('acknowledged');
  for(const invalid of [{...packet,agentId:claimId},{...packet,role:'quality'},{...packet,sourceVersion:2},{...packet,agentVersion:6},{...packet,claimExpiresAt:'1970-01-01T00:00:00Z'},{...packet,command:{...packet.command,instruction:'Forged private task.'}},{...packet,agenda:{...packet.agenda,participants:['coordinator']}},{...packet,provider:'anything'}])expect(receivePacket(invalid,input,0)).toBe('declined');
 });
 it('requires MFA and an owned queue entry before any recording call',async()=>{
  const f=fixture();f.rpc.mockResolvedValueOnce({data:{isAdmin:true,aal2:false},error:null} as never);
  await expect(deliverMeetingPacket(f.db,input,f.deps)).rejects.toMatchObject({code:'MFA_REQUIRED'});expect(f.record).not.toHaveBeenCalled();
  const missing=fixture();missing.rpc.mockImplementation(async name=>({data:name==='bz_admin_identity'?{isAdmin:true,aal2:true}:[],error:null}) as never);
  await expect(deliverMeetingPacket(missing.db,input,missing.deps)).rejects.toMatchObject({code:'MEETING_DELIVERY_BLOCKED'});expect(missing.record).not.toHaveBeenCalled();
 });
 it('rejects changed team, stale version, wrong identity and active foreign lease before claiming',async()=>{
  for(const mutate of [(f:ReturnType<typeof fixture>)=>{f.meeting.blocked=true;},(f:ReturnType<typeof fixture>)=>{f.meeting.meetingVersion=5;},(f:ReturnType<typeof fixture>)=>{f.participant.agentVersion=6;},(f:ReturnType<typeof fixture>)=>{f.participant.leaseActive=true;f.participant.claimId=agentId as never;}]){
   const f=fixture();mutate(f);await expect(deliverMeetingPacket(f.db,input,f.deps)).rejects.toMatchObject({code:'MEETING_DELIVERY_BLOCKED'});expect(f.record).not.toHaveBeenCalled();
  }
 });
 it('requires the existing recording key and maps missing migration without exposing secrets',async()=>{
  const f=fixture();f.deps.env.SUPABASE_SERVICE_ROLE_KEY='';await expect(deliverMeetingPacket(f.db,input,f.deps)).rejects.toMatchObject({code:'RECORDER_REQUIRED'});expect(f.record).not.toHaveBeenCalled();
  const missing=fixture();missing.rpc.mockImplementation(async name=>({data:name==='bz_admin_identity'?{isAdmin:true,aal2:true}:null,error:name==='bz_admin_meeting_delivery_queue'?{code:'PGRST202'}:null}) as never);await expect(deliverMeetingPacket(missing.db,input,missing.deps)).rejects.toMatchObject({code:'MEETING_SETUP_REQUIRED'});
 });
 it('claims, validates, rechecks MFA and finishes one truthful receipt',async()=>{
  const f=fixture(),result=await deliverMeetingPacket(f.db,input,f.deps);
  expect(result.result).toEqual({role:'content',state:'acknowledged',replayed:false});expect(f.record.mock.calls.map(call=>call[0])).toEqual(['bz_claim_meeting_invitation','bz_finish_meeting_invitation']);
  expect(f.record).toHaveBeenLastCalledWith('bz_finish_meeting_invitation',expect.objectContaining({p_claim:claimId,p_outcome:'acknowledged',p_note:receiptNote('content','acknowledged')}));expect(JSON.stringify(result)).not.toContain('synthetic-secret');
 });
 it('records malformed packets as declined rather than marking participation or successful work',async()=>{
  const f=fixture();f.record.mockResolvedValueOnce({data:{...packet,agentVersion:9},error:null} as never);expect((await deliverMeetingPacket(f.db,input,f.deps)).result.state).toBe('declined');
 });
 it('stops after claim on admin revocation and never blindly retries a failed finish',async()=>{
  const f=fixture();f.rpc.mockResolvedValueOnce({data:{isAdmin:true,aal2:true},error:null} as never).mockResolvedValueOnce({data:[f.meeting],error:null} as never).mockResolvedValueOnce({data:{isAdmin:false,aal2:true},error:null} as never);
  await expect(deliverMeetingPacket(f.db,input,f.deps)).rejects.toMatchObject({code:'ADMIN_REQUIRED'});expect(f.record).toHaveBeenCalledTimes(1);
  const fail=fixture();fail.record.mockResolvedValueOnce({data:packet,error:null} as never).mockResolvedValueOnce({data:null,error:{message:'bz_conflict'}} as never);
  await expect(deliverMeetingPacket(fail.db,input,fail.deps)).rejects.toMatchObject({code:'MEETING_DELIVERY_BLOCKED'});expect(fail.record).toHaveBeenCalledTimes(2);
 });
 it('replays only the same terminal claim without claiming or handling another packet',async()=>{
  const f=fixture();f.participant.state='acknowledged';f.participant.claimId=claimId as never;f.meeting.blocked=true;f.meeting.meetingVersion=5;
  expect((await deliverMeetingPacket(f.db,input,f.deps)).result.replayed).toBe(true);expect(f.record.mock.calls.map(call=>call[0])).toEqual(['bz_finish_meeting_invitation']);
  await expect(deliverMeetingPacket(f.db,{...input,claimId:agentId},f.deps)).rejects.toMatchObject({code:'MEETING_DELIVERY_BLOCKED'});
 });
});
