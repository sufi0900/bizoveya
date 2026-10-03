# Agent configuration and readiness

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

Agent room/preference/context preview unchanged. New candidate model registry is admin-only and not bound to existing agent versions. MT060–067 remain pending;33 supplies additional cases. Selecting tier in an agent or profile still executes nothing.

P04.2.1 adds model-profile preparation and fixed credential references on the separate admin host. /admin/models saves immutable candidate versions and checks syntax/reference eligibility; /admin/credentials enables/disables or records rotation of the three fixed platform references. All reads/writes require current named admin+AAL2 in server and SQL. No key value is stored in the database or accepted by these forms/APIs. Keys are optional server-only BIZOVEYA_NEBIUS_API_KEY, BIZOVEYA_OPENAI_API_KEY or BIZOVEYA_GEMINI_API_KEY variables managed privately in deployment settings. Presence checks return only a boolean for the current admin deployment, providerValidated:false and runtimeEnabled:false. They do not authenticate providers or prove model availability.

No live calls, SDK runtime, secret-entry dashboard, actual provider revocation, model evaluation, profile-to-agent binding, fallback execution or enforced spend budget is implemented. Profiles remain candidates; tiers/token/budget values are future runtime metadata. Disabling a reference or recording rotation increments its version and invalidates prior dependent profile checks. Changing an environment variable alone is not detected as rotation; operator must redeploy and record it. Checks record current reference eligibility, not credential health. Admin scope remains separate from customer tenancy.

Additive028_model_profiles.sql preserves001–027 and historical data.32 profile definitions/100 versions each; latest30 versions and100 events displayed, older records retained. Same cumulative source repository and two Vercel projects. Optional provider variables belong on admin server for presence checks; a future runtime deployment must be configured independently. No key is needed to test missing-key states; no provider call/spend performed. See33 for exact workflow/new MT068–074;30 accumulates all pending steps. No founder test result was supplied by the continuation request, so all unevidenced acceptance remains pending.50 previous current MD plus33 and ADR-0012 makes52 current sources after rebuild.

Earlier sections retain history; this current contract supersedes conflicts.

Living first implementation guide for package1.14 / P04.1. Source implemented, hosted/manual acceptance pending. Future founder instructions may change these contracts; update affected code, migrations, dependencies, documentation and evidence together.

P04.1 implements agent configuration and readiness only. The separate admin host has /admin/agents: versioned drafts, schema/capability checks, human approval for context preview, review events, revocation and rollback to a previously checked version. Three migration-authored starter drafts (coordinator, content, quality) begin unchecked and unapproved. A saved edit creates a new immutable version; previous preview approval remains pinned until explicitly changed or revoked. Editing does not activate an agent. No live model execution, credential store, SDK runtime, external tools, provider calls or API spend is added.

Customer route /workspaces/[workspaceId]/sites/[siteId]/agents supports versioned site preferences and a current approved-knowledge context preview. Owner/editor write preferences; viewer reads. The backend checks membership/site binding, exact agent preview version and preferences version. Facts carry source/fact/revision citations. Platform instructions remain admin-only; platform admin alone cannot read customer knowledge. Client guidance and uploaded facts cannot grant permission. Preview is a snapshot, not a model answer; future execution must revalidate all approvals and versions.

Additive027_agent_configuration.sql retains001–026 and old project data. One shared @bizoveya/agent-contract workspace package defines typed role/capability/request contracts for both apps. The lockfile adds workspace links; third-party dependency versions stay unchanged. No new environment variable, model key, repository or deployment project. Upload packages/ along with both apps and rebuild both Vercel projects. See32 for exact setup, limits, routes and manual cases;30 combines all deferred actions. Founder has started testing but reported no results yet, so every unevidenced manual gate remains pending.

## Scope and workflow

| Layer | Available now | Remains planned |
|---|---|---|
| Platform control | Named drafts, immutable saved versions, schema/capability check, reviewed preview pointer, reasoned events, revoke, rollback | API keys/model profiles, SDK workers, paid runs, model evaluations/real activation |
| Customer | Brand voice/audience/guidance, scoped catalog, approved source context | Autonomous tasks, messages, publishing, agent meetings/interruption |
| Authorization | Current platform grant+AAL2; owner/editor preference writes; member preview | Hosted acceptance of all current controls |

