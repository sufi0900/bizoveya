# Five-delivery completion plan — Turn 1 media admission

## Turn2 completion ledger

Turn2 source implementation is complete at the next delivered main successor of `d751eb5adf3746fa6a78e3e5935fcf3be221c8c5`: authenticated qualified Gemini Live token execution, direct browser microphone/playback, interruption, disconnect/setup/session timeouts, transcript correction, separately reviewed agency-form handoff and truthful additive073 session closure. No Turn2 coding item carries into Turn3. Live qualification, credentials/quota, browser acceptance and MT268–271 remain pending; no provider call was made. See [91](91_BROWSER_LIVE_VOICE_AND_REVIEWED_HANDOFF.md). Completion ledger: **Turns1–2 complete; Turns3,4,5 planned**.

Source base `96625ff082dde25a5af8e7dcc2acb31e5899bdf1`. The founder requires five bounded deliveries, each completing its assigned coding and verification before handoff. Source-complete means implemented code and required automated checks; it does not mean deployed live acceptance, and does not mean missing coding. Deferred founder tests remain pending until before public reveal. No optional artwork requirement may block the core agency.

| Turn | Fixed deliverable | Exit |
|---|---|---|
| 1 | Durable separate media qualification, owner authorization, request/session admission, quotas, concurrency, shared accounting and guarded recovery; server/API/admin wiring | Migrations071–072, strict shared contracts, guarded routes, trusted worker primitives, synthetic SQL/app verification and canonical documentation |
| 2 | End-to-end Gemini Live browser microphone, playback, interruption, disconnect cleanup, qualified token endpoint and corrected transcript handoff | Complete source flow and synthetic tests; real provider/microphone acceptance pending |
| 3 | Optional image worker, sanitized private generated-media provenance, review and composition | Complete source flow and synthetic tests; real artwork qualification/acceptance pending |
| 4 | First-four integration, context/permission/recovery paths, mobile/accessibility review | Integrated source exits verified; no phase5 office |
| 5 | Full source-to-plan audit, regression/SQL/type/lint/build/boundary checks and consolidated acceptance package | Final truthful source verdict; stop five-turn continuation. Only a concrete critical defect justifies another turn |

Turns2–5 are not completed by Turn1. Group2 founder assistant/onboarding/hiring/delegation/durable text execution and Group3 meetings/announcements/distribution retain their audited source-complete status. Group1 media and Group4 live voice remain open. Office visualization awaits founder design; custom agents remain out of scope.

## Turn 1 implementation

Migration071 is additive after070; previous migrations remain unchanged. Four RLS-enabled private tables store qualification versions, immutable review operations, bounded requests and append-only events. No API key or ephemeral token is stored. A reviewed qualification pins provider/model, credential metadata version, current budget profile, commercial/API evidence and limits. Voice and image are independent. Owner admission does not call a provider; exact replay returns the same durable receipt and never authorizes another execution. Only a trusted service worker can claim/start/finish/cancel. It rechecks current owner, qualification, credential and policy immediately before provider start.

Reservations and actual charges join connectivity, draft-stage and meeting-turn charges under the shared transaction lock and UTC daily allowance. Unknown/overrun media spending blocks later shared-profile calls. Runtime tariff snapshots, input/output ceilings and explicit request fee determine conservative reservation. Free-attested requires all rates zero; saving this declaration is not verification by the assistant. Operators must verify that the exact API/project really qualifies. Started work with missing usage retains an uncertain charge; no automatic retry. A voice token receipt remains issued/reserved, not succeeded/settled. Expired started sessions require truthful reviewed reconciliation rather than trusting browser token claims. Unstarted cancellation is zero-cost with zero tokens; started cancellation is rejected.

Admin `/admin/media` and `/api/admin/media` require administrator/MFA plus workspace ownership. Site `/api/workspaces/{workspaceId}/sites/{siteId}/media` validates membership for reads and owner review for admission. Server-only worker functions expose no public claim/start/settlement route. Strict JSON rejects expanded authority and secret/token fields. Recovery never calls the provider or restores output. Core templates/uploads/text/meetings have no dependency on an enabled artwork record.

## Later manual checks — all pending

1. MT264: Open admin **Media capabilities** after MFA. Expected: owned sites load, separate qualifications/request states appear, no provider runs on opening. Viewer/editor cannot qualify or admit. No input is required.
2. MT265: Only after verifying API model/credential/terms/pricing, paste the sample reviewed command below. Replace site/workspace/profile IDs with the displayed real IDs; use a fresh operation UUID and current expectedVersion (`0` if absent). Replace model/evidence/expiry with actual verified values. Expected: saved qualification; no provider request. This synthetic sample is not live billing evidence.
3. MT266: With a trusted test operator after voice/image execution exists, exercise duplicate admission, pause/stale qualification and concurrency/quota denials. Expected: one request/attempt, no automatic retry, core drafts/templates still work. Use the admission samples below; do not repeat the accepted text generation.
4. MT267: After an actually expired request, use the recovery sample below. Expected: unstarted work settles zero, started unknown usage stays unknown until real billing evidence is reconciled. Never attest a zero charge solely because the browser disconnected.

The sole new admin field is **Review command JSON**. It contains this complete sample; all nested values are explicit:

