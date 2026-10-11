# Experience and route inventory

## Current checkpoint — 1.20 / P04.3.3.1

Private campaign draft storage is implemented at `/workspaces/[workspaceId]/sites/[siteId]/campaigns`, with saved campaign URLs ending in `/[campaignId]`. This checkpoint stores manually authored brief/blog/Pinterest/LinkedIn text; it makes no model request and does not publish. Additive migration033 follows032. P04.3.3 remains in progress: bound-agent orchestration, generation reservations, durable execution/usage and output review are the next work on the SAME `phase/p04-3-3-durable-drafts` branch. See [40 Campaign drafts](40_CAMPAIGN_DRAFTS_AND_TESTING.md).

Founder screenshots on2026-10-03 confirm Gemini connectivity and MT107 settlement:20 input/7 output tokens, pricingv1, held/count amounts$0, run `e5be1ac3-5620-40e0-9498-97febb96fb15`. MT103 saved policy/history is evidenced; refresh persistence is not separately reported. Other unevidenced manual gates stay pending. Pakistan Token Factory onboarding is blocked; Builder application is under review. Nebius support email was drafted for the founder, not sent by the assistant. No main merge, production deployment, hosted SQL or provider call performed.


## Historical contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


## Current contract — package1.17 / P04.0

P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

Live tests default off. Explicit operator setup requires the selected private provider key plus an admin-only SUPABASE_SERVICE_ROLE_KEY for server-attested result recording, then BIZOVEYA_ENABLE_MODEL_TESTS=true and per-request pricing/charge acknowledgement. No secret-entry form exists. Named current admin+AAL2 is required; client roles cannot mark results passed. Additive030 enforces one running test and five attempts per UTC day platform-wide, durable request IDs, expiry/unknown states and version-sensitive evidence. Failures/unknown attempts still consume the attempt allowance and may be billed. Existing dailyBudgetCents remains planning metadata; monetary enforcement precedes customer runtime.

Read36_MODEL_CONNECTIVITY_AND_TESTING.md for exact setup, supported evidence and MT087–094. All1.16 tests and earlier unevidenced founder gates stay pending; the founder is currently testing and has supplied no new pass results. Preserve001–029 and historical files. One cumulative ZIP/repository and the same two Vercel roots. No hosted SQL/deploy/provider request was performed by the assistant. Next implementation dependency: reviewed exact-model evidence, agent/profile binding, enforced monetary limits and durable draft runs, then visual output composition. The35 draft-only pilot and34 Studio/removal scope remain in force; publishing remains deferred.

Earlier release contracts below are historical and superseded where they conflict with this current contract.


## Historical contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Historical contract — package1.15 / P04.2.1

Admin-only /admin/models and /admin/credentials; /api/admin/models GET/POST; /api/admin/models/[id]/history GET; /api/admin/models/events GET; /api/admin/credentials GET/POST; /api/admin/credentials/presence POST. Public app exposes none of these or links to admin. Existing customer agent readiness unchanged.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Admin-only routes: /admin/agents, /api/admin/agents (GET/POST), /api/admin/agents/[id]/history (GET). Main customer routes: site /agents and /api/.../agents (GET/POST) plus /preview (POST). Main /admin still404, no link/redirect to admin. Site record and knowledge room link to readiness.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

New private UI /workspaces/:workspaceId/sites/:siteId/knowledge. New private APIs /api/workspaces/:workspaceId/sites/:siteId/knowledge (GET/POST), /approved (GET), /:sourceId/history (GET). Reach it from site record or native Business Studio. All async params, membership validation and no-store responses remain required.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

New catalog-driven URLs `/templates/wellness-studio`, `/templates/education-academy`, `/templates/product-launch`. Existing three URLs retain metadata and use one page composition. Unknown template slug404. All six creation choices and Studio presets use the same IDs. Existing visitor `/sites/[siteId]` remains stable. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Public visitor route: `/sites/[siteId]`, dynamic published business, unknown/unpublished ID404. Protected GET/POST `/api/workspaces/[workspaceId]/sites/[siteId]/publication` returns member state / applies explicit action. Existing Studio gains publication status, confirmation, link, publish/republish and unpublish. Source locations are under apps/web/src; admin routes remain separate. UUID URLs deliberately avoid reserving competing customer business-name slugs; later friendly aliases require redirect/uniqueness policy. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

`/workspaces` now prioritizes existing workspace cards. `/workspaces/new` is a separate authenticated create page linked from the sidebar. Opening a workspace card always opens its overview regardless of a retained `journey` query; an explicit secondary onboarding action may open Add a site. `/sites/new` activates Add a site only. Successful new business creation replaces the form with `/workspaces/{workspaceId}/sites/{siteId}/editor`. Public template intent is carried separately through get-started, login, workspace and creation. New users still see first-workspace creation.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

| Public route | Current experience |
|---|---|
| `/templates?category=business` | Three preset cards from the shared catalogue |
| `/templates/service-studio` | Professional Practice interactive fictional demo; legacy slug preserved |
| `/templates/local-services` | Local Services interactive fictional demo |
| `/templates/creative-business` | Creative Business interactive fictional demo |
| `/workspaces/[workspaceId]/sites/[siteId]/editor` | Same modular Studio for native business sites; workspace permissions |

Outline → live canvas → inspector on wide screens; stacked outline → inspector → canvas on phone screens, so editing does not require scrolling past the full preview. Arrow buttons provide keyboard-accessible reorder. Creation still enters through `/get-started?journey=new`; choose the preferred recipe in the saved site's editor. A demo does not transfer its edited data automatically to a workspace. No public admin route/link added.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

New public routes: `/get-started?journey=new|existing`, `/templates?category=business|portfolio`, `/templates/service-studio`, `/portfolio`. Root `/` is the Bizoveya homepage. New private route `/workspaces/[workspaceId]/sites/[siteId]/editor`; GET/PUT business API at `/api/workspaces/[workspaceId]/sites/[siteId]/business`. New/existing journey is carried through workspace selection and site-registration defaults. No public admin navigation or redirect. See document25 for exact user steps.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

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
