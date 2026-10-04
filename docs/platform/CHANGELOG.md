# Living documentation changelog

## Current checkpoint — 1.23 / P04.3.3.4

Server-only bounded draft engine is implemented with exact private request records, one attempt per Coordinator/Content/Quality role, approved-citation validation, durable output/usage settlement and no automatic retries. Additive036 revalidates execution dependencies and repairs connectivity admission to include campaign spending. No Generate route, activation, provider request, customer publication or hosted SQL was performed. See [43 Draft runtime and testing](43_DRAFT_RUNTIME_AND_TESTING.md). This block supersedes older current-state blocks below; those remain historical.

Founder reports034/035 applied; screenshots confirm three agentv2 approvals, Gemini assignments and prepared campaignv3 snapshot/3 stages/count1. Refresh persistence and all other unevidenced manual checks remain pending. Next is authorized dispatch, saved output review and explicit founder pilot activation within the same unfinished P04.3.3 phase.


## Source1.22 — P04.3.3.3

Added migration035 private generation stages, ordered service-only reservation/settlement, shared profile/day accounting across connectivity tests and campaign stages, combined admin visibility, sanitized stage summaries and synthetic SQL coverage. Updated manual/setup and dependency records. No provider execution, hosted SQL, deployment-setting change, visual composition or publication.

## Source1.21 — P04.3.3.2

Added migration034 private generation-run snapshots, sanitized campaign run history, a safe prepare control/API, campaign plan/draft/QA schemas and SQL assertions. Updated founder evidence, direct-main delivery policy, Nebius Pakistan access evidence and living docs. No provider execution, spending reservation, hosted SQL, deployment setting change, visual composition or publication.

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


## 2026-09-29 — Draft 0.1 (P00 in progress)

- Created first drafts of the 13 core specifications, handoff template and open-questions register within the Bizoveya package.
- Working commercial label changed from rejected Sitevanta to **Bizoveya**, provisional. Historical Voxfolio code labels and release documents remain preserved.
- Classified V27.12 as inherited baseline, separated verified code from proposed Bizoveya functionality, and left P00–P12 unaccepted pending actual code/environment evidence.
- Established mandatory full-ZIP/current-checkout and all-`docs/platform/*.md` reading order for each new assistant; future edits update all affected documents in the same delivery.
- No application code or SQL migration changed in this documentation delivery. README documentation links changed.

For future entries, include date, requirement/phase/ADR IDs, changed behavior, documents updated, validation and reason for any superseded decision. Preserve previous entries.

## 2026-09-29 — Draft 0.2 (documentation process)

- Added `COMPLETED_WORK.md` as a current snapshot of completed work only and `ACTIVITY_LOG.md` as an append-only PKT chronological record, including reversals and skips.
- Updated index, phase ledger, verification and handoff to require both records after future work. Historical events are sourced to owner messages and package creation metadata; exact times are marked unknown where unavailable.
- No Bizoveya application feature source or SQL changed.

## 2026-09-29 — Bizoveya package 0.4 (P00.4)

- Established independent `0.n` Bizoveya ZIP numbering and phase sub-implementations; recorded inherited/source and every produced ZIP in `PACKAGE_VERSIONS.md` without rewriting old filenames.
- Updated index, completed-work snapshot, activity log, phase ledger and handoff format to record exact filenames and phase.substep. P00 parent remains unaccepted. No application code or SQL edited.

## 2026-09-29 — Bizoveya package 0.5 (P00.5)

- Added user/officer manual, operating rubric, commercial presentation source and inspected six-page PDF, plus a proposed Sites documentation portal plan. The manual labels unimplemented paths and does not invent working customer actions.
- Updated index, completed-work snapshot, event log, ZIP register and P00 substep status; no application code, SQL or public Site deployment changed.

## 2026-09-29 — Bizoveya package 1.0 (P01.0, browser review pending)

- Added public `/bizoveya/docs` overview and `/bizoveya/docs/[slug]` pages inside the inherited Next.js application, sourcing current Markdown at build time. Search, categories, progress, activity, tables, navigation and Mermaid diagram rendering are included. Historical Voxfolio documents are excluded.
- Superseded the standalone PDF and proposed separate Sites portal in package 0.5. Updated requirements, route and architecture contracts, design, manual, presentation source, portal contract, phase ledger, register and logs. The old 0.5 archive stays in the version lineage.
- Existing application source outside the new room and SQL migrations remain unchanged. Typecheck, automated tests, production build, archive checks and browser review are recorded in verification; P01.0 is not accepted until live visual validation.

