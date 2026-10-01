import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AdminError } from "./access";
const count = z.number().int().nonnegative();
export const summarySchema = z.object({ workspaces: count, sites: count, workspaceMembers: count, admins: count }).strict();
export type AdminSummary = z.infer<typeof summarySchema>;
export const auditSchema = z.array(z.object({ id: z.string().uuid(), occurred_at: z.string().datetime({ offset: true }), action: z.enum(["admin_granted", "admin_revoked"]), subject_id: z.string().uuid(), operator_label: z.string(), database_actor: z.string(), reason: z.string() }).strict()).max(100);
export type AdminAudit = z.infer<typeof auditSchema>;
async function readRpc<T>(db: SupabaseClient, name: string, schema: z.ZodType<T>): Promise<T> {
  const { data, error } = await db.rpc(name);
  if (error?.code === "42501") throw new AdminError(403, "ACCESS_CHANGED", "Your admin access changed. Sign in and verify your authenticator again.");
  const parsed = schema.safeParse(data);
  if (error || !parsed.success) throw new AdminError(503, "ADMIN_UNAVAILABLE", "Admin records could not be loaded. Please retry.");
  return parsed.data;
}
export const loadAdminSummary = (db: SupabaseClient) => readRpc(db, "bz_admin_summary", summarySchema);
export const loadAdminAudit = (db: SupabaseClient) => readRpc(db, "bz_admin_audit", auditSchema);
