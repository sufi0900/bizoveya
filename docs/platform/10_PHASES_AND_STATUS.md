# Implementation phases and status ledger

BZ-107/CW-107 hosted setup checkpoint (2026-10-12 PKT): founder explicitly authorized direct Supabase installation, superseding the earlier no-hosted-SQL restriction for reviewed Bizoveya migrations. Verified project `voxfolio` (`lvxrqmgsfarimbhmcbcc`) had schema039 with no tracked migration history. Applied the exact main-source migrations040–070 sequentially through the Supabase migration interface; all31 succeeded and are now tracked. Generation-run, review, visual and visual-history fingerprints were unchanged. All private tables have RLS; private specialist projection denies authenticated execution; `campaign-private-media` is private with a5MiB limit. This completes installation only, not browser/provider/role/concurrency acceptance. Earlier manual behavioral tests remain pending. Media server-key activation and artwork/voice qualification remain outstanding. See [88](88_HOSTED_SUPABASE_INSTALLATION.md).

BZ-106/CW-106 completes Group2 source implementation after a full boundary audit. Additive070 reports a missing requested channel from a succeeded shared run as `output_missing` rather than `prepared`, preserving stronger failure/recovery evidence and the one-Content-stage provider limit. MT256–259 and all earlier founder acceptance remain pending. Group3 source is complete; Group1 artwork and Group4 live voice remain genuine provider-gated exits. See [87](87_GROUP_TWO_SOURCE_CLOSURE.md).

Current Group2 checkpoint BZ-105/CW-105 connects reviewed channel responsibility to one compatible Content-stage run and evidence-backed terminal/recovery projection. This is implemented source, not founder acceptance or Group2 completion. MT252–255 remain pending; the next slice is the Group2 closure audit. See [86](86_CHANNEL_SPECIALIST_RUNTIME_LINEAGE.md).

BZ-104/CW-104 implements the first Group2 channel-specialist expansion slice: private versioned Blog/Pinterest/LinkedIn assignments plus immutable reviewed request delegation through additive068. Existing campaign stages and accepted history remain compatible and no execution is inferred. MT248–251 remain pending. Group2 still needs delegation-to-runtime lineage and channel-terminal result/recovery projection. See [85](85_PRIVATE_CHANNEL_SPECIALIST_DELEGATION.md).

BZ-103/CW-103 closes Group 3 source implementation for private announcement broadcast, acknowledged receipts, reviewed knowledge-draft handoff, bounded deliberation, downstream private requests and terminal recovery. Migration067 never auto-approves knowledge or starts provider/external work. MT244–247 remain pending, so acceptance is not claimed. First-four source completion remains open on Group1 qualified optional AI artwork, Group2 channel-specialist expansion and Group4 qualified live voice. See [84](84_ACKNOWLEDGED_ANNOUNCEMENT_KNOWLEDGE_DRAFTS.md).

BZ-102/CW-102 adds explicit interrupted-turn recovery and immutable snapshot closure through additive066, with admin controls and sanitized Founder desk status. Unknown provider usage requires billing reconciliation; no retry occurs. MT240–243 remain pending. First-four completion is still open; next is the consolidated source-to-plan audit of assistant/specialist, interruption/knowledge, AI visuals and live voice exits. Office visualization stays ON HOLD. See [83](83_MEETING_TERMINAL_RECOVERY_AND_CLOSURE.md).


BZ-101/CW-101 source is complete for reviewed-outcome handoff; MT236–239 remain pending. Group3 still requires terminal recovery. Group1 qualified optional AI visuals and Group4 live voice remain unfinished. Group5 remains ON HOLD; Group6 is out of scope. See [82](82_REVIEWED_MEETING_OUTCOME_REQUEST_HANDOFFS.md).

BZ-100/CW-100 source is complete for deterministic whole-deliberation completion and immutable founder review; MT232–235 remain pending. Group3 still requires reviewed downstream handoff and terminal recovery. Group1 qualified optional AI visuals and Group4 live voice remain unfinished. Group5 office visualization remains ON HOLD; Group6/custom agents is out of scope. See [81](81_REVIEWED_MEETING_DELIBERATION_OUTCOMES.md).

