import { z } from "zod";
import { arrangeSections, sectionOrderIssues } from "./business-policy";
const text = (max: number) => z.string().trim().max(max);
const email = z.union([z.literal(""), z.email().max(254)]);
const service = z.object({ title: text(80).min(1, "Enter a service title."), description: text(400) }).strict();
const legacyFields = { accent: z.enum(["mint", "blue", "amber"]), name: text(80).min(1, "Enter your business name."), headline: text(140).min(1, "Enter a headline."), description: text(500), about: text(1500), location: text(160), email, phone: text(60), services: z.array(service).min(1).max(6) };
export const legacyBusinessSchema = z.object({ schemaVersion: z.literal(1), templateId: z.literal("service-studio-v1"), ...legacyFields }).strict();
export const sectionTypes = ["hero", "services", "about", "testimonials", "projects", "faq", "contact", "cta"] as const;
export type SectionType = typeof sectionTypes[number];
export const sectionCatalog: Record<SectionType, { name: string; layouts: readonly string[]; description: string }> = {
  hero: { name: "Hero", layouts: ["split", "centered", "editorial"], description: "Introduce your business and next step." },
  services: { name: "Services", layouts: ["cards", "list", "rows"], description: "Explain what you offer." },
  about: { name: "About", layouts: ["split", "text"], description: "Tell your business story." },
  testimonials: { name: "Testimonials", layouts: ["cards", "featured", "slider"], description: "Add genuine customer quotes only." },
  projects: { name: "Projects", layouts: ["grid", "featured"], description: "Show approved work and project context." },
  faq: { name: "FAQ", layouts: ["accordion", "list"], description: "Answer common customer questions." },
  contact: { name: "Contact", layouts: ["panel", "compact"], description: "Use your shared contact details." },
  cta: { name: "Call to action", layouts: ["banner", "centered"], description: "Invite customers to contact you." },
};
export const imageSchema = text(1000).refine(value => {
  if (!value) return true;
  if (/\s/.test(value)) return false;
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password && !/^(localhost|127\.|\[?::1\]?)/i.test(u.hostname); } catch { return false; }
}, "Use a public HTTPS image URL, or leave it blank.");
export const sectionSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/), type: z.enum(sectionTypes), layout: text(24), visible: z.boolean(), tone: z.enum(["base", "soft", "accent"]),
  heading: text(140), body: text(600), image: imageSchema, imageFit: z.enum(["cover", "contain"]).optional(), imagePosition: z.enum(["center", "top", "bottom"]).optional(),
  items: z.array(z.object({ title: text(100), body: text(600), image: imageSchema }).strict()).max(8),
}).strict().refine(s => sectionCatalog[s.type].layouts.includes(s.layout), "Choose a supported layout for this section.");
export type BusinessSection = z.infer<typeof sectionSchema>;
export const presetIds = ["service-studio-v1", "local-services-v1", "creative-business-v1", "wellness-studio-v1", "education-academy-v1", "product-launch-v1"] as const;
export const businessDocumentSchema = z.object({ schemaVersion: z.literal(2), templateId: z.enum(presetIds), ...legacyFields, font: z.enum(["editorial", "modern"]), logo: imageSchema.optional(), hours: text(300), sections: z.array(sectionSchema).min(1).max(20) }).strict().superRefine((d, ctx) => {
  if (new Set(d.sections.map(s => s.id)).size !== d.sections.length) ctx.addIssue({ code: "custom", message: "Section identifiers must be unique.", path: ["sections"] });
  if (new TextEncoder().encode(JSON.stringify(d)).length > 60000) ctx.addIssue({ code: "custom", message: "Draft is too large. Shorten content or remove unused sections." });
});
export type BusinessDocument = z.infer<typeof businessDocumentSchema>;
export const storedBusinessSchema = z.union([businessDocumentSchema, legacyBusinessSchema]).transform(d => d.schemaVersion === 2 ? d : upgradeBusinessDocument(d));
export const saveBusinessSchema = z.object({ document: businessDocumentSchema.superRefine((d, ctx) => { for (const message of businessEditingIssues(d)) ctx.addIssue({ code: "custom", message }); }), expectedVersion: z.number().int().min(0) }).strict();
export const businessDraftSchema = z.object({ site_id: z.uuid(), document: storedBusinessSchema, version: z.number().int().positive(), updated_at: z.string() });
export function makeSection(type: SectionType, id: string): BusinessSection {
  return { id, type, layout: sectionCatalog[type].layouts[0], visible: true, tone: type === "about" ? "soft" : "base", heading: "", body: "", image: "", items: [] };
}
export function upgradeBusinessDocument(d: z.infer<typeof legacyBusinessSchema>): BusinessDocument {
  return { ...d, schemaVersion: 2, font: "editorial", hours: "", sections: [makeSection("hero", "hero"), makeSection("services", "services"), { ...makeSection("about", "about"), visible: Boolean(d.about) }, makeSection("contact", "contact")] };
}
export function newBusinessDocument(name: string, templateId: BusinessDocument["templateId"] = "service-studio-v1"): BusinessDocument {
  return applyPreset(upgradeBusinessDocument({ schemaVersion: 1, templateId: "service-studio-v1", accent: "mint", name, headline: "Introduce what your business does", description: "", about: "", location: "", email: "", phone: "", services: [{ title: "Your first service", description: "" }] }), templateId);
}
export const businessPresets = [
  { id: "service-studio-v1", slug: "service-studio", name: "Professional Practice", description: "A focused starting point for freelancers, consultants and small digital agencies.", accent: "mint", font: "editorial", types: ["hero", "services", "about", "faq", "contact"], hero: "split", services: "cards" },
  { id: "local-services-v1", slug: "local-services", name: "Local Services", description: "A clear, approachable layout for repair, cleaning and neighbourhood services.", accent: "blue", font: "modern", types: ["hero", "services", "about", "faq", "contact", "cta"], hero: "centered", services: "list" },
  { id: "creative-business-v1", slug: "creative-business", name: "Creative Business", description: "A project-led design for creative freelancers, design studios and digital agencies.", accent: "amber", font: "editorial", types: ["hero", "projects", "services", "about", "contact"], hero: "editorial", services: "rows" },
  { id: "wellness-studio-v1", slug: "wellness-studio", name: "Wellness Studio", description: "A calm, spacious starting point for wellbeing studios and personal care services.", accent: "mint", font: "editorial", types: ["hero", "about", "services", "faq", "contact"], hero: "split", services: "rows" },
  { id: "education-academy-v1", slug: "education-academy", name: "Education Academy", description: "A clear, energetic starting point for tutors, training providers and small academies.", accent: "blue", font: "modern", types: ["hero", "services", "about", "faq", "contact", "cta"], hero: "split", services: "cards" },
  { id: "product-launch-v1", slug: "product-launch", name: "Product Launch", description: "A dark, focused product showcase for software teams and early-stage startups.", accent: "mint", font: "modern", types: ["hero", "services", "projects", "faq", "contact", "cta"], hero: "centered", services: "cards" },
] as const;
// Apply a design recipe to existing instances. Keep all section content, IDs and
// optional sections; create empty missing recipe sections instead of sample claims.
export function applyPreset(d: BusinessDocument, id: BusinessDocument["templateId"]): BusinessDocument {
  const p = businessPresets.find(p => p.id === id)!;
  const remaining = [...d.sections];
  const arranged = p.types.map(type => {
    const at = remaining.findIndex(s => s.type === type);
    const s = at >= 0 ? remaining.splice(at, 1)[0] : makeSection(type, uniqueSectionId(type, [...d.sections, ...remaining]));
    return { ...s, layout: type === "hero" ? p.hero : type === "services" ? p.services : s.layout };
  });
  if (arranged.length + remaining.length > 20) throw new Error("This preset needs additional sections. Remove unused sections first; your content has not changed.");
  return { ...d, templateId: id, accent: p.accent, font: p.font, sections: arrangeSections([...arranged, ...remaining]) };
}
export function uniqueSectionId(type: SectionType, sections: BusinessSection[]): string {
  const ids = new Set(sections.map(s => s.id)); let n = 1;
  while (ids.has(`${type}-${n}`)) n++; return `${type}-${n}`;
}
export function sampleForPreset(id: BusinessDocument["templateId"]): BusinessDocument {
 const local=id==="local-services-v1", creative=id==="creative-business-v1";
 const seeds: Partial<Record<BusinessDocument["templateId"], {name:string;headline:string;services:{title:string;description:string}[]}>> = {
  "wellness-studio-v1": {name:"Stillwater Studio",headline:"Room to pause. Space to feel renewed.",services:[{title:"Personal sessions",description:"Explain the sessions you offer and who they are suitable for."},{title:"Studio experiences",description:"Describe the experience, practical details and your actual qualifications."}]},
  "education-academy-v1": {name:"Brightpath Academy",headline:"Build understanding. Open new possibilities.",services:[{title:"Learning programmes",description:"Describe subjects, learner level and programme structure."},{title:"Personal tutoring",description:"Explain how your tutors support learners, without inventing results."}]},
  "product-launch-v1": {name:"Orbit Product",headline:"A clearer way to bring your work together.",services:[{title:"Core capability",description:"Explain a capability your product actually provides."},{title:"Team workflow",description:"Show how a real user can use your product. No integrations are assumed."}]},
 };
 const seed=seeds[id];
 const d={...newBusinessDocument(seed?.name ?? (local?"Neighbourhood Works":creative?"Forma Studio":"Northline Studio"),id),headline:seed?.headline ?? (local?"Reliable care for the place you call home.":creative?"Spaces, stories and ideas made tangible.":"Thoughtful work. Clearer business."),description:"A fictional sample showing how your services and business story can come together. Replace this with your approved information.",about:"Introduce your approach, your team and what customers can expect. This sample does not claim real credentials or results.",services:seed?.services ?? (local?[{title:"Home maintenance",description:"Explain the maintenance services you offer and the areas you cover."},{title:"Repairs",description:"Describe your repair process and how customers can request a quote."}]:[{title:"Strategy",description:"Help customers understand what this service includes."},{title:"Design",description:"Explain your process and the outcome you deliver."},{title:"Ongoing support",description:"Describe how you support customers after the project."}])};
 return {...d,sections:d.sections.map(s=>s.type==="about"?{...s,visible:true}:s.type==="faq"?{...s,items:[{title:"How do we get started?",body:"Contact the business to discuss your requirements. Replace this example with your actual process.",image:""}]}:s.type==="projects"?{...s,items:[{title:"Sample project",body:"A fictional project placeholder. Add your own approved project story and image.",image:""}]}:s)};
}
export const sampleBusiness = sampleForPreset("service-studio-v1");
export const templates = [...businessPresets.map(p => ({ ...p, category: "business", href: `/templates/${p.slug}`, status: "Modular draft editor available" })), { id: "voxfolio-existing", slug: "portfolio", category: "portfolio", name: "Voxfolio Portfolio", description: "The existing voice-directed portfolio editor and publishing workflow.", href: "/portfolio", status: "Existing portfolio editor" }] as const;

