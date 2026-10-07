# Gemini rejection repair and controlled follow-up

Verification2026-10-07 PKT:137 admin tests, admin typecheck, targeted runtime lint, both production builds and application boundaries passed. Guide47 rendered in the web document room. No hosted SQL execution, live model request or existing-record recovery performed. No active lease; founder read-only diagnostic is the next action.

## Runtime/SQL contract regression repair — P04.3.3.8 (2026-10-07 PKT)

Founder screenshots21:55–22:00 show snapshot29293e34-e773-4ffe-88f1-dc9645dd60c6 (campaignv2) stuck running, Coordinator reserved, no active dispatch lease, no result after refresh. Previous Content reconciliation forfb12a480 is screenshot-confirmed; this does not settle the new Coordinator reservation.

Code investigation confirmed a regression introduced in P04.3.3.7: runtimeVersion was changed to draft-runtime-v2-ai7.0.127-gemini-compact while migration036 explicitly permits only draft-runtime-v1-ai7.0.127. That rejects bz_record_generation_request after reservation before generateStage. Dispatch then ends its lease but leaves the stage reserved. Prior mock tests did not enforce the SQL literal. This is an implementation defect, not evidence of Gemini billing/credit failure. Hosted exact stop remains pending read-only confirmation.

Repair restores the SQL-compatible runtimeVersion and records transportSchemaVersion=gemini-compact-v1 separately. Request-recording errors now call existing guarded bz_cancel_unstarted_generation_stage before returning failed. SQL refuses cancellation when the provider-start marker exists; ambiguous RPC responses preserve unresolved reservations rather than inventing zero usage. New tests compare the serialized runtime identifier against migration036 itself and cover rejected-record cancellation and refused cleanup. Compact-schema validation/privacy behavior remains intact. No migration or live request; existing stuck record is not automatically rewritten.

Manual next: run the SELECT in tools/operator/inspect-v2-stuck-generation.sql in Supabase SQL Editor (read-only, not a migration). Share request_recorded, runtime_version, stage_status and active_dispatch. Expected for this regression: request_recorded=false, runtime_version=null, stage_status=reserved, active_dispatch=false. If request_recorded=true, preserve accounting and investigate separately. Do not rerun, reconcile or prepare another snapshot before safe recovery of this specific record is established. No key, pricing or account changes. See47.

Verification:134 admin unit tests across14 files passed (12 synthetic provider and15 diagnostic tests); admin typecheck, targeted generation lint, both production builds and app boundaries passed. The new46 guide is included in the built visual document room. Full directory lint scanned generated build artifacts and is not claimed as passing; targeted source lint and build checks passed. No live provider, hosted SQL, browser/manual acceptance, charge reconciliation or production deployment verification performed. No active lease at delivery. Next action: read-only founder checks, then evidence-backed reconciliation of the latest failed Content record before a single controlled new-snapshot test.

## Status and evidence

P04.3.3 remains IN PROGRESS. Founder-authorized diagnostic repair delivered through main. The Oct7 campaign snapshotfb12a480-6923-4d3d-a66a-5777fe347f4a failed after Coordinator succeeded (689input/553output,settled); Content returned HTTP400 and unavailable usage. Credit/key expiry is not confirmed. No Vercel error log is expected from the old caught-and-stored generic label. Existing records are preserved; their discarded provider details cannot be recovered.

## Repair and dependency map

| Layer | Change | Retained controls |
|---|---|---|
| Gemini transport | Compact object/type/enum/required/items schema; removes format,regex,length and numeric-bound constraints from provider guidance | Full canonical Zod validation, strict keys and citation validation remain local |
| Provider diagnostics | Bounded in-memory JSON inspection produces only fixed labels | No raw provider text, user content, keys, URL or arbitrary field paths persisted |
| Admin queue | Existing errorCode plus diagnosticMessage renders new safe categories | Existing migration038, tenant/owner/MFA filters |
| Request record | Runtime version identifies compact schema implementation | Frozen campaign/knowledge/agent/model inputs and spending reservations |
| Visual docs | Canonical Markdown loaded directly by document room | No duplicate out-of-sync content |