## 2026-09-29 — Bizoveya package 1.1 (P01.1, visual review pending)

- Refined `/bizoveya/docs` into a dashboard with an explicit phase map, labeled metrics, completed-work cards, dated activity timeline, search/filter library and more expressive document pages. Visuals are parsed from the living Markdown records.
- Added persistent light/dark mode, system-preference default, dark Mermaid redraw, responsive layouts and print/readability treatment. No SQL or customer feature changes.
- Updated phase and package lineage, manual, route/design/portal docs and evidence logs. Browser/mobile/owner visual acceptance remains open.

## 2026-09-30 — Bizoveya package 1.2 (P01.2 documentation synchronization)

- Captured founder development pause, competitive concerns, Muse embedding/model/geography questions, API key and instruction correction, SDK/hosted integration, coordinator/QA, super admin and this synchronization request in D01–D08. No unavailable transcript or exact past time invented.
- Added protected backend/admin planning contract and ADR-0002. Updated requirements, route proposals, architecture/data/runtime/connectors/security/design/manual/rubric/presentation/hackathon and acceptance gates.
- All application/dependency/SQL bytes retained from 1.1. Existing public visual room automatically projects 27 current Markdown documents after rebuild. No product admin/secret-store/SDK installed or deployed.
- Explicitly reassigned the undelivered workspace shell from P01.2 to P01.3; new admin identity P01.4 and P04/P02/P11 substeps planned. Parent phases remain unaccepted.

### Exact changed-file inventory

**23 existing Markdown documents updated:**

- `00_INDEX.md`
- `01_ORIGIN_AND_PRODUCT.md`
- `02_REQUIREMENTS.md`
- `03_EXPERIENCE_AND_ROUTES.md`
- `04_SYSTEM_ARCHITECTURE.md`
- `05_DATA_AND_MEMORY.md`
- `06_AGENT_OPERATIONS.md`
- `07_CONNECTORS_AND_SITE_MODES.md`
- `08_TECH_STACK_AND_SECURITY.md`
- `09_DESIGN_AND_BRAND.md`
- `10_PHASES_AND_STATUS.md`
- `11_VERIFICATION_AND_RELEASE.md`
- `12_HACKATHON.md`
- `13_USER_MANUAL.md`
- `14_OPERATING_RUBRIC.md`
- `15_COMMERCIAL_PRESENTATION.md`
- `16_DOCUMENT_PORTAL.md`
- `ACTIVITY_LOG.md`
- `CHANGELOG.md`
- `COMPLETED_WORK.md`
- `OPEN_QUESTIONS.md`
- `PACKAGE_VERSIONS.md`
- `PHASE_HANDOFF_TEMPLATE.md`

**3 new Markdown documents:**

- `17_DISCUSSION_AND_DECISION_RECORD.md` — detailed founder question/answer/correction record and source map.
- `18_BACKEND_AND_ADMIN_CONTROL.md` — protected admin, credentials, configurable rules/runtime, lifecycle, routes, QA and acceptance.
- `decisions/ADR-0002-configurable-agents-and-admin-control.md` — planning decision, alternatives and explicit phase shift.

**Other updated file:** package-root `README.md` introduction only. **Preserved:** existing ADR-0001, all archived history and every application/config/dependency/SQL file. No new separate PDF or Sites deployment. Verification report outside the app records exact file hashes/build/link/projection results and ZIP digest; it is supplied inside the ZIP as delivery evidence.

## Bizoveya 1.3 — transition and dependency preparation

Added documents 19/20 and ADR-0003. Synchronized origin, requirements BR-24/NF-11, navigation, architecture, data, agent operations, connectors, security, design, phase plan, verification, manual, operating rubric, portal, discussion/admin planning and handoff/open questions. Added CW-011 and BZ-017–BZ-019; registered exact new ZIP name. Clarified delivery ordinal versus stable work-item IDs. README points to the current planning delivery. Full exact changed/new path inventory and hashes are recorded in `docs/delivery/P01.3_VERIFICATION.json`.

No application code, existing route file, dependency/lock/config, SQL, asset or archive-history edits. Public visual document instances update through existing Markdown generation only. P01.3-Plan documentary completion does not complete the P01.3 workspace feature or any grand phase.

## Bizoveya 1.4 — workspace and site foundation source

Implemented six workspace pages and four API route files, domain and persistence boundaries, responsive dark/light shell and forms, additive migration 018 and staging assertions. Updated legacy portfolio-list/start entry links, robots/private-page metadata, root applicationName and package name/version only (no dependency/lock changes). Added four meaningful test files; final 42-file/214-test suite passes. Updated all 27 top-level platform Markdown sources; three ADR files and historical records are preserved. No new canonical Markdown document is needed; total remains 30.

