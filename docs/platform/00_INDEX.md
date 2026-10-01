# Bizoveya platform documentation — start here

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Bizoveya package 1.6 — Phase1 verification and hardening. Owner: Sufian Mustafa. Current grand phases: P00 baseline still open; P01.0 document room and P01.1 visual dashboard implemented, manual browser acceptance pending.** Commercial name Bizoveya is provisional; logo, domain, pricing and final positioning are undecided. Voxfolio V27.12 is the inherited code baseline. None of P00–P12 is accepted. This documentation is editable, never a frozen contract; later explicit owner instructions take priority.

## Mandatory cross-chat handoff

1. Obtain the **newest complete ZIP or Git checkout** from the owner. Read the whole archive inventory, application code relevant to the task, migrations, package metadata, README and release history; do not assume this ZIP is still latest. Compare with the current Git branch and deployed state before overwriting anything. Preserve `.git`, secrets and unpublished changes. If only a patch is supplied, request/locate its base and inspect the diff.
2. Read **every current Markdown file under `docs/platform/`**, then the relevant historical notes in `docs/history/`, especially the newest release. Read current ADRs. The documents are a map; the observed checkout, verified environment and latest user direction resolve conflicts.
3. Start from `PACKAGE_VERSIONS.md` for every delivered ZIP, `COMPLETED_WORK.md` for finished work only, `ACTIVITY_LOG.md` for chronological changes/reversals, `10_PHASES_AND_STATUS.md` for future and active phases, and `OPEN_QUESTIONS.md`. Identify actual implemented versus verified versus proposed behavior. Never infer acceptance from a checked box, copied release note or previous assistant's claim alone.
4. For every feature/fix, edit **all affected canonical documents, the user manual and presentation when customer-visible behavior changes, in the same delivery**: requirements, routes, architecture, data, agents, connectors, security, design, phase ledger, verification and hackathon as applicable. Record changed decisions in an ADR, append an activity-log event with actor/time/evidence, refresh the completed-work snapshot when warranted, add a row in the package register for each ZIP, add a changelog entry and include manual owner actions in the handoff. Update cross-references.
5. Deliver the full updated repository/archive or an attributable Git commit/patch including the updated documents. Do not silently erase historical requirements or release records. Never store keys, tokens or customer private data in documentation.

## Reading map and document ownership

| File | Canonical topic |
|---|---|
| [01_ORIGIN_AND_PRODUCT.md](01_ORIGIN_AND_PRODUCT.md) | History, goals, audience, scope |
| [02_REQUIREMENTS.md](02_REQUIREMENTS.md) | Requirement IDs and acceptance |
| [03_EXPERIENCE_AND_ROUTES.md](03_EXPERIENCE_AND_ROUTES.md) | Navigation, onboarding and routes |
| [04_SYSTEM_ARCHITECTURE.md](04_SYSTEM_ARCHITECTURE.md) | Components, flows, boundaries |
| [05_DATA_AND_MEMORY.md](05_DATA_AND_MEMORY.md) | Schema and retention |
| [06_AGENT_OPERATIONS.md](06_AGENT_OPERATIONS.md) | Employees, meetings, interrupts |
| [07_CONNECTORS_AND_SITE_MODES.md](07_CONNECTORS_AND_SITE_MODES.md) | Existing/native sites and adapters |
| [08_TECH_STACK_AND_SECURITY.md](08_TECH_STACK_AND_SECURITY.md) | Actual dependencies, proposed stack, security |
| [09_DESIGN_AND_BRAND.md](09_DESIGN_AND_BRAND.md) | UX design, templates, branding decisions |
| [10_PHASES_AND_STATUS.md](10_PHASES_AND_STATUS.md) | P00–P12 progress and owner actions |
| [11_VERIFICATION_AND_RELEASE.md](11_VERIFICATION_AND_RELEASE.md) | Test and acceptance evidence |
| [12_HACKATHON.md](12_HACKATHON.md) | Competition obligations and demo |
| [13_USER_MANUAL.md](13_USER_MANUAL.md) | Customer/officer guide; only accepted features can become live instructions |
| [14_OPERATING_RUBRIC.md](14_OPERATING_RUBRIC.md) | Internal action, claim and release decision rules (not legal terms) |
| [15_COMMERCIAL_PRESENTATION.md](15_COMMERCIAL_PRESENTATION.md) | Living visual presentation content in the app; earlier PDF withdrawn |
| [16_DOCUMENT_PORTAL.md](16_DOCUMENT_PORTAL.md) | In-app `/bizoveya/docs` implementation and update workflow |
| [PACKAGE_VERSIONS.md](PACKAGE_VERSIONS.md) | Exact ZIP filenames, 0.n/1.n versions, hashes and phase substeps |
| [COMPLETED_WORK.md](COMPLETED_WORK.md) | Only completed Bizoveya work and evidence; no future tasks |
| [ACTIVITY_LOG.md](ACTIVITY_LOG.md) | Dated activity, decisions, reversals, skips, actors and file/commit evidence |
| [CHANGELOG.md](CHANGELOG.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md), [PHASE_HANDOFF_TEMPLATE.md](PHASE_HANDOFF_TEMPLATE.md) | Document revisions, pending decisions and delivery format |
| [21_ADMIN_SETUP_AND_RECOVERY.md](21_ADMIN_SETUP_AND_RECOVERY.md) | Operator setup, metric meanings, MFA, audit and recovery gates |
| [22_PHASE1_VERIFICATION_GUIDE.md](22_PHASE1_VERIFICATION_GUIDE.md) | Local SQL/browser verification, regressions and evidence boundaries |
| `decisions/ADR-####-topic.md` | Major decisions, alternatives and reversal reason |

