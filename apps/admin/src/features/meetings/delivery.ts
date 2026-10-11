import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {AdminError,requireAdmin} from '../admin/access';
import {deliveryInputSchema,deliveryQueueSchema,deliverySetup,packetSchema,receiptSchema,type DeliveryInput} from './contracts';
function check(error:{code?:string;message?:string}|null){
 if(!error)return;
 if(['PGRST202','42P01','42703'].includes(error.code??''))throw new AdminError(503,'MEETING_SETUP_REQUIRED','Apply missing meeting migrations in order through 059. Refresh existing receipt records before another attempt.');
 const messages:Record<string,string>={bz_conflict:'The meeting or delivery claim changed. Refresh; an active claim must finish or expire before another delivery.',bz_forbidden:'Only your own owner-requested, pinned participant packets are available.',bz_site_roster_paused:'The pinned site team is paused.',bz_site_roster_changed:'The pinned team changed. Create a newly reviewed meeting instead of retargeting this packet.',bz_meeting_receipt_limit:'This packet reached its delivery event limit.'};
 throw new AdminError(error.code==='42501'?403:409,'MEETING_DELIVERY_BLOCKED',messages[error.message??'']??'Meeting packet delivery is unavailable. Refresh its receipt records.');
}
export async function loadMeetingDelivery(db:SupabaseClient,env:Record<string,string|undefined>=process.env){
 await requireAdmin(db);
 const result=await db.rpc('bz_admin_meeting_delivery_queue');check(result.error);
 return {meetings:deliveryQueueSchema.parse(result.data),setup:deliverySetup(env)};
}
const names={coordinator:'Coordinator',content:'Content',quality:'Quality'};
export function receiptNote(role:DeliveryInput['role'],outcome:'acknowledged'|'declined'){
 return outcome==='acknowledged'?`${names[role]} receipt worker validated the pinned packet; no reasoning or task execution occurred.`:'Pinned packet rejected by the receipt handler; no AI work started.';
}
// Reception verifies data and lineage only. It interprets no instruction and imports no model runtime.
export function receivePacket(raw:unknown,input:DeliveryInput,now=Date.now()):'acknowledged'|'declined'{
 const parsed=packetSchema.safeParse(raw);if(!parsed.success)return 'declined';const p=parsed.data;
 return p.meetingId===input.meetingId&&p.role===input.role&&p.agentId===input.agentId&&p.agentVersion===input.agentVersion&&p.sourceVersion===input.sourceVersion&&p.rosterVersion===input.rosterVersion&&Date.parse(p.claimExpiresAt)>now?'acknowledged':'declined';
}
export async function deliverMeetingPacket(db:SupabaseClient,input:DeliveryInput,deps?:{env:Record<string,string|undefined>;recorder:SupabaseClient;now?:()=>number}){
 const command=deliveryInputSchema.parse(input);const env=deps?.env??process.env;
 const room=await loadMeetingDelivery(db,env);
 if(!room.setup.recorderConfigured)throw new AdminError(503,'RECORDER_REQUIRED','Configure the existing admin-only recording key before delivering a packet.');
 const meeting=room.meetings.find(item=>item.meetingId===command.meetingId),participant=meeting?.participants.find(item=>item.role===command.role);
 if(!meeting||!participant||participant.agentId!==command.agentId||participant.agentVersion!==command.agentVersion||meeting.sourceVersion!==command.sourceVersion||meeting.rosterVersion!==command.rosterVersion)throw new AdminError(409,'MEETING_DELIVERY_BLOCKED','The selected pinned packet is unavailable. Refresh before continuing.');
 const replayed=['acknowledged','declined'].includes(participant.state);
 if(replayed&&participant.claimId!==command.claimId)throw new AdminError(409,'MEETING_DELIVERY_BLOCKED','This packet already has a terminal receipt. Refresh its recorded status.');
 if(!replayed&&(meeting.blocked||meeting.meetingVersion!==command.meetingVersion||(participant.leaseActive&&participant.claimId!==command.claimId)))throw new AdminError(409,'MEETING_DELIVERY_BLOCKED','This meeting changed, its team is paused, or another delivery owns the active claim. Refresh its records.');
 const recorder=deps?.recorder??createClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const args={p_meeting_id:command.meetingId,p_role:command.role,p_claim:command.claimId,p_agent_id:command.agentId,p_agent_version:command.agentVersion};
 let outcome:'acknowledged'|'declined';
 if(replayed)outcome=participant.state as 'acknowledged'|'declined';
 else{
  const claim=await recorder.rpc('bz_claim_meeting_invitation',args);check(claim.error);
  outcome=receivePacket(claim.data,command,deps?.now?.()??Date.now());
 }
 await requireAdmin(db);
 const finish=await recorder.rpc('bz_finish_meeting_invitation',{...args,p_outcome:outcome,p_note:receiptNote(command.role,outcome)});check(finish.error);
 const receipt=receiptSchema.parse(finish.data),saved=receipt.participants.find(item=>item.role===command.role);
 if(receipt.meetingId!==command.meetingId||receipt.sourceVersion!==command.sourceVersion||receipt.rosterVersion!==command.rosterVersion||saved?.agentId!==command.agentId||saved.agentVersion!==command.agentVersion||saved.state!==outcome||saved.note!==receiptNote(command.role,outcome)||!saved.respondedAt)throw new AdminError(503,'RECEIPT_UNCONFIRMED','Delivery response could not be confirmed. Refresh receipt records before another attempt.');
 return {result:{role:command.role,state:outcome,replayed},...await loadMeetingDelivery(db,env)};
}
