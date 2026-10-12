# Reviewed meeting outcome to private request handoff

## Delivered source boundary

BZ-101/CW-101 adds one explicit, owner-reviewed handoff from one immutable reviewed meeting outcome to one new private founder request. Migration `065_reviewed_meeting_outcome_request_handoffs.sql` stores immutable outcome, snapshot, meeting, request, fingerprint, instruction, channels, actor and exact-command lineage. One outcome can create only one request; exact uncertain retries return the existing receipt, while changed identities, fingerprints, commands, meeting versions or meeting status fail closed.

The Founder desk receives only sanitized identifiers, the founder's explicit follow-up instruction and selected Blog/Pinterest/LinkedIn channels. Private meeting-turn text remains in the admin-only queue. Creating the request does not start generation, reserve spending, send a message, update knowledge or publish content.

## Authorization and integrity

- The caller must still be the original outcome reviewer and snapshot actor, current workspace owner, platform admin and MFA-verified.
- The reviewed outcome, snapshot and unchanged decision-recorded meeting must agree.
- Input is an exact seven-field command with a distinct request UUID, reviewed confirmation, bounded instruction and one to three unique supported channels.
- The immutable receipt stores the exact review and generated request commands. Direct authenticated table access is denied.
- The existing private request/quota path is reused. Campaign preparation and generation remain separate explicit actions.

## Deferred founder/operator checks

These remain pending; automated verification is not founder acceptance.

1. **MT236 — setup and preservation.** Apply migrations through `065` once in order if hosted is behind. Expected: existing campaigns, media, meetings, outcomes and spending remain unchanged.
2. **MT237 — one reviewed handoff.** Enter `Prepare private Blog and LinkedIn follow-up drafts using only approved site facts.` Select **Blog** and **LinkedIn**, confirm, then create the request. Expected: exactly one private request and receipt; no generation, spending, message or publication.
3. **MT238 — refresh and privacy.** Refresh admin and Founder desk. Expected: the same identities, instruction and channels persist; Founder desk exposes no private turn text.
4. **MT239 — denials and retry.** Try a stale fingerprint, changed request UUID after success, changed/cancelled meeting, unrelated admin, viewer and former owner. Expected: denied; exact uncertain retry returns the original receipt without duplication.

## Verification and next boundary

Local verification covers strict contracts, RPC/store confirmation, admin/member UI, all migrations through065, SQL privacy/integrity assertions, builds and boundaries using synthetic data. Hosted SQL, browser/mobile, true concurrency and founder checks remain pending.

Group3 is not complete: truthful terminal recovery/closure is next. Group1 qualified optional AI visuals and Group4 live voice remain unfinished. Group5 office visualization remains on hold; Group6/custom agents remains out of scope.
