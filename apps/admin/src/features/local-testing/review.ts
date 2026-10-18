import {readFile,open,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {z} from 'zod';
import {campaignQualitySchema} from '@bizoveya/agent-contract';
import type {SupabaseClient} from '@supabase/supabase-js';
import {AdminError,requireAdmin} from '../admin/access';
import {localTestingEnabled,rehearsalInput} from './contracts';
export const localReviewInput=rehearsalInput.extend({decision:z.enum(['accepted','changes_requested']),expectedVersion:z.number().int().nonnegative(),reviewReason:z.string().trim().min(10).max(300)}).strict();
export async function reviewLocalReceipt(db:SupabaseClient,actor:string,input:z.infer<typeof localReviewInput>,env:Record<string,string|undefined>=process.env){
 if(!localTestingEnabled(env))throw new AdminError(404,'NOT_FOUND','Local testing is disabled.');await requireAdmin(db);
 const snapshot=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});if(snapshot.error)throw new AdminError(403,'SNAPSHOT_UNAVAILABLE','Snapshot unavailable.');
 const file=path.join(process.cwd(),'.bizoveya-local-testing',actor,`${input.requestId}.json`),lock=`${file}.review.lock`;
 let handle;try{handle=await open(lock,'wx',0o600);}catch{throw new AdminError(409,'REVIEW_CONFLICT','Another local review is being saved.');}
 try{const receipt=JSON.parse(await readFile(file,'utf8'));
 if(receipt.snapshotId!==input.id||receipt.mode!==input.mode||receipt.reason!==input.reason||receipt.status!=='local_outputs_for_review')throw new AdminError(409,'QUALITY_BLOCKED','Only completed real local output can be reviewed.');
 const quality=campaignQualitySchema.safeParse(receipt.stages.find((s:{kind:string})=>s.kind==='quality')?.output);
 if(input.decision==='accepted'&&(!quality.success||!quality.data.approved||quality.data.issues.some(i=>i.severity==='blocker')))throw new AdminError(409,'QUALITY_BLOCKED','Quality requests changes.');
 const reviews=receipt.reviews??[];const last=reviews.at(-1);
 if(reviews.length!==input.expectedVersion){if(last?.version===input.expectedVersion+1&&last.decision===input.decision&&last.reason===input.reviewReason)return receipt;throw new AdminError(409,'REVIEW_CONFLICT','Read current receipt before reviewing.');}
 const result={...receipt,reviews:[...reviews,{version:reviews.length+1,decision:input.decision,reason:input.reviewReason,at:new Date().toISOString()}]};
 await writeFile(file,JSON.stringify(result,null,2),{mode:0o600});return result;
 }finally{await handle.close();await unlink(lock);}
}
