# Platform admin setup, verification and recovery

## Current contract — package1.15 / P04.2.1

Confirm through027 then apply028 once. Existing named grant+AAL2 setup unchanged. New initial refs all disabled; no model profiles seeded, no admin grant added. Optional admin-server variables mapped in33. Presence is deployment-scoped; safe missing-key test needs no secret. Rotate/revoke actual secrets privately; record reference transition after redeploy, recheck dependent profiles.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

After confirmed migration026 apply027 once. Existing operator grant/TOTP flow unchanged; migration does not grant admin. At separate admin host verify current named account+MFA then configure drafts. AAL1 or revoked grant cannot read/mutate registry. Keep emergency operator recovery procedure; do not paste sample user IDs.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Bizoveya 1.6 / stable work P01.4. Recovery fix020 supplied; hosted Auth/MFA acceptance pending.** This operator runbook is public documentation, not a place to store account identifiers, secrets, QR codes, one-time codes or private incident evidence. Use a private operator record for actual identities and approvals. Source lineage, tests and package hashes belong in the delivery records.

## What exists now

Three pages: `/admin`, `/admin/security`, `/admin/audit`. Two read-only endpoints: `GET /api/admin/summary`, `GET /api/admin/audit`. A database-managed platform-admin grant is separate from workspace owner/editor/viewer membership. There is one platform-admin capability set in this slice: aggregate registry counts and the latest 100 admin-role events. Support, billing and configuration-editor roles are still planned.

Every page loader verifies the Supabase user and reads current database eligibility. Only the security page permits an eligible AAL1 user, solely for MFA setup/challenge. Overview/audit APIs and their database RPCs require the current grant plus a JWT at AAL2. No user metadata, browser flag, signup order or workspace role grants administration. No service-role credential is added to the app.

## Staging installation — operator actions

1. Reconcile the supplied ZIP with current Git/deployment and the actual migration ledger. Confirm this environment is staging, take an appropriate backup, and resolve numbering collisions before applying anything. This delivery has not touched a remote database.
2. Apply the inherited migrations through 017 and new workspace migration 018 as appropriate to that ledger, then `supabase/migrations/019_bizoveya_admin_identity.sql`. Do not rerun already-applied migrations. Migration 019 is transactional and additive; it requires the workspace tables from 018. Keep `bizoveya_private` out of the Data API exposed schemas.
3. Run `supabase/tests/018_workspace_acceptance.sql` and `supabase/tests/019_admin_acceptance.sql` in disposable/staging Supabase as the database operator. Both create synthetic fixtures inside a rolled-back transaction. They simulate database JWT claims; they do not prove real MFA or browser cookies. No application credentials are needed in these files.
4. Configure the existing Supabase URL and anonymous key privately in the app environment. Check Supabase Auth TOTP enrollment and verification settings, sign-in URL configuration and rate limits. Sign in/create the intended operator account using the existing login flow. Confirm its exact `auth.users.id` out of band; do not infer it from a submitted email or profile claim.
5. Review `supabase/operator/platform_admin.sql`. Replace the UUID, operator identity and non-secret reason/ticket placeholders in a private working copy. This is a manual operator command, **not a migration**. Its placeholder UUID intentionally fails until replaced. Run it only with trusted database-operator credentials in the intended environment. No browser, anonymous, authenticated or service-role execution grant is provided for this function.
6. Open `/admin` signed in as that account. You should be sent to `/admin/security` until MFA is verified. Select **Set up authenticator**, scan the private QR code or manually enter the setup key, and enter the six-digit code. Existing verified TOTP factors are reused. Setup only begins on an explicit click; restarting removes only abandoned unverified factors named `Bizoveya admin`, never verified factors. After successful verification, the browser refreshes the server session and opens `/admin`.
7. Check the overview against known staging records and check `/admin/audit` for the grant. Perform the denial, revocation and recovery tests below. Record outcomes privately and add only redacted evidence to the project handoff.

## Metric definitions

| Label | Actual meaning | Does not mean |
|---|---|---|
| Workspaces | Count of all saved workspace rows | Paid or active customers |
| Registered sites | All site registry rows including paused and planning records | Connected sites or published business sites |
| Workspace members | Distinct user IDs in membership rows | All registered auth users or currently online users |
| Platform admins | Current operator-issued platform grant rows | Users currently signed in with MFA |

Counts are a read-time database snapshot. There is no presence service, revenue telemetry, model usage or active-agent metric. The summary RPC grants aggregate visibility only; existing tenant row policies remain unchanged.

## Audit boundary

