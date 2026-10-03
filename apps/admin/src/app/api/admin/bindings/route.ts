import {adminApi} from '@/features/admin/api';
import {readInput} from '@/features/agents/input';
import {bindingInputSchema} from '@/features/bindings/contracts';
import {loadBindingRoom,mutateBinding} from '@/features/bindings/store';
export const dynamic='force-dynamic';
export const GET=()=>adminApi(loadBindingRoom);
export const POST=(r:Request)=>adminApi(async db=>mutateBinding(db,await readInput(r,bindingInputSchema,4096)));
