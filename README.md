# Bizoveya1.19 — spending controls

Current cumulative source, P04.3.2. Read [spending setup and tests](docs/platform/39_SPENDING_CONTROLS_AND_TESTING.md). If001–031 are applied, apply only032. Admin: `pnpm dev:admin`, port3001; public: `pnpm dev:web`, port3000. Preserve local environment settings and run `pnpm install --frozen-lockfile` after checkout. New model tests require an enabled reviewed pricing policy; saving pricing makes no AI call. Customer draft generation and publishing remain disabled.

GitHub delivery uses `phase/p04-3-2-spending-controls` and a review PR; main remains unchanged. Founder reported all1.18 assignment tests passed; new MT102–109 pending. Historical release notes below are retained, not current delivery status.

## Historical release1.18

# Bizoveya 1.18 — reviewed agent model assignments

Apply migration031 only after030. Read docs/platform/37_AGENT_MODEL_ASSIGNMENTS.md for manual steps. GitHub writes are blocked and the six-hour task is paused: see38_DELIVERY_AND_CONTINUATION.md. Source includes cumulative1.17 fixes. Model assignments do not yet activate customer draft generation.

# Bizoveya1.17 — Model connectivity tests

P04.0 adds /admin/model-tests on the separate admin application. Read docs/platform/36_MODEL_CONNECTIVITY_AND_TESTING.md before setup. Apply only030 if through029 is confirmed; preserve old migrations. Update the complete repository and rebuild both existing Vercel projects using the new pnpm lockfile. Tests default disabled. Actual paid connectivity tests require explicit setup/acknowledgement and an admin-server recording key; no actual provider call was performed during development. Customer agent execution remains planned.57 living Markdown documents project to /bizoveya/docs.30 retains all pending founder checks, including1.16.

## Historical delivery notes

# Bizoveya 1.16 — Studio repairs and site removal

P02.5 improves the digital-service business Studio and adds owner-only permanent site-record removal. Read `docs/platform/34_STUDIO_REPAIR_AND_SITE_REMOVAL.md` for installation, scope and manual cases MT075–086. Read `35_DRAFT_PILOT_AND_FOCUSED_BUILDER.md` for the next draft-only agent pilot and starter knowledge. All pending founder checks are combined in `30_COMBINED_PENDING_SETUP_AND_TESTS.md`.

If migrations001–028 are confirmed applied, apply only `supabase/migrations/029_business_studio_and_site_removal.sql`, once and in full. Never apply tests or fixture SQL to production. Keep the complete repository and redeploy both existing Vercel projects, rooted at `apps/web` and `apps/admin`. No new environment variable or model key is required for this release. From the repository root: `pnpm install --frozen-lockfile`, then `pnpm dev:web` (3000) or `pnpm dev:admin` (3001). Preserve private environment settings.

55 living Markdown documents project automatically to `/bizoveya/docs`. New saves enforce Hero/FAQ order and hero text limits; old content is not silently rewritten. Samples are illustrative, require confirmation and are never automatically saved or published. Deletion removes native Bizoveya site data; external websites and original portfolio projects remain intact. Live agents, separate business pages and media uploads remain planned. Local automated verification does not replace founder/hosted acceptance.

## Earlier delivery descriptions

# Bizoveya1.15 — Model profiles and credential references

P04.2.1 candidate metadata/admin preparation only. No live model/profile-agent binding/actual key writes. Read docs/platform/00_INDEX.md,30 combined pending checklist and33 model guide. Apply missing028 after confirmed027. Same repository/two Vercel roots apps/web/apps/admin; all packages retained. Optional server provider keys only in private deployment settings; none needed for safe missing-key tests.52 Markdown sources project to /bizoveya/docs. Real hosted/founder acceptance remains pending.

## Historical deliveries

# Bizoveya1.14 — Agent configuration and readiness

Cumulative P04.1 source: separate-admin versioned defaults/check/review/preview rollback/revoke/history and private site preferences/approved context preview. No live models, credentials or tool execution. Source verified locally; all unevidenced founder/hosted acceptance stays pending.

