# Channel specialist runtime lineage

BZ-105 / CW-105 extends reviewed channel delegation into the existing durable campaign runtime without adding a provider call per channel. Migration `069_channel_specialist_runtime_lineage.sql` records one immutable link between the request, delegation roster/version, requested channel assignments, campaign version, generation run and the already-qualified shared Content-stage agent/version.

The compatible runtime still performs one Coordinator, one Content and one Quality stage under the existing authorization, spending and one-attempt recovery contracts. Blog, Pinterest and LinkedIn assignments identify reviewed channel responsibility; they do not claim that three independent model calls occurred. The member projection explicitly reports `executionMode: shared-content-stage` and `providerCallsPerContentStage: 1`.

Each requested channel derives its truthful state from durable runtime evidence: `prepared`, `running`, `awaiting_human_review`, `accepted`, `changes_requested`, `failed`, `recovery_required` or `cancelled`. `outputAvailable` is true only when that channel exists in the saved Content-stage output. Human acceptance remains one versioned review of the complete private output and publishes nothing.

Legacy prepared requests without channel delegation remain readable and compatible. The current Founder desk requires reviewed channel delegation before offering new snapshot preparation, while the SQL wrapper preserves earlier direct contracts and records lineage whenever delegation exists. If reviewed delegation is added to a compatible already-prepared request, the insert trigger attaches lineage to that same run without preparing or executing another one. No hosted SQL, provider request, spending reservation, deployment-setting change, message or publication is performed by this delivery.

## Deferred founder checks

1. **MT252 — setup and compatibility:** apply migration 069 after 068. Existing requests, campaigns, runs, accepted output and review history remain readable.
2. **MT253 — delegated preparation:** use a delegated Blog + LinkedIn request and its linked campaign, confirm the exact request/roster/campaign versions, then prepare one snapshot. Expected: one immutable specialist-runtime record with two channel responsibilities and one shared Content-stage execution; no provider call or reservation starts.
3. **MT254 — refresh and terminal projection:** refresh before execution, during an authorized test if separately chosen, and after saved output/human review. Expected: channel states follow durable evidence and accepted appears only after the existing human review is accepted.
4. **MT255 — negative and recovery:** verify an undelegated request has no preparation button, viewers cannot prepare, a stale preparation is rejected, and an interrupted run displays `recovery_required` without retrying a provider request.

Automated verification covers 494 web tests/81 files, 181 admin tests/19 files, strict TypeScript contracts, the Founder-desk projection, exact retry/immutability/ACL checks, all 69 migrations/33 SQL assertion scripts, both typechecks/lints/builds, boundaries and whitespace. SQL uses synthetic authentication and qualification. Hosted PostgREST, true concurrency, real provider billing, browser/mobile acceptance and all founder checks remain pending.

Group 2 is still in progress. The next bounded slice is to close its channel execution/read model audit and any remaining specialist terminal/recovery gaps without changing the one-attempt runtime. Group 1 qualified artwork and Group 4 live voice remain genuine provider dependencies; Group 3 source is complete, Group 5 is ON HOLD and Group 6 is out of scope.
