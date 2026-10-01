# Bizoveya operating rubric and product rules

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

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
