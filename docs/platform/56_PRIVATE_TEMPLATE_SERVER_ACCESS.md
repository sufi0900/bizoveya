# Creator-private template server access

P04.3.4.3c — 2026-10-10 PKT. This checkpoint connects migration041 to authenticated web-server access. It does not activate template controls, alter saved visuals, apply hosted SQL, call a provider or publish content. Source/package remains 1.26.0; P04.3.4.3 remains in progress.

## Implemented boundary

| Operation | Route | Enforcement |
|---|---|---|
| List | `GET .../campaigns/templates` | Site membership; only the authenticated creator's summaries; `?archived=1` includes that creator's archive. |
| Detail | `GET .../campaigns/templates/[templateId]` | Membership and UUID; foreign/missing IDs share an unavailable response. |
| Create/revise | `POST .../campaigns/templates` | Same-origin bounded JSON, strict recipe, server session, membership, UUID and exact expected version. Creator ID is never input. |
| Archive | `POST .../campaigns/templates/[templateId]` | Same-origin bounded JSON, session, membership, UUID and exact expected version; history remains. |

Migration041 remains authoritative for creator identity, ownership, concurrency, archive state, quotas and immutable history. Application parsing independently rejects malformed SQL responses. Missing migration, unavailable template, stale edit, quota and invalid design retain distinct safe responses. Responses are private/no-store. Workspace role does not transfer personal inventory: owners and editors can each manage only their own templates.

## Verification and limits

The full web suite passes 371 tests across 66 files, including membership-before-RPC, creator-unavailable, exact mutation-argument, migration, conflict and quota cases. The real migration041 SQL/application integration test passes. Web typecheck and lint pass. The first run exposed and corrected an invalid test fixture; production validation was not weakened.

This does not prove hosted041, real cookies/PostgREST/concurrency, deployment, inventory UI, campaign application or founder acceptance. No new visible field exists, so there is no sample text or new founder test. Do not repeat generation. MT152–155 and unrelated unevidenced checks remain pending.

## Next dependency-safe slice

Add copied immutable template references to campaign visual artifacts. Preserve the applied recipe plus `{templateId, version, renderer}`, legacy v1/v2 visuals, accepted source-review and optimistic conflicts. Deny unavailable choices before application, while saved artifacts survive later archive/account deletion without an FK cascade. Only then activate the inventory interface.

Implemented by P04.3.4.3d in [57 Immutable visual provenance](57_IMMUTABLE_TEMPLATE_VISUAL_PROVENANCE.md). The remaining next slice is the reviewed inventory/apply interface and focused founder acceptance.
