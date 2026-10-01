# Verification, manual acceptance and release evidence

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Draft 0.1.** The inherited archive's V27.12 note says dependency-based `pnpm typecheck`, `pnpm test`, `pnpm build` and live AssemblyAI/Supabase checks were unavailable in that environment. The original draft did not run those checks; later P01.0/P01.1 results are recorded below. Package 1.2 evidence is separate and does not verify a deployment. The inherited package version was `26.0.0`; package 1.4 updates application metadata to `bizoveya-platform@1.4.0`, with dependency versions/lockfile unchanged.

## Evidence matrix

| Gate | Automated proof | Owner/manual proof | Record |
|---|---|---|---|
| Baseline | Clean install, `pnpm typecheck`, `pnpm test`, `pnpm build`, lint, package lock integrity | V27.12 guided voice preview/confirmation/draft flow, Studio and visitor on actual deployment | Commit, command logs, device/browser, date |
| Schema | Fresh and upgrade migrations, RLS and storage cross-tenant negatives | Confirm applied migrations and restore rehearsal in safe environment | Migration IDs and sanitized result |
| Native site | Legacy fixture and business document command/revision tests | Portfolio unchanged; business site mobile, SEO, contact and publish preview | URLs/screenshots and owner sign-off |
| Connector | Scope/revision/conflict/idempotency tests, mocked failures | Authorized CMS draft/readback, selected PR and preview; no surprise publish | Remote IDs and redacted receipts |
| Agent/meeting | State transitions, lease/restart, malformed model output, cost guard | Owner joins meeting, pauses/amends, checks recovery | Timeline/trace IDs |
| Public chat/voice | Tenant isolation, rate, prompt injection and approved-fact tests | Two visitors, consent, escalation, interruption and actual provider bills | Sanitized transcript and cost |
| Release | CI plus docs link/status validation, secret/dependency scan | Staging smoke, rollback, accessibility and judge/guest flow | Release checklist and owner acceptance |

## Acceptance protocol

An implementer logs exact commands/results and scope of mocks versus live calls. A failed or skipped check stays visible; tests are not marked passed by code inspection. Owner confirms required external/provider/device behavior. Log every implementation/reversal with actor, PKT timestamp, changed paths, commit or ZIP ID and redacted evidence in `ACTIVITY_LOG.md`; add only verified completions to `COMPLETED_WORK.md`. `[~]` only after code is implemented; `[x]` only with evidence and acceptance. Fixes reopen the relevant gate. For each deployment record source SHA, migration set, provider config identifiers without secrets, backup/rollback plan, API cost observation, incident contact and smoke URL. Never paste private tokens or customer transcripts into public issues or hackathon artifacts.

## Release and recovery

Stage schema additions first; check compatibility of old portfolio records and public slugs. Deploy to preview with sanitized sample sites, test permissions and provider outage. For an external action timeout reconcile remote revision before retry. Rollback application by previous deployment/commit while retaining forward-compatible schema; use compensating migration only after data safety review. If live migration already applied, never delete its SQL history. A later phase may add a detailed runbook linked here.

## P01.0 document-room evidence

On the final package source, `pnpm install --frozen-lockfile` succeeded, `pnpm typecheck` passed, `pnpm test` passed (38 files, 178 tests), and a clean `pnpm build` passed. The Next.js build listed `/bizoveya/docs` and 24 statically generated document routes. A static output check matched all 24 current Markdown files (top level plus decisions) to 24 generated pages and overview links; none of the historical Voxfolio files generated a page. A local Markdown link check found zero missing linked `.md` files. The build emitted an Autoprefixer compatibility warning for the new stylesheet and an inherited global stylesheet; it did not fail. The first earlier build attempt reached static generation but failed during `.next/export` cleanup; a clean rebuild passed.

A local `next start` process required an environment-only network interface shim; the browser CLI was unavailable and separate-shell localhost access failed. Thus real browser search interaction, mobile appearance, diagram rendering, deployed URL and owner acceptance remain **unverified**. Inspect `/bizoveya/docs` and multiple document pages on a preview before changing P01.0 from `[~]` to `[x]`. Whenever a source Markdown file changes, rebuild and deploy the site so its page reflects the new source.

## P01.1 visual dashboard evidence

On the visual dashboard source, `pnpm typecheck` passed, `pnpm test` passed (38 files, 178 tests), and a clean `pnpm build` passed with 24 statically generated document pages. Static output inspection confirmed the dashboard labels, `CW-009`, P01.1/P01.2 and BZ-009 projections, all 24 current Markdown slugs linked and generated, zero missing local Markdown links, and no generated archived Voxfolio document page. The build warning is from the inherited `src/app/globals.css` `start` compatibility value. A browser runtime, mobile screenshot, actual local-storage theme persistence, diagram redraw, deployed preview and owner visual sign-off remain unverified. Keep P01.1 `[~]` until those checks.

