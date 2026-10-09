# Private reusable template contract foundation

P04.3.4.3a — 2026-10-10 PKT. Implemented contract foundation; private inventory storage, UI and agent selection are not activated. Application/package version remains1.26.0; this is a source checkpoint within the next slice, not full phase acceptance.

## Implemented code

`apps/web/src/features/campaigns/private-template-contracts.ts` defines a strict recipe with name, brand values, four allowlisted template selections and renderer `campaign-scenes-v2`. Recipes exclude campaign wording, URLs, executable nodes and source identifiers. The first reusable-template scope is saving a configured existing design recipe, not creating arbitrary layouts or AI artwork.

Records have a creator UUID, template UUID, archive state and up to50 contiguous immutable versions. Every version retains creator/template identity. Pure create/revise/archive/apply functions validate these contracts and clone parsed inputs. Caller must supply a server-authenticated actor; these functions are not an authorization endpoint or database security implementation. Other creators cannot revise/archive/apply through the helpers; sharing a workspace does not grant ownership. Stale edits fail against expected version. Archive prevents new applications and revisions while preserving existing version history and previously composed draft snapshots.

Application requires an explicit template ID/version/renderer reference. It copies that pinned recipe into an editable v2 visual document, preserves all campaign words, validates fit and returns both draft and template reference. A newer recipe cannot change an earlier pinned application; source records/documents are not mutated. Existing v1/v2 storage schemas and SQL039/040 stay unchanged. Returned reference is not yet persisted with campaign visuals; the existing save endpoint does not accept new fields.

Seven meaningful tests cover input isolation, old-version pinning, source content preservation, cross-creator denial, optimistic conflicts, bad identity/renderer/version, archive preservation, unknown/executable fields, overflow and revision limits. They prove local helper behavior, not hosted privacy or race safety.

## Next implementation contract — storage before activation

Use a separately designed additive migration after040 for creator-private template records and immutable versions. SQL/RLS must independently authorize auth.uid(), lock the template row, enforce expected version/limit/identity, reject mutation/deletion of versions and return generic unavailable responses for other creators. No admin/global workspace reader should inherit private content access. Quotas and malformed inputs need server/SQL bounds. Disabled/removed user handling and creator retention/deletion policy must be defined before activation.

Proposed soft archive hides the template from new selection while retaining history required by existing artifacts. Hard deletion/retention is an explicit future policy, not silently implemented by archive. Artifact storage must pin a template reference and copied recipe or immutable snapshot, retaining legacy v1/v2 compatibility. A recipe edit cannot rewrite previous saved compositions. A separate reviewed application creates a new visual version; existing source-review, owner-write, fit/conflict and unsaved-export requirements remain effective.

Then add authenticated private inventory APIs/UI, explicit save-as-template/application flows and access/SQL/concurrency tests. Validate actual founder template save/refresh/export compatibility before full visual acceptance. No UI activation or migration is part of this contract-only checkpoint. Keep new references separate from old visual schema until the new persistence contract is verified.

## Founder action

No new manual setup/testing, SQL, credential or field is introduced here. Existing four1.26 checks and field samples in [51](51_VISUAL_TEMPLATES_AND_LINKEDIN_IMAGE.md) remain pending and may be combined with a later usable inventory delivery. No repeat accepted text generation. Pending checks are required for acceptance, not automatically passed because work continues.

## Scheduled continuation

Founder authorized one slice now and a continuation attempt every four hours if no response. A scheduled task was successfully created, first scheduled2026-10-10 08:07:59 Asia/Karachi, with four-hour recurrence. Each run must resolve remote main, inspect lease/branches/PRs and current instructions, complete only a dependency-permitted coherent slice, preserve pending tests and stop at concrete source/access/manual gates. It cannot guarantee phase completion on a timer. Do not overlap an active worker or restart on historical branches.

Direct expected-head non-force main delivery remains authorized. Hosted SQL, deployment settings, paid requests and customer publication remain prohibited. No extra generation is needed. ChatGPT commercial registration, external artifact intake, voice/office/publishing remain separately planned and gated in52/53/50. Activity/test evidence is recorded at delivery; no live or hosted verification inferred.
