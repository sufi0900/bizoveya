import { saveBusinessSchema } from "@/domain/business";
import { loadBusinessDraft, saveBusinessDraft } from "@/features/business/store";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const p = await context.params; const { document, version, updatedAt } = await loadBusinessDraft(db, userId, p.workspaceId, p.siteId); return workspaceJson({ document, version, updatedAt }); }); }
export async function PUT(request: Request, context: Context) { return workspaceApi(async ({ db, userId }) => { const p = await context.params; const input = await readInput(request, saveBusinessSchema, 65536); return workspaceJson({ draft: await saveBusinessDraft(db, userId, p.workspaceId, p.siteId, input.document, input.expectedVersion) }); }); }
