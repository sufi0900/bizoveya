# Immutable private-template visual provenance

P04.3.4.3d — 2026-10-10 PKT. Additive migration042 and authenticated application wiring atomically apply one creator-owned template version to an accepted private campaign visual. No inventory UI is activated, hosted SQL is not applied, and no provider or publication action occurs. Source/package remains 1.26.0; P04.3.4.3 remains in progress.

## Artifact contract

Applying a template upgrades a v2 working visual to strict `campaign-visuals-v3`. The saved artifact contains the rendered brand/layout values, unchanged campaign wording, a copied immutable `templateRecipe`, and a pinned `templateReference` containing template ID, version and renderer. Existing v1/v2 rows and revisions remain readable and are never rewritten.

The checked apply route sends generation ID, current visual version, accepted source-review version, template version, reviewed confirmation and a strict v2 document to one database RPC. The database derives creator identity from `auth.uid()`, locks the template during selection, rejects archived/missing/foreign versions identically, copies the selected recipe, then reuses the owner/source-review/conflict/version-limit save boundary in the same transaction.

Ordinary visual saves cannot invent or rewrite provenance. They may preserve an existing v3 reference and copied recipe while editing its visual content. Template archive or later creator-account deletion does not cascade into saved campaign artifacts because the copy has no foreign key to private inventory. New application is denied once the inventory item is archived.

## Verification and limits

All 42 migrations and six ephemeral SQL assertion executions pass. New SQL coverage proves v2-to-v3 application, old-version pinning after a newer recipe, campaign-word preservation, owner/source/conflict gates, foreign/archive denial, provenance forgery rejection, internal-function privilege denial and survival after archive. The full web suite passes 372 tests across 66 files; web typecheck and lint pass.

Local simulated authentication does not prove hosted042 installation, real PostgREST/concurrent transactions, deployment, inventory UI or founder acceptance. MT152–155 and all unrelated unevidenced tests remain pending. No generation should be repeated.

## Founder action and next slice

There is no new visible field or manual test in this headless checkpoint. If migrations through041 are installed, migration042 may be deferred until the inventory interface delivery. Next: activate the reviewed creator-private inventory/apply interface, add clear version/archive states and perform focused hosted founder acceptance without regenerating content.
