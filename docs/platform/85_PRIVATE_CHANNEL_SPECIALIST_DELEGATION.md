# Private channel specialist delegation

## Source checkpoint — BZ-104 / CW-104

Additive migration `068_private_channel_specialist_delegation.sql` introduces an owner-reviewed, site-private roster for Blog, Pinterest and LinkedIn specialists and one immutable delegation receipt per founder request. Every channel assignment pins an approved current `content` agent version; the same qualified agent may cover multiple channels, while different qualified Content-agent versions may be selected where available.

This is a compatibility-safe Group 2 expansion. The existing campaign runtime remains Coordinator → Content → Quality and existing campaigns, generated drafts, reviews, accounting and recovery are unchanged. A delegation receipt records responsibility and lineage only. It does not claim that a specialist ran, generated output, completed QA, sent a message or published content. Provider admission, spending, human review and publication controls remain separate.

The roster can be enabled or paused independently of the core site team. Enabling requires all three channel assignments to point to current approved Content-agent versions with qualified bindings and current spending policies. Pausing retains the saved assignments even when their qualification later expires, so an operator dependency cannot prevent the owner from stopping new delegation. Every changed revision is immutable, owner-only and optimistic-concurrency protected.

A proposed founder request can be delegated once. The function resolves only its requested channels against the current enabled channel roster, rechecks each pinned binding/policy, records the exact request version and roster version, then adds an immutable event. Exact same-command retry is idempotent; changed, stale, paused, unqualified, unauthorized or duplicate attempts fail closed. Existing campaign preparation remains available separately and is not silently changed by this checkpoint.

## Deferred founder checks — MT248–251

1. **Setup (MT248).** After all earlier required migrations, apply only `068_private_channel_specialist_delegation.sql` once. Open **Agency planning** and select **Load channel specialists**. Expected: existing core team, requests, campaigns, accepted drafts and meeting history remain unchanged; no new key or deployment setting is required.
2. **Reviewed roster (MT249).** Select an approved Content agent for Blog, Pinterest and LinkedIn. Specialist roster reason: `Enable these reviewed specialists for private channel delegation only.` Confirm **I reviewed these channel responsibilities...** and select **Enable channel specialists**. Expected: roster v1 with three immutable assignments; no generation, spending or publication.
3. **Private delegation (MT250).** Create a private request with instruction `Prepare private Blog and LinkedIn drafts from approved knowledge only.` Select Blog and LinkedIn. In its delegation control enter `Delegate this reviewed request to the current private channel roster.` Confirm and select **Delegate requested channels**. Expected: one receipt containing only Blog and LinkedIn, the pinned roster/request versions and `delegated` states. No AI output appears from delegation alone.
4. **Persistence and denial (MT251).** Refresh, then load the page as a viewer and from a stale owner tab. Expected: the receipt and roster persist; viewers cannot change or delegate; changed retries, stale versions and a new delegation while the specialist roster is paused are rejected. Existing campaigns and accepted outputs remain readable.

## Automated evidence and remaining boundary

Local verification covers strict contracts, owner checks, setup/conflict errors, UI language, all 68 migrations and 32 SQL assertion scripts. SQL fixtures simulate Supabase authentication and qualified bindings; they do not prove hosted PostgREST, real concurrency, browser/mobile acceptance or provider capability.

Group 2 is not yet declared complete. The next permitted source slice must carry this reviewed delegation lineage into the existing campaign/generation task without splitting or duplicating provider calls, then project terminal per-channel results and recovery truthfully. Group 1 optional AI artwork and Group 4 live voice remain provider-gated. Group 3 source stays complete. Group 5 remains on hold and Group 6 out of scope.
