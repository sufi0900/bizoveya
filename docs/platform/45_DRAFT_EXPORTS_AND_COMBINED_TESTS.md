# Private draft exports and combined manual testing

## Current visual checkpoint — 1.25 / P04.3.4.1 (2026-10-08 PKT)

Founder confirmed the previous saved-draft/refresh/copy/generated-JSON checks and explicitly authorized proceeding. Record these narrow text-pilot checks as founder-reported passes; do not repeat generation. Other unevidenced access/conflict/mobile/unsaved-export tests and the short-blog quality finding remain open. This authorization permits visual implementation without claiming full P04.3.3 acceptance.

P04.3.4.1 adds private editable two-layout Pinterest graphics and a six-slide LinkedIn carousel, shared scene previews/PNG/PDF exports and owner-reviewed saved visual versions. Additive039 follows038; no existing rows/migrations are rewritten. Member reads, owner saves, source-review checks and optimistic conflicts are enforced. Outputs are private; saving/exporting does not publish or call a provider. No new key, env variable, dependency or deployment setting. Hosted039 installation and founder visual tests remain pending.

Next: follow the four steps in [49 Private visual composition](49_PRIVATE_VISUAL_COMPOSITION_AND_TESTING.md): apply039 once if missing, open the already accepted campaign's Visual drafts, review/save/refresh, download two Pinterest PNGs and the six-page PDF. Do not request another text generation. Remote base7acdbd48 inspected; no AGENTS.md or active lease; old PR2/phase branches remain historical. This block supersedes earlier conflicting current-state/next-step guidance while preserving its history.

## Current founder evidence — 2026-10-07 PKT

P04.3.3 is IN PROGRESS. Founder evidence confirms failed Content run `fb12a480-6923-4d3d-a66a-5777fe347f4a` cost reconciled to USD 0 on free-tier attestation (unknown tokens remain unknown), and unstarted run `29293e34-e773-4ffe-88f1-dc9645dd60c6` safely cancelled by the founder after SQL confirmed `provider_started_at` null (failed / preflight_failed, settled, zero tokens).

Live Gemini run `80091597-06eb-4b8e-ae10-6239ae2b2b69`, campaign “Do It With AI Tools — export test-v2”, version2: Coordinator succeeded/settled692 input /668 output, Content1289/716 and Quality1782/321. Founder reports saved Blog/Pinterest/LinkedIn text, fact references, positive QA and no stage errors. Latest review screenshot reportedly confirms Human review saved: reviewv1 accepted at2026-10-07 23:04:49 PKT for private draft use only. Exact reason and evidence limits are recorded in [48 Live draft evidence](48_LIVE_DRAFT_EVIDENCE_AND_REMAINING_GATES.md).

Reload persistence, clipboard/export, stale/negative review, access and other unevidenced tests remain pending. The short blog remains an open commercial-quality finding. No publication or regeneration occurred. Next: complete44/45 acceptance on the existing output, then inspect actual saved blog/brief/limits for quality improvement; no repeat generation is needed. P04.3.4 visuals remain planned until durable text acceptance. No new migration, field, key or deployment setting. No active checkpoint lease was recorded on inspected main `1ca04645c34c13f803a05689d66c26d99d692152`; old PR2/phase branches are historical. This block supersedes earlier next-action/current-state claims below; those retain the evidence available at their original checkpoints.

Verification (2026-10-07 PKT):337 web unit tests passed across59 files, including23 campaign tests; web typecheck and targeted lint passed; web production build and application-boundary checks passed. The new45 guide rendered in the built document-room HTML. Browser/mobile download, hosted SQL, production deployment and real-provider acceptance are not claimed. Admin source is unchanged.

## Scope and current acceptance

P04.3.3.6 adds local JSON review downloads to the existing private campaign room. Manual testing can be deferred; it is not marked passed. Historical Content failure and reconciliation are still open. Downloads can be tested on manually authored drafts now; generated export and human review checks are conditional on successful real output later. Visual creation and publishing remain later stages.

The editable export contains the currently displayed title, brief, blog, Pinterest and LinkedIn text, campaign ID, saved version and an unsaved-edits flag. The generated packet contains the exact visible output bundle, snapshot ID, campaign ID/version, run status and visible human review history. The record is explicitly projected; server-only request documents, API secrets, pricing and unrelated tenant data are not exported. Download is local: no new endpoint, DB write, model call, automatic file upload, acceptance or publication. Files are private; the user chooses where to store or share them. JSON safely preserves text but is not a rendered HTML page or an import/restore format.

## Installation — do later if preferred

1. Use the latest verified main commit on both existing Vercel projects; no new environment variable, provider key or migration is added by this checkpoint.
2. If migration038 is still missing, apply only supabase/migrations/038_generation_diagnostics.sql after037. Do not rerun applied SQL or run supabase/tests on hosted data. Read-only stage diagnostics already shown in founder evidence do not constitute acceptance of all SQL cases.
3. Local commands from repository root: pnpm dev:web (port3000) and pnpm dev:admin (port3001), in separate terminals.

## Required checks without provider calls — all pending unless separately evidenced

