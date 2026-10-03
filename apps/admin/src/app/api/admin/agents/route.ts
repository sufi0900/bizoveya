import { adminApi } from "@/features/admin/api";
import { agentAdminMutationSchema } from "@bizoveya/agent-contract";
import { readInput } from "@/features/agents/input";
import { loadRegistry, mutateAgent } from "@/features/agents/store";
export const GET=()=>adminApi(loadRegistry);
export const POST=(request:Request)=>adminApi(async db=>mutateAgent(db,await readInput(request,agentAdminMutationSchema,50000)));