Read docs/platform/00_INDEX.md and30_COMBINED_PENDING_SETUP_AND_TESTS.md. New guide32_AGENT_CONFIGURATION_AND_READINESS.md; additive027 only after confirmed026. Same GitHub repository, same Vercel roots apps/web and apps/admin; include new packages/agent-contract and workspace/lock files. Rebuild both apps.50 current Markdown documents automatically project to /bizoveya/docs. Do not paste tests/tools fixtures into production. No new env/key required. Preserve private environment and Git/local changes.

## Historical delivery descriptions

# Bizoveya 1.12 — Expanded business templates

## Current delivery — Bizoveya1.13 / P03.1

Private site knowledge via text/TXT/MD, fact review/owner approval, scoped lookup, history/export/removal. No AI key/model/agent runtime. Same two app roots. All founder manual actions remain pending: docs/platform/30_COMBINED_PENDING_SETUP_AND_TESTS.md. New knowledge guide31; apply only missing026 after reconciling001–025.48 living docs at /bizoveya/docs. Previous source/history preserved; evidence docs/delivery/P03.1_VERIFICATION.json.

Six business design families, shared Studio/sections and saved snapshot publishing. Current phase P02.4 source; founder manual acceptance pending.

Start with [combined setup and pending tests](docs/platform/30_COMBINED_PENDING_SETUP_AND_TESTS.md) and [template guide](docs/platform/29_EXPANDED_BUSINESS_TEMPLATES.md). One cumulative ZIP/repository; same Vercel roots apps/web/apps/admin. Apply only missing023/024/025 in order. No new env/key required. Preserve private configuration and Git/local changes.

46 current MD sources visualize under /bizoveya/docs; current evidence is docs/delivery/P02.4. New template designs do not add booking, payments, student portals, enquiry inboxes, domains or agents.

## Previous delivery history

# Bizoveya 1.11 — Business publication snapshots

Current source: **P02.3.1**. Read [publishing setup and manual tests](docs/platform/28_BUSINESS_PUBLISHING_AND_TESTING.md). Apply only missing migrations: if001–022 are applied,023 then024; if023 already applied, only024. Keep the same repository and Vercel roots apps/web/apps/admin; preserve private environment values.

Saved native drafts can be explicitly published to `/sites/<site UUID>`, republished and taken offline. Draft saves remain private; hidden sections are excluded from anonymous payloads. Email/call contact links and snapshot metadata are included; custom domains, enquiry forms and agents remain planned. Founder1.10 and1.11 manual acceptance is pending.

Current evidence: docs/delivery/P02.3.1.43 current MD documents render under `/bizoveya/docs`.

## Previous delivery history

# Bizoveya 1.10 — customer journey and template fixes

Current delivery: **Bizoveya1.10 / P02.2.Fix-1**. Start with [release setup and manual tests](docs/platform/27_CUSTOMER_JOURNEY_QA_AND_RELEASE.md). Existing DB through022: apply only023 once. Merge cumulative source; public/admin Vercel roots remain unchanged.

See the release guide above for current setup, limitations, verification evidence, and pending hosted manual checks.

## Historical 1.9 delivery notes

One cumulative repository/ZIP, two Vercel apps. Three business presets share eight section types/nineteen layouts, brand/contact facts and the same Studio. Existing portfolio remains `/portfolio`; separate admin unchanged. Business sites remain private drafts; publishing and agents are planned.

**Manual action:** if001–021 applied, apply only [022](supabase/migrations/022_modular_business_sections.sql) once in the shared Supabase project's SQL Editor. If021 missing, apply021 first after prerequisites. No new env/API keys. Keep old migration files. Read [setup/manual testing](docs/platform/25_BUSINESS_BUILDER_AND_TESTING.md), [section specification](docs/platform/26_BUSINESS_TEMPLATES_AND_SECTIONS.md), [deployment](docs/platform/24_DEPLOYMENT_AND_ENVIRONMENTS.md) and [current index](docs/platform/00_INDEX.md).

Merge preserving Git/private env/local changes. Existing Vercel roots apps/web and apps/admin stay. Rebuild main app for updated docs/routes. Try `/templates/service-studio`, `/templates/local-services`, `/templates/creative-business`; saved native-business editor supports design choice. Demos reset on reload. Evidence is under docs/delivery/P02.2.

```sh
pnpm install --frozen-lockfile
pnpm dev:web
# Separate terminal:
pnpm dev:admin
```

These historical1.9 instructions are superseded by the1.10 release guide above. Source implementation is not live deployment or hosted database acceptance.

