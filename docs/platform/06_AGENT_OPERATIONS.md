# AI employees, meetings and interruptions

BZ-102/CW-102 adds explicit interrupted-turn recovery and immutable snapshot closure through additive066, with admin controls and sanitized Founder desk status. Unknown provider usage requires billing reconciliation; no retry occurs. MT240–243 remain pending. First-four completion is still open; next is the consolidated source-to-plan audit of assistant/specialist, interruption/knowledge, AI visuals and live voice exits. Office visualization stays ON HOLD. See [83](83_MEETING_TERMINAL_RECOVERY_AND_CLOSURE.md).


BZ-101 permits no autonomous delegation: a second explicit founder-admin action creates one private request after outcome review. Generation, messaging and publication remain separate. See [82](82_REVIEWED_MEETING_OUTCOME_REQUEST_HANDOFFS.md).

BZ-100 aggregates only complete successful settled/reconciled turns into a founder-reviewable private outcome. In-progress, failed, unknown/overrun and cancelled deliberations remain distinct. No agent receives work from the outcome yet; reviewed downstream handoff is next. See [81](81_REVIEWED_MEETING_DELIBERATION_OUTCOMES.md).

BZ-099 runs only one explicitly reviewed, ordered private turn at a time. The selected role receives bounded approved facts and prior successful turn receipts; it has no tools or publication authority. Unknown usage, changed consent/roster/schedule or failed predecessor blocks later turns. Whole-deliberation completion is next. See [80](80_ONE_ATTEMPT_MEETING_TURN_WORKER.md).


## Shared meeting-turn accounting — 2026-10-12 PKT

Prepared + ready + consent still does not mean running. Each future ordered turn needs fresh current dependency checks and an independent reservation. Pause/revocation blocks new provider starts; already-started actual usage remains settleable. No reasoning/result exists in this slice.

BZ-098/CW-098 adds062 independent meeting-turn reservations, provider-start markers, truthful settlement/reconciliation and shared UTC daily-budget enforcement across connectivity, campaign and meeting ledgers. Exact snapshot/consent/turn/current-dependency guards and ordered idempotent admission are implemented; safe pre-provider cancellation records zero, while unknown/overrun usage blocks fresh work. Admin spending projects sanitized meeting rows. No worker or provider call is connected. MT224–227 and every earlier unanswered test remain pending. Next: one-attempt bounded meeting worker and immutable private request/result receipts. First-four groups remain incomplete, live voice unfinished, office visualization ON HOLD, custom agents out of scope. See [79](79_SHARED_MEETING_TURN_ACCOUNTING.md).


## Expiring founder-admin meeting consent — 2026-10-12 PKT

A ready plan plus prepared snapshot now supports explicit expiring founder consent. None of these states means attendance, reasoning, running, delegation completion or publishing. Revocation prevents future authority; actual work admission/usage remains a later separately guarded implementation.

BZ-097/CW-097 adds061 expiring revocable consent for060 qualified meeting snapshots. The original snapshot founder must remain a workspace owner and MFA-verified platform admin; fresh consent rechecks exact qualification/context/versions. Fixed15-minute expiry, immutable consent/revocation events, exact retries and25-record cap preserve history; revocation remains available after pause/expiry. Separate admin controls and read-only Founder desk projection create no reservation, AI turn or provider call. MT220–223 and all earlier unanswered tests remain pending. Next: independent shared-budget meeting-turn accounting, then bounded execution/results. First-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. See [78](78_MEETING_EXECUTION_CONSENT.md).



## Qualified meeting execution snapshots — 2026-10-11 PKT

BZ-096/CW-096 adds060 owner-reviewed immutable preparation from the ready, acknowledged bounded plan. Current pinned agent/model/credential/connectivity/pricing, approved context, token compatibility and full repeated-turn estimates are checked; fingerprint review rejects intervening changes. Preparation creates no execution authority, reservation, provider call or AI output. MT216–219 and all earlier unanswered tests remain pending. Next: explicit authorization and independent meeting-turn accounting, followed bounded execution/receipts. First-four groups remain incomplete; live voice unfinished, office visualization ON HOLD, custom agents out of scope. See [77](77_QUALIFIED_MEETING_EXECUTION_SNAPSHOTS.md).


