import { getSupabaseConfig } from "@/lib/supabase/config";

export function mcpConfig() {
  const origin = new URL(process.env.BIZOVEYA_MCP_ORIGIN ?? "https://bizoveya.vercel.app");
  if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) throw new Error("Invalid MCP origin.");
  const { url } = getSupabaseConfig();
  const issuer = `${url.replace(/\/$/, "")}/auth/v1`;
  const clientIds = (process.env.BIZOVEYA_MCP_ALLOWED_CLIENT_IDS ?? "").split(",").map(x => x.trim()).filter(Boolean);
  return { origin: origin.origin, resource: `${origin.origin}/mcp`, issuer, clientIds, writes: process.env.BIZOVEYA_MCP_ALLOW_DRAFT_WRITES === "true" };
}

export function protectedResourceMetadata() {
  const config = mcpConfig();
  return { resource: config.resource, authorization_servers: [config.issuer], bearer_methods_supported: ["header"], resource_name: "Bizoveya Workspaces" };
}
