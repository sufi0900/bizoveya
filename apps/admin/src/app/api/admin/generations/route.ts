import {NextResponse} from 'next/server';
import {adminApi} from '@/features/admin/api';
import {adminSession,safeAdminError} from '@/features/admin/access';
import {readInput} from '@/features/agents/input';
import {dispatchInputSchema} from '@/features/generation/dispatch-contracts';
import {loadGenerationRoom,dispatchGeneration} from '@/features/generation/dispatch';
export const runtime='nodejs';export const maxDuration=90;export const dynamic='force-dynamic';
export const GET=()=>adminApi(loadGenerationRoom);
export async function POST(request:Request){try{const session=await adminSession();const input=await readInput(request,dispatchInputSchema,2048);return NextResponse.json(await dispatchGeneration(session.db,session.userId,input),{headers:{'Cache-Control':'private, no-store'}});}catch(cause){const e=safeAdminError(cause);return NextResponse.json({error:e.message,code:e.code},{status:e.status,headers:{'Cache-Control':'private, no-store'}});}}
