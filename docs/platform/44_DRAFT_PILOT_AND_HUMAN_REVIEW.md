# Draft pilot and human review

## Current founder evidence — 2026-10-07 PKT

P04.3.3 is IN PROGRESS. Founder evidence confirms failed Content run `fb12a480-6923-4d3d-a66a-5777fe347f4a` cost reconciled to USD 0 on free-tier attestation (unknown tokens remain unknown), and unstarted run `29293e34-e773-4ffe-88f1-dc9645dd60c6` safely cancelled by the founder after SQL confirmed `provider_started_at` null (failed / preflight_failed, settled, zero tokens).

Live Gemini run `80091597-06eb-4b8e-ae10-6239ae2b2b69`, campaign “Do It With AI Tools — export test-v2”, version2: Coordinator succeeded/settled692 input /668 output, Content1289/716 and Quality1782/321. Founder reports saved Blog/Pinterest/LinkedIn text, fact references, positive QA and no stage errors. Latest review screenshot reportedly confirms Human review saved: reviewv1 accepted at2026-10-07 23:04:49 PKT for private draft use only. Exact reason and evidence limits are recorded in [48 Live draft evidence](48_LIVE_DRAFT_EVIDENCE_AND_REMAINING_GATES.md).

Reload persistence, clipboard/export, stale/negative review, access and other unevidenced tests remain pending. The short blog remains an open commercial-quality finding. No publication or regeneration occurred. Next: complete44/45 acceptance on the existing output, then inspect actual saved blog/brief/limits for quality improvement; no repeat generation is needed. P04.3.4 visuals remain planned until durable text acceptance. No new migration, field, key or deployment setting. No active checkpoint lease was recorded on inspected main `1ca04645c34c13f803a05689d66c26d99d692152`; old PR2/phase branches are historical. This block supersedes earlier next-action/current-state claims below; those retain the evidence available at their original checkpoints.

Verification:134 admin unit tests across14 files passed (12 synthetic provider and15 diagnostic tests); admin typecheck, targeted generation lint, both production builds and app boundaries passed. The new46 guide is included in the built visual document room. Full directory lint scanned generated build artifacts and is not claimed as passing; targeted source lint and build checks passed. No live provider, hosted SQL, browser/manual acceptance, charge reconciliation or production deployment verification performed. No active lease at delivery. Next action: read-only founder checks, then evidence-backed reconciliation of the latest failed Content record before a single controlled new-snapshot test.

## Current diagnostic repair — P04.3.3.7 (2026-10-07 PKT)

Gemini transport now uses a compact JSON schema with canonical validation retained locally (strict keys, lengths, UUIDs and exact approved citations). Provider errors persist only fixed safe labels for response-schema rejection, unmet prerequisite, invalid/blocked key and payment requirement; raw messages, response bodies, URLs and secrets are never stored or exposed. Runtime request provenance is tagged draft-runtime-v2-ai7.0.127-gemini-compact. One attempt,20-second bound and spending reconciliation guards remain unchanged. No migration, provider call or billing activation. Historical failures cannot acquire new details retroactively. This compatibility repair is locally verified only; successful live generation remains pending. See [46 Gemini rejection repair](46_GEMINI_REJECTION_REPAIR.md). This current entry supersedes older next-step guidance without deleting history.

Founder evidence Oct7: old Content cost reconciliation persisted; refreshed connectivity test057e14ae-c5ec-4b9c-933b-c43e4880058f and all three assignments are current. New snapshotfb12a480-6923-4d3d-a66a-5777fe347f4a failed: Coordinator settled689input/553output; Content provider_request_rejected, usage unknown; no completed output/Quality result evidenced. Founder reports no Vercel errors. Caught errors were reduced to a generic stored label, explaining the diagnostic gap. HTTP400 is known; exact cause, schema compatibility, account prerequisite and credit expiry are not established. Latest unknown Content record requires its own evidence-backed reconciliation; the older reconciliation does not cover it. All unevidenced manual checks remain pending.

## Current checkpoint — P04.3.3.6 / private draft review exports (2026-10-07 PKT)