# Bizoveya1.8 — business entry and private draft builder

One Git repository, one cumulative ZIP, two Vercel applications. Public root is now Bizoveya; inherited portfolio demo is at `/portfolio`. Try `/templates/service-studio` without an account, then save your own native-business draft from a workspace. Business publishing and AI workforce remain planned.

**Manual action:** reconcile Supabase history and apply only missing `supabase/migrations/021_business_drafts.sql` after001–020. No new environment keys. Read [setup and test checklist](docs/platform/25_BUSINESS_BUILDER_AND_TESTING.md), [deployment guide](docs/platform/24_DEPLOYMENT_AND_ENVIRONMENTS.md), [manual evidence](docs/platform/23_FOUNDER_MANUAL_TESTING.md) and [current index](docs/platform/00_INDEX.md). Keep Vercel roots `apps/web` / `apps/admin`; no new repository/project required. Preserve private env files and current Git changes when merging this cumulative source.

```sh
pnpm install --frozen-lockfile
pnpm dev:web
# Second terminal:
pnpm dev:admin
```

Local public port3000, admin port3001. Optional SQL verification remains under tools/phase1-verification. Do not paste tooling fixtures into production. Local reports/screenshots are in docs/delivery/P02.1; real Supabase saved-draft/MFA/tenant tests remain pending.

Earlier README sections below are retained history. Current1.8 instructions and document25 supersede conflicting entry/capability/setup descriptions.

# Bizoveya1.7 — public and admin applications

One repository, one full ZIP, two separately deployed Next.js apps. Start here: [Deployment and manual setup](docs/platform/24_DEPLOYMENT_AND_ENVIRONMENTS.md), [Admin operator setup](docs/platform/21_ADMIN_SETUP_AND_RECOVERY.md), [Founder tests](docs/platform/23_FOUNDER_MANUAL_TESTING.md).

```sh
pnpm install --frozen-lockfile
pnpm dev:web
# Second terminal at repository root:
pnpm dev:admin
```

Main site localhost:3000; admin localhost:3001. Put private env files in their respective apps. Public /admin and /api/admin/* are absent and return404. Admin root opens its own login; no signup/docs/customer pages. Vercel: same Git repository imported as two projects, Root Directory apps/web and apps/admin. Main docs stay public. No new SQL migration for1.7; reconcile/apply only missing001–020. Operator grant and real MFA still required. Domain/DNS provisioning is manual; this archive does not deploy a subdomain. Read document24 before deployment, including the required change to your existing project's root directory.

The source moved from root src to apps/*/src. Older README instructions below are preserved historical baseline; current installation commands above and document24 supersede them. No grand phase marked accepted.

# Bizoveya1.6 — Phase1 verification and hardening

Full cumulative package: `Bizoveya_1.6_Phase1-Verification-and-Hardening.zip`. This delivery fixes admin revocation after account soft deletion (new migration020) and stale release/document-count labels in the visual docs room. It adds repeatable local SQL/browser checks, not a new production backend or AI feature.

Read [current index](docs/platform/00_INDEX.md), [verification guide](docs/platform/22_PHASE1_VERIFICATION_GUIDE.md), [admin operator runbook](docs/platform/21_ADMIN_SETUP_AND_RECOVERY.md) and [phase gates](docs/platform/10_PHASES_AND_STATUS.md). Review/apply020 only after reconciling staging migration history. Existing source/dependencies/history are preserved except the recorded fixes. Live Supabase/Auth/MFA and owner acceptance remain pending.

Optional local SQL suite: `npm ci --prefix tools/phase1-verification`, then `npm run test:sql --prefix tools/phase1-verification`. Never apply tooling fixtures to a remote database. Browser setup/commands and limits are in guide22. Evidence lives in `docs/delivery/P01.6/`; exact inventory in `P01.6_VERIFICATION.json`. The public docs room automatically reflects all32 current Markdown sources after rebuild.

---

# Bizoveya 1.5 — Admin identity and control shell

