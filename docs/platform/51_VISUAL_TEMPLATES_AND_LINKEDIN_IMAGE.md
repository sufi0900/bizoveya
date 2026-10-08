# Shared visual templates and standalone LinkedIn image

P04.3.4.2 /1.26 source adds four fixed allowlisted shared designs for private saved campaign visuals. This is template selection, not private reusable-template creation or AI artwork generation. Founder browser/hosted acceptance remains pending.

## Behavior and compatibility

Classic card: light card; Midnight card: dark card; Editorial frame: warm background, thin framing and lighter headline; Bold headline: dark brand banner with accent rail. Each Pinterest graphic has its own selection; one carousel selection applies to all six slides; LinkedIn square has its own selection. Template selection preserves all wording/brand values and requires a reviewed save before download.

Existing campaign-visuals-v1 documents render exactly as before. Loading them does not silently migrate/save. Owner selects **Add templates and LinkedIn image** to create an unsaved v2 copy; first-slide title/body seed the standalone image, so the user reviews that excerpt for independent meaning. Save creates the next visual revision. Old history remains downloadable by loading/saving a reviewed editable copy; it does not overwrite stored versions. v1 history copies remain valid v1 unless explicitly upgraded. Source text/human review stay unchanged. Fresh unsaved starters use v2, but exports still require a successful reviewed save.

The square image is1080×1080 PNG; Pinterest1000×1500 and carousel1080×1350/six-page raster PDF stay unchanged. Preview and PNG/PDF use the same scene. All templates share conservative bounded text regions; warnings block save/export. Longer source can require shortening; no text is silently cut in export. No photos, external fonts or remote assets are added. Design variety is not a promise of unique artwork, quality/conversion or complete accessibility of exported raster text.

## Storage and authorization

Apply only new040 once after039. It creates a private v1 validator helper and replaces the existing validator at its original identity; strict union permits unchanged v1 and v2 with exact templates/LinkedIn fields. Existing RPC/table permissions, owner saves, member reads, run-row/source-review locks, optimistic visual version/no-op/50-version history and cascade behavior remain unchanged. No data migration or source-review action. Strict schema rejects unknown template IDs/extra fields/arbitrary code; application rejects overflow before RPC. GET parses both versions. Missing040 leaves saved v1 usable; a v2 save fails with setup guidance and leaves prior saved record/edits intact. Deploy schema first where possible.

Main deployment supplies UI/API source; admin has no new route. No new provider key, environment setting, paid request or hosted SQL execution by assistant. Template catalog is public shared metadata; saved compositions remain private. Creator-owned reusable definitions followP04.3.4.3 and are not available yet.

## Four founder checks

1. After delivery deploys, open repository `supabase/migrations/040_campaign_visual_templates.sql`. Copy the full file into Supabase SQL Editor and run once only if missing, after039. Do not rerun old migrations or assertion files. Expected success; old visuals intact.
2. Main website → Do It With AI Tools → Campaigns → export test-v2 → Visual drafts. Your saved old visuals should still load. Click **Add templates and LinkedIn image** if shown. Expected four template choices for each selector and a square LinkedIn preview. Do not generate again.
3. Try the selector samples below. Keep prefilled text if it fits; review all previews. Tick the existing review checkbox and **Save visual drafts**. Expected next visual versionN+1, not necessarilyv2. Refresh/reopen: selections, square image wording and new saved version remain. Previous history and original accepted text remain unchanged. Downloads stay disabled while edits are unsaved.
4. Download **LinkedIn image PNG**, both Pinterest PNGs and carousel PDF. Open them: square1080×1080, pins1000×1500, six-page PDF with chosen designs/readable text/no clipping. Report actual outcomes; optional JSON/phone/viewer/conflict cases stay separate.

## Every new field sample

| New field | Copy/select sample | Expected |
|---|---|---|
| Pinterest1 template | Editorial frame | Warm framed preview; source wording unchanged |
| Pinterest2 template | Midnight card | Dark preview; source wording unchanged |
| Carousel template | Bold headline | All six slides use banner/rail design |
| LinkedIn image template | Classic card | Light square design |
| LinkedIn image title | Review before sharing | Title max100 and fitting; use approved wording when possible |
| LinkedIn image body | Start with an approved source. Check the facts, edit for clarity and review your draft. | Body max420 and fitting; optional private layout-test wording, founder reviews |

Existing brand/name/color/footer, Pinterest/slide wording and review checkbox retain guide49 samples/limits. No new secret/credential input. Save reuses the current source-review version; changing design does not approve new claims. Optional report: “Template choices and LinkedIn image saved and remained after refresh. The square PNG, Pinterest PNGs and six-page PDF opened correctly.” Report only performed checks.

## Pending acceptance and next slice

| ID | Case | Status |
|---|---|---|
| MT152 |040 installation; oldv1 unchanged; explicit editable upgrade | Pending founder |
| MT153 |Template changes preserve wording; reviewed save/refresh/history/source unchanged | Pending founder |
| MT154 |Square PNG + chosen Pinterest designs + six-page carousel PDF | Pending founder |
| MT155 |Viewer restrictions, invalid ID/overflow, stale tab/source review, v1 history and JSON/phone regressions | Local cases verified where reported; hosted/browser pending |

Earlier MT145–147 are founder-reported passed; do not repeat whole accepted pilot. MT148–151 and commercial short-blog depth remain open. Source completion does not accept wholeP04.3.4/P04 or commercial launch. Next private template ownership/version/deletion policy is separately designed after this slice's evidence.50/ADR0017 retain future voice/meetings/office/custom-agent plan.


## 1.26 / P04.3.4.2 completed automated verification

359 web tests across63 files and137 admin tests across14 files passed (496 total). Both typechecks, targeted campaign ESLint, application boundaries and whitespace checks passed. Both production builds passed: web107 static pages including51/ADR0017; admin10. Only non-blocking cache serialization warnings observed. No runtime dependency or lockfile change. Previous unavailable dependency cache was restored from existing manifests/locks.

Local ephemeral PGlite applied40 migrations;037/039/040 assertions passed, including039 before and after040 to exercise validator upgrade compatibility (four assertion executions). Local shared-scene render verified9 output scenes plus36 template/format combinations; design sheet visually inspected; strict PDF parser confirmed six540×675-point pages. Mocked Canvas tests cover new square dimensions/provenance. This does not prove browser downloads, real concurrency, Supabase PostgREST or hosted040.

Founder MT152–155 remain pending; earlier MT145–147 founder-reported passed. Other pending negatives/access/mobile and commercial blog depth remain open. No hosted SQL, provider request, paid operation, deployment setting change or customer publication. Exact commit follows expected-head non-force delivery frombeec85c5. No active checkpoint lease at handoff.
