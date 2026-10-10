import { workspaceApi, workspaceJson, readInput } from '@/features/workspaces/api';
import { archivePrivateMediaInputSchema } from '@/features/campaigns/private-media-contracts';
import { archiveStoredPrivateMedia } from '@/features/campaigns/private-media-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string; mediaId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const params = await context.params;
  return workspaceJson(await archiveStoredPrivateMedia(db, userId, params.workspaceId, params.siteId, params.mediaId, await readInput(request, archivePrivateMediaInputSchema)));
});
