import {NextResponse} from 'next/server';
import {adminSession,safeAdminError,AdminError} from '@/features/admin/access';
import {readInput} from '@/features/agents/input';
import {localTestingEnabled,loopbackOrigin} from '@/features/local-testing/contracts';
import {localReviewInput,reviewLocalReceipt} from '@/features/local-testing/review';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:Request){try{
 if(!localTestingEnabled(process.env))throw new AdminError(404,'NOT_FOUND','Local testing disabled.');
 const origin=request.headers.get('origin'),host=request.headers.get('host');
 if(!origin||!loopbackOrigin(origin)||!loopbackOrigin(request.url)||new URL(origin).host!==host||new URL(request.url).host!==host)throw new AdminError(403,'LOCAL_ORIGIN_REQUIRED','Use localhost.');
 const {db,userId}=await adminSession();const input=await readInput(request,localReviewInput,4096);
 return NextResponse.json(await reviewLocalReceipt(db,userId,input),{headers:{'Cache-Control':'private, no-store'}});
 }catch(cause){const e=safeAdminError(cause);return NextResponse.json({error:e.message,code:e.code},{status:e.status,headers:{'Cache-Control':'private, no-store'}});}}
