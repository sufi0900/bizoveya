# Site knowledge — implementation and user guide

## Current contract — package1.16 / P02.5

The initial new-website audience is freelancers, consultants and small digital-service agencies. Existing sites remain niche-independent registrations. P02.5 repairs Studio and adds owner-only permanent site-record removal: collapsible workspace navigation (collapsed on Studio entry), bounded independently scrolling panels, whole-card section selection, canvas-local selected-section scrolling, homepage Hero/FAQ placement rules, explicit legacy order repair, 120-character headline/320-character hero introduction with counters, bounded responsive photo frames with fitting/focus, optional shared HTTPS logo, sample-fill with confirmation/Undo, section navigation/mobile menu and focused Professional Practice/Creative Business styling. Shared rendering serves preview and existing snapshot publication. No silent legacy row rewrite or automatic sample save/publish.

Additive029_business_studio_and_site_removal.sql preserves001–028. It accepts optional logo/photo metadata, keeps legacy read compatibility, enforces editorial rules on new saves/publication, and exposes owner-only version/name-confirmed bz_delete_site. Site removal cascades this site's business draft/public snapshots/history, knowledge/revisions/events and agent preferences, retaining a content-free owner-readable removal event. External hosting and original portfolio projects remain intact. This is permanent removal, not archiving/restoration. Old duplicate records are removed individually by their owner; no automatic merge.

The first agent pilot is now drafts only for doitwithai.tools: blog, Pinterest copy+rendered graphic, LinkedIn post and rendered carousel/PDF. This phase documents the pilot; live model execution and visual generation are not implemented here. Five proposed roles (coordinator, writer, QA, Pinterest, LinkedIn) share a future visual composer. Social OAuth and CMS writes are not prerequisites for draft generation. Model provider qualification/binding/enforced budget and stored runs remain prerequisites. Multipage/custom collections/listing-entry/navigation/media uploads/gallery/video blocks remain planned; current business sites still have one homepage with section navigation.34 contains current repairs/manual cases;35 contains pilot briefs and owner-reviewable starter knowledge.30 remains cumulative.

Founder reported all newly created Supabase files applied in the review; record this as founder-reported through028 setup, not independently verified database state. Studio/onboarding/deletion findings are open until owner retests1.16. Earlier unspecified acceptance/security gates remain pending. This is a living plan; subsequent founder instructions can revise it, with affected documents, code, migration, dependency and activity records updated together. One cumulative ZIP/repository, two existing Vercel app roots. No remote database/deployment/provider action performed.

Earlier sections remain historical; this current contract supersedes conflicts.


## Current contract — package1.14 / P04.1

Site record and knowledge room now link to Agent readiness. Preview consumes only current owner-approved facts; draft/correction/revoke disappear from the next preview. No secret platform instructions or live answer returned. Knowledge functionality/import formats/limits remain unchanged.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

Earlier sections retain history and are superseded where they conflict with this current contract.

Living first draft, Bizoveya1.13 / P03.1. Implementation is partial BR-04; founder/hosted acceptance pending. Owner instructions may change this plan.

## What works

Every registered site has /workspaces/:workspaceId/sites/:siteId/knowledge, reached from Site record or native Business Studio. This includes external sites without fetching them. Source library, dark/light metrics, editor, approved lookup and revision history are private.

1. Choose New source. Paste title/text or import UTF-8 .txt/.md. Import stages content locally until Save. Files:48,000 bytes maximum; text16,000 characters; filename/title120 characters. No PDF/DOCX/OCR.
2. Generate candidates, then edit/remove them or add your own facts. Deterministic paragraph splitting, not AI or factual verification.40 facts/source,500 characters/fact; an omitted-chunk notice appears if the candidate cap is hit. Split large material to review the rest. Source changes clear staged facts.
3. Save the private draft. Same source text already saved in this site is rejected. Sources per site:20; versions/source:100. These are prototype bounds, not commercial pricing/entitlements. Save is disabled when unchanged and pending writes cannot be duplicated.
4. Owner checks review/authorization checkbox and approves the saved non-empty facts. Editors prepare drafts, viewers read; only owner approves/revokes/removes. Approval records actor/time and advances revision.
5. Any saved text/fact/title/filename correction clears approval. Approve the corrected revision explicitly. Revoke excludes it from lookup. Approval does not publish website content.
6. Approved fact lookup uses current authorized site's approved records, exact all-keyword filtering, no AI answer/semantic search. It displays source UUID/title/original filename/revision/fact ID. No source text or full history is returned by the approved RPC. Lookup fails closed if unavailable.
7. Load history to read previous versions/actions/times. Stage an old document for a new save; approval is not restored. Export saved sources and history separately as JSON. Unsaved content is excluded from exports. No JSON bulk re-import is implemented.
8. Remove source and revisions explicitly. Current and historical content is deleted in the live application database; content-free source/actor/site/version/action/time events remain. Backups and earlier downloads are outside this operation. No automatic website/draft/publication change occurs.

## Architecture and permissions

026 is additive. Existing001–025/public/admin/portfolio APIs are preserved. sources/revisions/events have membership RLS, authenticated SELECT only and no app-role direct write. The mutation RPC locks membership/site/source, checks expected version, site association and owner rights. Duplicate source text uses an internal MD5 key for bounded duplicate detection only, not a security proof. No service-role key. Request body180,000 bytes; JSON schema also bounds source/facts. Revisions immutable through app RPC; delete cascades source content. Source text is untrusted data; never system instructions. Future agents must revalidate membership/approval and cite source/fact/version. No embeddings, agent outputs, connector permissions, jobs, token costs, key or AI model integration added.

API collection GET/POST; /approved GET; /:sourceId/history GET. All private/no-store and authorization-scoped. Approval invalidation is current-data lookup, not an implemented cache/outbox controller. Retention for provider backups and future derived agent artifacts must be decided before commercial launch.

## Manual cases (all pending)

| Case | Action | Expected | State |
|---|---|---|---|
| MT053 | Open knowledge on new/external/owned portfolio sites; paste/import TXT/MD, unsupported/oversize file | Correct site context; valid source staged, invalid file rejected; no external fetch | [ ] pending |
| MT054 | Generate/edit/remove/add facts; save/reload; duplicate same text; double submit | Reviewed draft persists once, duplicate clearly rejected, source facts bounded | [ ] pending |
| MT055 | Owner approves; search facts; compare another site; edit/revoke | Only current approved facts in exact site, citations shown, edits/revoke excluded | [ ] pending |
| MT056 | Load/read/export history; stage prior version; save; export current | New draft revision, approval not copied; correct private JSON/evidence | [ ] pending |
| MT057 | Two tabs edit same version; viewer/editor/owner/outsider; sign out | Stale409 preserves staged edits, role enforcement and tenant denial | [ ] pending |
| MT058 | Owner deletes source | Content/revisions removed, approved lookup empty; content-free event retained | [ ] pending |
| MT059 | Mobile/light/dark; cancel unsaved navigation; old template/portfolio/publication/admin regression | Readable/fits; cancel retains draft; no public knowledge leakage | [ ] pending |

Save/export before browser Back/Forward: the existing SPA guard limit remains. Role tests require distinct staging accounts and reviewed operator provisioning; current platform has no invitation UI. Never paste local fixtures into a real customer database. Apply only missing026; use30 for every older pending action. Automated evidence is local synthetic browser/PGlite only.

Revocation and deletion remain available when the normal 100-revision save/approval budget is exhausted; revocation can create the final extra revision so the limit never forces approved facts to remain active.
