import Link from "next/link";
import { Plus } from "lucide-react";
import { canWriteWorkspace } from "@/domain/workspaces";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { listSites } from "@/features/workspaces/store";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading, SiteGrid } from "@/features/workspaces/views";
export const dynamic = "force-dynamic";
export default async function SitesPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params; const state = await loadWorkspacePage(`/workspaces/${workspaceId}/sites`, (db, userId) => listSites(db, userId, workspaceId));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email} workspace={state.value.workspace}><WorkspaceHeading eyebrow="MULTI-SITE REGISTRY" title="Your websites" description="Keep business websites, portfolios and paused projects together, with their capabilities clearly labeled." action={canWriteWorkspace(state.value.workspace.role) && <Link className="bz-button" href={`/workspaces/${workspaceId}/sites/new`}><Plus size={17} aria-hidden="true" />Add a site</Link>} /><SiteGrid workspaceId={workspaceId} sites={state.value.sites} canAdd={canWriteWorkspace(state.value.workspace.role)} /></WorkspaceFrame>;
}
