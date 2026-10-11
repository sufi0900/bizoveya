import { workspaceApi } from '@/features/workspaces/api';
import { requireId, WorkspaceError } from '@/features/workspaces/store';
import { createMediaServiceClient } from '@/lib/supabase/media-service';
import { mediaVersionSchema } from '@/features/campaigns/private-media-upload-contracts';
import { readPrivateMediaBytes } from '@/features/campaigns/private-media-objects';
export const runtime = 'nodejs';
type Context = { params: Promise<{ workspaceId: string; siteId: string; mediaId: string }> };
export const GET = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => {
  const p = await context.params; requireId(p.mediaId);
  const version = mediaVersionSchema.safeParse(new URL(request.url).searchParams.get('version'));
  if (!version.success) throw new WorkspaceError(400, 'Select a saved image version.');
  const result = await readPrivateMediaBytes(db, createMediaServiceClient(), userId, p.workspaceId, p.siteId, p.mediaId, version.data);
  return new Response(new Uint8Array(result.bytes).buffer, { headers: { 'Content-Type': result.descriptor.mime, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': `inline; filename="private-image-v${version.data}.${result.descriptor.mime === 'image/png' ? 'png' : 'jpg'}"` } });
});
