import { describe, expect, it } from "vitest";
import { canWriteWorkspace, normalizeSiteUrl, registerSiteSchema, updateSiteSchema, createWorkspaceSchema, siteCapabilityLabel } from "./workspaces";
const projectId = "11111111-1111-4111-8111-111111111111";
describe("workspace registration boundaries", () => {
  it("normalizes domains without adding an authorization capability", () => {
    expect(normalizeSiteUrl(" HTTPS://SufianMustafa.com ")).toBe("https://sufianmustafa.com/");
    expect(normalizeSiteUrl("https://doitwithai.tools/resources")).toBe("https://doitwithai.tools/resources");
  });
  it.each(["javascript:alert(1)", "ftp://site.com", "https://user:secret@site.com/", "https://site.com/?token=secret", "https://site.com/#secret", "http://localhost", "http://127.0.0.1", "http://[::1]", "https://intranet.local", "https://a.internal", "https://example.com:8080", "not a URL"])("rejects unsafe or credential-bearing URL %s", value => { expect(normalizeSiteUrl(value)).toBeNull(); });
  it("requires attestation and ignores no extra privilege fields", () => {
    expect(registerSiteSchema.safeParse({ mode: "external", kind: "business", url: "https://doitwithai.tools", name: "Tools", ownershipConfirmed: false }).success).toBe(false);
    expect(createWorkspaceSchema.safeParse({ name: "Business", owner_id: "attacker", role: "owner" }).success).toBe(false);
  });
  it("separates native portfolio links and planned business records", () => {
    expect(registerSiteSchema.parse({ mode: "native_portfolio", projectId, name: "Portfolio", ownershipConfirmed: true }).status).toBe("active");
    expect(registerSiteSchema.safeParse({ mode: "native_portfolio", name: "Portfolio", ownershipConfirmed: true }).success).toBe(false);
    expect(registerSiteSchema.safeParse({ mode: "native_business", projectId, name: "Business", ownershipConfirmed: true }).success).toBe(false);
    expect(siteCapabilityLabel({ mode: "native_business", project_id: null })).toContain("Planning record");
  });
  it("requires explicit reattestation and version for URL changes", () => {
    expect(updateSiteSchema.safeParse({ name: "Site", status: "paused", expectedVersion: 1, url: "https://lionxe.com/" }).success).toBe(false);
    expect(updateSiteSchema.safeParse({ name: "Site", status: "paused", expectedVersion: 0 }).success).toBe(false);
    expect(updateSiteSchema.safeParse({ name: "Site", status: "paused", expectedVersion: 2, mode: "external" }).success).toBe(false);
  });
  it("does not turn a viewer into a mutating role", () => { expect(canWriteWorkspace("viewer")).toBe(false); expect(canWriteWorkspace("editor")).toBe(true); expect(canWriteWorkspace("owner")).toBe(true); });
});
