# Phase 1 verification guide

## Current contract — package1.15 / P04.2.1

Current tests append MT068–074 in33/30; phase1 setup legacy retained. Separate admin hosted checks still mandatory; AAL1/ungranted/revoked cannot inspect profile metadata or probe env presence. Main-domain admin pages/API unavailable. P04.2.1 source success does not accept phase1/manual gates.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Current combined checklist30 and new32 add MT060–067. Phase1 routes are inherited; this delivery adds separate-host admin configuration and scoped customer readiness. A route opening alone does not prove permissions or model readiness.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Keep every unperformed historical real-role/MFA/hosted security check pending. New026 must be applied only if missing; new026 assertion is isolated/staging-only and never a production migration. Consolidated steps are30.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Use latest combined checklist30 for outstanding hosted checks. Earlier phase reports remain historical; local1.12 evidence is under delivery/P02.4. No broad old pass closes pending1.10–1.12 cases. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Previous local reports remain historical evidence. New publication proof is separate under docs/delivery/P02.3.1; local API fixtures and PGlite cannot certify hosted tenant isolation/MFA. Keep old acceptance gaps visible. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.10 / P02.2.Fix-1

The SQL runner now includes migration023 and assertions023 for duplicate names/URL aliases, update/rename bypasses, atomic initial template, role denial, failed-create rollback and preserved legacy duplicates. New `run-auth-browser.mjs` verifies customer journeys using a declared synthetic Supabase fixture; read27 for required build environment. Existing unconfigured browser runner remains a separate mode. Do not run assertion/fixture scripts in production or use mock-auth evidence as live Supabase acceptance.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

Current optional SQL runner now applies001–022 and assertions018–022 to a disposable PGlite database; includes legacy business021→022 no-row-rewrite proof. Browser runner covers both isolated production apps and the modular demos. Run from root: `node tools/phase1-verification/run-sql.mjs --report results.json`; browser prerequisites and commands remain below. Tool fixtures/tests are not migrations and should not be pasted into production. Latest evidence directory `docs/delivery/P02.2`; historical Phase1 evidence remains preserved.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

The optional tools/phase1-verification directory is reused across phases; its directory name is historical. The current SQL runner applies001–021 locally, runs018/019/020/021 assertions and verifies legacy data survives additive upgrades. The browser runner tests two unconfigured production apps, business demo/mobile/theme/download behavior and admin boundaries. Reports in docs/delivery/P02.1 are local evidence, not real Supabase authenticated acceptance. Follow document25 for hosted setup/manual tests; do not paste local bootstrap/fixtures into Supabase.

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Bizoveya 1.6. Repeatable local evidence, not production acceptance.** This package closes specific gaps left by earlier mocked tests and supplies two regression fixes. Run only in an isolated local checkout or a separately authorized staging environment, as described below. Never put real keys, user identities, setup QR codes or private customer evidence in the public document room.

## What changed and why

| Finding | Evidence | Repair |
|---|---|---|
| An admin grant could not be revoked after the Auth account was soft-deleted | New SQL recovery assertion failed against migration019 with `bz_user_not_found` | Additive migration020 permits revocation regardless of account eligibility; new grants still require an existing non-deleted account |
| Dashboard/sidebar/detail labels stayed at release1.1 and24 documents | Actual local browser rendering showed the stale labels alongside31 loaded documents | Overview and detail pages now derive the release from recorded package-table rows, and document counts from the current inventory |

No earlier migration is rewritten. No new route, AI provider, credential editor, business template or remote deployment is introduced. Stable work IDs: P01.4.Fix-1 (recovery), P01.1.Fix-1 (document labels), and supporting P01 verification. ZIP1.6 is a delivery ordinal, not grand-phase acceptance.

## Isolated tool installation

The application dependency ranges and root `pnpm-lock.yaml` are unchanged. Optional test tools live in `tools/phase1-verification/`, with their own exact npm lockfile: PGlite0.5.8 and Playwright1.62.1. They are development tools and are not imported by application routes. Browser binaries/node_modules/generated databases are excluded from the ZIP.

From the project root, after installing the application's normal dependencies:

```sh
npm ci --prefix tools/phase1-verification
npm run test:sql --prefix tools/phase1-verification
```