A database trigger appends an event atomically when a grant is inserted or deleted, including subject UUID, UTC timestamp, action, operator label, database connection actor and non-secret reason. Repeating an existing grant or absent revocation does not invent another state change. The read RPC returns the latest 100 rows in deterministic time/ID order; pagination/export are not implemented. The UI escapes text and displays UTC explicitly.

The operator label/reason are operator-supplied declarations, not independently verified personal identity. `database_actor` records the database connection principal, which may be shared by the SQL editor; use the provider's operator logs for attribution. Direct database inserts/deletes get a fallback label/reason. App roles cannot modify audit rows; a database superuser can alter database contents, so this is not cryptographic tamper evidence. Sign-in, MFA enrollment/challenge and authentication failures remain Supabase Auth audit events. No claim of a unified authentication audit stream is made.

## Mandatory live acceptance checklist

- [ ] Fresh and upgrade application of 018–019 reconciled against the actual environment; supplied SQL assertions pass.
- [ ] Signed-out `/admin` returns through login; ordinary and workspace-owner accounts cannot access admin pages or either API even at AAL2 or with metadata `role=admin`.
- [ ] Approved admin at AAL1 can only enter authenticator setup; direct summary/audit RPC/API calls are denied.
- [ ] Enrollment, abandoned setup/retry, incorrect/expired code, existing-factor challenge and multiple-factor selection work without leaking setup secrets into URLs/logs/storage/screenshots.
- [ ] Successful challenge writes refreshed cookies, navigates to the overview and survives reload; sign-out denies subsequent access.
- [ ] Revocation immediately denies the next overview/audit/API/RPC request despite an existing AAL2 session. Previously displayed/downloaded information cannot be withdrawn.
- [ ] Audit grant/revoke entries have the expected subject/time/reason; a normal client cannot read or mutate private tables or call the operator function.
- [ ] Admin aggregate access does not expose unrelated workspace rows, private portfolios, documents, transcripts or secrets.
- [ ] Desktop/mobile, keyboard focus, error/loading states and dark/light persistence reviewed in an actual browser.
- [ ] Lost-factor recovery rehearsed on a disposable account; inherited portfolio and workspace flows still work.

## Revocation and lost-factor recovery

Use the same operator function with `p_enabled=false` and a specific reason to remove the platform grant. It is rechecked on every new protected request, including inside the global data RPC. A last-admin safeguard is deliberately not enforced: an operator must be able to revoke all admins in an incident. Trusted database access is therefore the separate recovery path and must itself be protected.

For a lost/compromised factor: verify the person's identity outside the app, revoke their platform grant first, use the Supabase operator-supported session revocation and factor-recovery procedure, and confirm old sessions cannot regain privileged access. Reset/removal by itself must not be treated as session invalidation. Then reissue the grant deliberately with a reason and require fresh TOTP enrollment/challenge. Keep the provider audit/reference and recovery results in private incident records. This recovery sequence is a runbook requiring a staging rehearsal; it has not been tested here. The app offers no bypass, shared admin account, service-key fallback or recovery codes.

## Rollback and extension

Reverting application code to 1.4 leaves the additive private tables/audit data in place; do not drop audit history to roll back UI. Remove grants if admin access must be disabled. Public RPCs remain callable by authorized users while installed, so removing a page alone is not a revocation mechanism. Future role/config/credential changes must update both app and DB capability guards, tests, audit semantics, route inventory, user manual and this runbook. Sensitive write operations will require their own fresh-auth policy; current AAL2 read access is not that policy.

Primary references checked for this implementation: [Supabase TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp), [MFA and assurance](https://supabase.com/docs/guides/auth/auth-mfa), [SSR client integration](https://supabase.com/docs/guides/auth/server-side/creating-a-client). Installed SDK types were checked by TypeScript. References explain the mechanism; only recorded local/live tests constitute project evidence.

## Package1.6 — recovery fix and new evidence

After reconciling the environment ledger, review/apply additive `020_bizoveya_admin_recovery.sql` following019. Do not edit/reapply019 to get this repair. The original function refused both grants and revocations for soft-deleted Auth accounts;020 gates only new grants on account eligibility. Revoking a remaining grant now works after soft deletion, emits the existing audit event and remains idempotent. The operator template and private EXECUTE restrictions are unchanged.

Run `supabase/tests/020_admin_recovery_acceptance.sql` alongside018/019 in disposable/staging Supabase. The local PostgreSQL-WASM regression failed before the repair and passed afterward; these are simulated JWT/schema fixtures, not hosted Auth/MFA proof. The real lost-factor/session-revocation procedure still needs a staging rehearsal. See document22 for the isolated verification runner and the browser checks that cover only public/setup screens.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
