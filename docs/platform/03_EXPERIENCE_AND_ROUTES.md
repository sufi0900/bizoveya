# Experience and route inventory

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Current package 1.5. Historical inventories below retain their original context; current source states are in document 20 and the package 1.4/1.5 sections.** Confirm collision, auth and deep links before adding paths. Existing file-system routes below were verified in the V27.12 archive; runtime behavior still needs manual testing.

| Existing path | Observed source purpose |
|---|---|
| `/`, `/start`, `/claim`, `/login`, `/projects` | Landing, guided setup, guest claim, auth, project list |
| `/studio/[projectId]`, `/projects/[projectId]/settings` | Native project editing/settings |
| `/p/[slug]`, `/p/[slug]/pages/[pageSlug]`, `/p/[slug]/blog`, `/p/[slug]/blog/[postSlug]`, `/p/[slug]/projects`, `/p/[slug]/projects/[projectSlug]` | Public portfolio and content |
| `/s/[token]/[[...path]]` | Share preview |
| `/api/projects/**`, `/api/visitor/**`, `/api/assemblyai/**`, `/api/connect/**`, `/api/content/**` | Current APIs; inspect route code before changing contracts |

**Proposed workspace path tree:** `/workspaces/[workspaceId]` overview, `/sites`, `/sites/new`, `/sites/[siteId]`, `/sites/[siteId]/content`, `/sites/[siteId]/integrations`, `/tasks/[taskId]`, `/meetings`, `/meetings/[meetingId]`, `/agents`, `/knowledge`, `/approvals`, `/settings`. Public business-site route and custom-domain resolution need an ADR; do not assume `/p/[slug]` serves business sites unchanged. Existing `/projects` and `/studio` should link from the new shell first, avoiding duplicate editors.

## Entry journeys

| Step | Create native | Connect existing |
|---|---|---|
| 1 | Choose business or portfolio; name site | Enter domain, declare ownership and current stack |
| 2 | Upload approved content/brand materials; choose template | Detect safe public metadata; optionally authorize GitHub, Sanity, Vercel individually |
| 3 | Preview draft, edit facts and design, confirm template | Show capability matrix: read-only, CMS draft, code PR, deploy preview, unsupported |
| 4 | Approve publish, check public/mobile/SEO | Run read-only inspection, then a reversible sample draft with approval |
| 5 | Add agents/workflows after site is registered | Preserve original site and sources; connect further channels later |

A URL-only site is allowed with read-only discovery; never claim a writable connection. For no website, a native site should be independently useful before AI employee setup. For existing site, avoid asking for credentials when a public URL is enough for discovery.

## Screen contracts

Owners see site context, current activity, pending approvals, cost and errors without needing an agent chat. Each task has event timeline, proposed artifact/diff, external receipt and interrupt controls. Meeting view shows agenda, one contribution per role, founder intervention, decision and linked action items. Separate employee conversations have explicit site scope and tool permissions. Every screen needs empty/loading/error/permission-denied state, keyboard interaction, responsive layout and visible progress. Agent response text never silently equals a published change. Confirm exact user roles (owner/editor/reviewer/viewer) in the access ADR.

## Actual Bizoveya document room (P01.0)

`/bizoveya/docs` is the public overview/search/progress view. `/bizoveya/docs/[slug]` renders the allowlisted current Markdown document with headings, tables, Mermaid diagrams, sidebar search and contents links. History files are excluded. The document room is an MVP slice inside the existing application, not the future customer workspace shell. Manual browser and deployment checks remain pending.

## Visual dashboard refinement (P01.1)

The same `/bizoveya/docs` route now presents a project intelligence dashboard: top metrics, Markdown-derived phase map, completed-work cards, chronological activity and searchable document library. Individual document routes retain complete source content and add a visual header, section reading map, and focused data view for phase, completed work, activity and package registers. A light/dark toggle is persisted locally with system preference as the initial default. No extra customer route or database is introduced.

## Protected administration and client configuration (planned)

