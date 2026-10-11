# Meeting execution consent

## Delivered boundary

BZ-097/CW-097 follows resolved remote main `fec12866b356faf4a1d0f94491d19458e60023ba` (previous delivered tree `51694c06d9b5401778201bd5e1ecadd2d667a5b8`). Additive061 introduces explicit expiring, revocable consent for an existing060 qualified deliberation snapshot. The separate admin **Meeting execution consent** room displays the latest50 snapshots created by the signed-in founder in workspaces they currently own. Founder desk projects the same consent history read-only.

This completes the consent source slice only. It creates no reservation, worker claim, provider request, AI turn, usage, publication or task completion. The snapshot remains prepared and its executionEnabled flag stays false. Group3 still needs independent shared-budget accounting and bounded execution/result receipts. All first-four groups remain in progress; live voice is unfinished, Group5 office visualization ON HOLD for founder design and Group6 custom agents out of scope. Routine founder testing remains deferred until before public reveal.

## Authorization and review

Authenticated APIs and SQL independently require platform-admin membership, MFA aal2, current workspace-owner membership and the snapshot's original founder identity. An unrelated admin receives no snapshot queue; workspace editors/viewers cannot save or revoke consent. No service-key credential, provider key, environment flag or deployment setting is introduced. Private tables/helpers have no public, anon, authenticated or service-role direct grants.

A fresh grant pins snapshot identity, immutable fingerprint, exact current meeting/schedule/roster versions, a reviewed reason and explicit confirmation. It invokes060's full candidate recheck: unchanged ready acknowledged plan, enabled pinned roster, approved facts/preferences, exact current checked agents/bindings/model/credential/connectivity/pricing, compatible output bounds, full repeated-turn estimates and unresolved accounting guards. Changed context/qualification rejects consent instead of silently substituting a snapshot. Displayed parent/team blocking is preliminary; SQL rechecks full qualification on save.

Consent has a fixed15-minute expiry from creation, with at most one active unrevoked grant and25 lifetime grants per snapshot. The consent identity and original command/time/expiry cannot change. Immutable event1 records consent; event2 records revocation. Exact-command retry returns recorded truth even after expiry, pause or revocation, without extending expiry or granting fresh authority. A changed command for the same identity conflicts. Current owner/admin/MFA authorization is still required for retries.

Revocation uses a separately reviewed identity and reason. It remains available after qualification expiry, schedule pause, parent/team changes or the25-record limit, and can revoke an expired consent. Repeated same-reason revocation returns recorded truth; changed-reason retries conflict. Revocation does not modify the snapshot, parent, schedule, accepted draft or previous history. Site deletion cascades the new private records.

## UI and limitations

The room requires **Execution consent review reason** and the exact checkbox: **I reviewed this snapshot, approved context, exact limits and reason. Save 15-minute consent only.** Revocation requires **Revocation review reason** and **I reviewed this consent identity and reason. Revoke consent.** Confirmation binds the selected identity, versions and trimmed reason. Shared synchronous locking prevents overlapping actions; a failed exact grant keeps its in-memory UUID for a truthful retry.

Status is computed by SQL at read time: revoked takes precedence, otherwise expired at or after expiry, otherwise active. Browser and Founder desk labels are explicitly as of the last refresh; no timer invents server state. Active means consent exists, not that budget is affordable or AI work started. Refresh clears confirmation. Owner/member projections expose sanitized approved context and provenance, never credential references or private runtime inputs.

Accounting and the worker remain disconnected. A later fresh reservation/provider-start boundary must independently recheck unexpired/unrevoked consent, current authorization/owner/qualification/context, schedule and roster, assembled prompt-token bounds and shared daily budgets. Actual started usage must remain recordable after consent expiry/revocation or pause. Unknown spending must block unsafe retry instead of becoming zero.

## Verification and pending acceptance

Automated BZ-097/CW-097 verification: 480 web tests/80 files, 164 admin tests/18 files, 61 ephemeral local migrations/25 SQL assertion executions, both standalone typechecks/lints, both production builds, application boundaries and 644 affected local Markdown links passed. SQL fixtures use simulated auth and synthetic qualification; hosted/PostgREST/browser/mobile/true concurrency and all founder acceptance remain pending. No hosted SQL/provider request or generation. Guide78 and BZ-097/CW-097/MT220–223 visual projections are checked in the final build.

The new SQL fixture covers actual migrations with synthetic qualification and simulated Supabase identities: MFA and owner/admin access, malformed/null/stale commands, changed approved context/bindings/connectivity/roster/schedule, active-grant exclusion, fixed expiry, immutable records/events, exact retries, expired revocation,25-record cap with continued revocation, owner/admin removal, private ACLs, cascade and no generation/spending. Both applications test actual migrated JSON contracts; admin tests also cover server confirmation/error boundaries and consent-only rendering, and web tests cover read-only member projection and pre061 compatibility.

Hosted SQL/PostgREST/MFA behavior, browser/mobile, real concurrency, real expiry/reload and all founder acceptance are pending. Local fixtures are not hosted or founder evidence. No hosted SQL or provider call was performed.

## Four later manual steps

1. **MT220 — Setup and preservation.** When testing, apply only missing migrations in order through `061_meeting_execution_consents.sql` after060. No new key or flag. Expected: existing accepted drafts, reviews, media, meetings and history remain intact.
2. **MT221 — Save consent.** Use a disposable ready, acknowledged qualified snapshot from guide77; do not regenerate the accepted campaign. Sign into the separate admin app as the same snapshot founder/current owner with MFA and open **Meeting execution consent**. Review the expanded approved context/limits. Enter **Execution consent review reason**: `Consent to bounded private deliberation only.` Tick the exact consent checkbox above and click **Save execution consent**. Expected: one active grant with a fixed15-minute expiry and consent event; no AI turn or spending reservation.
3. **MT222 — Refresh, expiry and access.** Refresh admin history and Founder desk; verify the same consent identity/expiry and read-only member history. Refresh after15 minutes if checking expiry: expected expired, with original timestamp unchanged. An unrelated admin has no queue and non-MFA access is denied. These remain pending until observed.
4. **MT223 — Revoke and guards.** Enter **Revocation review reason**: `Withdraw this private meeting execution consent.` Tick the exact revocation checkbox above and click **Revoke selected consent**. Expected: revoked with one revocation event and intact snapshot; revocation stays available after pause/expiry, while fresh stale/changed-context consent is rejected. Real retry/concurrency acceptance remains pending.

## Next source boundary

Implement independent meeting-turn reservation/settlement/reconciliation and shared connectivity/generation daily-budget enforcement in both directions. Then implement one-attempt bounded ordered execution with immutable request/result provenance and current provider-start guards. Consent by itself must never trigger a provider. Preserve the existing036 runtimeVersion contract and successful campaigns. Keep all unanswered founder tests pending.
