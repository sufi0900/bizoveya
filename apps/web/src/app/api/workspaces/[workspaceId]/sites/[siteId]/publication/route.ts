import { publicationInput } from "@/domain/business-publication";
import { loadPublication,setPublication } from "@/features/business/publication-store";
import { readInput,workspaceApi,workspaceJson } from "@/features/workspaces/api";
type Context = { params: Promise<{ workspaceId: string; siteId: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request,context: Context) { return workspaceApi(async({db,userId}) => { const p=await context.params;return workspaceJson({publication:await loadPublication(db,userId,p.workspaceId,p.siteId)}); }); }
export async function POST(request: Request,context: Context) { return workspaceApi(async({db,userId}) => { const p=await context.params;const input=await readInput(request,publicationInput);return workspaceJson({publication:await setPublication(db,userId,p.workspaceId,p.siteId,input)}); }); }
