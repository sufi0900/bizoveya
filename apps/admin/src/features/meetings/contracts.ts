import {z} from 'zod';
const roleSchema=z.enum(['coordinator','content','quality']);
const text=(max:number)=>z.string().trim().min(1).max(max).refine(value=>!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value));
const channels=z.array(z.enum(['blog','pinterest','linkedin'])).min(1).max(3).refine(values=>new Set(values).size===values.length);
const requestSchema=z.object({action:z.literal('request'),id:z.uuid(),instruction:text(2000),channels,reviewed:z.literal(true),inputMode:z.enum(['text','corrected-transcript'])}).strict();
export const packetSchema=z.object({
 meetingId:z.uuid(),requestId:z.uuid(),sourceVersion:z.number().int().min(1).max(99),rosterVersion:z.number().int().min(1).max(50),role:roleSchema,agentId:z.uuid(),agentVersion:z.number().int().positive(),claimExpiresAt:z.iso.datetime({offset:true}),
 agenda:z.object({action:z.literal('meeting'),id:z.uuid(),agenda:text(2000),mode:z.enum(['announcement','deliberation']),participants:z.array(roleSchema).min(1).max(3).refine(values=>new Set(values).size===values.length),reviewed:z.literal(true),inputMode:z.enum(['text','corrected-transcript'])}).strict(),
 decision:text(500),instruction:text(1400),command:requestSchema,
}).strict().refine(value=>value.agenda.id===value.meetingId&&value.command.id===value.requestId&&value.meetingId!==value.requestId&&value.agenda.participants.includes(value.role)&&value.command.instruction===`Reviewed meeting decision: ${value.decision}\n\nRequested task: ${value.instruction}`);
export const deliveryInputSchema=z.object({meetingId:z.uuid(),role:roleSchema,agentId:z.uuid(),agentVersion:z.number().int().positive(),meetingVersion:z.number().int().min(1).max(100),sourceVersion:z.number().int().min(1).max(99),rosterVersion:z.number().int().min(1).max(50),claimId:z.uuid(),reviewed:z.literal(true)}).strict();
export type DeliveryInput=z.infer<typeof deliveryInputSchema>;
const participantSchema=z.object({role:roleSchema,agentId:z.uuid(),agentVersion:z.number().int().positive(),state:z.enum(['invited','claimed','acknowledged','declined']),claimId:z.uuid().nullable(),leaseActive:z.boolean(),note:z.string().max(500).nullable()}).strict();
export const deliveryQueueSchema=z.array(z.object({meetingId:z.uuid(),siteId:z.uuid(),meetingVersion:z.number().int().min(1).max(100),sourceVersion:z.number().int().min(1).max(99),rosterVersion:z.number().int().min(1).max(50),agenda:text(2000),createdAt:z.string(),blocked:z.boolean(),participants:z.array(participantSchema).min(1).max(3)}).strict()).max(100);
export const receiptSchema=z.object({meetingId:z.uuid(),requestId:z.uuid(),sourceVersion:z.number().int().min(1).max(99),rosterVersion:z.number().int().min(1).max(50),actorId:z.uuid(),createdAt:z.string(),participants:z.array(z.object({role:roleSchema,agentId:z.uuid(),agentVersion:z.number().int().positive(),state:z.enum(['invited','claimed','acknowledged','declined']),claimExpiresAt:z.string().nullable(),respondedAt:z.string().nullable(),note:z.string().max(500).nullable()}).strict()).min(1).max(3)}).strict();
export const deliveryResultSchema=z.object({role:roleSchema,state:z.enum(['acknowledged','declined']),replayed:z.boolean()}).strict();
export function deliverySetup(env:Record<string,string|undefined>){return {recorderConfigured:Boolean(env.NEXT_PUBLIC_SUPABASE_URL&&env.SUPABASE_SERVICE_ROLE_KEY)};}
