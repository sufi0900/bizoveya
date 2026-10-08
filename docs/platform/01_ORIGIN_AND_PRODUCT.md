# Origin, product and market

## 2026-10-08 evolution update — planned direction

The product direction is a founder-led digital agency with assistant/HR coordination, general hireable specialists and later private custom roles. A visual office and voice entry are proposed interfaces over reliable workflows. Current scope remains private text/visual drafts; customer demand and commercial quality are not proven by one successful pilot.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

## Current contract — package1.17 / P04.0

P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

Live tests default off. Explicit operator setup requires the selected private provider key plus an admin-only SUPABASE_SERVICE_ROLE_KEY for server-attested result recording, then BIZOVEYA_ENABLE_MODEL_TESTS=true and per-request pricing/charge acknowledgement. No secret-entry form exists. Named current admin+AAL2 is required; client roles cannot mark results passed. Additive030 enforces one running test and five attempts per UTC day platform-wide, durable request IDs, expiry/unknown states and version-sensitive evidence. Failures/unknown attempts still consume the attempt allowance and may be billed. Existing dailyBudgetCents remains planning metadata; monetary enforcement precedes customer runtime.

Read36_MODEL_CONNECTIVITY_AND_TESTING.md for exact setup, supported evidence and MT087–094. All1.16 tests and earlier unevidenced founder gates stay pending; the founder is currently testing and has supplied no new pass results. Preserve001–029 and historical files. One cumulative ZIP/repository and the same two Vercel roots. No hosted SQL/deploy/provider request was performed by the assistant. Next implementation dependency: reviewed exact-model evidence, agent/profile binding, enforced monetary limits and durable draft runs, then visual output composition. The35 draft-only pilot and34 Studio/removal scope remain in force; publishing remains deferred.

Earlier release contracts below are historical and superseded where they conflict with this current contract.


## Historical contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Historical contract — package1.9 / P02.2

The founder approved the business-template research and instructed implementation on 2026-10-02 00:31:45 PKT. Bizoveya remains a multi-site business workspace with future approved agent operations. Modular website building is foundational usability, not a claim of unique market leadership. Wix already documents site, marketing and phone agents. Target the first three business workflows through Professional Practice, Local Services and Creative Business presets; validate demand with actual owners before calling them the most popular.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

The commercial transition is now visible in source: Bizoveya owns the public homepage; inherited Voxfolio Studio remains reachable at `/portfolio`. Businesses can try a service template and save a private site draft within a workspace. This is the first bounded business builder slice, not the completed digital agency. Name and B-letter mark remain provisional.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.1; evidence labels apply.**

## Origin and evolution

**Verified in code/history:** Voxfolio was built for an AssemblyAI voice competition as a voice-directed 3D portfolio builder. The V27.12 checkout has authenticated projects, guided voice/text onboarding, portfolio templates, Studio, structured pages/blog/posts, revisions, published snapshots, shares and Visitor Vox. Migrations 001–017 exist. V27.12 addresses template confirmation and voice draft creation; its own release note records pending full build and live checks. See the archived release history. The old agency/workforce dashboard is a separate earlier experiment, not present as an integrated module in this checkout.

**Reported by owner:** The direction changed from (a) adding business templates and chat to Voxfolio, to (b) connecting customer websites and serving visitors, to (c) a multi-site digital operations workspace with supervised AI employees, meetings, content workflows and later WhatsApp/voice. Earlier discussions include a Sanity/Pinterest workforce dashboard and a ChatGPT-first pivot. Reuse requires current code audit; none is assumed complete here.

## Product thesis

**Proposed:** Bizoveya gives a business one workspace to create a native site **or connect its existing site**, supply approved business knowledge, delegate bounded digital work, inspect decisions and results, and review any publish/customer-facing action. Voxfolio's portfolio experience remains a supported native site type. The system should support more than one site per workspace; practical usage limits and billing are undecided.