Complete cumulative source package: `Bizoveya_1.5_Admin-Identity-and-Control-Shell.zip`. Stable work item P01.4 extends the 1.4 workspace foundation. Start with [current docs](docs/platform/00_INDEX.md), [phase gates](docs/platform/10_PHASES_AND_STATUS.md) and the new [admin setup/recovery runbook](docs/platform/21_ADMIN_SETUP_AND_RECOVERY.md). Pages: `/admin`, `/admin/security`, `/admin/audit`. Configure and verify staging migrations018–019 and explicit operator grant before use; nothing was remotely applied. Live MFA/DB/browser acceptance remains pending. Existing portfolio/workspace source and history are preserved.

The public `/bizoveya/docs` room reflects the31 current Markdown documents on rebuild. Version1.5.0 changes package metadata only; dependencies are unchanged. Local verification is in `docs/delivery/P01.5_VERIFICATION.json`.

---

> **Current package: Bizoveya 1.4 — first practical workspace/site foundation (stable work P01.3).** Open `/workspaces` after configuring the existing Supabase settings and applying additive migration 018 in staging. Six workspace pages and four protected API files support workspace creation, external URL registration, owned portfolio links, business planning records and version-checked metadata updates. Workspace owner/editor/viewer roles do not confer platform-admin or legacy portfolio editor access. Business templates, account connectors, agents and admin tools remain planned.

> **Setup and acceptance:** Read [the living user manual](docs/platform/13_USER_MANUAL.md), reconcile applied migrations 001–017, then apply [`018_bizoveya_workspaces.sql`](supabase/migrations/018_bizoveya_workspaces.sql) and run [`018_workspace_acceptance.sql`](supabase/tests/018_workspace_acceptance.sql) in staging. No production migration/deployment was performed. Local test suite passes (42 files / 214 tests); real Supabase/RLS/browser/owner acceptance remains pending. Review [verification](docs/platform/11_VERIFICATION_AND_RELEASE.md) and the delivery JSON for exact checks. Code requires the existing environment/lockfile setup; the ZIP does not contain node_modules, secrets or compiled output.

> **Living documentation:** All 30 current Markdown files project through `/bizoveya/docs`. Update every affected spec/manual/route/impact/log alongside future code. Below are earlier package and inherited Voxfolio notes retained as history, not current capability claims.

> **Current package: Bizoveya 1.3 / P01.3-Plan — documentation only.** Read [dependency/change-impact register](docs/platform/19_DEPENDENCIES_AND_CHANGE_IMPACT.md), [exact route/transition inventory](docs/platform/20_ROUTE_AND_TRANSITION_REGISTER.md) and [ADR-0003](docs/platform/decisions/ADR-0003-transition-and-dependency-traceability.md). The first practical implementation extends workspace/site tenancy and real frontend/backend together while preserving Voxfolio behavior. Workspace/admin features remain planned; source/SQL/dependencies are unchanged. All 30 current Markdown files appear through the existing `/bizoveya/docs` build. Prior package notes below remain historical context.

> **Bizoveya package 1.2 / phase P01.2 (documentation synchronization):** This is the new platform documentation and source baseline. Voxfolio V27.12 is an inherited, concluded project, not Bizoveya version 12 or migration 017. Prior release history is in [`docs/history/voxfolio-v27-and-earlier/`](docs/history/voxfolio-v27-and-earlier/). Living platform specifications are maintained in [`docs/platform/`](docs/platform/). Working commercial name: Bizoveya (provisional); Voxfolio remains the codebase and historical product name.

> **Bizoveya working documentation:** Start with [`docs/platform/00_INDEX.md`](docs/platform/00_INDEX.md), then read `PACKAGE_VERSIONS.md`, the completed-work snapshot and chronological activity log. The prelaunch manual, presentation source, and visual document dashboard are available at `/bizoveya/docs` in the application; source files remain under `docs/platform/`. The prior standalone PDF and proposed separate Sites portal were superseded by the owner’s in-app direction. These are living first drafts. For any new ZIP or checkout, inspect the complete current code and all platform Markdown files before implementation; update affected documents with each code change.

> **Package 1.2:** Founder Muse/SDK/model/API/admin discussion recorded in [`17_DISCUSSION_AND_DECISION_RECORD.md`](docs/platform/17_DISCUSSION_AND_DECISION_RECORD.md); protected backend/admin plan in [`18_BACKEND_AND_ADMIN_CONTROL.md`](docs/platform/18_BACKEND_AND_ADMIN_CONTROL.md); planning decision in [`ADR-0002`](docs/platform/decisions/ADR-0002-configurable-agents-and-admin-control.md). Application source, dependencies and SQL are unchanged. The existing visual room rebuilds all current Markdown. Super admin/credential management remains planned; workspace-shell reservation moves from P01.2 to P01.3 explicitly.

