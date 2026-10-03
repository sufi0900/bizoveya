import {adminApi} from '@/features/admin/api';
import {readInput} from '@/features/agents/input';
import {requestSchema} from '@/features/model-tests/contracts';
import {loadRoom,executeTest} from '@/features/model-tests/store';
export const runtime='nodejs';export const maxDuration=60;export const dynamic='force-dynamic';
export const GET=()=>adminApi(loadRoom);
export const POST=(request:Request)=>adminApi(async db=>executeTest(db,await readInput(request,requestSchema,2048)));