BZ-099/CW-099 source is complete for the one-attempt ordered meeting worker; MT228–231 remain pending. Group 3 still requires whole-deliberation completion and reviewed downstream handoff. Group 1 qualified optional AI visuals and Group 4 live voice remain unfinished. Group 5 office visualization remains ON HOLD; Group 6/custom agents is out of scope. See [80](80_ONE_ATTEMPT_MEETING_TURN_WORKER.md).


## Shared meeting-turn accounting — 2026-10-12 PKT

BZ-098/CW-098 adds062 independent meeting-turn reservations, provider-start markers, truthful settlement/reconciliation and shared UTC daily-budget enforcement across connectivity, campaign and meeting ledgers. Exact snapshot/consent/turn/current-dependency guards and ordered idempotent admission are implemented; safe pre-provider cancellation records zero, while unknown/overrun usage blocks fresh work. Admin spending projects sanitized meeting rows. No worker or provider call is connected. MT224–227 and every earlier unanswered test remain pending. Next: one-attempt bounded meeting worker and immutable private request/result receipts. First-four groups remain incomplete, live voice unfinished, office visualization ON HOLD, custom agents out of scope. See [79](79_SHARED_MEETING_TURN_ACCOUNTING.md).


## Expiring founder-admin meeting consent — 2026-10-12 PKT

BZ-097/CW-097 adds061 expiring revocable consent for060 qualified meeting snapshots. The original snapshot founder must remain a workspace owner and MFA-verified platform admin; fresh consent rechecks exact qualification/context/versions. Fixed15-minute expiry, immutable consent/revocation events, exact retries and25-record cap preserve history; revocation remains available after pause/expiry. Separate admin controls and read-only Founder desk projection create no reservation, AI turn or provider call. MT220–223 and all earlier unanswered tests remain pending. Next: independent shared-budget meeting-turn accounting, then bounded execution/results. First-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. See [78](78_MEETING_EXECUTION_CONSENT.md).



## Qualified meeting execution snapshots — 2026-10-11 PKT

BZ-096/CW-096 adds060 owner-reviewed immutable preparation from the ready, acknowledged bounded plan. Current pinned agent/model/credential/connectivity/pricing, approved context, token compatibility and full repeated-turn estimates are checked; fingerprint review rejects intervening changes. Preparation creates no execution authority, reservation, provider call or AI output. MT216–219 and all earlier unanswered tests remain pending. Next: explicit authorization and independent meeting-turn accounting, followed bounded execution/receipts. First-four groups remain incomplete; live voice unfinished, office visualization ON HOLD, custom agents out of scope. See [77](77_QUALIFIED_MEETING_EXECUTION_SNAPSHOTS.md).


## Operator meeting packet delivery — 2026-10-11 PKT

BZ-095/CW-095 supplies the missing receipt-worker prerequisite for bounded deliberation: additive059 owner-scoped admin queue, MFA-protected delivery and deterministic pinned-packet validation through existing054–055 claims/receipts. Reviewed delivery records acknowledged/declined only, with retry/lease/privacy guards; it makes no AI call, spending reservation or participation claim. Hosted setup and MT212–215 remain pending with all earlier unanswered founder tests. Qualified bounded turn admission/execution is next; first-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. See [76](76_OPERATOR_MEETING_PACKET_DELIVERY.md).


## Reviewed deliberation scheduling intent — 2026-10-11 PKT

BZ-094/CW-094 adds owner-reviewed queue, pause, resume and terminal cancel intent with additive058, strict authenticated API, founder-desk controls and immutable event history. Queue/resume require the unchanged enabled pinned team, acknowledged packets and exact meeting/schedule versions. Pause/cancel remain possible after team or parent changes. Exact operation retries return current state without duplicated transitions; final history slots are reserved for safety controls. This is scheduling intent only: no worker admission, AI turn, reservation, spending or result is implemented. Qualified bounded turn execution is next; first-four groups remain incomplete, live voice unfinished, office visualization ON HOLD and custom agents out of scope. MT208–211 and all earlier unanswered founder tests remain pending. See [75](75_DELIBERATION_SCHEDULING_INTENT.md).