1. Open your existing Do It With AI Tools site → Campaigns. In a test campaign, enter the sample below, save, and reload. Expect the same text and saved version. Existing accepted earlier campaign save tests are retained; this new export regression is pending.
2. Click **Download working copy (JSON)**. Open the file as text. Expect all five fields and includesUnsavedEdits=false, with the displayed campaign ID/version. This should create no new saved revision, generation snapshot or spending entry.
3. Change only LinkedIn text to the unsaved sample below without saving. Download again. Expect the changed text, includesUnsavedEdits=true and a filename ending -unsaved.json. savedVersion remains the previous saved version, not a claim that the edits were saved. The campaign still shows unsaved changes. Save or discard according to your intention afterwards.
4. Open separate Admin → Draft runs; refresh the old failed v5 run. Expect Coordinator succeeded/settled and Content failed/unknown with its stored safe error code. Refresh must create no new request or spending row; the failed run remains non-runnable. Keep the newer prepared snapshot unrun while accounting is unresolved.
5. Visit /bizoveya/docs and search “Private draft exports”. Expect this guide and the updated phase, dependencies, continuation and pending-test records. Existing portfolio/workspace pages must still load. Main-domain /admin and /api/admin must remain unavailable; the separate admin login/MFA flow remains separate.
6. Check the download button and explanatory message on desktop and phone. If the browser blocks downloads, the message must offer manual copying and leave the draft intact. No automatic provider request may occur.

### Copy/paste samples for all editable campaign fields

| Field | Sample |
|---|---|
| Campaign title | Do It With AI Tools — practical AI SEO workflow |
| Shared brief | Create educational drafts for freelancers, consultants and small digital agencies. Explain a practical AI-assisted SEO workflow using only approved Do It With AI Tools facts. Avoid invented statistics, ranking promises and unsupported product claims. Prepare blog text, Pinterest copy and a LinkedIn post for human review. Do not publish. |
| Blog draft | Start with one audience question. Use AI to organize an outline, then verify each claim and edit the article for clarity. Review the final draft before sharing. This is manual test content, not an AI-generated result. |
| Pinterest title and description | Practical AI SEO Workflow: Research one audience question, organize an outline and verify the draft before sharing. Explore Do It With AI Tools for educational resources. |
| LinkedIn post | AI can help organize content ideas, but useful drafts still need verified facts and human editing. My test workflow is research, outline, verification and review. What do you check before sharing an AI-assisted draft? |
| Unsaved LinkedIn replacement | Unsaved export test: this text must appear in the downloaded working copy without creating a saved revision. |

## Conditional reconciliation — previous blocker, still pending

Only use the existing reconciliation form after verifying applicable provider/account charges for the failed request. Select the Gemini spending profile and locate the failed Content entry.

- **Verified USD charge:** actual verified amount; use 0 only if confirmed by applicable free-tier/billing evidence. The reservation estimate alone is not evidence.
- **Billing evidence / reconciliation reason:** replace the brackets with actual evidence: `Verified [project reference] for [request time]: [evidence and actual USD amount]. Cost recorded only; unknown token usage and failed history remain preserved.`
- Tick **I checked the provider billing evidence**, then **Record verified charge**. Expect reconciled cost/history, no provider request and no invented token count. If evidence is unavailable, leave unresolved.

Reconciliation does not make the old failed run resumable or mark its output successful.

## Conditional single-run pilot and generated review — still pending

After reconciliation and all execution dependencies permit, use the existing explicit founder pilot process in44. Three-day-old connectivity evidence is not current: a fresh successful matching test and reviewed assignments may be necessary; never label it current without checking. Do not run automatically merely because this code is installed.

1. Check current approved knowledge, agent versions, model/reference versions, reviewed valid pricing and all three assignments. Prepare a new snapshot after any dependency changes; retain older snapshots.
2. On separate Admin → Draft runs select the new ready snapshot. Authorization reason sample: `One controlled Do It With AI Tools text-draft pilot after verified reconciliation and current dependency review. No publishing.` Tick the explicit consent checkbox only when you intend the model request, then run once. Expect Coordinator → Content → Quality and persisted structured output/settled usage. If it fails, record the exact safe code and spending state; do not blindly retry.
3. In the private campaign room, inspect Blog, Pinterest and LinkedIn output, citations and QA. Click **Download generated review packet (JSON)**. Expect matching snapshot/campaign version, all channels/citations, QA and current review history. Download must not add a review, save or provider request. This button appears only when a generated output exists; no fake successful demo is inserted.
4. Human review reason sample for acceptance (only after actually reviewing): `Checked approved citations, claims, brand voice and all three channel drafts. Accepted for private draft use only.` Positive QA/no blockers is required. Request-changes reason sample: `Please remove unsupported claims and make the LinkedIn opening more specific before acceptance.` Expect versioned feedback, no regeneration or publication.
5. Reload: output/review history persists. Download again: latest visible review is included. Open two tabs before a review change; save in tabA, then submit in stale tabB. Expect conflict and preservation of tabA history. These checks remain pending until performed.
6. With existing disposable test accounts only: workspace viewer may read/export already authorized visible drafts but cannot submit owner review; unrelated users cannot load private campaign/output APIs; unrelated admin cannot view/dispatch another owner's run. Do not change production roles merely for testing.

## Pending status ledger

| Group | Status / evidence |
|---|---|
| Earlier migration and configuration results | Retain only explicit founder reports/screenshots already recorded; do not rerun everything |
| Read-only stage diagnostics | Founder screenshot evidenced; export regression checks above still pending |
| Failed Content request and accounting | fb12a480 founder-reconciled costUSD0;29293e34 founder-cancelled before provider start; historical failures retained; see48 |
| Successful complete real draft generation | Founder-evidenced80091597 succeeded; all three stages settled; see48 |
| Editable export + unsaved flag + mobile download | New pending checks; can run without model use |
| Generated packet, QA/human review, refresh and stale review | Positive QA/accepted reviewv1 evidenced; generated packet/refresh/copy founder-confirmed; stale/negative-review tests pending |
| Remaining tenant/role/admin boundary checks | Pending where unevidenced; optional accounts required |

## Verification and delivery record

Automated results are recorded in the delivery checkpoint; synthetic fixtures are never reported as real generation. All Markdown is read directly by the existing document-room loader, so this guide and updated records share the same visual projection. No duplicated content store or admin document route is added.
