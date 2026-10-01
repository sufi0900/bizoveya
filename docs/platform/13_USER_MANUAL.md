# Bizoveya user manual — prelaunch working edition

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Edition:** 1.2 draft, 2026-09-30; **audience:** prospective customer, site owner, authorized team member and support officer. **Product state:** Bizoveya's commercial workspace has not launched. This manual intentionally does not tell a user to click buttons that do not yet exist. Inherited Voxfolio V27.12 source routes are documented separately below and require live confirmation. Keep this file synchronized with each accepted feature, screen label, route and provider behavior. Remove a planned instruction when its feature is dropped; record the reversal in `ACTIVITY_LOG.md`.

## How to read this manual

| Label | Meaning |
|---|---|
| Available and verified | Implemented in Bizoveya and manually confirmed in a release; link to evidence and screenshots |
| Inherited, verification pending | Present in Voxfolio code but not confirmed in Bizoveya's live product |
| Planned | Expected customer journey; **not an instruction users can perform yet** |
| Unavailable | Channel or site capability not supported for this account/version |

The owner/support team must update version, date, exact screen text, numbered actions, expected outcome, troubleshooting and screenshots after each accepted phase. A release does not mark a manual section “available” until a user can follow it on the actual deployed build. Provide accessible text alternatives for any screenshots. Each screenshot should include product version, route, viewport and redacted data.

## What Bizoveya is expected to do (planned)

Bizoveya is being designed as one workspace where you can create a business or portfolio website, or connect an existing website without replacing its CMS, repository or hosting. You will then be able to supply approved business knowledge and review supervised AI work. Your permissions, connection type and plan determine available actions. Features such as meetings, external CMS drafts, WhatsApp and phone reception remain planned; their availability will be stated here when proven.

## Account and workspace (planned; P01)

1. Sign in through the official Bizoveya site after launch. The exact URL, login options and account verification steps are **not decided**.
2. Create or join a workspace. The screen will identify your role and workspace owner.
3. Choose **Create a website** or **Connect an existing website**. The finalized labels, routes and screenshots will be added after P01 acceptance.
4. Add sites separately. Each site shows its type, connection capabilities, owner and current status. Registration alone should not modify a live external site.

**Troubleshooting to complete at P01:** lost access, invitation expired, no site displayed, role mismatch, duplicate domain and safe removal. Support must never ask a customer to paste API secrets into chat.

## Create a native website (planned; P02)

Collect approved business name, offer/services, contact route, brand assets and supporting proof. Select business or portfolio presentation, preview a template, explicitly confirm it, edit page content and check mobile/public metadata. Save a draft before approving publication. At P02, replace this paragraph with exact numbered UI steps, permissions, screen captures, expected links and rollback procedure. The inherited Voxfolio template preview/confirmation behavior informs the design but is not a verified Bizoveya launch feature.

## Connect an existing website (planned; P01/P05/P08)

Enter a public domain to register a read-only site. Connect an authorized CMS, selected GitHub repository or deployment project only when the capability is available and you control it. A capability panel should clearly distinguish public read, draft, PR, preview and publish rights. Review the proposed diff before granting any write. Existing content stays in its own CMS/repository. A URL-only registration grants **no editing ability**. Later editions will document authorization screens, token revocation, stale-revision errors and disconnect/export steps per provider.

## Knowledge and assistants (planned; P03/P04/P10)

Upload documents only if you are authorized to use them; review extracted facts and explicitly approve what is public versus private. An AI employee should show site scope, task, proposed result, cost and approval request. Visitor answers must use approved public material. The eventual manual will cover correcting facts, deleting data, reviewing a task trace and escalating a lead. WhatsApp and phone use require their own eligible business/provider setup and cost disclosures; they are currently **unavailable in Bizoveya**.

## Meetings, approvals and interruptions (planned; P06)

The intended meeting has an agenda, participating roles, recorded contributions, owner decision and linked tasks. Owners should be able to check status, amend, pause, reprioritize, cancel or stop work. An already completed external action cannot be erased by a pause; the task history will show the receipt. Precise controls, error messages and safe-resume steps must be inserted after the feature passes tests.

## Inherited Voxfolio reference — not a Bizoveya launch guide

**Verified in archive code, live status unverified:** `/start` guides portfolio creation; `/projects` lists projects; `/studio/[projectId]` edits; `/p/[slug]` and child paths serve public portfolios; `/login` and `/claim` handle access and guest drafts. V27.12 release instructions say template preview needs separate confirmation before creating a private draft. Read `docs/history/voxfolio-v27-and-earlier/RELEASE_V27_12.md` and perform the listed manual checks in the real deployment. Do not give prospective Bizoveya customers the inherited URL as if it were the new commercial platform.

## Support officer checklist for every manual update

