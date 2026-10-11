import {NextResponse} from 'next/server';
import {adminApi} from '@/features/admin/api';
import {adminSession,safeAdminError} from '@/features/admin/access';
import {readInput} from '@/features/agents/input';
import {deliveryInputSchema} from '@/features/meetings/contracts';
import {deliverMeetingPacket,loadMeetingDelivery} from '@/features/meetings/delivery';
export const runtime='nodejs';export const dynamic='force-dynamic';
export const GET=()=>adminApi(db=>loadMeetingDelivery(db));
export async function POST(request:Request){
 try{const {db}=await adminSession();const input=await readInput(request,deliveryInputSchema,2000);return NextResponse.json(await deliverMeetingPacket(db,input),{headers:{'Cache-Control':'private, no-store'}});}
 catch(cause){const error=safeAdminError(cause);return NextResponse.json({error:error.message,code:error.code},{status:error.status,headers:{'Cache-Control':'private, no-store'}});}
}
