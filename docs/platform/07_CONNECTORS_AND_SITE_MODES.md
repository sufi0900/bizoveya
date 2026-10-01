# Site modes and external connectors

**Draft 0.1.** Existing `/api/connect/*` routes in Voxfolio do not constitute a complete GitHub/Vercel/Sanity connector. Verify each integration with an authorized test account and explicit capability probes.

| Mode / adapter | Read | Draft/propose | Publish/merge | Source of truth and proof |
|---|---|---|---|---|
| Native portfolio (inherited) | Current project/API | Studio commands/revisions | Snapshot publish with owner | Supabase; baseline regression pending |
| Native business (proposed) | Typed pages/services | Preview/revision | Owner approved snapshot | Supabase; business template proof P02 |
| Public URL only (proposed) | Public crawl with consent/limits | Local proposal | None | External site; mark read-only |
| Sanity (proposed) | Scoped dataset/docs | Mutation to authorized draft, revision check | Explicit owner policy only | Sanity; readback/conflict proof P05 |
| GitHub (proposed) | Selected repo/branch | Branch and PR | Owner review/merge | GitHub; isolated check/PR proof P08 |
| Vercel (proposed) | Selected project/build status | Preview from branch | Deployment controls only after ADR | Vercel; linked preview/status proof P08 |
| Pinterest (proposed) | Authorized boards/pins | Draft/asset handoff | Per-action approval and API capability | Provider; receipt/readback proof P07 |
| WhatsApp/telephony (deferred) | Authorized business account | Simulator/test session | Message/call policy gate | Official provider; account, policy and cost proof P10 |

**Connect** retains existing CMS/repo/deploy; **import** copies selected content with provenance and owner's mapping; **rebuild** creates a new native site under an explicit migration plan. Do not conflate them. Capability discovery must show what is actually connected and what is unsupported. Token grants are per tenant/site/provider, least privilege, encrypted and revocable; credential status is visible without exposing values. Stale revision must stop the write and show diff. Publish/PR operations use receipts and reconciliation. Disconnection stops future work but retains agreed audit and enables deletion/export policy.

| First-party site | Working classification | Open validation |
|---|---|---|
| `doitwithai.tools` | Existing business/content site; first Sanity content proof candidate | Verify actual GitHub, Vercel, Sanity dataset, imported Markdown rules and grants |
| `sufianmustafa.com` | Existing personal/portfolio site | Verify repo/CMS/deploy, content model and desired editable scope |
| LIONXE | Business/framework site, development reportedly paused | Confirm exact active domain (`lionxe.com` versus `lionxeframework.com`), repo and safe read-only start |

A workspace may hold all three. No live site is automatically modified by registration. Future CMS/provider adapters require their own capability contract and acceptance tests.

## Model APIs are separate from customer connectors

Muse Spark/OpenAI/other model credentials do not provide a customer's authenticated CMS, social account or browser session. Connectors require their own supported authorization/capability contract and per-site grants. A custom connector that lets another assistant call Bizoveya is a separate inbound integration; it does not establish outbound delegated access to the assistant's entire runtime. No universal Pinterest editing or logged-in browser access is claimed.

Future admin `/admin/credentials` manages server-backed platform provider references; clients manage their own supported connector grants in site integration views. Rotation/disconnection must stop new use, reconcile already-started actions and keep redacted receipts. Where browser/code execution is needed, evaluate an isolated sandbox and account scope; ordinary CMS API use is not automatically browser automation. See [18_BACKEND_AND_ADMIN_CONTROL.md](18_BACKEND_AND_ADMIN_CONTROL.md).

## Package 1.3 transition and impact synchronization

Route registration does not authorize external access. Link each connector action to grant scope, approval/artifact version and receipt as specified in document 19. Connector callbacks/webhooks require their own provider contract and verification later; document 20 does not pretend these are all designed. First workspace registration is URL-only with no external mutation.

## Package 1.4 — first practical workspace implementation

Implemented modes are registry-only `external`, owned `native_portfolio` link, and `native_business` planning record. External URLs are normalized/validated and stored; no DNS lookup, HTTP fetch, login, CMS inspection, import, connector grant or external write occurs. URL eligibility is not ownership verification: the user declares authorization. Future connectors must independently verify capabilities and account grants.

Portfolio registration lists owned projects and rejects another user's project in the DB RPC. Existing site hosting/public URLs remain unchanged. Founder walkthrough: manually register `https://doitwithai.tools/` as business, `https://sufianmustafa.com/` as portfolio, and the confirmed LIONXE domain as business/paused if still paused. Do not assume the previously transcribed Lehonze spelling or a repo/CMS/account connection; confirm the actual domain before entry.