| Audience | Immediate job | First useful outcome |
|---|---|---|
| Owner without a site | Establish a credible business presence | Publish a responsive service website with approved facts and contact path |
| Owner with a site | Improve without rebuilding or losing source of truth | Connect CMS/repo/deploy status; approve a reversible content draft |
| Multi-site operator | Keep brands and tasks separate | Site-scoped context, task history and permissions |
| Sufian's first-party workspaces | Validate real constraints | Manage Do It With AI Tools, Sufian Mustafa and LIONXE separately |

**Commercial aim, not proven demand:** Start with business website and supervised content/service workflows; sell a useful outcome rather than a portfolio template. Validate through real onboarding and customer conversations before asserting willingness to pay. Near-term service interests include business sites, website assistants and SEO/content; WhatsApp and phone agents are later integrations. Success candidates: owner completes onboarding, first draft approved and published without unintended changes, repeatable task trace, relevant lead or content outcome, cost per completed task and retention. Targets need baseline measurement.

## Scope boundaries

Native publishing remains governed by its revision/snapshot path. Connected sites remain owned by their existing CMS/repository/hosting unless owner chooses migration. Platform state is authoritative for tasks, approvals and audit; external CMS stays authoritative for its content. Human approval governs material external changes. AI output is a proposal until verified. No promise of free model/telephony/WhatsApp usage, universal CMS editing or unlimited capacity. Agent meetings do not imply free-form unsupervised access. Commerce, marketplace and autonomous multi-channel publishing are deferred pending proof.

## Naming and positioning

Bizoveya (*biz-oh-VAY-ah*) is a **working** commercial label inspired by “business” and “via,” a path through connected digital work. It is not an acronym and has not passed domain/trademark clearance. Voxfolio remains the historical product/code identity until an explicit migration ADR. Logo and visual system await owner review; see `09_DESIGN_AND_BRAND.md`.

## Founder research pause and commercial response (package 1.2)

After the 1.1 dashboard work, Sufian Mustafa paused feature development to assess Muse competition and whether a managed agent could supply Bizoveya's backend. The resulting question/answer/correction history is in [17_DISCUSSION_AND_DECISION_RECORD.md](17_DISCUSSION_AND_DECISION_RECORD.md). The founder now directs documentation of configurable agents, provider choices, protected credential management and super admin operations; these are planned, not delivered product features.

Positioning should demonstrate a concrete business result with existing-site integration, scoped knowledge, transparent review and recoverable execution. General agents compete with basic drafting/scheduling; meetings, memory or a dashboard alone do not prove uniqueness. No claim is made that customers cannot switch or that revenue is secured. Compare alternatives through real task quality, permission control, operating effort and total cost; customer interviews and repeat use remain validation needs. Do not depend on personal Muse account inheritance or promise universal channel access.

## Package 1.3 transition and impact synchronization

The transition remains an extension of the inherited app. Package 1.3 prepares dependencies and routes; no workspace/business feature has been implemented. Preserve the historical Voxfolio narrative while Bizoveya evolves.

## Package 1.4 — first practical workspace implementation

Bizoveya now has its first workspace/site foundation in application code, extending rather than rebuilding Voxfolio. Users can create separate workspaces, register multiple public URLs, link owned portfolios, and keep a future business-site planning record. The inherited editor/publication system remains available. No business template renderer, connected-site writer, AI workforce or commercial launch is claimed. Package metadata becomes `bizoveya-platform@1.4.0`; ZIP delivery is 1.4, independently of old Voxfolio numbering.

## Package 1.5 — platform administration begins

Bizoveya now includes the source for an operator control shell, aggregate registry counts, authenticator verification and role-change history. This extends the inherited application; it does not replace the portfolio builder or implement the AI agency. No commercial launch, live admin acceptance or production deployment is asserted. Application metadata is `bizoveya-platform@1.5.0`.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
