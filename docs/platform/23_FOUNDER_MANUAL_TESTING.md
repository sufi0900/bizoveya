# Founder manual testing record

Living acceptance evidence. Keep founder-reported outcomes distinct from automated proof. A pass covers only the described steps, environment and package; never tick a grand phase based on route visibility alone. Failed/reversed tests remain in chronological history. Update this document and affected phase/manual/verification records after each report.

## Founder report — 1 October 2026, Asia/Karachi

Tester: Sufian Mustafa, founder. Package context: Bizoveya1.6 discussion. Environment: founder's local application (reported); actual Supabase project, migration ledger and browser unspecified. Report received at21:43:55 PKT. Exact test execution time not supplied. Evidence: founder's message in this conversation; no independent live session inspected. Do not invent screenshots, filenames, IDs or a more specific pass.

| ID | Scenario and expected result | Actual founder report | Status |
|---|---|---|---|
| MT-001 | Implemented pages respond | Routes including admin responded | [x] founder-reported route smoke pass |
| MT-002 | New business entry creates a planning record | New site creation produced the previously explained expected result | [x] founder-reported pass; no business publishing claim |
| MT-003 | Existing website registration saves site records | Founder added existing sites successfully | [x] founder-reported pass; no connector/editing claim |
| MT-004 | Operator-approved admin login + real TOTP + refreshed session | Founder explicitly did not perform admin login | [ ] pending on separated admin app |
| MT-005 | Tenant isolation, normal-user admin denial, revoke/recovery | No explicit result supplied | [ ] pending |
| MT-006 | Migrated web workspace flows retain data and behavior | Separation changes not tested by founder yet | [ ] short regression required |

## Subsequent test entry template

Record package/work item, report timestamp with timezone, execution timestamp if known, environment, tester, steps, expected result, actual result, pass/fail/blocked/pending, redacted evidence path and related defect. Repeat each affected test after its code changes; preserve superseded outcomes. No secrets, QR codes, passwords or customer data in this public room.

## Current acceptance

Site-registration smoke steps have owner-reported evidence. Real MFA/role isolation/session/recovery and deployment gates remain open. The founder elected to complete admin testing after separation; this moves its environment, not its requirement. No grand phase accepted.
