# Design, templates and brand

## Private media storage — P04.3.4.4b

Storage/version/review source exists without a media selector or renderer. Existing v1/v2/v3 visuals, templates and PNG/PDF exports remain unchanged. Visual media references require a later compatible schema. See [60](60_PRIVATE_MEDIA_STORAGE_AND_SERVER_ACCESS.md).

## Private media foundation — P04.3.4.4a / 2026-10-10 PKT

PNG/JPEG upload descriptors are defined with bounded size/dimensions and alternative text; no upload or image rendering is enabled. Existing templates/visuals/exports stay unchanged. A future visual schema must preserve old saved documents. See [59 Private media foundation](59_PRIVATE_MEDIA_CONTRACT_FOUNDATION.md).


## Current template checkpoint — 1.26 / P04.3.4.2

Shared Classic card, Midnight card, Editorial frame and Bold headline designs are implemented for two Pinterest graphics, the six-slide carousel and a new1080×1080 LinkedIn image. Selection changes design only; it does not regenerate text or call a provider. Existing saved v1 scenes/history stay intact. Owner explicitly adds templates/LinkedIn image, reviews and saves a v2 document as a new visual version. Additive040 after039 extends strict validation while retaining original access/source-review/conflict/no-op/version limits. No existing migration/row/history is rewritten.

Founder earlier MT145–147 remain reported passed. New MT152–155 and older MT148–151/unevidenced negatives/commercial blog depth remain pending. [51 Template selection and testing](51_VISUAL_TEMPLATES_AND_LINKEDIN_IMAGE.md) has four steps and every new field sample. No new key/environment/provider/integration/publishing. Personal reusable templates, AI artwork, voice/office/custom agents remain planned in50. Next: founder template/save/refresh/export checks; then separately scope P04.3.4.3 ownership/version contracts, not automatic implementation. This latest block supersedes older current instructions while preserving discussion history.


## 2026-10-08 evolution update — planned direction

Planned campaign visual families: headline, tip, checklist, comparison, quote and editorial/abstract, adapted where suitable to Pinterest, LinkedIn image/carousel. Personal templates and brand values are independent of shared catalog. Preview/export fidelity, overflow, contrast and reduced motion are acceptance criteria. Cartoon agency rooms remain optional future UI. Existing business-site templates are a separate catalog; variety does not prove unique artwork or audience conversion.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Historical contract — package1.15 / P04.2.1

Reuse separate-admin dark/light styles and rule-room responsive panels; labeled profile fields/history, explicit configuration-only warnings, busy guard/dirty edits, current reference state/version, review checkbox and reason. Existing public marketing/UI unchanged.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

Agent pages use existing dark/light dashboard tokens, native labeled inputs, disabled busy/unchanged actions, explicit draft/checked/preview labels, responsive panels and version history. No simulated running status. Review reasons and actor timestamps are visible to administrators only.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

Knowledge room uses workspace dark/light tokens, metrics, source cards, source/fact editor, owner approval, revision history and cited lookup cards. Responsive layout collapses below1000/650px. Empty/error/conflict/viewer states and disabled busy/unchanged actions are explicit.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Wellness: spacious serif, botanical artwork and rounded contact arch. Academy: bold sans, book illustration, outlined cards/offset shadows. Product: dark application motif, luminous accent and bordered feature panels. All palettes and section tones remain editable; product muted/base/soft/accent contrast uses appropriate tokens. Public H1 and preview H2 share typography. These are design choices, not surveyed demand claims. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Studio publication card supports the existing light/dark workbench palette, explains saved/live divergence, disables unsafe actions and shows unknown status on fetch failure. Public pages preserve each business family with a semantic first HeroH1, customer-facing contact action, no edit controls or author placeholders, and responsive layout. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

Three families now have different design systems rather than only accent changes: Professional Practice has a restrained serif/arch motif, square actions and open ruled service columns; Local Services has a friendly house illustration, rounded hero/card/FAQ surfaces and modern typography; Creative Business has a dark masthead/hero, expressive editorial type, oversized geometric artwork and contrasting project blocks. Shared content/section renderer is retained. Users choose a design during site creation and can later change it without losing sections/content. Founder visual approval remains pending.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

Three coherent business recipes: Professional Practice (mint/editorial/split/cards), Local Services (blue/modern/centered/list), Creative Business (amber/editorial/expressive hero/project-led/rows). Palette and typography are site-wide; each section has base/soft/accent backgrounds. Layout thumbnails make switching discoverable. Controls support keyboard focus; testimonials use manual navigation, no autoplay. Photos optional; text-only layouts supported. Mobile canvas uses container queries. These are starting recipes, not guaranteed conversions or final owner-approved branding. Founder should review all three designs on desktop/phone and supply real images and facts. Logo and commercial identity remain provisional.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Main marketing design uses dark forest #0B1515, mint #BCE8C9, a light ivory variant and editorial Georgia/system-font typography. Provisional B-letter mark, not finalized logo. Dark/light theme persists under bizoveya-public-theme. Business template uses an ivory surface and constrained mint/blue/amber accents. Explicit labels, visible keyboard focus, mobile stacking and no required animation. Sample company Northline Studio is fictional. Service Studio includes hero, services, optional about and contact; testimonials/FAQs/trust evidence remain future approved-content work. No invented customer claims.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.1. Bizoveya is a provisional name. Logo, colors, domain and final messaging are open.** Existing Voxfolio styling and 3D experience are inherited, not a mandatory business-site aesthetic.

## Experience principles

