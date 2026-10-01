import { canWriteWorkspace } from "@/domain/workspaces";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { getWorkspace, listOwnedProjects, WorkspaceError } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { RegisterSiteForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function NewSitePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params; const state = await loadWorkspacePage(`/workspaces/${workspaceId}/sites/new`, async (db, userId) => { const workspace = await getWorkspace(db, userId, workspaceId); if (!canWriteWorkspace(workspace.role)) throw new WorkspaceError(403, "Your role can view sites but cannot register a new one."); return { workspace, projects: await listOwnedProjects(db, userId) }; });
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email} workspace={state.value.workspace}><WorkspaceHeading eyebrow="START WITH YOUR WEBSITE" title="Add a site" description="Choose your starting point. Registration is separate from connecting accounts or publishing a website." /><section className="bz-panel bz-form-panel"><RegisterSiteForm workspaceId={workspaceId} projects={state.value.projects} /></section></WorkspaceFrame>;
}
