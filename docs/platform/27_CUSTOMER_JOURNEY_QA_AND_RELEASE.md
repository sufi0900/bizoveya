# Customer journey QA and Bizoveya1.10 release guide

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Current contract — package1.13 / P03.1

Knowledge screens adopt duplicate submission locks, unchanged-save disablement, explicit role states, expected versions/conflict messages, and unsaved navigation/sign-out warnings. Browser Back/Forward remains a documented SPA guard limit: save/export first. Previous UX regression cases are retained in30.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

This1.10 record remains valid for fix acceptance; pending tests are grouped in30. Current delivery1.12 includes1.10 fixes and1.11 publishing plus template expansion. Earlier publishing-unavailable statements below are historical.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

This remains the1.10 fix record and MT033–040 guide. Publication-unavailable statements below describe1.10 historical scope; current1.11 adds P02.3.1 per28. The founder has not accepted1.10 yet. Browser Back/Forward unsaved-edit limitation remains; save/download first.

Earlier release sections retain history and are superseded where they conflict with this current contract.

Living first draft. Owner: Sufian Mustafa. Stable work: P02.2.Fix-1. Local source/tests are separate from founder hosted acceptance. Future explicit owner requirements can revise this document with the code.

## Why this fix was necessary

Founder testing uncovered disconnected customer flows in1.9. The public header was static, workspace-card destinations depended on a retained onboarding query, Your sites matched the entire new-site path, successful submit unlocked before navigation, and SQL guarded only portfolio-link duplication. Template selection existed in demos/Studio but not creation; initial designs shared too much presentation. Earlier automation verified demos/routes and SQL layers but missed a complete authenticated create/return journey. This is a verification coverage gap, not evidence that the founder used the product incorrectly.

## What changed

| User action | Current result |
|---|---|
| Signed-in public entry | Account name/email replaces Sign in; auth changes update the header |
| Return to Workspaces | Existing workspace cards occupy main content; extra creation is a sidebar route |
| Open workspace card | Existing overview/sites, regardless of old journey query |
| Add a site | Only Add a site is selected; Your sites is selected for actual list/detail/editor locations |
| Create business | Choose Professional Practice, Local Services or Creative Business; registry + initial design draft saved in one transaction; Studio opens automatically |
| Repeat submit | In-flight latch stays locked until navigation; conflicts checked in database |
| Reopen native business | Card opens Studio directly; separate Manage site record edits registry metadata |
| Duplicate name/URL | Friendly409; names use case/whitespace normalization; URL identity ignores scheme/www/default port/trailing slash within the same workspace |
| Save unchanged draft/record | Disabled; successful saves update local version before refresh |
| Leave dirty editor via link/sign-out | Confirmation offers cancellation; reload/close retains browser warning |

Professional Practice uses restrained editorial typography, arches, square actions and ruled services. Local Services uses a house illustration, rounded surfaces, cards and sans-serif. Creative Business uses a dark masthead/hero, expressive type, large geometric art and contrasting project blocks. The shared renderer/section system still preserves content during design/layout switching. Demo text is fictional; no fake client reviews are introduced.

## Required operator setup

1. Back up the existing Supabase project and confirm applied migrations. Founder reports022 was already run. If001–022 are applied, run **only `supabase/migrations/023_creation_integrity.sql`**, complete file, once in SQL Editor. Do not rerun applied001–022. If prerequisites are missing, reconcile and apply only missing files in ascending order. A fresh database needs001–023 in order.
2. Keep the original001–022 files as history.023 preserves all existing rows/drafts/versions, including duplicates. It adds integrity checks and the atomic business-creation RPC.
3. Optional read-only review: `supabase/operator/023_review_duplicate_records.sql`. This only lists duplicate groups. Do not run tests/tools fixtures in production. Rename conflicting labels through Manage site record where appropriate. Equivalent external URLs need reviewed operator reconciliation; no automatic deletion or draft purge is performed.
4. Merge the cumulative package into the same repository and redeploy public web. Keep `apps/web` and `apps/admin` as the two Vercel roots. Keep real environment values; no new API/environment key is required. Admin implementation remains unchanged. The rebuilt public docs show1.10 and41 sources.

## Founder manual tests — record results in23

| ID | Steps | Expected result |
|---|---|---|
| MT-033 | Sign in, visit `/`, `/templates`, then sign out and revisit | Account name/email replaces Sign in while logged in; signed-out state restored |
| MT-034 | Visit `/workspaces?journey=new` with an existing workspace; click its card | Existing cards dominate; card opens overview, no forced creation; extra workspace action is in sidebar |
| MT-035 | Open Add a site, switch starting point/type, inspect sidebar | Only Add a site active; Your sites opens actual list |
| MT-036 | Create each of the three designs using distinct test labels; double-click once | One record and version1 saved draft; direct Studio; chosen template persists after reload |
| MT-037 | Try repeated name with case/space changes, same external URL under another label, www/http/trailing-slash alias; try conflicting edits/rename | Friendly conflict; no extra record/orphan; different workspaces can use same site label |
| MT-038 | Edit draft→Save→reload; repeat unchanged Save; dirty link/sign-out cancellation; two-tab stale save | Changes persist; unchanged button disabled; cancellation stays in editor; stale save preserves edits with conflict |
| MT-039 | Inspect three demos and saved designs on desktop/phone, section switching, photos/no photos, keyboard | Distinct styles, readable responsive content, content preserved, no horizontal overflow |
| MT-040 | Repeat viewer/outsider, inherited portfolio and separate admin checks | Unauthorized writes/reads denied; portfolio workflow intact; public `/admin`404 |

Record actual deployment origin, package, browser/device, report/test time, tester and redacted screenshot/log. A broad 'working' report cannot pass an unperformed security case. Current MT-033–040 are pending founder acceptance.

## Reproducible local verification

Run root `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm check:boundaries`; build both apps. SQL: `node tools/phase1-verification/run-sql.mjs --report <output.json>`. Uses isolated PGlite/fake Auth settings, not real PostgREST/concurrency proof.

Authenticated UI harness requires a dedicated local build with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:3192` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=bizoveya-local-fixture-key`, then `node tools/phase1-verification/run-auth-browser.mjs --out <output-directory>`. Set BROWSER_EXECUTABLE_PATH to an installed Chromium if necessary. Harness starts fixture3192 and public app3190 itself, using synthetic accounts/data. Never deploy this local build or fixture values. Rebuild normally for deployment. Screenshots/reports are delivery evidence, not new product routes.

## Remaining limits

Browser Back/Forward within the Next SPA is not intercepted by the link/sign-out guard; save or download before using it. No business publication, custom domains, enquiry-form backend, image uploads or business AI agents are added. Existing duplicate rows are retained for reviewed cleanup. Real hosted Auth/RLS/MFA and simultaneous API-request checks remain founder/operator gates; local fixtures cannot certify those. P02.2 and the parent grand phase stay unaccepted.
