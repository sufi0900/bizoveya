# Site modes and external connectors

## 2026-10-08 evolution update — planned direction

Template graphics need no image provider. Future uploaded/AI artwork and voice each require independent storage/auth/capability/cost proof. Optional per-user ChatGPT plan access is not a social connector, access to memories, image-generation engine or automatic hosted-app eligibility. CMS/social writes need explicit account scopes, approved action policy and receipt/readback. No new connector exists here.

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


## Current contract — package1.13 / P03.1

All registered native/external/portfolio modes can store site knowledge. This never fetches or logs into the registered website. Linking a portfolio does not grant its original editor permissions. No connector/browser automation/model access is inferred.

P03.1 adds a private knowledge room to every registered site mode. Sources may be pasted or imported as UTF-8 .txt/.md, reviewed as editable fact candidates, saved with revisions, and explicitly approved by the workspace owner. Changes remove approval; retrieval is authenticated, current, approved-only and site-scoped. Editors draft; viewers read; only owners approve/revoke/delete. No model call, API key, embeddings, PDF/OCR, public chatbot or automatic website update is added. Additive026 supplies private sources/revisions/content-free activity events and membership-gated RPCs. See31 for behavior and30 for all pending manual/setup steps. All previously deferred founder tests remain pending.

Earlier sections retain historical delivery context and are superseded where they conflict with this current contract.

## Historical contract — package1.12 / P02.4

P02.4 adds Wellness Studio, Education Academy and Product Launch: six business families total. One catalog drives schema, template pages, creation and Studio; the shared section renderer also serves published snapshots. Additive025 expands accepted IDs without rewriting old data. Eight section types/nineteen layouts remain unchanged. No booking, checkout, LMS, enquiry inbox, custom domains or agents are added. See29 for template scope and30 for the combined pending setup/tests. Manual acceptance remains pending.

Older delivery sections retain history; this current contract supersedes conflicting capability/setup statements.

## Historical contract — package1.11 / P02.3.1

Native business can publish to the public application visitor path. Registration status is registry metadata, not publication status. External registered sites are unaffected and cannot use this native publication RPC; portfolio uses its original controls. Native business publishing now uses an explicit saved snapshot and `/sites/[siteId]` visitor route. Saves remain private; publishing/republishing/unpublishing use membership checks, draft/publication version conflicts, and additive024. Hidden sections are removed from anonymous payloads; full snapshot history stays member-only. Owner/editor can publish; viewer cannot. Custom domains, enquiry-form delivery and AI agents remain planned. See28 for setup/manual acceptance and ADR-0008 for architecture. Admin app and inherited portfolio remain unchanged.

Earlier release sections retain history and are superseded where they conflict with this current contract.





## Historical contract — package1.10 / P02.2.Fix-1

External registration still saves a public URL only. Equivalent HTTP/HTTPS, www, default-port and trailing-slash URLs in the same workspace are rejected even under different labels. Other subdomains and distinct path case remain separate. Native business creation opens Studio with the selected saved design; native portfolio linking opens the owned inherited Studio. No remote URL fetch, login, connector grant or publication is introduced.

Earlier release sections retain history; this current contract supersedes conflicting behavior descriptions.

## Historical contract — package1.9 / P02.2

The modular editor applies only to `native_business`. Existing/external sites remain registry entries; this release does not edit their GitHub, Sanity, Vercel or content. Native portfolio retains the inherited workflow. Three business presets do not create new site modes. External HTTPS image references load directly in the browser with Next Image unoptimized; there is no media upload connector or server-side fetch added.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Native business mode now has a private Service Studio draft editor after migration021. External sites remain registration-only; entering a URL never grants CMS/Git/social access. Native portfolios keep their existing project owner and Studio controls. Business draft editing does not create a publication or custom domain. Connector consent/capability plans remain deferred.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.1.** Existing `/api/connect/*` routes in Voxfolio do not constitute a complete GitHub/Vercel/Sanity connector. Verify each integration with an authorized test account and explicit capability probes.

