import { z } from "zod";

export const workspaceNameSchema = z.string().trim().min(1, "Enter a name.").max(80, "Use at most 80 characters.");
export const workspaceRoleSchema = z.enum(["owner", "editor", "viewer"]);
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;
export const canWriteWorkspace = (role: WorkspaceRole) => role === "owner" || role === "editor";

/** Registration only. Never fetch this URL or infer an integration grant from it. */
export function normalizeSiteUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    const host = url.hostname;
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) return null;
    if (url.port && !["80", "443"].includes(url.port)) return null;
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z0-9-]*[a-z0-9])?$/.test(host)) return null;
    if (/\.(?:localhost|local|internal|test|invalid|example)$/.test(host)) return null;
    return url.toString();
  } catch { return null; }
}
const sourceUrl = z.string().trim().max(2048).transform((value, ctx) => {
  const normalized = normalizeSiteUrl(value);
  if (!normalized) { ctx.addIssue({ code: "custom", message: "Use a public http(s) domain URL without credentials, query parameters or fragments." }); return z.NEVER; }
  return normalized;
});
const sharedSite = { name: workspaceNameSchema, ownershipConfirmed: z.literal(true, { error: "Confirm you are authorized to register this site." }), status: z.enum(["active", "paused"]).default("active") };
export const createWorkspaceSchema = z.object({ name: workspaceNameSchema }).strict();
export const renameWorkspaceSchema = z.object({ name: workspaceNameSchema, expectedVersion: z.number().int().positive() }).strict();
export const registerSiteSchema = z.discriminatedUnion("mode", [
  z.object({ ...sharedSite, mode: z.literal("external"), kind: z.enum(["business", "portfolio"]), url: sourceUrl }).strict(),
  z.object({ ...sharedSite, mode: z.literal("native_portfolio"), projectId: z.uuid() }).strict(),
  z.object({ ...sharedSite, mode: z.literal("native_business") }).strict(),
]);
export const updateSiteSchema = z.object({ name: workspaceNameSchema, status: z.enum(["active", "paused"]), expectedVersion: z.number().int().positive(), url: sourceUrl.optional(), ownershipConfirmed: z.literal(true).optional() }).strict().superRefine((value, ctx) => {
  if (value.url && !value.ownershipConfirmed) ctx.addIssue({ code: "custom", message: "Confirm authorization for the new URL.", path: ["ownershipConfirmed"] });
});
export const workspaceRecordSchema = z.object({ id: z.uuid(), name: z.string(), owner_id: z.uuid(), version: z.number().int(), created_at: z.string(), updated_at: z.string() });
export const siteRecordSchema = z.object({ id: z.uuid(), workspace_id: z.uuid(), name: z.string(), mode: z.enum(["external", "native_portfolio", "native_business"]), kind: z.enum(["business", "portfolio"]), url: z.string().refine(value => normalizeSiteUrl(value) !== null, "Invalid saved site URL").nullable(), project_id: z.uuid().nullable(), status: z.enum(["active", "paused"]), version: z.number().int(), created_by: z.uuid().nullable(), created_at: z.string(), updated_at: z.string() });
export type WorkspaceRecord = z.infer<typeof workspaceRecordSchema>;
export type WorkspaceAccess = WorkspaceRecord & { role: WorkspaceRole };
export type SiteRecord = z.infer<typeof siteRecordSchema>;
export type RegisterSiteInput = z.infer<typeof registerSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;
export function siteCapabilityLabel(site: Pick<SiteRecord, "mode" | "project_id">) {
  if (site.mode === "external") return "Registered · read-only";
  if (site.mode === "native_business") return "Planning record · builder coming later";
  return site.project_id ? "Owned portfolio · existing Studio" : "Portfolio source unavailable";
}
