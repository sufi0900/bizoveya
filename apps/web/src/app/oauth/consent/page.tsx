import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mcpConfig } from "@/features/mcp/config";
import { ConsentForm } from "@/features/mcp/consent-form";
export const dynamic = "force-dynamic";
export default async function OAuthConsent({ searchParams }: { searchParams: Promise<{ authorization_id?: string }> }) {
  const id = (await searchParams).authorization_id;
  if (!id || !z.uuid().safeParse(id).success) return <main className="flow-page"><h1>Invalid connection request</h1><p>Start the connection again from your plugin.</p></main>;
  let state: { name: string; redirectUri: string; scopes: string[]; writes: boolean } | null = null;
  let issue = ""; let callback = ""; let needsLogin = false;
  try {
    const config = mcpConfig(); const db = await createSupabaseServerClient(); const user = await db.auth.getUser();
    if (user.error || !user.data.user) needsLogin = true;
    else {
      const { data, error } = await db.auth.oauth.getAuthorizationDetails(id);
      if (error || !data) issue = "This request expired or OAuth is not configured. Start the connection again.";
      else if (!("authorization_id" in data)) callback = data.redirect_url;
      else if (!config.clientIds.includes(data.client.id)) issue = "This app has not been enabled for the Bizoveya plugin.";
      else state = { name: data.client.name, redirectUri: data.redirect_uri, scopes: data.scope.split(" ").filter(Boolean), writes: config.writes };
    }
  } catch { issue = "Plugin authorization is temporarily unavailable. Please retry."; }
  if (needsLogin) redirect(`/login?next=${encodeURIComponent(`/oauth/consent?authorization_id=${id}`)}`);
  if (callback) redirect(callback); // Returned by Supabase, never from query parameters.
  return <main className="flow-page"><header className="flow-nav"><Link href="/workspaces">← Workspaces</Link><strong>BIZOVEYA</strong></header><section className="auth-card"><p className="eyebrow">CONNECT YOUR ACCOUNT</p><h1>{state ? `Connect ${state.name}` : "Connection unavailable"}</h1>{state ? <><p>This app can read your workspace and site records, private site knowledge, campaign drafts, generated outputs, agent readiness and native business website content in every workspace your account can access.</p>{state.writes && <p>It can also save site preferences, campaign and knowledge drafts, and native business website content where your role permits editing. Editing approved knowledge requires a new human approval.</p>}<p>Your account permissions also apply to tokens issued by Supabase. Only authorize an app you trust with your account’s existing data permissions.</p><dl><dt>App</dt><dd>{state.name}</dd><dt>Return address</dt><dd style={{ overflowWrap: "anywhere" }}>{state.redirectUri}</dd><dt>Requested identity scopes</dt><dd>{state.scopes.join(", ") || "Account access"}</dd></dl><p>You can revoke this connection from Workspaces → Connections.</p><ConsentForm authorizationId={id} /></> : <p role="alert">{issue}</p>}</section></main>;
}
