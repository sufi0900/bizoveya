# GitHub delivery and scheduled continuation

## Superseding delivery policy — 2026-10-03

The founder explicitly authorized verified cumulative checkpoints to be delivered directly to `main` to avoid manual preview promotion. Before each write, compare remote main with the cumulative source, preserve ancestry/user work, run relevant checks, and update main only as a non-force fast-forward. A main push may trigger the already configured Vercel production projects; this consequence is accepted. Do not change Vercel settings, run hosted SQL, invoke paid providers, publish customer content or ship failing/unfinished-enabled features. The old branch/PR-only text below is historical where it conflicts.

Current1.21 checkpoint adds disabled-by-design generation snapshot preparation and migration034. P04.3.3 remains in progress.

## Current checkpoint — 1.20 / P04.3.3.1

Private campaign draft storage is implemented at `/workspaces/[workspaceId]/sites/[siteId]/campaigns`, with saved campaign URLs ending in `/[campaignId]`. This checkpoint stores manually authored brief/blog/Pinterest/LinkedIn text; it makes no model request and does not publish. Additive migration033 follows032. P04.3.3 remains in progress: bound-agent orchestration, generation reservations, durable execution/usage and output review are the next work on the SAME `phase/p04-3-3-durable-drafts` branch. See [40 Campaign drafts](40_CAMPAIGN_DRAFTS_AND_TESTING.md).

Founder screenshots on2026-10-03 confirm Gemini connectivity and MT107 settlement:20 input/7 output tokens, pricingv1, held/count amounts$0, run `e5be1ac3-5620-40e0-9498-97febb96fb15`. MT103 saved policy/history is evidenced; refresh persistence is not separately reported. Other unevidenced manual gates stay pending. Pakistan Token Factory onboarding is blocked; Builder application is under review. Nebius support email was drafted for the founder, not sent by the assistant. No main merge, production deployment, hosted SQL or provider call performed.


## Historical contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Historical1.18 delivery attempt

Decision recorded 2026-10-03 Asia/Karachi. Founder Sufian Mustafa approved phase branches/PRs and a six-hour continuation schedule.

Repository: https://github.com/sufi0900/bizoveya . Inspected main: `b1dfbcf2b00cef032dee4773e73a05f21347796b`, package1.7. The later delivered1.17 source is the implementation baseline. Intended phase branch: `phase/p04-3-1-agent-model-bindings`. Do not overwrite newer external work or resume from old main without reconciliation.

## Delivery policy

One branch and one PR per phase; reuse the branch across interrupted runs. Commit code, migrations, docs and evidence together. Main stays the reviewed release; no automatic merging, force pushing or production deployment. ZIP filenames remain in historical records; GitHub deliveries additionally record actual branch/commit/PR URLs. Local commits are not remote delivery evidence. Keep one repository and the two existing Vercel projects.

Actual branch creation failed with HTTP403 `Resource not accessible by integration`. Read-access metadata was insufficient to prove write permission. No remote branch/commit/PR exists for this work. Repair the connected GitHub app's repository Contents write permission; do not paste credentials into chat. Review the cumulative source difference against old1.7 before a later PR. Obsolete pre-monorepo root app files are not carried into this1.18 package; their earlier history remains retained in Git/history.

## Historical schedule setup

Task **Continue Bizoveya implementation** was created with a six-hour recurrence, intended first occurrence 2026-10-03 08:40:38 PKT. It was then **paused** because GitHub writes were blocked. It has not been claimed to run unattended. Resume that existing task after write access and durable source are verified; do not create duplicates.

A periodic task is not an inactivity detector or a guaranteed usage-limit reset trigger. Usage limits still apply. Resume unfinished authorized work before advancing; advance only when dependencies permit. Save checkpoints, compare remote head and avoid overlapping runs. A lease record is coordination information, not an atomic lock. Keep manual checks pending. Hosted migrations, paid requests, main merges and publishing require their respective authorization.

## Recovery

Read CONTINUATION.md and current phase/affected documents, then inspect actual source. Preserve user edits. Save coherent progress frequently. Current fallback archive is `Bizoveya_1.18_Agent-Model-Assignments.zip`. A truncated initial upload was detected and replaced after rebuilding; do not use an earlier damaged copy. Recovery is recorded in the activity log and delivery evidence.

## Verified1.19 delivery

Branch phase/p04-3-2-spending-controls; source commit `e05aaede9d191ae63f5b687bbd3d57080f18f281`; draft PR https://github.com/sufi0900/bizoveya/pull/1 . Cumulative1.19, all798 source blobs/modes verified. Existing continuation task verified enabled2026-10-03; old paused/403 statements above are historical. No new task was created. Main remains b1dfbcf2b00cef032dee4773e73a05f21347796b. See phase delivery report and CONTINUATION before the next action.

## Deployment shortcut clarification2026-10-03

Founder prefers direct-main uploads if branches cannot update production automatically. Verified shortcut: configure both Vercel projects to track main as Production branch. A tested PR merged into main triggers production builds and updates the respective assigned domains, without manually selecting branches or promoting every preview. Ordinary preview-branch pushes alone do not update production domains. Recommended path remains phase branch -> reviewed merge into main -> automatic Git deployments. No main write/merge or settings change was performed.

One-time settings per project: Settings -> Environments -> Production -> Branch Tracking=main; GitHub connection active; public Root Directory apps/web, admin apps/admin; respective custom domains attached. Current PR1 is draft: Ready for review then Merge pull request/Confirm merge after reviewing checks. If merge is blocked, resolve the visible check; do not force push or disable safeguards. Keep manual steps in chat as well as documentation. Official https://vercel.com/docs/git and https://vercel.com/docs/deployments/promoting-a-deployment .
