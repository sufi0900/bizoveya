# Local admin Ollama rehearsal

BZ-117/CW-117 — 18 October 2026 PKT. Base main `cb95f44d45511b0b729b37f6b1a26fb3db734d6c`. Founder authorizes local admin testing while the customer app remains hosted. No AGENTS or active checkpoint lease found; remote branches and open PR search inspected. No other open PR returned. Historical branches retained. Office visualization stays ON HOLD; custom agents out of scope.

## Delivered boundary and correction

Local admin `/admin/local-testing` runs Coordinator → Content → Quality using a read-only copy of an owned campaign snapshot, the same stage prompts, authoritative output schemas and source/revision/fact citation checks. The selected Ollama model replaces the frozen cloud provider only in this explicit rehearsal. Agent output caps remain pinned to the selected snapshot, capped at4096; select the latest snapshot for the founder's updated Content cap. No changes to original snapshot, credentials, model assignments, generation state, accepted drafts or spending ledger.

The earlier suggestion that Ollama results would automatically appear as completed production customer drafts was too broad. This implementation intentionally displays readable Blog/Pinterest/LinkedIn drafts and QA/citation diagnostics in local admin, with downloadable local receipts. It does not import local output into production human acceptance. It is a real local provider test, not a Gemini production pass. Optional synthetic fixture mode exercises wiring/validators without a model and never claims AI quality approval. Actual shared production dispatch, review/persistence, Gemini, voice, images and specialist/meeting acceptance are not proven by this rehearsal.

## Isolation and recovery

Both page and API require `NODE_ENV=development`, `BIZOVEYA_ENABLE_LOCAL_TESTING=true` and no Vercel environment marker. POST requires matching HTTP loopback Origin, Host and URL; existing admin identity and MFA remain required. No request-supplied provider URL or model: fixed `http://127.0.0.1:11434/api/chat`, no redirects, no tools, no retries, no Gemini fallback, no key required. Set a genuinely local installed model, not an Ollama cloud model or remote alias. Cloud-suffix identifiers are rejected. Disable Ollama cloud access on the PC if configured separately; this app does not alter Ollama settings.

Each stage has a five-minute deadline and262144-byte response bound. Input/output validation errors stop subsequent stages. Usage remains unknown when absent. One local receipt per request UUID prevents duplicate execution; a global exclusive disk lock prevents simultaneous runs. Receipts record the actual `ollama-loopback` or `synthetic` provider, model, reason, snapshot ID, usage, stage outputs and timestamps. Private output files live in admin `.bizoveya-local-testing/<actor>/` and are gitignored; do not upload them publicly. Successful earlier stage outputs survive later failure. They do not reconcile historical production usage.

If stopped or the browser disconnects, use **Read existing receipt**, never retry blindly. A process crash may leave `active.lock` and a started/running receipt. Stop the old local dev process, inspect the receipt, and only after confirming no process still runs may you remove that local lock and explicitly prepare another rehearsal. Never edit production ledger rows to enable local tests. Browser refresh loses the in-memory selection/request UUID; existing JSON receipts remain on disk for inspection.

## Hosted migration and preservation

Additive077 only adds `bz_admin_local_rehearsal_snapshot(uuid)`. It calls existing `require_admin()` (admin + MFA), filters original requester and current workspace-owner membership, and refuses an active dispatch lease. Historical/failed snapshots can be read for debugging; reading does not requalify stale facts or permit production execution. Function EXECUTE is denied to PUBLIC, anon and service_role; authenticated access is subject to in-function checks.

Installed077 in verified existing voxfolio project after076. Before/after exact whole-record fingerprints match:10 generation runs `3350f84b86505bf20b536e984ed676da`,1 review `fc2b95ecd7599f95360bff1e48b03639`,6 spending records `48e32ab12b464bb74192ce3a7ef00191`. Grants verified: anon=false, authenticated=true, service_role=false. No production provider request or content write. Supabase CLI telemetry was rejected by automatic approval review; no further CLI invocation was used. The approved Supabase connector installed the verified migration without that telemetry path.

## Founder evidence retained