Lead with the business outcome and the two clear entry choices: **Create a website** and **Connect an existing website**. An owner sees site, task, approval, spend and result in one place. The core path works in text/keyboard mode; voice and 3D enhance it when available. Show preview versus confirmation as separate actions, retaining V27.12's explicit template confirmation. Clearly distinguish draft, approved and live states and show what an agent can change before connection.

## Visual requirements

Create at least one service-business template with strong hero/offer, services, trust/evidence, FAQs, contact/lead CTA, mobile navigation and page metadata. Preserve portfolio layouts for personal users. Template choice should preview with real owner-approved content, responsive breakpoints and accessible focus states. Dashboard uses a consistent site switcher, route breadcrumbs, task timeline, approval cards and explicit connection health. Loading, empty, error, conflict, revoked grant and paused-task states need designs. Respect reduced motion, keyboard focus, contrast and readable typography; a 3D scene must have a usable non-3D path.

## Brand decision register

| Item | Current position | Decision evidence needed |
|---|---|---|
| Name | Bizoveya, working; inspired by business + via/path | Pronunciation/customer comprehension; domain/trademark review before commercial launch |
| Old identity | Voxfolio retained in source/history and portfolio product until planned migration | User journey and SEO/route redirect plan |
| Logo | None selected | Wordmark and compact mark at favicon/app icon size, monochrome and contrast tests |
| Colors/type | Not selected | Compare 2–3 directions on business landing, dashboard and native template |
| Tagline | Candidate: “Build, connect and run your business online.” | Customer comprehension and truthful scope at launch |

**Owner design choices requested:** choose among two or three annotated design directions, preferred first business template industry/example, desired emphasis on friendly versus premium/technical, and whether Voxfolio branding appears as “Portfolio by Bizoveya” during transition. These are open decisions, not blockers for document drafting. Avoid using unverified customer logos/testimonials or invented metrics.

## P01.0 document-room visual pattern

The first Bizoveya UI slice uses a calm slate/teal documentation palette, readable cards, prominent status labels, search, activity and phase summaries, responsive document navigation and accessible focus outlines. This is **not** a final product logo or general dashboard design system. Future design review may revise color and layout while retaining the same Markdown source contract.

## Document-room visual direction (P01.1 provisional)

Use a calm indigo/teal command-center palette with an accessible light/dark toggle, responsive cards, restrained graphic motif and readable long-form typography. The palette is a working interface direction, not the final Bizoveya brand or logo. Phase graphics and activity cards must derive from Markdown, expose explicit labels and never imply an accepted phase from a documentary substep. Dark mode stores a local preference and re-renders Mermaid diagrams in the matching theme. Provide keyboard focus, reduced-motion support and print styling. Owner visual approval remains pending.

## Admin UX and visual discussion requirements (planned)

Keep platform administration visually distinct from client workspace actions: visible role/environment, active/draft versions, saved-case results, change reason, affected scope, activation/rollback, masked credential status and explicit failure states. Show metrics with definitions and freshness; never imply login counts are live presence. Template editing previews supported content/layout before activation. Do not reuse the public docs route for admin management.

The existing document dashboard now projects the founder discussion, backend contract, new ADR and expanded logs from Markdown. Their tables, section reading maps and diagrams are shareable plans. This is not a new UI design implementation. Founder should later review admin navigation, role labels, secret entry/rotation UX and version comparison alongside template and brand choices already open. Logo/name selection remains provisional.

## Package 1.3 transition and impact synchronization

Planned workspace navigation shows implemented versus unavailable capability honestly, including empty/loading/error/denied states. New template selection follows a versioned catalog shared with voice tools and QA. Unsupported layouts require code, not a new admin text field. Preserve legacy UI until transition behavior and owner review are verified; no logo or final brand decision is implied.

## Package 1.4 — first practical workspace implementation

Implemented workspace UI uses a scoped dark-default dashboard with persistent light/dark preference, responsive sidebar/mobile navigation, cards, data-derived site counters, mode/status badges, clear registration choices, form feedback and focus/skip navigation. No charts of invented revenue/usage appear. The typographic B tile is a temporary interface mark, **not a finalized logo**. New pages use Bizoveya metadata; the root application name changes to Bizoveya while inherited portfolio screen titles/branding remain as the legacy module.

Visual content tests verify read-only/planned labels, viewer empty-state behavior and actual site counters. Browser viewport, focus traversal, theme persistence/hydration and screenshots are pending because no usable browser runner is present. Do not label the UI pixel-verified or supply synthetic screenshots.

## Package 1.5 — operator dashboard design

The admin area has a distinct scoped dashboard, dark-default palette, persistent light preference, responsive navigation, actual metric cards, explicit planned-capability cards, an access-event timeline and a focused authenticator screen. UTC times and metric definitions are visible. Navigation provides keyboard focus, skip link and named controls. No synthetic trend chart or online-user metric is displayed. Static render tests cover labels, escaping and data-derived values; actual browser/mobile/theme/MFA review remains pending. The temporary B mark is unchanged and remains provisional.

## Package1.6 — visual truthfulness and browser review

The existing visual design is preserved. Fixed release1.1/24-document labels discovered during actual browser inspection are replaced with current package/inventory projections on overview and detail pages. Phase summary wording no longer hardcodes P01.0's historical browser-review status. Screenshot and interaction evidence for desktop/mobile, themes, document navigation/search/diagrams and setup screens is recorded in `docs/delivery/P01.6/`; it does not depict authenticated admin/client data. Branding/logo decisions remain provisional.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
