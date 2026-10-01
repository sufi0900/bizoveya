import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AdminError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const identitySchema = z.object({ isAdmin: z.boolean(), aal2: z.boolean() }).strict();
export async function requireAdmin(db: SupabaseClient, requireMfa = true) {
  const { data, error } = await db.rpc("bz_admin_identity");
  const identity = identitySchema.safeParse(data);
  if (error || !identity.success) throw new AdminError(503, "ADMIN_UNAVAILABLE", "Admin storage is unavailable. Check migration 019 and retry.");
  if (!identity.data.isAdmin) throw new AdminError(403, "ADMIN_REQUIRED", "This account has no platform-admin access.");
  if (requireMfa && !identity.data.aal2) throw new AdminError(403, "MFA_REQUIRED", "Verify your authenticator to open platform administration.");
  return identity.data;
}
export async function adminSession(requireMfa = true) {
  if (!hasSupabaseConfig) throw new AdminError(503, "SETUP_REQUIRED", "Connect Supabase and follow the current admin setup guide before opening administration.");
  const db = await createSupabaseServerClient();
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) throw new AdminError(401, "SIGN_IN_REQUIRED", "Sign in with your operator-approved account.");
  const identity = await requireAdmin(db, requireMfa);
  return { db, userId: user.id, email: user.email ?? "Signed in", identity };
}
export function safeAdminError(cause: unknown) {
  return cause instanceof AdminError ? cause : new AdminError(503, "ADMIN_UNAVAILABLE", "Administration is temporarily unavailable. Please retry.");
}
