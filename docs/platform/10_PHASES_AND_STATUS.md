# Implementation phases and status ledger

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Bizoveya working package 1.6 — no calendar estimates.** Status codes: `[ ]` unaccepted; `[~]` implementation present but required proof incomplete; `[x]` accepted with documented tests and owner confirmation. **All grand phases remain `[ ]`; P01.0/P01.1 code slices are `[~]`, documentary P01.2 has its own narrow completion gate.** This documentation draft is P00 work in progress, not P00 acceptance. Voxfolio V27.12 capabilities are inherited baseline, not newly completed phases. A significant scope change receives an ADR/new phase; small compatible work uses `Pxx.Add-y`; defects use `Pxx.Fix-y` with acceptance evidence. Update this ledger with every delivery. Record only actually completed results in `COMPLETED_WORK.md`; append a time-stamped action/reversal event in `ACTIVITY_LOG.md`. Never conflate the future phase plan, current achievements, and chronological history.

## Phase 0 documentation sub-implementations

| Substep | Status | Actual deliverable and ZIP | Evidence / remaining gate |
|---|---|---|---|
| P00.0 | [x] historical prototype | Sitevanta-named organization prototype, later reversed: `Sitevanta_Voxfolio_V27_12_Organized.zip` | Archive existed; naming superseded by P00.1. Does not mark P00 accepted. |
| P00.1 | [x] completed | Bizoveya working label and organized inherited files: `Bizoveya_Voxfolio_V27_12_Organized.zip` | Byte comparison of source files; ZIP integrity; see activity log. |
| P00.2 | [x] completed | First 13 core documentation drafts: `Bizoveya_V27_12_Documentation_Draft_01.zip` | Nonempty/link checks and package CRC; document drafting only. |
| P00.3 | [x] completed | Completed-only and activity records: `Bizoveya_V27_12_Documentation_Draft_02.zip` | No app/SQL changes; records present; package CRC. |
| P00.4 | [x] completed for documentation, acceptance of parent still pending | Independent Bizoveya `0.n` package registry and substep rules: `Bizoveya_0.4_Versioning-and-Docs.zip` | ZIP inventory, links and checksum in delivery handoff. |
| P00.5 | [x] historical documentary delivery, later revised | Prelaunch user manual and operating rubric; package 0.5 also contained a PDF deck and Sites plan, both superseded by owner correction in package 1.0. | The original package remains in history; current materials are Markdown and in-app route. |
| P00.6 | [ ] pending | Reconcile current Git HEAD, deployment, applied migrations, earlier workforce code, live voice and full install/checks | Owner environment/permissions and recorded evidence needed. |

A checked substep means its narrow documentary/archive deliverable exists, **not** that P00 is accepted or a product feature is live. The parent P00 stays `[ ]` until baseline gates pass. P01.0 implements the document room without completing P01. Package 1.2 uses P01.2 for discussion/document synchronization; the undelivered workspace shell is explicitly moved to P01.3 under ADR-0002. P01.1 refines the room visually; package versions follow the delivered substep. See `PACKAGE_VERSIONS.md` for the exact ZIP lineage and naming rule.

