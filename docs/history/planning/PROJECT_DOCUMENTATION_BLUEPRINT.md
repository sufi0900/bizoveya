# Platform transformation: documentation blueprint

**Status:** Discovery draft, 29 September 2026  
**Purpose:** Define the documents, research decisions, implementation phases, and update rules before implementation.  
**Audience:** Sufian Mustafa, future developers, and other AI assistants.  
**Current code baseline:** Voxfolio V27.12 cumulative archive. This document does not certify a live deployment or completed acceptance tests.

## 1. What is being transformed

Voxfolio began as a voice-directed 3D portfolio builder for the AssemblyAI voice competition. Its existing system has authenticated portfolio projects, guided creation, selectable portfolio presentations, a voice/text assistant, a Studio with live canvas, structured pages and posts, revisions, governed publication snapshots, Visitor Vox knowledge, and Supabase migrations through `017_vox_interview_demo_sessions.sql`. The V27.12 release specifically adjusts template preview/confirmation and spoken draft creation. Its release note says full dependency-based checks and live voice/Supabase verification remained for the owner's environment. This is the **code baseline**, not proof that all future capabilities are implemented.

The direction evolved in three steps:

1. Add business websites and a visitor assistant to the portfolio builder.
2. Offer websites, chat/voice reception, leads and CRM as one customer workflow.
3. Create a broader digital operations platform: connect an existing website or build a new one, then coordinate persistent AI employees across content, code, distribution and customer channels.

The earlier AI agency project also exists. Its Next.js/Supabase dashboard boilerplate has schema and dashboard surfaces for agents, runs, conversations, memory, approvals, integrations and audit. An earlier architectural handoff paused expansion of the custom interface to test a ChatGPT-first alternative. The current proposal reopens the unified dashboard because website building and connected-site management must work as a commercial product. **Neither prior decision nor its code is silently discarded.** The baseline audit will decide what to reuse, adapt, archive or replace. A past ChatGPT-to-Sanity draft was demonstrated; automatic Sanity→Image→Pinterest orchestration, full meetings and interrupt handling were proposed, not verified as completed.

## 2. Product boundary and audience

**Working product thesis:** One workspace to build or connect a website, understand the business, assign supervised work to AI employees, and track the results across website, content and connected channels.

**Initial audience:** Independent professionals and service businesses that need a site, content, leads or repeated digital operations, plus owners of existing sites who need coordination without migrating. Support multiple industries. Do It With AI Tools, Sufian Mustafa and LIONXE are first-party validation workspaces/sites, not assumptions that every customer uses the same content structure.

**Two entry paths:** `Create a website` and `Connect an existing website`. A workspace may contain any number of sites subject to published plan/usage limits, which are undecided. Sites may be portfolio or business presentation types. Later commerce is exploratory.

**Common organizational layer:** Site registry, business facts, permissions, meetings, tasks, employees, decisions, approvals, history and integrations. Existing sites keep their current repository/CMS/hosting as the source of truth. Native sites use the platform's governed content and publication path.

**First complete proof:** A managed article workflow on an existing site, with approved business context, model-driven planning, quality review, Sanity draft, distribution handoff, interruption/recovery and a visible audit trail. A native business site should then use the same task and memory layer. The hackathon slice may narrow to the smallest working end-to-end version.

## 3. Source inventory and evidence classification

| Input | Known now | Verify before implementation |
|---|---|---|
| Voxfolio V27.12 archive | README, release history, code routes and 001–017 migrations are present | Current Git HEAD, deployment, migration state, `pnpm` checks, live voice/visitor flow |
| Earlier AI Workforce Dashboard Boilerplate | Next.js/Supabase schema and UI foundation present in archive | Current branch, working integrations, suitability for merge or extraction |
| AI Agency ChatGPT Pivot Architecture Handoff | Meetings, shared memory, handoffs and ChatGPT-first experiment documented | Which experiments succeeded; whether current project supersedes its UI assumption |
| User's websites | Portfolio, AI content/tool hub, and an unfinished LIONXE business site intended as three separate connected sites | Exact domains/repositories/CMS/deployments and owner permissions; the latest spoken names were ambiguous |
| Hackathon | Nebius Token Factory/AI Cloud plus NVIDIA open model, live demo, public licensed source, video and pre-existing project change disclosure | Model ID/account credits, actual runtime calls, final track and submission evidence |

