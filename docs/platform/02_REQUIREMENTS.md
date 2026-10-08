# Requirements register

## 1.26 implemented source update

P04.3.4.2 implements four shared campaign visual designs and a square LinkedIn image, preserving v1 outputs and original text. New requirements are source-delivered, founder MT152–155 pending; private template inventory remains planned. See [51](51_VISUAL_TEMPLATES_AND_LINKEDIN_IMAGE.md). Earlier dated contracts retain history.


## 2026-10-08 evolution update — planned direction

Planned requirements: shared visual catalog; private creator-owned reusable templates; immutable template/artifact versions; standalone LinkedIn image; validated AI design specifications; scoped agent inventory; assistant delegation; broadcast/deliberative meetings; voice/text parity; truthful cartoon-room states; safe pauses, QA/approval separation and bounded escalation. Trace acceptance per slice in50; none are implemented by this documentation update.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

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

Added MODEL-01 versioned candidates, MODEL-02 current reference syntax checks, CRED-01 fixed server-env references, CRED-02 boolean-only admin deployment presence, CRED-03 versioned enable/disable/record-rotation and audit. Runtime binding/provider validation/secret-entry management remain unmet requirements.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

New requirements AG-CFG-01 immutable versions; AG-CFG-02 MFA-gated preview review/rollback; AG-CFG-03 strict declared capabilities; AG-SITE-01 scoped preferences; AG-SITE-02 current approved citation preview; AG-SEC-01 no admin-to-tenant privilege bridge. Live execution/evaluation requirements remain unmet.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

BR-04 partial implementation: text ingestion/review/explicit approval/current-revision citations/correction/export/removal implemented; PDF/OCR/semantic retrieval and live hosted acceptance remain open.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

REQ-TPL-EXP-01 six distinct families; REQ-TPL-EXP-02 shared catalog/renderer; REQ-TPL-EXP-03 selection persists creation/save/reload/publish; REQ-TPL-EXP-04 old drafts/publications remain compatible; REQ-TPL-EXP-05 unsupported vertical capabilities disclosed. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

REQ-BUS-PUB-01: explicit consent and saved snapshot; REQ-BUS-PUB-02: independent draft/publication versions; REQ-BUS-PUB-03: scoped member writes and active-only anonymous projection; REQ-BUS-PUB-04: unpublish retains private draft/history; REQ-BUS-PUB-05: published H1/title/description/social metadata and email/call actions. No forms/custom domains yet. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

New acceptance requirements: R-JOURNEY-01 verified account presentation; R-JOURNEY-02 returning workspace overview with separate creation; R-JOURNEY-03 exact sidebar selection; R-CREATE-01 selected design + initial draft saved atomically and immediate Studio entry; R-IDENTITY-01 normalized site-name/URL conflict prevention on create AND edit; R-DESIGN-01 visually distinct template families sharing components; R-SAVE-01 duplicate-submit and unchanged-save protection. Acceptance scenarios and evidence limits are in27. R-IDENTITY applies within a workspace, not globally across tenants.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

| ID | Current requirement / state | Acceptance |
|---|---|---|
| B-SEC-01 | Implemented: add, select, reorder with arrows, hide/show, duplicate and delete sections; 1–20 instances | IDs unique; deletion undo restores content |
| B-SEC-02 | Implemented: 8 section types and 19 approved layouts | Unsupported layout/type rejected by app and SQL |
| B-SEC-03 | Implemented: 3 design recipes; brand palette/font and section tones | Recipe changes preserve content, IDs and extra sections or fail without truncation |
| B-SEC-04 | Implemented: shared services/contact facts, optional approved photos | One contact edit updates all bound sections; no generated reviews |
| B-SEC-05 | Implemented: legacy read upgrade, save concurrency, JSON export/restore | v1 rows unchanged by 022; save v2; stale writers rejected |
| B-SEC-06 | Implemented: 30-edit session undo/redo and mobile canvas | Not durable revision history; reload clears undo |
| B-PUB-01 | Planned P02.3: publishing/contact readiness | Real publication and enquiries require separate acceptance |

Business Studio is private latest-draft storage, not a published website, booking engine, store or agent runtime.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

| ID | Current requirement | Evidence/status |
|---|---|---|
| BZ-BIZ-001 | Public Bizoveya entry with new/existing journeys and business/portfolio template categories | Source present, hosted walkthrough pending |
| BZ-BIZ-002 | Strict service-business document, manual editing, responsive preview and JSON backup | Domain/workbench/preview; local tests |
| BZ-BIZ-003 | Workspace-only latest draft read; owner/editor version-checked save; viewer/outsider/revoked denial | Migration021/RPC/API; local SQL; hosted acceptance pending |
| BZ-BIZ-004 | Preserve portfolio editor/onboarding/publication and separate admin boundaries | `/portfolio`, unchanged project APIs/admin app; regression checklist |
| BZ-BIZ-005 | Every claim states draft vs demo vs published; no fabricated testimonials | Demo sample explicitly fictional; business publishing unavailable |

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

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
