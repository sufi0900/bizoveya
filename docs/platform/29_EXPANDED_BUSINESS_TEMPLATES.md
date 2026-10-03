# Expanded business templates

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Current contract — package1.13 / P03.1

Six templates remain unchanged in1.13. Knowledge link works independently of template choice/site mode. MT048–052 still pending; continuation does not accept template designs.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

Living first draft — package1.12/P02.4. Owner: Sufian Mustafa. Source implementation and local checks are separate from manual acceptance. Design choices can be revised with future owner instructions.

## Six design families

| Design | Suitable starting point | Visual treatment | Route |
|---|---|---|---|
| Professional Practice | Consultants, professional service firms | Editorial arches and ruled sections | /templates/service-studio |
| Local Services | Maintenance, cleaning, neighbourhood services | Rounded panels and house illustration | /templates/local-services |
| Creative Business | Studios, designers, project-led services | Dark masthead, expressive geometric artwork | /templates/creative-business |
| Wellness Studio | Wellbeing/personal care service presentation | Spacious serif, botanical illustration, curved contact panel | /templates/wellness-studio |
| Education Academy | Tutors, training providers, academies | Bold sans, book illustration, outlined learning cards | /templates/education-academy |
| Product Launch | Software/startup product presentation | Dark feature panels and decorative application motif | /templates/product-launch |

These are presentation starting points, not complete vertical applications. There is no booking scheduler, payment checkout, student portal, membership platform, product demo backend or automatic integration. Contact actions use approved email/telephone. Artwork is decorative, not actual analytics. Demo businesses are fictional and contain no invented results/reviews; real sites start with owner-editable placeholders and approved content.

## Shared implementation

businessPresets and presetIds in domain/business.ts define IDs, recipes, labels and metadata. BusinessTemplatePage composes demos once; the three old static URLs and three new catalog-derived URLs reuse it. RegisterSiteForm reads all six radio choices. BusinessWorkbench reads the same presets. BusinessPreview shares all eight section types and nineteen layouts, selecting family CSS/artwork. Publication schemas use the same domain document. No independent hardcoded builder per vertical.

025 expands the existing immutable validator with three IDs; all other limits/security checks remain unchanged.001–024 remain byte-identical. No row rewrite or version bump is performed by migration. Older drafts, full publication history and anonymous sanitized projections stay compatible. Do not downgrade public code to1.11 after writing new IDs without a compatibility plan.

## Preservation and customization

Changing preset rearranges recipes/styles and retains text, photos, service/contact values, IDs and extra sections. If a twenty-section page cannot fit required recipe sections, the change is rejected without dropping content. Brand palettes/fonts and section layout/tone are adjustable. Draft changes do not modify visitor snapshots until republish. Public HeroH1 shares the preview typography. Product base/soft backgrounds use light text; accent sections use dark ink for contrast.

## Manual tests

| ID | Action | Expected result | State |
|---|---|---|---|
| MT048 | Open all six catalog demos, switch desktop/mobile and light/dark shell | Distinct family appearance, readable text, no horizontal overflow | [ ] pending |
| MT049 | Enter through each new demo CTA; create from workspace directly too | Six choices, selected design retained, one saved record, direct Studio | [ ] pending |
| MT050 | Edit text/photo/optional sections; change through all presets and undo | Owner content retained; no silent drop or invented testimonials | [ ] pending |
| MT051 | Save/reload/publish each new design, edit private draft, republish | Same family in Studio/public, old snapshot until explicit update | [ ] pending |
| MT052 | Change Product palettes/hero/section tones, inspect wellness/academy and old sites; unknown slug | Legible text, no false booking/checkout controls, old workflows intact; unknown404 | [ ] pending |

Use30 for the single combined manual session. Automated loops and fixtures support implementation evidence; real browser/Supabase acceptance still belongs to the founder/operator.

## Next planned work

P02.4 source delivered, acceptance pending. Next planned core work is P03 approved, site-scoped business knowledge, followed by configurable agent runtime P04. Enquiry forms and custom-domain policy remain separately scoped P02.3 follow-on items. No agent implementation is claimed here.
