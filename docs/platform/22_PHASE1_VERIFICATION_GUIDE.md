# Phase 1 verification guide

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
