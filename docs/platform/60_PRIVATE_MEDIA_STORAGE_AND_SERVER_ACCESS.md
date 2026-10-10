# Private media storage and server access

P04.3.4.4b — 2026-10-11 PKT. This headless checkpoint adds migration 043 and authenticated read/review/archive routes after guide59. It does not add an upload control, render media into campaign visuals, call an image provider, publish content or apply hosted SQL.

## Implemented boundary

Migration043 creates a private `campaign-private-media` Storage bucket capped at 5 MiB and PNG/JPEG MIME types. It deliberately adds no browser `storage.objects` policy. A service-role-only RPC may record a version only after a future trusted server has decoded, re-encoded and SHA-256-hashed the bytes. The object path must exactly bind creator/workspace/site/media/version/hash and the permitted extension. This delivery does not implement that sanitizer or upload bytes, so no client-supplied file is accepted.

Private metadata is creator, workspace and site scoped. Records admit at most 32 items per creator/site including archived items and 20 immutable versions. Each descriptor retains bounded dimensions/bytes/hash/alt text/user-upload origin and rights attestation. Expected revisions serialize version creation, review and archive. Review is owner-only, with one immutable accepted/rejected decision per version. Archive hides new inventory use while retaining metadata/history. Direct table access and anonymous/service-role reads remain denied; only write admission is granted to service role.

Authenticated no-store routes support creator inventory/detail reads plus owner review/archive after application membership checks. There is intentionally no public/authenticated upload route, signed/public URL response or object path in the returned record. Missing migration, unavailable item, conflict, quota and invalid input remain distinct failures.

## Evidence limits and next slice

The local 43-migration/seven-assertion PGlite suite covers bucket privacy configuration, service-only admission, exact object path, scope denial, immutable review, stale revision, archive/history and direct privilege denial. Application tests cover membership, parsing, owner-only mutation, pinned RPC fields and actionable errors. The harness simulates Supabase auth and has no Storage service, real object bytes, sanitizer, signed downloads or true concurrency.

Next P04.3.4.4c requires bounded server byte sanitization/upload/download before visible upload UI. It must verify actual decoded type, dimensions, pixels and size; strip metadata; compute the stored hash; clean failed orphan objects; and preserve referenced immutable versions. Only afterward may the owner receive documented upload, alt-text, rights-basis/evidence and review fields. Visual v4/media references and preview/PNG/PDF consistency follow separately. Optional AI artwork remains provider/access/evaluation/budget gated.

## Founder action

No founder setup or visible field is required for this hidden slice. Do not apply migration043 yet solely for an inactive interface. MT152–159 and every other unanswered founder check remain pending; no pass is inferred. Keep the successful generation and saved drafts, and do not regenerate.

## Delivery verification

All 43 migrations and seven SQL assertion scripts passed in ephemeral PGlite. All 392 web tests across 69 files passed, including the real migration harness and five new server-store cases. Web typecheck, full lint, production build, application boundaries, whitespace checks, guide60 built HTML and 335 affected local Markdown links passed. Admin source is unchanged and admin checks were not rerun. Hosted043/Storage, actual byte sanitization, true concurrency, browser behavior, deployment and founder acceptance remain pending. A simultaneous build/typecheck attempt initially raced over generated `.next` files; both checks passed when run sequentially.