> **V26 cumulative update:** read [RELEASE_V26.md](docs/history/voxfolio-v27-and-earlier/RELEASE_V26.md) for required migration 016, setup, changes and manual acceptance tests. Implementation details: [V26_ARCHITECTURE.md](docs/history/voxfolio-v27-and-earlier/V26_ARCHITECTURE.md). Earlier milestones below are historical.

# Inherited Voxfolio application README (historical baseline)

For V24.2 setup, migration 015 and the manual test checklist, read [RELEASE_V24_2.md](docs/history/voxfolio-v27-and-earlier/RELEASE_V24_2.md) before enabling persistent Visitor Vox knowledge.

An implementation-ready portfolio builder in which authenticated cloud projects, manual editing, and AssemblyAI voice tools use the same validated, reversible command pipeline.

## Included in this milestone

- Next.js App Router and strict TypeScript
- Versioned, schema-validated portfolio document
- Manual content, design and 3D scene controls
- Shared command bus with bounded tokens and validation
- Undo, redo and browser persistence
- Reusable React Three Fiber `OrbitalShowcase` scene
- Three scene presets, three motion modes and four colour systems
- Clickable 3D skill nodes
- Reduced-motion and WebGL error fallback
- AssemblyAI Voice Agent browser integration
- Single-use temporary tokens issued server-side
- Live user/agent transcript and spoken output
- Client-side voice tools mapped into the command bus
- Explicit end-session control and interruption cleanup
- Automatic provider-session soft deletion after a clean call ends
- Unit tests for validation and reversible commands
- Supabase email authentication and PostgreSQL project storage
- Guided Creation and Choose a Template entry paths
- Owner-only row-level security and immutable project revisions
- Optimistic revision protection against cross-tab overwrites
- Governed PDF, DOCX and TXT CV ingestion
- Explicit candidate review and approval before CV facts enter a portfolio
- Saved fact provenance without retaining the original CV file
- Optional OpenAI layout-aware CV extraction with strict structured output
- Grounding validation, timeout protection and automatic local-parser recovery
- Buffered studio text editing with five-second idle commits
- Editable featured skills and project names
- Accessible loading feedback and a site-wide readability pass
- Actionable AI fallback diagnostics for keys, quota, models and timeouts
- Five-turn CV-grounded design interview with governed goal, audience, tone, motion and emphasis decisions
- Immutable publication snapshots and public `/p/[slug]` portfolio routes
- Visual revision timeline with non-destructive restore controls
- Session-aware homepage, guest-draft claiming and publication-aware project dashboard
- Authenticated Studio identity and direct Home/My Projects navigation
- Full About, Experience, Skills, Projects and Contact section model
- Section ordering, visibility and shared Studio/public rendering
- Voice editing parity across every portfolio content section
- Fact-preserving OpenAI copy refinement for raw narrative input
- Optional skills and education during Guided Creation
- Owner-scoped headshot uploads, responsive About media and dynamic favicons
- Identity-led public navigation without editor or publishing controls
- Expanded project case studies with role, period, challenge, approach and outcome fields
- Reusable, accessible project media library with owner-scoped uploads
- Ordered project galleries and project-card cover imagery
- Public case-study routes at `/p/[slug]/projects/[project-slug]`
- Case-study metadata and social preview imagery derived from immutable publication snapshots
- Private custom-page and blog-post drafts with explicit publication status
- Structured heading, paragraph, quote, list and reusable-image blocks
- Editable public slugs, navigation labels, excerpts, tags and SEO metadata
- Immutable public page, blog-index and article routes
- Voice-assisted page/post drafting without voice publication authority
- Direct in-context image uploads with editable alternative text
- Safe rich-text formatting, hyperlinks, bullet lists and numbered lists
- Section-aware live previews and flexible resizable Studio panels
- Dedicated public Projects index and concise four-card homepage showcase
- Viewport-bounded Studio canvas with synchronized homepage and standalone-page navigation
- Deterministic container-relative section routing without standalone-preview flicker
- Inline block insertion, drag/long-press reordering and semantic H2–H6 headings
- Live SEO guidance with search-result and canonical-path previews
- Performance-safe cinematic depth across homepage sections and standalone content
- Five content-preserving reusable portfolio templates, including the non-orbital Kinetic Gallery and bright Velocity Atelier
- Orbital Showcase, Constellation Field, Kinetic Gallery and Velocity Roadster 3D scene families
- Responsive desktop-expanded editor and adaptive media gallery
- Voice/text assistant navigation that focuses the matching Studio editor and Live Canvas section
- Gemini-first intent planning and fact-preserving copy refinement with OpenAI recovery
- Paste-friendly assistant chat, automatic transcript following and optional interaction sounds

