import type { SupabaseClient } from "@supabase/supabase-js";
import { businessDraftSchema, newBusinessDocument, type BusinessDocument } from "@/domain/business";
import { canWriteWorkspace } from "@/domain/workspaces";
import { checkDatabaseError, getSite, WorkspaceError } from "@/features/workspaces/store";
function checkBusinessError(error: { code?: string; message?: string } | null) {
  if (["42P01", "42703", "PGRST202", "PGRST205"].includes(error?.code ?? "")) throw new WorkspaceError(503, "Business draft storage needs migrations 021 and 022. Ask the platform operator to complete setup.");
  if (error?.message?.includes("bz_invalid_business_document")) throw new WorkspaceError(400, "Draft rejected. Check the content and ensure migrations022 and025 are applied for the selected design.");
  if (error?.message === "bz_invalid_business_order") throw new WorkspaceError(400, "Review section order and hero length: one Hero first, FAQ in the last three visible sections, headline120/introduction320 characters.");
  checkDatabaseError(error);
}
export async function loadBusinessDraft(db: SupabaseClient, userId: string, workspaceId: string, siteId: string) {
  const context = await getSite(db, userId, workspaceId, siteId);
  if (context.site.mode !== "native_business") throw new WorkspaceError(404, "The business editor is only available for a native business site.");
  const result = await db.from("bizoveya_business_drafts").select("site_id,document,version,updated_at").eq("site_id", siteId).maybeSingle();
  checkBusinessError(result.error);
  const draft = result.data ? businessDraftSchema.parse(result.data) : null;
  return { ...context, document: draft?.document ?? newBusinessDocument(context.site.name), version: draft?.version ?? 0, updatedAt: draft?.updated_at ?? null };
}
export async function saveBusinessDraft(db: SupabaseClient, userId: string, workspaceId: string, siteId: string, document: BusinessDocument, expectedVersion: number) {
  const { workspace, site } = await getSite(db, userId, workspaceId, siteId);
  if (site.mode !== "native_business") throw new WorkspaceError(404, "This site does not use the business editor.");
  if (!canWriteWorkspace(workspace.role)) throw new WorkspaceError(403, "Your workspace role is read-only.");
  const result = await db.rpc("bz_save_business_draft", { p_workspace_id: workspaceId, p_site_id: siteId, p_document: document, p_expected_version: expectedVersion });
  checkBusinessError(result.error);
  return businessDraftSchema.parse(Array.isArray(result.data) ? result.data[0] : result.data);
}