**Evidence labels required in every future document:** `Verified in code`, `Verified live`, `Reported by owner`, `Proposed`, `Blocked`, `Deferred`, `Superseded`. Do not infer live status from a release note or an old implementation audit. Historical V20 audit findings are superseded by later releases unless a current test reproduces them.

## 4. Recommended repository document set: 13 core files

These are the documents to author **after** this blueprint is reviewed. The headings below are content contracts, not empty placeholders. They belong under `docs/platform/` in the project repository, with `README.md` linking to `00_INDEX.md`. The original release notes remain intact as history.

| File | Required contents and purpose |
|---|---|
| `00_INDEX.md` | Reading order, document ownership, status/version table, current phase, authoritative sources, unresolved decisions, handoff instructions and links to all records. New assistants start here. |
| `01_ORIGIN_AND_PRODUCT.md` | Original AssemblyAI Voxfolio purpose and V27.12 baseline; agency history and ChatGPT-first pivot; evolution of product thesis; goals, audiences, jobs to be done, value proposition, positioning, success measures, scope and exclusions. Distinguish owner goals from tested market evidence. |
| `02_REQUIREMENTS.md` | Numbered functional/nonfunctional requirements with IDs, priority, acceptance evidence and phase mapping: two entry paths, unlimited-in-principle site registry, portfolio/business, CMS, code changes, channels, CRM, voice, meetings, interrupts, memory, human approval, accessibility and performance. Track deferred proposals without deleting them. |
| `03_EXPERIENCE_AND_ROUTES.md` | Screen inventory, precise route registry, navigation, user roles, onboarding journeys for native/connected/unsupported sites, empty/error/loading states, Studio evolution, approval/meeting/monitoring UX, public site SEO and mobile/accessible interaction. Routes are provisional until checked against existing routes. |
| `04_SYSTEM_ARCHITECTURE.md` | Current and target component diagrams; boundaries among Voxfolio builder, operations control plane, model gateway, execution workers, CMS/repo/deploy adapters and channels; request/event sequences; native vs connected website flow; failure and fallback boundaries; deployment topology and architecture decision links. |
| `05_DATA_AND_MEMORY.md` | Existing Supabase migrations, additive schema plan, workspace/site ownership, tenant isolation, content ownership, document versions, approved business facts, memories, retrieval scope, meetings, tasks, artifacts, conversations, leads, retention, backup/migration strategy and schema ownership. Include ERD and migration compatibility. |
| `06_AGENT_OPERATIONS.md` | Employee registry, manager/facilitator, permissions and typed task contracts; meeting agenda→role contributions→proposal→founder decision→action items; separate employee chats, handoffs, synchronization, interrupt taxonomy, pause/resume checkpoints, event receipts, retries, cost and status monitoring. Include the Sanity→Image→Pinterest proof. |
| `07_CONNECTORS_AND_SITE_MODES.md` | Capability matrix for GitHub, Vercel, Sanity, native builder, public-URL-only fallback, future CMS/hosting and social channels; authorization, scopes, token ownership, read/write/publish semantics, conflict handling, idempotency, degraded operation, import versus connect versus rebuild. Map the three first-party sites separately. |
| `08_TECH_STACK_AND_SECURITY.md` | Actual versions and dependencies from code; proposed Next.js/React/TypeScript/Supabase/Nebius components; Gemini/AssemblyAI/OpenAI as explicitly chosen or retained roles; cost controls; secrets; RLS; repository/sandbox isolation; model output validation; approval policies; external API permissions; operational limits and threat checks. Decisions cite tests/ADRs. |
| `09_DESIGN_AND_BRAND.md` | Product design principles, component/token systems, responsive and reduced-motion rules, business templates vs portfolio templates, visual hierarchy, dashboard information architecture, UI states, branding exploration, naming criteria, logo brief and decision status. Name/logo remain provisional. |
| `10_PHASES_AND_STATUS.md` | Dependency-ordered phase ledger below, each with objective, scope, tasks, file/schema changes, prerequisites, manual owner actions, acceptance proof, status and follow-ups. Completed work is marked only after checks. No duration estimates. |
| `11_VERIFICATION_AND_RELEASE.md` | Automated and manual test matrix, migration dry runs, local/staging/live acceptance, rollback and recovery, operational alerts, provider-failure exercises, security and accessibility checks, demo fixtures and a release evidence index. |
| `12_HACKATHON.md` | Track rationale, explicit Nebius/NVIDIA runtime use, model IDs, request/response evidence, new work since submission opening, judge demo path, public repo/license/README, public ≤3-minute YouTube demo, feedback requirement, judging access, submission checklist and official rule links. Separate competition commitments from commercial roadmap. |