| Mode / adapter | Read | Draft/propose | Publish/merge | Source of truth and proof |
|---|---|---|---|---|
| Native portfolio (inherited) | Current project/API | Studio commands/revisions | Snapshot publish with owner | Supabase; baseline regression pending |
| Native business (proposed) | Typed pages/services | Preview/revision | Owner approved snapshot | Supabase; business template proof P02 |
| Public URL only (proposed) | Public crawl with consent/limits | Local proposal | None | External site; mark read-only |
| Sanity (proposed) | Scoped dataset/docs | Mutation to authorized draft, revision check | Explicit owner policy only | Sanity; readback/conflict proof P05 |
| GitHub (proposed) | Selected repo/branch | Branch and PR | Owner review/merge | GitHub; isolated check/PR proof P08 |
| Vercel (proposed) | Selected project/build status | Preview from branch | Deployment controls only after ADR | Vercel; linked preview/status proof P08 |
| Pinterest (proposed) | Authorized boards/pins | Draft/asset handoff | Per-action approval and API capability | Provider; receipt/readback proof P07 |
| WhatsApp/telephony (deferred) | Authorized business account | Simulator/test session | Message/call policy gate | Official provider; account, policy and cost proof P10 |

**Connect** retains existing CMS/repo/deploy; **import** copies selected content with provenance and owner's mapping; **rebuild** creates a new native site under an explicit migration plan. Do not conflate them. Capability discovery must show what is actually connected and what is unsupported. Token grants are per tenant/site/provider, least privilege, encrypted and revocable; credential status is visible without exposing values. Stale revision must stop the write and show diff. Publish/PR operations use receipts and reconciliation. Disconnection stops future work but retains agreed audit and enables deletion/export policy.

| First-party site | Working classification | Open validation |
|---|---|---|
| `doitwithai.tools` | Existing business/content site; first Sanity content proof candidate | Verify actual GitHub, Vercel, Sanity dataset, imported Markdown rules and grants |
| `sufianmustafa.com` | Existing personal/portfolio site | Verify repo/CMS/deploy, content model and desired editable scope |
| LIONXE | Business/framework site, development reportedly paused | Confirm exact active domain (`lionxe.com` versus `lionxeframework.com`), repo and safe read-only start |

A workspace may hold all three. No live site is automatically modified by registration. Future CMS/provider adapters require their own capability contract and acceptance tests.

## Model APIs are separate from customer connectors

Muse Spark/OpenAI/other model credentials do not provide a customer's authenticated CMS, social account or browser session. Connectors require their own supported authorization/capability contract and per-site grants. A custom connector that lets another assistant call Bizoveya is a separate inbound integration; it does not establish outbound delegated access to the assistant's entire runtime. No universal Pinterest editing or logged-in browser access is claimed.

Future admin `/admin/credentials` manages server-backed platform provider references; clients manage their own supported connector grants in site integration views. Rotation/disconnection must stop new use, reconcile already-started actions and keep redacted receipts. Where browser/code execution is needed, evaluate an isolated sandbox and account scope; ordinary CMS API use is not automatically browser automation. See [18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md).

## Package 1.3 transition and impact synchronization

Route registration does not authorize external access. Link each connector action to grant scope, approval/artifact version and receipt as specified in document 19. Connector callbacks/webhooks require their own provider contract and verification later; document 20 does not pretend these are all designed. First workspace registration is URL-only with no external mutation.

## Package 1.4 — first practical workspace implementation

Implemented modes are registry-only `external`, owned `native_portfolio` link, and `native_business` planning record. External URLs are normalized/validated and stored; no DNS lookup, HTTP fetch, login, CMS inspection, import, connector grant or external write occurs. URL eligibility is not ownership verification: the user declares authorization. Future connectors must independently verify capabilities and account grants.

Portfolio registration lists owned projects and rejects another user's project in the DB RPC. Existing site hosting/public URLs remain unchanged. Founder walkthrough: manually register `https://doitwithai.tools/` as business, `https://sufianmustafa.com/` as portfolio, and the confirmed LIONXE domain as business/paused if still paused. Do not assume the previously transcribed Lehonze spelling or a repo/CMS/account connection; confirm the actual domain before entry.
