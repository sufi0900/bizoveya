import {z} from 'zod';
const micros=z.number().int().min(0).max(1_000_000_000);
export const pricingSchema=z.object({enabled:z.boolean(),inputRateMicros:micros,outputRateMicros:micros,requestFeeMicros:micros,dailyLimitMicros:micros.min(1),runLimitMicros:micros.min(1),validUntil:z.iso.datetime({offset:true}),source:z.url().max(300).refine(s=>s.startsWith('https://')),reviewed:z.literal(true)}).strict().refine(d=>d.runLimitMicros<=d.dailyLimitMicros,'Per-run limit must not exceed daily limit.');
const reason=z.string().trim().min(10).max(300).refine(s=>!/[\u0000-\u001f]/.test(s));
export const spendingInputSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('save'),profileId:z.uuid(),profileRevision:z.number().int().positive(),expectedVersion:z.number().int().nonnegative(),document:pricingSchema,reason,reviewed:z.literal(true)}).strict(),
 z.object({action:z.literal('reconcile'),runId:z.uuid(),expectedState:z.enum(['reserved','unknown','overrun']),amountMicros:micros,reason,reviewed:z.literal(true)}).strict()
]);
export type SpendingInput=z.infer<typeof spendingInputSchema>;
export const reportSchema=z.object({policies:z.array(z.object({profile_id:z.uuid(),version:z.number(),profile_version:z.number(),document:pricingSchema,actor_id:z.uuid().nullable(),reason:z.string(),updated_at:z.string(),spentTodayMicros:z.number(),blocked:z.boolean()})),runs:z.array(z.object({run_id:z.uuid(),profile_id:z.uuid(),policy_version:z.number(),reserved_micros:z.number(),charged_micros:z.number(),state:z.enum(['reserved','settled','unknown','overrun','reconciled']),input_tokens:z.number().nullable(),output_tokens:z.number().nullable(),started_at:z.string(),finished_at:z.string().nullable(),run_kind:z.enum(['model_test','campaign_stage']),generation_id:z.uuid().nullable(),stage_kind:z.enum(['coordinator','content','quality']).nullable()})),events:z.array(z.object({id:z.uuid(),run_id:z.uuid(),action:z.string(),amount_micros:z.number(),actor_id:z.uuid().nullable(),reason:z.string(),occurred_at:z.string(),run_kind:z.enum(['model_test','campaign_stage'])})),policyEvents:z.array(z.object({id:z.uuid(),profile_id:z.uuid(),version:z.number(),document:pricingSchema,actor_id:z.uuid().nullable(),reason:z.string(),occurred_at:z.string()}))});
export type SpendingReport=z.infer<typeof reportSchema>;
export function toMicros(value:string){if(!/^(?:0|[1-9]\d{0,3})(?:\.\d{1,6})?$/.test(value))throw new Error('Enter a nonnegative USD amount with up to six decimal places.');const [whole,fraction='']=value.split('.');const n=Number(whole)*1_000_000+Number(fraction.padEnd(6,'0'));if(n>1_000_000_000)throw new Error('The maximum amount is USD 1,000.');return n;}
export const dollars=(micros:number)=>'$'+(micros/1_000_000).toFixed(6);

export function reservationMicros(p:z.infer<typeof pricingSchema>){return Math.ceil(((4096*p.inputRateMicros+128*p.outputRateMicros)/1_000_000+p.requestFeeMicros)*1.25);}