## Deliberation identity admission repair — 2026-10-11 PKT

Additive057 explicitly rejects null/non-string/invalid meeting and plan identities before delegating to the owner-only bounded planner. The previous implementation is private with no caller grants. Expanded local SQL regressions cover identity/limit nulls, stale version, paused/changed roster, cancelled meeting, retry, immutable turns, ACLs and zero generation/spending. This is a prerequisite repair, not scheduling or first-four completion. MT204–207 and all earlier founder tests remain pending. Next remains safe deliberation scheduling/admission and pause/resume. See [74](74_DELIBERATION_ADMISSION_REPAIR.md).

Bounded deliberation planning is implemented in source through additive056: all pinned packets must be acknowledged before an owner can save exact rounds, token limits and a future cost ceiling. No model call or spend occurs. Group3 is still in progress pending safe scheduling/execution and acceptance; Group4 live voice is unfinished. MT204–207 remain pending. See [73](73_BOUNDED_DELIBERATION_PLANS.md).

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

## P04.3.4.4b — storage boundary delivered; parent in progress

Migration043 and authenticated private-media read/review/archive server access are implemented. Actual byte sanitization/upload/download, visible UI, visual integration, optional AI and founder acceptance remain incomplete. See [60](60_PRIVATE_MEDIA_STORAGE_AND_SERVER_ACCESS.md).

## Private media foundation — P04.3.4.4a / 2026-10-10 PKT

P04.3.4.4 is in progress: metadata/ownership/review foundation implemented; uploads, byte storage, rendering, optional AI and acceptance are incomplete. P04.3.4.3 source interface is delivered but manual acceptance remains pending; no grand phase is marked complete. See [59 Private media foundation](59_PRIVATE_MEDIA_CONTRACT_FOUNDATION.md).


## Private-template interface — P04.3.4.3e / 2026-10-10 PKT

Founder authorizes sequential implementation with manual testing deferred. Creator-private inventory/create/revise/version preview/archive controls now appear in accepted campaign Visual drafts; explicit reviewed save applies through the atomic042 boundary. SQL/app quota is aligned to32. No new migration/provider/publishing action. See [58 Interface and four combined tests](58_PRIVATE_TEMPLATE_INTERFACE_AND_TESTS.md). MT156–159, MT152–155 and unrelated tests remain pending; parent acceptance is unchanged. Six later evolution groups remain, plus broader connector/commercial work; activation proceeds only when dependencies permit.

## P04.3.4.3d — provenance delivered; parent in progress

Immutable copied template provenance is implemented with additive042 and authenticated application wiring. Automated checks pass; no UI or founder acceptance. The next slice may activate the creator-private inventory/apply interface. See [57](57_IMMUTABLE_TEMPLATE_VISUAL_PROVENANCE.md).

## P04.3.4.3c — delivered slice; phase in progress

Creator-private storage is connected to authenticated application routes and strict parsing. No UI or campaign reference is active. Next: copied immutable artifact references, then UI/manual acceptance. 371 web tests, typecheck and lint passed; hosted/founder checks remain pending. See [56](56_PRIVATE_TEMPLATE_SERVER_ACCESS.md).

## Private-template storage checkpoint — P04.3.4.3b / 2026-10-10 PKT

Additive041 implements creator-private recipe/history storage, checked authenticated inventory/save/archive RPCs, immutable versions and bounded32-record/50-version admission. Local41-migration/five-assertion verification passed; no hosted SQL applied or UI/campaign references activated. See [55 Storage foundation](55_PRIVATE_TEMPLATE_STORAGE.md) for access/deletion policy and optional one-time setup. Next: server integration and copied immutable artifact references before inventory UI. Source/package remains1.26.0; P04.3.4.3 and MT152–155 remain pending/in progress as applicable. No provider/settings/publication or repeat generation.


