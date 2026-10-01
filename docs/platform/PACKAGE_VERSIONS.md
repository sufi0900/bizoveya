# Bizoveya ZIP and sub-implementation register

**Living record; time zone PKT (UTC+05:00).** Bizoveya starts at **phase 0**. The package label `0.n` means grand phase P00, sub-delivery n. With phase 1, use `1.0`, then `1.1`, etc.; a phase with a single delivery may only have `.0`. The phase number is an implementation stream, not a claim that the whole phase is accepted. Every delivered ZIP gets a unique, monotonically increasing version, exact filename, creation time, actor, source archive/commit, SHA-256, content/change summary, validation, and status. Never reuse a version or rename an already delivered ZIP retrospectively. A corrected package gets the next number and supersedes the earlier one explicitly.

**New package naming:** `Bizoveya_<phase>.<sub>_<short-description>.zip`, e.g. `Bizoveya_0.4_Versioning-and-Docs.zip`. Version identifies the phase-stream delivery substep; feature work IDs can span deliveries (ADR-0003 clarification below). For a significant new phase, update `10_PHASES_AND_STATUS.md` with its substeps before delivery; later discovery may add, reorder or skip substeps with recorded reason. Historical Voxfolio V27.12 and migration `017` are inherited source labels/SQL sequence numbers, **not Bizoveya release or ZIP versions**. Existing migration filenames remain unchanged because altering an applied migration can break upgrade tracking. Future migration IDs will be chosen after comparing the live migration ledger.

## Complete ZIP lineage known to this conversation

| Version / substep | Exact filename and creation time (PKT) | Purpose / status | SHA-256 / evidence |
|---|---|---|---|
| Source, outside Bizoveya series | `Voxfolio_V27_12_Cumulative(1).zip`; owner upload 2026-09-29 19:11 (minute precision) | Inherited Voxfolio source, 263 archive files. No Bizoveya version assigned. | `94a728cc385d8bb97737af4d17900d6b6416e591475e3f85bc31b0836ae8a62d`; owner upload `libfile_438f4e4725ec8191aeeb2506cedb255a` |
| 0.0 / P00.0 | `Sitevanta_Voxfolio_V27_12_Organized.zip`; 2026-09-29 19:16:51 | Pre-Bizoveya naming/organization prototype; superseded by 0.1. Retained for history, not a commercial name. | `1e68850a7d4fefcd19beb5b9bd4ed5f1c50b81ef057bd7ddad41ea83eea52cf1`; `libfile_bc04dd944514819181dda6c5470a91a0` |
| 0.1 / P00.1 | `Bizoveya_Voxfolio_V27_12_Organized.zip`; 2026-09-29 19:34:34 | First Bizoveya-named organized ZIP; inherited code and archive preserved. Superseded by 0.2. | `3cdde37e509a3557a706041af476cd30ac7a43b611e3bed4838d6102e2541448`; `libfile_b0c34a395e6c81918b7e7bb6bc6c7350` |
| 0.2 / P00.2 | `Bizoveya_V27_12_Documentation_Draft_01.zip`; 2026-09-29 21:26:52 | First draft of 13 core specs and supporting records; superseded by 0.3. | `3507c334c8bef2e0ef4534e834d9d0f695c06e3c59e86f5478225c89c6c16fab`; `libfile_4709ab233f34819193e281faf40739f4` |
| 0.3 / P00.3 | `Bizoveya_V27_12_Documentation_Draft_02.zip`; 2026-09-29 21:39:39 | Added completed-only and chronological logs; superseded by 0.4. | `bc501690cc7003cca2c9f7aca05e3ce1da2dfac0f3323f342adf37f122648255`; `libfile_4043635b3f648191b016c5f9b124fd4d` |
| 0.4 / P00.4 | `Bizoveya_0.4_Versioning-and-Docs.zip`; creation time and SHA-256 supplied in delivery handoff | Superseded by 0.5. Added independent Bizoveya version convention and mapped prior ZIPs to phase substeps; no app code/SQL changes. | Exact SHA-256 cannot be embedded inside the same ZIP without changing that ZIP; record externally in final handoff. |
| 0.5 / P00.5 | `Bizoveya_0.5_Manual-Rubric-Presentation.zip`; creation time and SHA-256 supplied in delivery handoff | Superseded by 1.0 after owner clarified presentation belongs inside the app. Added prelaunch user manual, internal rubric, six-page visual commercial PDF and source, and proposed Sites documentation portal plan. No application code/SQL changes. | Exact SHA-256 in external handoff; ZIP integrity and PDF render checks. |
| 1.0 / P01.0 | `Bizoveya_1.0_In-App-Document-Room.zip`; creation time and SHA-256 in delivery handoff | Superseded by 1.1. Public in-app Markdown document room at `/bizoveya/docs`; withdrawn 0.5 PDF and separate Sites plan; inherited product code otherwise preserved. P01.0 verification pending. | Typecheck, tests, clean production build/static output and ZIP integrity; manual browser/deploy pending. |
| 1.1 / P01.1 | `Bizoveya_1.1_Visual-Document-Dashboard.zip`; creation time and SHA-256 in delivery handoff | Superseded by 1.2. Visual Markdown-derived dashboard and document spotlights with persistent dark mode. No SQL changes. P01.1 browser/owner review pending. | Typecheck, tests, clean build/static output and ZIP integrity; deployed browser review pending. |
| 1.2 / P01.2 | `Bizoveya_1.2_Discussion-and-Backend-Plan.zip`; creation time and SHA-256 in external handoff | Superseded by 1.3. Detailed discussion/decision history and configurable backend/admin/credential/runtime planning; 27 current Markdown files; no application/SQL/dependency edits. | Archive/source-byte/link/projection/build verification in `11_VERIFICATION_AND_RELEASE.md`; browser/deployed acceptance pending. |

