# Stack, provider policy and security

## 2026-10-08 evolution update — planned direction

For future template/agency slices: enforce personal ownership independently of workspace membership; constrain renderer nodes/fonts/assets and reject executable template input; protected credential storage and per-user revocation; no credential sharing or automatic paid fallback. Rooms redact secrets/private prompts. Voice and agent configuration cannot bypass server authorization. Test cross-user/template/version boundaries before launch; no new package or security control was installed here.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

## Current checkpoint — 1.24 / P04.3.3.5

Explicit founder-owner draft dispatch is implemented on the separate admin deployment at `/admin/generations`, default off. Private campaign outputs now show Blog/Pinterest/LinkedIn text, citations, advisory QA and owner-only versioned human review. Additive037 follows036; no provider request, hosted SQL, publishing or Vercel setting change was made. See [44 Draft pilot and human review](44_DRAFT_PILOT_AND_HUMAN_REVIEW.md). This block supersedes older current-state blocks, which remain historical.

Founder reports the latest Gemini connectivity/three refreshed assignments/campaign readiness checks passed; screenshot independently confirms connectivity and Coordinator, and the prior video confirms Spending reload persistence. This is not whole-phase acceptance or proof of036 installation. New MT138–144 remain pending. P04.3.3 is IN PROGRESS; next is the explicitly activated one-run Gemini pilot and evidence review, not automatic advancement to visuals/publishing.


## Current checkpoint — 1.23 / P04.3.3.4

Server-only bounded draft engine is implemented with exact private request records, one attempt per Coordinator/Content/Quality role, approved-citation validation, durable output/usage settlement and no automatic retries. Additive036 revalidates execution dependencies and repairs connectivity admission to include campaign spending. No Generate route, activation, provider request, customer publication or hosted SQL was performed. See [43 Draft runtime and testing](43_DRAFT_RUNTIME_AND_TESTING.md). This block supersedes older current-state blocks below; those remain historical.

Founder reports034/035 applied; screenshots confirm three agentv2 approvals, Gemini assignments and prepared campaignv3 snapshot/3 stages/count1. Refresh persistence and all other unevidenced manual checks remain pending. Next is authorized dispatch, saved output review and explicit founder pilot activation within the same unfinished P04.3.3 phase.


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

The new AI SDK requires Node22 or newer; use Node24 for local/Vercel consistency. P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

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

Environment-backed secret boundary selected for this metadata preparation stage; exact env values never sent to forms, RPCs, event/history/presence responses or customer pages. Fixed slots prevent arbitrary variable probing. AAL2 is a current session guard, not a newly implemented fresh reauthentication flow. Actual key add/rotate/revoke stays in private deployment/provider accounts; no broad production security claim.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Shared Zod contract package transpiled by both Next apps. Admin mutation uses bounded same-origin JSON, current server session and MFA; SQL repeats current grant+AAL2. No secret editor/provider URL or executable code field. Strict role tool allowlists; direct config access revoked; site preferences RLS. Browser UI evidence cannot prove real hosted MFA/RLS/concurrency. Native browser Back/Forward unsaved-edit protection remains an inherited limitation; save before navigation.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

No dependency/provider/key change. Existing public anon key plus signed-in session; knowledge table writes revoked for app roles. Fixed-path security-definer RPCs lock membership/site/source, enforce expected versions, owner-only approval/removal and duplicate source-text rejection. API enforces origin/JSON/180KB bounded body. SQL knowledge validates strict document keys and length/count bounds. Raw text is escaped React content; no HTML execution or AI prompt execution.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Dependencies/lock unchanged; six IDs must match application enum/catalog and025. Public projection024 still strips hidden/unused content. No new API credentials or third-party services. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Publication uses existing Next15/Supabase/Zod/shared renderer dependencies. No new API key or service-role access. Mutation origin/body rules, membership checks and site-row serialization apply; clients cannot write publication tables directly. Anonymous readers use anonymous credentials without member cookies, and only RPC returns sanitized active data. Prior downloaded data/search engine caches cannot be recalled by Unpublish. Hosted RLS/PostgREST/concurrency/MFA acceptance remains pending. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

Migration023 retains RLS/direct-write restrictions and existing authenticated membership gates. Native initial-draft creation occurs in one security-definer transaction with empty search_path. Workspace identity writes are serialized, and duplicate responses are friendly409 errors. Browser-origin validation uses routed Host plus proxy scheme because Next can expose an internal localhost request URL; arbitrary forwarded-host input is ignored and cross-site requests still denied. Public/admin boundaries and host-scoped admin session design remain unchanged. No new provider/environment secret or dependency.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