Founder authorizes continued implementation with previous and new manual checks deferred together. Added browser-local JSON downloads for the displayed editable campaign and completed generated output review packet. Unsaved edits are explicitly labelled; generated packets carry snapshot/campaign version, three text channels, citations, QA and review history. Downloads neither save nor call a provider, reconcile charges, accept a draft or publish. No new route, migration, dependency or API key. P04.3.3 remains IN PROGRESS: historical Content failure/unknown usage and successful live generation acceptance remain unresolved. See [45 Combined draft review and manual tests](45_DRAFT_EXPORTS_AND_COMBINED_TESTS.md). This current block supersedes older current-state guidance without deleting history.

## Current checkpoint: 1.24 / P04.3.3.5

The bounded runtime is now wired to explicit founder-owner controls on the **separate admin deployment**. Completed structured outputs appear in the private campaign room. Human review is durable and versioned. The default activation flag stays false; installing this release makes no provider request. Images, carousels, automatic regeneration and publishing remain outside this checkpoint. P04.3.3 stays IN PROGRESS pending real pilot acceptance.

## Routes and access

| Surface | Route | Access / effect |
|---|---|---|
| Separate admin | `/admin/generations` | Current platform admin + MFA; shows only snapshots originally requested by this same user in a workspace they currently own |
| Separate admin API | `/api/admin/generations` | GET reads own run queue; POST requires explicit consent and server-derived actor, dispatches one selected immutable snapshot only when activated |
| Main private campaign | `/workspaces/[workspaceId]/sites/[siteId]/campaigns/[campaignId]` | Workspace members read saved generated outputs; only owner records human review |
| Main private review API | `/api/workspaces/[workspaceId]/sites/[siteId]/campaigns/reviews` | Owner-only, expected review version, reason and decision; never publishes or calls a model |

There is no main-domain admin route/link. No admin link to the public app is added. Credentials remain private admin-server environment variables. Admin privilege alone does not permit reading or executing another tenant's snapshot. Original requester and workspace-owner checks are enforced again in SQL; admin access is rechecked before each stage. Direct table access is revoked. Provider request documents remain private and are not returned to clients.

## Dispatch and recovery

A reviewed authorization reason and checkbox acquire a 120-second dispatch lease and append a private authorization event. Duplicate dispatch during that lease is blocked. Coordinator → Content → Quality each runs at most once, with existing reserve/request/output/usage accounting. Settled successful stages can be skipped during an explicitly authorized resume; failed or uncertain stages are not silently resent. A lost connection requires reading run and spending records before any further action. Refresh is read-only. No automatic worker, retry, fallback or background provider call is added.

Run summaries are capped at100. Stale assignment revisions or a changed campaign reject the old snapshot. Runtime036 still rechecks exact knowledge/preferences/pricing and saved profile/reference freshness before each new stage. An old prepared snapshot is historical, not silently migrated. After refreshing assignments, prepare a **new** snapshot for the pilot; retain the old one.

Saved output separates Blog title/summary/body, Pinterest title/description/suggested alt text, LinkedIn post, approved fact references, Coordinator plan and advisory QA. Display escapes text; no generated HTML/scripts execute. Copy controls copy text only. Human `accepted` requires successful output and positive QA without blockers; `changes_requested` records feedback without regeneration. Both require a10–300-character reason and expected review version. Review history is bounded to100 entries per run; history is preserved and review never changes the editable campaign document or publishes it.

## Founder evidence

On2026-10-04 PKT the founder reported **all checks in the preceding message passed**: new Gemini connectivity, refreshed Coordinator/Content/Quality assignments and campaign reload/readiness. Screenshot174029 independently shows run `c17284e7-f1c6-49db-8895-92245872f18e`, passed/response_matched, profile/referencev2,20input/7output, finished `2026-10-04T17:40:21.012876+00:00`;174126/174142 independently show Coordinator assignmentrevision2 current. Content/Quality and readiness are founder-reported, not independently screenshot-evidenced. The preceding video shows old24-hour-expired assignments and spending history surviving reload. Connectivity is not structured drafting quality or whole-phase acceptance. This does not independently confirm036 installation or other unrelated tests.

## Installation — no provider requests

