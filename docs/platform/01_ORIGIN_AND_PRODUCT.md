# Origin, product and market

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

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