## New acceptance tests required before admin/runtime implementation is accepted

| Gate | Required evidence |
|---|---|
| Admin access | MFA/reauthentication; normal client and revoked admin denied direct API calls; no self-granted platform roles |
| Isolation | Two tenants/sites with denied cross-scope tool/retrieval/config access; audited support access |
| Config lifecycle | Invalid edits rejected; saved-case comparison; failed activation keeps old version; rollback preserves history |
| Run snapshot | New runs use selected version; existing runs unchanged unless explicit checkpoint amendment; provider/config refs reproducible |
| Credentials | Secret absent from UI responses/logs/prompt/export; bounded test/atomic rotation/revoke; expired key recovery |
| Runtime/model | Exact SDK/adapter model ID, valid/malformed tool calls, structured output compatibility, permitted fallback and budget cap |
| QA | Known good/bad Pinterest fixtures, deterministic field/URL/board/asset/duplicate validation; missed-error/false-positive records |
| Execution | Restart/stop during external write reconciles remote receipt; no duplicate effect; review is not publish proof |
| Metrics/templates | Metric definitions/window/freshness, optional presence expiry; supported template preview/version/regression |

Manual owner actions: configure named test administrator and MFA privately, provide a small approved evaluation set, authorize test-site/provider grants, exercise rotation/revoke and compare config versions, then review mobile/keyboard/admin permission behavior. Never share real keys in chat or public docs.

## P01.2 documentation synchronization evidence — 2026-09-30

The latest reuploaded 1.1 matched the original SHA-256. All 24 baseline platform Markdown documents, full archive inventory and relevant document-room loader/renderer/projection source were inspected. This delivery updates 23 existing platform Markdown documents and README, adds three platform Markdown documents and a delivery verification JSON report. All 276 other original files—including source, assets, configuration, dependencies/lockfile, SQL and existing ADR/history—are unchanged byte-for-byte.

Local link/nonempty checks passed for all 27 current Markdown files. A production build via `node node_modules/next/dist/bin/next build` with the existing 1.1 dependency tree passed compilation, lint/type validity, page generation and build tracing. Static inspection found 27/27 document pages and overview links, CW-010/BZ-016 and the new discussion/backend cards, with no archived document pages. The final rebuild includes this evidence section. No dependency files were changed. The initial `pnpm build` launcher failed due sandboxed pnpm package-manager bootstrap attempting `/root/.local`; direct Next.js execution used the already-installed tree successfully. This is not a fresh dependency install proof.

No unit tests were rerun for this documentation-only change; the earlier 178-test result remains P01.1 evidence, not a new result. Browser/mobile/theme/search interactions, diagram rendering and deployment remain unverified. A Node-only Mermaid parse attempt was blocked by unavailable DOMPurify browser hooks; it does not establish a diagram syntax error or browser success. Source Mermaid fences are included and diagram rendering needs the same manual browser gate as P01.1. No live model/account/tool/security/admin tests were performed. Detailed command/status, source file comparisons and generated route coverage are retained in `docs/delivery/P01.2_VERIFICATION.json`.

## P01.3 planning-delivery verification

This is a documentation-only delivery. Validate all current Markdown links, observed route inventory against source, unique IDs, baseline source/history byte preservation, ZIP CRC and complete current-document projection. Run `node node_modules/next/dist/bin/next build` using the existing installed dependencies, including build lint/type checks; inspect static output for all 30 sources and updated CW-011/BZ-019 records. Exact outcomes are recorded in `docs/delivery/P01.3_VERIFICATION.json`; a failed command must remain visible there. No new unit tests are needed for unchanged application behavior. Prior test results are historical, not a fresh test run. Browser/theme/mobile/Mermaid interactions, deployment and provider/database tests remain unverified.

Before accepting workspace implementation, test two-site persistence, cross-tenant/direct-API/revocation denials, existing project mapping, fresh/upgrade migration compatibility, legacy public/share/editing/revision flows and relevant voice command contracts. Owner checks the create/connect labels and URL-only read-only behavior on preview. These are future acceptance gates, not package 1.3 passes.

## Package 1.4 — source verification and mandatory live gates

Local regression: `node node_modules/vitest/vitest.mjs run` passed **42 files / 214 tests**. Four new test files cover domain/URL/attestation schemas, membership/entity scoping, viewer/owner-only denials, original project ownership, conflicts, strict API/session/origin/body boundaries and user-visible read-only/planned/empty/metric content. Store/database calls are mocked in these tests; **they do not prove real PostgreSQL RLS or applied migration state**. Existing portfolio/template/voice/domain tests remain part of the passing suite.

