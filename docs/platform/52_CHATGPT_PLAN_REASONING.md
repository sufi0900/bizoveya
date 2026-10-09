# ChatGPT subscription reasoning option

Research checkpoint: 2026-10-09 UTC. Status: planned, commercial access blocked; no live connection implemented. Source remains 1.26.0.

## Founder request and verified finding

The founder has ChatGPT Plus and requests an additional selectable subscription-backed reasoning/text option when the currently configured provider is unavailable. This extends the earlier image/template discussion: reasoning is the requested capability here. No specific legacy GPT model is required; model choices must come from the authorized account catalog.

Official Sign in with ChatGPT supports optional eligible plan usage. Identity sign-in and permission to consume plan usage are separate. The open-source/local flow is documented; paid or remotely hosted apps must use the commercial interest process. Bizoveya's hosted deployment has no evidenced approved commercial client or plan-usage entitlement. Public GitHub source alone does not establish eligibility for the hosted service. Plus ownership does not remove that application access gate.

Usage consumes existing Codex/ChatGPT work allowance; it adds no quota and imports no ChatGPT conversations/memories. Each customer authorizes their own account. The founder's Plus account must not become a shared customer credential. This preview does not support image-generation tools or voice/transcription. Current deterministic visuals continue independently.

## Planned implementation and dependencies

| Step | Required contract / exit evidence |
|---|---|
| Access qualification | Approved commercial client, supported redirects/scopes and plan-usage terms for the actual deployment. A separately scoped local installation may evaluate the local route; it is not a workaround for hosted access. |
| Per-user connection | Bind the OAuth connection to the authenticated Bizoveya user and authorized workspace; PKCE/state/nonce, ID-token/scope validation, protected token storage, refresh rotation and revocation. Never accept ChatGPT passwords, browser cookies or session-token pastes. |
| Selectable reasoning source | Keep platform API profiles distinct from personal subscription connections. Show account-specific model choices from GET https://api.openai.com/v1/models using that account's access token. Explicit selection/consent; no silent paid fallback. |
| Transport compatibility | Stream POST https://api.openai.com/v1/responses with store:false and stream:true; use supported input/instructions. Omit unsupported parameters including max_output_tokens. Only response.completed establishes success; handle failed/incomplete/interrupted streams and midstream usage-limit errors. Validate existing draft schemas locally. |
| Durable execution and accounting | Preserve admission, stage/request provenance, leases, source snapshots, guarded cancellation and review. Add an explicit subscription usage basis without inventing USD estimates or weakening existing API-spend controls. Bounded execution/cancellation must replace unsupported output caps deliberately. Preserve migration036 runtime contract until a separately verified compatible change exists. |
| Qualification tests | Mock transport/auth/refresh/revoke, cross-user denial, missing consent, stale account/model, partial streams, limits, invalid JSON and no paid fallback; then one separately authorized live synthetic test with exact account/model evidence. No repeated accepted campaign generation. |

The existing admin generation adapter uses platform environment-key slots, ToolLoopAgent.generate and maxOutputTokens. Its current API profile and monetary-ledger contracts cannot be relabeled as a Plus connection. This slice requires separate authentication, streaming and accounting design before runtime activation; no unqualified provider dropdown is added by this documentation checkpoint.

## Simple founder steps now

1. Open [commercial client access](https://developers.openai.com/siwc/request-client-id) and its linked interest form. Expected: application/waitlist process, not immediate Bizoveya authorization. Submit only if you wish; the assistant has not submitted it.
2. If the form requests a product description, use: “Bizoveya is a digital agency platform. We want each eligible user to authorize their own ChatGPT plan for private text drafting and reasoning. We will support account-specific models, usage limits and revocation, with no automatic paid API fallback.” Other form fields depend on the actual form; no invented required fields.
3. When access is approved, provide the non-secret registration instructions and permitted scopes/redirect requirements. Expected: enough information to scope the hosted OAuth integration. Keep client secrets, access tokens and refresh tokens out of chat and repository.
4. For this delivery, open the document room and search “ChatGPT subscription reasoning option”. Expected: this guide shows planned/blocked status. No key, SQL, generation or feature test is required now.

## Evidence and continuation

Research, repository inspection and documentation projection checks are complete only as recorded in the delivery log. OAuth connection, account catalog, live inference, quota/revocation and founder document-room confirmation are pending; none is claimed passed. Existing MT152–155 and unrelated pending tests remain pending. P04.3.3 remains in progress and template work is not dependent on subscription access. No hosted SQL, provider request, settings change or publication.

Official sources checked at this checkpoint:
- [Plan usage and local/hosted scope](https://developers.openai.com/siwc/token-sharing-open-source)
- [Commercial client access](https://developers.openai.com/siwc/request-client-id)
- [Account models and completed inference](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
- [Preview transport/capability limits](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)
- [Eligible plans, consent and usage allowance](https://learn.chatgpt.com/docs/sign-in-with-chatgpt)
