# Combined pending setup and manual tests

## Current contract — 1.19 / P04.3.2

This update supersedes conflicting older “current” blocks below; historical records remain unchanged. Admin-only spending controls are at `/admin/spending` and `/api/admin/spending`. Migration032 follows031; never rerun applied migrations. New connectivity tests require reviewed USD pricing and enabled limits. The ledger reserves a conservative estimate before a provider call, settles reported usage, and holds uncertain/overrun charges until evidence-based reconciliation. Customer draft generation and publishing remain disabled. See [39 Spending controls](39_SPENDING_CONTROLS_AND_TESTING.md).

Founder reported all1.18 MT095–101 passed on2026-10-03; this is founder-reported local acceptance, not independent deployment verification. New MT102–109 remain pending. GitHub write access is restored; delivery uses `phase/p04-3-2-spending-controls`, not main. Main was inspected at1.7; this branch carries cumulative1.19 source. See38 and CONTINUATION for delivery state.


## Current installation and pending actions

This table supersedes older installation tables below. Use1.18 source, preserve private env files, and keep Vercel roots apps/web and apps/admin. No new variable is required. Do not rerun already-applied migrations or use test SQL on hosted data.

| Applied history | Action |
|---|---|
| Through030 | Apply only031_agent_model_bindings.sql |
| Through029 | Apply030 then031 |
| Through028 | Apply029,030,031 |
| Earlier/unknown | Reconcile history and apply only missing migrations in order through031 |

MT090 local Gemini success is evidenced. MT087–089,MT091–094, newMT095–101 and all earlier unevidenced cases remain pending. See37 for exact assignment steps. Existing tests need not be rerun while evidence is still valid; after24 hours a new explicitly authorized model test is needed for assignment. Search the docs dashboard for Agent model assignments and Delivery and continuation. GitHub writes are blocked and scheduled continuation paused.


## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


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


Living checklist for cumulative Bizoveya1.15. You can perform these together when your PC is available. No founder test has been inferred from your request to continue. Completing source/automated checks does not mark hosted acceptance passed.

## One cumulative delivery

Use1.15 as the complete source package; you do not need to merge earlier ZIPs separately. Preserve your Git history, private env and local changes. Same one GitHub repository, same two Vercel projects: public root apps/web; admin root apps/admin. No new repository/project/subdomain is required for this delivery.

## Step1 — reconcile database history

Back up the existing database and check which numbered files have already been applied. Owner reported022 applied earlier; this is a reported baseline, not automatic verification of the remote DB. Apply only missing files in ascending order.

| Confirmed database state | Action |
|---|---|
| Through022 | Run023_creation_integrity.sql, then024_business_publications.sql, then025_expanded_business_templates.sql, then026_site_knowledge.sql, then027_agent_configuration.sql, then028_model_profiles.sql — one complete file at a time |
| Through023 | Run024 then025 then026 then027 then028 |
| Through024 | Run025 then026 then027 then028 |
| Through025 | Run026_site_knowledge.sql then027_agent_configuration.sql then028_model_profiles.sql |
| Through026 | Run027_agent_configuration.sql then028_model_profiles.sql |
| Through027 | Run only028_model_profiles.sql |
| Through028 | No migration action |
| Earlier/unknown | Reconcile before applying; fresh database requires001–028 ordered |

Do not rerun already-applied old migrations, delete migration history, paste tools/tests fixtures into production, or automatically delete existing duplicates. Optional read-only duplicate report: supabase/operator/023_review_duplicate_records.sql. Rename labels through supported record controls; equivalent external URL reconciliation requires operator review.

## Step2 — deploy and confirm setup

Merge complete latest source including packages/agent-contract and redeploy both public and admin apps. Retain real Supabase env and the existing NEXT_PUBLIC_SITE_URL public origin for canonical metadata. No new key/provider is required. Never deploy synthetic local fixture URLs/keys. Admin now includes preview-only agent controls; its host/session scope remains separate. Open /bizoveya/docs and confirm package1.15 and52 sources. Resolve setup errors before behavioral testing.

## Step3 — combined customer acceptance session

| Group | Original cases/guides | Check together | Current state |
|---|---|---|---|
| Login and workspace UX | MT033–035, document27 | Signed-in homepage account; existing workspace card/list; separate creation; exact Add a site/Your sites navigation | [ ] pending |
| Creation and duplicate control | MT036–037, document27 | One submit, selected saved template, direct Studio; case/spacing name aliases and equivalent external URLs rejected | [ ] pending |
| Editor functionality | MT022–030 residual cases in23; MT038–039, documents25–27 | Old drafts; add/move/hide/duplicate/delete/undo sections; styles/photos/FAQ/slider; JSON backup/restore; save/reload and stale two-tab edits | [ ] pending |
| Publishing | MT041–047, document28 | Readiness/cancel; email-only/phone-only; signed-out page/metadata; private save vs republish; conflicts; hidden source data; unpublish404 | [ ] pending |
| Six template families | MT048–052, document29 | New/old demos; selection path; content-preserving switching; palettes/tones; mobile; save/publish; unknown slug404 | [ ] pending |
| Site knowledge | MT053–059, document31 | Import/paste, reviewed facts, owner approval/revoke, site-bound lookup, correction/history/export/delete, roles/conflicts/mobile | [ ] pending |
| Agent configuration/readiness | MT060–067, document32 | Migration027; current grant/MFA; draft/check/review/rollback/revoke/history; scoped preferences; current approved context; stale edits/privacy/mobile | [ ] pending |
| Model profiles/references | MT068–074, document33 | Migration028; admin/MFA; immutable profiles; current reference checks; disable/rotation invalidation; boolean presence; conflicts/mobile | [ ] pending |
| Tenant and portfolio boundaries | MT040 plus25/27/28 security cases | Owner/editor/viewer/outsider; another workspace denied; old portfolio Studio/publish regression | [ ] pending |