## Truth and status rules

Evidence tags: **Verified in code**, **Verified live**, **Reported by owner**, **Proposed**, **Blocked**, **Deferred**, **Superseded**. A code path is not live proof. Phase state: `[ ]` planned/blocked; `[~]` implemented but tests or owner acceptance pending; `[x]` accepted with evidence. The parent P00 remains `[ ]` while documentation and baseline checks are unfinished. Historical Voxfolio features do not count as Bizoveya phase completion.

Sources: current checkout > verified running system for observed behavior; current owner instruction for intended behavior > older docs; `docs/history/voxfolio-v27-and-earlier/` for prior evolution; the earlier [documentation blueprint](../history/planning/PROJECT_DOCUMENTATION_BLUEPRINT.md) records discovery assumptions; earlier agency material is owner context, not installed code. Reconcile conflicts openly through ADRs. See `OPEN_QUESTIONS.md` before assuming domain, credential, deployment or approval status.

## Package 1.2 discussion and planning update

Read [17_DISCUSSION_AND_DECISION_RECORD.md](17_DISCUSSION_AND_DECISION_RECORD.md) for the founder's development pause and D01–D08 Muse, model/API, SDK and super admin discussions; [18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md) for the protected configuration/credential/admin contract; and [ADR-0002](decisions/ADR-0002-configurable-agents-and-admin-control.md) for adopted planning direction and unresolved selections. This delivery changes documentation only. SDK/admin/vault features remain planned. P01.2 is documentation synchronization; the undelivered workspace shell moves explicitly to P01.3, followed by P01.4 admin identity/shell. Runtime/default-rule configuration follows P04 substeps.

In package 1.2, all 27 current Markdown files remained canonical and automatically included in `/bizoveya/docs`; no second document copy or manual menu is required. Rebuild/redeploy is needed to update the visual site. Read discussion and ADR corrections before proposing a provider or treating an earlier answer as an immutable requirement.

## Package 1.3 transition preparation

Read [19_DEPENDENCIES_AND_CHANGE_IMPACT.md](19_DEPENDENCIES_AND_CHANGE_IMPACT.md), [20_ROUTE_AND_TRANSITION_REGISTER.md](20_ROUTE_AND_TRANSITION_REGISTER.md) and [ADR-0003](decisions/ADR-0003-transition-and-dependency-traceability.md). There are 30 current Markdown sources, all automatically projected into the existing visual room. Before each change follow the impact procedure, update every affected producer/consumer/document, and record route-state changes. P01.3 documentation preparation is complete in this ZIP; workspace functionality remains planned. See the phase ledger for the next practical vertical slice.

## Current package 1.4 — first practical source delivery

Start at `/workspaces`. P01.3 now has six workspace pages, four protected API files and additive Supabase migration 018, with code/local tests supplied. P01.3 remains `[~]` until DB/browser/owner acceptance; all grand phases stay open. Do not confuse registry entries with business builder/connected-account/agent features. Read the updated user manual for migration and first-site walkthrough, documents 19/20 for actual impacts/routes, and delivery verification for exact checks. All 30 Markdown sources project through the current document room. New ZIP is `Bizoveya_1.4_Workspace-and-Site-Foundation.zip`; earlier packages remain preserved.

## Current package 1.5 — admin identity and control shell

The newest package is `Bizoveya_1.5_Admin-Identity-and-Control-Shell.zip`, extending 1.4. Stable work P01.4 now has three protected admin pages, two read-only APIs, TOTP setup/challenge, additive migration 019 and operator grant/revoke audit. Both P01.3 and P01.4 remain `[~]`; live DB/MFA/browser and baseline reconciliation gates are open. All grand phases remain unaccepted. Read [21_ADMIN_SETUP_AND_RECOVERY.md](21_ADMIN_SETUP_AND_RECOVERY.md) before configuring an operator. There are 31 current Markdown sources, automatically projected through the existing document room. Version/history sections below their original package headings describe those historical deliveries, not current acceptance.

## Current package1.6 — Phase1 verification and hardening

Current full package: `Bizoveya_1.6_Phase1-Verification-and-Hardening.zip`. Two confirmed defects are repaired: soft-deleted-account admin revocation (additive migration020) and stale document-dashboard release/count labels (now derived from canonical sources). Optional isolated SQL/browser tools and [22_PHASE1_VERIFICATION_GUIDE.md](22_PHASE1_VERIFICATION_GUIDE.md) provide reproducible evidence. There are32 current Markdown documents. Existing live Auth/Supabase/owner gates remain open; no grand phase is accepted. Read the latest section in each living document rather than treating an older delivery's limitations as a current test result.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.

New canonical sources: [Founder manual testing](23_FOUNDER_MANUAL_TESTING.md), [Deployments and environments](24_DEPLOYMENT_AND_ENVIRONMENTS.md), [ADR-0004](decisions/ADR-0004-separate-admin-application.md).
