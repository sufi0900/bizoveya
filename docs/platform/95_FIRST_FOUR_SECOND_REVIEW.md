# First-four second review and voice-start repair

Review base main: `9366aabdecae66ef7e1f2469f8cb578b0f9d710b`. The founder requested another independent source inspection before starting office visualization. This is maintenance of the delivered first version, not a new group or a restart of the five-delivery budget. Continuation remains paused.

## Finding and correction

The browser hook created its runtime only after the token endpoint replied. Stop/unmount while that HTTP request was pending marked cancellation but could leave an already granted microphone active until the reply arrived. That contradicted the immediate cleanup wording in guide93. The hook now tracks starting resources as soon as microphone permission resolves, releases tracks/audio context immediately on Stop/unmount, and bounds token HTTP at25seconds. A late microphone permission result is released before any token/provider request. A returned issued token after cancellation still follows the existing truthful close path; unknown or failed token provisioning remains subject to durable server receipts and operator recovery, not invented zero usage.

Two synthetic hook regressions execute the real start/stop callbacks with fake microphone/audio/network boundaries. They confirm immediate cleanup during a pending token response and no provider request after late permission cancellation. No real provider was invoked.

## Rechecked source verdict

| Group | Result | Remaining acceptance |
|---|---|---|
| 1 Private media/templates/optional artwork | Existing generation admission, sanitization/storage, review/composition and actor/site replay wiring inspected; documented first-version source complete | Real image API/billing qualification, Storage/browser and founder checks pending |
| 2 Founder/onboarding/team/delegation/durable execution | Reviewed intake, deterministic approved-context assessment, pinned team/channel responsibility and shared Content runtime inspected; source complete | Real role/concurrency/operator/founder acceptance pending |
| 3 Meetings/announcements/distribution | Saved agendas/decisions, acknowledged packets, bounded consent/execution, reviewed outcome/knowledge handoff and recovery inspected; source complete | Live meeting/provider/true concurrency and founder acceptance pending |
| 4 Live voice | Capture/setup/playback/interruption/context/reviewed handoff/receipt paths inspected; the identified pending-start cleanup defect repaired | Genuine model qualification, microphone/playback/network/mobile acceptance pending |

No additional missing planned source exit was identified in this second inspection. This is not a guarantee that real-world testing cannot reveal defects. Source-complete does not mean zero bugs, public readiness, automatic publication, an autonomous full agency, real-human meeting attendance or qualified live provider activation. The analyst onboarding is a deterministic approved-context assessment in this first version; the channel specialists share the existing bounded Content stage. Office visualization and custom-agent creation were never included in these four source groups.

The earlier source audit and consolidated checklist remain in [94](94_FIRST_FOUR_SOURCE_COMPLETION_AND_ACCEPTANCE.md). Group5 office remains ON HOLD until founder design direction is supplied; its design/source work can proceed separately while routine founder acceptance stays pending before public reveal. Group6 is still out of scope.

## Verification and later check

Fresh verification:533 web tests across92 files, web typecheck/full lint, web production build, boundaries, whitespace and canonical projection passed before main delivery. Admin source and SQL schema are unchanged; their201-test/75-migration/38-assertion evidence is from the completed Turn5, not a new run. No hosted write, provider call, publication, external message or deployment-setting change.

Necessary later manual check (pending): during the next genuinely needed and qualified voice session, press **Stop voice** while it says **Connecting**, or navigate away. Expected: browser microphone indicator turns off immediately; a late permission result also releases its track. Refresh media activity to inspect the real receipt before starting again if token provisioning or closure was uncertain. Do not perform another successful generation solely for this test. No new field/key/migration/sample input is introduced.
