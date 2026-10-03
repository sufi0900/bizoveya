# ADR-0005 — Bizoveya public entry and bounded business drafts

Current1.9 amendment: [ADR-0006](ADR-0006-modular-business-studio.md) supersedes the single fixed template and P02.2-publication sequencing. Shared entry/private-draft/security decisions remain; three modular presets now implemented, publicationP02.3 planned.


Status: implemented in source, owner/live acceptance pending. Owner authorized next implementation at 2026-10-01T23:25:56+05:00. Delivery1.8; featureP02.1. Supersedes the inherited root-page/editor entry and native-business planning-only description, without deleting historical delivery records.

## Decision

The main `/` becomes a Bizoveya commercial entry page. The former root Studio moves intact to `/portfolio`; existing `/start`, `/projects`, `/studio/[projectId]`, `/p/[slug]` and portfolio APIs stay intact. Two onboarding journeys route through the existing workspace and site registry. A shared catalog advertises Service Studio and the inherited portfolio entry, with honest capability labels.

Service Studio uses a strict versioned business document, a public fictional interactive demo and an authenticated private draft editor. Migration021 adds one latest draft per native-business site. Reads require workspace membership; saves require owner/editor plus version match, checked in application and a locked database RPC. No anonymous read or direct authenticated table mutation. No changes to inherited project/publication tables.

## Rationale and limits

This delivers a visible business outcome without pretending the whole AI agency or business publication stack exists. Business publishing/domain binding, revision history, admin template CRUD, contact submissions and AI-agent catalog synchronization require later scoped work. A JSON backup does not deploy a website. Model/API/credential architecture and separate admin hosting remain unchanged.

## Consequences and reversal

Old root links to the demo must use `/portfolio`. Product metadata/manifest and sitemap now represent Bizoveya; existing publication metadata remains per portfolio. Update requirements, route/dependency inventory, manual and presentation together. If the owner chooses another public entry, preserve `/portfolio` accessibility and update all links and this decision's status. Revert application source through Git; preserve business data and forward migrations rather than dropping user drafts.
