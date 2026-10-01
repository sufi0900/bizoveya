# ADR-0003 — Transition architecture and dependency traceability

**Status:** Adopted planning direction; implementation pending. **Package:** Bizoveya 1.3. **Actors:** Sufian Mustafa, founder/product owner; ChatGPT Codex assistant (exact model/version not independently verified). **Evidence:** Visible founder transition/dependency proposal and subsequent “ok proceed”; exact historical message time unavailable in this checkout, delivery time recorded in ACTIVITY_LOG.

## Decision

Extend the inherited Voxfolio app rather than rebuild. First practical slice implements tenant/site boundaries plus workspace pages and real APIs together, preserving legacy portfolio/public/voice behavior. Maintain a canonical route inventory and dependency/change-impact register. Do not treat all planned folders as deployed capabilities, expose unprotected admin shells or return fake API success. Template/voice agents discover an approved versioned capability catalog; executable components and validators still require code.

Package 1.3 is the documentation preparation slice associated with P01.3, not workspace-shell completion. Future ZIP numbers advance per delivery; work-item IDs remain stable even when work spans several ZIPs. A package records the work IDs it actually changes, rather than silently renumbering existing planned features each time another documentary package is delivered. Earlier 1.2 numbering and ADR-0002 are preserved as history. P01.4 admin identity/shell remains planned and depends on tenancy.

## Alternatives and consequences

Creating all future empty pages/handlers offers visible structure but weakens permission and behavior clarity; reserve paths in the register and scaffold only bounded needed screens. A separate AI dependency controller adds complexity without replacing contracts; start with explicit traceability and relevant tests, automate references later. Copying template descriptions into every agent prompt risks drift; shared catalog plus typed tools is preferred. This is a mutable plan, not a frozen technical stack or final route contract. New owner instructions can revise it through documented impact and acceptance changes.
