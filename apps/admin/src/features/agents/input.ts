import type {z} from "zod";
import {AdminError} from "@/features/admin/access";
export function validateMutationRequest(request: Request) {
  const origin = request.headers.get("origin");
  const internal = new URL(request.url);
  // Next may expose its internal localhost hostname. Use the routed Host and
  // proxy scheme for the browser origin, never an arbitrary forwarded host.
  const host = request.headers.get("host") ?? internal.host;
  const forwardedScheme = request.headers.get("x-forwarded-proto");
  const scheme = forwardedScheme === "http" || forwardedScheme === "https" ? forwardedScheme : internal.protocol.slice(0, -1);
  const expectedOrigin = `${scheme}://${host}`;
  if ((origin && origin !== expectedOrigin) || request.headers.get("sec-fetch-site") === "cross-site") throw new AdminError(403, "INVALID_REQUEST", "Use the platform from its own origin.");
  if (!(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() === "application/json")) throw new AdminError(415, "INVALID_REQUEST", "Send an application/json request.");
}
export async function readInput<T>(request: Request, schema: z.ZodType<T>, maxBytes = 16384): Promise<T> {
  validateMutationRequest(request);
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) throw new AdminError(413, "INVALID_REQUEST", "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError(400, "INVALID_REQUEST", "Provide a JSON body.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > maxBytes) { await reader.cancel(); throw new AdminError(413, "INVALID_REQUEST", "Request is too large."); } chunks.push(value); }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new AdminError(400, "INVALID_REQUEST", "Provide valid JSON."); }
  const result = schema.safeParse(value);
  if (!result.success) throw new AdminError(400, "INVALID_REQUEST", result.error.issues[0]?.message ?? "Check the submitted details.");
  return result.data;
}
