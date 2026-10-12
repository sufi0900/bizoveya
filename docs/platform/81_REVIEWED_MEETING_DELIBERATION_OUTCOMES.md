# Reviewed private meeting-deliberation outcomes

## Delivered boundary

BZ-100/CW-100 follows remote main `92c485fbef34ee7c41482665dd5a10cca9c7b078`. Additive migration `064_reviewed_meeting_deliberation_outcomes.sql` creates a deterministic whole-deliberation completion candidate only when every planned turn has an immutable request and result, successful terminal status, known token usage, and settled or reconciled spending. The private admin read model distinguishes `in-progress`, `completed`, `blocked`, `cancelled`, and `reviewed` without discarding any turn receipt.

The founder must inspect and explicitly review the exact completion fingerprint. The saved outcome is immutable and contains pinned meeting/plan/snapshot versions, ordered results, request hashes, citations, token totals, and explicit `publish: false` / `externalDelivery: false` boundaries. It creates no task, message, publication, knowledge update, provider call, or new spending.

## Safety and access

Only the original snapshot founder who remains a workspace owner and MFA-verified platform admin can save the review. Exact-command retry returns the same record; a changed identity, reason, or fingerprint conflicts. Incomplete, failed, unknown, overrun, or receipt-less turns cannot become a completed outcome. Cancelled schedules remain visibly cancelled unless a fully completed outcome already exists; completed evidence remains reviewable even after operational state changes.

The private table has RLS, no direct authenticated or service-role read, and immutable rows. The only projection is the existing admin execution queue. This slice does not expose deliberation text to workspace members.

## Four deferred manual steps

1. **MT232 — Setup and preservation.** Later apply only missing migrations in order through `064_reviewed_meeting_deliberation_outcomes.sql`. Expected: prior meeting, turn, consent, spending, draft, and media records remain unchanged; unfinished meetings show their truthful whole-deliberation state.
2. **MT233 — Completion gate.** On one disposable meeting, inspect states before all turns finish and after every planned turn succeeds with settled/reconciled spending. Expected: founder review is absent for `in-progress`, `blocked`, or `cancelled`, and appears only for `completed` with the exact recorded/expected count.
3. **MT234 — Founder review and persistence.** Use review reason: `Reviewed every private turn, citation and spending receipt; approved this outcome for private follow-up planning only.` Save once and refresh. Expected: state becomes `reviewed`; ordered results, hashes, token totals, reason and fingerprint persist; no task, message or publication appears.
4. **MT235 — Access and stale evidence.** Confirm a viewer, unrelated admin, former owner, incomplete outcome, and stale fingerprint cannot save review. Expected: access is denied or refresh is required; the original turn receipts and truthful blocked/cancelled state remain intact.

## Next source boundary

Add a separate owner-reviewed downstream handoff from one reviewed outcome to one private request. It must use immutable lineage, an explicit instruction and exact retry, and must not start generation, messaging, publication, or external delivery. Group 3 is not complete until that handoff and terminal recovery are connected. Group 1 qualified optional AI visuals and Group 4 live voice remain unfinished; Group 5 office visualization stays ON HOLD and Group 6 custom agents remains out of scope.
