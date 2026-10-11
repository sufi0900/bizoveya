import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { createMediaServiceClient } from '@/lib/supabase/media-service';
import { mediaCleanupInputSchema } from '@/features/campaigns/private-media-upload-contracts';
import { recoverPrivateMediaUploads } from '@/features/campaigns/private-media-objects';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params; await readInput(request, mediaCleanupInputSchema, 500);
  return workspaceJson(await recoverPrivateMediaUploads(db, createMediaServiceClient(), userId, p.workspaceId, p.siteId));
});
