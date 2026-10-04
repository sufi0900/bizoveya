# Pilot controls verification — 1.24 / P04.3.3.5

Base main:`3ce1ce2465d5ca02a59b6e9e6ffd141a72c6f245`. Passed436 unit tests (330web/106admin),59 local PGlite SQL migration/assertion/upgrade checks, both typechecks/lints, app boundaries and both production builds. Builds used an isolated local source copy to avoid the prior watched-workspace cleanup race. The generated docs room includes document44. No real provider request, hosted SQL, browser or production acceptance is claimed.

Tests exercise default-off dispatch, consent/input allowlist, admin/MFA, owner-only queue/dispatch/output review, duplicate leases, immutable stale snapshots, unknown/error stop without retry, per-stage operator recheck, escaped output, QA blockers, optimistic review conflict, preserved manual drafts, bounded review history and missing-output-migration fallback. Local fixtures simulate Auth; they do not prove hosted JWT/RLS behavior or true concurrent processes.

Founder prior connectivity/rebinding/readiness results are recorded with scope in44; new MT138–144 are pending. Source remains disabled by default. Exact main source hash is recorded in GITHUB_DELIVERY.md after non-force delivery. No active lease remains at delivery; continuation must inspect current remote main before acting. Next: explicit manual Gemini pilot; no automatic visual/publishing advancement.