October16 screenshots confirm model profilev3 checked at4096, Content agentv3 checked/preview-approved, fresh profilev3/referencev3 connectivity pass, current three role assignments, and site teamv2 enabled (Coordinatorv2/Contentv3/Qualityv2). Prior Content failure was output_limit with settled usage. Fresh snapshot `93d9b76f-6bbb-4679-8c10-cd85332d8733` then failed at Coordinator with provider_unavailable and unknown usage; screenshot showed Reconciliation required. No completed output or whole-workflow pass is inferred. These are screenshot observations, not proof of current provider billing. That production reconciliation remains pending. The unrelated customer planning form padding/styling request remains pending; this delivery does not claim it fixed.

## Windows setup and acceptance

1. Update the repository and install locked dependencies. From the repository root in PowerShell:

   ```powershell
   git pull --ff-only origin main
   pnpm install --frozen-lockfile
   Copy-Item apps/admin/.env.example apps/admin/.env.local
   ```

   If `.env.local` already exists, edit it instead of replacing it. Keep your existing Supabase URL and anon key for the same project used by production. No service-role or Gemini key is needed for rehearsals. Set these fields privately in `apps/admin/.env.local`:

   ```dotenv
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   BIZOVEYA_ENABLE_LOCAL_TESTING=true
   BIZOVEYA_OLLAMA_MODEL=qwen3:8b
   BIZOVEYA_ENABLE_MODEL_TESTS=false
   BIZOVEYA_ENABLE_CAMPAIGN_GENERATION=false
   BIZOVEYA_ENABLE_MEETING_EXECUTION=false
   ```

   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must contain your existing project's actual values; do not paste keys in chat. Expected: dependencies installed, cloud execution flags off. Use the repository's pnpm11.19.0-compatible toolchain and Node22+.

2. Confirm the installed model and start local admin:

   ```powershell
   ollama list
   pnpm dev:admin --hostname 127.0.0.1
   ```

   If Ollama is not already running, start `ollama serve` in another terminal. Do not download another model unnecessarily. If `qwen3:8b` is absent but your installed `qwen2.5-coder:7b` is present, set `BIZOVEYA_OLLAMA_MODEL=qwen2.5-coder:7b` and restart admin. Open `http://localhost:3001/admin/local-testing` and sign in with the existing admin account/password and authenticator. Expected: local rehearsal screen; production URL stays unchanged. No Google OAuth redirect change needed for existing admin password login.

3. Select the latest owned snapshot (for this pilot, prefix `93d9b76f`), choose **Synthetic workflow fixture — no AI**, enter **Local test reason**: `Check local workflow wiring without calling a model.` Tick the local authorization checkbox and click **Run local rehearsal once**. Expected: `synthetic_workflow_checked`, three schema/citation-valid stages, synthetic provider, QA approved=false and zero model requests. This is not an agent quality pass.

4. Click **Prepare another local rehearsal**, choose **Real local Ollama generation**, use reason `Test private campaign drafts using my installed local Ollama model; do not publish.` Tick authorization and run once. Expected: `local_outputs_for_review` plus readable three-channel drafts and actual model/usage metadata, or a specific local stage failure. Download the receipt and inspect its citations/QA. Human quality acceptance and real PC latency remain pending. Production campaign and unresolved spending stay unchanged; no publication occurs.

## Verification

Verification:240 admin tests/26 files,565 web tests/96 files,77 ephemeral migrations/40 SQL assertion executions,both typechecks/lints/builds and application boundaries passed. Web projection contains154 static pages including guide98. Hosted077 grants/preservation verified. Provider responses are mocked; actual Windows/Ollama/browser tests remain pending. Real PC/Ollama and browser acceptance remain pending; all provider tests in this delivery use mocked responses. No paid provider call, external message, publication or deployment-setting change.

| Test | Pending founder evidence |
|---|---|
| MT288 | Local admin password/MFA login and feature absence on hosted admin |
| MT289 | Fixture run clearly synthetic, three stages, no production writes |
| MT290 | Installed local model generates valid cited channel drafts; human quality review |
| MT291 | Stop/read-receipt/restart recovery without automatic duplicate calls |
