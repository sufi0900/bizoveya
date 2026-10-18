import {NextResponse} from 'next/server';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {adminSession,safeAdminError,AdminError} from '@/features/admin/access';
import {readInput} from '@/features/agents/input';
import {localTestingEnabled,loopbackOrigin,rehearsalInput} from '@/features/local-testing/contracts';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 if(!localTestingEnabled(process.env))throw new AdminError(404,'NOT_FOUND','Local testing disabled.');
 const origin=request.headers.get('origin'),host=request.headers.get('host');
 if(!origin||!loopbackOrigin(origin)||!loopbackOrigin(request.url)||new URL(origin).host!==host||new URL(request.url).host!==host)throw new AdminError(403,'LOCAL_ORIGIN_REQUIRED','Use localhost.');
 const {db,userId}=await adminSession();const input=await readInput(request,rehearsalInput,2048);
 const snapshot=await db.rpc('bz_admin_local_rehearsal_snapshot',{p_id:input.id});if(snapshot.error)throw new AdminError(403,'SNAPSHOT_UNAVAILABLE','Snapshot unavailable.');
 let receipt;try{receipt=JSON.parse(await readFile(path.join(process.cwd(),'.bizoveya-local-testing',userId,`${input.requestId}.json`),'utf8'));}catch{throw new AdminError(404,'RECEIPT_NOT_READY','Receipt is not available yet. Reading never starts a model.');}
 if(receipt.fingerprint!==createHash('sha256').update(JSON.stringify(input)).digest('hex'))throw new AdminError(409,'REQUEST_CHANGED','Use the original local request.');
 return NextResponse.json(receipt,{headers:{'Cache-Control':'private, no-store'}});
 }catch(cause){const e=safeAdminError(cause);return NextResponse.json({error:e.message,code:e.code},{status:e.status,headers:{'Cache-Control':'private, no-store'}});}}
