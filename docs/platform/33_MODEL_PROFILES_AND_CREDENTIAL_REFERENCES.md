# Model profiles and credential references

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


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


Living P04.2.1 guide for package1.15. Source implemented; hosted/founder acceptance pending. Later instructions may revise it with coordinated code, migration, documentation and evidence changes.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

## Installation and safe workflow

If through027 is confirmed, apply only028_model_profiles.sql once. Otherwise reconcile history and apply only missing migrations ascending; fresh DB requires001–028. Never paste tests/tools fixtures into production. Previous001–027 unchanged. Rebuild both apps from one repository; no new GitHub/Vercel project.

Admin host /admin/credentials shows three fixed references, initially disabled. Private environment settings optionally supply keys. Key absent is a valid safe test state. /presence returns only configured boolean, current-admin-deployment scope, providerValidated:false and runtimeEnabled:false. It does not check billing, provider auth, model capabilities, expiry, or the future runtime deployment.

| Provider label | Fixed reference | Optional server variable |
|---|---|---|
| nebius | platform-nebius | BIZOVEYA_NEBIUS_API_KEY |
| openai | platform-openai | BIZOVEYA_OPENAI_API_KEY |
| gemini | platform-gemini | BIZOVEYA_GEMINI_API_KEY |

These provider labels are configuration slots, not proof of API/SDK integration. Do not add NEXT_PUBLIC_ to secret names, put values in code/docs or enter them in names/model IDs/reasons. This dashboard accepts no actual key. Set/change/remove keys privately in deployment/provider settings with their account protections and redeploy appropriate environments. Record reference rotation afterward. Changing environment alone does not increment reference version. Platform Disable does not revoke an actual provider key or stop requests outside Bizoveya; no model run is implemented here.

Create a candidate at /admin/models using an operator-verified exact model identifier. Do not assume example IDs are available. Provider selection fixes matching reference; URLs/arbitrary endpoint fields are not accepted. Metadata: routing preference economical/reasoning, output tokens128–32768, daily budget1–100000 USD cents. These bounds are planning constraints, not actual model limits, pricing or enforced budget.32 definitions/100 versions each. Check saved config only after reference enabled; check means syntax/current reference eligibility, not authentication/model evaluation. New saves are unchecked. Enabled/disabled/rotation reference changes invalidate dependent checks. Profiles are not attached to any agent yet. Version history shows latest30 immutable docs; event list latest100 with actor/reason/time, older records retained. No live activation/delete/external API test/secret export.

## Routes and data

| Admin-only path | Operation |
|---|---|
| /admin/models | Candidate profile room |
| /admin/credentials | References and boolean server presence |
| /api/admin/models GET/POST | Registry/save/check |
| /api/admin/models/[id]/history GET | Latest30 versions |
| /api/admin/models/events GET | Latest100 events |
| /api/admin/credentials GET/POST | Registry/reference changes |
| /api/admin/credentials/presence POST | Fixed-slot boolean check |

All route handlers require current server session/current grant+AAL2; DB RPC repeats grant/AAL2 and mutations lock current grant. Private tables use RLS and no app direct access. Metadata APIs cannot arbitrarily read env vars. Main domain has no admin routes/API/links; no customer catalog of model profiles. Admin receives no customer data access via these controls.

## Manual acceptance — all pending

| Case | Check | Expected result | Status |
|---|---|---|---|
| MT068 | Reconcile/apply028 after027; rebuild existing two projects | 3 disabled refs, no seeded profiles, existing agent/customer pages retained | [ ] pending |
| MT069 | Granted+AAL2 vs anonymous/AAL1/ungranted/revoked; main-domain paths | Only current eligible admin reads/writes/probes presence; main admin unavailable | [ ] pending |
| MT070 | Create candidate, double-submit, reload, edit/save; history; duplicate ID | One saved version/action, immutable old docs, duplicate identity rejected | [ ] pending |
| MT071 | Check while disabled; enable after review/reason; check; new version/disable/record rotation | Enabled current reference required; changes clear check eligibility; no model result | [ ] pending |
| MT072 | Presence with no key; optionally privately set/rotate/remove an authorized key and redeploy, then record reference version | Boolean matches admin deployment only; no value/fingerprint returned; rotation records metadata only | [ ] pending |
| MT073 | Two-tab stale profile/ref mutation, invalid bounds/provider-reference pairing/extra key field | Conflicts409 and strict validation; no silent overwrite | [ ] pending |
| MT074 | Dark/light/mobile/keyboard, unsaved cancel/navigation/signout; previous agents/preview/customer/portfolio | Accessible wrapping layout; edits protected on link/signout cancel; existing flow regression | [ ] pending |

Optional real-key setup is not needed to pass absence-state/UI tests. Do not make paid provider calls merely to test this phase. Native Back/Forward unsaved protection remains limited; save first. Record exact case/package/deployment/device/tester/real PKT time/outcome and redacted evidence. All older cases stay pending where unevidenced.

## Follow-on

P04.2 remains partial: key-entry secret-store integration, fresh reauth and authenticated provider test are not implemented. P04.0 must qualify exact provider/model/SDK beforeP04.3 binding/worker. P04.3 must enforce budgets, permissions, cancellation/receipts and failures; P04.4 adds model evaluations before real activation. No hackathon qualifying trace is generated by this metadata-only release.
