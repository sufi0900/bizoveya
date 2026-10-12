import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { specialistRosterReviewSchema } from '@/features/agents/specialist-contracts';
import { loadSpecialists, saveSpecialists } from '@/features/agents/specialist-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const GET = (_request: Request, context: Context) => workspaceApi(async ({ db, userId }) => { const p = await context.params; return workspaceJson(await loadSpecialists(db, userId, p.workspaceId, p.siteId)); });
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => { const p = await context.params; return workspaceJson(await saveSpecialists(db, userId, p.workspaceId, p.siteId, await readInput(request, specialistRosterReviewSchema, 6000))); });