## Operator meeting packet delivery — 2026-10-11 PKT

BZ-095/CW-095 supplies the missing receipt-worker prerequisite for bounded deliberation: additive059 owner-scoped admin queue, MFA-protected delivery and deterministic pinned-packet validation through existing054–055 claims/receipts. Reviewed delivery records acknowledged/declined only, with retry/lease/privacy guards; it makes no AI call, spending reservation or participation claim. Hosted setup and MT212–215 remain pending with all earlier unanswered founder tests. Qualified bounded turn admission/execution is next; first-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. See [76](76_OPERATOR_MEETING_PACKET_DELIVERY.md).


## Reviewed deliberation scheduling intent — 2026-10-11 PKT

BZ-094/CW-094 adds owner-reviewed queue, pause, resume and terminal cancel intent with additive058, strict authenticated API, founder-desk controls and immutable event history. Queue/resume require the unchanged enabled pinned team, acknowledged packets and exact meeting/schedule versions. Pause/cancel remain possible after team or parent changes. Exact operation retries return current state without duplicated transitions; final history slots are reserved for safety controls. This is scheduling intent only: no worker admission, AI turn, reservation, spending or result is implemented. Qualified bounded turn execution is next; first-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. MT208–211 and all earlier unanswered founder tests remain pending. See [75](75_DELIBERATION_SCHEDULING_INTENT.md).

## Deliberation identity admission repair — 2026-10-11 PKT

Additive057 explicitly rejects null/non-string/invalid meeting and plan identities before delegating to the owner-only bounded planner. The previous implementation is private with no caller grants. Expanded local SQL regressions cover identity/limit nulls, stale version, paused/changed roster, cancelled meeting, retry, immutable turns, ACLs and zero generation/spending. This is a prerequisite repair, not scheduling or first-four completion. MT204–207 and all earlier founder tests remain pending. Next remains safe deliberation scheduling/admission and pause/resume. See [74](74_DELIBERATION_ADMISSION_REPAIR.md).

Deliberation planning now requires every exact version-pinned invitation receipt to be acknowledged and the enabled roster to remain unchanged. Additive056 stores immutable ordered turns and founder-reviewed token/cost ceilings. `planned` never means attended, reasoned, executed or spent. Any later scheduler must reacquire authority and enforce every saved bound. See [73](73_BOUNDED_DELIBERATION_PLANS.md).

## Meeting receipt admission repair — 2026-10-11 PKT

Additive 055 rejects omitted worker identity and rechecks owner membership, unchanged meeting and enabled pinned team before new delivery claims. Already claimed packets can still record truthful completion after pause/cancellation; completion grants no new execution authority. Null identity, stale/paused/revoked/cancelled admission, expiry recovery, retry and ACL regressions are covered locally. This repairs prerequisites for the next bounded deliberation-plan slice; first-four groups remain unfinished, office visualization ON HOLD and custom agents out of scope. All founder tests, including MT200–203, remain pending. No new UI field, provider call, hosted SQL, settings, messages, publication or repeated generation. Base main `0aee385a9ffa402809b28124225af7f523b1e6e6`; historical branches/PR2 inspected, no AGENTS or active lease. See [72 receipt repair](72_MEETING_RECEIPT_ADMISSION_HARDENING.md).


Automated evidence: 461 web tests across 78 files, 54 ephemeral local migrations/18 SQL assertion executions, web typecheck/lint, both production builds and application boundaries passed. Documentation projects BZ-090/CW-090/MT200–203 and guide71. Admin source is unchanged; its earlier 145 tests are historical, not claimed as rerun. Hosted/browser/mobile/real worker/concurrency and all founder acceptance remain pending. No active checkpoint lease is retained at handoff.

## Versioned meeting invitations and explicit receipts — 2026-10-11 PKT

