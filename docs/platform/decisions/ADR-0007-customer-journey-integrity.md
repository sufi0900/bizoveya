# ADR-0007 — Customer journey and creation integrity

Status: adopted in source1.10 / P02.2.Fix-1; hosted acceptance pending. Owner: Sufian Mustafa. Date:2026-10-02 PKT. Future owner instructions may revise this decision; preserve reversal evidence.

## Context

Founder1.9 testing found stale public auth presentation, returning-workspace/navigation mismatch, duplicate saves/records, missing initial template selection and insufficient design differences. Isolated demo tests missed the signed-in end-to-end flow.

## Decision

Use explicit destinations: workspace-card overview, separate creation route/sidebar action, and native-business editor after success. Keep submission latched through navigation. Persist selected template and initial draft atomically in a role-checked RPC. Guard site name/URL identity for insert/update in the database, serialized per workspace, and owner workspace name for creation/rename. Preserve and flag old duplicates; do not auto-delete customer records. Provide three distinct design families using the shared renderer/content contracts. Disable unchanged saves and confirm dirty link/sign-out navigation. Add authenticated UI fixtures plus SQL regression tests to release gates.

## Alternatives and consequences

Client-only duplicate checks were rejected because simultaneous sessions/API clients bypass them. Unique indexes alone would fail on existing duplicate rows or force destructive cleanup. The trigger preserves old rows, skips unchanged legacy identity edits and checks new conflicts; locking must remain consistent for future mutations. Local synthetic Auth tests prove UI/adapter integration, not real provider security/concurrency. Browser Back guard is still a documented limitation. Registry labels and website brands remain distinct and are labeled explicitly. No AI provider, publishing, logo or separated-admin architecture decision changes.

## Affected sources

Documents02/03/04/05/07/08/09/10/11/13/14/15/16/17/19/20/22/23/24/25/26/27 and release records; marketing/workspace/business modules; migration023/operator report/assertions; authenticated browser harness. All current Markdown projects automatically into public docs after rebuild.
