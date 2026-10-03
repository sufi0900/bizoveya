# Bizoveya operating rubric and product rules

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


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


## Historical contract — package1.15 / P04.2.1

Presence is a deployment-scope boolean, not a provider validation, healthy model or live activation. Do not enter secrets in names/reasons/model IDs. Reference disable is platform metadata only; it cannot revoke provider access elsewhere. Budgets are unenforced future metadata. Real secrets must never enter public docs or screenshots.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Preview review must not be described as model evaluation or launch approval. Review reason minimum10/max300 characters. Facts/preference content remains untrusted data; client cannot elevate permissions. Old gates stay pending until case-specific evidence. No guarantees of error-free agent behavior.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Knowledge is private by default and approval does not guarantee truth. Owner validates factual claims, authorization and provenance. Future agent runs must distinguish facts from instructions and verify fresh approvals; no public response without a separately approved feature/policy.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Template gate includes honest vertical scope, distinct visual appearance, responsive usability, readable tone/palette combinations and preserved user content. Fake testimonials, booking buttons without a backend, unsupported checkout/portal claims and invented founder pass are excluded. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Publication gate: approved real business facts/contact, permission for testimonials/images, correct visible sections, explicit public confirmation, conflict-free saved version, anonymous check and unpublish test. Hidden section source must not be public. Local checks support delivery; founder hosted acceptance must be recorded separately. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

Do not accept a phase from a broad route smoke test when specific customer journeys fail. A release must test authenticated returning/new users, correct navigation state, atomic selected-design creation, duplicate conflicts, save/reload, role denial and visual differentiation. Record failed cases and actual evidence; never convert untested cases to passes. Legacy duplicate cleanup requires reviewed record IDs and draft backup; no automatic data purge.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

Business template release gates: no fabricated quotes/results/credentials; coherent no-photo layouts; retained content on layout/preset changes; unique IDs and validated schema; shared contact consistency; role/tenant isolation; save/reload/concurrency; mobile/keyboard checks; safe legacy read/save; corrected docs/dashboard. Use evidence-based status, not a blanket quality promise. A generated template or UI success does not prove enquiries delivered, bookings confirmed or increased revenue.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

A successful deploy is distinct from a database migration, authenticated test or feature acceptance. Report business demo, unsaved edit, saved draft and published website separately. Preserve testimonials/trust evidence requirements; fictional sample is labelled. Operators apply only missing migrations, never blanket replay. No agent/template administration capability should be claimed merely because a catalog card exists.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.5; internal design and review rules, not published legal terms.** Product requirements live in `02_REQUIREMENTS.md`; technical controls in `08_TECH_STACK_AND_SECURITY.md`; test evidence in `11_VERIFICATION_AND_RELEASE.md`. This rubric makes acceptance and permission decisions repeatable. Revisit after each phase and user instruction. Jurisdiction-specific legal terms, privacy notice and provider policies require separate review before a commercial launch.

## User and officer rules (proposed)

1. A user may act only on a site/workspace they own or are authorized to manage. Registering a URL does not prove ownership or grant write rights. Support officers verify identity and role before access changes.
2. All AI-created content is a proposal until appropriate human review. Publishing, messaging customers, placing calls, charging accounts and merging code require explicit permission as configured; sensitive actions retain an audit receipt.
3. Uploaded material must be licensed or owned by the user. Mark public-approved versus private-operational knowledge. Never silently move private facts into a public assistant.
4. A connected site's original CMS/repo/host remains the content authority. An assistant shows diff, version conflict and remote result; a timeout does not justify blind duplicate submission.
5. Show cost/quotas and channel constraints before an action that can incur usage charges. Customer-facing material must describe actually available features and clear limitations.
6. A user can pause/revoke future execution; durable audit remains. Data export/deletion, retention and support handling must have approved policy before commercial availability.

## Phase acceptance rubric

