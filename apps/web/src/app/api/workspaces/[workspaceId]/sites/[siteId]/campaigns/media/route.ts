import { workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { listPrivateMedia } from '@/features/campaigns/private-media-store';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const GET = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const params = await context.params;
  return workspaceJson(await listPrivateMedia(db, userId, params.workspaceId, params.siteId, new URL(request.url).searchParams.get('archived') === '1'));
});
