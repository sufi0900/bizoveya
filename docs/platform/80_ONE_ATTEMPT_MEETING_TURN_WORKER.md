# One-attempt private meeting-turn worker

## Delivered boundary

BZ-099/CW-099 follows remote main `5fa3834990a2aae40605d9fdd68091d35d8de480`. Additive migration `063_meeting_turn_execution_receipts.sql` and the admin Node runtime connect one explicit founder action to one ordered private deliberation turn. Each request uses the exact qualified snapshot, active consent, selected agent/profile and limits already frozen by 060–062. The server rechecks the MFA admin session immediately before provider start. It exposes no credential, publishing action or external tool.

The first four evolution groups remain in progress. Group 3 now has real bounded turn execution and private per-turn projection, but still needs an explicit whole-deliberation completion/read model and safe terminal handling. Group 1 qualified optional AI visuals and Group 4 live voice remain unfinished. Group 5 office visualization stays ON HOLD for founder design input; Group 6 custom agents remains out of scope.

## Durable one-attempt order

The runtime performs `reserve → assemble bounded prompt → save immutable request → recheck operator → record provider start → one provider attempt → atomically save result and usage`. The existing shared accounting lock still controls admission and settlement. Exact request and result tables are private, RLS-enabled and immutable. The admin projection exposes the request hash, result, token counts, error and spending state only to the original eligible admin queue.

Preflight failure before request or provider start uses guarded zero-cost cancellation. Once request recording or provider-start outcome is ambiguous, the worker reports a stop and forbids blind retry. A provider failure is normalized and settled with known usage when available; missing usage remains unknown and blocks later work. Ordered admission still requires the preceding turn to be successful and settled/reconciled. Results cite only the approved source/version/fact identities in the saved snapshot. Results remain private and do not change site knowledge, campaign drafts, meeting decisions or publication state.

## Runtime and setup

The admin-only worker is default off. `BIZOVEYA_ENABLE_MEETING_EXECUTION=true` enables its explicit button after migration 063 and existing recorder/provider configuration are present. `SUPABASE_SERVICE_ROLE_KEY` and the selected `BIZOVEYA_<PROVIDER>_API_KEY` remain server-only. Do not add them to the web project or any `NEXT_PUBLIC_` field. This implementation makes no background call: the founder must review and click each ordered turn while consent is active.

Automated tests use injected providers and local synthetic HTTP/database fixtures; they make no provider request. Hosted migration, environment changes, browser/mobile behavior, real billing, true concurrency and founder acceptance remain pending.

## Four deferred manual steps

1. **MT228 — Setup and preservation.** Later apply only missing migrations in order through `063_meeting_turn_execution_receipts.sql`. On the admin deployment only, set `BIZOVEYA_ENABLE_MEETING_EXECUTION=true` after confirming the existing recorder and selected provider key. Expected: existing accepted drafts, media, meetings, consent and spending history remain unchanged; the active meeting shows **Run ordered turn 1**.
2. **MT229 — One disposable ordered turn.** Use a disposable qualified meeting only. Confirm: `I reviewed the active consent, next role and exact limits. Run one private provider attempt.` Click **Run private turn 1** once. Expected: one request hash, one result or honest failure, one accounting record and no publication/external action. Do not repeat the accepted campaign generation.
3. **MT230 — Persistence, order and access.** Refresh, then inspect the same turn receipt and private result. Expected: it persists; the next ordinal appears only after a successful settled/reconciled predecessor; stale consent, paused team, viewers and unrelated admins cannot start a turn.
4. **MT231 — Genuine failure evidence.** Test only naturally occurring preflight/provider failures. Expected: pre-provider failure settles at `$0`; started work retains known usage, while unknown/overrun evidence blocks later turns. Reconciliation reason sample: `Reviewed provider billing for this disposable meeting turn.` Never manufacture provider-start, usage or billing evidence.

## Next source boundary

Add the immutable whole-deliberation completion/read model after every planned turn has a truthful terminal receipt. It must distinguish completed, blocked and cancelled meetings, preserve every private turn, require founder review before any downstream task handoff, and never infer publication or external delivery. Qualified optional AI visuals and live voice remain separate unfinished groups.