export const editingLimits = { headline: 120, description: 320, about: 1500 } as const;
export function businessEditingIssues(d: BusinessDocument): string[] {
 return [...sectionOrderIssues(d.sections), ...(d.headline.length > editingLimits.headline ? ["Shorten the headline to 120 characters before saving."] : []), ...(d.description.length > editingLimits.description ? ["Shorten the hero introduction to 320 characters before saving."] : [])];
}
export function studioSample(d: BusinessDocument): BusinessDocument {
 const sample = sampleForPreset(d.templateId);
 const sections = sample.sections.map(s => s.type === "faq" ? { ...s, items: [{ title: "What happens after an enquiry?", body: "Sample answer: we discuss the brief, agree the scope, and propose next steps. Replace this with your actual process.", image: "" }] } : s.type === "projects" ? { ...s, items: [{ title: "Illustrative project", body: "Sample project description. Replace with an approved case study before publishing.", image: "" }] } : s);
 const testimonial = { ...makeSection("testimonials", uniqueSectionId("testimonials", sections)), heading: "Sample testimonial layout", items: [{ title: "Illustrative attribution", body: "Sample quote for layout testing. Replace with a genuine, permitted customer quote before publishing.", image: "" }] };
 return { ...sample, name: d.name, logo: d.logo, email: d.email, phone: d.phone, location: d.location, hours: d.hours, sections: arrangeSections([...sections, testimonial]) };
}