Confirm role, exact route, test account/build, accessibility and phone/desktop, screenshot with sensitive content redacted, permission denied and failure states, provider costs, expected remote effect, recovery and support contact. Attach test evidence in `11_VERIFICATION_AND_RELEASE.md`, mark the feature available here, and log the change in `ACTIVITY_LOG.md`, `COMPLETED_WORK.md` when accepted, and the package/phase ledgers. Public manual and internal support notes may be separated into different files later; customer-facing pages must not expose internal secrets, vulnerabilities or private architecture.

## In-app document room (P01.0 — implemented in code, browser confirmation pending)

Open `/bizoveya/docs` on a running Bizoveya build. Use the document cards or category chips to browse current plans; enter a term in the search field to find words across all present Markdown. Open a card to read its formatted page, use the contents list to jump by heading and return to the overview. The activity and completion summaries come from the project files. The route is public by owner direction; its presence does not make the proposed commercial product features usable. Exact deployment URL and screenshots will be inserted after a live manual check.

### Dashboard appearance and navigation (P01.1 code available; live acceptance pending)

Open `/bizoveya/docs` for metrics, phase map, recent work and event history. Search the library for a filename, title or phrase inside a document, select a category and open a card. Use the theme button in the top bar to choose light or dark mode; the preference is remembered in that browser when storage is available. On a document page, use the reading-map chips or contents links to jump to a section. The phase and evidence widgets summarize the same Markdown shown below them. A status labeled planned or pending is not a released customer feature.

## Client instructions and administrator guide (planned; unavailable)

Clients will configure their own brand/audience/site preferences and task requests within workspace permissions. They will not edit platform secrets or expand an agent's global tool rights. A conflict with enforced policy will be shown explicitly. New task runs will show the configuration version used; amendments/pause will be recorded at safe checkpoints.

Authorized platform staff will have a separate protected management area for agent defaults, supported model profiles, QA evaluations, credential status/rotation, templates, run monitoring and client operations. The intended configuration process is draft, validate, test, activate and monitor, with version rollback. Private saved keys will not be displayed after entry. Operational visibility does not automatically mean access to private client documents.

**These are not click-by-click instructions yet:** `/admin` and related routes are proposed only. After implementation, add exact login/MFA steps, roles, screenshots, form labels, secret rotation/recovery, version activation/rollback, error messages and evidence. Neither QA instructions nor model review guarantee zero errors. Secrets must be entered only through an implemented protected channel, never the document room or chat.

## Package 1.2 documentation navigation

The document library includes the founder discussion record, backend/admin plan and ADR-0002. Search for “Muse”, “SDK”, “super admin” or “credentials”; the generated pages retain complete source text, section navigation, tables and diagrams. The activity dashboard and completion/package widgets derive their new records from Markdown. Rebuild/redeploy the app for changes to appear; no live URL or browser acceptance is newly claimed.

## Package 1.3 transition and impact synchronization

Workspace/site/admin paths in [20_ROUTE_AND_TRANSITION_REGISTER.md](20_ROUTE_AND_TRANSITION_REGISTER.md) remain planned. Do not instruct customers to use those screens yet. The next first-slice walkthrough will cover create/connect entry, URL-only registration, two sites, scoped navigation and legacy editor links only after implemented and verified. Template additions/retirements must update this manual alongside catalog and voice tool knowledge.

## Package 1.4 — workspace/site guide (implemented in source; live acceptance pending)

### Operator setup before the first real use