| Phase / status | Outcome and implementation scope | Prerequisite and acceptance evidence | Owner action |
|---|---|---|---|
| [ ] P00 Baseline and documentation | Compare latest Git/ZIP/deployment; inventory routes, schema, env, older workforce code; author living docs, history and initial test plan. | Current branch and deployment reconciled; fresh/upgrade migration state, typecheck/test/build and V27.12 voice/manual results recorded; docs linked. | Provide Git/deploy access or results, migration state and owner-run live checks. |
| [ ] P01 Workspace shell and document room | P01.0 in-app public document room implemented; P01.1 dashboard refinement built; P01.2 documentation synchronized; P01.3 membership/site registry source in 1.4 and P01.4 admin identity source in 1.5; live acceptance pending. | Two sites under one workspace, another tenant denied; no modification on register; navigation test. | Enter first-party sites and check labels/ownership. |
| [~] P01.0 Document room | Code for `/bizoveya/docs` overview, searchable current Markdown and document pages, Mermaid diagrams, public responsive styling. Package `Bizoveya_1.0_In-App-Document-Room.zip`. | TypeScript/tests/build and static output pass; browser/owner acceptance and actual deployment pending. | Open on preview, search, navigate every category and inspect mobile/diagrams. |
| [~] P01.1 Visual document dashboard | Markdown-derived analytics, phase visualization, completed-work cards, activity timeline, rich reading maps and persistent light/dark mode. Package `Bizoveya_1.1_Visual-Document-Dashboard.zip`. | Typecheck/tests/build/static output and ZIP checks; browser/mobile/theme/owner acceptance pending. | Check actual rendering and interact with the theme switch, search and navigation on preview. |
| [~] P01.3 Workspace shell | Package 1.4: membership bootstrap, multi-site registry, two entry paths, scoped navigation and real APIs in source. | 214 local tests; type/lint/build checks; live migration/RLS and browser/owner acceptance pending. | Apply staging 018, run SQL acceptance script, add first sites and inspect roles. |
| [ ] P02 Native business builder | Business document/section contracts, responsive template, guided business onboarding, public SEO/contact; preserve portfolios and publish revision path. | Fresh business preview/publish + old portfolio regression, mobile/keyboard/metadata proof. | Pick starter template direction, supply approved sample business facts, publish test. |
| [ ] P03 Business knowledge | Upload/extract, approve facts, version/provenance, site-scoped retrieval and erase/export policy. | Cross-site and private/public negative tests, owner corrects a fact and sees revision. | Approve sample documents/facts per site. |
| [ ] P04 Nebius agent core and configurable operations | Application SDK/adapter proof, versioned agent rules/model profiles, credential references, evaluations, validated NVIDIA gateway, bounded worker, budgets, failures and run trace. | Real configured Nebius runtime trace with model ID; invalid output/failure/retry proof and budget visibility. | Configure secret privately, check credits and test task. |
| [ ] P05 Existing-site content | Sanity capability auth, read/draft/diff/approval/write/readback, revision conflict; imported Markdown policy. | One authorized draft round-trip, conflict test, no accidental publish. | Authorize chosen dataset, inspect draft in Sanity. |
| [ ] P06 Meetings and interrupts | Durable text meeting roles/transcript/decision/tasks; status, amend, pause, priority, cancel, stop, resume. | Reload/restart preservation; in-flight action reconciled, no duplicate side effect. | Join meeting, intervene and approve decision. |
| [ ] P07 Content/distribution | Research→content draft→visual brief/asset→Pinterest draft/approved action with dependencies and receipts. | End-to-end real or bounded test, failure resume and provider capability proof. | Connect channel and approve sample action if supported. |
| [ ] P08 Code/deploy connector | Selected-repo GitHub App, branch/PR/checks, Vercel preview/status and rollback path. | Scoped permission, diff/preview, failed check and revocation exercise. | Install grant for test repo, review PR and preview. |
| [ ] P09 Three-site validation | Register and exercise Do It With AI Tools, Sufian Mustafa, LIONXE separately; allow LIONXE read-only. | Verified domains/stack/grants and one meaningful task for each allowed site. | Confirm exact domains, repos, CMS, paused status and results. |
| [ ] P10 Customer conversations | Public web assistant/lead consent and handoff first; later WhatsApp and phone adapters behind account/policy/budget gates. | Public/private boundary, visitor tests and consent/lead record; per-channel simulator and live capability proof only when built. | Supply approved FAQ/policy, test customer questions, provider accounts if selected. |
| [ ] P11 Commercial operations | Assisted/self-service setup, usage/cost, support/export/delete, quota and possible billing decision. | New customer walkthrough, quota and support simulation, plan policy and data export. | Approve pricing/limits and test as a fresh user. |
| [ ] P12 Hackathon/release gate | Judge path, model evidence, source license/README, public video, submission narrative and reliable demo. Can progress beside other phases; final acceptance after stable demo. | Official criteria checked, judge test, actual submission assets/evidence linked. | Approve public code/video, test judge path, submit. |

