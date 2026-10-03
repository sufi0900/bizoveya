import Link from "next/link";
import { ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { canWriteWorkspace } from "@/domain/workspaces";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { listSites } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading, SiteGrid, SiteMetrics } from "@/features/workspaces/views";
export const dynamic = "force-dynamic";
export default async function WorkspaceOverview({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  const state = await loadWorkspacePage(`/workspaces/${workspaceId}`, (db, userId) => listSites(db, userId, workspaceId));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  const { workspace, sites } = state.value;
  return <WorkspaceFrame email={state.email} workspace={workspace}><WorkspaceHeading eyebrow="WORKSPACE OVERVIEW" title={workspace.name} description="Your websites, their status, and a clear place to start." action={canWriteWorkspace(workspace.role) && <Link className="bz-button" href={`/workspaces/${workspaceId}/sites/new`}><Plus size={17} aria-hidden="true" />Add a site</Link>} /><SiteMetrics sites={sites} /><div className="bz-section-heading"><h2>Your websites</h2><Link href={`/workspaces/${workspaceId}/sites`}>View all<ArrowRight size={15} aria-hidden="true" /></Link></div><SiteGrid workspaceId={workspaceId} sites={sites} canAdd={canWriteWorkspace(workspace.role)} /><div className="bz-callout bz-wide-callout"><ShieldCheck size={23} aria-hidden="true" /><div><strong>Your website stays yours</strong><p>External URLs are registered read-only. Saved portfolios keep their current owner. Business Studio is available for native business drafts. Publishing and AI tools are planned.</p></div></div></WorkspaceFrame>;
}
