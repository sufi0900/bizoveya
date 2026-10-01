# AI employees, meetings and interruptions

**Draft 0.1. Proposed target, not implemented in this Voxfolio archive.** Earlier agency discussions proposed facilitator meetings and Sanity/Pinterest employees. Audit that separate code before claiming reuse.

## Roles and contracts

Manager/facilitator scopes request and proposes plan; research/SEO employee gathers evidence and outline; content employee prepares Sanity/native draft; quality employee checks facts/brand; visual employee prepares brief or asset; distribution employee prepares Pinterest/channel draft. Each employee has a typed input/output schema, site scope, allowed tools, spend ceiling, timeout and owner approval policy. No employee can increase its own permissions. Direct employee chat is possible but has the same policy boundary.

**First workflow proposal:** owner approves article task → research/outline → fact/quality review → Sanity draft with revision check → human approval → visual brief/asset → Pinterest draft → explicit channel action approval → receipt/readback. Imported Markdown documents may require a round-trip adapter; direct mutation must remain blocked until proven safe. Record each transition, artifact, source and model call. If an action fails, preserve a recoverable draft.

## Facilitated meeting

Agenda and participants are fixed before a meeting run; role turns are sequential and bounded. Facilitator summarizes disagreements and proposes decision options; founder can join, question or amend before decision. Store transcript, source artifacts, decision owner, explicit approval/rejection/defer status, and linked tasks. A meeting is not approval for external publication by itself. Resume after restart from persisted turn/checkpoint; never duplicate earlier external side effects.

## Interrupt protocol

| Owner command | Required behavior |
|---|---|
| Status | Return latest durable checkpoint, current worker and pending approval without altering state |
| Amend | Version the instruction; apply at safe checkpoint, show impact on current proposal |
| Pause | Stop scheduling new actions; finish/record an already-started atomic side effect |
| Reprioritize | Change queue priority with audit; preserve dependencies |
| Cancel | Stop future work; retain artifacts and receipts |
| Emergency stop | Halt pending tool calls and revoke execution authority; inspect in-flight actions and reconcile external results |

State machine candidate: `queued → running → awaiting_approval → executing → completed`, with `paused`, `failed`, `cancelled` paths. A worker obtains a lease, persists event/checkpoint, enforces budget and action idempotency, then acknowledges. Timed-out remote writes enter `reconcile_required`, not immediate retry. Maintain a human-readable timeline and an exportable audit. Test a pause during Sanity write and a restart after Pinterest action before claiming interrupt correctness.

## Configurable roles, SDK and instruction ownership

[ADR-0002](decisions/ADR-0002-configurable-agents-and-admin-control.md) adopts an application-run runtime direction; final SDK choice remains open. Agents are backend role/configuration objects, not uploaded ChatGPT conversations. A coordinator retains task responsibility, invokes permitted specialists and receives typed artifacts; delegation does not grant publication authority. Define specialist purpose, inputs/outputs, allowed tools, config/model version and maximum work. Avoid splitting agents solely to increase their count.

At run start, load the active tested agent version plus scoped client/site preferences and approved knowledge. A backend policy layer enforces access/actions; prompt instructions cannot expand it. Default rules, model profiles and supported tools can be maintained in admin data; implement new tools in code. One provider key can serve several agents, while separate per-agent/run budget and permissions still apply. Secret values never enter memory or prompts.

Routing can vary by role or task using evaluated economical/stronger models; deterministic operations such as permission checks, scheduled execution and calculations may need no model. Repetitive tasks can still need strong judgment. Fallback must be permitted for capability, geography, cost and data policy, not silently enabled. Record token usage, latency, validation errors and completion quality, not a generic vendor ranking.

## QA and configuration changes

Use a QA specialist for factual support, relevance and brand judgment, plus rule-based checks for schema, required fields, actual provider limits, URLs/assets/boards and idempotency. The Pinterest example in [18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md) specifies this separation. Review success is not publication success; execution receipt/readback is required. No rule set guarantees zero mistakes.

Admin lifecycle is draft → validate → saved-case evaluation → authorized activation → monitored version → retirement/rollback. Run snapshots stay fixed; authorized user amendments create a versioned event and take effect only at an explicit checkpoint. Emergency revocation may prevent new tool calls but cannot undo prior side effects. Meetings and interruptions retain their existing durable-state contract; an admin dashboard is not a substitute for worker leases, recovery or audit.

## Package 1.3 transition and impact synchronization

Template and voice knowledge should come from the shared approved capability catalog, not duplicated prompt copies. Specialists consume typed site-scoped artifacts through the coordinator; dependency gates, bounded QA revisions, config snapshots and interrupt reconciliation are specified in [19_DEPENDENCIES_AND_CHANGE_IMPACT.md](19_DEPENDENCIES_AND_CHANGE_IMPACT.md). Adding an agent updates all consuming contracts/evaluations and permissions, not just its prompt.

## Package 1.4 — first practical workspace implementation

No new AI agent executes in this package. Site records provide a future scope boundary, but registry status is not an agent pause/resume control. Business records and external URLs do not create knowledge, prompt memory, tasks or connector tools. Voice/template command logic stays inherited and unchanged. Future agents must consume site/permission versions and follow document 19 rather than assuming a URL grants access.
