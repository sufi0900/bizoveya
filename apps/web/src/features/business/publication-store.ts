import type { SupabaseClient } from "@supabase/supabase-js";
import { publicationSchema } from "@/domain/business-publication";
import { canWriteWorkspace } from "@/domain/workspaces";
import { getSite, checkDatabaseError, WorkspaceError } from "@/features/workspaces/store";
function check(error: { code?: string; message?: string } | null) {
 if (["42P01", "PGRST202", "PGRST205"].includes(error?.code ?? "")) throw new WorkspaceError(503, "Publishing needs migration024. Ask the platform operator to complete setup.");
 if (error?.message?.includes("bz_publication_not_ready")) throw new WorkspaceError(400, "Show Hero and Contact sections and add a contact email or callable phone before publishing.");
 checkDatabaseError(error);
}
export async function loadPublication(db: SupabaseClient, userId: string, workspaceId: string, siteId: string) {
 const { site } = await getSite(db,userId,workspaceId,siteId);
 if (site.mode !== "native_business") throw new WorkspaceError(404,"This site does not use business publishing.");
 const result = await db.from("bizoveya_business_publications").select("site_id,document,source_version,version,active,published_at,updated_at").eq("site_id",siteId).maybeSingle();
 check(result.error); return result.data ? publicationSchema.parse(result.data) : null;
}
export async function setPublication(db: SupabaseClient,userId: string,workspaceId: string,siteId: string,input: { publish: boolean; expectedDraftVersion: number; expectedPublicationVersion: number }) {
 const { workspace,site } = await getSite(db,userId,workspaceId,siteId);
 if (site.mode !== "native_business") throw new WorkspaceError(404,"This site does not use business publishing.");
 if (!canWriteWorkspace(workspace.role)) throw new WorkspaceError(403,"Your workspace role is read-only.");
 const result = await db.rpc("bz_set_business_publication", { p_workspace_id:workspaceId,p_site_id:siteId,p_expected_draft_version:input.expectedDraftVersion,p_expected_publication_version:input.expectedPublicationVersion,p_publish:input.publish });
 check(result.error); return publicationSchema.parse(Array.isArray(result.data) ? result.data[0] : result.data);
}
