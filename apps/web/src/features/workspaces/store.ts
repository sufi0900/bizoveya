import { z } from "zod";
import { newBusinessDocument } from "@/domain/business";
import type { SupabaseClient } from "@supabase/supabase-js";
import { canWriteWorkspace, workspaceRecordSchema, workspaceRoleSchema, siteRecordSchema, type RegisterSiteInput, type UpdateSiteInput } from "@/domain/workspaces";

export class WorkspaceError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "WorkspaceError"; }
}
type DbError = { code?: string; message?: string } | null;
export function checkDatabaseError(error: DbError) {
  if (!error) return;
  if (["42P01", "42703", "PGRST202", "PGRST205"].includes(error.code ?? "")) throw new WorkspaceError(503, "Workspace storage needs migration 018. Ask the platform operator to complete setup.");
  if (error.message === "bz_duplicate_name") throw new WorkspaceError(409, "A site with this name already exists in this workspace. Open it from Your sites, or use a different name.");
  if (error.message === "bz_duplicate_url") throw new WorkspaceError(409, "This website URL is already registered in this workspace, possibly under another name. Open it from Your sites.");
  if (error.message === "bz_duplicate_workspace") throw new WorkspaceError(409, "You already have a workspace with this name. Open your existing workspace.");
  if (error.code === "23505") throw new WorkspaceError(409, "This portfolio is already registered. Open its existing site record.");
  if (error.message === "bz_invalid_business_order") throw new WorkspaceError(400, "Review Hero/FAQ placement and hero text lengths in Studio before publishing.");
  if (error.message === "bz_conflict") throw new WorkspaceError(409, "This record changed in another session. Reload before saving.");
  if (error.message === "bz_forbidden" || error.code === "42501") throw new WorkspaceError(403, "You do not have permission for this action.");
  if (error.message === "bz_not_found") throw new WorkspaceError(404, "This record is unavailable.");
  if (error.message?.startsWith("bz_invalid") || error.code === "23503" || error.code === "23514") throw new WorkspaceError(400, "Check the site details and your owned portfolio selection.");
  throw new WorkspaceError(503, "Workspace storage is temporarily unavailable. Please retry.");
}
export function requireId(value: string) { if (!z.uuid().safeParse(value).success) throw new WorkspaceError(404, "This record is unavailable."); return value; }
function firstRecord(value: unknown) { return Array.isArray(value) ? value[0] : value; }
export async function listWorkspaces(db: SupabaseClient, userId: string) {
  const membership = await db.from("bizoveya_memberships").select("workspace_id,role").eq("user_id", userId);
  checkDatabaseError(membership.error);
  const roles = z.array(z.object({ workspace_id: z.uuid(), role: workspaceRoleSchema })).parse(membership.data ?? []);
  if (!roles.length) return [];
  const result = await db.from("bizoveya_workspaces").select("*").in("id", roles.map(item => item.workspace_id)).order("updated_at", { ascending: false });
  checkDatabaseError(result.error);
  return z.array(workspaceRecordSchema).parse(result.data ?? []).map(item => ({ ...item, role: roles.find(role => role.workspace_id === item.id)!.role }));
}
export async function getWorkspace(db: SupabaseClient, userId: string, workspaceId: string, write = false) {
  requireId(workspaceId);
  const membership = await db.from("bizoveya_memberships").select("role").eq("workspace_id", workspaceId).eq("user_id", userId).maybeSingle();
  checkDatabaseError(membership.error);
  if (!membership.data) throw new WorkspaceError(404, "This workspace is unavailable.");
  const role = workspaceRoleSchema.parse(membership.data.role);
  if (write && !canWriteWorkspace(role)) throw new WorkspaceError(403, "Your workspace role is read-only.");
  const result = await db.from("bizoveya_workspaces").select("*").eq("id", workspaceId).maybeSingle();
  checkDatabaseError(result.error);
  if (!result.data) throw new WorkspaceError(404, "This workspace is unavailable.");
  return { ...workspaceRecordSchema.parse(result.data), role };
}
export async function createWorkspace(db: SupabaseClient, name: string) {
  const result = await db.rpc("bz_create_workspace", { p_name: name });
  checkDatabaseError(result.error);
  return workspaceRecordSchema.parse(firstRecord(result.data));
}
export async function renameWorkspace(db: SupabaseClient, userId: string, workspaceId: string, name: string, expectedVersion: number) {
  const access = await getWorkspace(db, userId, workspaceId, true);
  if (access.role !== "owner") throw new WorkspaceError(403, "Only a workspace owner can rename it.");
  const result = await db.rpc("bz_rename_workspace", { p_workspace_id: workspaceId, p_name: name, p_expected_version: expectedVersion });
  checkDatabaseError(result.error);
  return workspaceRecordSchema.parse(firstRecord(result.data));
}
export async function listSites(db: SupabaseClient, userId: string, workspaceId: string) {
  const workspace = await getWorkspace(db, userId, workspaceId);
  const result = await db.from("bizoveya_sites").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false });
  checkDatabaseError(result.error);
  return { workspace, sites: z.array(siteRecordSchema).parse(result.data ?? []) };
}
export async function getSite(db: SupabaseClient, userId: string, workspaceId: string, siteId: string) {
  const workspace = await getWorkspace(db, userId, workspaceId); requireId(siteId);
  const result = await db.from("bizoveya_sites").select("*").eq("workspace_id", workspaceId).eq("id", siteId).maybeSingle();
  checkDatabaseError(result.error);
  if (!result.data) throw new WorkspaceError(404, "This site is unavailable in this workspace.");
  const site = siteRecordSchema.parse(result.data);
  let canOpenStudio = false;
  if (site.project_id) {
    const project = await db.from("projects").select("id").eq("id", site.project_id).eq("owner_id", userId).maybeSingle();
    checkDatabaseError(project.error); canOpenStudio = Boolean(project.data);
  }
  return { workspace, site, canOpenStudio };
}
export async function listOwnedProjects(db: SupabaseClient, userId: string) {
  const result = await db.from("projects").select("id,name").eq("owner_id", userId).order("updated_at", { ascending: false });
  checkDatabaseError(result.error);
  return z.array(z.object({ id: z.uuid(), name: z.string() })).parse(result.data ?? []);
}
export async function registerSite(db: SupabaseClient, userId: string, workspaceId: string, input: RegisterSiteInput) {
  await getWorkspace(db, userId, workspaceId, true);
  const args = { p_workspace_id: workspaceId, p_name: input.name, p_mode: input.mode, p_kind: input.mode === "native_portfolio" ? "portfolio" : input.mode === "native_business" ? "business" : input.kind, p_url: input.mode === "external" ? input.url : null, p_project_id: input.mode === "native_portfolio" ? input.projectId : null, p_status: input.status, p_ownership_confirmed: input.ownershipConfirmed };
  const result = input.mode === "native_business" ? await db.rpc("bz_register_business_site", { p_workspace_id: workspaceId, p_name: input.name, p_status: input.status, p_ownership_confirmed: input.ownershipConfirmed, p_document: newBusinessDocument(input.name, input.templateId) }) : await db.rpc("bz_register_site", args);
  if (result.error?.code === "PGRST202" && input.mode === "native_business") throw new WorkspaceError(503, "Business creation needs migration 023. Ask the platform operator to complete setup.");
  checkDatabaseError(result.error);
  return siteRecordSchema.parse(firstRecord(result.data));
}
export async function updateSite(db: SupabaseClient, userId: string, workspaceId: string, siteId: string, input: UpdateSiteInput) {
  await getWorkspace(db, userId, workspaceId, true); requireId(siteId);
  const result = await db.rpc("bz_update_site", { p_workspace_id: workspaceId, p_site_id: siteId, p_name: input.name, p_status: input.status, p_expected_version: input.expectedVersion, p_url: input.url ?? null, p_ownership_confirmed: input.ownershipConfirmed ?? false });
  checkDatabaseError(result.error);
  return siteRecordSchema.parse(firstRecord(result.data));
}

export async function deleteSite(db: SupabaseClient, userId: string, workspaceId: string, siteId: string, expectedVersion: number, confirmationName: string) {
 const { workspace } = await getSite(db, userId, workspaceId, siteId);
 if (workspace.role !== "owner") throw new WorkspaceError(403, "Only the workspace owner can delete a site record.");
 const result = await db.rpc("bz_delete_site", { p_workspace_id: workspaceId, p_site_id: siteId, p_expected_version: expectedVersion, p_confirmation_name: confirmationName });
 if (result.error?.code === "PGRST202") throw new WorkspaceError(503, "Site deletion needs migration 029. Ask the operator to complete setup.");
 if (result.error?.message === "bz_confirmation_mismatch") throw new WorkspaceError(400, "Type the current site name exactly to confirm deletion.");
 checkDatabaseError(result.error);
 return { deleted: true, siteId };
}