**Record integrity:** Archive SHA identifies a byte-exact ZIP; Git commit identifies a tracked checkout. Neither proves live deployment or feature acceptance. The completed-work and activity log repeat version/filename for each accomplished substep. At every future ZIP delivery, append a row here, an event in `ACTIVITY_LOG.md`, update `COMPLETED_WORK.md` if work is verified, and adjust phase substep/acceptance status. Record skipped or removed versions/steps explicitly; do not silently renumber history. The `0.3` time comes from Library creation metadata, not filesystem modification time.

## Reupload and substep clarification

The owner reuploaded 1.1 as `Bizoveya_1.1_Visual-Document-Dashboard(1).zip` (Library record 2026-09-30 02:21:53 PKT). It matches the original 1.1 SHA-256 `75460c21f63fd2ce74201bdb6e1824a9a56b13f435273cf60426c979c8a44cae`; `(1)` is a copy filename, not a produced version. Package 1.2 consumes the next delivery number for documentation synchronization. The undelivered P01.2 workspace-shell reservation moves to P01.3 explicitly under ADR-0002; no earlier ZIP/history is renamed. This registry has nine produced version labels 0.0–0.5 and 1.0–1.2, excluding the inherited source and duplicate reupload.

## Package 1.3 and stable work-item clarification

| Version / substep | Exact filename and creation time (PKT) | Purpose / status | SHA-256 / evidence |
|---|---|---|---|
| 1.3 / P01.3 | `Bizoveya_1.3_Dependencies-and-Transition-Plan.zip`; exact creation time in external handoff | Current full documentary package; P01.3-Plan complete, P01.3 workspace feature still planned; 30 current Markdown sources. | Source preservation, links, route inventory, production build and static projection in delivery verification; exact ZIP hash in external handoff. |

Package 1.2 is superseded as the current full archive, preserved unchanged. There are ten produced labels (0.0–0.5, 1.0–1.3), excluding inherited source and duplicate reupload. Under ADR-0003, each ZIP advances the delivery ordinal; the register records stable work items actually touched. A feature may span multiple packages without renaming its work-item ID. Next package is 1.4 if work continues in P01; this does not automatically complete or commence the P01.4 admin item.

## Package 1.4 — first practical workspace source

| Version / work item | Exact filename and creation time (PKT) | Purpose / status | SHA-256 / evidence |
|---|---|---|---|
| 1.4 / P01.3 | `Bizoveya_1.4_Workspace-and-Site-Foundation.zip`; exact archive time in external handoff | Current full source package; workspace/site code and migration, living docs and tests; phase acceptance pending | Exact ZIP SHA in external handoff; complete file hashes/checks in `docs/delivery/P01.4_VERIFICATION.json` |

Package 1.3 is superseded as the current full archive and remains unchanged. Eleven produced labels are known (0.0–0.5, 1.0–1.4). Application package metadata `1.4.0` is separate from ZIP delivery `1.4`. Under ADR-0003, ordinal 1.4 delivers stable feature work P01.3; the P01.4 admin work item is still planned. Next P01 archive is 1.5, recording the actual work/fixes it contains rather than shifting feature IDs.

## Package 1.5 — admin identity and control shell

| Version / work item | Exact filename and creation time | Purpose / status | SHA-256 / evidence |
|---|---|---|---|
| 1.5 / P01.4 | `Bizoveya_1.5_Admin-Identity-and-Control-Shell.zip`; exact archive timestamp in external delivery metadata | Current complete source package; admin identity/MFA/read-only overview and audit, migration/operator runbook; acceptance pending | Exact ZIP hash external; file hashes and checks in `docs/delivery/P01.5_VERIFICATION.json` |

Package1.4 is superseded as current source and preserved unchanged: SHA-256 `a8c58502682f1481e5d116b170cc36ab97ce13d99a6a577e210acc41d6e3cc02`, archive timestamp `2026-10-01T01:34:11+05:00` from prior delivery metadata. Twelve produced labels are known (0.0–0.5,1.0–1.5); metadata application version1.5.0 is distinct from ZIP1.5. Next P01 package is1.6. Feature ID P01.4 stays stable even if follow-up fixes/verification span more ZIPs. No grand-phase completion tick is implied.

## Package1.6 — Phase1 verification and hardening

| Version / work item | Exact filename and creation time | Purpose / status | SHA-256 / evidence |
|---|---|---|---|
| 1.6 / P01.4 | `Bizoveya_1.6_Phase1-Verification-and-Hardening.zip`; exact time external | Current cumulative source; recovery/document-label fixes, isolated SQL/browser tooling and living evidence; live acceptance pending | Exact ZIP hash external; `docs/delivery/P01.6_VERIFICATION.json` |

Package1.5 is superseded as current source, preserved unchanged: SHA-256 `99197dedea6d487354b435a181738d4703cdbfcda24551073fcba03b4c8bc5a8`, creation `2026-10-01T02:28:58+05:00`. Thirteen produced labels are recorded (0.0–0.5,1.0–1.6). ZIP1.6 and application1.6.0 are separate labels; stable work IDs include P01.4.Fix-1/P01.1.Fix-1. Next ZIP in this stream is1.7. No historical file is renamed.

| 1.7 | P01.5 source separation and documentation | `Bizoveya_1.7_Separate-Admin-Application.zip` | Two app roots in one cumulative archive; hosted/operator acceptance pending |

Next P01 ordinal:1.8. Never reuse1.7 or infer parent acceptance from packaging.
