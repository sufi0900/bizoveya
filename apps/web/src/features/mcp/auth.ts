import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { WorkspaceError } from "@/features/workspaces/store";
import { mcpConfig } from "./config";

export async function authenticateMcp(request: Request) {
  const config = mcpConfig();
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([^\s]+)$/i.exec(header);
  if (!match || match[1].length > 16384) throw new WorkspaceError(401, "Connect your Bizoveya account to use this plugin.");
  if (!config.clientIds.length) throw new WorkspaceError(503, "The Bizoveya plugin connection is awaiting OAuth setup.");
  const token = match[1];
  const { url, key } = getSupabaseConfig();
  // Only the anonymous key and caller's access token: never bypass RLS.
  const db = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await db.auth.getClaims(token);
  const claims = data?.claims;
  const clientId = claims?.client_id;
  if (error || !claims || claims.iss !== config.issuer || typeof clientId !== "string" || !config.clientIds.includes(clientId) || claims.role !== "authenticated" || claims.is_anonymous === true) throw new WorkspaceError(401, "This token is not authorized for the Bizoveya plugin.");
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audience.includes("authenticated")) throw new WorkspaceError(401, "Invalid plugin token audience.");
  const user = await db.auth.getUser(token);
  if (user.error || !user.data.user || user.data.user.id !== claims.sub) throw new WorkspaceError(401, "Reconnect your Bizoveya account.");
  return { db, userId: user.data.user.id };
}
