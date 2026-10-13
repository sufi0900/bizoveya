import { z } from "zod";
import { readInput, workspaceApi, workspaceJson } from "@/features/workspaces/api";
import { WorkspaceError } from "@/features/workspaces/store";
import { mcpConfig } from "@/features/mcp/config";
export const dynamic = "force-dynamic";
const inputSchema = z.discriminatedUnion("decision", [
  z.object({ authorizationId: z.uuid(), decision: z.enum(["approve", "deny"]) }).strict(),
  z.object({ clientId: z.uuid(), decision: z.literal("revoke") }).strict(),
]);
export async function POST(request: Request) {
  return workspaceApi(async ({ db }) => {
    const input = await readInput(request, inputSchema);
    const config = mcpConfig();
    if (input.decision === "revoke") {
      const result = await db.auth.oauth.revokeGrant({ clientId: input.clientId });
      if (result.error) throw new WorkspaceError(400, "Could not revoke this connection. Please retry.");
      return workspaceJson({ revoked: true });
    }
    const details = await db.auth.oauth.getAuthorizationDetails(input.authorizationId);
    if (details.error || !details.data || !("authorization_id" in details.data)) throw new WorkspaceError(400, "This connection request expired. Start it again.");
    if (input.decision === "approve" && !config.clientIds.includes(details.data.client.id)) throw new WorkspaceError(403, "This app has not been enabled for the Bizoveya plugin.");
    const result = input.decision === "approve" ? await db.auth.oauth.approveAuthorization(input.authorizationId, { skipBrowserRedirect: true }) : await db.auth.oauth.denyAuthorization(input.authorizationId, { skipBrowserRedirect: true });
    if (result.error || !result.data) throw new WorkspaceError(400, "Could not complete authorization. Start the connection again.");
    const target = new URL(result.data.redirect_url); const registered = new URL(details.data.redirect_uri);
    if (target.origin !== registered.origin || target.pathname !== registered.pathname) throw new WorkspaceError(400, "Authorization returned an unexpected callback.");
    return workspaceJson({ redirectUrl: result.data.redirect_url });
  });
}
