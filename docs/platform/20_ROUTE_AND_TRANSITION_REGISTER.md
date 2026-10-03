# Route inventory and Voxfolio-to-Bizoveya transition

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

New separate-admin pages/models/credentials and corresponding model registry/history/events + credential mutation/presence APIs. No main-domain admin routes/links/redirects. Public workspace/site APIs unchanged.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

New admin-host /admin/agents and /api/admin/agents[/id/history]; main scoped /workspaces/[workspaceId]/sites/[siteId]/agents and /api/workspaces/[workspaceId]/sites/[siteId]/agents[/preview]. Admin routes are not present on public app, and no customer navigation links to admin host. Existing portfolio routes retained.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Add knowledge UI plus collection/approved/history private API routes under exact workspace/site scope. Existing business, template, visitor and portfolio URLs remain unchanged. Admin routes remain404 on public host; no public knowledge reader is added.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

New template routes belong only to apps/web; shared helper owns page composition. No new admin URL or external deployment. Visitor URLs and site UUIDs remain unchanged. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

New bounded implementation P02.3.1 follows native draft builder; deployment does not accept prior fixes. Shared024 must follow023, then public app rebuild; admin implementation unchanged. No new blank route farm. See28 for routes/files/manual steps. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.10 / P02.2.Fix-1

New implemented public-app route `/workspaces/new` (authenticated extra workspace creation). Existing `/workspaces` cards always target overview. Site new/editor/detail URLs stay stable. `/sites/new` gets its own sidebar selection. New business cards/creation target editor; record management is secondary. Template demo/get-started/workspace/new-site queries can carry `template`, with IDs validated against presetIds. Main-domain `/admin` and admin APIs remain404; no public link to separated administration.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

| Route / source | P02.2 state |
|---|---|
| `/templates/local-services` → apps/web/src/app/templates/local-services/page.tsx | Added; public fictional demo |
| `/templates/creative-business` → apps/web/src/app/templates/creative-business/page.tsx | Added; public fictional demo |
| `/templates/service-studio` | Preserved slug, upgraded Professional Practice demo |
| `/templates` | Shared catalogue now three business presets plus portfolio |
| Scoped business editor/API | Same paths; modular v2 contract/read upgrade;64KiB business request |
| `/portfolio`, portfolio APIs/publications | Preserved inherited functional source |
| Public `/admin` and `/api/admin/*` | Still404; separate admin functional source preserved |

Voxfolio-to-Bizoveya transition continues without rebuilding from scratch. SQL001–021 and history remain in place; additive022 introduces no route, table or publication rewrite.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

| ID | Exact main-host path | Methods/type | State/source |
|---|---|---|---|
| R-061 | `/portfolio` | Page | Inherited root Studio moved; apps/web/src/app/portfolio/page.tsx |
| R-062 | `/get-started` | Page; journey=new or existing | Guided entry |
| R-063 | `/templates` | Page; category filters | Shared catalog |
| R-064 | `/templates/service-studio` | Page | Fictional interactive demo |
| R-065 | `/workspaces/[workspaceId]/sites/[siteId]/editor` | Page | Scoped private business editor |
| R-066 | `/api/workspaces/[workspaceId]/sites/[siteId]/business` | GET, PUT | Session/role/schema/version checked |

R-001–R-060 IDs stay stable. Existing root row now means marketing homepage rather than portfolio Studio. The previous root workflow remains atR-061; start/projects/studio/published portfolio URLs stay intact. Business publication and domain routes remain planned; do not create misleading empty publish pages. Admin-host route ownership from ADR-0004 remains unchanged.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Package 1.6. Canonical route register; living draft.** Six workspace pages/four workspace APIs and three admin pages/two admin APIs are implemented in source. Live acceptance requires verified Supabase setup, migrations 018–019 and the relevant role/MFA gates. Other registered routes remain planned. Stable IDs remain when paths change; append redirects/retirement and affected callers to the change record. A file observed in the checkout proves source presence only, not deployment or successful live behavior.

