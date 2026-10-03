# Business publishing and manual testing

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Current contract — package1.13 / P03.1

Knowledge approval is not website publication. Existing public snapshot/privacy/contact/conflict tests remain pending. Public reader payloads and RPCs are unchanged; private sources/facts never joined into public snapshots.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Publishing remains the1.11 contract, now supports all six IDs after025. Combined setup and deferred test order is30. MT041–047 still pending; old publication snapshots retain their original design until explicit republish. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

Living first draft for package1.11 / P02.3.1. Founder: Sufian Mustafa. No remote migration or customer site publication performed by the assistant. Earlier acceptance remains pending.

## What users can now do

Save a native business draft, review it, explicitly publish a visitor snapshot at `/sites/<site UUID>`, inspect it without signing in, publish saved changes, or unpublish it. Owners/editors can act; viewers can inspect draft/publication state but cannot act. Demo pages and external registry sites cannot publish through this workflow.

The UUID URL is stable across business-name changes. Friendly slugs/customer domains require a later alias, uniqueness, DNS/TLS and ownership policy; these are not configured automatically. The same public Vercel deployment serves these pages; publishing does not create another Vercel project. Existing admin remains a separate app without visitor routes.

## Required manual setup

1. Back up your shared Supabase database and confirm applied migration history.
2. If001–022 are applied, run023_creation_integrity.sql first, then024_business_publications.sql, each complete file once. If023 is already applied, run only024. Fresh database needs001–024 in order. Do not rerun applied files or paste tests/fixtures into production.
3. Merge this cumulative ZIP into the same Git repository, preserving private env and local changes. Keep Vercel roots apps/web and apps/admin; rebuild public web. Admin has no implementation change.
4. Keep real Supabase settings. No new API/secret is needed. Set existing NEXT_PUBLIC_SITE_URL to the real public origin for canonical links; rebuild when changed. Without that variable, this page omits explicit canonical rather than inventing a domain.
5. Test on a staging deployment first. Publishing there makes a real visitor page accessible on that deployment and indexable. Only publish information you intend to share.

## User walkthrough

Open a business Studio. Add approved business facts, actual contact email or callable phone, show Hero and Contact. Hidden sections are omitted from anonymous source data. Review images/testimonials for permission. Save draft, then Publish website and confirm. Open public website in a separate signed-out browser. Inspect desktop/phone, links and metadata.

Draft changes remain private even after Save. Publish saved changes explicitly updates the live snapshot. Changing palette, sections or business name behaves the same way. Publication version and draft version are independent; unchanged republishing is disabled and is a database no-op when versions match.

Unpublish makes new visitor requests return404, keeps private draft and full member-only publication history, and increments publication version. It cannot remove already downloaded screenshots/content or search-engine caches; a previously open visitor page remains visible until refreshed. Registry status such as paused is metadata and does not unpublish a site: use Unpublish explicitly.

Status unavailable means the publication read failed; do not assume the site is private. Resolve setup/connectivity or conflict, Refresh publication status, and check the visitor URL. Conflict never silently overwrites another publisher. Save/download before browser Back/Forward, which still has the documented unsaved-edit limitation.

## Architecture and privacy

| Layer | Contract |
|---|---|
| Protected GET/POST publication API | Scoped membership and request validation; expected draft/publication versions |
| Transactional024 RPC | Site-row lock serializes draft saves/publish; owner/editor membership; readiness; current state plus action history |
| Private full snapshot/history | Member SELECT only; no direct client writes or anonymous table grants |
| Anonymous reader RPC | Active snapshot projection only; strips hidden sections, unused About/services and unused image/item fields |
| Next visitor page | Anonymous credentials without member cookies; no-store/force-dynamic; metadata/render request memoized |
| Shared renderer | Business styles, first HeroH1, email/call actions, no editor controls/author placeholders |

Public data includes visible business/contact information and approved external image URLs. Browser downloads images from their hosts. No server fetch of customer documents, tracking analytics, enquiry form inbox, CMS connector or agent is added. Publication history is readable in SQL by authorized members; a history/rollback UI is future work. Unpublish + edit + republish is supported; old revision restore can use reviewed draft data, not an invented rollback button.

## Founder manual test checklist

| ID | Test | Expected result | State |
|---|---|---|---|
| MT041 | Apply only missing023/024; open native Studio and reload | Draft retained; publication status loads; no migration error | [ ] pending |
| MT042 | Hide Hero/Contact or clear contact; edit without Save; cancel confirmation | Publish blocked until ready/saved; canceled confirmation creates no public page | [ ] pending |
| MT043 | Publish approved email-only and phone-only test sites; open signed out | Correct template, H1/title/description, mailto/call links; no editor instructions | [ ] pending |
| MT044 | Save changed brand/layout, inspect public URL, then republish | Old live snapshot until explicit republish; new snapshot afterward | [ ] pending |
| MT045 | Two tabs publish/save conflicting versions | Conflict shown; no silent overwrite; Refresh state enables reviewed retry | [ ] pending |
| MT046 | Hide a section containing distinctive private text; publish; inspect RPC/page source | Hidden text and unused private fields absent; full member history preserved | [ ] pending |
| MT047 | Viewer/outsider/direct API tests; Unpublish; fresh signed-out request; old portfolio/admin regression | Unauthorized action denied;404 after unpublish; draft/history intact; inherited workflows preserved | [ ] pending |

Record package, deployment URL, browser/device, precise report date/time, founder/tester, result and redacted evidence in23. Do not mark unperformed security cases passed. Local fixtures cannot certify real Supabase Auth, PostgREST or simultaneous sessions.

## Local verification and evidence

Run pnpm test/typecheck/lint/check:boundaries and both app builds. SQL runner automatically includes024 and its assertions; only use isolated fixture databases. Browser harness run-auth-browser.mjs covers original1.10 customer journey plus publication confirmation, save/private/republish/offline paths with synthetic Supabase fixtures. A dedicated fixture build is required as27 explains; never deploy those values. Current reports/screenshots are in docs/delivery/P02.3.1 and its verification JSON.

Verified local delivery:301 unit tests,33 SQL steps,33 browser checks, zero browser page errors,10 screenshots, both builds/typecheck/lint/boundaries passed. These counts describe isolated local evidence, not hosted acceptance.

## Remaining phase work

P02.3.1 source is implemented, founder acceptance pending. P02.3 parent remains open for further contact delivery/domain policy and hosted acceptance. P02.4 template expansion and P03 knowledge/agent prerequisites remain next planned work; no agent is claimed in this release. Documents evolve with each implementation and explicit owner instruction.
