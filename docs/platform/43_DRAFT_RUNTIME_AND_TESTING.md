# Bounded draft runtime and testing

## Current checkpoint — 1.24 / P04.3.3.5

Explicit founder-owner draft dispatch is implemented on the separate admin deployment at `/admin/generations`, default off. Private campaign outputs now show Blog/Pinterest/LinkedIn text, citations, advisory QA and owner-only versioned human review. Additive037 follows036; no provider request, hosted SQL, publishing or Vercel setting change was made. See [44 Draft pilot and human review](44_DRAFT_PILOT_AND_HUMAN_REVIEW.md). This block supersedes older current-state blocks, which remain historical.

Founder reports the latest Gemini connectivity/three refreshed assignments/campaign readiness checks passed; screenshot independently confirms connectivity and Coordinator, and the prior video confirms Spending reload persistence. This is not whole-phase acceptance or proof of036 installation. New MT138–144 remain pending. P04.3.3 is IN PROGRESS; next is the explicitly activated one-run Gemini pilot and evidence review, not automatic advancement to visuals/publishing.


## Current delivery: 1.23 / P04.3.3.4

This checkpoint implements the server generation engine. It does **not** expose a live Generate button or enable provider execution. The next checkpoint wires authorized dispatch, output display and human review. Blog/Pinterest/LinkedIn **text** are the initial outputs; images, carousels and publication are later stages.

## Runtime contract

The engine runs Coordinator → Content specialist → Quality reviewer sequentially with exactly one model attempt per role, no tools, no fallback, no automatic retry and a 20-second abort signal per provider request. It uses the saved provider/model identity, not a hardcoded model ID. Fixed official provider origins and redirect rejection retain existing credential protections. Installed AI SDK7.0.127 ToolLoopAgent/Output.object APIs are used, with one-step stopping and retries0. `BIZOVEYA_ENABLE_MODEL_TESTS` does not enable campaign generation.

Before a call, service-only migration036 rechecks the original requesting actor's current non-viewer membership, unchanged campaign/preferences, still-approved exact knowledge versions, current agent binding/approval/profile/credential/test freshness and unchanged spending policy. It then reserves cost using035. A previously claimed role never authorizes another call, even after a crash. A succeeded/settled role is skipped on resume; reserved, failed or uncertain roles stop execution for operator review. Exact prompt/instructions/runtime-version/output-kind/token limit are privately recorded before sending a request. Structured output and exact fact citation identities are validated before saving. Each channel requires citations. QA approval with a blocking issue is invalid; any QA verdict still requires human review.

Output and reported usage must settle before the next role starts. Exceptions or missing usage retain uncertain cost for operator reconciliation. Oversized prompts/missing keys fail preflight before provider invocation and settle at zero, including zero request fee. Once request dispatch is durably marked, zero-cost cancellation is rejected. A failed stage or settlement ends the local orchestration without blind retries. No customer-facing route imports this runtime yet.

Migration036 also repairs **bidirectional** shared spending admission: connectivity tests now count campaign-stage held/recorded costs and uncertain stages, as generation admission already counts connectivity tests. Existing001–035 migrations are unchanged.

The generation flag is an internal future activation boundary, not a setup instruction for this release. Keep it absent/false. Do not call service RPCs manually; future dispatch must derive actor identity from a verified session, never a client-supplied actor ID. Provider usage and tenant/role acceptance remain untested on hosted services.

## Founder evidence recorded on 2026-10-04 PKT

- Founder reports034/035 applied.
- Screenshot150625: all three latest agent drafts v2 are preview-approved.
- Screenshots151407/151408/151410: Content/Quality current Gemini v2 assignments and Coordinator save confirmation.
- Screenshot151711: successful preparation and snapshot count1.
- Screenshot151810: snapshot prepared, campaignv3, three planned stages, count1.
- Refresh persistence is **not** inferred from those screenshots. Other unevidenced tests remain pending.

## Manual installation

1. Wait for both existing web/admin projects to be Ready for this source checkpoint.
2. Since034/035 are reported applied, run only `supabase/migrations/036_generation_runtime_claims.sql` once in Supabase SQL Editor.
3. Do not run `supabase/tests/036_generation_runtime_assertions.sql` on hosted data. It is a synthetic local fixture.
4. No new API key, environment variable, provider request or new form field is required. Keep campaign generation disabled.

## Required behavioral checks

| Check | Steps | Expected | Status |
|---|---|---|---|
| MT133 | Apply036; reopen campaign/Knowledge/Studio | Existing data remains intact | Pending |
| MT134 (conditional) | Open Agents; change one disposable/test configuration, enter reason, save then check | Reason stays populated; checkbox resets; save/check/approve remain separate audited actions | Pending |
| MT135 | Refresh existing prepared campaign and expand snapshots | Same prepared entry/campaign version/stage count; no new entry on refresh | Pending |
| MT136 | Open admin Spending | Old Gemini test history loads; no stage or charge from this update/preparation | Pending |
| MT137 | Check campaign and admin desktop/mobile | Existing controls remain readable; no live Generate control or public admin link appears | Pending |

MT134 is a conditional check only if you have a disposable/test agent; skip it on production-bound agents. Use a disposable agent for MT134; changing a production-bound agent makes its current binding stale. For a test agent: review reason `Review a disposable agent configuration and validate its saved settings.` If you deliberately edit instructions, sample `Use approved facts and exact source citations. Prepare English drafts for human review. Do not publish or call external tools.` Save, check, tick the review checkbox and approve. No other new field exists.

For the campaign persistence check, use your existing snapshot; do not create another one. If a new campaign is needed: title `AI SEO workflow for a small business`; brief `Prepare English blog, Pinterest and LinkedIn text drafts from approved facts for human review. Do not invent statistics or publish anything.`

## Next checkpoint

Wire founder-owner dispatch on the separate admin deployment, saved output display in the private campaign room, advisory QA status and explicit human review. Provide a complete one-run Gemini pilot guide with setup, sample inputs and expected outputs. Activation is explicit; no scheduled provider execution or publishing. The current phase stays IN PROGRESS.

## Automated evidence

415 unit tests (321 web,94 admin),57 local SQL migration/assertion/upgrade steps, both typechecks/lints, application boundaries and both production builds pass. These checks use synthetic providers and local databases; no hosted/provider/browser acceptance is claimed.
