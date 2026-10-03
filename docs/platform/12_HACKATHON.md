# Nebius x NVIDIA hackathon workstream

## Historical snapshot — 1.18 / P04.3.1

Reviewed model assignments are implemented at `/admin/bindings` and `/api/admin/bindings` on the separate admin host only. Migration 031 is additive after 030. An assignment pins a checked latest preview-approved agent version, matching-tier checked model profile, enabled credential-reference version and successful matching connectivity-test ID. Evidence must remain less than 24 hours old. Version changes, rotation, revocation or expiry require review; disable retains history. This is assignment configuration, not paid execution, budget enforcement or customer draft generation.

Use [37 Agent model assignments](37_AGENT_MODEL_ASSIGNMENTS.md) for setup and pending MT095–101. Next are P04.3.2 spending controls, P04.3.3 durable text drafts, and P04.3.4 visual composition. Publishing remains deferred. The founder's successful local Gemini test is accepted only for the evidenced case; all other unevidenced manual tests stay pending.

The founder approved one branch/PR per phase and six-hour continuation. GitHub reads succeeded but branch creation returned HTTP403 `Resource not accessible by integration`. No remote branch, commit or PR was created. The schedule was created then paused pending write access. See [38 Delivery and continuation](38_DELIVERY_AND_CONTINUATION.md). Earlier contracts below remain historical where superseded.


## Historical contract — package1.9 / P02.2

P02.2 strengthens the business editor/demo but does not implement Nebius, NVIDIA, Gemini or agency agents. Do not present those planned features as live hackathon functionality. Demonstrate template selection, content-preserving layout switching and workspace drafts honestly. Before submission verify the current official event rules separately; this phase does not certify eligibility or winning criteria.

Earlier dated sections below retain history; this current contract supersedes conflicting instructions.


## Historical contract — package1.8 / P02.1

Judge entry can now start on the Bizoveya homepage and test the public Service Studio demo before signing in. The example is explicitly fictional and unsaved. Do not claim business publishing, AI workforce automation, channel connections or required sponsor-model execution from P02.1; those features/evidence remain later phases. Existing portfolio voice functionality remains inherited and requires its own live keys/tests.

Earlier sections below retain planning/delivery history; conflicting capability or path descriptions are superseded by this current contract and document25.

**Draft 0.1, 29 September 2026. Rules need a fresh check before submission.** Official rules: <https://nebiusglobalaihackathon.devpost.com/rules>; overview: <https://nebiusglobalaihackathon.devpost.com/>. Submission deadline shown as **30 October 2026, 10:00 a.m. PDT**. The existing Voxfolio predates this submission period; disclose it and show substantive new Bizoveya work performed during the allowed period. Do not frame inherited portfolio features as newly built.

## Competition proof

- Select a qualifying track from official categories based on actual finished capability; initial hypothesis is an application/agent workflow, not a chosen entry yet.
- Show real runtime use of Nebius Token Factory or Nebius AI Cloud with an eligible NVIDIA open model in the central experience. `src/lib/agent-provider.ts` includes a Nebius option, but model ID, live account call, trace, eligibility and role in the complete workflow are **unverified**. Verify function/structured output behavior against <https://docs.tokenfactory.nebius.com/ai-models-inference/function-calling> and actual account.
- Proposed demo: register/connect a site; approve business knowledge; manager plans an article using qualifying model; show Sanity draft, meeting/interruption, approval and trace. Include only steps truly built and working. Preserve a short, repeatable judge path and backup if a third-party integration is down.
- Prepare public licensed repository with meaningful README/setup, live demo access, public YouTube video within the official time limit, project write-up, required feedback and any official fields. Review current rules for exact limits, track and eligibility before publishing.
- Maintain evidence: pre-existing Voxfolio baseline commit, new commit range/diff, model ID and redacted request/response/usage, real demo URLs, test outcomes, source license and video link. Never reveal tokens or customer documents.

## Separate commercial scope

WhatsApp telephony, billing, full workforce and three-site rollout can remain roadmap features unless implemented and demonstrable. A hackathon entry is not proof of production security, billing or operational scale. P12 status remains `[ ]` until the owner reviews the public submission and judge flow. Devpost submission and public release are explicit owner actions.

## Research-pause update and admin proof (2026-09-30)

The official overview was rechecked: required inference infrastructure is Nebius Token Factory or AI Cloud and at least one NVIDIA open-source model. The commercial provider-neutral plan does not replace that requirement. Exact deployed runtime/model/account evidence is still pending. An application SDK is acceptable only as plumbing around a real qualifying workflow, not a substitute model path. The Apps and Agents track remains the working recommendation, not a submitted selection.