This opens only ephemeral local databases. It accepts no remote database URL. `bootstrap.sql`, `upgrade-fixture.sql` and `upgrade-workspace.sql` are **test-only fixtures**; never run them in Supabase. They define simplified Auth/Storage schema and simulated JWT settings needed to exercise application SQL. They are not application migrations or a replacement backend.

## Database proof boundary

The runner applies the actual unchanged migration files001–019 followed by020 using a PostgreSQL WASM engine. It runs the actual staging assertion scripts018/019/020 with non-owner `authenticated`/`anon` roles, verifies fixture rollback, and separately simulates upgrade boundaries: legacy project after017, workspace/site mapping after018, admin grant/audit after019, then repair020. A before/after JSON snapshot checks that the repair changes no stored project/workspace/membership/site/grant/audit records.

This executes real SQL, constraints, functions, grants and row policies; it is stronger evidence than a mocked Supabase client. **It does not verify Supabase's real Auth service, signed JWT validation, PostgREST schema exposure, Storage service, target PostgreSQL version, deployment configuration or concurrent transactions.** PGlite here reports PostgreSQL18.3 and has a single connection. The target Supabase version remains unverified. Re-run the supplied assertion SQL in disposable/staging Supabase after reconciling its migration ledger.

The recovery regression checks soft-deleted-account revocation, an audit event, idempotent repeated/absent revocation and refusal to regrant a soft-deleted account. Earlier workspace/admin scripts cover role isolation, direct writes, AAL1/AAL2 claims, revocation and portfolio ownership. Claims in these SQL scripts are fixtures, not genuine authenticator sessions.

## Real-browser local smoke checks

Build the app in an **unconfigured local copy** without production credentials. The test starts its own loopback server and requires the admin API to return the explicit `SETUP_REQUIRED` state. It stops rather than claiming to test an authenticated environment. It uses a fresh browser context and blocks non-local network requests.

```sh
pnpm build
cd tools/phase1-verification
npx playwright install chromium
npm run test:browser
```

Default mode uses the production build. `--mode dev` is available for diagnosis; use production mode for the final report. Results default to `tools/phase1-verification/results/browser/`; use `--out` to choose a private local evidence directory. Do not commit raw server logs or credential screenshots from other environments.

For a preinstalled compatible browser, set `BROWSER_EXECUTABLE_PATH` to its absolute path. A constrained root container may need `BROWSER_NO_SANDBOX=1`; use that only for this isolated local test, not normal browsing. This delivery used local Chromium153.0.8010.0 with Playwright after agent-browser's daemon and standard download setup failed. No production-browser configuration is changed.

The suite checks canonical version/count labels, document category/search behavior, no-result recovery, detail navigation, Mermaid rendering, persistent themes,390px mobile layouts, table scrolling, admin skip navigation, honest setup states and no-store/unsupported-write API behavior. It captures screenshots and reports page/console errors. It does **not** cover real workspace creation, admin eligibility, TOTP scanning/cookies, signed-in forms or account recovery. Those remain manual staging gates in document21.

## Release and visual synchronization

The release parser reads only package-register table rows with an exact ZIP filename. It compares numeric phase/subversion components, so1.10 follows1.9, and ignores prose about future packages. Missing records show an unavailable label rather than an invented release. Unit tests and browser checks compare overview/detail labels and inventory counts with canonical records. All current Markdown, including this guide, remains projected into `/bizoveya/docs` on rebuild.

Evidence lives under `docs/delivery/P01.6/` and `docs/delivery/P01.6_VERIFICATION.json`. The package metadata has the exact archive filename/hash/time externally. Public screenshots contain documentation/setup screens only. Local checks do not tick any grand phase accepted. Future assistants should run the relevant suite when changing migrations, auth gates, document parsing or UI behavior, and update the source docs and activity/package records with the code.

## Still needed from the operator/owner

Reconcile actual Git/deployment/migration history; review/apply any unapplied migrations through020 in staging; run018/019/020 assertion scripts there; verify real signup/sign-in, workspace/site persistence, cross-tenant denial, authenticator setup/challenge, cookie refresh, revocation and recovery; inspect inherited portfolio/voice behavior. The operator setup template remains in `supabase/operator/platform_admin.sql`, never in automatic migrations. Do not send private credentials into documentation or chat.

Primary tooling references: [PGlite API](https://pglite.dev/docs/api) and [Playwright browser installation](https://playwright.dev/docs/browsers). These describe tooling, not project acceptance.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