Group 3 now prepares owner-reviewed participant packets pinned to the current enabled site-team roster after a meeting decision is distributed. Additive 054 records invited/claimed/acknowledged/declined transitions and immutable receipt history; only the exact pinned service worker can claim and finish a receipt. These states do not claim attendance, understanding, reasoning or task completion, and no provider, spending, publication, message or knowledge update occurs. Bounded deliberation, safe pause/resume and live voice remain unfinished; first-four groups are not complete, office visualization stays ON HOLD and custom agents remain out of scope. Next: bounded deliberation plan preparation from acknowledged packets. See [71 contract and four deferred checks](71_VERSIONED_MEETING_INVITATIONS_AND_RECEIPTS.md). MT200–203 and all earlier unanswered founder tests remain pending. Remote base: `fc8fb5254ef527a50e65aa1bf90b1718683c759d`; historical branches/PR2 inspected, no repository AGENTS or active checkpoint lease.

Automated evidence: 457 web tests across 78 files, 53 ephemeral local migrations/17 SQL assertion executions, web typecheck/lint, both production builds and application boundaries passed. Documentation projects BZ-089/CW-089/MT196–199 and guide70. Admin source is unchanged; its earlier 145 tests are historical, not claimed as rerun. Hosted/browser/mobile/real concurrency and all founder acceptance remain pending. No active checkpoint lease is retained at handoff.

## Reviewed meeting task distribution — 2026-10-11 PKT

Group 3 now atomically links one recorded founder meeting decision to one reviewed private content request through additive 053. The request includes the exact decision and instruction; original agenda, version, channels and actor remain immutable provenance. Owner-only admission, exact retry, stale/role/site/quota guards and refresh projections are implemented. This starts no generation, spending reservation, acknowledgement, attendance, publication or knowledge update. Real participant receipts, bounded deliberation and safe scheduling still need implementation; first-four groups remain unfinished, office visualization ON HOLD and custom agents out of scope. Next: versioned participant invitations and explicit acknowledgements. See [70 contract and four deferred checks](70_REVIEWED_MEETING_TASK_DISTRIBUTION.md). MT196–199 and all earlier unanswered founder tests remain pending. Remote base: `76276e8aa5ac5cb7d8d4a6aab165b2189bae9af8`; historical branches/PR2 inspected, no repository AGENTS or active checkpoint lease.


Automated checkpoint: 451 web tests/78 files, 145 admin tests/14 files and 52 local migrations/16 SQL assertion executions passed. Both typechecks, both lints, both production builds and application boundaries passed. Hosted/browser/real concurrency and MT192–195 remain pending. No provider request or hosted operation.

## Durable assistant execution and recovery — 2026-10-11 PKT

Group 2 now tracks reviewed-request generation through a durable versioned task and immutable events. Admin authorization, actual runtime completion, member status projection and explicit expired-dispatch reconciliation are connected through additive 052. Recovery never calls a provider: no unsettled request can safely resume; an unstarted reservation is guarded-cancelled at zero; provider-start, unknown or overrun evidence blocks retry for manual reconciliation. This is not autonomous scheduling or completion of all first four groups. Group 3 meetings/announcements/task distribution and Group 4 live voice remain unfinished; office visualization stays ON HOLD. Founder acceptance MT192–195 and all earlier unanswered tests remain pending until before public reveal. See [69 contract and four deferred checks](69_DURABLE_ASSISTANT_EXECUTION_AND_RECOVERY.md). No hosted SQL, deployment setting, paid request, publication or accepted generation repeated.

Automated checkpoint:450 web tests/78 files,137 admin tests/14 files,51 local migrations/15 SQL assertion executions, both typechecks, web lint, targeted admin generation lint, boundaries, whitespace and264 affected local Markdown links passed. Both production builds passed; final web/document projection is verified before delivery. Hosted/browser/concurrency and MT188–191 remain pending. No provider request or hosted operation.

## Reviewed request generation preparation — 2026-10-11 PKT

