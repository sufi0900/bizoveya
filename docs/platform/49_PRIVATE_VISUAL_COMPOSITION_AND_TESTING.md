# Private visual composition and testing

## Current documentation checkpoint — 2026-10-08 PKT

The founder reports completing the four requested visual setup/save/refresh/PNG/PDF checks and liking the results. Record MT145–147 as founder-reported passes, not independent hosted inspection; exact visual version, exported files and deployment receipts were not supplied. MT148–151 and unrelated text/access/negative/commercial-quality checks remain pending. Do not repeat accepted text generation or the confirmed visual checks.

This delivery records discussions and planned architecture only. Source visual composer is [4f719f78](https://github.com/sufi0900/bizoveya/commit/4f719f78e1364101730d74529bb903dfee04556d); no new feature, SQL or provider integration is implemented here. Read [50 Evolution and agency roadmap](50_EVOLUTION_TEMPLATES_AND_VISUAL_AGENCY.md) and [ADR-0017](decisions/ADR-0017-templates-and-event-driven-agency.md). Next proposed slice is P04.3.4.2 template variety and standalone LinkedIn image; private reusable templates follow. Founder requested documentation before implementation. This block supersedes older conflicting next actions while preserving dated history.

P04.3.4.1 implements two editable Pinterest layouts and a six-slide LinkedIn carousel with private saved versions, PNG downloads and a six-page PDF. It reuses accepted generated text and makes no provider call. Hosted installation and founder visual acceptance remain pending.

## Founder confirmation and permission to proceed

On2026-10-08 at01:10PKT the founder confirmed the previously requested saved-draft/refresh/copy/generated-JSON checks had already been completed with the previous assistant, then explicitly instructed proceeding. These narrow results are founder-reported passes, not independent hosted inspection. They apply to run `80091597-06eb-4b8e-ae10-6239ae2b2b69` and its accepted reviewv1. Do not ask for another generation or repeat these confirmed text checks.

The founder's instruction permits implementing additive visual composition while other unevidenced tests remain pending. P04.3.3 is not labelled wholly accepted: stale/negative source-review, conditional access/mobile cases, editable unsaved-export regression and short-blog commercial depth remain open where not separately evidenced. Earlier entries in48 that call persistence/copy/generated export pending are historical and superseded by this confirmation. Publishing remains deferred.

## Implementation scope

| Output | Behavior |
|---|---|
| Pinterest design1 | Light branded text layout,1000×1500, editable title/body |
| Pinterest design2 | Dark branded text layout,1000×1500, independently editable title/body |
| LinkedIn carousel | Exactly six 1080×1350 slides, each with editable title/body |
| Saved visual record | Owner-reviewed layout/text, one composition per generation, optimistic version check, immutable revision history up to50 |
| PNG | Each Pinterest design or individual carousel slide; browser-local export of a saved, fitting layout |
| Carousel PDF | Six pages containing rendered slide images; raster text, not selectable text |
| Visual JSON | Saved layout, source run/campaign/review versions, citation references and explicit private-use notice |

The existing main private campaign room gains **Visual drafts — Pinterest and LinkedIn** under each generated result. Source status must be succeeded, advisory QA positive without blockers, and latest human review accepted. Source acceptance does not automatically approve edited visual wording. The owner checks **I reviewed the visual text and layout for private draft use** before saving.

Starters use actual Pinterest text and arrange consecutive LinkedIn excerpts; they do not invent new facts, call specialist agents or use a paid image model. Full sentence boundaries are preferred when at least six sentences exist; shorter posts may be split at word boundaries and require continuity editing. Long or sparse source text can require owner edits before all six slides are valid. The short blog is unchanged. Two layouts are text designs, not generated photographs. No logo, external font, remote image URL or arbitrary SVG/HTML input is accepted in this checkpoint; richer media/brand fidelity is later work.

Shared scene generation powers previews and exports. All text is escaped. Conservative line fitting rejects overflow and empty text before API save/export instead of silently cutting exported lines; a preview may show only the fitting portion while a visible warning blocks saving. Browser font fallback can differ; final phone/browser export is a founder check. Visual versions store editable compositions, not uploaded binary images. Exports are rendered locally on demand and never uploaded automatically.

## Private persistence and dependencies

Additive migration **039_campaign_visual_composition.sql**, after038, adds private composition/revision tables and only authenticated member-read/owner-save RPCs. Direct table access and anon/service-role RPC access are revoked. Security-definer functions use an empty search path and recheck workspace, site and source-run membership. Save locks the source run (the same lock used by source human review), verifies its latest accepted review version/QA, bounds documents and history, records the authenticated actor, and rejects mismatched expected visual versions. Unchanged saves are no-ops. Site/campaign/run deletion cascades visual records. No existing migration or row is rewritten.

| Surface | Access |
|---|---|
| Main private `/api/workspaces/[workspaceId]/sites/[siteId]/campaigns/visuals?id=[generationId]` GET | Current member, matching site/run; private no-store response; missing setup is an explicit error |
| Same endpoint POST | Current owner only, same-origin JSON,24KB body bound, strict fields, fitting text, reviewed checkbox, exact current accepted source-review version and expected composition version |
| Viewer | Read/preview/download already saved authorized visuals; cannot edit/save |
| Unrelated user/admin | Membership is required; admin status alone grants no private visual access |

Old generated outputs and editable drafts remain available before039 is installed because visual loading is lazy and separate. No new provider key, environment variable, model binding, social login, deployment setting or admin route is needed. A text source review changed to changes_requested blocks new composition; previously downloaded files cannot be recalled. Files are drafts, with no publication approval or connector action.

## Four founder steps

1. After the main delivery deploys, open Supabase SQL Editor. Open the repository file `supabase/migrations/039_campaign_visual_composition.sql`, copy its complete contents and run it **once**, only if039 is not already applied and038 is present. Do not rerun older migrations or assertion files. Expected: success with no error; existing drafts remain intact. The assistant has not applied hosted SQL.
2. On the main Bizoveya website, open **Do It With AI Tools → Campaigns → Do It With AI Tools — export test-v2**. Under the already accepted generated result, open **Visual drafts — Pinterest and LinkedIn**. Expected: two Pinterest previews and six LinkedIn slide previews. Do not prepare a snapshot or run a model.
3. Keep the starter text if it fits, or use the samples below. Check every preview, tick **I reviewed the visual text and layout for private draft use**, then click **Save visual drafts**. Expected: **Visual draft v1 saved**. Refresh the page and reopen Visual drafts: same content/version/history. Confirm the source text and accepted reviewv1 remain unchanged. If a fit warning appears, shorten only the named field before saving.
4. Click **Download Pinterest 1 PNG**, **Download Pinterest 2 PNG** and **Download LinkedIn carousel PDF**. Open the files. Expected: two 1000×1500 graphics and a readable six-page PDF; no clipped text and no publication. Send the files or screenshots with `Visuals saved and remained after refresh. Both Pinterest PNGs and the six-page PDF opened correctly.` Report actual results only. Optional individual-slide PNG/visual JSON and phone checks remain separate if not performed.

## Samples for every editable field

Use existing approved starter wording when possible. The following process examples are for private layout testing; owner review is still required. Fields are prefilled, so these are optional replacements rather than mandatory retyping.

| Field | Copy/paste sample | Expected |
|---|---|---|
| Brand name | `Do It With AI Tools` | Shared header on all eight visuals; max60 characters |
| Accent color | `#5271FF` | Shared accent bar; six-digit hex only |
| Footer text | `Private draft · review before sharing` | Shared footer; max100 characters |
| Pinterest1 title | `Review your AI-assisted draft` | Light-layout title; max120, must fit |
| Pinterest1 body | `Start with one audience question. Organize an outline, verify the facts and review the draft before sharing.` | Light-layout body; max600, must fit |
| Pinterest2 title | `Keep human review in the workflow` | Dark-layout title; max120, must fit |
| Pinterest2 body | `Use approved facts, edit for clarity and check each claim before sharing your content.` | Dark-layout body; max600, must fit |
| Slide1 title | `Start with one clear question` | Slide title; each max100, must fit |
| Slide1 body | `Choose a question your audience needs answered.` | Slide body; each max420, must fit |
| Slide2 title | `Organize the outline` | Editable, saved with the composition |
| Slide2 body | `Arrange the main points into a useful order.` | Same |
| Slide3 title | `Verify the facts` | Same |
| Slide3 body | `Check statements against approved sources.` | Same |
| Slide4 title | `Edit for clarity` | Same |
| Slide4 body | `Use specific, direct language and remove unsupported claims.` | Same |
| Slide5 title | `Review the full draft` | Same |
| Slide5 body | `Check the opening, examples and next step before sharing.` | Same |
| Slide6 title | `Keep the human decision` | Same |
| Slide6 body | `Treat the content as a private draft until you decide how to use it.` | Same |
| Review checkbox | Check only after reviewing all eight previews | Required for each changed save; resets after edits/save; never approves publication |

History **Use vN as editable copy** loads an earlier composition into the editor without saving it. Review and save creates a new version rather than overwriting history. Exports are disabled while edits are unsaved, source review differs or text does not fit.

## Additional pending cases — not required to repeat the accepted text pilot

| Case | Status / expected |
|---|---|
| MT145 | Founder reports four-step setup/composer check passed; migration history not independently inspected |
| MT146 | Founder-reported four-step save/refresh check passed; exact version/files not supplied |
| MT147 | Founder-reported two PNGs/six-page PDF opening check passed; files not independently inspected |
| MT148 |Two visual tabs: save inA, staleB gets conflict; preserve edits/history — hosted/browser pending, local SQL rejection verified |
| MT149 |Viewer read/export and unrelated tenant denial — hosted accounts pending, API/SQL negative cases locally verified |
| MT150 |Overflow/invalid color/unchecked review, source review changed, version limit and no-op — local verification; browser/hosted cases pending |
| MT151 |Phone rendering/download and optional individual PNG/visual JSON — pending |

Remaining media assets, automated visual QA, final logo/brand fidelity, commercial blog depth, social/CMS connectors and publishing are separate future work. After the founder checks145–147, review actual exported visuals before extending media or publishing. No timeline or whole-phase acceptance is inferred.

## Local verification

Current results are recorded in the delivery/continuation checkpoint after final checks. The local SQL runner applies all39 migrations to an ephemeral PGlite database and runs the existing037 dispatch/review assertions plus039 visual assertions. It simulates Supabase Auth and does not prove true concurrency, hosted PostgREST, MFA or browser downloads. The local render runner rasterizes the shared scenes using installed Sharp; it checks eight dimensions and produces a real six-page PDF for independent parser/render inspection. It does not claim browser Canvas or hosted acceptance. Test fixtures are synthetic and are never inserted into production.


## P04.3.4.1 completed automated verification

- Web: 353 tests across 62 files passed; admin: 137 tests across 14 files passed (490 total).
- Both application typechecks, targeted ESLint, application boundary checks and whitespace checks passed.
- Both production builds passed (web 104 static pages; admin 10). Visual API route included. Non-blocking build-cache serialization warnings only.
- Fresh ephemeral PGlite applied all 39 migrations and passed existing 037 plus new 039 SQL assertions. This is local verification, not hosted SQL installation or actual concurrent requests.
- Eight shared scenes rendered to their expected PNG dimensions. Independent strict PDF parsing and rasterization confirmed six pages, each 540×675 points, embedding 1080×1350 JPEGs. Browser Canvas is covered by mocks; actual founder downloads remain pending.

No hosted SQL was applied, provider called, deployment setting changed or customer content published. MT145–151 remain pending founder/hosted/browser checks. Earlier founder-confirmed text persistence/copy/generated JSON checks remain recorded as passed; commercial blog depth and unrelated text negatives remain open. No active checkpoint lease at handoff.
