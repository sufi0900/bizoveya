import {adminApi} from "@/features/admin/api";
import {credentialMutationSchema} from "@/features/models/contracts";
import {readInput} from "@/features/agents/input";
import {loadModels,mutateCredential} from "@/features/models/store";
export const GET=()=>adminApi(loadModels);
export const POST=(request:Request)=>adminApi(async db=>mutateCredential(db,await readInput(request,credentialMutationSchema,8192)));