Type check, standalone lint, production build, observed route inventory, local Markdown links, complete static document projection, preserved historical SQL/source and archive checks are recorded precisely in `docs/delivery/P01.4_VERIFICATION.json`. Environment uses existing installed dependencies with unchanged lockfile, not a fresh dependency install. A React test initially required the same JSX test-global setup as existing tests; corrected and final suite passes. An early type check caught an incorrect prop on SiteMetrics during the read-only empty-state refinement; corrected before final checks.

`supabase/tests/018_workspace_acceptance.sql` is an executable staging transaction with temporary user fixtures and rollback, covering atomic membership/two-site persistence, owner/editor/viewer roles, cross-tenant/anon/direct-write/self-grant denials, revocation, original project privacy, stale versions, duplicate links and old project deletion. It was **not run**: no local PostgreSQL engine or authorized remote DB configuration is available. Check remote 001–017 history and migration-number collisions before applying 018; no old migration was changed.

No usable `agent-browser`/browser executable is available here. Browser sessions, real preview/mobile/theme/focus/hydration, actual Supabase persistence, auth-email flow, live voice/provider behavior and deployment remain unverified. Source content rendering is covered by tests/static output, not screenshots. Record those results before accepting P01.3. No production database, external account, domain content or deployment was changed.

## Package 1.5 — verification scope

Added tests for anonymous/ordinary/AAL1/admin/revoked direct API paths, untrusted metadata, malformed responses, DB denial after an app check, no-store/redacted errors, page redirects, exact UTC audit rendering and truthful metric/planned labels. The final suite, build and archive results are recorded in `docs/delivery/P01.5_VERIFICATION.json`. Database calls are mocked in these tests; they do not prove RLS or real MFA.

`supabase/tests/019_admin_acceptance.sql` supplies transactional staging assertions for grant idempotence/audit, AAL1 denial, AAL2 admin read, ordinary AAL2 denial, private-table/self-grant/write denial, tenant isolation, revocation and anonymous denial. It was not executed because no local PostgreSQL or authorized remote DB is configured. New operator/manual checks are in runbook 21. Package 1.4 workspace SQL/browser gates remain open. No production mutation, account grant, live MFA test or deployment occurred.

Existing installed dependencies were reused. A test mock needed an explicit unknown cast during type checking. The pnpm layout needed NODE_PATH pointing at its existing `.pnpm/node_modules` for local ESLint plugin resolution; no dependency or lockfile change was made. There is no usable local browser runner; production HTTP/static output checks cannot replace browser screenshots, cookies, keyboard or MFA acceptance.

Final local verification: **45 files / 242 tests**, TypeScript and ESLint passed; production build passed with the inherited `globals.css` autoprefixer warning about `start` versus `flex-start`. Eleven production HTTP checks verified admin setup states, no-store unavailable API responses, unsupported POST rejection and existing entry/docs routes. Static HTML contains all31 document pages,110 unique route IDs,13 completed-work records and24 activity events. A check-script header-case mismatch was corrected; HTTP field names are case-insensitive. No application authorization failure was bypassed. Final QR normalization encodes SVG data safely for the installed SDK's raw data-URL format.

## Package1.6 — stronger local verification, bounded claims

The250-test/47-file local suite adds numeric package ordering, future-prose exclusion, missing-record behavior and overview/detail label regressions. Optional SQL tooling executes the actual migration/assertion files against PostgreSQL18.3 via PGlite0.5.8 with explicit Auth/Storage/JWT compatibility fixtures. Existing018/019 assertions pass. New020 recovery assertions fail against019 with `bz_user_not_found`, then pass after additive020. A separate upgrade scenario preserves legacy portfolio/workspace/site/grant/audit data.

Actual Chromium/Playwright checks replace the earlier absence of any browser evidence for the tested public/setup paths. The final browser report covers themes, search, navigation, diagrams, mobile containment, skip focus, setup states and API failure behavior; exact outcomes/screenshots are in `docs/delivery/P01.6/`. Authenticated workspace/MFA sessions are not mocked into a passing browser claim. Runtime Supabase/Auth/PostgREST/target PostgreSQL/concurrency/deployment and owner acceptance remain open. Final type/lint/build/source-preservation/archive checks are in `docs/delivery/P01.6_VERIFICATION.json`.

Verification tooling discoveries are recorded honestly: standard browser setup encountered TLS/download/daemon problems; a separate local Chromium binary was used with Playwright. A browser assertion needed source text instead of CSS-uppercase `innerText` when checking detail metadata. No application permission check was bypassed to obtain a passing result. See document22 for repeatable commands and fixture boundaries.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