**First proof slice:** P01, P03, P04 and a bounded part of P05–P07, plus P02 if reliable. This is a proposal; never claim unfinished P08–P11 in a demo. New owner instructions can reorder work with dependencies and ADR documented. The initial P00 document drafting is separate from later code implementation. Each phase handoff records requirement IDs, changed paths/migrations, tests, owner actions, open defects, source commit and next step. `OPEN_QUESTIONS.md` holds unresolved decisions. Any skipped, removed or reversed phase gets an activity-log event and an ADR/requirement update; keep the former state visible there.

## Revised substeps after founder research pause — ADR-0002

| Substep | Status | Scope / acceptance |
|---|---|---|
| P01.2 | [x] documentation delivery only | `Bizoveya_1.2_Discussion-and-Backend-Plan.zip`: D01–D08 record, backend/admin contract, ADR and synchronized docs; archive/source/link/visual generation checks in verification. No admin/agent feature acceptance. |
| P01.3 | [~] source implemented in package 1.4 | Workspace shell previously reserved as P01.2; documentary preparation 1.3 then source delivery 1.4. Actual tenant/registration/upgrade/browser proof still required. |
| P01.4 | [~] source implemented; live acceptance pending | Package 1.5: operator grant/revoke, TOTP, protected overview/audit, app+DB guards. Depends on staging acceptance of P01.3/018 and 019. |
| P02.1 | [ ] planned | Supported business-template metadata/content/category/preview and version administration; layout components still code. |
| P04.0 | [ ] planned | Evaluate application-run SDK against exact Nebius NVIDIA model, typed tools/output, task trace and recovery; select runtime through evidence. |
| P04.1 | [ ] planned | Agent/config/version schemas, model catalog and secret reference design; migration/permission proof. |
| P04.2 | [ ] planned | Protected config and credential management APIs/forms; bounded secret test/rotation/revocation without exposure. |
| P04.3 | [ ] planned | Runtime binds snapshots, client preferences, approved profile, budgets/fallback and scoped tools; real qualifying task. |
| P04.4 | [ ] planned | Saved QA cases, draft/test/activate/rollback; compare versions and retain reproducibility. |
| P04.5 | [ ] planned | Runs/errors/usage controls, pause/stop/restart and in-flight receipt reconciliation. |
| P11.1 | [ ] planned | Broader client operations, metric definitions, optional presence, support access, quotas and billing policy. |

P00.6 baseline reconciliation remains pending; no old delivered step is renumbered. The first proof slice can use a compact P01.4/P04 admin core with a bounded P05/P07 task; avoid building the whole global dashboard before demonstrating a useful workflow. No time estimates are assigned. New discoveries can add/reorder substeps with dependencies, an activity event and all affected docs updated.

## P01.3 preparation and first practical transition — ADR-0003

| Work item | Status | Scope / gate |
|---|---|---|
| P01.3-Plan | [x] documentary delivery only | Package 1.3: stable route inventory, dependency/impact register, transition order and synchronized visual source; verification report. |
| P01.3 workspace feature | [~] implemented; live acceptance pending | Baseline reconciliation, additive tenancy/site contracts, real API plus workspace/site/entry pages, legacy editor links, tenant isolation and manual walkthrough. |
| P01.4 admin identity/shell | [~] implemented; live acceptance pending | Package 1.5 source with migration 019, operator runbook and local tests; DB/MFA/browser/recovery gates open. |

ZIP suffixes are delivery ordinals within the grand-phase stream; work-item IDs remain stable when a feature spans multiple ZIPs. Each package names the work items actually changed. This clarification supersedes a strict one-package/one-feature interpretation without renaming old deliveries. Grand P00/P01 gates remain open. First code implementation is the ordered vertical slice in document 20, not every future blank route at once. No calendar estimates are assigned.

## Package 1.4 delivery / P01.3 acceptance gates