## Status and URL rules

- **Inherited/source-present:** observed Voxfolio source; preserve and regression-test.
- **Implemented/source-present:** document-room code exists; deployment/browser acceptance remains pending.
- **Scaffolded:** real shell with explicit unavailable/coming-later behavior, permission checks and no fake mutation success; none of the new workspace/admin routes has this state yet.
- **Planned:** contract/URL reserved in this register, no page or handler exists. **Deferred/retired:** retained with reason and replacement, never silently removed from the record.

The workspace selector uses `/workspaces`; all workspace-scoped client paths below are fully qualified beneath `/workspaces/[workspaceId]`. `/sites` shorthand in earlier documents means this nested route, not a new global URL. Platform `/admin` is a different authorization boundary; client workspace-owner role does not confer platform admin. Backend URLs are API contracts, not UI pages. External integrations can also require callbacks/webhooks or worker jobs without user-facing slugs; provider-specific callback paths are deferred until the connector contract and signature checks are defined.

## Observed source routes

Current host ownership: R-056–R-060 belong only to the admin host; all preceding observed rows belong to the main host. All planned A-* and API-* paths under /admin or /api/admin also belong only to admin. Filesystem apps/web and apps/admin are never URL prefixes. Admin has additional / and /login entry pages (apps/admin/src/app/page.tsx and apps/admin/src/app/login/page.tsx), separate from the public / and /login. Public admin paths return404 and never redirect.