**Living records (additional files, not extra core specifications):** `docs/platform/decisions/ADR-####-*.md`, `docs/platform/CHANGELOG.md`, `docs/platform/OPEN_QUESTIONS.md`, and `docs/platform/PHASE_HANDOFF_TEMPLATE.md`. A phase may add a runbook or adapter specification, but it must be linked from the index. Avoid duplicate copies of the same requirement in several files; cross-reference the canonical owner document.

## 5. Route and information architecture hypothesis

Voxfolio currently has `/`, `/start`, `/projects`, `/studio/[projectId]`, and public `/p/[slug]` routes plus case studies/pages/blog. Preserve them until migration decisions are tested. Proposed operations routes (all subject to route collision/access review):

| Proposed route family | Purpose |
|---|---|
| `/workspaces/[workspaceId]` | Owner overview; sites, current work and outcomes |
| `/workspaces/[workspaceId]/sites` | All connected and native sites, with capability state |
| `/workspaces/[workspaceId]/sites/new` | Choice: create site or connect existing |
| `/workspaces/[workspaceId]/sites/[siteId]` | Site overview and operational status |
| `/workspaces/[workspaceId]/sites/[siteId]/content` | Content registry and site-specific CMS adapter |
| `/workspaces/[workspaceId]/sites/[siteId]/integrations` | Repository, CMS, deployment and channel connections |
| `/workspaces/[workspaceId]/tasks/[taskId]` | Live progress, outputs, interrupts, approval and audit |
| `/workspaces/[workspaceId]/meetings` and `/meetings/[meetingId]` | Meeting list, transcript, decisions and action items |
| `/workspaces/[workspaceId]/agents` | Employee definitions, permissions and separate conversations |
| `/workspaces/[workspaceId]/knowledge` | Approved facts, policies, provenance and access |
| `/workspaces/[workspaceId]/approvals` | Queued sensitive actions and review history |

Existing `/projects` and `/studio/[projectId]` may remain as the native builder surface; do not introduce a second editor before testing how the shared workspace shell links to them. Public site URL/domain routing and business template slugs need their own ADR after the baseline route audit. Proposed paths are **design candidates, not implemented routes**.

## 6. Architectural choices to resolve before the specifications are locked

| Decision | Current recommendation | Required evidence |
|---|---|---|
| Product name | Keep `Voxfolio` as the working code/product name; study broader names for the operations platform | Naming criteria, audience comprehension, trademark/domain checks before commercial adoption |
| Logo | Keep existing assets provisionally; design a mark around coordinated work and multiple sites only after positioning | Readability at favicon/app icon size, monochrome and accessible contrast |
| Voxfolio vs AI workforce code | Preserve both; audit and choose extraction/merge boundaries | Live Git HEADs, schema collisions, auth identity, route overlap and migration safety |
| ChatGPT role | Optional founder-facing surface, useful research/execution provider; authoritative state belongs to platform | Test external-memory and tool behavior before depending on it |
| Native business website | Extend site content/presentation contracts without corrupting portfolio projects | Schema migration and content-preservation tests |
| Existing site | Connect CMS/repository/hosting when authorized; keep each original deployment | Connector capability proof and conflict/recovery tests |
| Model gateway | Nebius-hosted NVIDIA model drives the hackathon's central planning/workflow; other models have explicit auxiliary/fallback roles | Real account/model test, tool calling and structured output compatibility |
| Meetings | Existing facilitator concept; asynchronous durable role turns first, live voice later | Persistent decisions/tasks, owner interruption and recovery proof |
| Agent execution | Bounded typed actions, state machine, queue/worker and human gates | Retry/idempotency proof and no repeated external publish |