Group2 now links a reviewed saved founder request to exactly one prepared generation snapshot through additive051 and the existing qualified generation admission. Exact request/campaign versions, immutable lineage, retry guards and current run-status projection are implemented. Preparation makes no provider call or spending reservation; execution remains separately authorized in the existing admin runtime. Full assistant dispatch/recovery, actual meetings, optional AI and live voice remain unfinished; office visualization stays ON HOLD. Routine founder acceptance MT188–191 and all earlier unanswered tests remain pending until before public reveal. See [68 contract and four deferred checks](68_REVIEWED_REQUEST_GENERATION_PREPARATION.md). No hosted SQL, deployment settings, paid request, publication or accepted generation repeated. No active checkpoint lease remains at delivery.

## Site team activation and safe checkpoint pause — 2026-10-11 PKT

Group2 now has owner-reviewed site-specific Coordinator/Content/Quality selections, enable/pause controls and immutable history through additive050. Preparation/authorization/new reservation/provider-start boundaries enforce pinned roster versions; started work can still settle. Onboarding respects the selected/paused team. All founder acceptance stays pending until before public reveal; coding continues independently within real dependencies. Assistant dispatch/recovery, meetings, optional AI and live voice remain unfinished; office ON HOLD. See [67 contract and four deferred checks](67_SITE_TEAM_ACTIVATION_AND_SAFE_PAUSE.md). MT184–187 and prior unanswered tests remain pending. No hosted SQL/provider/settings/publication or regeneration; no active checkpoint lease remains at handoff.

## Approved-context onboarding assessment — 2026-10-11 PKT

Group2 adds deterministic approved-fact/preference/role-qualification assessment and owner-reviewed immutable snapshots through additive049. Exact qualification/context fingerprints reject stale reviews; retries,50-review quota and member access are guarded. This makes no analyst AI request, scraping, hiring, execution or spending reservation. Role activation/assistant workers, actual meetings, optional AI and live voice remain unfinished; office ON HOLD. See [66 assessment contract and four deferred checks](66_APPROVED_CONTEXT_ONBOARDING_ASSESSMENTS.md). MT180–183 and all prior unanswered tests stay pending. No hosted SQL/provider/settings/publication or accepted generation repeated; no active checkpoint lease remains at handoff.

## Reviewed founder request handoffs — 2026-10-11 PKT

Group2 now connects owner-reviewed saved requests to one private campaign through additive048, version guards, immutable original brief/lineage and retry-safe quota-protected creation. Opening the linked campaign uses the existing draft runtime separately; this action starts no generation/provider/spending or publication. Analyst/onboarding/hiring, assistant dispatch, meetings, optional AI and live voice remain unfinished; office stays ON HOLD. See [65 contract and four deferred checks](65_REVIEWED_REQUEST_CAMPAIGN_HANDOFFS.md). MT176–179 and all prior unanswered tests remain pending; no hosted migration/settings/credential/provider operation or repeat generation. No active checkpoint lease remains at handoff.

## Retained campaign image drafts — 2026-10-11 PKT

P04.3.4.4e adds migration047 atomic image-draft saves/history, exact saved-base/current-review guards, explicit private sharing to current site members, retained immutable objects and guarded cleanup. The interface reloads images after refresh and previews historical image/text snapshots; existing v1/v2/v3 text/template saves remain intact. Deterministic media persistence is implemented in source; optional AI, assistant workers, agent meetings and live voice remain unfinished. Office stays ON HOLD. See [64 current contract and four deferred checks](64_RETAINED_CAMPAIGN_IMAGE_DRAFTS.md). MT172–175 and all unrelated unanswered tests remain pending. Hosted047 and existing media-key activation are deferred; no assistant hosted SQL/provider/settings/publication or regeneration.

## Reviewed image composition — 2026-10-11 PKT

P04.3.4.4d adds accepted creator-private image selection, hash-verified shared preview/PNG/PDF rendering and owner-reviewed local working-copy exports. Original campaign v1/v2/v3 saves/history remain intact; image attachments are not persisted yet. No new migration/key/provider or hosted change. Founder requests continued first-four work as quickly as possible, with routine manual acceptance deferred. Durable shared image copies, optional AI, actual assistant workers, agent meetings and live voice remain unfinished; office visualization remains ON HOLD. See [63 current contract and four deferred checks](63_REVIEWED_MEDIA_COMPOSITION_AND_EXPORTS.md). MT168–171 and all prior unanswered tests remain pending.

