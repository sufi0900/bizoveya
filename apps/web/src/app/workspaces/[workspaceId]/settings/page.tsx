import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { getWorkspace } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { WorkspaceRenameForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function WorkspaceSettings({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params; const state = await loadWorkspacePage(`/workspaces/${workspaceId}/settings`, (db, userId) => getWorkspace(db, userId, workspaceId));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email} workspace={state.value}><WorkspaceHeading eyebrow="WORKSPACE SETTINGS" title="Keep your workspace organized" description="Manage the workspace label. Your role and site access are enforced by the server." /><div className="bz-detail-layout"><section className="bz-panel bz-form-panel"><h2>Workspace identity</h2><WorkspaceRenameForm workspace={state.value} /></section><section className="bz-panel bz-details"><h2>Your permissions</h2><dl><div><dt>Current role</dt><dd>{state.value.role}</dd></div><div><dt>Workspace version</dt><dd>{state.value.version}</dd></div><div><dt>Workspace ID</dt><dd className="bz-mono">{workspaceId}</dd></div></dl><p>New workspaces start with their creator as owner. Member invitations, role administration, deletion and platform super-admin tools are not available in this phase.</p></section></div></WorkspaceFrame>;
}
