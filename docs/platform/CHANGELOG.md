# Living documentation changelog

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
