# Model connectivity and testing

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


Living first draft: Bizoveya 1.17 / P04.0. Source and local evidence delivered; founder/hosted/live-provider qualification pending.

## Current contract — package 1.17 / P04.0

The new AI SDK requires Node 22 or newer; use Node 24 for local/Vercel consistency. P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests 128 output tokens, waits 20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

Live tests default off. Explicit operator setup requires the selected private provider key plus an admin-only SUPABASE_SERVICE_ROLE_KEY for server-attested result recording, then BIZOVEYA_ENABLE_MODEL_TESTS=true and per-request pricing/charge acknowledgement. No secret-entry form exists. Named current admin+AAL2 is required; client roles cannot mark results passed. Additive migration 030 enforces one running test and five attempts per UTC day platform-wide, durable request IDs, expiry/unknown states and version-sensitive evidence. Failures/unknown attempts still consume the attempt allowance and may be billed. Existing dailyBudgetCents remains planning metadata; monetary enforcement precedes customer runtime.

Read 36_MODEL_CONNECTIVITY_AND_TESTING.md for exact setup, supported evidence and MT087–094. All 1.16 tests and earlier unevidenced founder gates stay pending; the founder is currently testing and has supplied no new pass results. Preserve 001–029 and historical files. One cumulative ZIP/repository and the same two Vercel roots. No hosted SQL/deploy/provider request was performed by the assistant. Next implementation dependency: reviewed exact-model evidence, agent/profile binding, enforced monetary limits and durable draft runs, then visual output composition. The 35 draft-only pilot and 34 Studio/removal scope remain in force; publishing remains deferred.

Earlier release contracts below are historical and superseded where they conflict with this current contract.

## What is implemented

The admin's Model tests room lists saved model profiles and their current configuration/reference eligibility. It shows setup booleans only, the shared daily allowance and latest 50 attempts. Older attempts remain stored. Reason, explicit charge acknowledgement and a saved checked profile are required. No customer-facing agent or new customer route is enabled by this feature.

A test sends: `Connectivity check only. Reply with exactly BIZOVEYA_OK and no other text.` A trimmed exact match is passed; different/empty text is unexpected_response. API failures are provider_error; local abort is timeout. Raw replies, reasoning text, HTTP errors, keys and request headers are neither stored nor returned. Token usage is provider-reported; absent values display unknown, never zero by assumption. No cost estimate or guaranteed charge ceiling is claimed. Reasoning models may use the small output allowance without returning the expected text.

Server adapters: ai7.0.127; @ai-sdk/openai4.0.83; @ai-sdk/openai-compatible3.0.62; @ai-sdk/google4.0.87, pinned by pnpm-lock.yaml. OpenAI uses Responses with store:false. Nebius uses the fixed https://api.tokenfactory.nebius.com/v1 base URL and chat completions. Gemini uses its official generative-language host. Redirects and arbitrary origins/endpoints are rejected. The model ID comes from the operator-reviewed saved profile; no model or availability/pricing is guessed or automatically selected.

Sources checked 2026-10-02: https://docs.tokenfactory.nebius.com/quickstart ; bundled installed AI SDK/provider docs and types. Provider protocol tests use synthetic local HTTP responses with the real SDK; no paid call was made during development. Tests qualify connectivity only; schema/tool support, factual quality and hackathon compliance need their own evidence.

## Manual setup

1. If 001–029 are confirmed applied, run only supabase/migrations/030_model_connectivity_tests.sql once, in full. Otherwise reconcile migration history and apply only missing migrations ascending. Never run tests or fixture SQL on production.
2. Upload the complete extracted repository, install from the new frozen lockfile and redeploy both existing projects (apps/web, apps/admin). Public host has no model-test/admin routes.
3. Open the separate admin host, complete its existing login/MFA and open Model tests. With the default BIZOVEYA_ENABLE_MODEL_TESTS=false, inspect the disabled state without a provider key or cost.
4. For an optional actual test, privately configure SUPABASE_SERVICE_ROLE_KEY on the ADMIN server only, using this project's server service-role credential. This is a privileged server secret, never a publishable/anon key, NEXT_PUBLIC variable, committed file, client field or public-app variable. It records outcomes through the service-role-only finish RPC; it is not used to read customer data in this implementation.
5. Set the selected provider's existing private variable: BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY. Verify current model availability and price in that provider account. Keys may incur paid usage; ChatGPT subscription access is not a configured provider key.
6. Set BIZOVEYA_ENABLE_MODEL_TESTS=true in the admin deployment and redeploy. Enable the matching credential reference. Save your verified model ID in a profile and Check configuration. After actual key changes, Record key rotation and check again.
7. Select the saved profile, enter `Verify this model before the Do It With AI Tools draft pilot.`, acknowledge provider pricing and run ONE test. Inspect its result, usage and versions; compare the provider dashboard when billing is uncertain. Turn the enable switch off and redeploy when finished if further tests are not wanted.

