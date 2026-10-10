# Creator-private template storage foundation

P04.3.4.3b — 2026-10-10 PKT. Additive source migration041 after040; no hosted SQL executed. The inventory interface, campaign references and agent selection are not activated. Source/package version remains1.26.0 and P04.3.4.3 is in progress.

## Implemented database contract

Migration041 creates creator-private template headers and immutable recipe versions in `bizoveya_private`. RLS is enabled, creator-read policies are defined, and direct table privileges are revoked from public, anon, authenticated and service_role. Access uses four authenticated security-definer functions with fixed search paths and independent auth.uid checks. No workspace/admin role inherits another creator's inventory.

| RPC | Behavior |
|---|---|
| bz_private_templates(includeArchived) | Current creator's bounded summary inventory; archived entries excluded by default. |
| bz_private_template(templateId) | Creator's exact immutable versions, including archived history; foreign/missing IDs return the same unavailable error. UTC timestamps match the application contract. |
| bz_save_private_template(templateId,expectedVersion,recipe) | expected0 creates a UUID record; exact latest version adds a new immutable recipe. Checks creator, schema, archive, quota and optimistic version before writing. |
| bz_archive_private_template(templateId,expectedVersion) | Exact version soft archive; repeated identical archive is safe and retains history. No unarchive or hard-delete RPC. |

The existing recipe schema remains strict: name, brand and four allowlisted layout selections, fixed renderer/schema; no campaign wording, URLs, scripts or generated arbitrary layouts. SQL reuses existing visual validation and bounds serialized recipes at4096 bytes. It trims stored name/brand labels. Maximum32 records per creator including archived records,50 versions per record. Repeated recipe saves create a version; callers must avoid needless saves. History/quotas match bounded local pilot scope, not unlimited commercial storage.

Writes lock the active creator auth.users row before the template row. This serializes same-creator quota admission and edits; expected-version conflicts remain explicit. SQL prevents revision update/delete and template identity changes. User account existence and deleted_at-null are required for every RPC; missing/soft-deleted users are denied. This is not a new account-ban mechanism. It relies on the existing authenticated connection and actual Supabase auth protections for token issuance.

## Archive and deletion policy

Archive hides an entry from new default selection while retaining creator-readable history. There is no restore or hard-delete button. Physical creator-account deletion cascades to private inventory/history; SQL guards permit that cascade and reject standalone deletion of history/records. No FK/reference is added to existing campaign visuals. Consequently041 cannot alter existing saved v1/v2 visual documents, source reviews, text outputs or renderings.

Next artifact-reference slice must copy the applied recipe into the artifact and pin its template ID/version/renderer, enforce authorized creator use and preserve the copied artifact if the personal inventory is later deleted. Define site/workspace artifact retention independently; do not introduce an FK that unexpectedly deletes saved campaign visuals. Existing040 validator/save route remains unchanged and rejects new reference fields until a separately verified compatible extension.

## Verification and limits

Ephemeral PGlite applies all41 migrations and runs five assertion executions:039 before040 plus037/039/040/041 after migration completion. New041 tests cover own inventory/history, old/new recipe preservation, timestamps, stale save/archive, malformed inputs, unknown/executable fields, another creator denial, missing IDs, archive visibility/idempotency, direct table and anon/service-role denial, missing/soft-deleted actors, immutable identity/history,50-version/32-record bounds and physical account-deletion cleanup. Existing draft/visual assertions continue passing. A new web integration test runs the real local SQL harness, parses returned records through the TypeScript schema, applies an older pinned recipe after a newer save, preserves content and denies application from archived inventory. UTC timestamp and SQL/application record shapes are therefore exercised together.

These local fixtures simulate Supabase authentication. They do not prove hosted migration installation, PostgREST response behavior, real simultaneous transactions, browser inventory or campaign application. No provider call, paid request, deployment setting or publication. Earlier366 web/137 admin test results remain historical unless explicitly rerun in this delivery.

## Founder steps

No new UI fields, credentials or generation are introduced. You can defer installation until the usable inventory delivery.

1. Optional setup now: if001–040 are already applied and041 is missing, open `supabase/migrations/041_private_template_storage.sql`, copy the complete file to Supabase SQL Editor and run once. Expected: success with existing drafts/visual history unchanged. Do not run assertion fixtures or rerun old migrations. The assistant has not done this.
2. If setup is deferred, no action is needed for this storage-only checkpoint. Existing template MT152–155 save/refresh/export checks stay pending and can be combined with a later inventory delivery. No new field sample is applicable.

## Server-access follow-up

P04.3.4.3c implements the authenticated boundary in [56](56_PRIVATE_TEMPLATE_SERVER_ACCESS.md), retaining creator-only SQL authority and adding no interface. Copied immutable campaign references remain next.

## Next slice

Add immutable campaign application references before activating the template interface. Tests must cover archived/unavailable references, source-review/conflicts and legacy visual preservation. UI/manual acceptance follows. Guides54/56 and guide51 pending tests remain authoritative.
