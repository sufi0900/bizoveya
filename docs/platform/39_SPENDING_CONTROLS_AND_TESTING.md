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

Local PGlite49 migration/assertion/upgrade steps passed; simulated Auth/JWT/storage only, not hosted Supabase, PostgREST or real concurrency. Admin72 unit tests, web313 unit tests, application-boundary check and typechecks passed before documentation projection update. Final build/projection results belong in the phase delivery report. No real credential, hosted migration, deployment or paid AI request was performed by the assistant. Browser/manual visual acceptance for this phase remains pending.
