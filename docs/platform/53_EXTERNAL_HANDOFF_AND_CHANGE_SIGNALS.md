# External content handoff and change signals

Planning checkpoint: 2026-10-10 PKT. Founder discussion; no connector, receiving service, autonomous routing or publication implemented.

## Founder direction

A user brainstorms in ChatGPT, creates a Pinterest image or website-update document, and explicitly asks a future Bizoveya plugin to send it to their workspace. Bizoveya receives the artifact, hands it to the founder assistant, proposes the relevant specialist, queues quality review and obtains the required action approval. The founder also wants connected roles to learn about relevant blog/site updates and propose channel updates. The project remains Bizoveya; incidental alternative names in speech do not rename it. References to an assistant do not authorize access to the separate PC Assistant project.

Existing50 covers assistant/specialist roles, QA, meetings and event-driven rooms; this discussion adds an external intake boundary and versioned change signals. Receiving content is distinct from calling ChatGPT models. A future plugin that sends an image already created in ChatGPT does not require Bizoveya to generate that image through the subscription reasoning route. Actual plugin attachment-transfer capabilities, account eligibility, connector review and deployment access must be verified when implementing; no automatic availability is promised.

## Recommended workflow

The receiver is primarily a durable authenticated intake service, not an extra model call to act as a delivery boy. It validates and privately stores an envelope before the assistant proposes a task. Clear declared destination/content type can route deterministically; ambiguous requests can invoke the assistant within a budget. Assistant knowledge is limited to authorized site/workspace sources and versions, not every customer's data.

| Boundary | Planned behavior |
|---|---|
| Send | User explicitly selects workspace/site and requests handoff; plugin permissions are narrow. An external message cannot grant publication or deployment authority. |
| Receive | Validate identity/scope, idempotency key, artifact type/size, checksum, source, user instruction and optional destination. Store receipt and immutable private artifact version; retries reuse the same receipt. |
| Assets | Import through a qualified attachment transfer path. Validate actual file type/dimensions/limits; do not fetch arbitrary URLs or run embedded scripts. Retain provenance and rights attestation; scan/quarantine as appropriate. |
| Plan and route | Assistant proposes Pinterest, LinkedIn, website or another supported role using authorized inventory. Ask the founder to resolve uncertain scope or material changes. Unsupported roles show a blocker. |
| Review | Specialist prepares a private draft; QA checks claims, asset fit, destination and policy. QA acceptance is separate from permission to publish. |
| Execute later | An authorized publisher/CMS connector performs the approved action with idempotency and verified receipt/readback. Current private-only/no-publication policy remains effective. |
| Website proposals | Imported discussion becomes a proposed change document. It never executes code, changes credentials, rewrites approved knowledge or deploys automatically. |

Suggested future handoff examples, not new UI fields today:

“Send this image and caption to my Do It With AI Tools Pinterest draft inbox. Keep it private and ask me before publishing.”

“Send this document as a proposed website update for Do It With AI Tools. Ask me to approve the scope before assigning work.”

## Changes across connected channels

Emit a durable event after a verified authorized site/blog change: site, content ID, revision, changed fields, source receipt, actor, event ID and visibility scope. Relevant subscribed roles receive the same versioned signal; acknowledgement does not need a model call. A role evaluates only when work is needed. Distinguish content-created, draft-edited, approved and published events so a draft is not announced as a live blog.

Existing social posts remain unchanged until a scoped proposal is approved under the future execution policy. Deduplicate by event and role, coalesce rapid edits, preserve ordering/version checks, prevent update loops, and record handled/skipped/blocked states. Use an outbox and replay-safe consumers where appropriate. A signal is neither an automatic model invocation for every agent nor proof that everyone applied an update. Measure token costs rather than claiming savings.

## Phase placement and entry gates

| Existing phase | Next relevant scope |
|---|---|
| P04.3.4.3 | Next documented visual slice: creator-private template inventory, immutable template versions and artifact references. Start with ownership/schema design; saved-template activation depends on compatibility and access tests. |
| P04.3.4.4 / P03 / P04.6 | Private asset intake, source/provenance, receiving envelopes and assistant task proposals; verify external connector attachment/auth contracts before implementation. |
| P06.1 | Versioned update broadcasts, acknowledgements and bounded relevant-role deliberation; reuse existing planned meeting/event model. |
| P05 / P07 | Approved website/social writes, publisher permissions, retry/reconciliation and readback. Deferred; no current publication authorized. |

Founder says the previous implementation has not been tried. Latest57969caa was documentation only and needs no feature acceptance test. Earlier1.26/P04.3.4.2 template MT152–155 remain pending; do not mark them passed. Their save/refresh/export checks are required before accepting that feature/commercial release. Independent next-slice design can proceed while they remain open. This delivery prepares scope only; it does not complete P04.3.4.3, install SQL or activate a plugin.

Next private-template design must specify creator-only visibility even inside shared workspaces, immutable version references, safe allowlisted scene definitions, inventory selection, source-review/fit validation, deletion/retention behavior and denial/concurrency tests. Do not silently extend v2 visuals or rewrite old saved artifacts. Resolve those contracts before a new migration/runtime slice.

## Simple founder action and verification limits

No new setup, field, credential or generation is needed for this planning delivery. You may defer the pending template tests while design proceeds. Before accepting1.26, complete the four checks in51: install040 only if missing after039, open existing campaign visuals, reviewed save plus refresh, open PNG/PDF exports. No regeneration needed. All field samples remain in51.

Document-room projection and Markdown verification are recorded in the delivery log; plugin transfer, routing, QA integration, broadcasts and publishing are planned and untested. Existing successful draft evidence and earlier reported visual passes remain intact. Short-blog quality, MT152–155 and unrelated pending checks remain open.