[18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md) owns the complete proposed admin route inventory: `/admin`, `/admin/agents[/agentId]`, `/admin/models`, `/admin/credentials`, `/admin/evaluations`, `/admin/runs[/runId]`, `/admin/templates`, `/admin/workspaces[/workspaceId]`, `/admin/audit`, `/admin/settings`. Bracket shorthand denotes separate list/detail routes; final App Router names/collisions require audit. These are not created in package 1.2 and must require server authorization and appropriate platform role. The credential room is never a public docs subroute.

Client `/workspaces/[workspaceId]/agents` and settings views manage bounded brand/site/task preferences, not global agent tools or platform keys. Admin edits show active versus draft version, test results, activation scope and rollback; sensitive changes require reauthentication. Metrics show defined time windows and data freshness, with online presence only when actually implemented. All screens include permission-denied, revoked, validation-failed, test-failed, empty and degraded states.

Package 1.2 new public documentation paths are `/bizoveya/docs/17_DISCUSSION_AND_DECISION_RECORD`, `/bizoveya/docs/18_BACKEND_AND_ADMIN_CONTROL` and `/bizoveya/docs/decisions--ADR-0002-configurable-agents-and-admin-control`. These are automatically generated by the existing source registry on rebuild; they are planning material, not working admin screens.

## Package 1.3 transition and impact synchronization

Use [20_ROUTE_AND_TRANSITION_REGISTER.md](20_ROUTE_AND_TRANSITION_REGISTER.md) for the exact current file inventory and fully qualified future URLs. All earlier `/sites`, `/tasks`, `/meetings`, `/agents`, `/knowledge`, `/approvals` and `/settings` workspace shorthand is nested under `/workspaces/[workspaceId]`; it does not introduce global routes. Future public business routing remains undecided. Package 1.3 creates documentation pages only.

## Package 1.4 — first practical workspace implementation

Implemented in source: `/workspaces`, `/workspaces/[workspaceId]`, `/workspaces/[workspaceId]/sites`, `/workspaces/[workspaceId]/sites/new`, `/workspaces/[workspaceId]/sites/[siteId]`, `/workspaces/[workspaceId]/settings`. APIs: `/api/workspaces`, `/api/workspaces/[workspaceId]`, `/api/workspaces/[workspaceId]/sites`, `/api/workspaces/[workspaceId]/sites/[siteId]`; GET plus bounded POST/PATCH where defined in document 20. Live availability requires configured Supabase and migration 018. Other workspace/admin routes remain planned and are not empty published stubs.

Portfolio dashboard and `/start` add a Bizoveya entry link while preserving old flows. Workspace navigation includes the legacy portfolio dashboard and public document room, light/dark mode, honest future-capability notices, setup/empty/loading/error/not-found/read-only states. Signed-out users return through `/login?next=...`; malformed or inaccessible entity IDs reveal no private record. Workspace pages are noindex; robots excludes `/workspaces` and future `/admin`.

## Package 1.5 — protected admin navigation

Implemented pages: `/admin` (real aggregate overview), `/admin/security` (eligible operator MFA setup/challenge), `/admin/audit` (latest 100 role events). GET-only APIs: `/api/admin/summary` and `/api/admin/audit`. Signed-out users go to login, eligible AAL1 operators go to security, ordinary/revoked accounts receive unavailable/not-found pages or API 403, and missing configuration/storage shows a setup/error state. Guards run at each page loader and API, not just the layout. Admin navigation includes workspace/doc links, sign-out and dark/light mode. Planned management screens have explanatory labels without dead links or fake controls. Route IDs/states are canonical in document 20.

## Package1.6 — existing routes corrected and exercised

No new URL or API handler is added. `/bizoveya/docs` and detail pages now show the latest recorded package and actual document count. Existing public navigation/search/diagram/theme and unconfigured admin/workspace screens are exercised in a real local browser. All protected signed-in flows remain staging acceptance tasks; a setup screen does not verify a successful login or database write. Current inventory remains60 route files/110 stable route entries.

Admin setup/error notices link to the existing operator guide in the public document room, so the required current migration/recovery instructions are reachable from the screen. No new route is added.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
