# Implementation phases and status ledger

## Current checkpoint — 1.22 / P04.3.3.3

Migration035 implements private ordered coordinator/content/quality stage records, service-only reservation/settlement, shared profile/day accounting with model tests, fail-closed unknown/overrun handling, combined admin spending visibility and sanitized customer stage summaries. P04.3.3 remains `[~]`: no provider adapter is called and no Generate control is enabled. Apply missing034 then035; MT114–132 remain pending as applicable. See42.

## Current checkpoint — 1.21 / P04.3.3.2

Private generation preparation is implemented behind migration034: durable run IDs and exact campaign/knowledge/preferences/agent/binding/profile/pricing snapshots, plus bounded structured plan/draft/QA contracts. It makes no provider call or spending reservation and produces no output. P04.3.3 remains `[~]`; executable three-stage orchestration, shared032 reservation/settlement, persisted outputs and human review are next. MT110–113 are founder-reported passed; MT114–126 stay pending as applicable. Verified cumulative delivery now targets `main` under the founder's superseding policy.

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

P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

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

P04.2.1 [~] source implemented, hosted/manual pending. P04.2 parent [~]: protected candidate profiles/env-reference metadata delivered; secret-entry dashboard, encryption-store integration, provider-auth test and real rotation/revocation remain deferred. P04.0 SDK/provider proof remains [ ]; P04.3 bounded runtime/binding andP04.4 model evaluations remain [ ]. No timetable; next ordinal1.16.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

P04.1 [~] configuration/context readiness source implemented, hosted/founder acceptance pending. P04 parent [~], not complete. P04.0 SDK/provider proof [ ] remains deferred; no runtime selected. P04.2 [ ] protected credential/model-profile design/API after security and provider requirements review; P04.3 [ ] bounded qualifying runtime; P04.4 [ ] model evaluations/real activation; P04.5 [ ] runtime controls. This split narrows the original P04.1 scope; no secret store/model catalog was silently marked complete. Package1.14, next1.15; no time estimate.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

P03.1 [~] implemented locally, founder/hosted acceptance pending. P03 parent [~], not complete: PDF/OCR/semantic search/future derived-memory policy remain planned. P02.2.Fix-1/P02.3.1/P02.4 and all previously deferred founder checks remain [~]. Package ordinal1.13; next1.14. Next core work P04 configurable agent runtime after revisiting requirements; no time estimate.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

P02.4 [~] source implemented, founder acceptance pending. P02.2.Fix-1 and P02.3.1 remain [~] while testing is deferred. Grand phases are not accepted. Package1.12 cumulative ordinal; next1.13. Next planned core feature P03 approved site knowledge before agent runtime P04. No time estimate. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Founder authorized advancing implementation while testing1.10 later. This explicitly supersedes the previous instruction not to start P02.3 before fix acceptance; it does not accept that fix. P02.2.Fix-1 [~] retest pending. P02.3.1 [~] snapshot publication/SEO/contact links implemented, local verification recorded in delivery. P02.3 parent [~]; working enquiry form/custom-domain strategy and hosted acceptance remain open. P02.4 template expansion, P03 approved business knowledge, and P04 agents remain planned. Package ordinal1.11; next1.12; no timeline estimate.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

**P02.2.Fix-1 [~]** repairs 1.9 authenticated UX/creation/duplicates/design distinction and supplies additive023 plus targeted QA. P02.2 is still [~]: founder-reported specific failures supersede any broad pass for the affected scenarios. P02.3 publishing/contact readiness remains [ ]; do not start it as a substitute for this fix acceptance. Package1.10 is the next cumulative ordinal; stable feature/defect identifiers are independent of package numbers. No calendar estimate or accepted grand phase is added.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

| Work item | Status | Scope / gate |
|---|---|---|
| P02.1 | [x] founder-reported functional baseline | Owner stated all manual testing working before P02.2; per-case environment/security evidence not supplied |
| P02.2 | [~] implemented, new founder checks pending | Modular Studio, three presets, additive022, docs and local verification |
| P02.3 | [ ] planned | Business publication snapshots, SEO, domain policy and working customer-contact acceptance |
| P02.4 | [ ] planned | Expand template families based on owner/customer feedback |
| P03 | [~] source / acceptance pending | Approved business knowledge |
| P04 | [~] configuration source / runtime planned | Configurable validated agent runtime |

