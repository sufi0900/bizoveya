# Versioned meeting invitations and explicit receipts

## Implemented slice and honest boundary

Group 3 now prepares one private participant packet for every role selected in an already reviewed and distributed founder meeting. Additive migration `054_meeting_participant_invitations.sql` preserves migrations 001–053, existing records, accepted output `80091597-06eb-4b8e-ae10-6239ae2b2b69`, media and reviews. The owner reviews the current meeting version and prepares invitations; each role is pinned to the current enabled site-team roster version, agent identity and agent version.

`invited` means a durable packet exists. `claimed` means the matching server-side worker holds a five-minute delivery lease. `acknowledged` or `declined` means that same pinned worker explicitly finished the receipt transition with a note. None of these states claims attendance, comprehension, reasoning, content creation or task completion. The packet contains the immutable agenda, decision, distribution instruction and downstream command, but does not modify approved knowledge or immutable agent rules.

This is one Group 3 implementation slice, not completion of the first four groups. Bounded deliberation, safe scheduling pause/resume and live voice remain unfinished. Group 5 office visualization remains ON HOLD for founder design input; Group 6 custom agents remains out of scope.

## Authorization, versioning and recovery

Authenticated POST `/api/workspaces/[workspaceId]/sites/[siteId]/agency/invitations` accepts only `id`, `expectedVersion` and `reviewed:true`. Server and SQL both require the workspace owner, the current decision-recorded meeting version, its existing 053 distribution, and an enabled reviewed site team. Requested meeting roles must resolve to distinct current roster agents. A successful transaction creates the immutable batch, participant rows, initial receipt events and one meeting event, then increments the meeting version. Exact same-owner lost-response retry returns the original projection without duplicate rows or events.

Direct tables remain private under RLS. Site members see the projected receipt states after refresh, while editors/viewers cannot create invitations. Only `service_role` may claim or finish a packet, and it must present the exact pinned role, agent ID and version plus an unexpired claim UUID. An active foreign claim conflicts; an expired claim receives an immutable expiry event before a retry. Finishing is restricted to `acknowledged` or `declined` plus a bounded note and is idempotent only for the exact prior outcome. Receipt history is capped at 20 events per participant and stops before the next claim would consume the slot needed to finish. The server worker functions do not call a model, reserve spending, execute the distributed task, publish, send a message or grant further authority.

## Four deferred founder checks — MT200–203

1. **Setup and preservation.** Later apply only missing migrations in order through `054_meeting_participant_invitations.sql`. Open Agency planning and the accepted campaign. Expected: existing drafts, review, visuals, meeting and linked request remain unchanged. No new key or environment setting is required.
2. **Prepare a disposable meeting path.** Use an enabled reviewed site team. Create an Announcement meeting with Agenda: `Share the approved private launch decision with Coordinator and Content only.` Select Coordinator and Content. Record Decision reason: `Acknowledge receipt and prepare no public action.` Distribute with Instruction: `Prepare private Pinterest and LinkedIn follow-up drafts only.` Expected: one private linked request and no provider call.
3. **Prepare invitations once.** On the distributed meeting, select: `I reviewed meeting v[displayed version], its requested roles and distributed task. Prepare invitations only.` Click **Prepare participant invitations** once, then refresh. Expected: Coordinator and Content each show `invited`, pinned agent/version and the same roster version; Quality is absent; no attendance or acknowledgement is shown.
4. **Access and real-receipt checks.** Compare an owner and viewer session. Expected: the viewer can read receipt states but has no preparation control. Do not manually call worker RPCs in production. Later, when the authorized worker is deployed, confirm claim then acknowledgement/decline changes only the matching role and preserves the packet/history. Until that evidence exists, leave actual worker receipt and true concurrency pending.

## Verification and continuation

Automated delivery evidence is recorded in the canonical continuation and verification documents. Local SQL covers missing/paused roster, strict input, version and role pins, exact retry, viewer denial, table denial, claim identity/lease, explicit finish idempotency, immutable receipts, no generation and cascade. Application tests cover strict input, owner admission/error mapping, invitation UI and honest refresh projection. Hosted 054, real worker delivery, browser/mobile, true concurrency and MT200–203 remain pending.

Next coherent Group 3 slice: prepare bounded deliberation plans from acknowledged participant packets, with explicit turn/cost limits and no model call during planning; then implement safe pause/resume admission separately. Group 4 live voice remains gated behind a qualified voice provider, consent, transcript correction and parity with typed authorization.