| ID | Exact path | Type / observed methods | State | Source |
|---|---|---|---|---|
| R-001 | `/api/assemblyai/onboarding-token` | POST | Inherited/source-present | `apps/web/src/app/api/assemblyai/onboarding-token/route.ts` |
| R-002 | `/api/assemblyai/session/[sessionId]` | DELETE | Inherited/source-present | `apps/web/src/app/api/assemblyai/session/[sessionId]/route.ts` |
| R-003 | `/api/assemblyai/token` | GET | Inherited/source-present | `apps/web/src/app/api/assemblyai/token/route.ts` |
| R-004 | `/api/assistant/chat` | POST | Inherited/source-present | `apps/web/src/app/api/assistant/chat/route.ts` |
| R-005 | `/api/connect/command` | POST | Inherited/source-present | `apps/web/src/app/api/connect/command/route.ts` |
| R-006 | `/api/connect/openapi` | GET | Inherited/source-present | `apps/web/src/app/api/connect/openapi/route.ts` |
| R-007 | `/api/connect/portfolio` | GET | Inherited/source-present | `apps/web/src/app/api/connect/portfolio/route.ts` |
| R-008 | `/api/content/blog-draft` | POST | Inherited/source-present | `apps/web/src/app/api/content/blog-draft/route.ts` |
| R-009 | `/api/content/polish` | POST | Inherited/source-present | `apps/web/src/app/api/content/polish/route.ts` |
| R-010 | `/api/cv/extract` | POST | Inherited/source-present | `apps/web/src/app/api/cv/extract/route.ts` |
| R-011 | `/api/projects/[projectId]/agent-health` | GET,PUT,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/agent-health/route.ts` |
| R-012 | `/api/projects/[projectId]/connections` | GET,POST,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/connections/route.ts` |
| R-013 | `/api/projects/[projectId]/headshot` | POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/headshot/route.ts` |
| R-014 | `/api/projects/[projectId]/media` | POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/media/route.ts` |
| R-015 | `/api/projects/[projectId]/memory` | GET,POST,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/memory/route.ts` |
| R-016 | `/api/projects/[projectId]/opportunity-plan` | POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/opportunity-plan/route.ts` |
| R-017 | `/api/projects/[projectId]/publish` | POST,DELETE,GET | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/publish/route.ts` |
| R-018 | `/api/projects/[projectId]/revisions` | GET,POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/revisions/route.ts` |
| R-019 | `/api/projects/[projectId]` | GET,PATCH,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/route.ts` |
| R-020 | `/api/projects/[projectId]/shares/[shareId]/feedback` | POST,GET | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/shares/[shareId]/feedback/route.ts` |
| R-021 | `/api/projects/[projectId]/shares` | GET,POST,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/shares/route.ts` |
| R-022 | `/api/projects/[projectId]/source-review` | GET,POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/source-review/route.ts` |
| R-023 | `/api/projects/[projectId]/variants` | POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/variants/route.ts` |
| R-024 | `/api/projects/[projectId]/visitor-documents` | GET,POST,DELETE | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/visitor-documents/route.ts` |
| R-025 | `/api/projects/[projectId]/visitor-extract` | POST | Inherited/source-present | `apps/web/src/app/api/projects/[projectId]/visitor-extract/route.ts` |
| R-026 | `/api/projects` | GET,POST | Inherited/source-present | `apps/web/src/app/api/projects/route.ts` |
| R-027 | `/api/shares/[token]/feedback` | POST | Inherited/source-present | `apps/web/src/app/api/shares/[token]/feedback/route.ts` |
| R-028 | `/api/visitor/[slug]/ask` | POST | Inherited/source-present | `apps/web/src/app/api/visitor/[slug]/ask/route.ts` |
| R-029 | `/api/visitor/[slug]/token` | POST | Inherited/source-present | `apps/web/src/app/api/visitor/[slug]/token/route.ts` |
| R-030 | `/bizoveya/docs/[slug]` | page | Implemented/source-present | `apps/web/src/app/bizoveya/docs/[slug]/page.tsx` |
| R-031 | `/bizoveya/docs` | page | Implemented/source-present | `apps/web/src/app/bizoveya/docs/page.tsx` |
| R-032 | `/claim` | page | Inherited/source-present | `apps/web/src/app/claim/page.tsx` |
| R-033 | `/login` | page | Inherited/source-present | `apps/web/src/app/login/page.tsx` |
| R-034 | `/p/[slug]/blog/[postSlug]` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/blog/[postSlug]/page.tsx` |
| R-035 | `/p/[slug]/blog` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/blog/page.tsx` |
| R-036 | `/p/[slug]` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/page.tsx` |
| R-037 | `/p/[slug]/pages/[pageSlug]` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/pages/[pageSlug]/page.tsx` |
| R-038 | `/p/[slug]/projects/[projectSlug]` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/projects/[projectSlug]/page.tsx` |
| R-039 | `/p/[slug]/projects` | page | Inherited/source-present | `apps/web/src/app/p/[slug]/projects/page.tsx` |
| R-040 | `/` | page | Inherited/source-present | `apps/web/src/app/page.tsx` |
| R-041 | `/projects/[projectId]/settings` | page | Inherited/source-present | `apps/web/src/app/projects/[projectId]/settings/page.tsx` |
| R-042 | `/projects` | page | Inherited/source-present | `apps/web/src/app/projects/page.tsx` |
| R-043 | `/s/[token]/[[...path]]` | page | Inherited/source-present | `apps/web/src/app/s/[token]/[[...path]]/page.tsx` |
| R-044 | `/start` | page | Inherited/source-present | `apps/web/src/app/start/page.tsx` |
| R-045 | `/studio/[projectId]` | page | Inherited/source-present | `apps/web/src/app/studio/[projectId]/page.tsx` |
| R-046 | `/api/workspaces` | GET,POST | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/api/workspaces/route.ts` |
| R-047 | `/api/workspaces/[workspaceId]` | GET,PATCH | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/api/workspaces/[workspaceId]/route.ts` |
| R-048 | `/api/workspaces/[workspaceId]/sites` | GET,POST | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/api/workspaces/[workspaceId]/sites/route.ts` |
| R-049 | `/api/workspaces/[workspaceId]/sites/[siteId]` | GET,PATCH | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/api/workspaces/[workspaceId]/sites/[siteId]/route.ts` |
| R-050 | `/workspaces` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/page.tsx` |
| R-051 | `/workspaces/[workspaceId]` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/[workspaceId]/page.tsx` |
| R-052 | `/workspaces/[workspaceId]/settings` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/[workspaceId]/settings/page.tsx` |
| R-053 | `/workspaces/[workspaceId]/sites` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/[workspaceId]/sites/page.tsx` |
| R-054 | `/workspaces/[workspaceId]/sites/[siteId]` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/[workspaceId]/sites/[siteId]/page.tsx` |
| R-055 | `/workspaces/[workspaceId]/sites/new` | page | Implemented/source-present; migration/live acceptance pending | `apps/web/src/app/workspaces/[workspaceId]/sites/new/page.tsx` |
| R-056 | `/admin` | page | Implemented/source-present; live acceptance pending | `apps/admin/src/app/admin/page.tsx` |
| R-057 | `/admin/security` | page | Implemented/source-present; live acceptance pending | `apps/admin/src/app/admin/security/page.tsx` |
| R-058 | `/admin/audit` | page | Implemented/source-present; live acceptance pending | `apps/admin/src/app/admin/audit/page.tsx` |
| R-059 | `/api/admin/summary` | GET | Implemented/source-present; live acceptance pending | `apps/admin/src/app/api/admin/summary/route.ts` |
| R-060 | `/api/admin/audit` | GET | Implemented/source-present; live acceptance pending | `apps/admin/src/app/api/admin/audit/route.ts` |


