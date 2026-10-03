# Business builder — P02.1 setup and testing

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Current contract — package1.13 / P03.1

Business Studio adds a Site knowledge link. Knowledge is separate from the design draft and visitor snapshot; facts never automatically overwrite business website content. Existing builder/publishing manual cases remain pending.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Six designs now available; old drafts and template URLs retained.025 required for new IDs. Use29 for template scope and30 for deferred setup/testing. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Business draft creation/editing remains as1.10. Publishing is now available from saved native Studio; detailed operator/user/manual instructions moved to28. Demo pages remain unsaved/unpublishable. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.10 / P02.2.Fix-1

Current setup/targeted acceptance is [27_CUSTOMER_JOURNEY_QA_AND_RELEASE.md](27_CUSTOMER_JOURNEY_QA_AND_RELEASE.md). Founder reports022 already applied, so the only new migration is023. New business creation saves the selected initial draft at version1 and opens Studio immediately. The1.9/1.8 walkthroughs below are historical where conflicting; modular section, v1 upgrade, stale save and tenant tests still apply. Business publication and agents remain planned.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

## P02.2 operator action and founder walkthrough

Current1.9 uses modular Business Studio; the older P02.1 instructions below are history and are superseded here.

**Database:** if001–021 are already applied, open the same Supabase project used by both apps → SQL Editor → new query → paste the complete022_modular_business_sections.sql → Run once.021 missing? Run021 first after its prerequisites, then022. Fresh project? Apply missing001–022 in order. Keep all old files unchanged. No new API/env key. Do not apply supabase/tests or tools fixtures to production.

022 introduces no new table or row rewrite; it accepts schema-v2 sections while retaining old schema-v1. Application read upgrades happen in memory; first explicit Save persistsv2 and advances version. If setup/save reports invalid document after deployment, reconcile022. Keep the latest editor content with Download draft before refresh. Rolling back the web app afterv2 saves can fail because1.8 cannot readv2; use a forward fix or reviewed data conversion, not a blind downgrade. Take an operator backup before production changes.

**Deploy:** merge full ZIP into existing repository; keep Git/env/local work. Root folders and two Vercel projects stay unchanged. Redeploy main app to refresh template routes and39 docs. Dependencies/lockfile are unchanged. Browser URLs:

| Where | Test |
|---|---|
| `/templates?category=business` | Three cards: Professional Practice, Local Services, Creative Business |
| `/templates/service-studio` | Existing slug, upgraded Professional Practice demo |
| `/templates/local-services` | Local Services demo |
| `/templates/creative-business` | Creative Business demo |
| Native-business workspace site → editor | Real private saved draft |
| `/bizoveya/docs` | Release1.9,26/ADR-0006, new history and phase order |

**Manual steps and expected results:**

1. Open all three demos; inspect desktop and phone. Demos are fictional and reset on reload; no demo save should claim publication.
2. Open an existing1.8 saved business draft. Name/headline/services/about/contact should survive. Edit one field → Save → reload; same data and higher version should return. This proves your hosted setup, which local SQL alone cannot.
3. Select Hero → switch layouts; approved headline stays. Switch starting design under Business & brand; all old content/items/extra sections stay. Undo reverses the design. A full20-section draft refuses a design requiring more sections instead of dropping data.
4. Add FAQ/Testimonial/Project sections; use arrows, hide/show, duplicate, delete. Check the preview order; Undo restores a deleted section and its content; Redo repeats it. After Save/reload composition remains, but session undo history clears.
5. Add two founder-approved test quotes. Switch cards/featured/slider; data remains. Featured shows first item; slider previous/next is manual. No fake quote appears automatically. For FAQ, keyboard-open accordion answers.
6. Edit shared email once; contact sections and CTA actions reflect it. Services duplicates share the service list. Choose palette/font and section background; layouts remain visually consistent.
7. Optionally use an owned public HTTPS image URL in Hero/About or a project/testimonial item. Check with photo, without photo and broken URL. Remote images load from that host; uploads are not implemented. Avoid private URLs. Unsupported/script/data/http URLs should not save.
8. Download JSON; change something; restore exported JSON; facts/sections return as unsaved edits. Undo can reverse restore; Save is required. Invalid/oversized JSON should show error and preserve existing draft.
9. Open same saved editor in two tabs. Save in A, then edit/save stale B. B must report conflict and retain its unsaved content. Download before reloading; reconcile manually.
10. Test viewer cannot mutate, outsider cannot access and removed member loses access using separate test accounts. Keep this security evidence separate from design approval.
11. Check mobile canvas AND real phone, keyboard focus/reorder, /portfolio voice/publish regression and separate admin login/MFA. Main-domain /admin remains404.
12. Read docs release1.9 and26; report outcomes as MT-022–030 in23, with package/origin/browser and exact test/report time if known.

