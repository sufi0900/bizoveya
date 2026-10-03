# Studio corrections and owner site removal

Living first draft. Package1.16 / P02.5. Source delivery and local evidence do not imply founder/hosted acceptance.

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.

## What to install

If001–028 are confirmed applied, apply only supabase/migrations/029_business_studio_and_site_removal.sql, once, in full. Otherwise apply only missing migrations in ascending order. Never run supabase/tests or tools fixture SQL on production. Old001–028 remain byte-identical. Keep the full repository, packages and docs; redeploy both existing Vercel projects (apps/web and apps/admin), even though feature changes are on web. No new env/API key required. Admin local command from root remains pnpm dev:admin; main pnpm dev:web.

## Editor and legacy behaviour

Workspace navigation is collapsed on business /editor entry and available through Show navigation/Hide navigation. Desktop outline, canvas and inspector have independent bounded heights; mobile uses a stacked, individually scrollable canvas/inspector. Title, card surface and keyboard select a section; independent move/hide controls do not also select. Selection scrolls the canvas only and respects reduced-motion preference. Hidden sections remain editable; they do not appear in the canvas until shown.

Homepage rules: at most one hero total, visible hero first, FAQ in last three visible sections. Add Hero inserts first; Add FAQ inserts before terminal contact/CTA where possible. Invalid move/duplicate/hide operations are rejected or disabled with explanation. Existing order/content remains readable; Arrange section order is an explicit undoable edit retaining all IDs/content. Multiple heroes or unusually many ending sections may still need manual removal/reorder. Saving/publishing rejects unresolved order or headline/introduction limits through both application and SQL. Other stored text limits remain unchanged; counter added for headline/introduction/about. An existing oversized headline/introduction is shown unchanged and must be shortened before saving, never truncated silently.

Logo URL is optional public HTTPS and uses containment; hero/about image fit supports crop-to-fill or complete-image, with centre/top/bottom focus. Shared fixed frames preserve layout for portrait/landscape sources. Broken/invalid image references never execute markup; failed images are omitted. Images still load from their supplied host; file upload/media library are not delivered. Header links are homepage section links, not multipage navigation; mobile opens/closes an accessible menu. Only rendered published sections are linked.

Load sample content confirms replacement, preserves business name/logo/contact details, creates labelled illustrative content and participates in session Undo. It is not automatically saved/published. Download existing content first if preserving it beyond the session matters. Illustrative quotes/project stories must be replaced before public use. Template families retain stable IDs and shared components; Professional Practice and Creative Business are the initial digital-service directions. Others remain exploratory, without niche-specific booking/commerce/LMS claims.

## Delete-site workflow and dependency map

Site record -> Manage this record -> Delete site record, visible to workspace owner only. Type current site name and check irreversible-removal acknowledgement. Confirmed DELETE uses same-origin JSON, validated UUIDs, current owner/site binding, expected site-record version and exact-name confirmation. Double click is guarded. Stale version returns409; wrong confirmation400; editor/viewer/outsider cannot delete. DB function locks membership grant, workspace and site, and removal plus event is atomic.

| Resource | Result |
|---|---|
| Registry row | Removed; identity can be registered again |
| Native business draft/publication/history | Cascaded; visitor URL unavailable |
| Site knowledge/source revisions/events | Cascaded for this site |
| Site agent preferences | Cascaded |
| Content-free removal event | Retained with workspace/site UUID, actor and timestamp; owner read only |
| External website/domain/account | Untouched |
| Original portfolio project/publication | Untouched; only registry link removed |
| Other sites/platform agent/model configuration | Untouched |
| Earlier exports/provider backups | Outside deletion operation |

Archive/restoration and future job/media/connector cleanup are planned, not implied. No deletion of remote accounts or original portfolio can be inferred from this control.

## Manual cases (all pending)

| ID | Input / action | Expected |
|---|---|---|
| MT075 | Confirm028 then apply029; deploy full repo to both projects | Existing records unchanged; corrections/deletion available |
| MT076 | Open native business editor; Show/Hide navigation | Starts collapsed; toggle restores sidebar and canvas width; keyboard focus usable |
| MT077 | Click lower card padding, title and keyboard card; then move/hide control | Whole card selects once; controls act independently |
| MT078 | Click distant FAQ/Contact at desktop and390px viewport | Only canvas scrolls to visible selected section; inspector remains usable; no horizontal overflow |
| MT079 | Delete Hero, add Hero; attempt duplicate/move below services; add FAQ/move to top | Hero added first; duplicate/invalid move disabled/rejected; FAQ near end |
| MT080 | Load older invalid-order draft; Arrange order, Undo; correct duplicates/length | Explicit repair retains content; Undo restores; save rejects unresolved rules |
| MT081 | Hero headline120chars/introduction320chars; attempt extra; inspect long-word content | Counter/maxLength; stable wrapping; API/SQL reject larger new writes |
| MT082 | Add own portrait/landscape HTTPS photo; switch fitting/focus; add logo; save/reload/publish snapshot | Fixed frame, intentional crop/contain, shared logo; metadata persists; invalid URL rejected |
| MT083 | Load sample then cancel; accept; Undo; reload after save | Cancel unchanged; accepted content labelled; Undo restores; no automatic publication |
| MT084 | Signed-in /get-started?journey=new&template=creative-business-v1; guest same | Signed-in wording and appropriate workspace link; selected template retained; guest instructions honest |
| MT085 | Create disposable external/native business/portfolio registry records; delete as owner; stale tab/editor/viewer/outsider | Correct scopes removed; external/original portfolio preserved; stale409 and unauthorized denial |
| MT086 | Compare two digital-service designs with same complete content; open mobile menu/dark-light Studio; old portfolio regression | Distinct visual treatment; menu/links work; readable controls; existing portfolio intact |

Record case/package/actor/device/time/URL/expected/observed and redacted evidence. Never remove a real site just to test; use clearly named disposable records. Prior cases remain cumulative in30.
