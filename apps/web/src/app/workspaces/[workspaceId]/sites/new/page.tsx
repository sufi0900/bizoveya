import { presetIds } from "@/domain/business";
import { canWriteWorkspace } from "@/domain/workspaces";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { getWorkspace, listOwnedProjects, WorkspaceError } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { RegisterSiteForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function NewSitePage({ params, searchParams }: { params: Promise<{ workspaceId: string }>; searchParams: Promise<{ journey?: string; template?: string }> }) {
  const { workspaceId } = await params; const query = await searchParams; const journey = query.journey === "new" ? "new" : "existing"; const template = presetIds.find(id => id === query.template) ?? "service-studio-v1"; const state = await loadWorkspacePage(`/workspaces/${workspaceId}/sites/new?journey=${journey}&template=${template}`, async (db, userId) => { const workspace = await getWorkspace(db, userId, workspaceId); if (!canWriteWorkspace(workspace.role)) throw new WorkspaceError(403, "Your role can view sites but cannot register a new one."); return { workspace, projects: await listOwnedProjects(db, userId) }; });
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email} workspace={state.value.workspace}><WorkspaceHeading eyebrow="START WITH YOUR WEBSITE" title="Add a site" description="Choose your starting point. Registration is separate from connecting accounts or publishing a website." /><section className="bz-panel bz-form-panel"><RegisterSiteForm workspaceId={workspaceId} projects={state.value.projects} initialJourney={journey} initialTemplate={template} /></section></WorkspaceFrame>;
}