Stable route IDs R-046–R-055 and API-020 record newly discovered contracts. The six workspace/four API states are source implemented, with live migration acceptance pending. New CW-012 and BZ-020/BZ-021 record code scope and evidence limits; ZIP 1.4 is registered. Exact changed/new path and hash inventory is in `docs/delivery/P01.4_VERIFICATION.json`. Do not report browser/real RLS/production deployment as passed.

## Bizoveya 1.5 — admin identity and control shell

Added three admin pages, two read-only API files, protected app/DB access gates, Supabase TOTP setup/challenge, aggregate overview and UTC access timeline with scoped dark/light UI. Added migration019, staging denial/audit/revocation assertions, operator grant template and three test files. No earlier app features, dependency ranges, lockfile, migrations001–018 or historical files are changed. Package version becomes1.5.0.

New canonical document: `21_ADMIN_SETUP_AND_RECOVERY.md`; total31 current Markdown sources. Updated affected requirements/routes/architecture/data/security/design/phase/manual/operator/hackathon/presentation/portal/impact and record documents. Exact changed paths/counts and hashes are in the delivery verification. Registered R-056–R-060,A-014,API-021 and revised A-001,A-012,API-019 states; CW-013/BZ-022/BZ-023/D12 record actual scope. No separate visual-document copy, PDF or Sites artifact created.

Rejoined the pre-existing isolated CW-010 and ZIP1.2 rows to their table blocks so the visual detail pages retain those historical entries. Historical event text and archives are preserved.

## Bizoveya1.6 — verification and confirmed defect repairs

Added migration020 without editing001–019; recovery regression demonstrates failed-before/passed-after behavior for soft-deleted-account revocation. Fixed docs overview/detail/sidebar release/count metadata and removed stale phase-summary wording. Added two focused unit files (250 tests total/47 files) plus isolated optional SQL/browser tooling with a separate dev lockfile; root runtime dependencies/lock unchanged. Local SQL upgrade fixtures preserve existing data, and real browser screenshots/results cover public/setup paths.

New canonical document22;32 current Markdown sources. Updated affected architecture/data/security/requirements/routes/manual/recovery/portal/design/phase/impact/evidence and delivery records, adding D13/CW-014/BZ-024/BZ-025 and ZIP1.6. Exact paths/hashes and final outcomes are in delivery verification. Earlier history/ADRs remain intact; no new URL, deployed environment or AI/provider feature is claimed.

Admin setup notices now link to the current runbook rather than freezing a migration range in the interface. The notice regression checks that link.

## Bizoveya1.7

Public/admin Next.js app separation, admin-only sign-in/no public signup, distinct host-only sessions/refresh, public404 for removed admin paths/APIs, root workspace commands/lockfile, docs tracing. Adds manual-testing record23, deployment runbook24, ADR-0004. Updates affected architecture/security/routes/manual/phase/dependency/release records. Existing SQL/history preserved. No new business builder/agent/config-editor feature; no remote deployment.


## 1.8 / P02.1

Bizoveya public entry, dark/light marketing, two guided journeys, business/portfolio category catalog, interactive Service Studio demo, private business draft editor and GET/PUT API. Former root Studio moved to/portfolio; unchanged project APIs/publication routes. Added021_business_drafts.sql and rollback-only assertions. Source and DB validate document/role/version; draft export and explicit unsaved/conflict/status messages. Updated affected docs and added25/ADR-0005. Package1.7 deployments recorded with authenticated tests pending. No new runtime dependencies/env keys, admin feature or public business publish route. See delivery inventory for exact changed paths.


## 1.9 / P02.2 — 2026-10-02 00:54:59 PKT

Added shared typed sections and three business presets; visual outline/canvas/inspector, layout/tone/brand choices, reorder/hide/duplicate/delete,30-edit local undo/redo, optionalHTTPS images/manual testimonial slider/FAQ, JSON restore, safe legacy read migration. Added022strictSQLvalidation/acceptance tests;21previous migrations preserved. Main public templates/home/sitemap updated; admin functional source and portfolio preserved. Added26spec/ADR-0006; affected living docs, founder report, discussion/phase/activity/package/manual updated. Publishing shiftsP02.3. New hosted/founder acceptance pending; final verification in delivery evidence.


## 2026-10-02 — package1.10 / P02.2.Fix-1

