import { renameWorkspaceSchema } from "@/domain/workspaces";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
import { getWorkspace, renameWorkspace } from "@/features/workspaces/store";
type Context = { params: Promise<{ workspaceId: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => workspaceJson({ workspace: await getWorkspace(db, userId, (await context.params).workspaceId) })); }
export async function PATCH(request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const input = await readInput(request, renameWorkspaceSchema); return workspaceJson({ workspace: await renameWorkspace(db, userId, (await context.params).workspaceId, input.name, input.expectedVersion) }); }); }
