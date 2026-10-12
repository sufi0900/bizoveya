import {adminApi} from '@/features/admin/api';
import {readInput} from '@/features/agents/input';
import {mediaAdminInputSchema} from '@bizoveya/agent-contract';
import {loadMediaRegistry,mutateMediaRegistry} from '@/features/media-providers/store';
export const dynamic='force-dynamic';
export const GET=()=>adminApi(loadMediaRegistry);
export const POST=(r:Request)=>adminApi(async db=>mutateMediaRegistry(db,await readInput(r,mediaAdminInputSchema,8192)));
