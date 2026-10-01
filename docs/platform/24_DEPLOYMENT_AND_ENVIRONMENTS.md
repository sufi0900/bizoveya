# Deployments and environments

**Bizoveya1.7: two Next.js applications in one repository and one cumulative ZIP.** Folder names are source locations, not browser URL prefixes. Both applications include server logic; the public app is not merely a frontend and the admin app is not the entire backend.

## Application ownership

| Root directory | Vercel project | Domain (illustrative; not provisioned) | Routes |
|---|---|---|---|
| apps/web | bizoveya-web | your-domain.com | Existing portfolio, login, workspaces, customer APIs and /bizoveya/docs |
| apps/admin | bizoveya-admin | admin.your-domain.com | / redirects to /login; /login; /admin; /admin/security; /admin/audit; /api/admin/summary; /api/admin/audit |

The public deployment has no /admin page tree or /api/admin handlers, no admin link and no redirect to the admin host. These URLs return404 there. Admin contains no docs, workspace, builder or marketing routes. Its pages never provide customer signup. An operator creates/identifies the account using the public login or trusted Auth management, then grants it using the private operator procedure.

Canonical documentation stays at repository-root docs/platform and is generated only by the web app at /bizoveya/docs. Admin runbooks remain there too, as requested. A document discussing /admin is text about the private host, not a navigation link to it. Do not turn these into admin hyperlinks. Credentials/private incident records never belong in public docs.

## Local setup — required owner actions

Use Node24 and the declared pnpm version. From the extracted bizoveya-platform root:

```sh
pnpm install --frozen-lockfile
pnpm dev:web
```

In a second terminal at the same repository root:

```sh
pnpm dev:admin
```

Web: http://localhost:3000. Admin: http://localhost:3001. Create separate apps/web/.env.local and apps/admin/.env.local using each .env.example. Configure the same intended Supabase URL/anon key independently. Set NEXT_PUBLIC_SITE_URL to the correct application URL in each. Existing voice/model secrets belong only in web if needed. No service-role key or AI-provider key is required by this admin slice.

Run root pnpm test, pnpm typecheck, pnpm lint, pnpm build and pnpm check:boundaries for both applications. Root pnpm dev remains a web shortcut. Old source paths src/ now live at apps/web/src/ or apps/admin/src/. Optional verification tools remain at tools/phase1-verification; install them with npm ci --prefix tools/phase1-verification. Browser runner1.7 starts both unconfigured production builds and tests the route boundary; SQL runner remains local-only.

## One GitHub repository, two Vercel projects

1. Upload/commit this complete tree to the existing chosen repository. Do not overwrite private env files or ignore local changes.
2. Configure the existing public Vercel project Root Directory as apps/web. Its root previously used the repository root; leaving it unchanged will no longer build the web app correctly.
3. Import the same GitHub repository as a second Vercel project with Root Directory apps/admin.
4. Enable access to source outside the Root Directory for the web build so it can read ../../docs/platform. The web Next config traces these docs from the repository root. Preview must verify every document page loads.
5. Configure environment variables separately for each project and environment. Builds run pnpm build within their selected application root; dependency installation uses the root workspace lockfile. Do not set an application build command to root pnpm build recursively.
6. First verify the two Vercel preview URLs. Only then assign your owned main domain to web and its admin subdomain to admin. Configure the DNS records Vercel displays, confirm HTTPS and configure allowed Supabase Auth site/redirect URLs for the intended flows. No domain has been purchased or configured by this ZIP.
7. Verify public /admin and /api/admin/summary return404 without an admin-host redirect; admin /login responds; admin /bizoveya/docs and /workspaces return404. Run real admin/MFA and customer regressions below before promotion.

Do not assume two projects are within any account's current plan limits without checking that account. Sharing Git does not imply an admin deployment is inaccessible; protect deployment permissions as well as application authorization.

## Database and session ownership

Use one Supabase environment initially. Apply each missing migration001–020 once, in order, against its verified ledger; no new migration is added in1.7. If001–020 already applied, run no migration for this package. The SQL fixtures inside tools are never Supabase installation scripts. Operator grant/revoke is still supabase/operator/platform_admin.sql; admin grant is not created by signup.

Admin browser/server/middleware use a distinct cookie/storage name bizoveya-admin-auth, no Domain attribute, path/, SameSite=Lax and Secure in production. Public auth retains its existing cookie name. This separates browser sessions even on localhost ports (cookies are host-scoped, not port-scoped). Admin middleware refreshes the real user session; every protected loader/API and DB function still checks privileges and MFA. Local sign-out does not deliberately invalidate other application sessions. Test actual provider behavior on staging.

Shared Auth users/DB remain a shared trust boundary: the same account's verified token retains its database capabilities. Host-only cookies do not revoke DB authority, partition Auth users or guarantee isolation after database/deployment credential compromise. Browser cookies required by the Supabase browser SDK are not claimed to be HttpOnly. CORS alone is not authorization. Keep admin credentials/session private; do not place privileged service keys in either browser bundle.

## Required manual acceptance and rollback

Check signup/workspace/site creation, persistence after reload, and two-account isolation on web. Use the already-approved operator account on admin /login, verify non-admin denial, real TOTP at /admin/security, incorrect-code behavior, cookie refresh/reload, sign-out, immediate grant revocation and disposable lost-factor recovery. Confirm a public login alone does not sign in the admin application. Document23 records exact owner results; all untested cases stay pending.

One cumulative ZIP contains both applications, docs and migrations; delivery ordinal1.7 is not phase acceptance. Handoffs state each changed deployment and migration/manual action. Shared configuration changes require checks of both apps. Deploy web and admin independently but coordinate breaking database/contracts changes. Rollback to1.6 requires restoring the old public Root Directory as well as its code; that restores admin routes to the public application and therefore reverses the intended separation. Prefer fixing forward or removing admin grants when disabling privileged access; do not delete audit records.
