import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { deleteSite, checkDatabaseError, getSite, getWorkspace, registerSite, updateSite, createWorkspace, renameWorkspace } from "./store";
const uid = "11111111-1111-4111-8111-111111111111", wid = "22222222-2222-4222-8222-222222222222", sid = "33333333-3333-4333-8333-333333333333", pid = "44444444-4444-4444-8444-444444444444";
const workspace = { id: wid, name: "Workspace", owner_id: uid, version: 1, created_at: "2026-10-01", updated_at: "2026-10-01" };
const site = { id: sid, workspace_id: wid, name: "Site", mode: "external", kind: "business", url: "https://doitwithai.tools/", project_id: null, status: "active", version: 1, created_by: uid, created_at: "2026-10-01", updated_at: "2026-10-01" };
function fixture(results: { data: unknown; error: { code?: string; message?: string } | null }[]) {
  const chains: { table: string; filters: [string, unknown][] }[] = [];
  const from = vi.fn((table: string) => { const result = results.shift(); if (!result) throw new Error("Unexpected database query"); const record = { table, filters: [] as [string, unknown][] }; chains.push(record); const query = { select: vi.fn(() => query), eq: vi.fn((key: string, value: unknown) => { record.filters.push([key, value]); return query; }), maybeSingle: vi.fn(async () => result) }; return query; });
  const rpc = vi.fn(); return { db: { from, rpc } as unknown as SupabaseClient, from, rpc, chains };
}
describe("workspace authorization and persistence adapter", () => {
  it("denies another tenant before touching their workspace or invoking a mutation", async () => {
    const f = fixture([{ data: null, error: null }]);
    await expect(registerSite(f.db, uid, wid, { mode: "native_business", name: "Business", ownershipConfirmed: true, status: "active" })).rejects.toMatchObject({ status: 404 });
    expect(f.rpc).not.toHaveBeenCalled(); expect(f.chains).toEqual([{ table: "bizoveya_memberships", filters: [["workspace_id", wid], ["user_id", uid]] }]);
  });
  it("denies viewer writes before site access", async () => {
    const f = fixture([{ data: { role: "viewer" }, error: null }]); await expect(updateSite(f.db, uid, wid, sid, { name: "Site", status: "paused", expectedVersion: 1 })).rejects.toMatchObject({ status: 403 }); expect(f.rpc).not.toHaveBeenCalled();
  });
  it("uses both workspace and site filters to block swapping site IDs", async () => {
    const f = fixture([{ data: { role: "owner" }, error: null }, { data: workspace, error: null }, { data: null, error: null }]);
    await expect(getSite(f.db, uid, wid, sid)).rejects.toMatchObject({ status: 404 }); expect(f.chains[2].filters).toEqual([["workspace_id", wid], ["id", sid]]);
  });
  it("keeps legacy project edit permission owner-scoped for collaborators", async () => {
    const f = fixture([{ data: { role: "editor" }, error: null }, { data: workspace, error: null }, { data: { ...site, mode: "native_portfolio", kind: "portfolio", url: null, project_id: pid }, error: null }, { data: null, error: null }]);
    expect((await getSite(f.db, uid, wid, sid)).canOpenStudio).toBe(false); expect(f.chains[3].filters).toEqual([["id", pid], ["owner_id", uid]]);
  });
  it("propagates an atomic registration result without fetching the external website", async () => {
    const f = fixture([{ data: { role: "owner" }, error: null }, { data: workspace, error: null }]); f.rpc.mockResolvedValue({ data: [site], error: null });
    const result = await registerSite(f.db, uid, wid, { mode: "external", name: "Site", kind: "business", url: "https://doitwithai.tools/", status: "active", ownershipConfirmed: true });
    expect(result.id).toBe(sid); expect(f.rpc).toHaveBeenCalledWith("bz_register_site", expect.objectContaining({ p_workspace_id: wid, p_project_id: null, p_ownership_confirmed: true }));
  });
  it("returns an actual atomic workspace creation result", async () => { const f = fixture([]); f.rpc.mockResolvedValue({ data: [workspace], error: null }); expect((await createWorkspace(f.db, "Workspace")).id).toBe(wid); expect(f.rpc).toHaveBeenCalledWith("bz_create_workspace", { p_name: "Workspace" }); });
  it("rejects editor renaming a workspace and malformed IDs", async () => {
    const f = fixture([{ data: { role: "editor" }, error: null }, { data: workspace, error: null }]); await expect(renameWorkspace(f.db, uid, wid, "Renamed", 1)).rejects.toMatchObject({ status: 403 }); expect(f.rpc).not.toHaveBeenCalled();
    await expect(getWorkspace(f.db, uid, "bad-id")).rejects.toMatchObject({ status: 404 });
  });
  it("reports stale version and duplicate linkage without leaking SQL errors", () => {
    expect(() => checkDatabaseError({ message: "bz_conflict" })).toThrow(/another session/);
    expect(() => checkDatabaseError({ code: "23505", message: "private SQL details" })).toThrow(/already registered/);
    expect(() => checkDatabaseError({ code: "42P01" })).toThrow(/migration 018/);
    expect(() => checkDatabaseError({ message: "secret backend trace" })).toThrow("Workspace storage is temporarily unavailable. Please retry.");
  });
});

describe("owner site deletion adapter", () => {
 it("blocks editors before destructive RPC", async () => {const f=fixture([{data:{role:"editor"},error:null},{data:workspace,error:null},{data:site,error:null}]);await expect(deleteSite(f.db,uid,wid,sid,1,"Site")).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();});
 it("sends owner version/name confirmation and reports missing setup", async () => {const f=fixture([{data:{role:"owner"},error:null},{data:workspace,error:null},{data:site,error:null}]);f.rpc.mockResolvedValue({data:null,error:null});expect(await deleteSite(f.db,uid,wid,sid,1,"Site")).toEqual({deleted:true,siteId:sid});expect(f.rpc).toHaveBeenCalledWith("bz_delete_site",{p_workspace_id:wid,p_site_id:sid,p_expected_version:1,p_confirmation_name:"Site"});});
});
