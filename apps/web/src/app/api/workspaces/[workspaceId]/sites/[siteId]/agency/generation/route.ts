import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { agencyGenerationSchema } from '@/features/agents/agency-contracts';
import { prepareAgencyGeneration } from '@/features/agents/agency-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params;
  const input = await readInput(request, agencyGenerationSchema, 2000);
  return workspaceJson(await prepareAgencyGeneration(db, userId, p.workspaceId, p.siteId, input));
});
