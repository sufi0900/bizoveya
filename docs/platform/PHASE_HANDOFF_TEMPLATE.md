# Phase handoff template — copy for each delivery

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

- **Bizoveya phase.substep/version, exact new ZIP filename, date/time PKT, owner/assistant/tool, source commit or ZIP checksum:**
- **Latest instruction and any change to earlier plan:**
- **Phase and requirement IDs; status `[ ]`, `[~]` or `[x]`:**
- **Baseline comparison:** checkout, original ZIP, deployed version, migration history checked; discrepancies:
- **Files, routes, APIs, migrations and provider configuration changed:**
- **Completed work snapshot:** new/removed/corrected rows in `COMPLETED_WORK.md` (only when verified):
- **Package register row:** exact filename, unique version, SHA-256 in external handoff, ancestor/obsolete ZIPs:
- **Activity log event:** ID, timestamp/time zone, actor/tool, actions, reversals or skipped work, evidence: 
- **Customer-facing documentation:** user manual/screenshots and in-app presentation claims updated; canonical Markdown and `/bizoveya/docs` build/deploy state recorded (standalone PDF/Sites proposal superseded):
- **Documents changed (list every affected canonical Markdown file and ADR):**
- **Automated checks:** exact commands, pass/fail/skip, environment and logs:
- **Live/provider checks:** account/site, redacted trace or receipt, outcome, cost:
- **Owner manual actions and results:** credentials configured privately, preview, approvals and acceptance:
- **External actions already performed:** remote IDs, side-effect receipts, rollback/reconciliation state:
- **Open issues and risks:** severity, reproduction, next owner:
- **Next phase or smallest safe next task:**

The new assistant first reads the newest full ZIP/Git checkout and **all** current `docs/platform/*.md` files, then relevant history and code; does not trust this handoff alone. Store no real credentials, private documents or unredacted transcripts. Update the affected canonical docs, package version register, activity log, completed work snapshot, changelog and phase/substep ticks with each implementation delivery.

## Configuration / discussion extensions

- Discussion IDs/ADR and founder concern/question/answer/correction summary; source and timestamp precision; unresolved choices:
- Config/default-rule/model-profile version before/after; client preference scope; evaluation cases/results; activation/rollback and in-flight snapshot effects:
- Credential reference/version changes only, no values; actor/auth/MFA evidence, rotation/revoke health and side-effect reconciliation:
- Proposed versus implemented admin routes/API/schema/runtime; no completion inferred from documentation:
- All current Markdown slugs rebuilt and public-content review; live visual deployment pending or proven:

Never invent unavailable chat/call transcripts or exact past timestamps. Record corrections without declaring the founder's concern emotionally resolved unless explicitly confirmed. Distinguish planned configuration from executable capabilities needing code.

## Package 1.3 transition and impact synchronization

- **Dependency/change-impact record:** changed route/action/capability/requirement IDs; direct and transitive consumers; compatible schemas, permissions, cache/index invalidation, in-flight snapshots/receipts; affected tests/docs and rollback.
- **Route-state changes:** source-present/scaffolded/implemented/planned/deferred/retired, actual methods/contracts, redirects and remaining owner checks.
- **Package versus work item:** delivery ordinal and exact ZIP name; stable phase work IDs touched; documentary completion must not tick unimplemented feature work.

## Package 1.4 — first practical workspace implementation

For this slice, record migration 018 applied environment/results, staging SQL role/tenant assertions, configured versus unconfigured page/API checks, two-site refresh persistence, native project ownership/duplicate/delete behavior, concurrent version conflicts, and desktop/mobile/light-dark/browser outcomes. Do not carry a “passed” label from mocked store tests to actual Supabase RLS. Package 1.4 is delivery ordinal; work item P01.3 is implemented with acceptance pending, while P01.4 admin shell stays planned.

## Package 1.5 — admin handoff requirements

Record the real staging migration ledger and SQL results, grant issuer/approval privately, redacted MFA enrollment/challenge/session-refresh evidence, ordinary/AAL1/revoked/direct-RPC denials, real metric comparison, grant/revoke audit proof and recovery rehearsal. Link runbook 21. State separately which outcomes are mocked tests, production HTTP checks, real browser behavior or live DB checks. ZIP1.5 delivers stable P01.4 source; P01.3 and P01.4 remain `[~]` until their gates pass. Preserve archive1.4 and all preceding evidence.

## Package1.6 — verification handoff

Carry the failing019/passing020 recovery evidence, executed local SQL report and actual public/setup browser report separately from mocked unit results. Record fixture versions and the unverified Supabase/Auth/PostgREST/concurrency boundary. Include dashboard metadata regression evidence and exact package filename/hash. A future operator must reconcile/apply020 and run real staging tests; public setup screenshots do not complete the authenticated-admin gate.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