## Workspace page states

| ID | Exact path | Purpose | Phase | State / access |
|---|---|---|---|---|
| W-001 | `/workspaces/[workspaceId]` | Overview | P01 | Implemented/source-present; migration/live acceptance pending; authenticated membership, site grant where relevant |
| W-002 | `/workspaces/[workspaceId]/sites` | Site list | P01 | Implemented/source-present; migration/live acceptance pending; authenticated membership, site grant where relevant |
| W-003 | `/workspaces/[workspaceId]/sites/new` | Create/connect entry | P01 | Implemented/source-present; migration/live acceptance pending; authenticated membership, site grant where relevant |
| W-004 | `/workspaces/[workspaceId]/sites/[siteId]` | Site overview | P01 | Implemented/source-present; migration/live acceptance pending; authenticated membership, site grant where relevant |
| W-005 | `/workspaces/[workspaceId]/sites/[siteId]/content` | Draft content | P02/P05 | Planned; authenticated membership, site grant where relevant |
| W-006 | `/workspaces/[workspaceId]/sites/[siteId]/integrations` | Scoped grants | P05/P08 | Planned; authenticated membership, site grant where relevant |
| W-007 | `/workspaces/[workspaceId]/tasks` | Task list | P04 | Planned; authenticated membership, site grant where relevant |
| W-008 | `/workspaces/[workspaceId]/tasks/[taskId]` | Task artifacts and controls | P04 | Planned; authenticated membership, site grant where relevant |
| W-009 | `/workspaces/[workspaceId]/meetings` | Meeting list | P06 | Planned; authenticated membership, site grant where relevant |
| W-010 | `/workspaces/[workspaceId]/meetings/[meetingId]` | Meeting and interventions | P06 | Planned; authenticated membership, site grant where relevant |
| W-011 | `/workspaces/[workspaceId]/agents` | Client preferences | P04 | Planned; authenticated membership, site grant where relevant |
| W-012 | `/workspaces/[workspaceId]/knowledge` | Approved site facts | P03 | Planned; authenticated membership, site grant where relevant |
| W-013 | `/workspaces/[workspaceId]/approvals` | Pending actions | P05/P07 | Planned; authenticated membership, site grant where relevant |
| W-014 | `/workspaces/[workspaceId]/settings` | Workspace settings | P01/P11 | Implemented/source-present; migration/live acceptance pending; authenticated membership, site grant where relevant |
| W-015 | `/workspaces` | Workspace selector/list | P01 | Implemented/source-present; migration/live acceptance pending; authenticated user, only their memberships |