## Private-template contract checkpoint — P04.3.4.3a / 2026-10-10 PKT

Implemented creator-owned strict design recipes, contiguous immutable versions, expected-version edits/archive and fit-checked version-pinned application helpers. See [54 Contract foundation](54_PRIVATE_TEMPLATE_CONTRACT_FOUNDATION.md). Source/package remains1.26.0; no new inventory UI/API/storage/migration is activated, and this is not P04.3.4.3 completion. Next: separately implement creator-private SQL/storage and immutable artifact references, then reviewed inventory UI. MT152–155 and unrelated pending checks remain open; no new manual test/field/setup now. Founder authorized four-hour continuation attempts without a response; scheduled task created with first run08:07:59PKT, always subject to current dependencies/leases. No hosted SQL/provider/settings/publication.


## External handoff discussion — 2026-10-10 PKT

Founder requests future ChatGPT-created images/documents sent through a Bizoveya plugin into a private inbox, assistant routing, specialist/QA tasks and permission-gated publication; also relevant-channel signals after verified blog/site updates. See [53 External handoff and change signals](53_EXTERNAL_HANDOFF_AND_CHANGE_SIGNALS.md). Intake is proposed as a durable service; broad knowledge is authorization-scoped. Receiving ChatGPT artifacts is separate from subscription inference. Connector transfer capability remains unqualified. Latest documentation needs no feature test; template MT152–155 remain pending. Next P04.3.4.3 can proceed with ownership/version design, but no new runtime/SQL/connector or publication is implemented by this planning checkpoint.


## ChatGPT reasoning research checkpoint — 2026-10-09 UTC

Founder requests a selectable personal Plus-backed reasoning/text option. Official Sign in with ChatGPT supports eligible plan usage, but hosted Bizoveya needs commercial access; no approved client is evidenced. Recorded as planned/blocked, not a working provider. Separate per-user OAuth, account-specific models, streaming transport and subscription accounting are prerequisites; current platform-key adapter is not interchangeable. See [52 ChatGPT plan reasoning](52_CHATGPT_PLAN_REASONING.md) for sources, ordered scope and four simple founder steps. No new field, key, SQL or live test now. Source remains1.26; MT152–155 and unrelated pending tests remain pending; no accepted generation repeated. This is a documentation checkpoint, not phase completion.


## Current template checkpoint — 1.26 / P04.3.4.2

Shared Classic card, Midnight card, Editorial frame and Bold headline designs are implemented for two Pinterest graphics, the six-slide carousel and a new1080×1080 LinkedIn image. Selection changes design only; it does not regenerate text or call a provider. Existing saved v1 scenes/history stay intact. Owner explicitly adds templates/LinkedIn image, reviews and saves a v2 document as a new visual version. Additive040 after039 extends strict validation while retaining original access/source-review/conflict/no-op/version limits. No existing migration/row/history is rewritten.

Founder earlier MT145–147 remain reported passed. New MT152–155 and older MT148–151/unevidenced negatives/commercial blog depth remain pending. [51 Template selection and testing](51_VISUAL_TEMPLATES_AND_LINKEDIN_IMAGE.md) has four steps and every new field sample. No new key/environment/provider/integration/publishing. Personal reusable templates, AI artwork, voice/office/custom agents remain planned in50. Next: founder template/save/refresh/export checks; then separately scope P04.3.4.3 ownership/version contracts, not automatic implementation. This latest block supersedes older current instructions while preserving discussion history.


## Current documentation checkpoint — 2026-10-08 PKT

The founder reports completing the four requested visual setup/save/refresh/PNG/PDF checks and liking the results. Record MT145–147 as founder-reported passes, not independent hosted inspection; exact visual version, exported files and deployment receipts were not supplied. MT148–151 and unrelated text/access/negative/commercial-quality checks remain pending. Do not repeat accepted text generation or the confirmed visual checks.

