import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { specialistDelegationInputSchema } from '@/features/agents/specialist-contracts';
import { delegateSpecialists } from '@/features/agents/specialist-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => { const p = await context.params; return workspaceJson(await delegateSpecialists(db, userId, p.workspaceId, p.siteId, await readInput(request, specialistDelegationInputSchema, 3000))); });