Three initial drafts are coordinator/content/quality. Declared capability always includes knowledge.read_approved; the other permitted label is plan.prepare, content.prepare_proposal or proposal.review respectively. These are declarations, not executable tools. New kinds or tools require implementation/permission review; editing instructions cannot introduce them. Each save creates another version; unchanged save does not. Max16 agent definitions and200 saved versions per agent. History UI shows latest30 versions and60 events; older records remain in DB. Schema/capability check neither runs a model nor proves instruction quality. Approval only changes preview eligibility. Updating a draft leaves previously approved version pinned; operator must explicitly review/change it. Revocation remains available at the version cap.

## Database and installation

Only new migration is supabase/migrations/027_agent_configuration.sql. Apply after026 when confirmed absent. Fresh database uses001–027 sequentially; existing databases apply missing files only. Prior001–026 byte-preserved. Do not paste supabase/tests or tools fixtures in production. Migration seeds unapproved drafts but no admin grant. No key/env or API spend needed. Follow30 to reconcile earlier setup and redeploy both existing projects from the cumulative source.

Shared package packages/agent-contract must be included in GitHub. apps/web and apps/admin both depend on it; workspace install/transpile/tracing configured. Same one cumulative ZIP, one repository, two deployment roots. Do not upload apps/ alone.

## Routes and dependency contract

| Host | Page or API | Guard |
|---|---|---|
| Admin only | /admin/agents; /api/admin/agents GET/POST; /api/admin/agents/[id]/history GET | Signed-in current granted administrator and AAL2 |
| Main | /workspaces/[workspaceId]/sites/[siteId]/agents | Current workspace member, matching site |
| Main | /api/workspaces/[workspaceId]/sites/[siteId]/agents GET/POST | Member read, owner/editor write |
| Main | Same API /preview POST | Member, approved agent version and exact saved preference version |

Public /admin remains404 without link or redirect. Customer catalog omits platform instructions. Backend preview returns runtimeEnabled:false, pinned agent/preference metadata and current approved facts with source/fact/revision identifiers. It stores no preview run or conversation; existing approved knowledge remains private. Agent role config, preference data and source facts are separate trust layers. Future execution must recheck versions, membership and approvals; a displayed preview is not a permission token.

## Manual tests — all pending

| Case | Actions | Expected result | Status |
|---|---|---|---|
| MT060 | Confirm missing migration027, apply full file once after026; redeploy both apps incl packages | Both screens load; initial drafts unchecked/unapproved; no credential needed | [ ] pending |
| MT061 | Admin granted account+AAL2; ungranted/AAL1/anonymous; revoked grant | Only current granted+AAL2 can read/change rules; public /admin404 and no link | [ ] pending |
| MT062 | Edit draft, save with reason; double click; reload; open history; two-tab stale save | One new version, previous immutable version remains; stale write409; unchanged save disabled | [ ] pending |
| MT063 | Check saved draft; require review reason/checkbox; preview approve; edit again; rollback old checked version; revoke | Check is not evaluation; only reviewed version appears; edit does not silently change preview; revoke removes eligibility | [ ] pending |
| MT064 | Site owner/editor preferences save/reload; viewer attempts; two-tab conflict | Owner/editor write, viewer read-only, stale save409; guidance cannot grant tools | [ ] pending |
| MT065 | Prepare draft knowledge; preview; approve; correct/reapprove/revoke/remove source; second site preview | Only current approved facts with citations; unapproved absent; no cross-site data; no model answer/spend | [ ] pending |
| MT066 | Approved agent/prefs version changed in another tab; preview; outsider URL/API access; admin with no membership | Old agent/pref requests409; outsider denied; admin does not bypass customer membership | [ ] pending |
| MT067 | Desktop/mobile dark/light, unsaved link/signout cancel, navigation, keyboard | Readable/wrapping controls, cancel protects edits, no public admin navigation; save before browser Back/Forward | [ ] pending |

Record exact package, case IDs, actor/device, real timestamp, deployment URL, expected/observed outcome and redacted evidence. No broad all-working statement implies unperformed MFA/roles/conflicts. No prior pending test was accepted during this phase.

## Known limits and next phase

No provider/SDK/model output evaluation is integrated. Tier/step/token fields are planning metadata and do not enforce a real runtime budget yet. No automated promise that prompts cannot make mistakes. Change reasons/instructions are administrative content; do not enter keys/secrets. Current preference store retains latest version only; immutable agent history is separate. Browser Back/Forward protection is not guaranteed by the native beforeunload/link guards; save first. NextP04.2 chooses provider/secret design and protected credential/profile management; before runtimeP04.3 the deferredP04.0 evidence must qualify the exact model/tool/SDK adapter. Hackathon qualification still requires a real eligible runtime trace; this phase alone does not satisfy it.
