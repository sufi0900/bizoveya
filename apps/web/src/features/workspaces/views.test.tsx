import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { SiteGrid, SiteMetrics, SetupNotice } from "./views";
import type { SiteRecord } from "@/domain/workspaces";
beforeAll(() => { (globalThis as { React?: typeof React }).React = React; });
const site: SiteRecord = { id: "33333333-3333-4333-8333-333333333333", workspace_id: "22222222-2222-4222-8222-222222222222", name: "Tools", mode: "external", kind: "business", url: "https://doitwithai.tools/", project_id: null, status: "active", version: 1, created_by: "11111111-1111-4111-8111-111111111111", created_at: "2026-10-01", updated_at: "2026-10-01" };
describe("workspace capability presentation", () => {
  it("shows external registration as read-only rather than claiming automation", () => { const html = renderToStaticMarkup(<SiteGrid workspaceId={site.workspace_id} sites={[site]} />); expect(html).toContain("Registered · read-only"); expect(html).toContain(`/workspaces/${site.workspace_id}/sites/${site.id}`); });
  it("does not offer a mutating empty-state link to a viewer", () => { const html = renderToStaticMarkup(<SiteGrid workspaceId={site.workspace_id} sites={[]} canAdd={false} />); expect(html).not.toContain("/sites/new"); expect(html).toContain("owner or editor"); });
  it("distinguishes a paused native business plan from an available builder", () => { const html = renderToStaticMarkup(<SiteGrid workspaceId={site.workspace_id} sites={[{ ...site, mode: "native_business", url: null, status: "paused" }]} />); expect(html).toContain("Planning record · builder coming later"); expect(html).toContain("paused"); });
  it("derives registry metrics from actual records without inventing usage or revenue", () => { const html = renderToStaticMarkup(<SiteMetrics sites={[site, { ...site, id: "44444444-4444-4444-8444-444444444444", status: "paused" }]} />); expect(html).toContain("Registered sites"); expect(html).toContain("<strong>2</strong>"); expect(html).toContain("<strong>1</strong>"); expect(html).not.toContain("Revenue"); });
  it("provides a setup guide when persistence is unavailable", () => { const html = renderToStaticMarkup(<SetupNotice message="Apply migration 018" />); expect(html).toContain("13_USER_MANUAL"); expect(html).toContain("Apply migration 018"); });
});