## Platform administration — source and planned

| ID | Exact path | Purpose | Phase | State / access |
|---|---|---|---|---|
| A-001 | `/admin` | Overview | P01/P11 | Implemented/source-present; DB grant+AAL2, live acceptance pending |
| A-002 | `/admin/agents` | Agent catalog | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-003 | `/admin/agents/[agentId]` | Draft/test/activate config | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-004 | `/admin/models` | Model profiles | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-005 | `/admin/credentials` | Server credential references | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-006 | `/admin/evaluations` | Saved QA cases | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-007 | `/admin/runs` | Run list | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-008 | `/admin/runs/[runId]` | Run trace and controls | P04 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-009 | `/admin/templates` | Supported template versions | P02 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-010 | `/admin/workspaces` | Client registry | P11 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-011 | `/admin/workspaces/[workspaceId]` | Audited support access | P11 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-012 | `/admin/audit` | Redacted audit | P01/P04 | Implemented/source-present; DB grant+AAL2, live acceptance pending |
| A-013 | `/admin/settings` | Platform policy | P11 | Planned; server-verified platform role, MFA/reauthentication as applicable |
| A-014 | `/admin/security` | TOTP setup/challenge | P01.4 | Implemented/source-present; DB-approved admin at AAL1, live acceptance pending |

## API contract families — implemented and planned

Methods for API-001–API-003, API-019–API-021 are installed exports; other rows are **proposals**, not installed exports. Payload/response schemas, allowed transitions, pagination and method-specific permissions must be finalized before each handler is implemented. Collection POST operations with different intents require explicit validated commands or split endpoints. Credential metadata GET never returns stored secret values. Workspace API checks both membership and entity scope; admin API checks platform role for each action.

| ID | Exact proposed path | Proposed methods | Contract | Phase | Capability | State |
|---|---|---|---|---|---|---|
| API-001 | `/api/workspaces` | GET, POST | Workspace membership/list/create | P01 | C-IDENTITY/C-SITES | Implemented/source-present; migration/live acceptance pending |
| API-002 | `/api/workspaces/[workspaceId]/sites` | GET, POST | Site list/register | P01 | C-SITES | Implemented/source-present; migration/live acceptance pending |
| API-003 | `/api/workspaces/[workspaceId]/sites/[siteId]` | GET, PATCH | Site mode/details | P01 | C-SITES | Implemented/source-present; migration/live acceptance pending |
| API-004 | `/api/workspaces/[workspaceId]/knowledge` | GET, POST | Upload/fact workflow | P03 | C-KNOWLEDGE | Planned |
| API-005 | `/api/workspaces/[workspaceId]/tasks` | GET, POST | Create/list bounded tasks | P04 | C-RUNTIME | Planned |
| API-006 | `/api/workspaces/[workspaceId]/tasks/[taskId]` | GET | Trace/artifacts | P04 | C-RUNTIME | Planned |
| API-007 | `/api/workspaces/[workspaceId]/tasks/[taskId]/controls` | POST | Pause/cancel/resume request | P04/P06 | C-MEETINGS | Planned |
| API-008 | `/api/workspaces/[workspaceId]/approvals/[approvalId]` | GET, POST | Inspect/approve/reject versioned action | P05/P07 | C-APPROVALS | Planned |
| API-009 | `/api/workspaces/[workspaceId]/meetings` | GET, POST | Meeting list/create | P06 | C-MEETINGS | Planned |
| API-010 | `/api/workspaces/[workspaceId]/meetings/[meetingId]/controls` | POST | Intervention and state control | P06 | C-MEETINGS | Planned |
| API-011 | `/api/workspaces/[workspaceId]/sites/[siteId]/integrations` | GET, POST, DELETE | Begin grant/revoke flows | P05/P08 | C-CONNECTORS | Planned |
| API-012 | `/api/admin/agents` | GET, POST | Config catalog/drafts | P04 | C-CONFIG | Planned |
| API-013 | `/api/admin/agents/[agentId]/versions` | GET, POST | Version/test/activation commands | P04 | C-CONFIG | Planned |
| API-014 | `/api/admin/models` | GET, POST | Profile administration | P04 | C-CONFIG | Planned |
| API-015 | `/api/admin/credentials` | GET, POST | Masked metadata/secret intake | P04 | C-CREDENTIALS | Planned |
| API-016 | `/api/admin/credentials/[credentialId]/controls` | POST | Test/rotate/revoke | P04 | C-CREDENTIALS | Planned |
| API-017 | `/api/admin/templates` | GET, POST | Supported catalog administration | P02 | C-TEMPLATES | Planned |
| API-018 | `/api/admin/runs` | GET | Redacted operational view | P04 | C-OBSERVABILITY | Planned |
| API-019 | `/api/admin/audit` | GET | Latest 100 admin grant/revoke records | P01/P04 | C-OBSERVABILITY | Implemented/source-present; DB grant+AAL2, live acceptance pending |
| API-020 | `/api/workspaces/[workspaceId]` | GET, PATCH | Workspace read; owner-only name update with expectedVersion | P01 | C-IDENTITY/C-SITES | Implemented/source-present; migration/live acceptance pending |
| API-021 | `/api/admin/summary` | GET | Four aggregate registry/admin counts | P01.4 | C-IDENTITY/C-OBSERVABILITY | Implemented/source-present; DB grant+AAL2, live acceptance pending |

