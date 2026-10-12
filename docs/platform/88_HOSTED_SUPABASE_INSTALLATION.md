# Hosted Supabase installation — 040 through 070

BZ-107/CW-107 records the founder-authorized installation on12 October2026,23:20–23:26PKT, using source main `ace5ead73da6fa1a15504310baccfc0a0914450e`. The active project is `voxfolio`, reference `lvxrqmgsfarimbhmcbcc`. No other project was modified.

The actual catalog confirmed039 visual tables and v1 validation, with040 template validation and041+ tables absent. Hosted migration history was empty because earlier SQL was installed manually. The31 exact repository migrations040–070 were applied once, in order, through `apply_migration`; each succeeded and received a tracked timestamp. Earlier001–039 history was not invented or replayed. Future tooling must account for that manually installed baseline instead of assuming an empty database.

## Verified hosted evidence

| Check | Before and after fingerprint / result |
|---|---|
| Generation runs | `816e47b4970baf7c03e1533710a18836`, unchanged |
| Human reviews | `7d5ac3cabf75a88bdd38813b22f49797`, unchanged |
| Saved visuals | `4c335d077748ffe349b9397d1ae437e0`, unchanged |
| Visual revision history | `4fd3e29e5f04b211b5a178b670983f7e`, unchanged |
| Migration tracking |31 successful records,040 through070 |
| Terminal projection | `output_missing` implementation installed |
| Private projection | authenticated EXECUTE denied |
| Private tables | zero tables without RLS |
| Media bucket | `campaign-private-media`, public=false,5242880-byte limit |

No provider request, content generation, publication, team hiring, credential retrieval or deployment setting change occurred. The existing model and meeting enable flags were not altered. These read-only catalog and preservation checks are completed; full PostgREST/browser/mobile/role/concurrency/provider behavior remains pending. Installation portions of earlier setup tasks are evidenced; their remaining behaviors are not marked passed.

Security advisors returned INFO for68 RLS-enabled tables without policies (private RPC-mediated access), WARN for5 anon and84 authenticated executable SECURITY DEFINER functions, and WARN for disabled leaked-password protection. The callable RPC warnings need function-level review rather than blanket privilege removal. No security settings were changed. References: [anon RPC advisor](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [authenticated RPC advisor](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Later founder checks

1. Refresh the existing accepted campaign. Expected: Blog/Pinterest/LinkedIn output, human acceptance and saved visuals remain intact. No regeneration is necessary.
2. Open Founder desk/Agency planning. Expected: requests, onboarding, team and specialist controls load without a missing-migration error. Review before saving; the installation did not select a team for you.
3. If Image library reports missing activation, set web server-only `BIZOVEYA_MEDIA_SERVICE_KEY=<your Supabase service-role key>` in the existing deployment. This is a placeholder; never paste the real key into chat or a NEXT_PUBLIC field. Expected: the configured server can access private sanitized media. Deployment configuration remains founder/operator work.
4. Complete the deferred behavioral checks in the combined pending-test record before public reveal. Existing request/review sample fields remain in their original guides; no new form field was introduced by this installation.

Future direct Supabase installation is authorized for necessary reviewed project migrations, after checking the exact target, existing schema, dependencies and preservation. This does not authorize destructive resets, provider spending, customer publication or unrelated project changes. Group1 artwork and Group4 live voice remain unfinished; Group2/3 source completion is unchanged, Group5 ON HOLD and Group6 out of scope. The continuation automation remains paused.

Documentation-only verification: whitespace and linked guide paths checked. Prior full automated tests/builds at ace5ead are historical and were not rerun for this installation record.
