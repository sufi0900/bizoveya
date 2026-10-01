# Stack, provider policy and security

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Draft 0.1.** Current archive package.json: Next.js `^15.5.2`, React `^19.1.1`, TypeScript `^5.9.2`, pnpm `11.19.0`, Node `>=20.9.0`, Supabase JS `^2.57.4`, `@supabase/ssr ^0.7.0`, Zod `^4.1.5`, Tiptap 3, React Three Fiber/Three, Vitest 3, ESLint 9. These are declared ranges, not installed/verified versions. No database/worker/telephony purchase decision is fixed by this draft.

**Verified in code:** AssemblyAI routes; OpenAI/Gemini support; `src/lib/agent-provider.ts` tries configured Nebius, OpenRouter, Gemini and OpenAI candidates in order. `.env.example` lists AssemblyAI, Supabase, OpenAI, Gemini and visitor hash secret but omits Nebius/OpenRouter variables found in code. Resolve docs/env/example and test provider selection in P00/P04. A configurable Nebius branch alone is not evidence of an actual Nebius/NVIDIA hackathon call. Pin actual model ID, provider path, request/result trace and cost only after live validation. ChatGPT Plus is not an API credential or a production inference budget.

**Target recommendation:** Keep Next.js/Supabase foundation, add workspace/site tenancy through additive migrations, introduce a durable queue/worker only after a local failure/retry proof. Use direct typed adapters for Sanity/GitHub/Vercel/channels. An n8n integration is optional and cannot become the only source of task/audit truth. Use cheaper model policies for small extraction/metadata only if output quality, cost and budget are measured. Gemini/OpenAI/AssemblyAI roles remain configurable auxiliary paths; owner chooses paid providers and budget thresholds before production.

## Security baseline

- Authenticate every private route, verify membership/site scope and enforce RLS/storage policy. Test owner A cannot read owner B's tasks, knowledge, media or credentials.
- Store secrets only in managed server configuration/secret store; never in browser bundles, prompts, logs or ZIP. Separate public anon key from service-role key. Rotate and revoke connector credentials, use minimal scopes and display grant owner.
- Treat fetched web pages, user documents, CMS entries, model text and agent-to-agent messages as untrusted. Validate typed commands with Zod and enforce tool allowlists/budget/approval on server; reject prompt attempts to override permissions.
- Sandbox or isolate repository changes; constrain selected repo/branch, require PR and owner review, forbid agents from direct default-branch write. Protect webhooks with signatures, replay window and idempotency.
- Rate-limit visitor agents, respect consent and retention, suppress private facts and sensitive data. Audit approval actor/time/action and external receipt. Define incident revocation and restore runbook before customer launch.
- Security review is evidence-based: dependency scan, RLS negative tests, secret scan, connector authorization/revoke test and double-action retry test. Capture gaps in `11_VERIFICATION_AND_RELEASE.md`.

## P01.0 document-room addition

`mermaid` 11 is declared for client-side rendering of the two current Markdown diagrams; actual installed resolved version must be read from the lockfile. The room reads server-local Markdown at build time and statically generates pages. Search indexes the full document text in the client, so **all source document text is public** even if a card is hidden. Review content before deployment, do not put secrets or customer data in public Markdown, and use actual authentication for any future private officer room. The dependency and Next.js build must be retested when upgraded.

## Provider-neutral runtime and protected management (package 1.2)

SDK/runtime choice is pending compatibility testing. OpenAI Agents SDK is a candidate for the TypeScript backend and supports provider adapter patterns; some advanced features are provider-specific. It is not present in this package's dependencies. Hosted Agents API is a distinct managed-runtime option, not a requirement or proof of compatibility with arbitrary cheap models. For the hackathon, central live inference must meaningfully use qualifying NVIDIA models on Nebius. Free tiers, open weights and ChatGPT subscription access are not unlimited/free production infrastructure.

Model catalog entries require provider/model identity, tool/output compatibility, quality/cost/latency evidence and geographic/data eligibility. Muse Spark hosted API is excluded from the intended Pakistan path under the geographic policy researched on 2026-09-30; recheck official policy before any future adoption. Self-hosted model licensing/hardware needs separate review. No provider ranking is finalized.

