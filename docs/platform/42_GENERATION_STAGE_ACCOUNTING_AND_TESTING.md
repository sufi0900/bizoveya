# Generation stage accounting and testing

P04.3.3.3 / source1.22 installs the durable execution and spending boundary for the future three-stage campaign workflow. It still makes **no provider request** and exposes no live Generate button. Pinterest graphics, LinkedIn carousel/PDF, publishing and customer activation remain later work.

## Implemented boundary

Migration035 adds one private durable row before each future coordinator, content or quality call. A stage pins the generation run, ordered role, model profile/version, pricing-policy version/snapshot, conservative token ceilings, claim, reservation, usage, structured output/error and terminal timestamps. Coordinator must settle successfully before content; content must settle before quality. A repeated stage ID is idempotent and conflicting identity is rejected.

Generation stages and connectivity tests now count against the same profile/day allowance. Reservation happens transactionally before a future call using the snapshotted rates, declared request fee and25% margin. Unknown usage or an overrun fails closed and blocks later requests until an administrator checks provider billing and reconciles it. A timeout never releases held cost automatically. The admin Spending room labels connectivity tests and campaign stages separately while showing their combined recorded/held daily amount.

Only the service role can begin or finish a stage. Authenticated users cannot call these RPCs or select the private tables. Workspace membership is rechecked using the requesting actor, viewers/outsiders are denied, and stage summaries shown to members exclude claims, prompts, private snapshots, outputs and pricing details. The future runtime must create a stage ID before contacting a provider, persist output and reported usage before responding, and never blindly retry a possibly billable stage.

## Required installation

Use the Supabase SQL editor only for missing numbered migrations:

1. If034 is not already applied, run `supabase/migrations/034_generation_run_snapshots.sql` first.
2. Run `supabase/migrations/035_generation_stage_accounting.sql` once.
3. Never run `supabase/tests/035_generation_stage_accounting_assertions.sql` on hosted data; it is destructive synthetic local test SQL wrapped in rollback.
4. Deploy the cumulative `main` source to both existing Vercel projects. Do not add a new project or change either root directory.

No new environment variable, API key or form field is introduced by this checkpoint. `BIZOVEYA_ENABLE_MODEL_TESTS` does not enable campaign generation. Do not attempt direct stage RPC calls from the browser/SQL editor; they are server-only foundation APIs for the next runtime checkpoint.

## Manual acceptance

Use the existing sample values where a current prerequisite is missing:

- Knowledge fact: `Do It With AI Tools helps readers discover and compare practical AI tools and workflows.`
- Brand voice: `Practical, clear and evidence-led.`
- Audience: `Freelancers, consultants and small business owners exploring AI tools.`
- Guidance: `Prepare drafts only. Do not invent statistics, guarantees or unsupported product claims.`
- Campaign title: `AI SEO workflow for a small business`
- Campaign brief: `Create review-only blog, Pinterest and LinkedIn drafts from approved facts. Do not invent statistics, guarantees or unsupported claims.`

| ID | Action | Expected | Status |
|---|---|---|---|
| MT127 | Apply only missing034 then035; refresh existing campaign, Knowledge and Studio routes | Existing data still loads; no migration/reset prompt or lost content | Pending |
| MT128 | Open admin `/admin/spending` with named admin+AAL2 | Page loads; copy says model tests and campaign generation share the allowance; prior test run/history remains | Pending |
| MT129 | Open a saved campaign and expand Generation snapshots | Existing prepared snapshot persists; it may show no executed stages; no provider usage, charge or publish occurs | Pending |
| MT130 | Prepare one new snapshot using the sample prerequisites, refresh and reopen | Exactly one durable prepared run; campaign version/time persist; stage execution list stays empty because live runtime is disabled | Pending |
| MT131 | Check Gemini/provider console after MT127–130 | No new request or charge attributable to these tests | Pending |
| MT132 | Desktop/mobile smoke of campaign and admin Spending pages | Labels remain readable; no public admin link or customer-visible private details | Pending |

MT118–126 from document41 remain pending unless separately reported. These new checks do not test actual generation, server-stage settlement, concurrent hosted reservations or provider billing reconciliation; those require the next disabled-by-default runtime and explicit operator activation.

## Next checkpoint

Add the server-only, default-off coordinator→content→quality runtime using the installed AI SDK and current provider adapters. It must use structured schemas, one attempt per stage, abort limits, exact snapshot prompts, service-role reservation/settlement, durable outputs and an explicit human review action. Provider activation remains a separate operator decision after hosted migration and safe-path acceptance.
