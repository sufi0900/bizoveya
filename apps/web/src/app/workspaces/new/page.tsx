import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { CreateWorkspaceForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function NewWorkspace() {
 const state = await loadWorkspacePage("/workspaces/new", async () => true);
 if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message}/></WorkspaceFrame>;
 return <WorkspaceFrame email={state.email}><WorkspaceHeading eyebrow="YOUR BUSINESS" title="Create a workspace" description="Create another workspace only when you need a separate place to manage a business."/><section className="bz-panel bz-form-panel"><CreateWorkspaceForm/></section></WorkspaceFrame>;
}