Admin baseline: named controlled bootstrap, MFA, server-side role checks on every mutation, least privilege, no public self-grant, sensitive-change reauthentication, optimistic revision checks and redacted audit. Privileged database keys stay server-only; RLS is not sufficient when a service role bypasses it. Clients cannot edit platform roles, global tools or server secrets. A hidden admin link is not security.

Credential room uses a dedicated protected API and secret-store references; no stored secret is returned after save. Redact request bodies, failures, telemetry, exports and screenshots. Separate staging/production and platform/tenant grants. Test atomic rotation, revoked key behavior and in-flight reconciliation. Do not allow arbitrary endpoints/scripts from client configuration; approved adapter catalogs avoid unrestricted execution and server-side request forgery. Sandbox repository/browser operations when needed; reject untrusted-document permission overrides.

The public Markdown room remains public and therefore contains only shareable discussion summaries and conceptual controls. Customer documents, actual secrets, private account screenshots, detailed operational incidents and live credentials must not be added there. No admin security feature is implemented by this documentation update.

## Package 1.3 transition and impact synchronization

Workspace pages and direct APIs must enforce the same server membership/entity scope; client owner does not imply platform admin. New admin shells stay protected even before features exist. Dependency review includes grant revocation, in-flight actions, secret metadata, contract schemas and rollback. No SDK, package dependency, credential vault or SQL change is made by package 1.3.

## Package 1.4 — first practical workspace implementation

Package metadata is now `bizoveya-platform@1.4.0`; dependency ranges and lockfile are unchanged. New server APIs use verified cookie sessions, method-specific membership/entity guards, strict schemas, same-origin checks for browser mutations, application/json intake and a 16 KiB body limit. API responses are private/no-store; invalid IDs and nonmembers receive unavailable/not-found responses, viewer/owner-only restrictions get denial, conflicts get 409, missing migration/storage gets a sanitized 503. Browser Origin is checked when present and cross-site Fetch Metadata is rejected; non-browser callers without those headers still need the authenticated session.

Migration 018 enables RLS, explicit grants, locked-down mutation RPCs and a private role helper to avoid recursive membership policies. No auth-user metadata role trust, service-role key, platform-admin grant or secret intake form is added. The operator must review and run staging SQL before applying in production. Authenticated collaborators see registry metadata; private portfolio editor/data remains owned separately.

Primary design references: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [database function security](https://supabase.com/docs/guides/database/functions), [Next.js authorization](https://nextjs.org/docs/app/guides/authentication). These guide the design; they are not evidence of passing production security checks.

## Package 1.5 — admin security implementation

Dependency ranges and lockfile remain unchanged; application version is 1.5.0. The existing Supabase JS/SSR clients supply TOTP enroll/list/challengeAndVerify and cookie propagation. Admin checks trust a server-verified user plus DB grant and signed JWT assurance, never user metadata or a decoded browser claim. Global RPCs recheck access; APIs use no-store and redact provider failures. Setup QR/key are rendered only during the approved user's explicit setup and cleared after verification; SVG is an image data URL, not injected HTML. No API key UI or new secret-store choice is introduced.

Private tables use RLS and revoked app/service-role table grants; exposed RPC EXECUTE is authenticated-only with hard role/AAL guards. The private operator function is not browser-callable. No administration mutation endpoint is installed, so future config/credential writes still need action-specific CSRF, reauthentication, validation, audit and recovery design. An AAL2 read session does not prove recent authentication for a future sensitive write. See runbook 21 for trusted-operator limitations and evidence gates.

Primary references: [Supabase TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp), [assurance and MFA](https://supabase.com/docs/guides/auth/auth-mfa), [SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

## Package1.6 — development verification and recovery correction

Application version1.6.0; application dependency ranges/root lockfile unchanged. Separate optional tooling pins PGlite0.5.8 and Playwright1.62.1 under `tools/phase1-verification/` with its own npm lock. These are never imported by application routes. Local SQL roles exercise real policy/function checks, but Auth/JWT/Storage services are fixtures; no auth-token verification claim follows from that test.

Migration020 restores operator revocation for soft-deleted accounts while retaining rejection of invalid/new grants, restricted EXECUTE privileges, reason validation and audit. No app service key or new privilege is introduced. Browser smoke checks use a fresh local context and unconfigured build; all network requests outside loopback are blocked. Actual authenticated/MFA/tenant browser tests still require staging. Temporary browser-install failures were handled in test tooling only, not by weakening application controls.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
