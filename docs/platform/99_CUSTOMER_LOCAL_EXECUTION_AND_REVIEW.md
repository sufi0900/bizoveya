# Customer local execution and review

October18 follow-up: [100](100_LOCAL_BACKGROUND_EXECUTION.md) supersedes the HTTP-wait/Stop controls below. Runs admit first and continue in local admin; **Pause progress updates** stops monitoring only. Preserve old receipts; interrupted attempts are never silently retried.

BZ-118/CW-118 — 18 October2026 PKT. Base remote main d93e6b317b4624c7ace049c5f4d1b8cfa1c68295. No AGENTS or active checkpoint lease; branches and historical open draft PR2 inspected without reuse. Founder authorized customer-visible results after local admin rehearsal. Office ON HOLD; custom agents out of scope.

## Delivered behavior

The private campaign page, when running in development with local-testing enabled, has a prominent **Watch local agents work** link. A workspace owner chooses an existing campaign snapshot and authorizes Coordinator → Content → Quality through the existing local admin runner. Customer UI polls saved stage checkpoints through a strictly read-only endpoint, displays each stage, provider/model, Blog/Pinterest/LinkedIn drafts and QA findings. Failed quality remains visible and is not an approved result. Synthetic output is identified as synthetic.

Human feedback and local acceptance are written to the private PC receipt with optimistic review versions and duplicate-request idempotency. Acceptance requires completed real output and AI QAapproval without blockers; QA is advisory and human review still required. Request changes saves feedback only. It never automatically reruns, edits the campaign or publishes. To change input, edit campaign/site knowledge through existing screens and prepare a new snapshot only when current readiness allows it. Historical snapshots do not become current approved knowledge.

The browser retains only the schema-validated request handle/reason in sessionStorage for refresh recovery. Outputs/reviews remain under admin `.bizoveya-local-testing/<actor>/`; **Read saved local result** never executes a model. Stop waiting/unmount aborts the HTTP wait; it does not promise Ollama never received the request. Inspect the saved receipt before another attempt. Preserve receipt files. Existing admin execution locking and one-attempt semantics remain in place. The pilot uses the same loopback cookie hostname on both ports; sign in to admin after customer login if MFA was reset.

## Boundaries and privacy

Customer API must be development-only, explicitly enabled, with VERCEL absent and matching HTTP loopback Origin/Host/URL. It validates current workspace owner access and this site's snapshot history before any forwarding. The fixed backend-to-backend target is local admin port3001; no user URL, redirect, tunnel, service key or remote fallback. Admin independently validates session, MFA, original requester/current owner and inactive snapshot through existing read-only077. This pilot therefore needs an owner who is also an approved platform admin; general customers do not acquire admin rights. Anonymous users, readers/editors and other workspaces cannot run it. Production keeps this feature disabled even if the flag is set.

Production campaign/review/ledger state is not modified. This is customer-side local testing, not production persistence, hosted Ollama access, a Gemini pass or public publication. Existing production generated-output/human-review workflow remains unchanged. Local reviews cannot accept a production draft. No new SQL migration, provider key, paid call, external message or deployment-setting change.

## Evidence and quality repair

Founder receipt62f2a995 confirms qwen3:4b via ollama-loopback on October18, not qwen3:8b. All three stages completed in about6m27s; QAapproved=false with six warnings. Both schema-valid content and QA can have substantive errors. Title generation was misrepresented as keyword research, slug generation as outlining, schema generation as validation, and requested blog depth was missed. Reviewer caught several claims but missed slug misuse and added questionable general-advice/alt-text complaints.

Shared stage guidance now forbids inferring tool capabilities from names/existence, separates advice from product claims, asks all-channel/length review, and avoids invented brand-in-alt-text requirements. These changes do not guarantee model quality or automatically correct old saved drafts. Repeat real-model acceptance remains pending. Original uploaded private receipt is not committed. MT288 login/fixture evidence recorded narrowly; MT290 humanquality and MT291 recovery remain pending. Unrelated agency-planning styling request remains pending; the new local panel has scoped field spacing, focus outlines and mobile button sizing.

## Four founder steps (Windows)

1. Update/download the latest main. Keep existing environment files and private local receipts; do not overwrite them from a ZIP. Both apps must use your existing same Supabase URL and anon key. In `apps/admin/.env.local`, keep:

   ```dotenv
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   BIZOVEYA_ENABLE_LOCAL_TESTING=true
   BIZOVEYA_OLLAMA_MODEL=qwen3:4b
   BIZOVEYA_ENABLE_MODEL_TESTS=false
   BIZOVEYA_ENABLE_CAMPAIGN_GENERATION=false
   BIZOVEYA_ENABLE_MEETING_EXECUTION=false
   ```

   Use your actual installed `ollama list` model if different. In `apps/web/.env.local`, set existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` privately (same actual values as admin), plus:

   ```dotenv
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   BIZOVEYA_ENABLE_LOCAL_TESTING=true
   ```

   Remove any local `VERCEL` variable from both files. No new Gemini/service-role key. From repository root run `pnpm install --frozen-lockfile`, then separate terminals `pnpm dev:admin --hostname 127.0.0.1` and `pnpm dev:web --hostname 127.0.0.1`. Keep Ollama running. Expected: admin3001 and customer3000. The production customer site cannot use this PC feature.

2. Open `http://localhost:3000/workspaces`, sign in as the existing owner, choose the workspace → **Do It With AI Tools** → content campaigns (existing **Create campaign** entry). Open the saved private agent acceptance campaign. In a second tab sign in at `http://localhost:3001/admin` with the same account and verify MFA. Return to the customer campaign page, click **Watch local agents work**. Expected: local panel with site-specific snapshots, three stage names and explicit private-local labels. Only the owner sees this pilot link.

3. Choose **Campaign snapshot** prefix `93d9b76f`, **Local execution mode** `Synthetic workflow fixture — no AI`, and **Local test reason** `Check customer-side progress and results without calling a model.` Tick authorization, click **Run local agents once**. Expected: three completed stages, synthetic result, no model and no production writes. To test real output, **Prepare another local run**, choose `Real local Ollama generation`, reason `Test private campaign drafts using my installed local Ollama model; do not publish.`, authorize once. Expected: saved progress then actual drafts/QA or specific error. Quality requests changes is not a transport failure.

4. For a rejected real draft, enter **Review reason** `Correct unsupported tool capabilities, check every channel and meet the requested blog length.` Click **Request local changes**. Expected: reviewv1 retained locally and **Accept local draft** disabled until QAapproved. Refresh and click **Read saved local result**: same request/output/review, no new model call. Download the packet. An intentionally accepted quality-approved draft still stays local and private. Stop/restart recovery, mobile keyboard controls and alternate-member access negatives remain MT295 acceptance checks; do not delete active locks until the old process is confirmed stopped.

## Automated verification

Verification:578 customer tests/98 files and252 admin tests/28 files passed;77 ephemeral migrations/40 SQL assertions, both typechecks/lints/builds, application boundaries and whitespace checks passed. Web document projection:155 static pages. Browser/Ollama/hosted customer acceptance is not inferred from mocks. Browser execution was attempted but unavailable: Chromium was absent and the Playwright browser download failed. UI is covered by server rendering and contract tests, not a successful browser interaction run. New tests cover owner/site/origin/hosted denial, fixed endpoint, no retry, receipt binding, read-only recovery, optimistic local reviews, QAacceptance gating and output instructions. Existing source SQL remains unchanged.
