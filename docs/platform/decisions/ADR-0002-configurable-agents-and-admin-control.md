# ADR-0002: Configurable agents and protected platform administration

**Status:** Adopted for planning under founder instruction, 2026-09-30; implementation pending. **Owner:** Sufian Mustafa. **Package:** 1.2 / P01.2. **Evidence:** [discussion D01–D08](../17_DISCUSSION_AND_DECISION_RECORD.md). This is a living decision; exact SDK/provider/secret-store choices remain open.

## Context

After pausing development at package 1.1, the founder questioned Muse competition, embedding its agent/backend, model routing, API keys, SDK integration and editable agent rules. Frequent code edits for prompts/templates would make operational improvement cumbersome. Bizoveya already has server routes and Supabase; it needs a controlled configuration and administration extension.

## Decision

Keep Bizoveya's business data, permissions, task/audit contracts and user experience under our control. Prefer an application-run reusable agent SDK/runtime with replaceable model adapters; OpenAI Agents SDK is a candidate, not installed/finalized. Require verified NVIDIA-on-Nebius execution for the hackathon workflow. Treat hosted agent services as optional evaluated components rather than assuming every runtime must be custom.

Make agent defaults, model profiles, QA criteria and supported template metadata versioned configuration managed by authorized staff. Clients add site/workspace preferences and task requests inside enforced boundaries. Provide a protected super admin area, credential management, tests before activation, snapshot-per-run, rollback, monitoring and stop/reconciliation. Secrets stay server-only. One key per agent is not required. New executable tools and unsupported layout components still require code.

Do not embed or assume access to a personal Muse/ChatGPT session or its connected accounts. Muse Spark is optional and currently blocked for the intended Pakistan hosted-API path under the policy researched on 2026-09-30. No universal model ranking or guaranteed no-error AI is adopted.

## Alternatives

| Alternative | Tradeoff | Position |
|---|---|---|
| Embed personal Muse | Delegation API, account inheritance and eligibility not established | Not an implementation dependency |
| Hosted OpenAI Agents API | Can reduce runtime work; provider/feature/cost constraints require review | Optional future evaluation |
| Direct model calls and fully custom orchestration | Maximum control, greater repeated runtime work | Retain where suitable; not required for all agents |
| Application SDK plus config store | Reusable loop with product-owned controls; compatibility tests needed | Preferred planning direction |
| Edit source for every rule | Simple initially, slower operational iteration | Keep only for capabilities/invariants that need code |

## Consequences and sequencing

Add BR-18–BR-23 and NF-08–NF-10, backend/admin contract, schema candidates, protected route proposals, model/credential tests and manual acceptance gates. P01.2 is now the documentation synchronization delivery; move the **undelivered** workspace-shell reservation to P01.3 and add P01.4 admin identity/shell. Earlier delivered versions and pending P00.6 are unchanged. Admin configuration/runtime follows P04 substeps; templates P02.1; broader operations P11.1.

No product implementation is claimed in this ADR. A future replacement decision must explain evaluation evidence, migration, affected docs, retained run/config history and rollback. Preserve the founder discussion and append corrections instead of erasing earlier misunderstandings.
