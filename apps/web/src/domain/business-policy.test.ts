import { describe, it, expect } from "vitest";
import { arrangeSections, sectionOrderIssues } from "./business-policy";
import { businessEditingIssues, makeSection, sampleBusiness, saveBusinessSchema, studioSample } from "./business";
describe("homepage editorial policy", () => {
 it("blocks a moved/duplicate hero and early FAQ", () => {
  expect(sectionOrderIssues([makeSection("services","s"),makeSection("hero","h")])).toContain("Place the visible Hero first.");
  expect(sectionOrderIssues([makeSection("hero","h"),makeSection("hero","h2")])).toHaveLength(1);
  expect(sectionOrderIssues([makeSection("faq","f"),makeSection("about","a"),makeSection("services","s"),makeSection("contact","c")])).toHaveLength(1);
 });
 it("counts visible sections and preserves every item during explicit arrangement", () => {
  const sections=[makeSection("contact","c"),makeSection("faq","f"),makeSection("hero","h"),makeSection("services","s")];
  const fixed=arrangeSections(sections);expect(fixed.map(s=>s.id)).toEqual(["h","s","f","c"]);expect(sectionOrderIssues(fixed)).toEqual([]);expect(new Set(fixed)).toEqual(new Set(sections));
  expect(sectionOrderIssues([makeSection("faq","f"),...Array.from({length:5},(_,i)=>({...makeSection("about",`a-${i}`),visible:false}))])).toEqual([]);
 });
 it("keeps legacy readable but blocks oversized new writes", () => {const d={...sampleBusiness,headline:"x".repeat(121)};expect(businessEditingIssues(d)).toHaveLength(1);expect(saveBusinessSchema.safeParse({document:d,expectedVersion:1}).success).toBe(false);});
 it("sample fill preserves identity/contact and labels sample evidence", () => {const d={...sampleBusiness,name:"My agency",email:"hello@example.com",logo:"https://example.com/logo.png"};const filled=studioSample(d);expect(filled.name).toBe(d.name);expect(filled.email).toBe(d.email);expect(filled.logo).toBe(d.logo);expect(filled.sections.find(s=>s.type==="testimonials")?.items[0].body).toContain("Sample quote");expect(businessEditingIssues(filled)).toEqual([]);});
});