## 7. Proposed implementation phases (no time estimates)

Each phase is an outcome with acceptance evidence. Phase numbering is stable even when small changes are added. An urgent repair is recorded as `Pxx.Fix-y`, and a compatible enhancement as `Pxx.Add-y`; neither silently changes an accepted requirement. A significant new capability gets a new phase or ADR. Subtasks may be reordered if dependencies are documented.

| Phase | Outcome and essential work | Manual owner verification |
|---|---|---|
| **P00 — Baseline and documentation** | Audit current Voxfolio and workforce repo/archives, Git heads, migrations, environment and live deployment. Create core docs and mark truth status. Preserve backups. | Provide repository access/archives and note which migrations and deployed version are actually live; run local commands where credentials/device are needed. |
| **P01 — Product shell and organization** | Define workspace, membership, multiple-site registry, roles and route shell. Show portfolio/native/connected site status. | Add the first three sites to a nonpublishing registry; check names/ownership and navigation. |
| **P02 — Business builder** | Extend onboarding to portfolio or business; reusable service sections and at least one credible business template; retain existing portfolio records/revisions/publications. | Create and publish a test business site, check mobile/SEO/contact and portfolio regression. |
| **P03 — Business knowledge and memory** | Approved facts, policy versions, provenance, site scopes, private artifacts, retrieval rules and export/delete; reuse Supabase foundation where possible. | Approve sample facts for each business and verify no cross-site leakage. |
| **P04 — Nebius agent foundation** | Live Token Factory model gateway with NVIDIA open model; manager plan→typed tasks→tool policy→telemetry; model-output validation and failure states. | Add API key in private environment, verify live calls/credits and a real trace. |
| **P05 — Existing-site content connection** | Capability discovery and Sanity connector, including special Markdown/imported article rules; draft/readback, conflict detection and approvals. | Authorize site/CMS, approve one draft, compare it in native CMS and live preview. |
| **P06 — Meetings and interruption** | Facilitated text meetings, separate role contributions, saved decisions/action items, status/amend/pause/priority/cancel/emergency stop and safe resume. | Join a meeting, amend a running task and verify completed external actions remain visible. |
| **P07 — Content-to-distribution handoff** | Research→Sanity draft→visual brief/asset→Pinterest draft/authorized action, dependency state and recovery. | Connect the selected social account and approve a real or sandbox publish if capability exists. |
| **P08 — GitHub/deployment connector** | Selected-repository GitHub App, constrained code proposal, sandbox checks, PR/preview and deployment state; Vercel integration for supported project information. | Install repository app, inspect diff/preview, test rollback/merge on safe branch. |
| **P09 — Three-site validation** | Apply registered capabilities to Do It With AI Tools, Sufian Mustafa and LIONXE individually; LIONXE may stay read-only until its site/content resumes. | Verify exact domain, repository, CMS, deployment, access and one meaningful task per site. |
| **P10 — Customer conversation layer** | Website assistant/lead capture, separate public knowledge and permissions, leads view; later WhatsApp and phone channel adapters. | Test visitor questions, consent/handoff, lead record and tenant boundaries. |
| **P11 — Commercial operations** | Assisted and self-service setup, quota/cost display, subscription and support requirements, operational monitoring and data portability. | Complete onboarding as a fresh customer, validate costs and support path. |
| **P12 — Competition/release gate** | Live judge path, model proof, open-source repo/license, README/setup, video, submission narrative and post-submission availability. This can run in parallel with earlier phases; final gate only after a stable complete demo. | Test guest/judge login and full flow, approve public code and submit Devpost entry. |

**Hackathon cut line:** P00, P01, P03, P04 and a complete subset of P05–P07 form the core demonstrable platform. P02 should provide one business-site example if reliably ready. P08–P11 can be presented only if actually working; otherwise label as future work. This cut line may change by ADR after baseline audit. No calendar estimates are attached to phases.