Next P02.3 is business publication/contact readiness. Domain mapping, enquiry forms, booking/checkout, image uploads, durable business revisions, template administration and business AI agents remain planned. No need for new API tokens in this phase.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


Current delivery: **Bizoveya 1.8**, stable feature **P02.1**. Living draft; future owner instructions can change this contract. Source is implemented and local verification is recorded; real Supabase browser acceptance is pending. Business publishing is not implemented.

## What changed visibly

| Main-host route | Result | Account needed |
|---|---|---|
| `/` | Bizoveya business homepage, two entry paths, dark/light theme | No |
| `/get-started?journey=new` | Guided route to a new business site and draft editor | Only at workspace step |
| `/get-started?journey=existing` | Guided route to existing URL registration | Only at workspace step |
| `/templates` | Business/portfolio category filters and template cards | No |
| `/templates/service-studio` | Interactive fictional business example, editor and preview | No |
| `/portfolio` | Former homepage portfolio Studio, including latest-project restoration | Saved features require account |
| `/workspaces/[workspaceId]/sites/[siteId]/editor` | Private business editor and preview | Workspace membership |
| `/api/workspaces/[workspaceId]/sites/[siteId]/business` | GET latest draft, PUT version-checked save | Workspace membership; owner/editor for PUT |
| `/bizoveya/docs` | Current docs, release, phase state and activity visualizations | No |

The admin app still has its own host and login. No public admin links, redirects or handlers were added. Source folders are not URL prefixes. Existing portfolio project/studio/publication URLs remain intact.

## Manual database action — new migration 021

1. Use the same Supabase project used by both applications. First reconcile which migrations have actually been applied; a successful deployment does not prove database migration state.
2. **If 001–020 are already applied**, run only `supabase/migrations/021_business_drafts.sql` once in that project's SQL Editor. Do not rerun all 21 files.
3. If earlier migrations are missing, apply the missing prerequisites in numeric order first. Keep 001–020 unchanged; the migration folder is the ordered executable history, not obsolete files to archive away.
4. Confirm `public.bizoveya_business_drafts` and `public.bz_save_business_draft` exist. The migration creates a table, validation function, membership-read RLS policy and guarded write RPC. It changes no existing portfolio or publication rows.
5. In a **disposable/staging** project only, optionally run `supabase/tests/021_business_draft_assertions.sql` after migrations. It creates test Auth identities and roles within a rolled-back transaction. It is not an application migration and must not be used casually on production.

`supabase/operator/` remains trusted operator setup/recovery for platform admin; no new grant is needed for business owners. `tools/phase1-verification/` is optional local tooling, not files to paste into Supabase SQL Editor. Its bootstrap and fixture files must never be applied remotely.

No new environment variable, service-role key, AI API key or package dependency is required for this feature. Keep the existing separate web/admin environment settings. If 021 is missing, business editing shows a precise setup message; the homepage, demo and existing portfolio remain available.

## Deploy the cumulative ZIP

Extract the inner `bizoveya-platform` contents. Compare with your current Git branch before replacing files, preserving `.git`, private env files and any newer owner edits. Commit the updated source to the connected production branch. Both existing Vercel projects continue using `apps/web` and `apps/admin`; keep outside-root source access enabled. No second Git repository or extra Vercel project is required. Set each `NEXT_PUBLIC_SITE_URL` to that application's actual origin. Confirm both deployments are Ready, then use Visit.

Do not upload node_modules, .next, private env files or the ZIP blob as source. Public docs are generated from canonical Markdown during build: rebuild after document edits. This package does not provision an owned domain or DNS.

## Founder walkthrough and expected results