1. Preserve the current deployment/Git branch and database backup. Compare this package with unpublished work. In Supabase, inspect applied migrations; reconcile 001–017 and confirm that source migration number 018 is free before applying anything. No existing migration file was edited.
2. Use the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` settings in the local/preview environment. Keep values out of chats/public docs; no new API/model key or service-role key is needed for this phase. Email/password login remains the existing auth method.
3. Apply `supabase/migrations/018_bizoveya_workspaces.sql` to staging through your usual migration process or SQL editor. It creates only the new Bizoveya registry/membership objects. It does not backfill, move, publish or rename an existing portfolio.
4. Run `supabase/tests/018_workspace_acceptance.sql` in that **staging/disposable** environment. It creates temporary auth-user fixtures, tests DB roles and rolls the complete transaction back. If it fails, stop and record the exact sanitized assertion/error; do not treat local mocked tests as an alternative pass.
5. Install from the unchanged lockfile using the documented supported Node/pnpm setup, start the app or a preview, then open `/workspaces`. A missing configuration/migration shows a setup/unavailable state rather than fabricated data. The ZIP contains source, not prebuilt `.next` output.

### Client walkthrough

1. Open **Bizoveya workspaces** from the portfolio list or `/start`, or visit `/workspaces` directly. If signed out, sign in and return to your requested workspace path.
2. Enter a workspace name and select **Create workspace**. Your account becomes its owner. Existing portfolios stay where they are. You can create another workspace and switch between the ones you belong to.
3. Select **Add a site**. **I have a website** registers a public URL, name, business/portfolio category and active/paused registry status. Confirm you are authorized. This saves a record only; it does not read or modify the remote website or ask for its account login.
4. **I need a website → New business site** creates a planning record. Business templates/editing/publishing are later P02 functionality. **Owned portfolio** links one of your saved portfolios. If you have none, create one in the existing Studio and return to select it. A project can be registered once; linking does not transfer ownership or give collaborators Studio access.
5. The overview shows counts derived from your registered records, plus status/capability cards. Open a site record to rename it or change its registry status. External URL changes require renewed authorization confirmation. **Paused** changes the registry label only, not hosting or an agent.
6. For a portfolio you still own, **Open existing Studio** uses the original editor, voice, revision and publication controls. Existing `/p` and share URLs stay unchanged. If the original project is deleted, the registry retains its record and marks the source unavailable.
7. Workspace **Settings** lets owners rename the workspace. Editors manage site metadata; viewers read it. Membership invitations/role management, deletion/export, agents/integrations and super-admin tools are not implemented. The workspace owner role does not imply platform admin.
8. Use the theme button for persistent light/dark mode. Sign out with the header control. Your saved records belong in Supabase; theme preference alone is browser-local.

### Founder first-site validation and acceptance

Register Do It With AI Tools (`https://doitwithai.tools/`, business) and Sufian Mustafa (`https://sufianmustafa.com/`, portfolio) in one workspace. Confirm the actual LIONXE domain before adding it as a business site, with paused status if applicable. This registers existing public URLs; it does not automatically find repos/CMS grants or migrate their content. Alternatively link a truly owned native portfolio through the project picker. No founder records were prepopulated.

Reload and verify saved records; open another workspace and check separation. Use a separate account to test inaccessible paths/direct APIs; do not grant yourself roles via user metadata. Operator staging SQL supplies role/revocation cases until an invitation UI exists. Test invalid URLs, already-linked projects, stale updates in two tabs, missing/revoked membership and sign-out. Check desktop/mobile navigation, keyboard focus, theme persistence and old portfolio editing/public/voice behavior. Record actual results in phase/activity/handoff documents before phase acceptance.

### Common outcomes

| Result | What to do |
|---|---|
| Storage setup/503 | Operator checks environment and migration 018; do not retry creating dummy records |
| Sign-in required/401 | Sign in through the existing login flow |
| Unavailable/404 | Check your membership and the workspace/site ID; other tenants' records are deliberately undisclosed |
| Read-only/403 | Ask the workspace operator for the appropriate grant; role administration UI is not yet implemented |
| Conflict/409 | Reload the current record/version before saving; duplicate native portfolio links need the existing registry entry |
| Invalid details/400 or body-format/415 | Correct the public URL/attestation/name/type and submit valid JSON through the interface |

This is a working guide for source capability, not a claim of a final launched product. Update it after every implemented feature/design/navigation change; replace planned instructions with verified behavior and real screenshots when available.

## Package 1.5 — operator guide (prelaunch, live verification pending)

Platform administration is separate from ordinary client workspaces. Your workspace-owner account does not automatically gain it. A trusted operator must explicitly approve an existing account using the private database procedure in [21_ADMIN_SETUP_AND_RECOVERY.md](21_ADMIN_SETUP_AND_RECOVERY.md).

After setup, visit `/admin`, sign in and complete `/admin/security`. If no verified authenticator exists, choose **Set up authenticator**, scan the QR or enter its private key in your app, then submit a six-digit code. If you already have a verified TOTP factor, use it; select between factors when needed. Never send setup keys/codes in chat or screenshots. After verification, the overview shows saved workspaces, registered site records, distinct workspace members and granted admins; these are not online-user or revenue counts. Open **Access history** to inspect the latest 100 grants/revocations, with UTC timestamps. Use the theme switch or sign-out button in the header.

The API-key room, agent defaults, template editor, run controls and support access are still planned. Missing configuration prompts setup; an ordinary/revoked account cannot access global data. If codes fail, try a fresh code and check the authenticator clock; for lost access use the operator recovery procedure, not a new signup. The runbook contains staging installation, denial tests and manual acceptance. These instructions describe supplied source, not a verified live release.

## Package1.6 — document navigation and operator update

The document room now displays the actual recorded release and number of current documents automatically. Search/category filters, theme switching and document detail navigation retain their existing controls. Historical sections remain visible, while the current package label updates on rebuild.

Operators upgrading from1.5 must review/apply migration020 after confirming the existing migration ledger. It fixes revocation of an admin grant after an account is soft-deleted; the grant/revoke operator template is unchanged. Run the added020 recovery assertion in staging. [Document22](22_PHASE1_VERIFICATION_GUIDE.md) explains the optional local verification commands. Actual sign-in/MFA/site persistence still need the staging walkthrough in document21; local SQL fixtures and setup screens are not a launched platform.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