## 8. Phase completion, document updates and cross-chat handoff

For every implementation delivery, the developer/AI assistant must:

1. Read `00_INDEX.md`, active phase in `10_PHASES_AND_STATUS.md`, relevant requirements and latest ADRs, then inspect current code. The documents guide work but do not override the latest user instruction or observed code behavior.
2. Record new user requests and classify them: clarification, compatible enhancement, defect, scope change or architecture change. Update requirement IDs and an ADR when the underlying contract changes.
3. Implement the smallest coherent change and verify its actual behavior. Record automatic checks, manual checks, missing credentials and known gaps separately.
4. Update the phase ledger with one of `Proposed`, `In progress`, `Implemented—verification pending`, `Accepted`, `Blocked`, `Deferred` or `Superseded`. Use `[x]` only for **Accepted**; use `[~]` for implementation awaiting owner/live checks and `[ ]` otherwise.
5. Update every affected canonical document in the **same code change**: routes, schema, API/connector capability, agents, security, design, tests, hackathon evidence. Add migration instructions and changelog entry. Broken cross-references are a release failure.
6. Add a compact handoff: objective, code files and migrations changed, tests run/results, environment actions, manual tests, unresolved questions, next phase and links to decisions. Never write secrets or real customer data to docs or public commits.
7. Deliver the full changed repository or patch with updated docs. A later assistant can verify the archive/commit and continue without trusting an old chat summary.

**Phase ledger row format:** `ID | Status | Requirement IDs | Implemented files/migrations | Automated evidence | Owner evidence | Open issues | ADR/commit`. The initial ledger starts with all new phases unaccepted; inherited Voxfolio functionality is catalogued in the baseline, not incorrectly checked off as transformed-platform work.

**Conflict rule:** When a new instruction changes the plan, record the previous decision and why it changed. User direction has priority. Do not silently erase old decisions, modify a completed phase to pretend it never existed, or mark a feature finished from code presence alone. Add a short corrective phase item where appropriate.

## 9. Immediate discovery questions and manual inputs

These are unresolved inputs for the first baseline review, not blockers to writing this blueprint:

- Confirm the exact three site domains. Earlier context names `doitwithai.tools`, `sufianmustafa.com`, and LIONXE (`lionxe.com` or `lionxeframework.com`); the latest speech transcription rendered different spellings. Record verified domains only after checking actual links/accounts.
- Identify each current Git repository, branch, Vercel project, Sanity project/dataset or other CMS, and whether the site is active. LIONXE can be registered while development is paused.
- Confirm whether the latest V27.12 archive matches deployed Voxfolio and whether SQL migration 017 was applied. Run `pnpm install`, `pnpm typecheck`, `pnpm test`, `pnpm build` and the V27.12 manual acceptance flow in the real checkout.
- Verify the prior AI workforce dashboard's latest code against its older boilerplate ZIP; do not assume all n8n, Sanity or Pinterest integrations are complete.
- Create a Nebius Token Factory account/key, choose an available NVIDIA model ID from the live account, verify a runtime response and inspect usage/credits. Keep API secrets out of docs and repo.
- Decide name/logo through a separate naming review. Do not rename code/database routes as part of an unverified brand hypothesis.
- Confirm the hackathon track and permitted public-source scope before releasing a repository; the official rules require a working demo, licensed public source, README, short public video, feedback and a written account of significant new work on an existing project.

## 10. Research anchors and limitations

The official hackathon rules define the runtime Nebius/NVIDIA requirement, submission artifacts and judging criteria: <https://nebiusglobalaihackathon.devpost.com/rules>. Token Factory tool calling: <https://docs.tokenfactory.nebius.com/ai-models-inference/function-calling>. GitHub App repository permissions: <https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party>. Sanity authenticated document mutations: <https://www.sanity.io/docs/http-reference/mutation>. These show the feasibility of connectors, not that a customer's deployment is connected or that an exact model/tool combination has passed testing.

This blueprint is a planning artifact. It authorizes no account connection, live publication, repository merge or hackathon submission by itself. Those actions are tracked in the implementation/approval workflow when actually requested.