1. Wait for both existing Vercel projects to be Ready for the delivery commit. If local, pull main and run `pnpm install`, `pnpm dev:web` and `pnpm dev:admin` in separate terminals.
2. In Supabase SQL Editor, apply **037_generation_dispatch_and_review.sql** once after036. If036 is not yet applied, apply only036 then037, in order.034/035 were already founder-reported installed. Do not rerun old applied migrations, or execute anything in `supabase/tests` on hosted data.
3. Keep `BIZOVEYA_ENABLE_CAMPAIGN_GENERATION` absent or `false` on the admin deployment for the default-off tests below. No new API key or provider account is required. The main/web deployment must never receive the service-role/provider keys.
4. Open admin Draft runs. Expect a disabled pilot notice, your own prepared snapshots and a disabled Run control. Refresh must make no charge or output. Older prepared snapshots can show stale after assignment changes.
5. Open the private campaign. Expect a Generated drafts and human review section with an honest empty state until a successful model run exists. Existing campaign text/history/snapshots remain intact.
6. Open `/bizoveya/docs` on the main app and locate document44. Main `/admin` and `/api/admin/generations` must still return404.

## Explicit one-run Gemini pilot — makes real provider requests

Only perform this when ready to authorize actual provider use. Free-tier applicability depends on your provider account; recorded$0 rates are estimates, not independent confirmation of provider billing.

1. Sign into the admin app with MFA using the **same account** that owns the main workspace and prepares the campaign. Use the current checked Gemini profile/reference and reviewed enabled pricing. If the bound connectivity evidence is older than24hours, run one fresh connectivity test and save each of the three assignments against it. Do not recreate agents or rotate the key merely because a test expired.
2. On the **admin Vercel project only**, set `BIZOVEYA_ENABLE_CAMPAIGN_GENERATION=true` and redeploy that project with the existing private Gemini and Supabase recording keys. Do not expose secrets in chat, forms or NEXT_PUBLIC variables. `BIZOVEYA_ENABLE_MODEL_TESTS` is a separate flag; it does not activate this pilot.
3. In Do It With AI Tools' private campaign, use only approved site knowledge you have verified. Use the following sample fields; leave existing manual channel drafts as they are or blank. Manual drafts are not used as factual evidence.

| Field | Copy/paste example |
|---|---|
| Campaign title | `A practical AI-assisted SEO workflow` |
| Shared brief | `For freelancers and small digital agencies, explain a practical AI-assisted SEO workflow using only approved Do It With AI Tools facts. Create a concise blog of about 200–300 words, one Pinterest title and description with suggested alt text, and one LinkedIn post. Use English, cite approved facts, avoid invented statistics or guarantees, and suggest a relevant next step only if supported by the approved facts. Prepare text for human review; do not publish.` |
| Blog draft (optional manual text) | `Manual draft placeholder. Generated output must remain separate from this field.` |
| Pinterest title and description (optional manual text) | `Manual Pinterest placeholder. Do not publish this text.` |
| LinkedIn post (optional manual text) | `Manual LinkedIn placeholder. Do not publish this text.` |

4. Save the campaign and prepare **one new generation snapshot** with current settings. Expect one new prepared entry retaining older snapshots; preparation still makes no model call or charge. Note the new snapshot UUID.
5. Open admin Draft runs and refresh. Select that exact new snapshot, enter run authorization reason `Authorize one draft-only Gemini pilot for Do It With AI Tools using approved facts.`, review pricing/knowledge and tick consent. Click **Run selected snapshot once**. Keep the page open. The engine may make up to three model requests. Do not repeatedly click or create another run while this one is pending.
6. Expect `Drafts saved` and status `succeeded` on success. If stopped/failed/connection lost, refresh run and Spending records and report the displayed message/stage status; do not blindly rerun or assume free usage. Unknown/overrun usage needs evidence-based operator reconciliation.
7. Reload the main private campaign. Expect three settled successful stages and separate Blog/Pinterest/LinkedIn output, citations and QA. Review fact accuracy, source versions, language and channel suitability. Each Copy button should copy only the displayed channel text. No blog/pin/post is published.
8. If QA passed and your own review agrees, enter human review reason `Checked facts, citations, brand voice and channel suitability; accepted for draft use only.` then click **Accept for draft use**. Expect a new human-review history entry. If changes are needed, instead use reason `Revise unsupported claims and improve the channel-specific wording before draft use.` and **Request changes**. This records feedback; it does not regenerate or publish.
9. Reload the campaign again. Expect the same generated outputs and human decision/history, with no new run or charge. Check Spending for each actual stage and reported token usage. Confirm provider billing in your own provider account separately.
10. After the pilot, set the admin generation flag back to `false` and redeploy if you want the pilot closed. Existing outputs/reviews stay readable.

