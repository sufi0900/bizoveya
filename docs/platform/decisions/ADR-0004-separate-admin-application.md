# ADR-0004 — Separate administration application

Accepted owner direction,1 October2026. Source delivered in Bizoveya1.7; hosted deployment and authenticated acceptance pending.

The founder requested no public /admin route, redirect or button leading to administration. Folder locations are not URL prefixes. Use apps/web and apps/admin in one pnpm workspace, one GitHub repository and one cumulative ZIP, deployed as two Vercel projects. Shared database/migrations remain at root. No unnecessary shared UI/package abstraction is introduced in this slice; the small Auth client configuration is intentionally app-specific. A packages folder may be introduced when a real shared contract needs it.

Move existing admin pages and read-only APIs entirely out of web. Admin host root goes to its own login, followed by operator grant/MFA guards. Admin has no public signup, workspace, docs or marketing routes. Canonical public docs remain on the main website. Use distinct host-only admin session naming and refresh middleware; keep DB authorization authoritative. Do not claim separate domain means immunity to public/database/deployment compromises.

Founder registration/route smoke passes are recorded in23. Unperformed real admin/MFA/tenant/security checks remain pending and must be completed after separation. Preserve migration001–020 and existing data. No domain provision or remote grant is authorized/performed by delivering source. Document24 defines manual installation/deployment and rollback.
