import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sampleBusiness } from "@/domain/business";
const { getSite } = vi.hoisted(() => ({ getSite: vi.fn() }));
vi.mock("@/features/workspaces/store", async importOriginal => ({ ...await importOriginal<object>(), getSite }));
import { loadBusinessDraft, saveBusinessDraft } from "./store";
const siteId = "22222222-2222-4222-8222-222222222222";
const context = { workspace: { role: "owner" }, site: { id: siteId, name: "Acme", mode: "native_business" } };
function mockDb(data: unknown = null, error: unknown = null) { const chain = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), maybeSingle: vi.fn().mockResolvedValue({ data, error }) }; return { from: vi.fn(() => chain), rpc: vi.fn().mockResolvedValue({ data, error }) }; }
describe("business draft persistence", () => {
  beforeEach(() => { vi.clearAllMocks(); getSite.mockResolvedValue(context); });
  it("initializes an unsaved native business draft only after scoped authorization", async () => { const db = mockDb(); const result = await loadBusinessDraft(db as unknown as SupabaseClient, "user", "workspace", siteId); expect(result.version).toBe(0); expect(result.document.name).toBe("Acme"); expect(getSite).toHaveBeenCalledWith(db, "user", "workspace", siteId); });
  it("rejects external sites before reading business storage", async () => { getSite.mockResolvedValue({ ...context, site: { ...context.site, mode: "external" } }); const db = mockDb(); await expect(loadBusinessDraft(db as unknown as SupabaseClient,"u","w",siteId)).rejects.toThrow(/native business/); expect(db.from).not.toHaveBeenCalled(); });
  it("gives a precise migration message", async () => { const db = mockDb(null, { code: "42P01" }); await expect(loadBusinessDraft(db as unknown as SupabaseClient,"u","w",siteId)).rejects.toThrow(/021/); });
  it("blocks viewers before RPC mutation", async () => { getSite.mockResolvedValue({ ...context, workspace: { role: "viewer" } }); const db = mockDb(); await expect(saveBusinessDraft(db as unknown as SupabaseClient,"u","w",siteId,sampleBusiness,0)).rejects.toThrow(/read-only/); expect(db.rpc).not.toHaveBeenCalled(); });
  it("passes the concurrency version and scoped identifiers to the DB", async () => { const db = mockDb([{ site_id: siteId, document: sampleBusiness, version: 2, updated_at: "2026-10-01T18:00:00Z" }]); const result = await saveBusinessDraft(db as unknown as SupabaseClient,"u","w",siteId,sampleBusiness,1); expect(result.version).toBe(2); expect(db.rpc).toHaveBeenCalledWith("bz_save_business_draft",expect.objectContaining({ p_site_id: siteId, p_workspace_id: "w", p_expected_version: 1 })); });
  it("returns a conflict without replacing the draft", async () => { const db = mockDb(null,{ message: "bz_conflict" }); await expect(saveBusinessDraft(db as unknown as SupabaseClient,"u","w",siteId,sampleBusiness,1)).rejects.toThrow(/another session/); });
});
