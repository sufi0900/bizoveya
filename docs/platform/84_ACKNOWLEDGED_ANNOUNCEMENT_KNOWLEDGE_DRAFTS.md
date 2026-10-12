# Acknowledged announcement knowledge drafts

## Delivered boundary

BZ-103/CW-103 adds migration `067_reviewed_announcement_knowledge_handoffs.sql` and a complete private announcement-to-knowledge-draft workflow. After a founder records an announcement decision, distributes its private follow-up, and every exact pinned recipient acknowledges the versioned packet, the owner can save one reviewed source and proposed fact as a new Site knowledge draft.

The handoff pins the meeting version, roster version, agenda, decision, document, actor and command. It is retry-safe and owner-only. It never auto-approves knowledge, changes agent rules, calls a model, sends an external message, starts generation or publishes content. The existing knowledge room remains the only place where the owner can separately review and approve the saved draft.

This closes Group 3 source implementation for the documented private announcement, bounded deliberation, reviewed task distribution, interruption recovery and no-duplicate-effects boundary. Hosted activation and founder acceptance remain pending. Group 1 still needs a qualified optional artwork provider, Group 2 still needs the documented channel-specialist expansion, and Group 4 still needs qualified live transcription/speech capability. Group 5 remains on hold for founder design input and Group 6 remains out of scope.

## Later founder setup and acceptance

1. Apply migration `067_reviewed_announcement_knowledge_handoffs.sql` once in the same Supabase project, after `066`. Expected: it succeeds without changing existing drafts, knowledge or meeting history.
2. In a disposable announcement, use agenda `We are adding a verified AI workflow audit service.`, decision reason `Prepare this verified service update for private use only.`, distribution instruction `Prepare private channel drafts from this verified announcement.`, channel `blog`, and participant `content`. Complete the existing private packet acknowledgement. Expected: the meeting shows `content · acknowledged`; no provider call or publication occurs.
3. Enter knowledge title `AI workflow audit service announcement`, verified source text `Founder-reviewed announcement: Bizoveya is preparing an AI workflow audit service for private review.`, and proposed fact `Bizoveya is preparing an AI workflow audit service for private review.` Confirm and choose **Prepare knowledge draft**. Expected: one draft is saved and the meeting shows `approval pending`.
4. Refresh Agency planning, then open Site knowledge. Expected: the same source is present as Draft revision 1 and is absent from approved fact lookup until the owner separately reviews and approves it. A viewer, stale meeting version, incomplete acknowledgements, changed retry or second source attempt must be rejected.

## Verification

Local automated verification covers all 67 ordered migrations and 31 SQL assertion executions, owner/viewer boundaries, acknowledgement and exact-version gates, immutable lineage, exact retry, unapproved source state, projection, and zero generation side effects. Web unit, typecheck, lint, builds, application-boundary, whitespace, documentation-link and projection results are recorded in the current continuation checkpoint. SQL authentication is simulated; hosted/PostgREST, browser/mobile, real concurrency and founder acceptance remain pending. No hosted SQL, provider request, message, publication or deployment-setting change was made.
