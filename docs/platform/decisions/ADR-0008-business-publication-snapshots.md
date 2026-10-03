# ADR-0008 — Native business publication snapshots

Status: adopted for1.11 source. Parent P02.3 acceptance pending. Owner authorized proceeding while1.10 manual testing is deferred; that does not mark prior fixes accepted.

## Decision

Publish/republish a saved draft through a scoped transactional RPC, store independent publication versions plus full member-only action history, and serve a sanitized active snapshot at a stable UUID visitor route. Use existing Next.js/Supabase/shared renderer; no service-role key, new worker, per-customer deployment or automatic custom domain. Visible sections and used content are public; hidden content stays out of anonymous RPC/RSC payloads.

## Consequences

Save never automatically changes the public page. Readiness requires visible Hero/Contact and usable contact details; explicit confirmation reminds the user of public exposure. Both versions guard races. Site locks match draft save order. Unpublish is reversible through republishing and does not erase private work/history. No-store fresh requests respect inactive state; downloaded/open content cannot be recalled.

Member/viewer/outsider and anonymous boundaries are checked in SQL, application and local tests. Real hosted/Auth/concurrency proof remains pending. Aliases/domains, enquiry forms, revision-history UI and agents need later scoped work. Future schema/section changes must update024 projection compatibility, public schema, renderer, metadata and negative privacy tests together. Keep previous migration files unchanged.
