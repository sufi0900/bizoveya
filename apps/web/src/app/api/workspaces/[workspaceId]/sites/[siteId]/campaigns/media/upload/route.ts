import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
import { createMediaServiceClient } from '@/lib/supabase/media-service';
import { mediaUploadInputSchema } from '@/features/campaigns/private-media-upload-contracts';
import { uploadPrivateMedia } from '@/features/campaigns/private-media-objects';
export const runtime = 'nodejs';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params; const input = await readInput(request, mediaUploadInputSchema, 4 * 1024 * 1024 + 4096);
  return workspaceJson(await uploadPrivateMedia(db, createMediaServiceClient(), userId, p.workspaceId, p.siteId, input));
});
