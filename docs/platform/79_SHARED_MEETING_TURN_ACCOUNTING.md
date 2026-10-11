# Shared meeting-turn accounting

Automated BZ-098/CW-098 verification: 164 admin tests/18 files, 62 ephemeral local migrations/26 SQL assertion executions, admin standalone typecheck/lint, both production builds, application boundaries, whitespace, 664 affected local Markdown links and guide/activity/work/pending-test visual projections passed. Web application source is unchanged and its 480-test prior result is historical, not rerun. Hosted/PostgREST/browser/mobile/true concurrency, real worker/provider billing and all founder acceptance remain pending. No hosted SQL, provider request or generation.

## Delivered boundary

BZ-098/CW-098 follows remote main `26ebd3b87d481e64c6447861a5427e1870ba4f03`. Additive062 creates an independent private ledger for each bounded meeting turn and makes it share the existing model profile daily allowance with connectivity tests and campaign-generation stages. The admin spending room now identifies meeting-turn reservations, charges and unresolved records. This slice never calls a provider and does not connect an execution worker.

The first four groups remain in progress. Group3 still needs the one-attempt ordered meeting worker, immutable request/result receipts and private deliberation result projection. Group4 live voice remains unfinished. Group5 office visualization stays ON HOLD for founder design input and Group6 custom agents remains out of scope. All founder acceptance remains pending until before public reveal.

## Admission and shared limits

Only service-role server code can reserve, mark provider start, cancel unstarted work or settle a meeting turn. Direct table/helper access remains denied to public, anonymous, authenticated and service-role callers. A fresh turn reservation requires the exact immutable snapshot, active unrevoked consent, original founder identity, current owner/platform-admin authorization, ready unchanged meeting/schedule, enabled pinned roster, unchanged approved facts/preferences, current agent binding/connectivity/pricing and exact ordered turn. The previous turn must have succeeded with settled or reviewed-reconciled accounting.

The reservation uses the saved per-turn estimate and captured policy/profile versions. It enforces the per-request policy ceiling, saved whole-meeting ceiling and the smaller provider-policy/profile daily ceiling. Daily usage is the sum of connectivity, campaign and meeting charged/held amounts for the UTC day under the global spending lock. Unknown, overrun or stale reserved evidence in any ledger blocks fresh meeting work. Meeting unknown/overrun/stale reservations also block fresh connectivity and campaign reservations. Preparation and fresh consent now see unresolved meeting accounting too.

Exact turn-ID retry returns recorded truth with `execute:false` and cannot create a second charge. A different ID for the same snapshot/ordinal conflicts. One through six turns are supported; no later turn can skip an unsettled predecessor. Site deletion cascades meeting accounting records/events without changing earlier migrations or successful drafts.

## Provider-start and truthful settlement

Reservation itself records no provider-start marker. Safe cancellation is allowed only while that marker is absent and settles at zero with `preflight_failed`. The marker function rechecks that the consent is still active immediately before a future provider request. Revocation or expiry therefore blocks a fresh provider start while preserving a truthful already-started settlement path.

Settlement requires the provider-start marker. Known nonnegative token counts are priced from the captured rates and request fee. Exceeding reserved cost or token bounds records `overrun`; missing usage records `unknown` at the conservative held amount. Neither is converted to zero. Successful status is possible only with known within-bound usage. The admin can reconcile only unknown, overrun or a stale reservation after explicit reviewed evidence; reconciliation never calls a provider and cannot create a meeting result.

The private ledger intentionally stores no prompt, model output, discussion or decision. Those immutable request/result receipts belong to the next worker slice. The provider-start entry point is present for that worker but unused in production source today.

## Admin projection and verification

The existing spending report now returns `meeting_turn` rows with sanitized snapshot identity and turn ordinal. Policy totals and blocked status include all three ledgers. Existing reconciliation amount/reason controls work without a new credential or environment flag. The UI explicitly says the meeting worker is not connected.

Local SQL assertions use simulated Supabase identities and synthetic prices only. They cover current authorization/consent/context guards, prior connectivity spend against meeting admission, ordered/idempotent reservations, duplicate rejection, provider-start requirement, exact known settlement, safe zero cancellation, unknown blocking, reviewed reconciliation, revocation before start, model-test admission against meeting spend, private ACLs and cascade. Existing campaign/model accounting suites also run through the successor wrappers. Hosted SQL/PostgREST, real provider billing, browser/mobile, true concurrency, actual worker calls and all founder acceptance remain pending.

## Four deferred manual steps

1. **MT224 — Setup and preservation.** Later apply only missing migrations in order through `062_meeting_turn_accounting.sql`. There is no new key, flag or text configuration. Expected: accepted drafts, reviews, media, meetings, snapshots, consent and prior spending history remain intact.
2. **MT225 — Future disposable turn admission.** After the next bounded meeting worker is connected, use only a disposable qualified/consented meeting. Existing plan samples remain input `1200`, output `600`, whole-meeting ceiling `5` US cents. Expected: each ordered turn gets one reservation in **Spending controls** with its snapshot ID and ordinal; refresh/retry does not duplicate it. Do not manually call service RPCs.
3. **MT226 — Safe cancellation and settlement.** Cause only a genuine pre-provider validation failure in the disposable flow. Expected: zero settled `preflight_failed`; if a provider genuinely started, actual tokens/cost are retained instead. Never manufacture provider-start or usage evidence.
4. **MT227 — Reconciliation and shared budget.** For a genuine unknown/overrun record, enter the existing reconciliation amount from provider evidence and reason: `Reviewed provider billing for this disposable meeting turn.` Confirm the existing review checkbox. Expected: the record becomes reconciled and remains in history; connectivity tests and campaign/meeting requests all respect the combined daily total. This remains pending until genuine evidence exists.

## Next source boundary

Connect a one-attempt ordered meeting worker that assembles each prompt within the saved input bound, writes immutable request provenance before provider start, uses the062 reservation/marker/settlement contract, captures private per-turn results and prevents retry when provider outcome or usage is uncertain. Pause/revocation must block new turns but must never block recording actual started usage. No publication or external tool use.
