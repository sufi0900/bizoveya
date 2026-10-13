import { loadWorkspacePage } from "@/features/workspaces/page-data";
import { WorkspaceFrame } from "@/features/workspaces/frame";
import { SetupNotice, WorkspaceHeading } from "@/features/workspaces/views";
import { WorkspaceError } from "@/features/workspaces/store";
import { mcpConfig } from "@/features/mcp/config";
import { RevokeConnection } from "@/features/mcp/connections";
export const dynamic = "force-dynamic";
export default async function ConnectionsPage() {
  const state = await loadWorkspacePage("/workspaces/connections", async db => {
    const config = mcpConfig();
    if (!config.clientIds.length) return { config, grants: [], setupRequired: true };
    const result = await db.auth.oauth.listGrants();
    if (result.error) throw new WorkspaceError(503, "OAuth connections are unavailable. Ask the operator to enable the OAuth server.");
    return { config, grants: result.data ?? [], setupRequired: false };
  });
  if (!state.ready) return <WorkspaceFrame><SetupNotice message={state.message} /></WorkspaceFrame>;
  return <WorkspaceFrame email={state.email}><WorkspaceHeading eyebrow="ACCOUNT CONNECTIONS" title="Connect Bizoveya to ChatGPT" description="Use your workspace data in chat, with your current account permissions." /><section className="bz-panel bz-details"><h2>Bizoveya plugin</h2><p>{state.value.setupRequired ? "Awaiting operator OAuth setup. The plugin cannot access your account yet." : "OAuth is configured for the plugin. Start authorization from your installed plugin."}</p><dl><div><dt>Server address</dt><dd className="bz-mono" style={{ overflowWrap: "anywhere" }}>{state.value.config.resource}</dd></div><div><dt>Available actions</dt><dd>Read workspaces, sites, knowledge, campaigns, agent readiness and native business content{state.value.config.writes ? "; save site preferences, campaign and knowledge drafts, and native website content" : ""}.</dd></div></dl><p>Connections cover all workspaces available to your account. Generated content and knowledge keep their existing human review requirements.</p></section><section className="bz-panel bz-details"><h2>Authorized apps</h2>{!state.value.grants.length && <p>No authorized apps to display.</p>}{state.value.grants.map(grant => <div key={grant.client.id}><h3>{grant.client.name}</h3><p>Connected {new Date(grant.granted_at).toLocaleDateString("en-GB")}</p><RevokeConnection clientId={grant.client.id} name={grant.client.name} /></div>)}<p>Revocation stops new authorization and token refresh. An already issued access token may remain valid until its expiry.</p></section></WorkspaceFrame>;
}
