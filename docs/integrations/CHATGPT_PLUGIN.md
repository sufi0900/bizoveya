# Bizoveya ChatGPT plugin

The integration adds an authenticated MCP endpoint to the existing Next.js web application and a private plugin package at `plugins/bizoveya`. It keeps Supabase user identity, workspace membership checks, Row Level Security, existing draft validation and optimistic record versions.

## Implemented tools

| Tool | Behavior |
| --- | --- |
| `list_workspaces` | Read the user's workspaces and roles |
| `list_sites` | Read registered site records in one accessible workspace |
| `get_site` | Read one site's identity, role and version |
| `read_site_knowledge` | Read site knowledge and approval state |
| `read_campaigns` | Read campaigns, revisions, generation history and outputs |
| `save_campaign_draft` | Optional versioned campaign draft save |
| `save_knowledge_draft` | Optional versioned knowledge draft save; approval is removed on edit |

Draft tools are disabled by default. The endpoint has no publishing, approval, deletion, agent execution or provider spending tools.

## Authentication and configuration

The endpoint is `https://bizoveya.vercel.app/mcp`, using stateless Streamable HTTP with JSON responses. It supports MCP discovery, initialization, tool listing/calls and ping. It publishes OAuth protected-resource metadata at `/.well-known/oauth-protected-resource/mcp`.

Requests require a Supabase OAuth bearer token from an explicitly allowed client ID. Browser cookies, first-party tokens without an OAuth client ID, anonymous accounts, other issuers and privileged role tokens are rejected. The database client uses the existing anonymous key and the caller's token; no service role is used.

Configure the existing Supabase project:

1. In Authentication → OAuth Server, enable the OAuth 2.1 server.
2. Set the authorization path to `/oauth/consent`. The Auth Site URL must be `https://bizoveya.vercel.app`. Check the current Site URL before changing it: this Supabase project also serves existing portfolio sign-in flows. Preserve existing redirect allowlists.
3. Register a dedicated OAuth client using the exact callback URL provided by the ChatGPT plugin connection UI. Use a public client with PKCE when supported. Do not guess callback URLs or place a confidential client secret in the plugin package.
4. Set the following variables on the **bizoveya-web** Vercel project and redeploy:

```dotenv
BIZOVEYA_MCP_ORIGIN=https://bizoveya.vercel.app
BIZOVEYA_MCP_ALLOWED_CLIENT_IDS=<registered-client-id>
BIZOVEYA_MCP_ALLOW_DRAFT_WRITES=false
```

5. Complete plugin authorization with the normal Bizoveya sign-in and consent screen. After read verification, set `BIZOVEYA_MCP_ALLOW_DRAFT_WRITES=true` if draft editing is desired, redeploy, and refresh the connected plugin's tool list.

If the host requires dynamic client registration, enable it deliberately in Supabase, register through the host, then add that returned client ID to the allowlist. Keep registration IDs separate from user IDs. No client can access the MCP endpoint until allowlisted.

## Consent and revocation

The consent screen displays the requesting app, registered callback, requested identity scopes and account access. `/workspaces/connections` lists grants and supports revocation. Supabase manages authorization codes, PKCE and refresh token rotation.

Access covers all workspaces the connected account can access. It is not a grant for one selected workspace. Supabase OAuth access tokens also carry the user's existing Data API permissions; the MCP draft-write switch restricts this endpoint, not direct access to Supabase APIs. Before expanding to untrusted or public OAuth clients, design and test client-specific RLS and authorization rules across the shared project. The private integration must be used with a trusted registered client.

Revocation stops authorization and refresh. Already issued JWTs may remain valid until expiry. Use a short access-token lifetime appropriate for the account's data and do not claim instant revocation of existing JWTs.

## Verification

Focused tests cover bearer-only authentication, allowed clients, issuer/audience/role checks, invalid tokens, cross-origin rejection, JSON-RPC envelopes, bounded bodies, notification safety, draft-write gating, injected identity fields and version forwarding. Existing workspace, knowledge and campaign adapter tests verify owner/editor/viewer checks and conflicts.

```sh
pnpm --filter @bizoveya/web typecheck
pnpm --filter @bizoveya/web exec vitest run src/features/mcp src/features/workspaces/store.test.ts src/features/knowledge/store.test.ts src/features/campaigns/store.test.ts
pnpm --filter @bizoveya/web build
```

After deployment, verify protected-resource metadata, a 401 with `WWW-Authenticate` for an unauthenticated request, then connect through the actual MCP host and list workspaces. Test an editor draft save, a viewer denial, a stale-version rejection and grant revocation against the live app. Local fixtures are not evidence of completed live OAuth acceptance.

The source package is installable only after the production endpoint and OAuth configuration are active. Do not create an instructions-only replacement or claim that uploading a package deploys the MCP server.

## References

- [Supabase MCP authentication](https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication)
- [Supabase OAuth setup](https://supabase.com/docs/guides/auth/oauth-server/getting-started)
- [Supabase token security](https://supabase.com/docs/guides/auth/oauth-server/token-security)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