## Pending manual acceptance

| Check | Scope | Status |
|---|---|---|
| MT138 |036/037 setup, default-off room and read-only refresh, existing data/docs intact | Pending |
| MT139 | Fresh immutable snapshot after refreshed assignments; stale old snapshot blocked | Pending |
| MT140 | Explicit single Gemini run, successful structured output, stage settlement | Founder-evidenced passed for80091597; no other provider/failure acceptance inferred; see48 |
| MT141 | Three outputs/citations/copy controls and positive/negative human review | Partly evidenced: three texts/citations, positive QA and accepted reviewv1; copy/negative cases pending; see48 |
| MT142 | Reload persists output/review without requests; stale review tab conflicts | Pending after MT140 |
| MT143 | Conditional second account/viewer/unrelated-admin access denial | Pending; do not create/revoke production grants just for testing |
| MT144 | Main admin routes absent, separate admin MFA and phone/desktop readability | Pending |

For the stale-review check, open two campaign tabs after an output exists. Save a review in tabA; submit from tabB with its old review version. Expect conflict, with tabA's history preserved. This adds a review record but no provider request. For role checks use disposable existing accounts: viewer can read its own workspace outputs but cannot submit review; unrelated account cannot read the site/output API; admin with no ownership cannot see or dispatch this snapshot. Existing unrelated security/spending tests remain pending unless explicitly reported.

## Next action

Complete the controlled Gemini pilot and fix any evidenced integration/output issue before treating P04.3.3 as accepted. Visual composition (including pins/carousels) and customer publishing remain separate later stages. No scheduled provider execution is authorized.

## Diagnostic checkpoint — 2026-10-05 02:09:53 PKT

Actor: Sufian Mustafa (founder); ChatGPT Codex (screenshot and source investigation). P04.3.3 remains IN PROGRESS. This records a failed live pilot, not successful phase acceptance.

Evidence and troubleshooting:
- Initial campaign-v3 snapshot was stale after campaign edits to v5. Admin activation, consent and reason were present; stale-state protection correctly blocked dispatch.
- Model assignments screenshot showed Coordinator current, Content and Quality bound to expired connectivity evidence. Founder refreshed Content to revision3 and Quality to revision2 against the already passing current Gemini test; screenshots confirmed both current.
- Campaign-v5 snapshot prepared at 2026-10-05 01:53:38 PKT. Founder dispatched it. Admin recorded failed/no completed output.
- Campaign stage view confirmed Coordinator succeeded with settled usage; Content failed with unknown usage. No Quality result or completed channel drafts was shown.
- Founder prepared another snapshot at01:58:47 PKT. Its displayed state is prepared; do not infer execution.
- Spending screenshot confirmed unknown Content usage and Reconciliation required, despite a recorded zero estimate. Zero estimate does not prove actual provider usage or charges.
- Founder reports Gemini free API usage without billing setup. No billing activation is required for this investigation.
- Source inspection: provider.ts imposes a20-second abort and catches errors as timeout or provider_or_output_error, discarding token usage in that catch. runtime.ts persists stage error codes but current visible screens do not expose enough diagnostic detail. Exact historical cause remains UNCONFIRMED; timeout, provider failure and structured-output failure are hypotheses only.

Next authorized repair: expose safe stored stage codes and actionable explanations; classify provider errors without leaking keys/prompts/raw responses; preserve trustworthy usage on output-validation failures; review bounded timeout/output limits against dispatch duration; verify with synthetic failure tests; update affected Markdown and visual projection together. Do not bypass unresolved accounting, erase failed history, mark unknown usage zero without evidence, automatically retry, or make provider requests during repair.

Manual acceptance: snapshot preparation and current Content/Quality assignments are screenshot-evidenced. End-to-end generation failed; successful outputs, human review and persistence remain pending. No new hosted migration is required by this documentation checkpoint. User should leave new snapshot unrun pending diagnosis.

## Diagnostic repair delivery — P04.3.3, 2026-10-05 PKT

