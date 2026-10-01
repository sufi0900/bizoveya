import { describe, expect, it } from "vitest";
import { latestPackage, phases } from "./insights";
const row = (version: string) => `| ${version} / P01.4 | \`Bizoveya_${version}_Admin-Identity.zip\`; time external | Source, acceptance pending | Evidence |`;
describe("document-room release projection", () => {
  it("chooses numeric delivery order including double-digit subversions", () => { expect(latestPackage([row("1.9"), row("1.10"), row("1.2")].join("\n"))).toEqual({ version: "1.10", filename: "Bizoveya_1.10_Admin-Identity.zip", title: "Admin Identity" }); });
  it("compares grand phase before subversion", () => { expect(latestPackage([row("1.99"), row("2.0")].join("\n"))?.version).toBe("2.0"); });
  it("does not promote a next-package mention in prose", () => { expect(latestPackage(`${row("1.6")}\nNext package is 1.7: Bizoveya_1.7_Future.zip`)?.version).toBe("1.6"); });
  it("ignores a reservation without an exact ZIP filename", () => { expect(latestPackage(`${row("1.6")}\n| 1.7 / P01.4 | Not yet packaged | Planned |` )?.version).toBe("1.6"); });
  it("does not invent a version for empty or malformed records", () => { expect(latestPackage("")).toBeNull(); expect(latestPackage("Bizoveya 1.1")).toBeNull(); });
  it("keeps parent acceptance separate from an implemented substep", () => { expect(phases("| [ ] P01 Workspace | Scope |\n| [x] P01.4 Admin | Done |\n| [~] P02 Business | Scope |").map(p => [p.id, p.status])).toEqual([["P01", "planned"], ["P02", "in-progress"]]); });
});
