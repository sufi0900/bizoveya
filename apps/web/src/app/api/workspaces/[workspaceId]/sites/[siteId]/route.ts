import { updateSiteSchema } from "@/domain/workspaces";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
import { getSite, updateSite } from "@/features/workspaces/store";
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const p = await context.params; return workspaceJson(await getSite(db, userId, p.workspaceId, p.siteId)); }); }
export async function PATCH(request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const p = await context.params; const input = await readInput(request, updateSiteSchema); return workspaceJson({ site: await updateSite(db, userId, p.workspaceId, p.siteId, input) }); }); }
