import { generatedImageInputSchema } from '@/features/campaigns/generated-image-contracts';
import { generatePrivateImage } from '@/features/campaigns/generated-image-server';
import { readInput, workspaceApi, workspaceJson } from '@/features/workspaces/api';
export const runtime = 'nodejs';
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const POST = (request: Request, context: Context) => workspaceApi(async ({ db, userId }) => { const p = await context.params; return workspaceJson(await generatePrivateImage(db, userId, p.workspaceId, p.siteId, await readInput(request, generatedImageInputSchema, 8192))); });