No runtime dependencies or API keys added. Business mutations retain same-origin checks, server-verified identity, workspace membership/site role and optimistic version RPC. SQL022 validates allowlisted presets, layout/type pairs, unique section IDs, strict object shapes, lengths, optional HTTPS images and size. RLS/direct-write restrictions remain from021. Business request limit alone increases to64KiB; other workspace APIs keep16KiB. User text is React-escaped, no raw HTML. Images cannot use script/data/http URLs or embedded credentials; load directly from the chosen HTTPS host without Next optimizer proxy. Remote assets can reveal viewer connection details to that host; use approved hosts/assets. No service-role key, provider credential or private client data is put in public docs. Public admin paths remain404.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

No new runtime dependency, AI provider key or service-role key was introduced. Current Next15.5.25/pnpm workspace stack stays unchanged. Business API uses existing verified-session helpers, UUID scope, same-origin mutation validation, JSON byte limit and strict Zod schema. Database adds membership RLS plus security-definer save RPC with empty search_path, explicit authenticated execute grant and locked role/site checks. Anonymous and direct authenticated table writes are denied. Rendered text uses React escaping; accent/template IDs are constrained; email is validated. Real hosted Auth/PostgREST/concurrent requests still require owner testing. Primary references: https://nextjs.org/docs/15/app/api-reference/file-conventions/route and https://supabase.com/docs/guides/database/postgres/row-level-security.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.1.** Current archive package.json: Next.js `^15.5.2`, React `^19.1.1`, TypeScript `^5.9.2`, pnpm `11.19.0`, Node `>=20.9.0`, Supabase JS `^2.57.4`, `@supabase/ssr ^0.7.0`, Zod `^4.1.5`, Tiptap 3, React Three Fiber/Three, Vitest 3, ESLint 9. These are declared ranges, not installed/verified versions. No database/worker/telephony purchase decision is fixed by this draft.

**Verified in code:** AssemblyAI routes; OpenAI/Gemini support; `src/lib/agent-provider.ts` tries configured Nebius, OpenRouter, Gemini and OpenAI candidates in order. `.env.example` lists AssemblyAI, Supabase, OpenAI, Gemini and visitor hash secret but omits Nebius/OpenRouter variables found in code. Resolve docs/env/example and test provider selection in P00/P04. A configurable Nebius branch alone is not evidence of an actual Nebius/NVIDIA hackathon call. Pin actual model ID, provider path, request/result trace and cost only after live validation. ChatGPT Plus is not an API credential or a production inference budget.

**Target recommendation:** Keep Next.js/Supabase foundation, add workspace/site tenancy through additive migrations, introduce a durable queue/worker only after a local failure/retry proof. Use direct typed adapters for Sanity/GitHub/Vercel/channels. An n8n integration is optional and cannot become the only source of task/audit truth. Use cheaper model policies for small extraction/metadata only if output quality, cost and budget are measured. Gemini/OpenAI/AssemblyAI roles remain configurable auxiliary paths; owner chooses paid providers and budget thresholds before production.

## Security baseline

- Authenticate every private route, verify membership/site scope and enforce RLS/storage policy. Test owner A cannot read owner B's tasks, knowledge, media or credentials.
- Store secrets only in managed server configuration/secret store; never in browser bundles, prompts, logs or ZIP. Separate public anon key from service-role key. Rotate and revoke connector credentials, use minimal scopes and display grant owner.
- Treat fetched web pages, user documents, CMS entries, model text and agent-to-agent messages as untrusted. Validate typed commands with Zod and enforce tool allowlists/budget/approval on server; reject prompt attempts to override permissions.
- Sandbox or isolate repository changes; constrain selected repo/branch, require PR and owner review, forbid agents from direct default-branch write. Protect webhooks with signatures, replay window and idempotency.
- Rate-limit visitor agents, respect consent and retention, suppress private facts and sensitive data. Audit approval actor/time/action and external receipt. Define incident revocation and restore runbook before customer launch.
- Security review is evidence-based: dependency scan, RLS negative tests, secret scan, connector authorization/revoke test and double-action retry test. Capture gaps in `11_VERIFICATION_AND_RELEASE.md`.

## P01.0 document-room addition

`mermaid` 11 is declared for client-side rendering of the two current Markdown diagrams; actual installed resolved version must be read from the lockfile. The room reads server-local Markdown at build time and statically generates pages. Search indexes the full document text in the client, so **all source document text is public** even if a card is hidden. Review content before deployment, do not put secrets or customer data in public Markdown, and use actual authentication for any future private officer room. The dependency and Next.js build must be retested when upgraded.

## Provider-neutral runtime and protected management (package 1.2)

SDK/runtime choice is pending compatibility testing. OpenAI Agents SDK is a candidate for the TypeScript backend and supports provider adapter patterns; some advanced features are provider-specific. It is not present in this package's dependencies. Hosted Agents API is a distinct managed-runtime option, not a requirement or proof of compatibility with arbitrary cheap models. For the hackathon, central live inference must meaningfully use qualifying NVIDIA models on Nebius. Free tiers, open weights and ChatGPT subscription access are not unlimited/free production infrastructure.

