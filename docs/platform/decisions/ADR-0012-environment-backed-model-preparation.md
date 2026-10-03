# ADR-0012 — Environment-backed model preparation

Status: implemented source1.15/P04.2.1; hosted/manual acceptance pending. Revisable first implementation decision.

Continue the plannedP04.2 preparation without introducing a new secret vault or unproven runtime. Actual provider keys remain in private server environment variables managed through deployment/provider settings. DB/dashboard contain fixed provider references and candidate configuration only. This is a bounded implementation ofP04.2, not completion of protected secret-entry/health/rotation workflows.

Fixed references map to three named optional server variables; presence returns boolean for current admin deployment only, never value/length/prefix/fingerprint or arbitrary env lookup. Current named admin+AAL2 protects APIs/RPCs. No fresh reauthentication flow newly added. Candidate model IDs are operator-supplied; syntax validation does not prove availability/capabilities/pricing. Token/budget settings are future metadata, not runtime enforcement.

Save immutable candidate versions; check current enabled reference version. Enable/disable/record-rotation increments reference version and invalidates old dependent checks. Environment change itself is not detected automatically; actual rotate/revoke must happen privately and be recorded after redeploy. Model profiles are not bound to agents. Migration028 adds private metadata-only tables and audited RPCs, no admin grants/secrets/runtime. Preserve earlier migrations/history. No live/paid call.

Consequences: preparation can be reviewed and tested with no actual key; same repo/two deployments. Actual secret changes still require deployment account access/redeploy and reference record action. Future SDK/provider compatibility, authenticated validation, fresh reauth, agent binding, budgets/trace and model QA remain mandatory follow-on. Never label key presence or syntax check as activation/provider health. See33,19 and30.
