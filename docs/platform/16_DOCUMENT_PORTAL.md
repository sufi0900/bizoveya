# In-app Bizoveya document room

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Implementation status: P01.0 and P01.1 source implemented and production build verified; browser interaction/deployment pending.** Owner direction supersedes the earlier ChatGPT Sites projection plan: the document room belongs **inside the existing Bizoveya Next.js application** at `/bizoveya/docs`. No separate Sites-hosted project or PDF deck is part of this delivery. All new Markdown under `docs/platform/` and its `decisions/` folder is displayed; `docs/history/` is intentionally excluded.

## What the code does

- The landing page lists every current platform document as a card, categories and full-text search. Summary cards show grand-phase status, completed-work record count and recent activity, derived from the Markdown files. Search results include content terms, not just filenames.
- A dedicated route `/bizoveya/docs/[slug]` renders each document with formatted headings, tables, lists, links, code blocks and Mermaid diagrams; navigation includes document search and an on-page table of contents. Invalid slugs return 404 through an allowlisted document registry.
- Source files are read by server-only code from `docs/platform/` during Next.js static generation; each generated page is refreshed on a new build/deployment that includes updated Markdown. Client search receives the current document text. There is no independent CMS copy.
- The room is publicly reachable without login by explicit owner direction. Route metadata requests no search indexing, but no-index **is not access control**. Before each public deployment, review all platform Markdown for secrets, private client material and internal details that should not be published.
- The room has responsive navigation, semantic headings and print styles. PDF export is not yet implemented; browser print can be used as a draft only after manual page-by-page inspection.

## Update contract

Every code/document package changes its canonical Markdown, then rebuilds the app and checks the overview/document pages. Add or remove a Markdown file and it will be picked up by the registry without a hand-maintained menu. Keep `00_INDEX.md`, `COMPLETED_WORK.md`, `ACTIVITY_LOG.md`, `PACKAGE_VERSIONS.md` and the phase ledger synchronized. If a document becomes private, remove it from this public build or introduce an actual authenticated boundary before deployment; hiding a card alone is insufficient. When a new site version is deployed, record URL, commit/package hash, build status, visual checks and date in the activity log.

## Verification and limits

Package 1.0 baseline: `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test` (178 tests) and a clean `pnpm build` were run; repeat after any dependency or source change. A browser test is pending because the available browser CLI was absent and local server access from a separate shell failed in this environment. Static generated HTML and route inventory should be inspected; owner should verify search, document navigation and diagrams on the deployed preview. The root Voxfolio UI remains inherited. No public URL is claimed until a deployment actually occurs.

## P01.1 visual projection

The overview is a dashboard with metrics, a labeled grand-phase map, completed-work evidence cards, recent-event timeline and searchable library. The phase, completed and event widgets parse the canonical `10_PHASES_AND_STATUS.md`, `COMPLETED_WORK.md` and `ACTIVITY_LOG.md`; they are projections, not stored duplicate facts. Matching detail pages show a visual spotlight plus the full source text and reading map. The package lineage page receives a version sequence visual. The theme toggle uses local browser storage, honors system dark preference initially and updates Mermaid diagrams. Existing Markdown content remains inspectable in every detail page. P01.1 typecheck, 178 tests, production build and 24/24 static output checks passed. Browser, mobile and owner visual acceptance remain before a checked status.

## Package 1.2 canonical-source synchronization

The 27 current Markdown files now include `17_DISCUSSION_AND_DECISION_RECORD.md`, `18_BACKEND_AND_ADMIN_CONTROL.md` and `decisions/ADR-0002-configurable-agents-and-admin-control.md`. Existing room code automatically discovers these through `getDocuments()` and generates their slugs, category/search entries, complete text, reading-map headings, tables and Mermaid diagrams. Updated activity/completed/phase/package files feed existing dashboard projections. No duplicated HTML document content or manual navigation copy is maintained.

This is a documentation/source update, not a visual-component redesign or production admin implementation. The public room contains sanitized plans/discussion only; the real admin and credentials room must be separate protected routes. Updated source must be rebuilt/redeployed; do not claim live synchronization before deployment. Check every current source/page/link and exclude historical documents. Manual theme/search/mobile/diagram rendering remains pending until browser acceptance.

## Package 1.3 transition and impact synchronization

Package 1.3 adds documents 19/20 and ADR-0003 to the existing dynamic registry. The room reads all 30 current Markdown sources; no duplicate manual visual copy or new UI code is needed. Tables/diagrams and the existing work/activity/version visualizations reflect updated records on rebuild. This delivery does not redesign the dashboard or prove browser/deployed rendering.

## Package 1.4 — first practical workspace implementation

All 30 current Markdown documents remain the canonical source and are rebuilt through the existing `/bizoveya/docs` registry. No history is projected and no duplicate visual text is hand-maintained. Updated CW-012, BZ-020/BZ-021, route states, manual and package lineage must appear in generated pages. Tables must keep their rows contiguous: an isolated table row can be skipped by the current renderer. Browser interactions remain pending. Package 1.4 changes product routes and Markdown content, not the document-room renderer.

## Package 1.5 — updated visual source

The room automatically projects 31 current Markdown files, including the new admin setup/recovery runbook 21. Existing dashboard widgets consume the updated phase/completed-work/activity/package records; there is no second manually maintained document copy. Admin role events at `/admin/audit` are private operational DB records, distinct from the public development activity log. Rebuild/redeploy is needed for updated static documents to appear. History archives remain excluded. No secret or live account details are placed in public Markdown.

## Package1.6 — prevent release-label drift

A browser inspection revealed historical1.1/24 labels had survived prior Markdown updates. Overview and detail metadata now derive the package from `PACKAGE_VERSIONS.md` through the shared numeric parser; sidebar/library counters share `getDocuments()`. Prose about a future ZIP does not become the current release. Generic phase-summary text refers readers to the live phase ledger rather than repeating an old P01.0 status. Regression tests check both routes.

The32 current Markdown sources include new guide22 and remain the single source for the visual room. The existing docs/dashboard design is retained; no external Sites copy/PDF is created. Browser screenshots and machine-readable test evidence stay outside the canonical platform-document inventory under delivery evidence. Rebuild/redeploy is still required for source changes to appear on the deployed site.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
