# Bounded deliberation plans

## Implemented source boundary

Group 3 can now turn a decision-recorded **deliberation** meeting into one immutable, owner-reviewed plan only after every requested, roster-pinned participant has recorded an explicit acknowledgement. Additive `056_bounded_deliberation_plans.sql` preserves migrations 001–055 and all existing drafts, reviews, media and meeting history.

The founder chooses one or two rounds per participant, 256–2,000 maximum input tokens per turn, 128–1,000 maximum output tokens per turn and a US 1–25 cent ceiling for any future execution. The default samples are `1`, `1200`, `600` and `5`. The meeting version, request, roster, exact agent IDs/versions and deterministic role purposes are pinned. The plan and ordered turns are immutable, private, retry-safe and visible to site members.

Planning does **not** call a model, reserve or spend money, claim participation, produce specialist output, send a message, update knowledge or publish content. The cent value is a hard ceiling that a later executor must enforce; it is not permission or a reservation. Announcement meetings cannot use this path. Missing/declined receipts, changed/paused rosters, stale versions, non-owners and malformed limits fail closed.

## Automated verification and limits

Local coverage validates exact acknowledgement gating, bounds, independent retry identity, immutable ordered turns, owner/member access, stale/role/roster defenses, idempotency, cascade cleanup and absence of generation/spending records. The SQL environment simulates Supabase auth and does not prove hosted PostgREST, real workers or concurrency.

Automated verification for BZ-092/CW-092: 465 web tests across 78 files, 56 ephemeral local migrations and 20 SQL assertion scripts, web typecheck/lint, both production builds and application boundaries passed. The document room projects this guide from canonical Markdown. Admin source/tests are unchanged; its earlier 145 tests remain historical and are not claimed as rerun. No hosted SQL, browser/mobile, real-worker, concurrency or founder acceptance was performed.

## Deferred founder checks — MT204–207

1. Later apply only missing migrations through `056_bounded_deliberation_plans.sql`. Expected: existing accepted draft, review, media and meeting records remain unchanged; no new key or deployment setting is needed.
2. On a disposable deliberation meeting, use actual authorized workers to complete the guide71 receipt path for every requested participant. Samples: agenda `Compare safe launch options using approved context.`; decision reason `Prepare a bounded private recommendation only.`; distribution instruction `Prepare private approved-context options.` Expected: every participant says `acknowledged`. Do not manually invoke service RPCs in production.
3. In **Prepare bounded deliberation plan**, enter rounds `1`, maximum input tokens `1200`, maximum output tokens `600`, and future execution cost ceiling `5`; tick the exact-version confirmation and save. Expected: ordered planned turns appear, the meeting advances once, and no generation/provider/spending record is created.
4. Refresh and open the same meeting as a viewer, then try a stale owner tab or changed/paused roster on a new disposable meeting. Expected: the saved plan persists read-only; stale, changed, paused and non-owner preparation is denied without duplicate turns or work.

All four tests are pending. They can be performed with the other deferred founder checks before public reveal. The existing successful Gemini generation must not be repeated for this slice.

## Continuation

Base main: `18e8934b6f0c78ea38d7166ecf80ba8b77c28fb8`; BZ-092/CW-092. Historical phase branches and pull refs 1/2 were inspected; no repository `AGENTS.md` or active checkpoint lease was found.

First-four groups remain unfinished. Next is a separate safe deliberation scheduling/admission and pause/resume slice that must enforce this plan's exact roster, token and cost ceilings before any real turn. Real worker receipts remain a genuine execution dependency. Group 4 live voice remains unfinished; office visualization remains ON HOLD and custom agents stay out of scope. No hosted migration, provider call, deployment-setting change, external message, publication or repeated generation occurred.
