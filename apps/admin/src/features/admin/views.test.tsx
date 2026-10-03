import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { AdminNotice, AdminOverview, AuditTimeline } from "./views";
beforeAll(() => { (globalThis as { React?: typeof React }).React = React; });
describe("admin presentation truthfulness", () => {
  it("uses actual counts and distinguishes them from online users", () => { const html = renderToStaticMarkup(<AdminOverview summary={{ workspaces: 3, sites: 7, workspaceMembers: 2, admins: 1 }} />); expect(html).toContain("<strong>7</strong>"); expect(html).toContain("Distinct users with a membership"); expect(html).toContain("not online users"); expect(html).toContain('href="/admin/credentials"'); expect(html).toContain("No model runs are enabled"); expect(html).toContain("Planned"); });
  it("escapes operator text and shows exact UTC timestamps", () => { const html = renderToStaticMarkup(<AuditTimeline events={[{ id: "11111111-1111-4111-8111-111111111111", subject_id: "22222222-2222-4222-8222-222222222222", action: "admin_revoked", occurred_at: "2026-10-01T02:00:00+05:00", operator_label: "<script>evil</script>", database_actor: "postgres", reason: "Recovery test" }]} />); expect(html).not.toContain("<script>"); expect(html).toContain("2026-09-30 21:00:00.000 UTC"); expect(html).toContain("Admin access revoked"); expect(html).toContain("Supabase Auth logs"); });
  it("shows an honest empty state", () => { expect(renderToStaticMarkup(<AuditTimeline events={[]} />)).toContain("No access changes recorded"); });
  it("provides a setup notice without fake metrics", () => { const html = renderToStaticMarkup(<AdminNotice message="Review migration 019" />); expect(html).toContain("Review migration 019"); expect(html).toContain("/login"); expect(html).not.toContain("Admin + MFA verified"); });
});
