# Durable generation snapshots and testing

P04.3.3.2 / source1.21 adds the safe preparation boundary for future AI-generated campaign drafts. The phase remains in progress. This checkpoint does **not** contact Gemini, Nebius or OpenAI; reserve or charge money; generate content; render visuals; or publish.

## What is implemented

The saved campaign screen can prepare a durable run ID before any future provider call. Preparation rechecks workspace write access and the exact saved campaign version, then privately freezes:

- campaign ID, version and full brief/draft document;
- current site preference version and document;
- every currently approved knowledge source, source version, fact and approval time;
- exactly one ready coordinator, content and quality stage, including agent instructions/version;
- each stage's reviewed model binding, model profile/version, credential-reference version and connectivity evidence ID;
- each stage's reviewed spending-policy version and pricing snapshot;
- hard boundaries: three stages, one future attempt per stage, no publication and no external tools.

Private snapshots live in `bizoveya_private.generation_runs`; authenticated clients cannot select the table. The customer RPC returns only run ID, campaign/version, status/timestamps, stage count and whether output exists. Preparation is idempotent for the same run ID and rejects stale campaigns, missing approved facts, incomplete/expired bindings, expired/disabled pricing, viewers, outsiders and more than25 prepared runs per campaign. Site deletion cascades the private snapshots.

Shared typed schemas now define `campaign-plan-v1`, `campaign-drafts-v1` and `campaign-quality-v1` with bounded channel text, source/version/fact citations and blocker/warning QA issues. They are contracts for the next execution checkpoint, not evidence that a model ran.

## Required installation

If migration033 is already applied, run only `supabase/migrations/034_generation_run_snapshots.sql` in the Supabase SQL editor, once. Do not run `supabase/tests/034_generation_snapshot_assertions.sql` on hosted data. No new environment variable or API key is required for snapshot preparation.

Deploy the same cumulative repository to the existing web/admin Vercel projects. The founder authorized verified cumulative delivery directly to `main`; a main push may trigger the existing production deployments. No Vercel setting, hosted migration or provider call is performed by the assistant.

## Prerequisites before testing the button

1. In site Knowledge, keep at least one source approved. Copy/paste fact: `Do It With AI Tools helps readers discover and compare practical AI tools and workflows.`
2. In site Agent readiness, save: Brand voice `Practical, clear and evidence-led.` Audience `Freelancers, consultants and small business owners exploring AI tools.` Guidance `Prepare drafts only. Do not invent statistics, guarantees or unsupported product claims.`
3. In admin Agents, coordinator, content and quality must each have a checked, preview-approved current version with the tier used by the chosen model profile.
4. In admin Model tests, obtain a current successful test for the exact profile/reference version. Tests older than24 hours make bindings not ready.
5. In admin Bindings, assign all three current agent versions to reviewed current profiles/test evidence.
6. In admin Spending, each bound profile needs an enabled, unexpired reviewed policy. Snapshot preparation records it but does not reserve or charge it.
7. Save the campaign so the page says there are no unsaved changes.

## New manual acceptance

| ID | Action | Expected | Status |
|---|---|---|---|
| MT118 | Apply034; deploy cumulative main; open a saved campaign | Snapshot control appears; existing content/history remains | Pending |
| MT119 | With prerequisites current, select Prepare generation snapshot | Success; one prepared row;3 stages; no provider usage/cost/publish | Pending |
| MT120 | Refresh/reopen campaign | Prepared row persists with same campaign version/time | Pending |
| MT121 | Change campaign without saving, then try preparation | Button disabled; save required | Pending |
| MT122 | Save a newer version in tab A; prepare from stale tab B | Conflict; no stale snapshot | Pending |
| MT123 | Revoke knowledge or make binding/pricing stale, then prepare | Readiness error; no run created | Pending |
| MT124 | Viewer/outsider/anonymous attempts UI/API | Viewer cannot prepare; others denied; snapshot private | Pending |
| MT125 | Delete a disposable test site using owner confirmation | Its summaries disappear; external site untouched | Optional destructive; pending |
| MT126 | Mobile/desktop plus campaign/Studio/admin/docs smoke | Usable UI; no observed regression | Pending |

## Still not implemented

Provider execution, shared reservation/settlement for generation stages, retries, terminal failure handling, model-produced outputs and human accept/reject remain the next P04.3.3 checkpoint. The future runtime must allocate a durable stage ID before each call, reserve cost atomically using the032 accounting rules, persist structured output/usage before responding, hold unknown/overrun cost for reconciliation, and never retry a billable stage blindly. Pinterest graphics, LinkedIn carousel/PDF and every publishing connector remain later work.
