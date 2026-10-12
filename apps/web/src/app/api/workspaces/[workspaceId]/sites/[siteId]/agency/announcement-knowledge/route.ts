import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { announcementKnowledgeHandoffSchema } from '@/features/agents/agency-contracts';
import { prepareAnnouncementKnowledge } from '@/features/agents/agency-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params;
  const input = await readInput(request, announcementKnowledgeHandoffSchema, 180000);
  return workspaceJson(await prepareAnnouncementKnowledge(db, userId, p.workspaceId, p.siteId, input));
});
