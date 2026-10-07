# Runtime SQL contract repair and stuck-v2 diagnosis

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

## Acceptance boundaries

Source fix prevents the same runtime identifier mismatch in future dispatches. It cannot silently repair an existing reserved stage, and no provider request or hosted mutation is performed. Live success remains pending. Current evidence proves a source/database contract mismatch and a matching visible stuck state, not that the hosted provider marker is definitely absent.

No new SQL migration. The operator SELECT is read-only and returns only safe state flags, runtime identifier and fixed error code. It does not output request contents, claim tokens or API secrets. Founder should paste its small result table. Next action after confirmation is guarded recovery of this exact unstarted reservation using existing server cancellation, retaining failed history; if the provider marker exists, usage remains unresolved and zero settlement is forbidden without evidence.

The original137-test suite includes migration-literal agreement, no provider call after record rejection, and no cleanup if SQL refuses cancellation. Manual diagnostic and hosted recovery remain pending.
