import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { meetingDistributionSchema } from '@/features/agents/agency-contracts';
import { distributeMeetingRequest } from '@/features/agents/agency-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params;
  const input = await readInput(request, meetingDistributionSchema, 12000);
  return workspaceJson(await distributeMeetingRequest(db, userId, p.workspaceId, p.siteId, input));
});
