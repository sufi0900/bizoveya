import {NextResponse} from 'next/server';
import {adminSession,safeAdminError,AdminError} from '@/features/admin/access';
import {readInput} from '@/features/agents/input';
import {localTestingEnabled,loopbackOrigin,rehearsalInput} from '@/features/local-testing/contracts';
import {runLocalRehearsal} from '@/features/local-testing/service';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(request:Request){
 try{
  if(!localTestingEnabled(process.env))throw new AdminError(404,'NOT_FOUND','Local testing is disabled.');
  const origin=request.headers.get('origin');const host=request.headers.get('host');
  if(!origin||!loopbackOrigin(origin)||!loopbackOrigin(request.url)||new URL(origin).host!==host||new URL(request.url).host!==host)throw new AdminError(403,'LOCAL_ORIGIN_REQUIRED','Use this screen on localhost only.');
  const {db,userId}=await adminSession();const input=await readInput(request,rehearsalInput,2048);
  return NextResponse.json(await runLocalRehearsal(db,userId,input,request.signal),{headers:{'Cache-Control':'private, no-store'}});
 }catch(cause){const e=safeAdminError(cause);return NextResponse.json({error:e.message,code:e.code},{status:e.status,headers:{'Cache-Control':'private, no-store'}});}
}
