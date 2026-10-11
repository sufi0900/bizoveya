# Reviewed deliberation scheduling intent

## Scope and contract

BZ-094/CW-094 follows remote main `022049b561e6a30b4fb06b83b36e8bd49f6a300e`. Additive `058_deliberation_schedule_controls.sql` preserves migrations001–057, plans, planned turns, accepted text, media and history. Founder desk can record owner-reviewed queue, pause, resume and permanent cancellation of a saved bounded deliberation plan. Member inventory projects current state and immutable ordered history after refresh.

| Current intent | Action | Result |
|---|---|---|
| None | Queue | Ready v1 |
| Ready | Pause | Paused, next version |
| Paused | Resume | Ready, next version |
| Ready or paused | Cancel | Cancelled, next version, terminal |

`ready` records intent only. No executable worker admission, AI reasoning, output, provider request, budget reservation or spending is granted. No automated worker is deployed by this slice. Per-turn token and total-cost bounds remain immutable plan limits for the future qualified executor; this slice does not claim runtime enforcement. First-four groups remain incomplete; live voice remains unfinished, office visualization ON HOLD, custom agents out of scope.

Owner-only `POST /api/workspaces/[workspaceId]/sites/[siteId]/agency/schedule` accepts strict `id`, `planId`, `operationId`, `expectedMeetingVersion`, `expectedVersion`, `action`, `reason`, `reviewed:true`, `intentOnly:true`. The UI supplies identities/versions/operation UUID automatically. Confirmation pins the meeting, plan, schedule version, action and trimmed reason; edits clear confirmation. Retries reuse the operation ID for the exact command until success. An exact recorded retry returns the current projection, even if it has since been paused/cancelled, without reapplying that action; changed commands cannot reuse its identity.

Authorization and current site ownership are checked before every operation, including retries. Queue/resume require the original decision-recorded meeting version, acknowledged receipts, enabled unchanged roster and exact pinned role identities/versions. Pause/cancel deliberately permit parent cancellation/roster changes, while requiring current meeting/schedule versions and current owner authorization. Rows serialize under the same site/meeting lock order as planning. State transitions have their own version; they do not alter meeting/plan/turn content. RLS and revoked direct table/private-function grants prohibit browser/service-role mutations. Events reject updates; site deletion cascades private records. Maximum100 events; queue/resume stop at current version98, retaining capacity to pause then cancel.

## Verification and pending acceptance

Automated BZ-094/CW-094 verification:471 web tests/78 files,58 ephemeral local migrations/22 SQL assertion executions, web production build with type/lint validation, web lint, boundaries and whitespace passed. Guide75 and current activity/work/pending-test visual projections are verified at final build. Admin source/tests/build are unchanged and not rerun. Hosted/PostgREST/worker/true concurrency/browser/founder acceptance remains pending; no active lease retained. Local SQL uses ephemeral PGlite with simulated auth; it covers the full migration chain, malformed/null inputs, stale state, owner/viewer access, retries, paused/changed team, cancelled parent, terminal controls, reserved safety slots, immutable events, cascade and zero generation/spending. Web tests cover contract/server failures and rendered controls/projections. Hosted Supabase/PostgREST, real workers, true concurrency, browser/mobile and founder acceptance are not inferred from those checks. Admin source is unchanged and its prior tests/build remain historical.

MT208–211 below remain pending with every earlier unanswered test. No new key/environment field; no hosted SQL, deployment settings, provider call, external message, publication or regeneration occurred. No active lease is retained at delivery.

## Four later manual checks

1. **MT208 — Combined setup and preservation.** When ready to test, the operator applies only missing migrations in order through `058_deliberation_schedule_controls.sql`. Existing media setup still follows guide62. Expected: accepted drafts, templates, media, meeting plans and history remain intact. No new credential or regeneration is needed for this slice.
2. **MT209 — Queue and refresh.** Use an existing acknowledged deliberation meeting with its saved bounded plan. In Founder desk choose **Scheduling action: Queue intent**; in **Scheduling review reason** paste `Queue the bounded private meeting plan for later qualified execution.` Check the displayed intent-only confirmation, save, then refresh. Expected: `ready · v1` and one queue event; no AI turn or spending. Do not fake participant receipts to reach this prerequisite; if absent, leave this test pending.
3. **MT210 — Pause/resume.** Choose **Pause intent**, reason `Pause this private meeting plan while I review the next steps.` Confirm/save: expected paused with one new event. Choose **Resume intent**, reason `Resume this reviewed private plan with the unchanged enabled team.` Confirm/save: expected ready with one new event if the pinned team is still enabled and unchanged; a paused/changed team must be denied without altering the plan. No model call occurs.
4. **MT211 — Cancel and access.** Choose **Cancel intent permanently**, reason `Cancel this private meeting plan without changing saved drafts.` Confirm/save/refresh: expected terminal cancelled, intact history/drafts and no further controls. A viewer must be read-only; a stale tab must receive a reload/conflict error without another transition. Concurrency/retry behavior remains pending hosted evidence.

## Next implementation

Qualified bounded deliberation turn admission and execution receipts, with current authorization/knowledge/provider qualification, independent spending accounting, token/cost admission, safe checkpoint pause and truthful reconciliation. A scheduling-ready record must never itself authorize a model call. Continue coding where dependencies permit; do not replace actual receipts with synthetic attendance or mark groups complete. Historical phase branches/PR2 are untouched; direct delivery uses non-force expected-head main updates only.