Model catalog entries require provider/model identity, tool/output compatibility, quality/cost/latency evidence and geographic/data eligibility. Muse Spark hosted API is excluded from the intended Pakistan path under the geographic policy researched on 2026-09-30; recheck official policy before any future adoption. Self-hosted model licensing/hardware needs separate review. No provider ranking is finalized.

Admin baseline: named controlled bootstrap, MFA, server-side role checks on every mutation, least privilege, no public self-grant, sensitive-change reauthentication, optimistic revision checks and redacted audit. Privileged database keys stay server-only; RLS is not sufficient when a service role bypasses it. Clients cannot edit platform roles, global tools or server secrets. A hidden admin link is not security.

Credential room uses a dedicated protected API and secret-store references; no stored secret is returned after save. Redact request bodies, failures, telemetry, exports and screenshots. Separate staging/production and platform/tenant grants. Test atomic rotation, revoked key behavior and in-flight reconciliation. Do not allow arbitrary endpoints/scripts from client configuration; approved adapter catalogs avoid unrestricted execution and server-side request forgery. Sandbox repository/browser operations when needed; reject untrusted-document permission overrides.

The public Markdown room remains public and therefore contains only shareable discussion summaries and conceptual controls. Customer documents, actual secrets, private account screenshots, detailed operational incidents and live credentials must not be added there. No admin security feature is implemented by this documentation update.

## Package 1.3 transition and impact synchronization

Workspace pages and direct APIs must enforce the same server membership/entity scope; client owner does not imply platform admin. New admin shells stay protected even before features exist. Dependency review includes grant revocation, in-flight actions, secret metadata, contract schemas and rollback. No SDK, package dependency, credential vault or SQL change is made by package 1.3.

## Package 1.4 — first practical workspace implementation

Package metadata is now `bizoveya-platform@1.4.0`; dependency ranges and lockfile are unchanged. New server APIs use verified cookie sessions, method-specific membership/entity guards, strict schemas, same-origin checks for browser mutations, application/json intake and a 16 KiB body limit. API responses are private/no-store; invalid IDs and nonmembers receive unavailable/not-found responses, viewer/owner-only restrictions get denial, conflicts get 409, missing migration/storage gets a sanitized 503. Browser Origin is checked when present and cross-site Fetch Metadata is rejected; non-browser callers without those headers still need the authenticated session.

Migration 018 enables RLS, explicit grants, locked-down mutation RPCs and a private role helper to avoid recursive membership policies. No auth-user metadata role trust, service-role key, platform-admin grant or secret intake form is added. The operator must review and run staging SQL before applying in production. Authenticated collaborators see registry metadata; private portfolio editor/data remains owned separately.

Primary design references: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [database function security](https://supabase.com/docs/guides/database/functions), [Next.js authorization](https://nextjs.org/docs/app/guides/authentication). These guide the design; they are not evidence of passing production security checks.

## Package 1.5 — admin security implementation

Dependency ranges and lockfile remain unchanged; application version is 1.5.0. The existing Supabase JS/SSR clients supply TOTP enroll/list/challengeAndVerify and cookie propagation. Admin checks trust a server-verified user plus DB grant and signed JWT assurance, never user metadata or a decoded browser claim. Global RPCs recheck access; APIs use no-store and redact provider failures. Setup QR/key are rendered only during the approved user's explicit setup and cleared after verification; SVG is an image data URL, not injected HTML. No API key UI or new secret-store choice is introduced.

Private tables use RLS and revoked app/service-role table grants; exposed RPC EXECUTE is authenticated-only with hard role/AAL guards. The private operator function is not browser-callable. No administration mutation endpoint is installed, so future config/credential writes still need action-specific CSRF, reauthentication, validation, audit and recovery design. An AAL2 read session does not prove recent authentication for a future sensitive write. See runbook 21 for trusted-operator limitations and evidence gates.

Primary references: [Supabase TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp), [assurance and MFA](https://supabase.com/docs/guides/auth/auth-mfa), [SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

## Package1.6 — development verification and recovery correction

Application version1.6.0; application dependency ranges/root lockfile unchanged. Separate optional tooling pins PGlite0.5.8 and Playwright1.62.1 under `tools/phase1-verification/` with its own npm lock. These are never imported by application routes. Local SQL roles exercise real policy/function checks, but Auth/JWT/Storage services are fixtures; no auth-token verification claim follows from that test.

Migration020 restores operator revocation for soft-deleted accounts while retaining rejection of invalid/new grants, restricted EXECUTE privileges, reason validation and audit. No app service key or new privilege is introduced. Browser smoke checks use a fresh local context and unconfigured build; all network requests outside loopback are blocked. Actual authenticated/MFA/tenant browser tests still require staging. Temporary browser-install failures were handled in test tooling only, not by weakening application controls.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.

Revocation and deletion remain available when the normal 100-revision save/approval budget is exhausted; revocation can create the final extra revision so the limit never forces approved facts to remain active.