This is a compatibility hardening change, not proof that the prior schema caused the live400. No provider/model change, new dependency, migration or automatic retry.

## Diagnostic meanings

| Code | Meaning |
|---|---|
| provider_schema_rejected | HTTP400 provider message references response schema/structured output; not proof of depleted credits |
| provider_precondition_failed | HTTP400 FAILED_PRECONDITION; account/billing prerequisites need inspection, billing not automatically assumed |
| provider_payment_required | HTTP402 payment required |
| provider_key_invalid | HTTP400 explicitly reports invalid/expired key |
| provider_key_blocked | HTTP403 explicitly reports key blocked as leaked |
| provider_request_rejected | HTTP400 with no recognized safe category; exact reason remains unknown |

Classification is deliberately conservative and provider-derived, not an independent account diagnosis. Raw details remain private and are not logged. Unknown usage is never inferred as zero from HTTP status or the free-tier claim.

## Installation and read-only tests now

1. Wait for the latest main commit to deploy to both existing applications. No new SQL, API key or environment variable is required.
2. Open Admin > Draft runs; refresh and select the Oct7 failed snapshot. Expect existing Coordinator succeeded/settled and Content failed/unknown with the historical provider_request_rejected code. It will not retroactively show a more specific reason. Failed runs remain unrerunnable.
3. Refresh again. Expect no new provider attempt or spending entry. The spending record remains unknown until separately reconciled.
4. Open /bizoveya/docs and select46 Gemini rejection repair. Expect this evidence, repair and manual guide.

## Conditional controlled live check (after accounting evidence exists)

Do not perform this while latest Content usage/cost is unresolved. No live execution is performed by this delivery.

1. Independently verify applicable provider cost/account status for the new Oct7 failed request. In Spending controls select that exact Content record. Enter the actual verified USD amount (0 only if independently verified) and a factual reason. Example to customize: 'Verified [project/account reference] for [request time interval]: [verified free-tier or billing evidence and amount]. This reconciles cost only; token usage remains unknown and the failed run is preserved.' Tick evidence confirmation and save. Never invent the bracketed facts. Expect only that record reconciled; history retained.
2. Confirm Coordinator, Content and Quality assignments still reference a current passed model/profile test; refresh evidence only if expired. Do not change the Gemini model or credential to guess a fix.
3. Use the existing saved Do It With AI Tools campaign. Optional replacement brief (save before preparing): 'Create English draft-only blog, Pinterest copy and LinkedIn text explaining a practical AI-assisted content workflow for freelancers. Use only approved knowledge, cite it accurately, avoid unsupported performance claims, and require human review.' Existing title/body fields need no change.
4. Prepare a NEW snapshot from the current saved version. Expect prepared, current dependencies and no provider execution. Old failed snapshot stays unchanged.
5. In Admin Draft runs select the new snapshot, verify activation/consent/prerequisites. Enter reason: 'Run one controlled Gemini draft-only compatibility check after verified cost reconciliation. No publishing.' Tick the review checkbox and run ONCE.
6. Expected success: three stages succeeded/settled and a durable private Blog/Pinterest/LinkedIn output bundle with QA. If it fails, stop; capture snapshot ID, stage and safe errorCode. Do not rerun or set unknown usage to0. New safe categories only apply to this new request.
7. On success refresh the private campaign output page; review all channel drafts and exact citations. A QA approval is advisory, not automatic publication or whole-phase acceptance. Saved-output persistence/human-review/export checks remain pending until explicitly reported.

## Verification and limitations

Synthetic adapter tests cover valid all-channel output, overlength local rejection, invalid JSON, truncation, HTTP400 schema rejection and quota failure without retry; diagnostic tests cover billing/key categories, malformed/oversized bodies, privacy and timeout precedence. Automated results recorded in continuation at delivery. These fixtures do not prove live Gemini compatibility or free-tier availability.

Official references checked2026-10-07: https://ai.google.dev/gemini-api/docs/structured-output (subset and complexity limits); https://ai.google.dev/gemini-api/docs/troubleshooting ; https://ai.google.dev/gemini-api/docs/api-errors . No purchases or billing activation are requested.
