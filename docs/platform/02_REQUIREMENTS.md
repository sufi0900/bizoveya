# Requirements register

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Draft 0.1.** P0 means core path; P1 means next capability; P2 means candidate. All below are **Proposed** for Bizoveya unless marked inherited. Acceptance needs observable evidence in `11_VERIFICATION_AND_RELEASE.md`; phase numbers are in `10_PHASES_AND_STATUS.md`. Changes retain IDs and record revisions in CHANGELOG/ADR.

| ID | Priority / phase | Requirement and acceptance signal |
|---|---|---|
| BR-01 | P0/P01 | Authenticate owner and choose create-native or connect-existing. Both produce a workspace/site record with a visible state. |
| BR-02 | P0/P01 | Workspace holds multiple sites with distinct owner, site type, capabilities, and role-scoped access; test two sites without data crossover. |
| BR-03 | P0/P02 | Native site supports portfolio and business types; business has services, proof, CTA/contact and mobile/public SEO; legacy portfolio remains readable/publishable. |
| BR-04 | P0/P03 | Owner can upload documents and approve scoped, versioned facts; retrieval cites provenance, refuses cross-site data and exposes correction/deletion. |
| BR-05 | P0/P04 | Manager uses configured Nebius NVIDIA model in a verifiable core workflow; model returns validated structured tasks with bounded tool permissions and cost trace. |
| BR-06 | P0/P05 | Connect an existing Sanity site with least privilege; read, prepare draft, show diff, request approval, write draft and read back; handle stale revisions. |
| BR-07 | P0/P06 | Run a persisted text meeting with agenda, role turns, transcript, owner decision and linked action tasks; reload reconstructs state. |
| BR-08 | P0/P06 | Owner may ask status, amend, pause, reprioritize, cancel or emergency-stop a task; safe checkpoints prevent repeated external actions. |
| BR-09 | P1/P07 | Content→visual brief/asset→Pinterest handoff records provenance and waits for channel permission/approval; show failure and recovery. |
| BR-10 | P1/P08 | GitHub connection can produce a constrained branch/PR and checks; Vercel preview/status links; no direct default-branch write by agent. |
| BR-11 | P1/P09 | Register and validate first-party sites independently, including paused LIONXE; no forced rebuild/migration. |
| BR-12 | P1/P10 | Public website assistant answers from approved public facts, captures consented leads, supports human handoff, logs cost and rate limits. |
| BR-13 | P2/P10 | WhatsApp bot adapter through official eligible channel credentials; simulator/test session before live; account/policy/usage cost visible. |
| BR-14 | P2/P10 | Phone voice assistant connects telephony/STT/TTS/model under provider terms; barge-in and escalation tested; usage costs visible. |
| BR-15 | P1/P11 | Customer onboarding exposes capabilities, usage/quota, support/export/delete paths, and explicit publish permissions. |
| BR-16 | P0/P12 | Hackathon demo shows real qualifying model invocation and substantive new work beyond original Voxfolio. |
| BR-17 | P0/P01.0 | Public in-app document room renders all current `docs/platform/` Markdown and decisions, searchable and readable on desktop/mobile, excluding historical archive; page refreshes with each source/deploy and exposes no secrets. |
| NF-01 | P0/all | Tenant isolation at DB/RLS, storage, retrieval, connectors and job boundaries; two-tenant negative tests. |
| NF-02 | P0/all | External side effects require receipt/idempotency key, audit entry and appropriate human gate; retry cannot double publish. |
| NF-03 | P0/all | Secrets server-only; no secret values in code, logs, docs, exports or demo; rotate/revoke connector grants. |
| NF-04 | P0/all | Keyboard/screen-reader pathways, contrast and reduced motion, responsive states and clear errors. |
| NF-05 | P0/all | Failure of a model/provider/connector preserves saved work, surfaces status and allows safe retry or manual action. |
| NF-06 | P1/all | Per-run budgets, token/provider telemetry and retention/erasure rules; numerical thresholds set after measurement. |
| NF-07 | P0/all | No new phase accepted without automated evidence, required owner manual proof and docs updated with code. |

**Inherited, not Bizoveya completion:** Voxfolio already has portfolio onboarding/Studio/public routes and visitor knowledge endpoints. Existing behavior still needs baseline and regression testing. An older workforce proof or historical note is not evidence for BR-07–09. Each proposed requirement can be revised or removed through a documented decision; the owner may change priorities at any time.

## Configuration and administration extension — package 1.2

All additions are **planned**, under [ADR-0002](decisions/ADR-0002-configurable-agents-and-admin-control.md); none is implemented by this package.