## Private image lifecycle and phase-five gate — 2026-10-11 PKT

Founder explicitly requires full first-four implementation before office visualization. Group5 is ON HOLD; routine founder tests stay deferred and never count as passes. P04.3.4.4c now adds migration046 tracked immutable uploads, authenticated hash-checked byte retrieval, guarded orphan recovery/operator maintenance and creator-private upload/preview/download/review/archive UI. Activation requires missing hosted046 and a server-only media key configured by the operator; the assistant has applied neither. Existing drafts/templates/history remain intact. Group1 renderer/optional AI and groups2–4 workers/meetings/voice remain unfinished. See [62 Current scope, setup and four deferred checks](62_PRIVATE_MEDIA_UPLOADS_AND_PHASE_FIVE_GATE.md). MT164–167 plus all unrelated unanswered tests remain pending.

## Grouped first-four foundation — current source checkpoint

Founder groups media, assistant/delegation, meetings and voice into one delivery effort, defers routine manual acceptance, and reserves visual office/custom agents for later separate deliveries. This checkpoint delivers additive044 media hardening, real bounded image sanitization and additive045 private proposal/meeting-decision storage plus owner-reviewed planning UI. Live uploads/rendering, workers, agent meetings and voice remain unfinished; all four groups are not complete. No hosted SQL/provider/publication/settings change or repeated generation. Read [61 Grouped scope and four deferred checks](61_GROUPED_AGENCY_FOUNDATION_AND_TESTS.md). MT160–163 and all unrelated unanswered tests remain pending; earlier narrow founder passes remain unchanged.

## Private media foundation — P04.3.4.4a

No agent can upload/select media through this foundation. A future specialist may resolve only accepted nonarchived media within its authorized creator/site scope; media acceptance is separate from campaign/visual review and publishing authority. See [59](59_PRIVATE_MEDIA_CONTRACT_FOUNDATION.md).


## External handoff discussion — 2026-10-10 PKT

Founder requests future ChatGPT-created images/documents sent through a Bizoveya plugin into a private inbox, assistant routing, specialist/QA tasks and permission-gated publication; also relevant-channel signals after verified blog/site updates. See [53 External handoff and change signals](53_EXTERNAL_HANDOFF_AND_CHANGE_SIGNALS.md). Intake is proposed as a durable service; broad knowledge is authorization-scoped. Receiving ChatGPT artifacts is separate from subscription inference. Connector transfer capability remains unqualified. Latest documentation needs no feature test; template MT152–155 remain pending. Next P04.3.4.3 can proceed with ownership/version design, but no new runtime/SQL/connector or publication is implemented by this planning checkpoint.


## 2026-10-08 evolution update — planned direction

Extend existing facilitated meetings with announcement broadcast and bounded deliberation. Founder assistant/HR assigns scoped specialists; initial analyst proposes from approved sources. Specialists resolve authorized template inventory, queue QA and escalate to assistant then founder. Agents join meetings only after a safe checkpoint; active writes/provider requests reconcile first. Voice uses identical approval/budget rules. Hiring/custom roles mean evaluated configurations, not self-granted tools. Cartoon movement reflects real tasks. Publishing remains deferred.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

## Current checkpoint — 1.24 / P04.3.3.5

Explicit founder-owner draft dispatch is implemented on the separate admin deployment at `/admin/generations`, default off. Private campaign outputs now show Blog/Pinterest/LinkedIn text, citations, advisory QA and owner-only versioned human review. Additive037 follows036; no provider request, hosted SQL, publishing or Vercel setting change was made. See [44 Draft pilot and human review](44_DRAFT_PILOT_AND_HUMAN_REVIEW.md). This block supersedes older current-state blocks, which remain historical.