Implemented additive migration038 to expose stored stage error codes, status, accounting state and token counts through the existing admin queue. Its original admin/MFA, requesting-owner and tenant filters are preserved; no prompts, credentials or raw provider responses are returned. Admin Draft runs renders these diagnostics and explicit blocked-button explanations. Refresh also updates activation state and clears consent.

Provider failure handling now distinguishes timeout, HTTP429, access denial, rejected request, server failure and structured output/length failures using installed SDK error types. Available SDK usage is retained on structured-output failure; unavailable usage remains unknown. Historical provider_or_output_error cannot be retroactively classified.20-second timeout, one-attempt policy, spending guards and failed history remain unchanged. No live provider call, hosted SQL or reconciliation performed.

Manual setup and test (no model request):
1. After the new main delivery deploys, apply only supabase/migrations/038_generation_diagnostics.sql once after037 in Supabase SQL Editor. Do not rerun old migrations or test fixtures.
2. Open admin Draft runs, refresh and select failed campaignv5 snapshot ba2fafcf-050f-41c0-9ff1-a07c6834fa59. Expect Coordinator succeeded/settled and Content failed/unknown plus a safe stored error explanation/code. Send that code; do not execute another snapshot yet.
3. The failed run button must remain disabled with an explanation. Refresh must make no provider request or new spending record. The prepared new snapshot must remain unrun.
4. Open /bizoveya/docs and confirm this repair/evidence record appears. No new API key, billing setup, campaign field or approval is required for these read-only checks.

Verification:115 admin unit tests passed, admin typecheck/lint, both production builds and application boundaries passed. No local PostgreSQL runtime is installed in this environment;038 is derived from037 with only an additional per-run stage projection, but database execution and hosted acceptance remain pending. End-to-end draft generation remains failed/pending until the actual Content error is diagnosed and corrected.

## Content-stage investigation checkpoint — 2026-10-05 PKT

Founder screenshot at02:20 shows read-only stage diagnostics working: failed run ba2fafcf-050f-41c0-9ff1-a07c6834fa59, Coordinator succeeded/settled (661input,482output), Content failed/unknown with historical provider_or_output_error. Exact historical cause cannot be recovered; not labelled timeout, billing, quota or schema rejection. New prepared snapshot7106d14f-55a3-459f-843d-1e23a4061b27 remains unrun in evidence. Diagnostics visibility is accepted by screenshot; successful generation is not accepted.

Source/installed SDK investigation found schema serialization converts literal const to enum for Gemini. Synthetic transport tests exercise the real installed Google adapter and ToolLoopAgent with network replaced by a fixture: valid three-channel JSON succeeds; invalid structured JSON retains usage; truncated response reports output_limit with usage; HTTP429 reports rate_limited without invented usage or retry. These tests prove local adapter behavior only, not live provider/model compatibility.

Prompt hardening: each stage now receives its exact output contract; Content explicitly returns blog/title/summary/body/citations, Pinterest/title/description/altText/citations and LinkedIn/post/citations, rather than a generic proposal. The frozen output budget is explicit, and coordinator output is guidance rather than factual evidence. Existing model/agent token caps,20second timeout, snapshots, failed records, no-retry and reconciliation guards remain intact. No claim that this fixes the unknown historical cause. No provider request, hosted SQL, configuration change or accounting reconciliation performed.

Verification for this checkpoint:120 admin tests, admin typecheck/lint, both production builds and boundary checks passed. No live provider or browser acceptance claimed.

Manual next steps: no new migration or field is added by this checkpoint. Keep the new snapshot unrun while Content usage remains unknown. To reconcile through existing Spending controls, first independently verify applicable provider charges/free-tier status; only then enter the verified USD amount and factual evidence/reference, tick the evidence checkbox and record it. Do not use a zero estimate or the failed output as evidence. A factual reason template is: 'Verified [provider project/account reference] for [request time interval]: [verified free-tier/billing evidence and amount]. This records cost only; Content token usage remains unknown and the failed run is preserved.' Replace brackets with actual evidence; never paste API secrets. If evidence is unavailable, leave unresolved. Reconciliation does not make the failed run resumable or accepted. A later explicit controlled attempt can use improved error classification only after prerequisites permit.
