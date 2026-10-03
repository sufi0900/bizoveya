import Link from "next/link";
import type { Metadata } from "next";
import { canWriteWorkspace } from "@/domain/workspaces";
import { loadBusinessDraft } from "@/features/business/store";
import { BusinessWorkbench } from "@/features/business/workbench";
import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Business draft editor", robots: { index: false, follow: false } };
export default async function BusinessEditor({ params }: { params: Promise<{ workspaceId: string; siteId: string }> }) {
  const { workspaceId, siteId } = await params;
  const state = await loadWorkspacePage(`/workspaces/${workspaceId}/sites/${siteId}/editor`, (db, userId) => loadBusinessDraft(db, userId, workspaceId, siteId));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  const { workspace, site, document, version } = state.value;
  return <WorkspaceFrame email={state.email} workspace={workspace}><WorkspaceHeading eyebrow="MODULAR BUSINESS STUDIO" title={site.name} description="Edit your business information and preview your website. Save a private draft for your workspace." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/knowledge`}>Site knowledge</Link>} /><BusinessWorkbench siteId={siteId} initialDocument={document} initialVersion={version} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/business`} readOnly={!canWriteWorkspace(workspace.role)} /></WorkspaceFrame>;
}