This delivery records discussions and planned architecture only. Source visual composer is [4f719f78](https://github.com/sufi0900/bizoveya/commit/4f719f78e1364101730d74529bb903dfee04556d); no new feature, SQL or provider integration is implemented here. Read [50 Evolution and agency roadmap](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Next proposed slice is P04.3.4.2 template variety and standalone LinkedIn image; private reusable templates follow. Founder requested documentation before implementation. This block supersedes older conflicting next actions while preserving dated history.

## Current visual checkpoint — 1.25 / P04.3.4.1 (2026-10-08 PKT)

Founder confirmed the previous saved-draft/refresh/copy/generated-JSON checks and explicitly authorized proceeding. Record these narrow text-pilot checks as founder-reported passes; do not repeat generation. Other unevidenced access/conflict/mobile/unsaved-export tests and the short-blog quality finding remain open. This authorization permits visual implementation without claiming full P04.3.3 acceptance.

P04.3.4.1 adds private editable two-layout Pinterest graphics and a six-slide LinkedIn carousel, shared scene previews/PNG/PDF exports and owner-reviewed saved visual versions. Additive039 follows038; no existing rows/migrations are rewritten. Member reads, owner saves, source-review checks and optimistic conflicts are enforced. Outputs are private; saving/exporting does not publish or call a provider. No new key, env variable, dependency or deployment setting. Hosted039 installation and founder visual tests remain pending.

Next: follow the four steps in [49 Private visual composition](49_PRIVATE_VISUAL_COMPOSITION_AND_TESTING.md): apply039 once if missing, open the already accepted campaign's Visual drafts, review/save/refresh, download two Pinterest PNGs and the six-page PDF. Do not request another text generation. Remote base7acdbd48 inspected; no AGENTS.md or active lease; old PR2/phase branches remain historical. This block supersedes earlier conflicting current-state/next-step guidance while preserving its history.

## Current founder evidence — 2026-10-07 PKT

P04.3.3 is IN PROGRESS. Founder evidence confirms failed Content run `fb12a480-6923-4d3d-a66a-5777fe347f4a` cost reconciled to USD 0 on free-tier attestation (unknown tokens remain unknown), and unstarted run `29293e34-e773-4ffe-88f1-dc9645dd60c6` safely cancelled by the founder after SQL confirmed `provider_started_at` null (failed / preflight_failed, settled, zero tokens).

Live Gemini run `80091597-06eb-4b8e-ae10-6239ae2b2b69`, campaign “Do It With AI Tools — export test-v2”, version2: Coordinator succeeded/settled692 input /668 output, Content1289/716 and Quality1782/321. Founder reports saved Blog/Pinterest/LinkedIn text, fact references, positive QA and no stage errors. Latest review screenshot reportedly confirms Human review saved: reviewv1 accepted at2026-10-07 23:04:49 PKT for private draft use only. Exact reason and evidence limits are recorded in [48 Live draft evidence](48_LIVE_DRAFT_EVIDENCE_AND_REMAINING_GATES.md).

Reload persistence, clipboard/export, stale/negative review, access and other unevidenced tests remain pending. The short blog remains an open commercial-quality finding. No publication or regeneration occurred. Next: complete44/45 acceptance on the existing output, then inspect actual saved blog/brief/limits for quality improvement; no repeat generation is needed. P04.3.4 visuals remain planned until durable text acceptance. No new migration, field, key or deployment setting. No active checkpoint lease was recorded on inspected main `1ca04645c34c13f803a05689d66c26d99d692152`; old PR2/phase branches are historical. This block supersedes earlier next-action/current-state claims below; those retain the evidence available at their original checkpoints.

Verification2026-10-07 PKT:137 admin tests, admin typecheck, targeted runtime lint, both production builds and application boundaries passed. Guide47 rendered in the web document room. No hosted SQL execution, live model request or existing-record recovery performed. No active lease; founder read-only diagnostic is the next action.

## Runtime/SQL contract regression repair — P04.3.3.8 (2026-10-07 PKT)

Founder screenshots21:55–22:00 show snapshot29293e34-e773-4ffe-88f1-dc9645dd60c6 (campaignv2) stuck running, Coordinator reserved, no active dispatch lease, no result after refresh. Previous Content reconciliation forfb12a480 is screenshot-confirmed; this does not settle the new Coordinator reservation.

Code investigation confirmed a regression introduced in P04.3.3.7: runtimeVersion was changed to draft-runtime-v2-ai7.0.127-gemini-compact while migration036 explicitly permits only draft-runtime-v1-ai7.0.127. That rejects bz_record_generation_request after reservation before generateStage. Dispatch then ends its lease but leaves the stage reserved. Prior mock tests did not enforce the SQL literal. This is an implementation defect, not evidence of Gemini billing/credit failure. Hosted exact stop remains pending read-only confirmation.

Repair restores the SQL-compatible runtimeVersion and records transportSchemaVersion=gemini-compact-v1 separately. Request-recording errors now call existing guarded bz_cancel_unstarted_generation_stage before returning failed. SQL refuses cancellation when the provider-start marker exists; ambiguous RPC responses preserve unresolved reservations rather than inventing zero usage. New tests compare the serialized runtime identifier against migration036 itself and cover rejected-record cancellation and refused cleanup. Compact-schema validation/privacy behavior remains intact. No migration or live request; existing stuck record is not automatically rewritten.

Manual next: run the SELECT in tools/operator/inspect-v2-stuck-generation.sql in Supabase SQL Editor (read-only, not a migration). Share request_recorded, runtime_version, stage_status and active_dispatch. Expected for this regression: request_recorded=false, runtime_version=null, stage_status=reserved, active_dispatch=false. If request_recorded=true, preserve accounting and investigate separately. Do not rerun, reconcile or prepare another snapshot before safe recovery of this specific record is established. No key, pricing or account changes. See47.

Verification:134 admin unit tests across14 files passed (12 synthetic provider and15 diagnostic tests); admin typecheck, targeted generation lint, both production builds and app boundaries passed. The new46 guide is included in the built visual document room. Full directory lint scanned generated build artifacts and is not claimed as passing; targeted source lint and build checks passed. No live provider, hosted SQL, browser/manual acceptance, charge reconciliation or production deployment verification performed. No active lease at delivery. Next action: read-only founder checks, then evidence-backed reconciliation of the latest failed Content record before a single controlled new-snapshot test.

## Current diagnostic repair — P04.3.3.7 (2026-10-07 PKT)

Gemini transport now uses a compact JSON schema with canonical validation retained locally (strict keys, lengths, UUIDs and exact approved citations). Provider errors persist only fixed safe labels for response-schema rejection, unmet prerequisite, invalid/blocked key and payment requirement; raw messages, response bodies, URLs and secrets are never stored or exposed. Runtime request provenance is tagged draft-runtime-v2-ai7.0.127-gemini-compact. One attempt,20-second bound and spending reconciliation guards remain unchanged. No migration, provider call or billing activation. Historical failures cannot acquire new details retroactively. This compatibility repair is locally verified only; successful live generation remains pending. See [46 Gemini rejection repair](46_GEMINI_REJECTION_REPAIR.md). This current entry supersedes older next-step guidance without deleting history.

Founder evidence Oct7: old Content cost reconciliation persisted; refreshed connectivity test057e14ae-c5ec-4b9c-933b-c43e4880058f and all three assignments are current. New snapshotfb12a480-6923-4d3d-a66a-5777fe347f4a failed: Coordinator settled689input/553output; Content provider_request_rejected, usage unknown; no completed output/Quality result evidenced. Founder reports no Vercel errors. Caught errors were reduced to a generic stored label, explaining the diagnostic gap. HTTP400 is known; exact cause, schema compatibility, account prerequisite and credit expiry are not established. Latest unknown Content record requires its own evidence-backed reconciliation; the older reconciliation does not cover it. All unevidenced manual checks remain pending.

## Current checkpoint — P04.3.3.6 / private draft review exports (2026-10-07 PKT)

Founder authorizes continued implementation with previous and new manual checks deferred together. Added browser-local JSON downloads for the displayed editable campaign and completed generated output review packet. Unsaved edits are explicitly labelled; generated packets carry snapshot/campaign version, three text channels, citations, QA and review history. Downloads neither save nor call a provider, reconcile charges, accept a draft or publish. No new route, migration, dependency or API key. P04.3.3 remains IN PROGRESS: historical Content failure/unknown usage and successful live generation acceptance remain unresolved. See [45 Combined draft review and manual tests](45_DRAFT_EXPORTS_AND_COMBINED_TESTS.md). This current block supersedes older current-state guidance without deleting history.

## Current checkpoint — 1.24 / P04.3.3.5

Explicit founder-owner draft dispatch is implemented on the separate admin deployment at `/admin/generations`, default off. Private campaign outputs now show Blog/Pinterest/LinkedIn text, citations, advisory QA and owner-only versioned human review. Additive037 follows036; no provider request, hosted SQL, publishing or Vercel setting change was made. See [44 Draft pilot and human review](44_DRAFT_PILOT_AND_HUMAN_REVIEW.md). This block supersedes older current-state blocks, which remain historical.

Founder reports the latest Gemini connectivity/three refreshed assignments/campaign readiness checks passed; screenshot independently confirms connectivity and Coordinator, and the prior video confirms Spending reload persistence. This is not whole-phase acceptance or proof of036 installation. New MT138–144 remain pending. P04.3.3 is IN PROGRESS; next is the explicitly activated one-run Gemini pilot and evidence review, not automatic advancement to visuals/publishing.


## Current checkpoint — 1.23 / P04.3.3.4

Server-only bounded draft engine is implemented with exact private request records, one attempt per Coordinator/Content/Quality role, approved-citation validation, durable output/usage settlement and no automatic retries. Additive036 revalidates execution dependencies and repairs connectivity admission to include campaign spending. No Generate route, activation, provider request, customer publication or hosted SQL was performed. See [43 Draft runtime and testing](43_DRAFT_RUNTIME_AND_TESTING.md). This block supersedes older current-state blocks below; those remain historical.

Founder reports034/035 applied; screenshots confirm three agentv2 approvals, Gemini assignments and prepared campaignv3 snapshot/3 stages/count1. Refresh persistence and all other unevidenced manual checks remain pending. Next is authorized dispatch, saved output review and explicit founder pilot activation within the same unfinished P04.3.3 phase.


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
| P04.3.3 Durable text draft workflow | [~] storage, bounded runtime, review and JSON export implemented | [~] live run, accepted review and refresh/copy/generated export founder-confirmed; remaining access/conflict and commercial quality pending; see49 |
| P04.3.4 Pins/carousel exports | [~] four shared templates, Pinterest/carousel/LinkedIn square, versioned storage and PNG/PDF/JSON export1.26 | [~] MT145–147 founder-reported passed; MT148–151 and new MT152–155 remain pending; see51 |

P04.3 remains in progress. These statuses supersede older planned rows; source completion is not whole-phase acceptance.

## Planned evolution substeps — documentation only

| Substep | Status | Scope / dependency |
|---|---|---|
| P04.3.4.2 | [~] source implemented1.26 | Four shared designs and LinkedIn square; MT152–155 pending; preserve v1 records/review/fit/export |
| P04.3.4.3 | [ ] planned | Private reusable template inventory, ownership and immutable versions |
| P04.3.4.4 | [ ] gated | Media upload, constrained AI design specs and optional qualified artwork provider |
| P04.6 | [ ] planned | Founder assistant/HR, analyst and checked specialist hiring; durable delegation |
| P06.1 | [ ] planned | Announcement broadcast / bounded deliberation and safe interrupts |
| P06.2 | [ ] gated | Voice commands with consent and text/permission parity |
| P06.3 | [ ] planned | Real-event visual office and meeting projection with task-list fallback |
| P04.7 | [ ] planned | Private configured custom agents using permitted evaluated tools |

Existing grand P00–P12 remain unchanged in acceptance. P05/P07 publishing and P11 commercial gates still apply. See50 for requirements, sequence and exit evidence. Documentation is completed before any next-slice implementation.
