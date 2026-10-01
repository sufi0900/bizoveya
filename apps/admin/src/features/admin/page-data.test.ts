import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ session: vi.fn() }));
vi.mock("./access", async importOriginal => { const original = await importOriginal<typeof import("./access")>(); return { ...original, adminSession: mocks.session }; });
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); }, notFound: () => { throw new Error("not-found"); } }));
import { AdminError } from "./access";
import { loadAdminPage } from "./page-data";
beforeEach(() => vi.clearAllMocks());
describe("admin page gates", () => {
  it("returns anonymous users through login with a safe known return path", async () => { mocks.session.mockRejectedValue(new AdminError(401,"SIGN_IN_REQUIRED","Sign in")); await expect(loadAdminPage("/admin/audit",vi.fn())).rejects.toThrow("redirect:/login?next=%2Fadmin%2Faudit"); });
  it("redirects low assurance to MFA without calling the loader", async () => { mocks.session.mockRejectedValue(new AdminError(403,"MFA_REQUIRED","MFA")); const loader = vi.fn(); await expect(loadAdminPage("/admin",loader)).rejects.toThrow("redirect:/admin/security"); expect(loader).not.toHaveBeenCalled(); });
  it("returns not-found for a revoked or normal account", async () => { mocks.session.mockRejectedValue(new AdminError(403,"ADMIN_REQUIRED","Denied")); await expect(loadAdminPage("/admin",vi.fn())).rejects.toThrow("not-found"); });
  it("does not leak backend exceptions into the page", async () => { mocks.session.mockRejectedValue(new Error("database secret")); const result = await loadAdminPage("/admin",vi.fn()); expect(result.ready).toBe(false); expect(JSON.stringify(result)).not.toContain("database secret"); });
  it("limits the AAL1 exception to caller-selected security setup", async () => { mocks.session.mockResolvedValue({ email: "operator", identity: { isAdmin: true, aal2: false } }); const result = await loadAdminPage("/admin/security",async s => s.identity,false); expect(mocks.session).toHaveBeenCalledWith(false); expect(result).toMatchObject({ ready: true, value: { aal2: false } }); });
});