| ID | Priority / phase | Requirement and acceptance signal |
|---|---|---|
| BR-18 | P0/P01.4 | Named platform administrators authenticate with MFA; normal clients cannot enter protected admin APIs or self-grant platform roles; test direct API access and role revocation. |
| BR-19 | P0/P04.1–P04.4 | Supported agent defaults, QA criteria, tools and model profiles have draft/validate/test/activate/rollback versions; new runs pin a snapshot and existing runs do not silently change. |
| BR-20 | P0/P04.1–P04.3 | Protected credential room adds/tests/rotates/revokes provider credentials through server secret references; UI/log/export contains no plaintext stored secret; expired/revoked grants prevent future unauthorized use. |
| BR-21 | P0/P04.3–P04.5 | Runtime resolves approved model profile per task, records provider/model/config/usage, enforces permitted fallback and budget, and combines specialist judgment with deterministic validation and approved tools. |
| BR-22 | P1/P02.1 | Admin manages template content/category/preview/version only within approved schema/components; unsupported arbitrary code is rejected; existing portfolio regression tested. |
| BR-23 | P1/P11.1 | Admin views defined operational metrics, scoped client lifecycle and audited support access; recently active and online are distinct; private documents are not globally exposed by default. |
| NF-08 | P0/admin | Every global config/credential/permission change records actor, time, reason and redacted before/after version references; MFA/reauthentication gates sensitive changes. |
| NF-09 | P0/agents | Platform controls outrank agent defaults and client instructions; hostile document/task instructions cannot expand tools, spend or tenant access. |
| NF-10 | P0/config | Version and credential-reference transitions are atomic and recoverable; activation failure preserves prior config; stop/revoke reconciles in-flight side effects. |

BR-05 now explicitly includes the application-run SDK/adapter evaluation and live qualifying Nebius NVIDIA workflow. BR-09 quality acceptance includes provider-specific required fields/URL/board/asset/duplicate checks as well as model review. BR-17 includes the new discussion/backend/ADR documents through the existing dynamic Markdown registry. A prompt never constitutes a guarantee of zero mistakes.

## Package 1.3 transition and impact synchronization

| ID | Priority / phase | Requirement and acceptance signal |
|---|---|---|
| BR-24 | P0/P01 and ongoing | Maintain stable route/capability/action dependency mapping; each change lists direct/transitive impacts and synchronizes contracts, consumers and docs. |
| NF-11 | P0/transition | Preserve legacy public/share URLs and portfolio records during additive workspace transition; prove migration compatibility, tenant isolation and affected regressions. |

The canonical scope and acceptance procedure are in [19_DEPENDENCIES_AND_CHANGE_IMPACT.md](19_DEPENDENCIES_AND_CHANGE_IMPACT.md) and [20_ROUTE_AND_TRANSITION_REGISTER.md](20_ROUTE_AND_TRANSITION_REGISTER.md). Both are plans, not functioning controllers or future endpoints.

## Package 1.4 — first practical workspace implementation

| Requirement | Package 1.4 evidence | Status / remaining gate |
|---|---|---|
| BR-24 / NF-11 | Route IDs, actual API/data contracts, impact record, additive migration 018 and preserved legacy tests | Implemented/documented; fresh/upgrade/live RLS checks pending |
| Workspace/multi-site entry | Six protected workspace pages, four API route files, atomic membership bootstrap, external/native record modes | Code and mocked authorization tests; real Supabase/browser walkthrough pending |
| Portfolio compatibility | Existing owner-only editor APIs untouched; link requires original project ownership; FK clears a deleted source | Existing 178-test baseline passes; staging/public/voice regression still required |
| BR-18–BR-23 | Still planned as previously scoped | No platform-admin, credential/config, model-runtime or template administration implemented |

A native business registry entry is a **planning record**, not a working business website. External registration stores a URL, not a writable connector grant. No future feature requirement is checked by the presence of its plan.

## Package 1.5 — admin requirement evidence

| Requirement | Implemented scope | Acceptance boundary |
|---|---|---|
| BR-18 | Operator-only platform grant, verified session, TOTP/AAL2 global read gate, per-request revocation check, direct API guards | Code/local tests; real database/MFA/browser verification pending |
| NF-08 | Atomic grant/revoke audit with actor principal, declared operator, timestamp, subject and reason | App roles cannot write audit; operator identity is not independently attested; future config/credential writes and fresh-auth checks not implemented |
| BR-19–BR-23 / NF-09 | Scope preserved for later agents/configuration/credentials/operations | No acceptance claimed from the existence of an admin shell |

Runbook 21 defines metric meanings, direct-RPC tests, recovery and manual gates. No global tenant-content access or client-to-admin self-elevation is introduced.

## Package1.6 — regression evidence

BR-18/NF-08: migration020 corrects operator revocation after Auth soft deletion, preserving grant eligibility and audit behavior. The new recovery SQL first failed against019 and passes with020. BR-24/C-DOCS: release/count labels now derive from the package register and document inventory rather than fixed1.1/24 strings. Unit/browser checks cover that relationship. Executed local SQL/RLS and browser tests narrow the earlier evidence gap; real Supabase Auth/MFA/PostgREST and production acceptance remain unverified. No new commercial feature requirement is accepted.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