A compact proposed demonstration: admin edits a QA criterion → saved-case test compares versions → authorized activation → founder requests a real content/distribution draft → qualifying model and tools apply the active criterion → client reviews output → trace shows config version, validation and approved external result where supported. Do not simulate a live publish claim or fabricate use metrics. Show new work relative to inherited Voxfolio explicitly.

Interpretation of judging: configuration control can support reliability/design/impact, but a large settings dashboard alone is not proof of a useful AI workflow. Organizer guidance favors multi-step tool workflows; focus the demo on a real result and keep admin management concise. Use sanitized demo credentials/accounts separate from production super admin. This package updates plans only and is not a hackathon-ready agent implementation.

## Package 1.4 — first practical workspace implementation

This is substantive new workspace/site infrastructure relative to the preserved Voxfolio baseline, but it is not yet a qualifying AI-agent demo. Package 1.4 introduces no new Nebius/NVIDIA runtime call or provider trace. The founder must still demonstrate a real eligible model-powered workflow in later P04 work, reconcile current official rules before submission, and disclose the inherited baseline. Local tests do not prove a live deployment or complete hackathon readiness.

## Package 1.5 — demo scope remains bounded

The admin identity/control shell is infrastructure for later configurable operations. It has no new Nebius/NVIDIA invocation or qualifying agent task, so it is not evidence of the AI demo requirement. Show only real aggregate/audit data after staging acceptance; do not display private authenticator setup, client information or credentials in a public demo. This delivery does not revalidate competition rules or deadlines; refresh those from official sources before submission.

## Verified API access route2026-10-03

Rules require an NVIDIA open-source model AND Nebius Token Factory runtime call or use of Nebius AI Cloud. Prefer NVIDIA Nemotron served by Token Factory for Bizoveya. Separate NVIDIA Build/NIM API key is not required on this path. Generic third-party Nemotron alone, or Gemini alone, does not satisfy the Nebius runtime condition. Pakistan is not explicitly named in the rules' exclusion examples, but the list is non-exhaustive and other eligibility conditions apply. Missing +92 in NVIDIA verification does not itself prove hackathon ineligibility. Organizer confirmation is appropriate if access/eligibility is uncertain.

1. Sign up at https://tokenfactory.nebius.com with accurate details.
2. Open https://nebiusglobalaihackathon.devpost.com/resources and its credit form: https://nebius.com/promo-code?utm_promo_activation_code=NEBIUS-DEVPOST-GLOBAL26&utm_promo_code_type=Token_Factory&utm_promo_event_code=2026-devpost-global-ai-hack . Activation code NEBIUS-DEVPOST-GLOBAL26. Resources advertise$25 credits plus another$25 via https://dev.nebius.com/builders ; subject to access/eligibility/availability. Confirm credited balance in dashboard; do not assume success.
3. Choose credited project -> API keys -> create/get key; copy privately. Key is obtained from dashboard, not assumed mailed. Select an available NVIDIA Nemotron model and copy exact case-sensitive API ID from current catalog.
4. Set BIZOVEYA_NEBIUS_API_KEY on admin server only; restart local server or redeploy admin after env changes. Current adapter's endpoint is https://api.tokenfactory.nebius.com/v1 . NVIDIA Build/other-host keys will not authenticate there; arbitrary endpoints are not configurable in current UI.
5. Admin Models: provider nebius, reference platform-nebius, exact model ID, intended tier and daily cap; save/check, enable reference with review. Admin Spending: real model rates/fees, source, expiry and small caps. Credits fund billable usage: do not set rates tozero just because credits cover cost. One explicitly authorized test checks connectivity; a qualifying real draft workflow is still needed for hackathon demonstration.
6. If signup is blocked, ask Nebius support and hackathon organizers using Discussions/Discord linked from Resources, with exact country/error and screenshot. Request confirmation of Pakistan participation, Token Factory access and credits. Do not select a false country or assume another hosting provider satisfies rules.

Optional NVIDIA Build account support: official forum points to help@build.nvidia.com with registered email, attempted number, error and screenshot. Assistant sent no message. Sources checked2026-10-03: https://nebiusglobalaihackathon.devpost.com/rules ; https://docs.tokenfactory.nebius.com/quickstart ; https://forums.developer.nvidia.com/t/manual-account-verification-request-pakistan-92-missing/374847 .
