import { protectedResourceMetadata } from "@/features/mcp/config";
export const dynamic = "force-dynamic";
export function GET() {
  try { return Response.json(protectedResourceMetadata(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Plugin authentication is not configured." }, { status: 503 }); }
}
