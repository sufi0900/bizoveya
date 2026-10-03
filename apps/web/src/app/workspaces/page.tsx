import { businessPresets } from "@/domain/business";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { listWorkspaces } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { CreateWorkspaceForm } from "@/features/workspaces/forms";
export const dynamic = "force-dynamic";
export default async function WorkspacesPage({ searchParams }: { searchParams: Promise<{ journey?: string; template?: string }> }) {
  const query = await searchParams; const template = businessPresets.find(p => p.id === query.template); const value = query.journey; const journey = value === "new" || value === "existing" ? value : undefined;
  const state = await loadWorkspacePage(journey ? `/workspaces?journey=${journey}${template ? `&template=${template.id}` : ""}` : "/workspaces", listWorkspaces);
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email}><WorkspaceHeading eyebrow="YOUR BUSINESS, CONNECTED" title="Your workspaces" description="One place to organize your websites. Start small and keep each business separate." /><div className={state.value.length ? "bz-workspace-overview" : "bz-selector-layout"}><section><div className="bz-section-heading"><h2>Available workspaces</h2><span className="bz-badge">{state.value.length} total</span></div><div className="bz-workspace-list">{state.value.map(workspace => <div key={workspace.id}><Link className="bz-panel bz-workspace-card" key={workspace.id} href={`/workspaces/${workspace.id}`}><span className="bz-icon-tile"><Building2 size={22} aria-hidden="true" /></span><div><h3>{workspace.name}</h3><p>{workspace.role} access · version {workspace.version}</p></div><ArrowRight size={18} aria-hidden="true" /></Link>{journey && workspace.role !== "viewer" && <Link className="bz-intent-link" href={`/workspaces/${workspace.id}/sites/new?journey=${journey}${template ? `&template=${template.id}` : ""}`}>{journey === "new" ? `Create a site${template ? ` using ${template.name}` : ""}` : "Register a website"} →</Link>}</div>)}{!state.value.length && <div className="bz-panel bz-empty"><Building2 size={34} aria-hidden="true" /><h2>A fresh start for your websites</h2><p>Create your first workspace, then add your sites. Your saved portfolios remain in Studio.</p></div>}</div></section>{!state.value.length && <section className="bz-panel bz-create-panel"><span className="bz-kicker">CREATE YOUR SPACE</span><h2>New workspace</h2><p>Use your business name or a label for the websites you manage.</p><CreateWorkspaceForm journey={journey} templateId={template?.id} /></section>}</div></WorkspaceFrame>;
}
