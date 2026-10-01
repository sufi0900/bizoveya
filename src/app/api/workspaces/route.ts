import { createWorkspaceSchema } from "@/domain/workspaces";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
import { createWorkspace, listWorkspaces } from "@/features/workspaces/store";
export const dynamic = "force-dynamic";
export async function GET() { return workspaceApi(async ({ db, userId }) => workspaceJson({ workspaces: await listWorkspaces(db, userId) })); }
export async function POST(request: Request) { return workspaceApi(async ({ db }) => { const input = await readInput(request, createWorkspaceSchema); return workspaceJson({ workspace: await createWorkspace(db, input.name) }, 201); }); }
