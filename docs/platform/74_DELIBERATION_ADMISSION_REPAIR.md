# Deliberation admission repair

## Source repair

Review of migration056 found that JSON null identity values were cast to SQL null and could reach lookup/primary-key errors instead of the defined `bz_invalid_deliberation_plan` error. Additive `057_deliberation_identity_admission.sql` validates meeting/plan identity types, UUID parsing and distinct identities after authorization, then calls the preserved original planner through a private implementation with all direct caller grants revoked. Migrations001–056 and stored plans/turns/history remain unchanged.

The existing API/UI contract already rejects these inputs. This repair aligns direct authenticated RPC behavior with that contract; it introduces no new field, key or environment variable. Broader SQL tests now directly exercise null identities and numeric limits, stale versions, paused/changed rosters, cancelled meetings, exact retries, ACL denial, immutable history and absence of generation/spending records. The original056 suite did not directly test all the stale/roster cases described in guide73; this successor supplies that missing automated evidence.

## Verification and deferred acceptance

57 ephemeral local migrations and21 SQL assertion executions passed using simulated Supabase auth. Automated BZ-093/CW-093 verification:465 web tests/78 files,57 local migrations/21 SQL assertion executions, web production build with type/lint validation, boundaries, whitespace and482 local Markdown links passed. The identity regression fails against056 alone and passes with057. Admin source/tests/build are unchanged and not rerun. Guide74 and BZ-093/CW-093 render in the document room. Hosted/PostgREST/worker/concurrency/founder acceptance remains pending; no active lease retained. Hosted SQL/PostgREST, real workers, mobile/browser and true concurrency remain untested; MT204–207 and every earlier unanswered founder test remain pending. No provider call, hosted installation, settings change, external message, publication or regeneration occurred.

1. During the later combined setup, apply only missing migrations in order through `057_deliberation_identity_admission.sql`. Expected: existing accepted drafts, media, meetings and plans remain intact.
2. Continue guide73's deferred checks using its existing samples: rounds `1`, input tokens `1200`, output tokens `600`, ceiling `5` US cents. Expected: plan persistence and guarded denials; no new input or immediate founder action is required.

## Continuation

Base main `9c659d97882385359cb7a0390ee1280d6d342fc1`; BZ-093/CW-093. Historical phase branches/open draft PR2 inspected. No repository AGENTS or active checkpoint lease found. The local homepage screenshot change is preserved and excluded.

Next remains safe deliberation scheduling/admission and pause/resume enforcing all saved bounds. This repair does not implement scheduling or real reasoning. First-four groups remain unfinished, office visualization ON HOLD and custom agents out of scope. Routine founder testing stays deferred; real execution dependencies still apply.