This supersedes earlier P02.2-publication proposal. P02 grand phase remains in progress because business publishing is absent. New package ordinal1.9 is separate from stable feature P02.2; next cumulative package1.10. No calendar estimates. Do not infer live MFA or tenant security acceptance from a broad functional report.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


**Current package1.8 / P02.1:** business entry and private drafts implemented; hosted/founder acceptance pending. See25. Prior same-host/planning-only descriptions are superseded.

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
| [~] P02 Native business builder | Business document/section contracts, responsive template, guided business onboarding, public SEO/contact; preserve portfolios and publish revision path. | Fresh business preview/publish + old portfolio regression, mobile/keyboard/metadata proof. | Pick starter template direction, supply approved sample business facts, publish test. |
| [~] P03 Business knowledge | P03.1 private text knowledge/review/approval/revisions/export/erase implemented; PDF/OCR/semantic retrieval and hosted acceptance pending. | Cross-site and private/public negative tests, owner corrects a fact and sees revision. | Approve sample documents/facts per site. |
| [~] P04 Nebius agent core and configurable operations | Application SDK/adapter proof, versioned agent rules/model profiles, credential references, evaluations, validated NVIDIA gateway, bounded worker, budgets, failures and run trace. | Real configured Nebius runtime trace with model ID; invalid output/failure/retry proof and budget visibility. | Configure secret privately, check credits and test task. |
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
| P02.1 | [~] source implemented1.8 | Bizoveya public entry, category catalog, Service Studio manual editor/preview and private saved drafts; hosted acceptance pending. Template version administration remains planned. |
| P04.0 | [ ] planned | Evaluate application-run SDK against exact Nebius NVIDIA model, typed tools/output, task trace and recovery; select runtime through evidence. |
| P04.1 | [~] source / acceptance pending | Versioned admin config and preview approval, site preferences/context preview,027. Model catalog/secret reference design remains deferred toP04.2. |
| P04.2 | [~] partial source / acceptance pending | P04.2.1 candidate profiles/env-reference controls implemented; secret-entry/provider-auth/fresh reauth/real rotation remain planned. |
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


## Package1.8 — P02.1 business entry and draft builder

| Work item | Status | Scope/gate |
|---|---|---|
| P02.1 | [~] source delivered | Public homepage/catalog/demo, preserved portfolio entry, workspace business editor/API and additive021. Local evidence in delivery/P02.1. |
| P02.1.Accept | [ ] pending | Founder hosted save/reload/conflict, role/isolation and portfolio regressions in25/23. |
| P02.2 | [ ] planned | Approved business publishing snapshots/public SEO and domain strategy; separate scoped implementation. |

P01 deployment screenshots prove both1.7 apps Ready; real admin/MFA/isolation gates remain pending. No grand phase is accepted. Current ZIP ordinal1.8; next1.9 per the existing cumulative stream, distinct from stable feature IDs. Owner can reorder priorities with documented dependency/decision impact.

| P04.2.1 | [~] source / acceptance pending | Candidate profiles, versioned fixed env references, boolean presence,028 and MT068–074. |

## Revised next work after founder review

| Work ID | Status | Scope |
|---|---|---|
| P02.5 | [~] source delivered; founder/hosted pending | Studio corrections, optional logo/frame metadata, owner site removal, authenticated onboarding and focused template styling |
| P04.0/P04.3 | [ ] next runtime work | Qualify exact adapter/model, bounded draft-only execution, profile binding, enforced budgets, saved tasks/results |
| P04.DraftVisual | [ ] planned | Pinterest graphic and LinkedIn carousel rendering/edit/export using shared composer |
| P02.Collections | [ ] planned parallel builder work | Multipage, custom collections/listing/detail/menu references, shared media/brand |
| Publishing connectors | [ ] deferred by founder | CMS/social write approval and receipt/retry semantics after draft pilot |

Old P02 source delivery is not full commercial acceptance. Do not mark defects passed until owner tests. No timeline.

## Current P04.3 tracker

| Subphase | Source | Founder acceptance |
|---|---|---|
| P04.3.1 Reviewed assignments | [x] implemented | [x] Founder reports MT095–101 passed2026-10-03 |
| P04.3.2 Spending controls | [x] implemented1.19 | [ ] MT102–109 pending |
| P04.3.3 Durable text draft workflow | [ ] planned | [ ] pending |
| P04.3.4 Pins/carousel exports | [ ] planned | [ ] pending |

P04.3 remains in progress. These statuses supersede older planned rows; source completion is not whole-phase acceptance.
