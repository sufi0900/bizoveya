# Agent model assignments and manual testing

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


Living first draft — Bizoveya 1.18 / P04.3.1. Assignment setup is delivered; the full draft-generation workflow remains planned.

## Installation

1. Use the complete source from this package, keeping your private environment files. Node 24 is recommended; run `pnpm install --frozen-lockfile`.
2. If 001–030 are already applied, run only `supabase/migrations/031_agent_model_bindings.sql` in full. Otherwise reconcile database history and apply only missing migrations in ascending order. Never run test fixtures on hosted data or rerun old applied migrations.
3. Both existing deployments keep their roots: `apps/web` and `apps/admin`. No new project, domain or environment variable is required for assignments. Redeploy both from the same source when ready. Provider and recording keys remain admin-server-only.
4. From the repository root run `pnpm dev:admin`. Sign in at the separate admin host and complete MFA.

## First Gemini assignment

Open Agent configuration. Select Coordinator. Set **Future model tier** to **Economical preference** if that matches your Gemini profile. Review its instructions, enter a reason, **Save new draft version**, enter a review reason, **Check saved configuration**, tick explicit review, then **Approve for context preview**. Repeat later for Content specialist and Quality reviewer. These are existing roles; this release does not add dedicated Pinterest or LinkedIn roles.

Open **Model assignments**, select the agent and your checked Gemini profile. A matching passed test must be less than 24 hours old. If it has expired, use Model tests to explicitly authorize one new connectivity request first; the assignment page itself does not make paid requests.

Example reason: `Assign tested Gemini to the reviewed coordinator for the Do It With AI Tools draft pilot.` Tick review and **Save assignment**. Expected: **Current assignment — generation not enabled**. Refresh to verify persistence/history. One tested profile may serve several eligible agents. Assignment does not prove content quality or activate generation.

## Pending founder tests

| ID | Action | Expected result | State |
|---|---|---|---|
| MT095 | Apply 031 and open Model assignments | Page loads; existing data retained | passed — founder report2026-10-03 |
| MT096 | Select unreviewed agent or mismatched tier | Save unavailable with guidance | passed — founder report2026-10-03 |
| MT097 | Save eligible agent/Gemini assignment and refresh | One current assignment and event persist | passed — founder report2026-10-03 |
| MT098 | Double-click save; save from a stale second tab | One successful revision; stale write rejected | passed — founder report2026-10-03 |
| MT099 | Change agent configuration, then refresh assignment | Review required; no silent reactivation | passed — founder report2026-10-03 |
| MT100 | Disable with reason and review | Disabled record and history retained | passed — founder report2026-10-03 |
| MT101 | Mobile/light/dark, nonadmin and public-host checks | Readable UI, denied unauthorized access, public page/API404 | passed — founder report2026-10-03 |

Existing test MT090 is accepted only for the founder's screenshot of a successful local Gemini request. Other earlier tests remain pending unless individually evidenced. Do not rotate a real provider key just to test a UI without considering its other consumers.

## Architecture and dependency contract

Assignment depends on agent version/check/preview approval, model profile version/check, reference version/enabled state, and matching test suite/version/freshness. Reads and writes require platform administrator plus AAL2. Tables use RLS with no direct client/service-role grants; authenticated RPCs enforce authorization. Optimistic revisions reject stale edits; an uncertain network result requires refresh before retry. Events retain actor, reason, timestamp, revision and immutable snapshot. Disable is not deletion.

The SQL server rechecks dependencies during a write. A future runtime must recheck them at dispatch, reserve spending, persist a run and enforce scoped tools before any paid request. Preview approval and assignment alone are not runtime authorization. The initial 24-hour policy is not a provider uptime guarantee and can change through a documented migration. Profile budget values remain metadata until P04.3.2.

## Next subphases

- P04.3.2: versioned pricing inputs, conservative spending reservations, run/day limits, usage accounting and uncertain-cost reconciliation.
- P04.3.3: site-scoped briefs, approved knowledge snapshots, durable coordinator/writer/reviewer runs, social adaptation, retries/cancellation and editable draft review.
- P04.3.4: branded Pinterest pins and LinkedIn carousel composition and exports.

These are planned, not delivered. Publishing stays deferred.
