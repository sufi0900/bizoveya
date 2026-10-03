# Private campaign draft room and testing

## Current update — 1.21 / P04.3.3.2

Migration034 and the campaign UI now prepare private, immutable generation snapshots after rechecking campaign version, approved knowledge, preferences, three current agent/model bindings and reviewed pricing. No provider call, reservation, output or publication occurs. Structured plan/draft/QA contracts are defined for the next runtime checkpoint. See [41 Generation snapshots and testing](41_GENERATION_SNAPSHOTS_AND_TESTING.md). Founder reported MT110–113 passed; MT114–117 remain pending.

P04.3.3.1 / source1.20 is the first durable-storage checkpoint of the draft-generation phase. It is not completed AI generation. Phase P04.3.3 remains in progress.

## Available now

| Feature | Behavior |
|---|---|
| Campaign room | Site record → Content campaigns; authenticated workspace members only |
| Shared brief | Required title≤120 and brief≤4000 characters |
| Three text outputs | Blog≤24000, Pinterest≤2000, LinkedIn≤5000; manually authored, initially empty |
| Starter input | Fills an editable Do It With AI Tools brief; no fabricated generated outputs |
| Save | Owner/editor saves, viewer reads; no provider request or publication |
| Durable URL | Each saved campaign has its own private URL; not a public sharing grant |
| Version history | Immutable full revisions; latest100 site revisions shown; older rows retained |
| Conflict control | Save requires expected version; stale changes fail without overwriting |
| Duplicate control | A retained UUID identifies a save request; exact unchanged saves do not add revisions; changed/stale replay conflicts |
| Removal | Existing owner-only site deletion cascades campaign rows and revisions; no external website changes |

Pilot bounds:50 campaigns/site,100 revisions/campaign. Identical titles are allowed because a campaign is an independent content task, not a website registration. No deletion/export control for an individual campaign is implemented yet. Saving does not claim that knowledge was retrieved, a model was used, or QA was passed. Inputs are React-escaped plain text; no raw HTML/Markdown execution.

## Architecture and dependencies

Site registration and workspace membership → site-scoped campaign room/API → bounded schema → transactional SQL save → private current record and immutable revisions. Database RLS permits only site-workspace members to read. Direct authenticated writes are revoked; the RPC rechecks current membership and locks the site before checking ID/version/limits. All API mutations use the existing origin/content-type/body-bound authentication guards. No service-role key or model secret is added to the public app.

New files:033_campaign_draft_foundation.sql,033_campaign_assertions.sql,features/campaigns,site campaign pages/API. Existing001–032 migrations remain unchanged. The local SQL harness retains the pre032 assertion boundary because030/031 tests intentionally exercise the earlier API signatures;032 and033 run afterward. Upgrade verification applies all migrations in order.

## Manual setup

If032 is already applied, apply only `supabase/migrations/033_campaign_draft_foundation.sql` in Supabase SQL editor after this checkpoint's source is deployed or running locally. Do not run `supabase/tests` fixtures on hosted data. Preserve existing environment variables. No new API key/variable is needed for this checkpoint. Do not reapply032.

Use the SAME repository and two Vercel projects (apps/web,apps/admin). This phase branch is based on the latest cumulative spending branch, not stale main. Main is unchanged; no production deployment is claimed.

## Copy/paste pilot

Register/open your existing Do It With AI Tools site. Click Content campaigns → Use starter brief. Add these manually authored test strings to prove persistence, not AI quality:

- Blog: Test draft: a human-led AI SEO workflow starts with a clear audience, reviewed sources, an editable outline and a final factual check.
- Pinterest: Title: Plan an AI SEO workflow. Description: Explore a practical, human-reviewed approach to researching and drafting content with AI tools.
- LinkedIn: AI can help prepare an outline, but source checks and editorial judgment still matter. This is a test draft for Do It With AI Tools, not a published post.

## Pending founder tests

| ID | Action | Expected | Status |
|---|---|---|---|
| MT110 | Apply only033; open site → Content campaigns | Private room; starter brief; no Generate/Publish action | Founder reported passed,2026-10-03 |
| MT111 | Fill starter and three test outputs; save; refresh; reopen exact URL | All text/version retained; no provider request | Founder reported passed,2026-10-03 |
| MT112 | Edit one output and save; open revision history | New version; old full content remains | Founder screenshot/report passed,2026-10-03 |
| MT113 | Open same saved URL in two tabs; save one then other | Stale tab denied; unsaved text retained | Founder reported passed,2026-10-03 |
| MT114 | Viewer/outsider/anonymous access, including API | Viewer reads only; outsiders denied/hidden; anonymous sign-in/API401 | Pending |
| MT115 | Exceed field bounds/submit extra publish field; blank brief | UI/API/SQL reject invalid data; no content leak/request | Pending |
| MT116 | Delete a disposable test site via existing owner confirmation | Associated campaigns/history gone; actual external website untouched | Pending |
| MT117 | Desktop/mobile room, old Studio/knowledge/admin spending/docs | Usable controls and existing behavior preserved | Pending |

Existing unevidenced MT102–109 and older cases remain pending; MT107 connectivity+settlement is now evidenced. MT106 is N/A for verified zero rates; MT108 conditional. Navigation prompts guard campaign-list/New links; other browser navigation uses the existing unsaved-edit limitation. Copy unsaved text before leaving.

## Next same-phase work

Implement durable run/job IDs and state transitions before provider calls, exact approved knowledge/agent/model/preferences snapshots, transactional generation cost reservations integrated with the existing test budget, bounded coordinator/content/QA orchestration, structured channel outputs, failure/unknown usage handling and human review. Revalidate permissions/configuration at execution, prevent replay/double charges, persist output before returning. No customer generation activation until its security/accounting gates are verified. Pinterest graphics, LinkedIn carousel rendering and publishing stay in later phases.