Founder reports the latest Gemini connectivity/three refreshed assignments/campaign readiness checks passed; screenshot independently confirms connectivity and Coordinator, and the prior video confirms Spending reload persistence. This is not whole-phase acceptance or proof of036 installation. New MT138–144 remain pending. P04.3.3 is IN PROGRESS; next is the explicitly activated one-run Gemini pilot and evidence review, not automatic advancement to visuals/publishing.


## Current checkpoint — 1.23 / P04.3.3.4

Server-only bounded draft engine is implemented with exact private request records, one attempt per Coordinator/Content/Quality role, approved-citation validation, durable output/usage settlement and no automatic retries. Additive036 revalidates execution dependencies and repairs connectivity admission to include campaign spending. No Generate route, activation, provider request, customer publication or hosted SQL was performed. See [43 Draft runtime and testing](43_DRAFT_RUNTIME_AND_TESTING.md). This block supersedes older current-state blocks below; those remain historical.

Founder reports034/035 applied; screenshots confirm three agentv2 approvals, Gemini assignments and prepared campaignv3 snapshot/3 stages/count1. Refresh persistence and all other unevidenced manual checks remain pending. Next is authorized dispatch, saved output review and explicit founder pilot activation within the same unfinished P04.3.3 phase.


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

No candidate model profile is bound to coordinator/content/quality yet. Existing agent modelTier remains a preference, not a provider selection. P04.3 must add exact checked-profile/current-reference binding, model compatibility proof, scoped tools, budgets, retry/trace before live operation. No guarantees of error-free agents or pricing inferred.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Supported roles coordinator/content/quality; schemas plan-v1/content-proposal-v1/quality-review-v1 are metadata contracts for future output, not implemented model output validators. Declared tools are inert capabilities. Max16 agents,200 versions/agent; steps1–8 and output128–4096 are future budget metadata. Model tier is a preference label, not a selected provider. Schema checks cannot ensure an agent never makes mistakes. Model QA saved cases/activation remain future work.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Future agents must use the private approved retrieval adapter with a currently authorized requester and exact site, record source/fact/revision citations, and revalidate approvals before acting. Source text is untrusted data, never platform instructions or tool permission. No agent runtime consumes knowledge yet. Source correction/revocation invalidates current retrieval immediately; future persisted outputs need dependency invalidation policy.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.9 / P02.2

The template/section catalogue and stable instance IDs are a future agent dependency. Tools should discover approved section types/layouts, use validated content commands and record document/config version. New sections/layouts affect domain schema, SQL validation, renderer, inspector, examples, tests and documentation. A template recipe using existing supported layouts should not require rewriting each prompt. No business agent, meeting, voice editing, model routing or API integration was implemented in P02.2; inherited portfolio voice remains separate.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Business editing in this package is manual. No agent was added or granted tools, and no business voice assistant is advertised. Existing portfolio voice remains in the inherited Studio at/portfolio and uses its original provider/configuration. Future business agents must resolve approved template IDs/schema versions from the shared catalog in apps/web/src/domain/business.ts, with scoped permissions and QA before activation. Adding template metadata does not automatically train or update an existing agent.

**Draft 0.1. Proposed target, not implemented in this Voxfolio archive.** Earlier agency discussions proposed facilitator meetings and Sanity/Pinterest employees. Audit that separate code before claiming reuse.

## Roles and contracts

Manager/facilitator scopes request and proposes plan; research/SEO employee gathers evidence and outline; content employee prepares Sanity/native draft; quality employee checks facts/brand; visual employee prepares brief or asset; distribution employee prepares Pinterest/channel draft. Each employee has a typed input/output schema, site scope, allowed tools, spend ceiling, timeout and owner approval policy. No employee can increase its own permissions. Direct employee chat is possible but has the same policy boundary.

**First workflow proposal:** owner approves article task → research/outline → fact/quality review → Sanity draft with revision check → human approval → visual brief/asset → Pinterest draft → explicit channel action approval → receipt/readback. Imported Markdown documents may require a round-trip adapter; direct mutation must remain blocked until proven safe. Record each transition, artifact, source and model call. If an action fails, preserve a recoverable draft.

## Facilitated meeting

