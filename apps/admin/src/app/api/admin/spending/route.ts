import {adminApi} from '@/features/admin/api';
import {readInput} from '@/features/agents/input';
import {spendingInputSchema} from '@/features/spending/contracts';
import {loadSpendingRoom,mutateSpending} from '@/features/spending/store';
export const dynamic='force-dynamic';
export const GET=()=>adminApi(loadSpendingRoom);
export const POST=(r:Request)=>adminApi(async db=>mutateSpending(db,await readInput(r,spendingInputSchema,4096)));
