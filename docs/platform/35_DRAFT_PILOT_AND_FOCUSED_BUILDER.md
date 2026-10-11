# Focused builder and Do It With AI Tools draft pilot

## Current checkpoint — 1.20 / P04.3.3.1

Private campaign draft storage is implemented at `/workspaces/[workspaceId]/sites/[siteId]/campaigns`, with saved campaign URLs ending in `/[campaignId]`. This checkpoint stores manually authored brief/blog/Pinterest/LinkedIn text; it makes no model request and does not publish. Additive migration033 follows032. P04.3.3 remains in progress: bound-agent orchestration, generation reservations, durable execution/usage and output review are the next work on the SAME `phase/p04-3-3-durable-drafts` branch. See [40 Campaign drafts](40_CAMPAIGN_DRAFTS_AND_TESTING.md).

Founder screenshots on2026-10-03 confirm Gemini connectivity and MT107 settlement:20 input/7 output tokens, pricingv1, held/count amounts$0, run `e5be1ac3-5620-40e0-9498-97febb96fb15`. MT103 saved policy/history is evidenced; refresh persistence is not separately reported. Other unevidenced manual gates stay pending. Pakistan Token Factory onboarding is blocked; Builder application is under review. Nebius support email was drafted for the founder, not sent by the assistant. No main merge, production deployment, hosted SQL or provider call performed.


## Historical contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


## Current contract — package1.17 / P04.0

P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

Live tests default off. Explicit operator setup requires the selected private provider key plus an admin-only SUPABASE_SERVICE_ROLE_KEY for server-attested result recording, then BIZOVEYA_ENABLE_MODEL_TESTS=true and per-request pricing/charge acknowledgement. No secret-entry form exists. Named current admin+AAL2 is required; client roles cannot mark results passed. Additive030 enforces one running test and five attempts per UTC day platform-wide, durable request IDs, expiry/unknown states and version-sensitive evidence. Failures/unknown attempts still consume the attempt allowance and may be billed. Existing dailyBudgetCents remains planning metadata; monetary enforcement precedes customer runtime.

Read36_MODEL_CONNECTIVITY_AND_TESTING.md for exact setup, supported evidence and MT087–094. All1.16 tests and earlier unevidenced founder gates stay pending; the founder is currently testing and has supplied no new pass results. Preserve001–029 and historical files. One cumulative ZIP/repository and the same two Vercel roots. No hosted SQL/deploy/provider request was performed by the assistant. Next implementation dependency: reviewed exact-model evidence, agent/profile binding, enforced monetary limits and durable draft runs, then visual output composition. The35 draft-only pilot and34 Studio/removal scope remain in force; publishing remains deferred.

Earlier release contracts below are historical and superseded where they conflict with this current contract.


Living plan, package1.16. Agent runtime/visual generation not delivered by P02.5.

## Commercial direction

Initial new-site audience: freelancers, consultants, small agencies providing digital services. Website creation supports the agent-focused product and does not aim at full WordPress feature parity in the first release. Existing-site registration remains available across niches, with future supported execution capabilities verified separately. Doitwithai.tools is an existing content-hub pilot; a separate fictional digital-service business tests the builder.

Future reusable architecture separates business/niche profile, content structure (pages/collections/entries), and design tokens/layouts. Niche recipes configure shared primitives instead of duplicating entire renderers. A custom collection such as Solutions should create /solutions and /solutions/[entrySlug]; user-chosen menu labels link by page ID. Unique routes/reserved paths, listing filters/pagination/empty states, entry templates, page references, deletion impact and export/versioning must be implemented together. Initial essential pages: Home, About, Services, service detail, Work/case study, Contact, Blog/article. Optional gallery/buttons/rich text/supported-video blocks; arbitrary executable code deferred. These are target-site paths, not platform source folders or already-live Bizoveya routes.

## Revised pilot outputs and roles

Publishing is deferred. First runtime pilot creates saved editable blog, Pinterest title/description/alt+rendered graphic, LinkedIn copy and six-slide rendered carousel/PDF. A text outline alone is not a completed visual deliverable. Five proposed roles: coordinator, writer, quality reviewer, Pinterest specialist, LinkedIn specialist. Shared visual composer uses branded layouts/approved assets; extra paid image generator not required. Existing supported admin kinds remain coordinator/content/quality; adding social roles requires contract/tools/schema/migration review, not simply prompt editing. Provider/model/SDK proof, agent-profile binding, enforced spend limits, stored runs/retries/cancellation and output validation precede live drafting. Current rooms still prepare config/context only.

Structured task outputs should pin site, knowledge/source versions, agent/model/preferences versions and artifact references. QA reports specific unresolved claims; founder reviews editable drafts. No social OAuth/CMS writes required for first draft-only pilot. Separate later publishing phase needs exact-version approval, authorized connectors, receipt/readback and per-destination idempotency; it is not part of this release.

## Owner-reviewable public knowledge

Public pages reviewed2026-10-02: https://doitwithai.tools/, /about, /ai-seo-tools and /ai-tools. Some retrieval sections contained Loading placeholders; not a complete crawl or functional tool verification. Store source URL/retrieval date, owner review, revision and permissions; public marketing claims are not independent performance evidence.

Paste the following as a draft knowledge source titled Do It With AI Tools — public brand overview:

```text
Website: https://doitwithai.tools/
Brand: Do It With AI Tools
Founder: Sufian Mustafa
The website provides resources about AI-assisted content creation, SEO,
productivity, and business growth.
Its public audience includes SEO professionals, marketers, content creators,
developers, and AI beginners.
The AI SEO toolkit presents a Meta Title Generator, SEO Slug Generator,
and Schema Markup Generator.
The brand describes a human-led approach to using AI.
Sources: https://doitwithai.tools/ ; https://doitwithai.tools/about ;
https://doitwithai.tools/ai-seo-tools
Public-page summary prepared for owner review; performance claims unverified.
```

Generate candidates -> review each -> save -> owner approve. Lookup SEO to see approved facts/citations; revoke to exclude them. Current extraction is deterministic text chunking and lookup is keyword filtering. No semantic retrieval/crawl/model answer implied. Instructions remain separate from approved facts and cannot grant permissions.

Preferences demo: brandVoice=Clear practical English, explain limits and avoid exaggerated promises; audience=People evaluating AI tools for practical work; guidance=Prepare drafts only, flag unsupported claims, never invent testing/statistics/testimonials/features or promise rankings/AI citations.

## First task brief and acceptance

Topic: Explain how a page title, URL slug and structured data describe the same subject consistently. Outputs: one article, two Pinterest visual variants, one LinkedIn post, one six-slide carousel (problem/title/slug/schema/fictional example/review checklist). Source references point to supplied toolkit material; no ranking claims or invented case evidence. Proposed theme #5271FF from founder brand context; owner supplies logo asset and one best representative article before assessing final visual/voice fidelity. Test content is explicitly illustrative.

Acceptance: useful accurate drafts, source/claim notes, readable editable visuals, saved versions, reliable retry without duplicate artifacts, current permissions/knowledge, clear cost/failed-run states. All runtime acceptance is pending. No CMS/social password or token is needed for draft-only acceptance; a privately configured model provider will be necessary when runtime is implemented.
