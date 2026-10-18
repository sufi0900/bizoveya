# Draft length and review reliability

BZ-120/CW-120 — 18 October2026 PKT. Base main507a9c24639426894655a4d981759cac8e5f4315. Remote main/branches/open-PR query inspected; no AGENTS/active lease. Office remains ON HOLD.

## Observed evidence

The founder supplied local receipt a268523a: Coordinator, Content and Quality completed using qwen3:4b in5m45s; two changes-requested human reviews are present. No production acceptance or writes occurred. The blog body has316 whitespace-separated words against the coordinator's600–800-word instruction. The writer incorrectly uses named title/slug/schema tools to outline content; the reviewer misses these claims and incorrectly reports a missing LinkedIn tool name. Saved feedback is evidenced; refresh/disconnect behavior is not established from this packet alone. Original receipts remain unchanged and are never committed.

## Correction and limits

Writer instructions explicitly prohibit title-generator outlining without approved capability evidence, prioritize body length and concise citation lists. Reviewer instructions require checking actual channel text, quoting defective claims, distinguishing general advice from product claims and inspecting tool-action pairings. Prompt changes improve guidance but cannot guarantee a small model follows it or remove all inaccurate findings.

Shared quality validation in both hosted generation settlement and local Ollama execution independently counts blog-body whitespace-separated words against one explicit numeric range in the frozen campaign brief, such as `Blog draft: 600–800 words.` It does not take coordinator output as authority. Too-short or too-long output forces approved=false and prepends a blocker while preserving drafts, token usage and other findings (bounded50). No extra model call or automatic rewrite/retry occurs. Ambiguous/multiple/reversed ranges, unspecified length and ranges outside supported bounds remain human review. This check does not prove factual accuracy. Existing saved receipts are not retroactively changed.

## Later founder check

1. Update from main while preserving both local environment files and the admin local-receipt folder. Restart both local servers. No new environment variable, key, SQL or package.
2. Keep the existing rejected result. When ready for a new authorized test, prepare a fresh snapshot through the existing campaign/readiness flow with brief `Blog draft: 600–800 words. Use only approved product capabilities; keep general workflow advice separate.`
3. In Watch local agents work choose Real local Ollama generation, reason `Check blog length and grounded tool claims; do not publish.`, authorize and run once. Expected: retained three-stage receipt or truthful failure; out-of-range blog receives a deterministic blocker even if AI approves.
4. Read the actual Blog and LinkedIn text and reviewer findings. Do not accept unsupported capabilities. Download the packet; content quality remains pending until real output is reviewed. Requesting changes stores feedback only.

## Verification

Verification BZ-120:267 admin tests/29 files,578 web tests/98 files,both typechecks/lints/production builds,application boundaries,whitespace and1055 local Markdown links passed. Web generated157 projected pages including guide101. After tightening range parsing,45 targeted runtime/local regressions also passed. No migration changed; no new hosted SQL or actual provider/browser execution. MT299 and corrected content acceptance remain pending.
