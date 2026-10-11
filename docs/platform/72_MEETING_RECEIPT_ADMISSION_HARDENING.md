# Meeting receipt admission hardening

## Corrected source boundary

Review of 054 found that the finish RPC did not reject null agent ID/version before nullable SQL comparisons. A caller with the server service credential and a valid active claim could therefore omit the pinned identity. Its new-claim RPC also did not recheck owner membership, meeting changes or the current site roster. Additive `055_meeting_receipt_admission.sql` closes these gaps without changing 001–054, stored receipts or successful drafts. This is a prerequisite repair for later deliberation, not a new completed group.

The invitation checkbox now binds confirmation to the displayed meeting version; changing the version clears its effective approval. The participant heading no longer denies an acknowledgement when an actual receipt is present.

Both public service RPCs now reject missing meeting, role, claim, agent identity and agent version. New delivery claims additionally require the invitation creator to remain a workspace owner, the meeting to remain decision-recorded at the invitation's exact successor version, and the pinned roster to remain enabled at the same version with the same role/agent selection. Site, meeting, membership and roster locks protect admission. Re-enabling a changed roster does not revive an old packet.

A previously claimed packet may still finish its truthful acknowledgement or decline after pause, cancellation or owner revocation. Completion records delivery evidence only and still requires the exact pinned identity, valid claim, unexpired lease, bounded outcome/note and quota. It does not authorize new work. Exact finish retry remains idempotent. Old implementations move to private functions with no direct caller grants; authenticated/anonymous users cannot invoke worker RPCs. A service credential is trusted server authority, not independent authentication of an AI personality.

## Verification and deferred acceptance

Automated verification for BZ-091/CW-091: 461 web tests/78 files and 55 ephemeral local migrations/19 SQL assertion executions passed; web production build (including type/lint checks), application boundaries, whitespace and 426 affected local Markdown links passed. Guide72 is projected in the document room. Admin source/tests/build are unchanged and were not rerun; prior evidence is historical. Hosted SQL, actual workers, browser/mobile, concurrency and founder acceptance remain pending. No active checkpoint lease retained at delivery.


Local regression coverage rejects each omitted identity field, paused/changed team, revoked owner, cancelled meeting and expired completion. It checks expired-claim recovery, exact finish retries, immutable history, ACLs and absence of generation. Automated SQL uses simulated auth and does not establish hosted concurrency or real worker delivery. MT200–203 and every earlier unanswered founder test remain pending.

1. Later apply only missing migrations in order through `055_meeting_receipt_admission.sql`. Expected: saved drafts, media, accepted review and existing meeting/request records remain intact. No new key or environment variable.
2. When checking guide71's disposable invitation path, pause the site team before new worker delivery. Expected: new claims stop, while an already claimed packet can record its receipt. Do not manually invoke service RPCs in production; real-worker acceptance remains pending until its authorized deployment.

No new UI field or sample text is introduced. Existing guide71 samples remain applicable. No hosted SQL, provider call, setting change, message, publication or regeneration occurred.

## Continuation

Base main: `0aee385a9ffa402809b28124225af7f523b1e6e6`; BZ-091/CW-091. The pre-existing local homepage screenshot edit is preserved and excluded. No repository AGENTS or active checkpoint lease was found; only historical phase branches and draft PR2 remain.

Next documented source slice remains bounded deliberation-plan preparation from acknowledged packets, with explicit turn/cost limits and no planning model call. Real worker deployment/receipt evidence remains pending. First-four groups remain unfinished; office visualization stays ON HOLD and custom agents out of scope. Hosted installation is deferred until founder acceptance.