| Gate | Pass evidence | Stop condition |
|---|---|---|
| Truth | UI/manual/marketing claims map to verified release behavior | Planned feature represented as live |
| Tenant and privacy | Negative cross-tenant/site tests, public/private retrieval check | Unscoped access or private fact leak |
| Control | Roles, approval actor, idempotent external receipt, cancel/reconcile behavior | Unapproved write or duplicate action |
| Usability | Customer can complete documented flow by keyboard and on mobile; clear errors | Manual cannot be followed or critical state hidden |
| Reliability | Automated checks, owner live test, rollback path and degraded mode | Unresolved critical regression or missing migration evidence |
| Economics | Provider costs/budgets displayed or bounded by an approved policy | Unbounded charge or unsupported “free/unlimited” promise |
| Documentation | All affected canonical docs, manual, progress/activity, phase and ZIP records updated | Conflicting instructions or unverifiable completion tick |

**Decision:** A phase/substep earns `[x]` only for the explicitly scoped deliverable with evidence. The grand phase remains open until all gates required for its outcome pass. A blocked gate is recorded, not averaged away. Owner instruction may change a rule, but the new rule must be documented with its reason, scope and migration/rollback implications. This is an operational rubric; it does not substitute for terms of service, privacy policy, accessibility audit or legal review.

## Officer release review

Before approving public claims, compare deployed build/commit, route and screenshot, manual entry, data policy, model/provider and real receipts. Record reviewer, date/time PKT, decision and evidence link. If a feature is withdrawn, retract its manual instructions, update marketing/presentation and package records, notify affected users when appropriate, and add a reversal activity event.

## Administrator and agent-rule change gates

- Configuration privilege is scoped; clients cannot self-grant platform roles or change mandatory execution boundaries. Require MFA/reauthentication for sensitive platform changes and audit actor, reason and redacted version references.
- Instructions/default QA rules are editable configuration, not a promise of error-free output. Pair model judgment with deterministic validation, authorized tool execution and observed receipts.
- Validate and evaluate before activation; retain immutable versions and run snapshots; rollback does not delete the change history. No silent mid-run replacement.
- Secret values never appear in docs, browser responses after save, logs, prompts, screenshots or exports. Rotation/revocation must preserve previous state on failure and reconcile already-started actions.
- Provider eligibility, compatibility, total cost and model quality are evaluated per task. Do not treat free tiers as permanent unlimited capacity or general rankings as proof.
- Operational visibility is permissioned. Metrics have definitions/windows; private support access has purpose/scope/expiry/audit; online presence is not inferred from logins.

If tests, credentials or live proof are missing, keep the feature planned/pending. The founder can revise the plan; record the changed scope, affected documents and reason without erasing previous discussion.

## Package 1.3 transition and impact synchronization

A change is ready only when direct/transitive consumers, permissions, compatibility, migrations, approvals, in-flight runs and affected documentation are addressed. Use document 19 impact procedure and document 20 route states. An empty page, model answer or success-shaped stub is never proof that a capability works.

## Package 1.4 — first practical workspace implementation

Package 1.4 may be described as “implemented workspace/site foundation, awaiting live migration and acceptance.” Do not say business builder, fully connected websites, agent automation or super admin is available. Local mocked permission tests supplement but do not replace DB RLS tests and owner preview checks. No agent actions or website edits are triggered by registration or registry status changes. Member invitations, deletion/export, role administration and operational audit UI remain future work.

## Package 1.5 — operator acceptance rules

No admin access is inferred from signup, tenant ownership, user metadata or an AI instruction. Require operator grant plus MFA for all global data reads and repeat the guard inside each exposed DB RPC. Public docs may describe the process but must never contain real setup keys, operator account identifiers or incident secrets. Record actual role transitions, not pretend changes on idempotent requests. Do not claim a dashboard grants private-client support access. Treat mocked authorization tests and DB/browser/MFA acceptance as distinct evidence. Follow runbook 21 before activating this slice.

## Package1.6 — evidence classification

Distinguish mocked unit tests, executed local SQL with service fixtures, real-browser public/setup checks, and actual hosted integration proof. Only the named layer is verified by its result. Require a recorded failing regression before claiming a confirmed defect repair. Preserve old migrations and use an additive migration for issued database changes. Dashboard status/version labels must come from canonical records, not hardcoded historical milestones. No grand-phase acceptance is inferred from this hardening delivery.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
