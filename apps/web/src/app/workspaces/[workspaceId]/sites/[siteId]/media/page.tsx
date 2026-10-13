import Link from 'next/link';
import { listPrivateMedia } from '@/features/campaigns/private-media-store';
import { MediaRoom } from '@/features/campaigns/private-media-room';
import { getSite } from '@/features/workspaces/store';
import { loadWorkspacePage } from '@/features/workspaces/page-data';
import { WorkspaceFrame } from '@/features/workspaces/frame';
import { SetupNotice, WorkspaceHeading } from '@/features/workspaces/views';
import { loadOptionalMedia } from '@/features/agents/media-store';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private image library', robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ workspaceId: string; siteId: string }> }) {
  const { workspaceId, siteId } = await params;
  const state = await loadWorkspacePage(`/workspaces/${workspaceId}/sites/${siteId}/media`, async (db, userId) => ({ ...await getSite(db, userId, workspaceId, siteId), items: await listPrivateMedia(db, userId, workspaceId, siteId, true), media: await loadOptionalMedia(db, userId, workspaceId, siteId) }));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  const value = state.value;
  return <WorkspaceFrame email={state.email} workspace={value.workspace}>
    <WorkspaceHeading eyebrow="CREATOR PRIVATE" title={`${value.site.name} · Image library`} description="Upload or optionally generate private images, inspect immutable versions, and record reviews before composition. Nothing is published." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/campaigns`}>Content campaigns</Link>} />
    {value.media.notice && <p role="status">{value.media.notice}</p>}
    <MediaRoom initial={value.items} owner={value.workspace.role === 'owner'} imageQualification={value.media.inventory.capabilities.find(item => item.capability === 'image' && item.enabled) ?? null} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/campaigns/media`} />
  </WorkspaceFrame>;
}