## Setup

Requirements: Node.js 20.9+ and pnpm.

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Add your private key to `.env.local`:

```dotenv
ASSEMBLYAI_API_KEY=your_private_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key
OPENAI_API_KEY=your_private_openai_key
OPENAI_CV_MODEL=gpt-5-mini
OPENAI_CONTENT_MODEL=gpt-5-mini
GEMINI_API_KEY=your_private_gemini_key
GEMINI_CONTENT_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
NEBIUS_API_KEY=your_private_nebius_key
NEBIUS_MODEL=the_exact_model_id_from_your_nebius_account
OPENROUTER_API_KEY=your_private_openrouter_key
OPENROUTER_MODEL=the_exact_model_slug_you_enabled
OPENAI_CV_TIMEOUT_MS=60000
```

`GEMINI_FALLBACK_MODEL` is used after bounded retries for retryable Gemini failures. `OPENAI_API_KEY` is an optional second-provider fallback for assistant planning and writing refinement. Navigation, undo, exact-text replacement, skill addition, and complete social-link addition are local deterministic commands and remain available without either writing provider. Gemini HTTP 429 indicates a project rate/quota condition; HTTP 503 is treated as temporary provider unavailability. Assistant conversation history is stored per project in the browser so a recoverable provider failure does not clear the chat.

Create a Supabase project, then run the SQL files in order: `supabase/migrations/001_projects.sql` through `009_professional_memory_agent_events.sql`. If you have already applied `001`–`008`, run only `009_professional_memory_agent_events.sql` before deploying V21. It creates private owner-approved memory and metadata-only agent events. The new model keys are optional and server-only: supply both key and exact model ID for each chosen provider. The planner tries configured Nebius, OpenRouter, Gemini, then OpenAI. AssemblyAI continues to power the live spoken session; the gateway handles typed planning, opportunity planning, and both spoken and typed copy refinement. Published media URLs are intentionally public. Drafts and revision history remain owner-only. Never expose a service-role key.

Routes: `/` is the no-account demo, `/start` offers both creation paths, `/login` handles accounts, `/projects` lists saved work, and `/studio/[projectId]` opens the cloud-saved editor.
The homepage is lifecycle-aware: guests receive an editable local demo and authenticate only when choosing Save & publish; signed-in owners with projects open their latest cloud project directly. `/claim` validates and moves a guest draft into private cloud storage before publishing. `/projects` exposes separate editing and live-portfolio actions. V12 adds governed custom pages and blog publishing; older documents receive compatible defaults. See `docs/history/voxfolio-v27-and-earlier/ROADMAP.md` for the completed milestone history and major/sub-version rules.

To create standalone content, open Studio → Content → Site pages. Use this area for long-form pages such as a detailed About page, Services, Process or Resources. Open Blog posts for articles; published articles are collected automatically on one Blog page and never become individual navigation tabs. Add an item, set its slug and metadata, then assemble typed content blocks. The item title is its only H1; structured headings support H2 through H6. Paragraphs, quotes and list items support safe inline formatting. Use the inline plus control after any block to insert content at that exact position. Reorder blocks by desktop drag, touch/pen long-press, or the accessible arrow controls. Images can be uploaded directly inside the cover or image block without completing alternative text first. Voxfolio derives a temporary accessible label from the filename, and the owner can replace it immediately in the visible Alt text field.