Customer journey, authenticated header, workspace/sidebar/create navigation, atomic selected-design creation, normalized duplicate guards, repeat/unchanged save protections and distinct template styling. Added27,ADR-0007,023/operator/assertions/auth harness. Current contracts updated in: 00_INDEX.md, 02_REQUIREMENTS.md, 03_EXPERIENCE_AND_ROUTES.md, 04_SYSTEM_ARCHITECTURE.md, 05_DATA_AND_MEMORY.md, 07_CONNECTORS_AND_SITE_MODES.md, 08_TECH_STACK_AND_SECURITY.md, 09_DESIGN_AND_BRAND.md, 10_PHASES_AND_STATUS.md, 11_VERIFICATION_AND_RELEASE.md, 13_USER_MANUAL.md, 14_OPERATING_RUBRIC.md, 15_COMMERCIAL_PRESENTATION.md, 16_DOCUMENT_PORTAL.md, 17_DISCUSSION_AND_DECISION_RECORD.md, 19_DEPENDENCIES_AND_CHANGE_IMPACT.md, 20_ROUTE_AND_TRANSITION_REGISTER.md, 22_PHASE1_VERIFICATION_GUIDE.md, 23_FOUNDER_MANUAL_TESTING.md, 24_DEPLOYMENT_AND_ENVIRONMENTS.md, 25_BUSINESS_BUILDER_AND_TESTING.md, 26_BUSINESS_TEMPLATES_AND_SECTIONS.md, OPEN_QUESTIONS.md, PHASE_HANDOFF_TEMPLATE.md. Activity/completed/package/changelog records updated;41 sources in visual room. Specific1.9 failures remain recorded; hosted1.10 acceptance pending.


## 1.11 / P02.3.1

Added explicit saved publication snapshots, private version/action history and sanitized public visitor rendering, basic SEO and contact links. Additive024; no older migration modifications. Corrected QA-discovered published author instructions, hidden-data payload exposure and unknown status reporting. Updated current docs and phase dependency/acceptance records;1.10 retest still pending.


## 1.12 / P02.4

Added three distinct families, six total; shared demo page composition, schema/025 compatibility and unified deferred setup/tests. Preserved existing templates/portfolio/admin/history. Fixed new dark-family text/tones and aligned public hero typography with preview. New owner manual acceptance pending.


## 1.13 / P03.1

Private text knowledge room for every registered mode; review/explicit owner approval, resets/citations/revisions/export/removal;026 additive and scoped tests. New31/ADR-0010; combined manual30 carries every earlier pending case plus MT053–059. No new env/model/provider/deploy, no pending test marked accepted.


## 1.14 / P04.1

Added preview-only agent configuration/readiness, versioned current-MFA admin controls, role capability shared contract, private site preferences/approved context preview and027. New32/ADR-0011 and living affected records/manual pending updated. Previous migrations/history preserved. Live models/secret management remain planned.

Also corrected stale homepage counts/capability copy and improved preference labels/new-draft dirty guards. Local evidence:339 unit cases,39 SQL steps,85 browser checks,23 screenshots; real acceptance pending.


## 1.15 / P04.2.1

Model candidate profiles/history/current reference checks; fixed env references/reviewed enable/disable/record-rotation and events; boolean current-admin-deployment presence;028. No secret value forms/database/provider calls/runtime binding. Updated living docs;33 and ADR-0012 new;30 accumulates all pending cases.

##1.16 / P02.5

Studio corrections, focused digital-service styling, optional logo/photo fitting, signed-in onboarding, permanent owner deletion029,34/35/ADR0013,MT075–086. Publishing pilot deferred, runtime/visual composer/multipage/uploads still planned.

## Package1.17 / P04.0 — 2026-10-03T00:54:03.490300+05:00

Actor: ChatGPT Codex assistant, authorized by founder continuation while testing1.16. Model connectivity room, fixed SDK adapters, versioned redacted evidence and030 implemented;36 and ADR-0014 added. Exact ZIP Bizoveya_1.17_Model-Connectivity-Tests.zip. Local verification is recorded in docs/delivery/P04.0; founder/hosted/live-provider checks remain pending. No provider request, remote migration or deployment performed. Next ordinal1.18.

## 1.18 / P04.3.1

Added admin-only model assignments, additive031 and audit events; version/freshness/review validation. Updated25 living documents and added37,38,CONTINUATION andADR0015. Recorded branch/schedule/hackathon decisions and local Gemini evidence. Corrected truncated archive recovery. Spending and generation remain pending.

## 1.20 / P04.3.3.1
Private campaign draft persistence added; source checkpoint only, no AI execution or publication. Founder Gemini settlement evidence recorded.
