# Private media contract foundation

P04.3.4.4a — 2026-10-10 PKT. Independent source work proceeds under the founder's deferred-testing authorization. This implements pure metadata, ownership/version/review and copied-reference helpers only. No upload control, media route, bucket, migration, renderer change or AI request is enabled. P04.3.4.3 acceptance and every unanswered manual test remain pending.

## Implemented contract

A creator-private media record is scoped to creator, workspace and site. The caller must derive identity and membership from server authentication; a pure helper is not an access-control boundary. Each immutable descriptor records sanitized image MIME, byte size, dimensions, SHA-256, alternative text, user-upload origin and explicit own-work/licensed/permission rights evidence. Strict objects deny URLs, executable fields and unsupported provider origin. Rights attestation records a user's claim; it does not establish legal ownership.

Initial limits: PNG/JPEG only, 5 MiB per sanitized image, each side at most4096 pixels, at most12 million pixels, and20 versions. These are metadata admission limits, not verified byte safety. No SVG/GIF/video, URL fetching or provider output path. The future server must decode with bounded resources, re-encode to a permitted format, strip metadata and calculate the final dimensions/size/hash itself; client assertions cannot satisfy that step.

Every new version starts unreviewed. The creator records one accepted/rejected decision with reason and timestamp per version; corrections need a new immutable version. Inventory mutations use a shared expected revision so upload/review/archive races cannot silently overwrite each other. Archived or unaccepted media cannot be newly resolved. An accepted reference pins media ID, version and hash and returns copied descriptor/review metadata; inventory edits cannot mutate that copy. No actual image byte retention or exported-media survival is established by this metadata-only implementation.

## Storage and activation prerequisites

Next P04.3.4.4b: additive private storage and authenticated server integration, including site membership and creator checks in SQL/storage policy, expected-revision locks, server-only trusted byte verification, private authenticated downloads, and archive/purge rules. Plan a32-record site inventory including archived entries; bounded aggregate byte admission must be enforced atomically before activation. Sanitized immutable bytes must remain available while a saved visual references them; archive hides new use but does not purge referenced versions. Account/site deletion must follow an explicit authorized retention/purge path. These are next-slice requirements, not implemented storage guarantees.

After storage: explicit upload/rights/owner-review UI, then a separately versioned visual/media contract and consistent preview/PNG/PDF export. Existing visuals v1/v2/v3, templates and accepted words stay unchanged. Campaign human review and visual review are still independently required; accepting media cannot approve a campaign or publish it. No hosted SQL/provider/deployment setting/publication authorization is expanded.

Optional qualified AI artwork/design-spec generation follows provider access, evaluation, per-user credentials, consent and budget/accounting. ChatGPT plan reasoning remains the separate blocked integration described in52; no subscription image support is inferred. Later assistant/meetings/voice/office/custom-agent and connector/commercial groups are still planned.

## Verification and founder action

Automated contract tests cover review admission, creator/workspace/site isolation, unsupported inputs, limits, immutable old versions, hash pins, stale revisions, rejected media, archive/copied-metadata retention and bounded history. Verification totals are recorded at delivery below. These synthetic tests do not prove hosted storage, byte sanitization, browser rendering or concurrency.

No new manual setup, test, field or sample text is required for this hidden foundation. Existing template tests MT152–159 and unrelated negative/access/mobile/content-quality checks stay pending. Keep the successful generation and saved visuals; do not regenerate. Future fields will be documented with copy/paste samples when the upload UI exists.

## P04.3.4.4a delivery verification

387 web tests across68 files passed (11 new media tests); web typecheck, full lint, production build, application boundaries and whitespace checks passed. Guide59 built HTML/title/phase and345 local Markdown links verified. Existing42-migration SQL harness ran through web integration tests; no migration changed or hosted SQL ran. Admin checks were not rerun. Initial simultaneous build/typecheck raced generated files; typecheck passed when rerun after build. Hosted storage, actual byte sanitization, browser media rendering, deployment and founder acceptance remain unverified.
