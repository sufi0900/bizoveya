# ADR-0006 — Modular Business Studio before business publication

Status: owner-approved direction, implementation present in1.9; hosted/manual acceptance pending. Decision report2026-10-02 00:31:45 PKT.

Context: P02.1 shipped one fixed business layout; founder requested attractive business-specific presets, customizable sections and coordinated variants. Preceding research shows established section editors and competing AI operations, so speed/AI alone does not justify exclusive positioning.

Decision: introduce strict schema-v2 sections and static capability/preset catalogue; one shared renderer/Studio; three presets; global brand settings and restrained section tones. Keep business facts separate from section presentation. Preserve content/IDs/optional instances on switching. Safe read migration, explicit save, additive022, private RLS and optimistic versioning. Preserve portfolio/admin/history. No extra provider/dependency.

Phase change: earlier P02.2 publication candidate becomes P02.3. P02.2 is modular Studio/three recipes; P02.4 expansion follows feedback. GrandP02 remains incomplete without publishing. This ADR supersedes only the corresponding fixed-template/phase-order assumptions inADR-0005; its entry/separation/private-draft decisions remain.

Consequences: presets are not isolated editors. Layout expansion still needs tested code/forward SQL. External image URLs need permission/privacy awareness; uploads, persistent business revisions, multi-page builder and booking/store are future work. Old app1.8 cannot read savedv2, so downgrade afterv2 saves requires reviewed conversion or a forward fix. Future agents consume supported catalogue/IDs, not duplicated template prompts.

Evidence: source domain/business.ts, features/business, migration022;26spec,25manual,23founder record, delivery reports. No live deploy/database write is claimed. Future owner instructions may revise this decision with a recorded new ADR/event.
