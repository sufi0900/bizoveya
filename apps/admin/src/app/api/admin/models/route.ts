import {adminApi} from "@/features/admin/api";
import {profileMutationSchema} from "@/features/models/contracts";
import {readInput} from "@/features/agents/input";
import {loadModels,mutateModel} from "@/features/models/store";
export const GET=()=>adminApi(loadModels);
export const POST=(request:Request)=>adminApi(async db=>mutateModel(db,await readInput(request,profileMutationSchema,8192)));
