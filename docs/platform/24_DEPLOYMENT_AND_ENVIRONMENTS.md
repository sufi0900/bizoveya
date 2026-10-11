# Deployments and environments

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

Same repo/apps/web/apps/admin/package contract layout and two Vercel projects. Apply missing028 then rebuild both from complete cumulative source. Only optional new server variables BIZOVEYA_NEBIUS_API_KEY/BIZOVEYA_OPENAI_API_KEY/BIZOVEYA_GEMINI_API_KEY on admin deployment for current presence checks. Never NEXT_PUBLIC keys or commits. Runtime later requires its own deployment scope setup. No key required for basic metadata/missing-key tests.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Same one repo/two Vercel projects with roots apps/web and apps/admin. Root workspace now includes packages/*; include packages/agent-contract and pnpm-workspace.yaml/lock. Keep installs at workspace scope as before. Rebuild both apps so linked shared contracts resolve; no new env/key/provider. Admin output tracing root covers monorepo. Real MFA/host-only sessions still need founder proof.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Use cumulative1.13 with same repo/two Vercel roots. No new env/provider key. Reconcile and apply missing026 only after earlier migrations. Through022 ->023/024/025/026; through024 ->025/026; through025 ->026; through026 ->none. Fresh001–026 in order. Never rerun old applied scripts or deploy fixture values.30 contains complete actions.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Same one cumulative ZIP/repository, two Vercel roots apps/web/apps/admin. Apply only missing023,024,025 in order if database is through022; if through024, only025. No new env/key/domain step. Rebuild public app; keep real values and NEXT_PUBLIC_SITE_URL. Do not deploy fixture values/build. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Same cumulative repository/ZIP and Vercel roots apps/web + apps/admin. If001–022 applied, apply023 then024; if023 already applied, only024. No new secret/API key. NEXT_PUBLIC_SITE_URL should be the real public origin for canonical metadata (existing setting); rebuild public app after env changes. Do not deploy local fixture URLs/keys. No custom customer-domain/DNS change is part of this slice. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.10 / P02.2.Fix-1

Merge the cumulative1.10 ZIP into the same GitHub repository, preserving local secrets/Git/unpublished changes. Two existing Vercel projects remain rooted at apps/web and apps/admin. Redeploy public web for changed routes/styles/docs. Admin implementation is unchanged; its package metadata advances1.10.0. Same Supabase project: if001–022 are already applied, run only023_creation_integrity.sql once. No new env/API token. Never use local fixture env values on Vercel; they are solely for isolated QA builds.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

One cumulative1.9 ZIP/repository still deploys two Vercel projects with roots apps/web and apps/admin. No third project, new environment variable or provider key. Merge source preserving .git, private env files and uncommitted work. Main app must rebuild to show current docs/template routes. Admin may auto-redeploy because package metadata advanced, but functional admin source is unchanged.

If001–021 already applied, apply ONLY `supabase/migrations/022_modular_business_sections.sql` once in the same shared Supabase project's SQL Editor, preferably staging first. If021 missing, apply021 then022; reconcile all missing predecessors in numeric order for fresh DB. Do not rerun already-applied migrations or SQL acceptance/tool fixtures on production.022 replaces validation, preserves v1 rows and retains RLS/RPC. See25 for exact checks and failure recovery. No database action or deployment was performed remotely here.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Both projects were shown Ready in founder-provided Vercel screenshots at2026-10-01T23:23:19+05:00, package1.7 source context. This is deployment evidence only. For1.8 keep the same Git repository, two roots/apps and independent origin env values. New manual action: apply only missing021 after reconciling001–020. No new env variables or domain provisioning. See25 for source update and smoke tests.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Bizoveya1.7: two Next.js applications in one repository and one cumulative ZIP.** Folder names are source locations, not browser URL prefixes. Both applications include server logic; the public app is not merely a frontend and the admin app is not the entire backend.

## Application ownership

| Root directory | Vercel project | Domain (illustrative; not provisioned) | Routes |
|---|---|---|---|
| apps/web | bizoveya-web | your-domain.com | Existing portfolio, login, workspaces, customer APIs and /bizoveya/docs |
| apps/admin | bizoveya-admin | admin.your-domain.com | / redirects to /login; /login; /admin; /admin/security; /admin/audit; /api/admin/summary; /api/admin/audit |

The public deployment has no /admin page tree or /api/admin handlers, no admin link and no redirect to the admin host. These URLs return404 there. Admin contains no docs, workspace, builder or marketing routes. Its pages never provide customer signup. An operator creates/identifies the account using the public login or trusted Auth management, then grants it using the private operator procedure.

Canonical documentation stays at repository-root docs/platform and is generated only by the web app at /bizoveya/docs. Admin runbooks remain there too, as requested. A document discussing /admin is text about the private host, not a navigation link to it. Do not turn these into admin hyperlinks. Credentials/private incident records never belong in public docs.

## Local setup — required owner actions

Use Node24 and the declared pnpm version. From the extracted bizoveya-platform root:

```sh
pnpm install --frozen-lockfile
pnpm dev:web
```

In a second terminal at the same repository root:

```sh
pnpm dev:admin
```

Web: http://localhost:3000. Admin: http://localhost:3001. Create separate apps/web/.env.local and apps/admin/.env.local using each .env.example. Configure the same intended Supabase URL/anon key independently. Set NEXT_PUBLIC_SITE_URL to the correct application URL in each. Existing voice/model secrets belong only in web if needed. No service-role key or AI-provider key is required by this admin slice.

Run root pnpm test, pnpm typecheck, pnpm lint, pnpm build and pnpm check:boundaries for both applications. Root pnpm dev remains a web shortcut. Old source paths src/ now live at apps/web/src/ or apps/admin/src/. Optional verification tools remain at tools/phase1-verification; install them with npm ci --prefix tools/phase1-verification. Browser runner1.7 starts both unconfigured production builds and tests the route boundary; SQL runner remains local-only.

## One GitHub repository, two Vercel projects

1. Upload/commit this complete tree to the existing chosen repository. Do not overwrite private env files or ignore local changes.
2. Configure the existing public Vercel project Root Directory as apps/web. Its root previously used the repository root; leaving it unchanged will no longer build the web app correctly.
3. Import the same GitHub repository as a second Vercel project with Root Directory apps/admin.
4. Enable access to source outside the Root Directory for the web build so it can read ../../docs/platform. The web Next config traces these docs from the repository root. Preview must verify every document page loads.
5. Configure environment variables separately for each project and environment. Builds run pnpm build within their selected application root; dependency installation uses the root workspace lockfile. Do not set an application build command to root pnpm build recursively.
6. First verify the two Vercel preview URLs. Only then assign your owned main domain to web and its admin subdomain to admin. Configure the DNS records Vercel displays, confirm HTTPS and configure allowed Supabase Auth site/redirect URLs for the intended flows. No domain has been purchased or configured by this ZIP.
7. Verify public /admin and /api/admin/summary return404 without an admin-host redirect; admin /login responds; admin /bizoveya/docs and /workspaces return404. Run real admin/MFA and customer regressions below before promotion.

Do not assume two projects are within any account's current plan limits without checking that account. Sharing Git does not imply an admin deployment is inaccessible; protect deployment permissions as well as application authorization.

## Database and session ownership

Use one Supabase environment initially. Apply each missing migration001–020 once, in order, against its verified ledger; no new migration is added in1.7. If001–020 already applied, run no migration for this package. The SQL fixtures inside tools are never Supabase installation scripts. Operator grant/revoke is still supabase/operator/platform_admin.sql; admin grant is not created by signup.

Admin browser/server/middleware use a distinct cookie/storage name bizoveya-admin-auth, no Domain attribute, path/, SameSite=Lax and Secure in production. Public auth retains its existing cookie name. This separates browser sessions even on localhost ports (cookies are host-scoped, not port-scoped). Admin middleware refreshes the real user session; every protected loader/API and DB function still checks privileges and MFA. Local sign-out does not deliberately invalidate other application sessions. Test actual provider behavior on staging.

Shared Auth users/DB remain a shared trust boundary: the same account's verified token retains its database capabilities. Host-only cookies do not revoke DB authority, partition Auth users or guarantee isolation after database/deployment credential compromise. Browser cookies required by the Supabase browser SDK are not claimed to be HttpOnly. CORS alone is not authorization. Keep admin credentials/session private; do not place privileged service keys in either browser bundle.

## Required manual acceptance and rollback

Check signup/workspace/site creation, persistence after reload, and two-account isolation on web. Use the already-approved operator account on admin /login, verify non-admin denial, real TOTP at /admin/security, incorrect-code behavior, cookie refresh/reload, sign-out, immediate grant revocation and disposable lost-factor recovery. Confirm a public login alone does not sign in the admin application. Document23 records exact owner results; all untested cases stay pending.

One cumulative ZIP contains both applications, docs and migrations; delivery ordinal1.7 is not phase acceptance. Handoffs state each changed deployment and migration/manual action. Shared configuration changes require checks of both apps. Deploy web and admin independently but coordinate breaking database/contracts changes. Rollback to1.6 requires restoring the old public Root Directory as well as its code; that restores admin routes to the public application and therefore reverses the intended separation. Prefer fixing forward or removing admin grants when disabling privileged access; do not delete audit records.