An item becomes publicly accessible only after two explicit actions: include the Site Page or Blog Post in the next publication, then use the main Publish control to create a new immutable portfolio release. Included Site Pages appear in public navigation at `/p/[portfolio-slug]/pages/[page-slug]`; a page using the `about` slug is also linked from the homepage About section. Included articles are collected at `/p/[portfolio-slug]/blog`, and projects are collected at `/p/[portfolio-slug]/projects`. Public routes always read the immutable release snapshot, so later drafts remain private. Voice can help draft or edit text blocks, but only the owner-facing interface can upload images or change publication status.

The Studio live canvas has its own bounded scrollbar. Selecting Hero, About, Experience, Education, Skills, Projects or Contact targets the exact section inside that canvas and leaves the corresponding editor controls visible. Opening a Site Page or Blog Post swaps the canvas to that standalone draft without a homepage flash; use **Back to homepage preview** or select any homepage section from the Editing menu to restore and position the homepage canvas. If an About Site Page exists, the homepage preview exposes **Preview detailed About**, while the published homepage exposes **Read full profile** after that page is included and the portfolio is republished.

V12.4 adds cinematic depth to non-Hero content using GPU-light CSS layers rather than creating a separate WebGL canvas for every section. This preserves the existing Hero scene, mobile responsiveness, reduced-motion preferences and WebGL fallback while avoiding multiple graphics contexts and unnecessary battery use.

V13 separates portfolio content from presentation. Open Design to switch between Cinematic Orbit, Architectural Grid and Editorial Depth; identity, sections, case studies, media, pages and posts remain intact. Open 3D Scene to choose Orbital Showcase or Constellation Field independently. Only one scene canvas is mounted at a time. Expanding the Content editor now activates a bounded desktop workspace with larger media, multi-column forms and an adaptive Media Library rather than stretching the sidebar controls.

V14 turns that foundation into a release-gated workspace. Expanded editing is editor-only, Preview mode removes all layout customization handles, homepage structure supports exact drag/long-press ordering, voice can request the same validated placement, and template selection includes a responsive preview. Production discovery metadata, security headers and a bundle-budget check are included; run the complete acceptance commands in `docs/history/voxfolio-v27-and-earlier/MILESTONE.md` before deployment.

V15 completes the publishing experience. Article-level Publish and Draft controls synchronize the immutable portfolio snapshot without a second top-level action, while a visible readiness checklist enforces complete article metadata and content. Studio and public navigation expose one Blog listing rather than one tab per article. Contact social profiles are governed, revisioned, voice-editable and rendered as accessible icons.

V16 adds Kinetic Gallery: a content-preserving, non-orbital cinematic template. Its central illuminated monolith and suspended skill panels use pointer-responsive depth instead of orbital controls. It is selectable during creation, in Studio Design, or through the allowlisted voice command, while reduced-motion and static WebGL fallback remain available.

V18 adds Velocity Atelier, a daylight automotive presentation built around a recognizable cinematic roadster rather than a labeled skills object. The vehicle sits in a warm architectural studio with moving roadway marks, rotating wheels, suspension motion, pointer-responsive lighting and a static fallback. Portfolio identity is presented in an editorial showroom card and the full content system continues below in a light theme. Aurora Archive is removed from the V18 selectable contract. Template and voice selection still preserve governed content and publication state.

To create a case study, open Studio → Content → Projects, complete the project narrative fields and use a unique slug. Upload images once in Content → Media library, then attach them to one or more projects. The first selected image becomes the project-card and case-study cover. Removing an item from the document library removes its references but retains the underlying Storage object for revision and publication recovery; automated retention cleanup is scheduled for the production-readiness milestone.

In Guided Creation, an authenticated user may optionally upload a PDF, DOCX or TXT CV up to 5 MB. Extraction proposes reviewable identity, role, summary, skill, education and experience facts. Candidates are unapproved by default; only checked facts are saved, together with a short source excerpt. The original CV is processed in memory and is not retained by Voxfolio. A five-turn interview then captures the portfolio goal, primary audience, visual tone, motion preference and presentation emphasis. Those answers configure only allowlisted design fields; they never rewrite professional claims.

AI-enhanced extraction is opt-in. When enabled, the server sends extracted CV text to the OpenAI Responses API with `store: false` for the fast path, requests schema-constrained facts, rejects facts whose excerpts are not grounded in locally extracted text, and merges missing fields from the deterministic parser. Scanned or image-only documents use file input as a visual recovery path. A timeout, incomplete response, API error, rate limit, missing key, invalid JSON or ungrounded response automatically returns safe local candidates instead of failing the upload, with a specific diagnostic shown in the interface. The structured-output budget leaves room for both model reasoning and the complete evidence-backed JSON result.

