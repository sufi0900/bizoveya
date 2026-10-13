import { z } from "zod";
import { WorkspaceError } from "@/features/workspaces/store";
import { authenticateMcp } from "./auth";
import { mcpConfig } from "./config";
import { callMcpTool, mcpTools } from "./tools";

const versions = ["2026-07-28", "2025-11-25", "2025-06-18"];
const envelope = z.object({ jsonrpc: z.literal("2.0"), id: z.union([z.string().max(200), z.number()]).optional(), method: z.string().max(100), params: z.record(z.string(), z.unknown()).optional() }).strict();
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
function reply(value: unknown, status = 200, extra: Record<string, string> = {}) { return Response.json(value, { status, headers: { ...headers, ...extra } }); }
function error(id: string | number | null, code: number, message: string) { return reply({ jsonrpc: "2.0", id, error: { code, message } }); }
async function readBody(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 131072) throw new WorkspaceError(413, "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new WorkspaceError(400, "Provide a JSON request.");
  const parts: Uint8Array[] = []; let size = 0;
  try { while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 131072) { await reader.cancel(); throw new WorkspaceError(413, "Request is too large."); } parts.push(value); } }
  finally { reader.releaseLock(); }
  const buffer = new Uint8Array(size); let offset = 0; for (const part of parts) { buffer.set(part, offset); offset += part.length; }
  return JSON.parse(new TextDecoder().decode(buffer));
}

export async function handleMcp(request: Request) {
  let config: ReturnType<typeof mcpConfig>;
  try { config = mcpConfig(); } catch { return reply({ error: "Plugin configuration is unavailable." }, 503); }
  // Bearer-only transport. Cookie sessions never authorize MCP requests.
  if (request.headers.get("origin") && request.headers.get("origin") !== config.origin) return reply({ error: "Origin is not allowed." }, 403);
  let context: Awaited<ReturnType<typeof authenticateMcp>>;
  try { context = await authenticateMcp(request); }
  catch (cause) {
    const status = cause instanceof WorkspaceError ? cause.status : 503;
    return reply({ error: cause instanceof WorkspaceError ? cause.message : "Authentication is temporarily unavailable." }, status, status === 401 ? { "WWW-Authenticate": `Bearer resource_metadata="${config.origin}/.well-known/oauth-protected-resource/mcp"` } : {});
  }
  if (request.method !== "POST") return reply({ error: "Use POST for this stateless MCP endpoint." }, 405, { Allow: "POST" });
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply({ error: "Send application/json." }, 415);
  const version = request.headers.get("mcp-protocol-version");
  if (version && !versions.includes(version)) return reply({ error: "Unsupported MCP protocol version." }, 400);
  let body: unknown;
  try { body = await readBody(request); }
  catch (cause) { return cause instanceof WorkspaceError ? reply({ error: cause.message }, cause.status) : error(null, -32700, "Invalid JSON."); }
  const parsed = envelope.safeParse(body);
  if (!parsed.success) return error(null, -32600, "Invalid JSON-RPC request.");
  const rpc = parsed.data;
  if (rpc.id === undefined) return new Response(null, { status: 202, headers });
  const result = (value: unknown) => reply({ jsonrpc: "2.0", id: rpc.id, result: value });
  switch (rpc.method) {
    case "initialize": return result({ protocolVersion: versions.includes(String(rpc.params?.protocolVersion)) ? rpc.params?.protocolVersion : versions[0], capabilities: { tools: {} }, serverInfo: { name: "bizoveya-workspaces", version: "0.1.0" }, instructions: "Private Bizoveya workspace data. Respect workspace roles, approval status and record versions. Save drafts only when requested by the user." });
    case "server/discover": return result({ supportedVersions: versions, capabilities: { tools: {} }, serverInfo: { name: "bizoveya-workspaces", version: "0.1.0" } });
    case "ping": return result({});
    case "tools/list": return result({ tools: mcpTools(config.writes) });
    case "tools/call": {
      const params = z.object({ name: z.string(), arguments: z.record(z.string(), z.unknown()).default({}), _meta: z.record(z.string(), z.unknown()).optional() }).strict().safeParse(rpc.params);
      if (!params.success) return error(rpc.id, -32602, "Invalid tool call.");
      try { const data = await callMcpTool(params.data.name, params.data.arguments, context, config.writes); return result({ content: [{ type: "text", text: JSON.stringify(data) }] }); }
      catch (cause) { return result({ isError: true, content: [{ type: "text", text: cause instanceof WorkspaceError ? cause.message : "This operation could not be completed. Reload the record before retrying a write." }] }); }
    }
    default: return error(rpc.id, -32601, "Method not found.");
  }
}
