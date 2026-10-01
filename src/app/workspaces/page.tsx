import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { listWorkspaces } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { CreateWorkspaceForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function WorkspacesPage() {
  const state = await loadWorkspacePage("/workspaces", listWorkspaces);
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email}><WorkspaceHeading eyebrow="YOUR BUSINESS, CONNECTED" title="Your workspaces" description="One place to organize your websites. Start small and keep each business separate." /><div className="bz-selector-layout"><section><div className="bz-section-heading"><h2>Available workspaces</h2><span className="bz-badge">{state.value.length} total</span></div><div className="bz-workspace-list">{state.value.map(workspace => <Link className="bz-panel bz-workspace-card" key={workspace.id} href={`/workspaces/${workspace.id}`}><span className="bz-icon-tile"><Building2 size={22} aria-hidden="true" /></span><div><h3>{workspace.name}</h3><p>{workspace.role} access · version {workspace.version}</p></div><ArrowRight size={18} aria-hidden="true" /></Link>)}{!state.value.length && <div className="bz-panel bz-empty"><Building2 size={34} aria-hidden="true" /><h2>A fresh start for your websites</h2><p>Create your first workspace, then add your sites. Your saved portfolios remain in Studio.</p></div>}</div></section><section className="bz-panel bz-create-panel"><span className="bz-kicker">CREATE YOUR SPACE</span><h2>New workspace</h2><p>Use your business name or a label for the websites you manage.</p><CreateWorkspaceForm /></section></div></WorkspaceFrame>;
}