| Gate | State | Evidence / next action |
|---|---|---|
| Workspace/site source, APIs and additive migration | [x] code delivered only | Six pages, four API files, domain/persistence layer and SQL 018 in `Bizoveya_1.4_Workspace-and-Site-Foundation.zip` |
| Local regression/authorization/content tests | [x] automated evidence | 42 test files / 214 tests; prior suite retained; delivery JSON records type/lint/build outcomes |
| Live fresh/upgrade migration and RLS isolation | [ ] not run | Operator reconciles remote migrations and runs supplied staging SQL assertions |
| Browser/mobile/theme/auth/owner walkthrough | [ ] not run | No usable browser runner here; owner previews configured app and records results |
| Grand P01 and P00 acceptance | [ ] unchanged | Do not tick parent phases until their full gates pass |

This is package-delivery ordinal 1.4 working on stable P01.3. It does **not** implement the separate P01.4 platform-admin work item. No timeline estimate. Next bounded action is environment/DB/browser acceptance of this slice, then the approved dependent feature; defects can use P01.3.Fix-y and synchronized records.

## Package 1.5 / stable P01.4 acceptance gates

| Gate | Status | Evidence / next action |
|---|---|---|
| Protected identity/MFA/read-only overview/audit source | [x] code delivered only | Three pages, two APIs, migration 019, controlled operator template and runbook 21 |
| Local automated verification | [x] code evidence only | 45 files / 242 tests; type/build/projection/package results in delivery verification |
| Staging SQL, real MFA/session/revocation and recovery | [ ] not run | Run 018/019 assertions, operator setup and manual runbook checklist |
| Browser/mobile/theme/accessibility | [ ] not run | Actual configured browser walkthrough required |
| P01.3, P01.4 and grand phases | [~] subfeatures; [ ] all grand phases | No owner/live acceptance inferred from local source work |

Continuation advances the dependent admin source while P01.3 live acceptance remains pending; it does not assert the dependency passed. Do not activate admin in a real environment until workspace migration/isolation and admin gates are verified. Next package is 1.6 if this stream continues; fix work or verification can occupy that ordinal without renumbering feature IDs. No duration estimates.

## Package1.6 — verified local repairs and remaining gates

| Work / gate | Status | Evidence / remaining work |
|---|---|---|
| P01.4.Fix-1 soft-deleted admin revocation | [x] local code repair | Failing019/passing020 SQL regression; apply reviewed additive020 in staging |
| P01.1.Fix-1 document release/count drift | [x] local code repair | Canonical parser,250-test suite, actual browser metadata check |
| Local SQL migration/policy/assertion execution | [x] bounded local evidence |001–020 in PGlite with compatibility fixtures;018/019/020 assertions; upgrade-data preservation |
| Local browser public/setup paths | [x] bounded local evidence | Report/screenshots in delivery folder; real authenticated sessions are outside this check |
| Hosted DB/Auth/MFA/PostgREST/concurrency/owner acceptance | [ ] not verified | Operator reconciles environment and runs document21/22 staging gates |
| Grand P00–P12 | [ ] unchanged | Local repairs and partial browser proof do not accept a whole phase |

P01.3/P01.4 remain `[~]`. Earlier “no browser/no SQL runner” statements describe earlier packages;1.6 supplies the named local evidence without changing those historical records. Next P01 ZIP ordinal is1.7; it can contain further fixes/verification or separately scoped source work. No time estimates.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.

| Work item | State | Gate |
|---|---|---|
| P01.5 application separation | [~] source delivered1.7 | Two builds, public404 boundary, admin login source; owner hosted/MFA acceptance pending |
| P01.5.Deploy | [ ] owner action | Two Vercel roots/domains/env and staging validation |
| P01.5.Accept | [ ] pending | Real MFA, role/isolation/revocation and moved-workspace regression |

Label later changes Public, Admin or Shared. Preserve existing feature IDs and delivery ordinals; do not restart grand phases. Next stream ordinal1.8. Founder route/site-registration reports pass only the named smoke steps; grand phases remain unaccepted.