You can use a few clearly labeled test sites for multiple cases rather than creating an unnecessary site for every check. Publish only information intended to be public; Unpublish afterward if appropriate. Save/download before browser Back/Forward: the existing SPA unsaved-edit guard limitation remains. A single 'all working' statement should list which cases were actually exercised, especially roles/conflicts/privacy.

## Step4 — older admin/security acceptance remains separate

The separate-host route smoke/deployment reports do not prove real MFA or role isolation. Finish unperformed checks from21_ADMIN_SETUP_AND_RECOVERY and22_PHASE1_VERIFICATION_GUIDE: granted user/TOTP, ungranted denial, anonymous API denial, expired/revoked/soft-deleted sessions, operator recovery, tenant boundaries and main-domain /admin404 without redirects/links. Do not grant admin via a normal customer account flow. Operator SQL templates require actual reviewed user identifiers; never paste example IDs blindly.

| Gate | State |
|---|---|
| Real admin login/MFA/grant/revoke/recovery | [ ] pending unless individually evidenced |
| Real hosted RLS/PostgREST/concurrent request verification | [ ] pending |
| Inherited full voice/portfolio behavior outside route smoke | [ ] pending where not individually evidenced |
| Product/commercial launch acceptance | [ ] pending |

## Step5 — record results

For each test/group record case IDs, package, deployment URL, browser/device, tester, actual date/time in PKT, pass/fail/not-run, expected vs observed result, and redacted screenshot/log. Keep security keys/tokens/customer private data out of public docs. Report failures with steps; leave remaining cases unchecked. The next implementation can update23 and the phase ledger from your evidence. Source-phase continuation never automatically accepts old gates.

## Current pending state

Founder explicitly reiterated at2026-10-02T18:30:26+05:00 that the PC has not been switched on and every previously deferred test/setup action is still pending. No additional acceptance inferred. All groups above remain unchecked. If a prior step has actually been completed, report its precise case/file/environment before it is marked complete. No immediate PC action is required to inspect this package.

## Known scope limits

No business enquiry-form delivery, custom customer domains, upload-backed images, booking/checkout/LMS, AI agents or real provider connector operations. Current sites use email/call and public image URLs. Existing duplicate rows are preserved. Unpublish cannot recall downloads/search caches/already-open pages. Earlier prototype/hackathon acceptance requirements remain recorded, not erased by this combined checklist.

P03.1 TXT/MD knowledge works privately; PDF/OCR/semantic retrieval/agent use remain future work. No additional AI key or cost. Export private source data only to trusted storage.

## Latest founder report

At2026-10-02T19:32:11+05:00 founder started the PC and is performing pending tests. No results or migration-application confirmations reported yet. All unevidenced gates remain unchecked; report actual case results to update them. New027 and MT060–067 extend the list. No need to merge multiple old ZIPs.

## Package1.15 continuation

Founder asked continue at2026-10-02T20:36:22+05:00 with no new acceptance result. Every unevidenced previous case remains pending. New028/MT068–074 added. No key required for absence-state or metadata tests; optional private server key configuration only for presence validation, no paid calls. Profiles do not run agents. Full cumulative source avoids merging old ZIPs.

## New1.16 setup and pending cases

Founder reported all previous new Supabase files applied through028 in this review (self-reported; exact migration history not inspected). Apply029 only if028 is confirmed; otherwise missing files ascending. Preserve existing SQL/history. Upload full cumulative source and rebuild both existing deployments. No new key/env is required for P02.5. MT075–086 in34 are all [ ] pending. Earlier cases remain pending unless separately evidenced; reported Studio/onboarding/removal defects must be retested.35 gives copy/paste knowledge/preferences and future draft-pilot inputs. Runtime/social/CMS setup deferred; do not treat draft-only planning as executed functionality.

## Founder setup report2026-10-03

032 reported applied; do not reapply. MT102–109 remain pending. Read39 for exact Gemini Free Tier walkthrough, MT106 N/A for zero rates, MT108 conditional. Read12 for Nebius/NVIDIA key route and38 for automatic production deployment after PR merge. Manual steps must be provided in chat too.