## What the first practical transition implements

Use the existing app; do not rebuild from scratch. P01.3 preparation is delivered in package 1.3; **P01.3 workspace functionality was unimplemented in 1.3; package 1.4 now supplies its source with live acceptance pending**. Package 1.4 delivered that workspace source without accepting the grand phase. Original P01.4 admin identity/shell is implemented in package 1.5 with live acceptance pending; a ZIP suffix is a delivery ordinal, not an automatic implementation acceptance tick. [ADR-0003](decisions/ADR-0003-transition-and-dependency-traceability.md) records this clarification.

| Order | Bounded implementation | Acceptance / owner action |
|---|---|---|
| 1 | Compare latest ZIP/Git/deployment and applied migration ledger; capture inherited portfolio fixtures and baseline behavior | Owner provides current environment/deployment information; record discrepancies before changes |
| 2 | Define auth/membership/site contracts and additive data changes; preserve project ownership and public slugs | Fresh/upgrade migration and cross-tenant tests in safe environment; no rewriting migration 001–017 |
| 3 | Implement workspace list/overview, site list/register/detail, settings and create/connect entry shell with real read/write APIs | Two sites under one workspace; another tenant denied; persisted data survives refresh |
| 4 | Link existing `/projects` and `/studio/[projectId]` as legacy editing capabilities | Regression-test saved portfolios, editing/revisions, share/public routes and voice command compatibility |
| 5 | Add scoped navigation and feature availability states; record future route ownership without empty API handlers | Direct unavailable links show honest state; no public admin/secret exposure or success-shaped mock response |
| 6 | Rebuild docs, update manual/impact record, run affected tests and owner walkthrough | Record exact routes now implemented, screenshots/results, package filename and remaining gates |

Frontend and backend progress together in this vertical slice. A polished dashboard with no persistence/permissions is not accepted; a database-only skeleton is not the full workspace outcome. Only necessary first-slice pages are scaffolded initially. Later route folders can be created when their contracts are defined; creating every future empty folder now would not implement or test the architecture.

## Legacy transition and rollback boundaries

Keep `/p/[slug]`, share URLs, existing project IDs, auth claims, assets and portfolio document versions compatible. Bizoveya branding work distinguishes current product UI from archived Voxfolio history; do not bulk-replace historical names or inherited API identifiers. Connect native projects to a workspace through an explicit checked mapping, with no cross-tenant reassignment. Existing external websites stay externally hosted and remain read-only until the relevant connector grant exists. Do not assume domain detection authorizes a write.

