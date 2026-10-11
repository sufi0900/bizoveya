import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { agencyCommandSchema } from '@/features/agents/agency-contracts';
import { commandAgency, loadAgency } from '@/features/agents/agency-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const GET = (_request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params;
  return workspaceJson((await loadAgency(db, userId, p.workspaceId, p.siteId)).records);
});
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params; const input = await readInput(request, agencyCommandSchema, 12000);
  return workspaceJson(await commandAgency(db, userId, p.workspaceId, p.siteId, input));
});
