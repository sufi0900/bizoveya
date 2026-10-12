# Group 2 source closure

BZ-106 / CW-106 completes the documented Group 2 source boundary after auditing founder request capture, approved-context analyst onboarding, reviewed team hiring, campaign handoff, durable assistant execution/recovery, channel-specialist delegation and the shared Content-stage runtime.

Migration `070_channel_specialist_terminal_closure.sql` repairs the final read-model gap without changing migration069 or any saved record. A generation marked `succeeded` can no longer show a requested channel with no saved output as `prepared`. That channel now reports `output_missing`; failed, cancelled and recovery-required task evidence still takes precedence. A complete saved channel keeps its existing awaiting-review or reviewed state.

This is source completion, not hosted activation or founder acceptance. It adds no provider call, retry, reservation, publication, external message, credential or setting. The existing one-attempt Coordinator/Content/Quality runtime remains authoritative and channel specialists remain immutable responsibility lineage over its single Content-stage call.

## Closure audit

| Group 2 boundary | Implemented evidence |
|---|---|
| Founder assistant intake and private campaign handoff | migrations045, 048 and reviewed versioned request controls |
| Approved-context analyst onboarding | migration049 deterministic approved-fact qualification and immutable owner review |
| Reviewed hiring and safe pause | migration050 pinned Coordinator/Content/Quality roster and execution admission guards |
| Specialist delegation | migration068 versioned Blog/Pinterest/LinkedIn roster and immutable per-request assignments |
| Durable execution and recovery | migrations051–052 with existing036–038 authorization, accounting, output review and guarded reconciliation |
| Specialist runtime lineage | migration069 pins delegation/campaign/run/shared Content-stage identity without duplicate calls |
| Terminal truthfulness | migration070 exposes missing requested output as `output_missing` and preserves stronger failure/recovery evidence |

## Deferred founder checks

1. **MT256 — setup and preservation:** apply migration070 once after069. Expected: existing requests, runs, accepted output, reviews and specialist lineage remain readable; no generation starts.
2. **MT257 — accepted-run refresh:** refresh the already accepted successful campaign and its Founder desk request. Expected: saved requested channels remain `accepted` with private output available; nothing is regenerated or published.
3. **MT258 — incomplete-output negative:** in a disposable local/operator fixture only, project a succeeded run with one requested channel absent. Expected: the present channel awaits review and the absent channel is exactly `output_missing`, never `prepared` or accepted. New state sample: `output_missing`.
4. **MT259 — terminal precedence and access:** verify failed, cancelled and recovery-required tasks keep those states, members can read only the sanitized projection and cannot call the private projection function. Expected: no retry/provider call and no private prompt/accounting leakage.

Automated verification covers all 70 migrations and 34 SQL assertion executions, including a real migrated fixture with Blog saved and LinkedIn absent; 495 web tests across 81 files; 181 admin tests across 19 files; both standalone typechecks, lints and production builds; application boundaries and whitespace. The web build generated 143 static pages including this guide. Hosted070/PostgREST/browser/mobile/true concurrency, provider billing and MT256–259 remain pending.

Group 2 source implementation is complete. Group 3 source was already complete. The first-four program is still incomplete because Group 1 qualified optional AI artwork and Group 4 qualified live voice require genuine provider selection, commercial authorization, credentials and accounting evidence; they must not be simulated. Group 5 office visualization remains ON HOLD for founder design input and Group 6 stays out of scope.