```json
{
  "command": "review",
  "workspaceId": "11111111-1111-4111-8111-111111111111",
  "siteId": "22222222-2222-4222-8222-222222222222",
  "input": {
    "operationId": "33333333-3333-4333-8333-333333333333",
    "capability": "live-voice",
    "expectedVersion": 0,
    "action": "qualify",
    "reason": "Reviewed this exact API model, account access and commercial pricing evidence.",
    "reviewed": true,
    "document": {
      "provider": "gemini",
      "modelId": "REPLACE_WITH_VERIFIED_LIVE_MODEL",
      "credentialRef": "platform-gemini",
      "credentialVersion": 1,
      "budgetProfileId": "44444444-4444-4444-8444-444444444444",
      "costMode": "free-attested",
      "inputTokenLimit": 4096,
      "outputTokenLimit": 1024,
      "durationSeconds": 60,
      "maxDailyRequests": 10,
      "maxConcurrent": 1,
      "inputRateMicros": 0,
      "outputRateMicros": 0,
      "requestFeeMicros": 0,
      "validUntil": "2026-10-14T00:00:00Z",
      "evidenceUrl": "https://example.com/replace-with-actual-account-api-evidence",
      "apiVerified": true,
      "commercialReviewed": true
    }
  }
}
```

For artwork use `capability: image` and the verified image model with its actual metered/free tariff. Voice and image qualification cannot substitute for each other. `validUntil` must be future and no more than seven days away. Token rates are USD millionths per million tokens; request fee and budget limits are USD millionths. Audio/image tariff must cover the actual modalities including any per-request/image charge; do not use text-only pricing as evidence. Current credential metadata and a checked enabled spending profile are prerequisites.

Pause command, using the same field and real IDs/current version:

```json
{"command":"review","workspaceId":"11111111-1111-4111-8111-111111111111","siteId":"22222222-2222-4222-8222-222222222222","input":{"operationId":"55555555-5555-4555-8555-555555555555","capability":"live-voice","expectedVersion":1,"action":"pause","reason":"Pause new sessions while reviewing current account access.","reviewed":true}}
```

API admission samples (later browser/worker integrations consume them; admission alone never executes):

```json
{"id":"66666666-6666-4666-8666-666666666666","capability":"live-voice","expectedQualificationVersion":1,"document":{"purpose":"founder-assistant"},"reviewed":true}
```

```json
{"id":"77777777-7777-4777-8777-777777777777","capability":"image","expectedQualificationVersion":1,"document":{"prompt":"Create a clean blue illustration of an AI assistant organizing private drafts. No text or logos.","aspectRatio":"2:3"},"reviewed":true}
```

Recovery command, after expiry and using the displayed request ID/state:

```json
{"command":"recover","input":{"id":"66666666-6666-4666-8666-666666666666","expectedState":"reserved","action":"recover","amountMicros":null,"reason":"Request expired; recover its durable state without retrying the provider.","reviewed":true}}
```

Reconciliation sample only with actual billing evidence: change expectedState to displayed `unknown` or `overrun`, action to `reconcile`, amountMicros to the verified actual USD millionths (example `0` only if evidenced), and reason to `Confirmed actual zero charge against account billing evidence; reconcile without retry.` No key, token or new environment field is introduced in Turn1.

## Verification and hosted installation

Final automated and hosted results are recorded at the delivery checkpoint below. Synthetic tests are distinct from actual API billing, browser microphone, PostgREST sessions, true parallel requests and founder acceptance. No provider request, new content generation, external message, publication or deployment settings change occurs in Turn1.

## Turn1 final checkpoint

All Turn1 exit conditions are completed in this delivery: separate durable qualification, owner request admission, immutable event/provenance, one-attempt worker claims/provider markers/results, conservative reservations, quotas/concurrency/shared accounting, reviewed recovery, guarded server routes/admin control, automated regressions and canonical/visual projection. No Turn1 coding item is deferred to Turn2. Turn2 is exclusively the separately planned browser/live-voice integration, not a claim that voice is already live.

Review found and repaired a post-admission legacy-charge race within Turn1. Additive072 rechecks unresolved connectivity/draft/meeting usage at media claim and immediately before provider start; new synthetic cases prove both denials. Already-applied071 was preserved byte-for-byte rather than rewritten.

Hosted071 installed as `20261012200429`; hosted072 installed as `20261012200738`, with preservation verified in the same delivery. Both additive migrations were applied to the previously verified `voxfolio` project only. All four existing generation/review/visual/history fingerprints remain unchanged. New media requests and qualifications are both zero; all four new private tables have RLS. Anon cannot admit and authenticated browser users cannot start a provider; service-only start is installed. No live provider or hosted synthetic fixture was used.

Automated final verification: 201 admin tests/22 files, 500 web tests/82 files, 72 ephemeral migrations/35 SQL assertion scripts, both typechecks/lints/production builds, application boundaries, whitespace and document projection checks passed. Guide90 is included in the146-page web build. Existing CSS/cache build warnings are unchanged. Browser microphone, real API billing, true parallel PostgREST requests and founder MT264–267 remain pending. No new deployment key/environment value was added.

Completion ledger: **Turn1 complete; Turns2,3,4,5 planned**. The delivered commit is the main successor of the stated base; its canonical link is supplied in chat/GitHub history. After Turn5 pause the existing continuation even if a concrete unfinished blocker must be reported. No rolling turn estimate or counter reset.