| Test ID | Steps | Expected result | Current founder result |
|---|---|---|---|
| MT-009 | Open `/`; switch dark/light; reload | Bizoveya homepage; theme persists; clear new/existing choices | Pending |
| MT-010 | Open `/templates`; choose Business, then Portfolio | Each category shows its own usable entry | Pending |
| MT-011 | Open Service Studio; edit name/headline/intro/about/contact; change accent; add/remove services | Preview updates; 1–6 services; sample labelled fictional | Pending |
| MT-012 | Download draft, then reload demo | Valid JSON backup; demo resets and does not pretend to be saved | Pending |
| MT-013 | Choose Create a website; sign in; create/select workspace; add native business site | New path survives login/workspace selection; site record offers business editor | Pending |
| MT-014 | Enter real approved facts; Save draft; reload editor | Version advances; saved content returns from Supabase | Pending |
| MT-015 | Open editor in two tabs; save in A, then attempt stale save in B | B gets conflict; A is not overwritten. Copy/download B changes before reloading | Pending |
| MT-016 | In staging, verify viewer, outsider and revoked-member access | Viewer cannot save; outsider/revoked member cannot read or write | Pending; membership management UI not included |
| MT-017 | Choose I have a website; register an existing URL | Existing registration flow; no remote content read/change | Pending |
| MT-018 | Open `/portfolio`, `/start`, existing `/studio/[projectId]` and `/p/[slug]` | Portfolio editor, onboarding and published page remain usable | Pending |
| MT-019 | Check `/admin` and `/api/admin/summary` on main host; admin host `/login` | Public404 with no redirect; separate admin login unchanged | Pending |
| MT-020 | Read updated docs and activity timeline on mobile | Current1.8 package, P02 in progress, new guide and decision visible | Pending |

Keep earlier founder smoke reports; they do not automatically pass changed 1.8 paths. Record browser, origin, package, execution/report time, steps and redacted evidence in document23. Never publish passwords, API keys, TOTP QR images or private business drafts in docs/screenshots.

## Draft lifecycle and limits

Owner/editor saves are explicit, not autosave. One latest business document is stored per native-business site; version is an optimistic concurrency counter, not a full revision/rollback archive. Preview immediately reflects unsaved local edits. A zero-version initial draft is not stored until Save succeeds. The editor warns on closing/reloading a dirty tab; internal navigation is not globally blocked, so save or download before leaving. Workspace viewers may view/download but cannot save.

Business name in the draft is the rendered website name; registry name remains a separate navigation label. Paused registry status labels the record and does not stop editing or hosting. No public draft URL, business publish endpoint, domain binding, contact inbox, lead collection, AI agent or remote connector is added. Contact email links open the visitor's email application; phone is display-only. JSON download is a backup, not an HTML website export; import is not implemented.

## Dependencies and next builder scope

`BusinessDocument schema → template/editor/preview → scoped business API → 021 validation/RLS/RPC → user/manual/phase/docs projections`. A template/schema change must update every affected node, including SQL validation and tests. The shared template catalog is the source of IDs/labels/routes; later agents must use approved catalog versions instead of duplicated template facts. No new agent was created or trained by this delivery.

Next candidate **P02.2**: approved business publication snapshots, public route/SEO contract, preview-to-publish confirmation and revocation, with hosted persistence/isolation proof. Template version administration remains planned; visual layout components still require code changes. Do not tick P02 accepted until publication and all original acceptance gates pass.


## Local verification evidence

Local evidence:271 unit tests (241web/30admin), both production builds with type/lint, frozen lock installation,001–021 SQL plus four assertion scripts and legacy upgrade preservation,31 actual local browser checks, eight browser screenshots and no page errors. Real hosted saved-draft/Auth/MFA/tenant acceptance remains pending. See docs/delivery/P02.1 for browser/SQL reports, exported fictional demo draft and screenshots. Founder deployment screenshots are a separate subfolder. Neither class of screenshot proves a hosted database save. The original history and migrations001–020 are byte-preserved.


## Verified P02.2 delivery evidence

P02.2 local verification passed:288 unit tests (258web/30admin), lint with no warnings, both production build/type checks, frozen lock install, application-boundary check,001–022 SQL/all five assertion suites plus legacy021→022 row/version/metadata preservation,48 local production-browser checks with no page errors and9 screenshots. Optional photo checks used a mocked HTTPS asset response, not a real owner asset host. Local SQL simulates Auth/JWT and is not hosted PostgREST/MFA or parallel-connection concurrency proof. Founder1.9 hosted checks remain pending. Source/public docs are not remotely deployed here.

See `docs/delivery/P02.2/` for reports, screenshots and logs; final inventory/source hashes in `docs/delivery/P02.2_VERIFICATION.json`. New guide26 andADR-0006 accompany32 updated existing platform documents (39 total). Supabase/manual steps remain above.
