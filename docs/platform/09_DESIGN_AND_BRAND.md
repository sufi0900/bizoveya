# Design, templates and brand

**Current package1.7:** public/admin host ownership has changed. Read the Package1.7 section below and document24 before applying older setup instructions.

**Draft 0.1. Bizoveya is a provisional name. Logo, colors, domain and final messaging are open.** Existing Voxfolio styling and 3D experience are inherited, not a mandatory business-site aesthetic.

## Experience principles

Lead with the business outcome and the two clear entry choices: **Create a website** and **Connect an existing website**. An owner sees site, task, approval, spend and result in one place. The core path works in text/keyboard mode; voice and 3D enhance it when available. Show preview versus confirmation as separate actions, retaining V27.12's explicit template confirmation. Clearly distinguish draft, approved and live states and show what an agent can change before connection.

## Visual requirements

Create at least one service-business template with strong hero/offer, services, trust/evidence, FAQs, contact/lead CTA, mobile navigation and page metadata. Preserve portfolio layouts for personal users. Template choice should preview with real owner-approved content, responsive breakpoints and accessible focus states. Dashboard uses a consistent site switcher, route breadcrumbs, task timeline, approval cards and explicit connection health. Loading, empty, error, conflict, revoked grant and paused-task states need designs. Respect reduced motion, keyboard focus, contrast and readable typography; a 3D scene must have a usable non-3D path.

## Brand decision register

| Item | Current position | Decision evidence needed |
|---|---|---|
| Name | Bizoveya, working; inspired by business + via/path | Pronunciation/customer comprehension; domain/trademark review before commercial launch |
| Old identity | Voxfolio retained in source/history and portfolio product until planned migration | User journey and SEO/route redirect plan |
| Logo | None selected | Wordmark and compact mark at favicon/app icon size, monochrome and contrast tests |
| Colors/type | Not selected | Compare 2–3 directions on business landing, dashboard and native template |
| Tagline | Candidate: “Build, connect and run your business online.” | Customer comprehension and truthful scope at launch |

**Owner design choices requested:** choose among two or three annotated design directions, preferred first business template industry/example, desired emphasis on friendly versus premium/technical, and whether Voxfolio branding appears as “Portfolio by Bizoveya” during transition. These are open decisions, not blockers for document drafting. Avoid using unverified customer logos/testimonials or invented metrics.

## P01.0 document-room visual pattern

The first Bizoveya UI slice uses a calm slate/teal documentation palette, readable cards, prominent status labels, search, activity and phase summaries, responsive document navigation and accessible focus outlines. This is **not** a final product logo or general dashboard design system. Future design review may revise color and layout while retaining the same Markdown source contract.

## Document-room visual direction (P01.1 provisional)

Use a calm indigo/teal command-center palette with an accessible light/dark toggle, responsive cards, restrained graphic motif and readable long-form typography. The palette is a working interface direction, not the final Bizoveya brand or logo. Phase graphics and activity cards must derive from Markdown, expose explicit labels and never imply an accepted phase from a documentary substep. Dark mode stores a local preference and re-renders Mermaid diagrams in the matching theme. Provide keyboard focus, reduced-motion support and print styling. Owner visual approval remains pending.

## Admin UX and visual discussion requirements (planned)

Keep platform administration visually distinct from client workspace actions: visible role/environment, active/draft versions, saved-case results, change reason, affected scope, activation/rollback, masked credential status and explicit failure states. Show metrics with definitions and freshness; never imply login counts are live presence. Template editing previews supported content/layout before activation. Do not reuse the public docs route for admin management.

The existing document dashboard now projects the founder discussion, backend contract, new ADR and expanded logs from Markdown. Their tables, section reading maps and diagrams are shareable plans. This is not a new UI design implementation. Founder should later review admin navigation, role labels, secret entry/rotation UX and version comparison alongside template and brand choices already open. Logo/name selection remains provisional.

## Package 1.3 transition and impact synchronization

Planned workspace navigation shows implemented versus unavailable capability honestly, including empty/loading/error/denied states. New template selection follows a versioned catalog shared with voice tools and QA. Unsupported layouts require code, not a new admin text field. Preserve legacy UI until transition behavior and owner review are verified; no logo or final brand decision is implied.

## Package 1.4 — first practical workspace implementation

Implemented workspace UI uses a scoped dark-default dashboard with persistent light/dark preference, responsive sidebar/mobile navigation, cards, data-derived site counters, mode/status badges, clear registration choices, form feedback and focus/skip navigation. No charts of invented revenue/usage appear. The typographic B tile is a temporary interface mark, **not a finalized logo**. New pages use Bizoveya metadata; the root application name changes to Bizoveya while inherited portfolio screen titles/branding remain as the legacy module.

Visual content tests verify read-only/planned labels, viewer empty-state behavior and actual site counters. Browser viewport, focus traversal, theme persistence/hydration and screenshots are pending because no usable browser runner is present. Do not label the UI pixel-verified or supply synthetic screenshots.

## Package 1.5 — operator dashboard design

The admin area has a distinct scoped dashboard, dark-default palette, persistent light preference, responsive navigation, actual metric cards, explicit planned-capability cards, an access-event timeline and a focused authenticator screen. UTC times and metric definitions are visible. Navigation provides keyboard focus, skip link and named controls. No synthetic trend chart or online-user metric is displayed. Static render tests cover labels, escaping and data-derived values; actual browser/mobile/theme/MFA review remains pending. The temporary B mark is unchanged and remains provisional.

## Package1.6 — visual truthfulness and browser review

The existing visual design is preserved. Fixed release1.1/24-document labels discovered during actual browser inspection are replaced with current package/inventory projections on overview and detail pages. Phase summary wording no longer hardcodes P01.0's historical browser-review status. Screenshot and interaction evidence for desktop/mobile, themes, document navigation/search/diagrams and setup screens is recorded in `docs/delivery/P01.6/`; it does not depict authenticated admin/client data. Branding/logo decisions remain provisional.


## Package1.7 — separate admin application (current contract)

This section supersedes earlier same-host admin/source-path instructions for the current package, while preserving those earlier delivery records. Under ADR-0004, public code is apps/web/src; admin code is apps/admin/src. Source folders are not URL prefixes. The main host has no /admin or /api/admin pages/handlers, no admin button or redirect. Admin-only paths belong to the separate host; / redirects to its /login, with approved-role/MFA checks for protected pages/APIs. Admin has no customer/docs/marketing routes. All canonical Markdown remains at root docs/platform and is visualized only by the main app. Both deploy independently from one repository/ZIP; shared Supabase/migrations remain centrally managed. See23 for founder-reported testing,24 for explicit install/deploy/environment/manual instructions, and ADR-0004 for the decision. No new migration or live domain configuration is delivered. Real admin Auth/MFA, tenant isolation and production acceptance remain pending. Current source paths elsewhere in prior historical sections must be interpreted through this ownership map.
