import type { BusinessSection } from "./business";
export function sectionOrderIssues(sections: BusinessSection[]): string[] {
 const issues: string[] = []; const heroes = sections.filter(s => s.type === "hero");
 const visible = sections.filter(s => s.visible);
 if (heroes.length > 1) issues.push("Keep one Hero section. Remove extra heroes before saving.");
 if (visible.some(s => s.type === "hero") && visible[0]?.type !== "hero") issues.push("Place the visible Hero first.");
 if (visible.some((s, i) => s.type === "faq" && i < visible.length - 3)) issues.push("Keep FAQ within the last three visible sections.");
 return issues;
}
export function arrangeSections(sections: BusinessSection[]): BusinessSection[] {
 const heroes = sections.filter(s => s.type === "hero");
 const faqs = sections.filter(s => s.type === "faq");
 const middle = sections.filter(s => !["hero", "faq", "contact", "cta"].includes(s.type));
 const endings = sections.filter(s => ["contact", "cta"].includes(s.type));
 // Retain all content; never delete duplicate heroes or excess FAQ implicitly.
 return [...heroes, ...middle, ...faqs, ...endings];
}
