import { registerSiteSchema } from "@/domain/workspaces";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
import { listSites, registerSite } from "@/features/workspaces/store";
type Context = { params: Promise<{ workspaceId: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => workspaceJson(await listSites(db, userId, (await context.params).workspaceId))); }
export async function POST(request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const input = await readInput(request, registerSiteSchema); return workspaceJson({ site: await registerSite(db, userId, (await context.params).workspaceId, input) }, 201); }); }