No new GitHub repository, Vercel project, site connection, social password, customer API key or live publication is required. Existing model budget values do not impose a dollar ceiling here. Use the provider's own available account controls for charges; the app enforces attempts only in this phase.

## Failure/retry and evidence rules

The server reserves a UUID before calling a provider. Repeating that request ID returns its existing record without another call; a client double-click is guarded. Network errors keep a Retry same request action; Refresh reads state without calling a model. Clear retry permits a separately authorized attempt and does not cancel prior work. No implicit retry occurs after provider or recorder failure. If the server dies or cannot persist a result, an unfinished record becomes unknown after90 seconds. Unknown/failed attempts retain their daily allowance consumption. Closing the page is not a provider cancellation guarantee.

The SQL reservation serializes the shared allowance and rejects concurrent running attempts. Current admin grant/MFA is checked in the server and database; profile/reference are rechecked immediately before dispatch. A request already dispatched cannot be recalled by subsequent revocation. Client anon/authenticated roles cannot finish or modify a result directly. Service-role-only recording plus a per-run claim prevents an admin browser from forging passed evidence through the public RPC. Direct SQL/operator access remains privileged.

Results pin the connectivity suite/AI SDK version, immutable profile version, reference version, actor and time. The release lockfile records exact provider adapter versions; future SDK/suite changes must update this evidence contract. Editing profiles, disabling references or recording rotations makes earlier passes historical. A pass does not expire merely due to elapsed time and does not certify current provider uptime. Runtime activation must require fresh appropriate evidence and a separate decision. Never infer live agent readiness, credential health across deployments or an entire phase pass from one matched response.

## Manual cases — all pending

| ID | Action | Expected |
|---|---|---|
| MT087 | Confirm029, apply030, rebuild both apps | Old data preserved; admin Model tests room available |
| MT088 | Test anonymous/AAL1/ungranted/revoked admin and main-domain URL/API | Eligible current admin+AAL2 only; main host404 |
| MT089 | Default disabled state, missing recorder/provider key | Clear setup state; no test can run or consume allowance |
| MT090 | Optionally configure private credentials, verified available model, enable/check reference/profile, authorize one test | One recorded fixed-prompt attempt; inspect actual result and provider usage |
| MT091 | Double-click, reload/refresh and Retry same request after network interruption | No duplicate provider dispatch for recorded UUID; unknown outcome explained |
| MT092 | Wrong/unavailable model or insufficient provider credit, interrupted request | Redacted failure/timeout; input/output usage unknown where unavailable; no automatic fallback/retry |
| MT093 | Edit profile/rotate or disable reference after a pass; observe five-attempt UTC cap | Earlier result historical; new setup required; quota applies across all admins/providers |
| MT094 | Mobile/dark/light/keyboard; old agent/models/credentials/public/customer flows | Readable test records and controls; existing rooms work |

Do not burn extra paid calls simply to reach the quota. Local SQL/SDK tests provide deterministic limit/failure evidence; founder can record live cap case deferred. Keep all prior Studio/removal tests in30 pending until actual results are supplied.

## Next dependency and change impact

030 adds only private model_test_runs plus admin read/reserve and service-role finish RPCs. Model tests depend on028 profile/reference checks and019/020 current grants. Public/customer data has no new access. These records do not bind a profile to an agent. P04.3 will add server-owned binding, budget reservation/cost settlement and durable site-scoped draft runs;35 defines blog/Pinterest/LinkedIn/carousel deliverables. Visual composition, evaluations and publishing are distinct later gates. Update source, migration, routes, dependency register, manual guide, activity/progress/ZIP record and visual docs together after subsequent changes.