If AI extraction falls back, read the visible notice: it distinguishes a missing key, rejected key, exhausted/rate-limited quota, unsupported model/request, timeout, invalid structured response, ungrounded result, and provider connectivity. `OPENAI_CV_TIMEOUT_MS` defaults to 60 seconds for text-based CV analysis and may be set between 15,000 and 120,000 milliseconds; scanned documents receive a 90-second default. After changing `.env.local`, stop and restart `pnpm dev`; Next.js does not reliably reload server secrets into an already-running process.

Open `http://localhost:3000` in Chrome or Edge. Microphone access requires HTTPS or localhost.

Never prefix private AssemblyAI, Gemini or OpenAI keys with `NEXT_PUBLIC_`, commit `.env.local`, or paste any key into client code.

V19 makes Vox a synchronized multimodal editing assistant. Spoken and typed requests share the same allowlisted tools and validated command bus. Explicit navigation requests move both the Content editor and bounded Live Canvas; successful edits focus their affected section automatically. Gemini plans typed requests and is the primary fact-preserving copy refiner, while the existing OpenAI refinement path remains a recovery provider when configured. The transcript follows new messages automatically, pasted URLs are supported in text chat, and accessible sound cues can be muted from the assistant header. Keep `GEMINI_API_KEY` server-only and restart the dev server after changing it.

V19.2 completes the real-time conversation and publication state model. Vox now renders a visible listening/responding indicator, replaces the user's live utterance as AssemblyAI sends `transcript.user.delta`, and appends agent words from `transcript.agent.delta` in sync with speech. Typed replies reveal progressively as well. Individual pages and articles are compared with the immutable live snapshot, so editing a published item immediately marks it as having pending changes and re-enables **Publish changes**. The main Publish dialog now queues behind autosave and publishes the complete latest portfolio snapshot instead of blocking indefinitely on an unsaved draft.

V20 introduces opportunity variants for AI-native independent builders and makers. A canonical portfolio remains the approved evidence source. From **My projects**, create an Opportunity version with a title, audience and brief; Voxfolio creates a separate cloud project at revision zero, records its source revision, and lets the owner choose which existing case studies to feature. Variants have their own Studio, revision history, voice/text controls, publication state and public URL. They never automatically rewrite or silently refresh the canonical portfolio. Non-public variants emit `noindex`; signed/private sharing is a later hardening milestone.

## Voice commands to test

- “Switch the accent to violet.”
- “Give the portfolio a dark ink background.”
- “Center the hero section.”
- “Make the orbital scene more dynamic.”
- “Use the architect scene.”
- “Focus on AI automation.”
- “Update the Voxfolio project outcome to: A revision-safe portfolio publishing workflow.”
- “Move the Voxfolio project up.”
- “Change my introduction to: I build accessible AI-powered digital products.”
- “Undo that change.”
- “Go to the About section.”
- “Improve my introduction using these facts: …”
- Type “Add my TikTok profile” and paste the full URL when Vox asks for it.

Voice can update and reorder factual case-study content and draft structured pages or posts, but it is intentionally unable to publish, upload assets, execute arbitrary code or invent professional facts.

## Verification

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Architectural invariant

Every visible change is a typed command applied to a validated site document. Manual controls and voice tools cannot directly modify the Three.js scene, DOM or generated source code. Authentication, server persistence, governed CV ingestion, recovery-safe AI extraction, the design interview, immutable publishing and non-destructive revision restoration are active. Publishing snapshots a saved revision; subsequent edits and restored drafts stay private until explicitly republished.

## AssemblyAI integration notes

The server mints a single-use token immediately before each connection. The browser sends 24 kHz PCM produced by an AudioWorklet, receives transcripts and synthesized PCM audio, runs allowlisted client-side tools, and returns `tool.result` only at a safe turn boundary. Ending a session sends `session.end` before closing to avoid the billable resume grace period. After `session.ended`, the app asks its server to soft-delete the AssemblyAI session. If the network or browser terminates before that request completes, deletion cannot be guaranteed; production must add a scheduled server-side cleanup job.