Business publishing route/custom-domain resolution is still an open ADR decision; no `/b`, root-domain routing or redirect is invented here. Rollback restores prior application/config while preserving safe additive data; record new ownership mappings and ensure the old app can still read preserved projects. If a change cannot be rolled back without data loss, resolve that before activation.

## Coverage and future changes

The current register contains 60 observed route files, 15 workspace page entries (6 implemented), 14 admin page entries (3 implemented) and 21 API contract entries (6 implemented). These are inventory counts, not a fixed final URL promise. `/bizoveya/docs/[slug]` represents every allowlisted current Markdown detail page, including this document and ADRs; generated document instances are not counted as extra filesystem route files. Planned endpoints do not imply scheduled jobs, worker protocols or provider callbacks are already specified.

Every new page/action maps to [19_DEPENDENCIES_AND_CHANGE_IMPACT.md](19_DEPENDENCIES_AND_CHANGE_IMPACT.md), requirement IDs, permission checks and acceptance evidence. Add/remove/reorder routes when practical implementation reveals missing functionality; synchronize affected docs and log the reason. Final backend endpoint names and schemas remain reviewable proposals until implemented.

## Package 1.4 actual contracts and acceptance boundary

`GET /api/workspaces` returns only the user's memberships/workspaces; POST `{name}` creates workspace+owner membership atomically (201). Workspace GET returns role/scoped metadata; PATCH `{name,expectedVersion}` is owner-only. Site collection GET returns workspace+site records; POST is the strict discriminated registration schema in `src/domain/workspaces.ts`, with authorization attestation and no caller-selected ownership. Site GET scopes both IDs and returns `canOpenStudio` based on original project ownership; PATCH updates `{name,status,expectedVersion}` and optionally an external `{url,ownershipConfirmed:true}`. Mode/category/project linkage are immutable. All responses are no-store; 400/401/403/404/409/413/415/503 states are explicit.

Only the six implemented workspace pages have code. The remaining nine workspace entries, all admin pages and sixteen other API entries remain reserved plans. No provider callback/worker contract has been invented. Original R-001–R-045 stay stable; R-046–R-055 identify new source routes. API-020 adds the required workspace-name/read contract discovered in implementation. Migration 018 is supplied, not remotely applied. The next ZIP increments to 1.5 if P01 work continues; do not rename the stable P01.3 workspace or P01.4 admin work IDs.

## Package 1.5 actual admin contracts

R-056–R-060 add three pages/two GET handlers. `GET /api/admin/summary` returns exactly `{workspaces,sites,workspaceMembers,admins}`; `GET /api/admin/audit` returns an array of at most100 role events with `id,occurred_at,action,subject_id,operator_label,database_actor,reason`. Session absent401, grant absent403, AAL1 admin403/MFA_REQUIRED, backend unavailable503; all API responses private/no-store. Unsupported mutation methods have no handler. Global data is guarded again in SQL; own identity lookup at AAL1 permits MFA setup without global data.

`/admin/security` is the only AAL1-eligible admin page and requires the DB grant. Signed-out pages return via login; ordinary accounts get unavailable/not-found. Admin summary/audit redirects eligible AAL1 to security. Remaining11 admin entries and15 API entries are still planned. There are no blank active credential/config/agent routes. The old package1.4 section records the previous state; current source coverage is the register above.

## Package1.6 — route scope and checks

No route IDs are added or retired:60 observed route files,15 workspace entries,14 admin entries and21 API contracts (110 unique inventory IDs). R-030/R-031 now use dynamic release metadata/counts. Public-doc and unconfigured admin/workspace browser checks provide narrower real-browser evidence; they do not accept signed-in workspace/admin paths. Recovery migration020 changes an operator-only function and introduces no HTTP endpoint. Stable work IDs and existing authorization contracts remain unchanged.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
