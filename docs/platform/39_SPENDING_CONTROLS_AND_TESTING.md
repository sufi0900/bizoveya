# Spending controls and testing — P04.3.2 / 1.19

## Scope and implementation

Admin host only: `/admin/spending`; API `/api/admin/spending`. No public admin link, route or API. Apply missing `032_spending_controls.sql` after031. Private tables store policies, immutable pricing history, a run ledger and charge activity. RLS and grants prevent direct client access. Existing connectivity history is preserved and explicitly untracked in this new ledger.

Verified USD input/output rates per million tokens, any per-request fee, daily/run limits, HTTPS pricing evidence and an expiry within30days are required. Zero prices need verified credit/free-tier evidence. No default price is invented. Policies pin the current model-profile version; edits require pricing review. Credential and checked-model prerequisites remain enforced by the existing test transaction.

All amounts use integer microdollars:1USD=1,000,000micros. Before a new connectivity request, a transaction serializes reservations and holds ceil((4096×input rate +128×output rate)/1,000,000 +request fee)×1.25, rounded up. The daily ceiling is the lower of pricing-policy allowance and profile daily budget. Costs aggregate by profile across policy versions, using the original reservation UTC day. Replayed run IDs never reserve again. Fixed prompt bounds are conservative estimates, not a guarantee against provider billing changes, hidden charges or SDK usage differences.

Reported usage settles against its immutable pricing snapshot. Missing usage holds the reservation; excessive usage/charges block further requests. Unresolved holds remain blocking across calendar days. An admin may reconcile unknown, overrun or expired reservations only after checking actual provider billing and recording an evidence reference/reason. Zero confirmed charges are allowed; a timeout alone is not evidence. Reconciliation is version/state guarded and audited. Saving policy or reconciling charges makes no model call.

This phase does not enforce inherited Voxfolio tools' spending and does not activate customer generation, Pinterest/LinkedIn publishing or a general billing system. Next P04.3.3 must reserve before every generation invocation and persist outputs and usage durably.

## Founder setup and tests — all pending

1. Pull the phase branch into a separate checkout; preserve local environment files. Run `pnpm install`, then `pnpm dev:admin` (port3001). Public app: `pnpm dev:web` (port3000).
2. If031 is already applied, apply only032 in Supabase SQL editor. Do not run assertion fixtures against hosted data. Never paste API keys into policy fields or public documents.
3. Log in on the admin host with your existing super-admin grant and MFA. Keep the existing server-side Gemini credential configuration.
4. Open Spending controls. Choose your checked Gemini model profile. Obtain its exact applicable USD input/output rates and request fees from the provider account/documentation. Enter pricing source, limits and valid-until ISO timestamp; review and save. No AI call occurs at this step.

| Test | Action | Expected | Status |
|---|---|---|---|
| MT102 | Load admin spending and refresh; visit public `/admin/spending` | Authorized admin view; public404; no public admin link | Pending |
| MT103 | Save reviewed verified pricing; refresh | Policy version, source, limits and history persist; no model request | Pending |
| MT104 | Save without confirmation or with invalid money/expired date | Save denied; no policy/charge created | Pending |
| MT105 | Open two tabs, save one, then save stale tab | Stale save denied; refresh required; earlier history preserved | Pending |
| MT106 | Set per-run allowance below displayed conservative estimate; attempt test | Budget denial before provider request; no new ledger request | Pending |
| MT107 | Restore sufficient verified allowance; explicitly run ONE model test if willing to incur its charge | One reservation; result/usage recorded; refresh shows settled amount or unresolved hold | Pending |
| MT108 | Review uncertain/overrun entry if available; reconcile only with real billing evidence | Held charge remains until verified reconciliation; state/history recorded; stale retry denied | Pending / conditional |
| MT109 | Recheck public sites, studio, docs and admin assignments | Existing workflows preserved; docs show39 and current1.19 | Pending |

MT107 is the only checklist step requiring a paid/provider request; it is optional until you authorize that cost locally. MT108 may not arise naturally; do not manufacture production failures or mark it passed without evidence. Local SQL fixtures cover uncertain, overrun, expired pricing, history-preserving cap changes and replay branches without contacting providers.

## Verification evidence

Local PGlite49 migration/assertion/upgrade steps passed; simulated Auth/JWT/storage only, not hosted Supabase, PostgREST or real concurrency. Admin78 unit tests, web314 unit tests, application-boundary check, typechecks and both production builds passed. Static docs include39 and release1.19; final evidence is in docs/delivery/P04.3.2. No real credential, hosted migration, deployment or paid AI request was performed by the assistant. Browser/manual visual acceptance for this phase remains pending.

## Founder clarification2026-10-03 — Gemini Free Tier

Founder reports032 applied. Do not reapply; MT102–109 remain pending.

1. In https://aistudio.google.com/projects/API keys identify the project associated with the actual server key; verify Billing Tier=Free Tier. A key created without payment can later belong to a paid project. Official pricing https://ai.google.dev/gemini-api/docs/pricing lists free input/output for gemini-3.5-flash-lite as checked2026-10-03.
2. Keep the existing checked Gemini profile and platform-gemini reference. Admin server settings: BIZOVEYA_GEMINI_API_KEY, BIZOVEYA_ENABLE_MODEL_TESTS=true, SUPABASE_SERVICE_ROLE_KEY, existing Supabase URL/anon key. Local settings: apps/admin/.env.local; restart after changes. Vercel: admin project's environment variables; redeploy after changes. Never paste keys in documents/public app/pricing fields.
3. Run pnpm dev:admin from repository root. Log in with admin/MFA at localhost:3001, open /admin/spending and select the checked Gemini profile. ONLY after verifying Free Tier/exact model, set Input USD/million=0, Output=0, Additional USD/request=0. Example ceilings Daily USD=0.10, Per-run=0.01; these are not charges. Pricing source=https://ai.google.dev/gemini-api/docs/pricing, valid-until=2026-10-10T23:59:00+05:00. Enable policy, reason=Verified Gemini Free Tier and model pricing on2026-10-03, confirm reviewed and save. Refresh: persistent policy/history; saving makes no API call.
4. Open /admin/model-tests, select same profile, verify checked/enabled/key/recorder/live-test prerequisites. Reason=Verify free-tier Gemini after spending setup. Authorize once and click current Run paid connectivity test button. That label does not determine Google's billing tier. Expected passed / response_matched; refresh retains record.
5. Refresh Spending controls: known usage at verified zero prices gives settled,$0. Unknown usage still holds/blocking state: check actual provider usage and reconcile only verified actual$0 with dated free-tier/account evidence. Timeout alone is not evidence of zero billing.
6. MT102 public404/admin access; MT103 refresh persistence; MT104 missing confirmation/invalid input/expiry; MT105 two-tab stale-save rejection; MT107 one explicit request/result/settlement; MT109 regressions/docs. MT106 below-reservation budget denial is N/A for zero rates/fees because reservation=0 and limits must be positive; local SQL covers nonzero rates. Do not invent paid rates for this case. MT108 conditional when an uncertain entry exists, otherwise not exercised.

Application still limits tests to five attempts per UTC day shared by all admins/providers, including prior tests. Free prices do not bypass quotas. Tests only check connectivity, not blog/pin/post generation. Google references checked2026-10-03: https://ai.google.dev/gemini-api/docs/billing and pricing above. Account tier is founder verification, not assumed from public documentation.
