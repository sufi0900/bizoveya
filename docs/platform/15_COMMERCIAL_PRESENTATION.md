# Bizoveya presentation content inside the document room

## 2026-10-08 evolution update — planned direction

Position the long-term concept as a proposed founder-led digital agency with private reusable design assets and transparent workflows. Only private text generation and current visual composition are demonstrated. Do not market voice office, autonomous hiring, subscription-backed images, automatic publishing, unlimited credits or guaranteed visual uniqueness as available. Commercial gates include outstanding account/conflict/mobile checks, short-blog depth, fresh-user usability, measured cost and support/privacy policies.

See [50 Evolution record](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Older dated contracts remain historical where superseded.

## Current contract — package1.17 / P04.0

P04.0 adds an admin-only model connectivity room at /admin/model-tests and /api/admin/model-tests. The saved provider/model uses the AI SDK with fixed OpenAI, Nebius Token Factory and Gemini adapters. It sends a fixed synthetic prompt, requests128 output tokens, waits20 seconds, makes no automatic retry/fallback, and stores redacted results with profile/reference versions, actor, reason and timestamps. No customer knowledge or prompt is sent. This is connectivity evidence, not quality evaluation, agent activation or a spending-budget implementation.

Live tests default off. Explicit operator setup requires the selected private provider key plus an admin-only SUPABASE_SERVICE_ROLE_KEY for server-attested result recording, then BIZOVEYA_ENABLE_MODEL_TESTS=true and per-request pricing/charge acknowledgement. No secret-entry form exists. Named current admin+AAL2 is required; client roles cannot mark results passed. Additive030 enforces one running test and five attempts per UTC day platform-wide, durable request IDs, expiry/unknown states and version-sensitive evidence. Failures/unknown attempts still consume the attempt allowance and may be billed. Existing dailyBudgetCents remains planning metadata; monetary enforcement precedes customer runtime.

Read36_MODEL_CONNECTIVITY_AND_TESTING.md for exact setup, supported evidence and MT087–094. All1.16 tests and earlier unevidenced founder gates stay pending; the founder is currently testing and has supplied no new pass results. Preserve001–029 and historical files. One cumulative ZIP/repository and the same two Vercel roots. No hosted SQL/deploy/provider request was performed by the assistant. Next implementation dependency: reviewed exact-model evidence, agent/profile binding, enforced monetary limits and durable draft runs, then visual output composition. The35 draft-only pilot and34 Studio/removal scope remain in force; publishing remains deferred.

Earlier release contracts below are historical and superseded where they conflict with this current contract.


## Historical contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Historical contract — package1.15 / P04.2.1

Demonstrate model candidate/profile history and credential metadata preparation only. Do not claim configurable working AI provider, spend enforcement, automatic API-key rotation or autonomous tasks. P04.1 context previews remain the customer-visible readiness feature.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

## Historical contract — package1.14 / P04.1

May demonstrate rule configuration and approved context readiness as implemented preview-only functionality. Do not claim autonomous agency, live reasoning, scheduling, provider connections or cost savings from model execution at this stage.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

## Historical contract — package1.13 / P03.1

May demonstrate private text-source preparation/review/revisions/site-scoped approved lookup as implemented. Do not advertise PDF/OCR, semantic RAG, production security acceptance or functioning AI workforce from this delivery.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

Demonstrable source: six design families plus snapshot publishing. Show actual capabilities and explain contact-based flow. No claim of product-market validation, booking/commerce/LMS or agents. P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

New demo path: sign in→workspace→create business→approve contact/content→Save→Publish→open signed-out visitor URL→edit private draft→republish→Unpublish. Show actual snapshot boundary, metadata/contact and redaction evidence. Do not claim custom domains, enquiry forms or AI employees exist. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.



## Historical contract — package1.10 / P02.2.Fix-1

Current demonstration should show account-aware entry, returning workspace overview, three visually distinct business designs selected in creation, direct Studio entry, section customization and private Save/reload. These are builder/workspace capabilities; business publication and AI workforce remain future work. The presentation remains an in-app Markdown projection. New visual examples are in delivery evidence; old 1.9 screenshots retain their historical label.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

Current demonstrable builder capabilities: three business starting designs, eight reusable section types, nineteen layout choices, shared brand/contact facts, undo/redo, mobile preview, private saved drafts and JSON backup/restore. Explain portfolio inheritance separately. Position ongoing controlled operations as roadmap; competitors already offer AI capabilities, so do not claim exclusivity. Use actual P02.2 screenshots under delivery evidence and clear fictional-demo labels. No new PDF, external Sites presentation or live URL is created.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Present the current product as: "A workspace to organize your websites and shape your business website draft." Demonstrable now: branded entry, category gallery, editable fictional sample, private draft UI, existing portfolio Studio and visual docs. Upcoming: publication, approved knowledge, agent workforce, channel integrations. Use P02.1 screenshots as source-verified UI illustrations; hosted save/AI claims require their own proof. No PDF or separate Sites presentation is created in this delivery.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Revised for package 1.0.** The six-page PDF created in package 0.5 was withdrawn by owner direction. The commercial story should be a **visual section in the Bizoveya application**, sourced from the living Markdown and real implementation evidence. The current document room provides a readable page for this narrative; a dedicated presentation mode with richer diagrams/screenshots can evolve after features are implemented. Do not treat a draft PDF or presentation as an independent source of truth.

## Working story (vision, not launched product)

1. **Problem:** A business may need a website or may already have one, but content, customer conversations, providers and repetitive work are fragmented. This is a product hypothesis, not a measured customer survey.
2. **Two paths:** Create a native business website or connect the existing site without forced migration. Both map to one workspace, distinct site permissions and approved business knowledge.
3. **Governed work:** An owner requests a bounded task, reviews a proposal, decides whether to approve external effects and sees a recorded result. AI output is not automatically a published result.
4. **Early proof:** The inherited Voxfolio app demonstrates portfolio onboarding/Studio/publication code; Bizoveya P01.0 adds a public document room. Business onboarding, connected-site editing and agents remain planned.
5. **Commercial validation:** Show a real customer outcome and cost/permission boundaries before pricing or promising all-channel automation. No invented screenshots, customer logos, metrics or testimonials.

## Visual updates per phase

Replace the initial conceptual cards with captured, annotated Bizoveya screens only after they exist and pass manual review. A screenshot record needs route, product version, viewport, owner permission and date. Every claim has a status tag (`verified live`, `verified in code`, `proposed`) and a canonical source. A future present/print mode can use a route within `/bizoveya/docs`, with page break controls and an optional downloadable PDF generated from the same Markdown; it must not overwrite the documents or drift from the current package. For now, open this file in the document room as the live visual working copy.

## Revised story: supervised operations and configurable quality

Planned product story now includes clients supplying business preferences, a coordinator delegating bounded work, QA judgment plus deterministic checks, and authorized administrators improving defaults through tested versions. Model providers are replaceable evaluated components; Bizoveya's value must be demonstrated through a useful outcome and operating controls, not a claim of proprietary model intelligence or guaranteed uniqueness.

Possible future visual sequence: client request → scoped specialists → QA finding → approval → recorded result; alongside a compact admin version comparison. Use actual screenshots only when implemented. Package 1.2 supplies the founder discussion/backend diagrams as conceptual visuals; it does not create admin screenshots or a new PDF. Competitive claims must distinguish official capabilities, untested integrations and our own hypotheses.

## Package 1.4 — first practical workspace implementation

**Implemented in code:** multi-workspace/site registry and two starting paths, read-only external URL registration, owned portfolio links and native business planning records. **Local evidence:** 214 tests and type/lint/build/projection outcomes in delivery verification. **Pending:** live database migration, browser walkthrough and deployment acceptance. This is an early foundation, not a launched commercial product. Business builder, customer knowledge, workforce, CMS/social writes and platform admin remain roadmap claims. Do not add “connected” or “automated” labels to simple URL registration, or invent screenshots/client metrics.

## Package 1.5 — presentation content boundary

Available source demonstration: a protected operator overview with real registry counts and an admin-access audit timeline. Use a configured staging environment and approved demo records after live acceptance. Clearly mark AI configuration, credentials, templates and run controls as planned. The control shell is not proof of business growth, online users or autonomous work. Never include MFA QR codes/setup keys or real private audit subjects in public presentation screenshots. No separate PDF or Sites copy is created.
