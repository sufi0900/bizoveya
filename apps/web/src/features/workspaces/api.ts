import { NextResponse } from "next/server";
import type { z } from "zod";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WorkspaceError } from "./store";

export function validateMutationRequest(request: Request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") throw new WorkspaceError(403, "Use the platform from its own origin.");
  if (!(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() === "application/json")) throw new WorkspaceError(415, "Send an application/json request.");
}
export async function readInput<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  validateMutationRequest(request);
  if (Number(request.headers.get("content-length") ?? 0) > 16384) throw new WorkspaceError(413, "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new WorkspaceError(400, "Provide a JSON body.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 16384) { await reader.cancel(); throw new WorkspaceError(413, "Request is too large."); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new WorkspaceError(400, "Provide valid JSON."); }
  const result = schema.safeParse(value);
  if (!result.success) throw new WorkspaceError(400, result.error.issues[0]?.message ?? "Check the submitted details.");
  return result.data;
}
export async function workspaceApi(handler: (context: { db: Awaited<ReturnType<typeof createSupabaseServerClient>>; userId: string }) => Promise<Response>) {
  try {
    if (!hasSupabaseConfig) throw new WorkspaceError(503, "Supabase storage is not configured.");
    const db = await createSupabaseServerClient();
    const { data: { user }, error } = await db.auth.getUser();
    if (error || !user) throw new WorkspaceError(401, "Sign in to access your workspace.");
    return await handler({ db, userId: user.id });
  } catch (cause) {
    const error = cause instanceof WorkspaceError ? cause : new WorkspaceError(503, "The request could not be completed. Please retry.");
    return NextResponse.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "private, no-store" } });
  }
}
export function workspaceJson(value: unknown, status = 200) { return NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } }); }
