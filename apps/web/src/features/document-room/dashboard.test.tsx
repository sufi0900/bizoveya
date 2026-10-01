import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("@/features/document-room/documents", () => ({
  getDocuments: async () => [{ slug: "00_INDEX", filename: "00_INDEX.md", title: "Index", category: "Product & experience", excerpt: "Living", searchText: "index" }],
  getDocument: async (slug: string) => ({ slug, filename: `${slug}.md`, title: slug, category: "Delivery & guidance", excerpt: "Living", content: slug === "PACKAGE_VERSIONS" ? "| 1.10 / P01.4 | `Bizoveya_1.10_Release-Review.zip` | Scope | Evidence |" : slug === "10_PHASES_AND_STATUS" ? "| [ ] P01 Workspace | Scope |" : "# Living document" }),
}));
import DocumentRoom from "@/app/bizoveya/docs/page";
import DocumentPage from "@/app/bizoveya/docs/[slug]/page";
beforeAll(() => { (globalThis as { React?: typeof React }).React = React; });
describe("release labels across document views", () => {
  it("renders inventory and recorded release without old hardcoded labels", async () => { const html = renderToStaticMarkup(await DocumentRoom()); expect(html).toContain("<strong>1.10</strong>"); expect(html).toContain("Release Review"); expect(html).toMatch(/1(?:<!-- -->)? living Markdown documents/); expect(html).not.toContain("24 living"); expect(html).not.toContain("P01.0 review pending"); });
  it("uses the same release on document detail pages", async () => { const html = renderToStaticMarkup(await DocumentPage({ params: Promise.resolve({ slug: "00_INDEX" }) })); expect(html).toMatch(/Package (?:<!-- -->)?1.10/); expect(html).not.toContain("Package 1.1 ·"); });
});
