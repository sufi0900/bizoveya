import Link from 'next/link';
import { loadAgency } from '@/features/agents/agency-store';
import { RosterPanel } from '@/features/agents/roster-panel';
import { OnboardingPanel } from '@/features/agents/onboarding-panel';
import { AgencyRoom } from '@/features/agents/agency-room';
import { loadWorkspacePage } from '@/features/workspaces/page-data';
import { WorkspaceFrame } from '@/features/workspaces/frame';
import { SetupNotice, WorkspaceHeading } from '@/features/workspaces/views';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private agency planning', robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ workspaceId: string; siteId: string }> }) {
  const { workspaceId, siteId } = await params; const path = `/workspaces/${workspaceId}/sites/${siteId}/agency`;
  const state = await loadWorkspacePage(path, (db, userId) => loadAgency(db, userId, workspaceId, siteId));
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  const value = state.value;
  return <WorkspaceFrame email={state.email} workspace={value.workspace}>
    <WorkspaceHeading eyebrow="PRIVATE PLANNING" title={`${value.site.name} · Agency planning`} description="Save founder requests, meeting decisions and reviewed task distributions; prepare versioned role invitations without implying attendance. Generation remains separately gated; live voice is not enabled." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/agents`}>Agent readiness</Link>} />
    <OnboardingPanel owner={value.workspace.role === 'owner'} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/agency/onboarding`} sitePath={`/workspaces/${workspaceId}/sites/${siteId}`} />
    <RosterPanel owner={value.workspace.role === 'owner'} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/agency/team`} />
    <AgencyRoom initial={value.records} owner={value.workspace.role === 'owner'} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/agency`} />
  </WorkspaceFrame>;
}