Agenda and participants are fixed before a meeting run; role turns are sequential and bounded. Facilitator summarizes disagreements and proposes decision options; founder can join, question or amend before decision. Store transcript, source artifacts, decision owner, explicit approval/rejection/defer status, and linked tasks. A meeting is not approval for external publication by itself. Resume after restart from persisted turn/checkpoint; never duplicate earlier external side effects.

## Interrupt protocol

| Owner command | Required behavior |
|---|---|
| Status | Return latest durable checkpoint, current worker and pending approval without altering state |
| Amend | Version the instruction; apply at safe checkpoint, show impact on current proposal |
| Pause | Stop scheduling new actions; finish/record an already-started atomic side effect |
| Reprioritize | Change queue priority with audit; preserve dependencies |
| Cancel | Stop future work; retain artifacts and receipts |
| Emergency stop | Halt pending tool calls and revoke execution authority; inspect in-flight actions and reconcile external results |

State machine candidate: `queued → running → awaiting_approval → executing → completed`, with `paused`, `failed`, `cancelled` paths. A worker obtains a lease, persists event/checkpoint, enforces budget and action idempotency, then acknowledges. Timed-out remote writes enter `reconcile_required`, not immediate retry. Maintain a human-readable timeline and an exportable audit. Test a pause during Sanity write and a restart after Pinterest action before claiming interrupt correctness.

## Configurable roles, SDK and instruction ownership

[ADR-0002](decisions/ADR-0002-configurable-agents-and-admin-control.md) adopts an application-run runtime direction; final SDK choice remains open. Agents are backend role/configuration objects, not uploaded ChatGPT conversations. A coordinator retains task responsibility, invokes permitted specialists and receives typed artifacts; delegation does not grant publication authority. Define specialist purpose, inputs/outputs, allowed tools, config/model version and maximum work. Avoid splitting agents solely to increase their count.

At run start, load the active tested agent version plus scoped client/site preferences and approved knowledge. A backend policy layer enforces access/actions; prompt instructions cannot expand it. Default rules, model profiles and supported tools can be maintained in admin data; implement new tools in code. One provider key can serve several agents, while separate per-agent/run budget and permissions still apply. Secret values never enter memory or prompts.

Routing can vary by role or task using evaluated economical/stronger models; deterministic operations such as permission checks, scheduled execution and calculations may need no model. Repetitive tasks can still need strong judgment. Fallback must be permitted for capability, geography, cost and data policy, not silently enabled. Record token usage, latency, validation errors and completion quality, not a generic vendor ranking.

## QA and configuration changes

Use a QA specialist for factual support, relevance and brand judgment, plus rule-based checks for schema, required fields, actual provider limits, URLs/assets/boards and idempotency. The Pinterest example in [18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md) specifies this separation. Review success is not publication success; execution receipt/readback is required. No rule set guarantees zero mistakes.

Admin lifecycle is draft → validate → saved-case evaluation → authorized activation → monitored version → retirement/rollback. Run snapshots stay fixed; authorized user amendments create a versioned event and take effect only at an explicit checkpoint. Emergency revocation may prevent new tool calls but cannot undo prior side effects. Meetings and interruptions retain their existing durable-state contract; an admin dashboard is not a substitute for worker leases, recovery or audit.

## Package 1.3 transition and impact synchronization

Template and voice knowledge should come from the shared approved capability catalog, not duplicated prompt copies. Specialists consume typed site-scoped artifacts through the coordinator; dependency gates, bounded QA revisions, config snapshots and interrupt reconciliation are specified in [19_DEPENDENCIES_AND_CHANGE_IMPACT.md](19_DEPENDENCIES_AND_CHANGE_IMPACT.md). Adding an agent updates all consuming contracts/evaluations and permissions, not just its prompt.

## Package 1.4 — first practical workspace implementation

No new AI agent executes in this package. Site records provide a future scope boundary, but registry status is not an agent pause/resume control. Business records and external URLs do not create knowledge, prompt memory, tasks or connector tools. Voice/template command logic stays inherited and unchanged. Future agents must consume site/permission versions and follow document 19 rather than assuming a URL grants access.
