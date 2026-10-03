import { z } from "zod";
import { businessEditingIssues, businessDocumentSchema, type BusinessDocument } from "./business";
export const publicationInput = z.object({ publish: z.boolean(), expectedDraftVersion: z.number().int().min(0), expectedPublicationVersion: z.number().int().min(0) }).strict();
export const publicationSchema = z.object({ site_id: z.uuid(), document: businessDocumentSchema, source_version: z.number().int().positive(), version: z.number().int().positive(), active: z.boolean(), published_at: z.string(), updated_at: z.string() });
export type Publication = z.infer<typeof publicationSchema>;
export const publicBusinessSchema = publicationSchema.pick({ site_id: true, document: true, version: true, published_at: true });
export function telephoneHref(phone: string) { const digits = phone.replace(/[^0-9]/g, ""); return digits ? `tel:${phone.trim().startsWith("+") ? "+" : ""}${digits}` : null; }
export function publicationIssues(d: BusinessDocument): string[] {
 const issues: string[] = businessEditingIssues(d);
 if (!d.sections.some(s => s.visible && s.type === "hero")) issues.push("Show a Hero section.");
 if (!d.sections.some(s => s.visible && s.type === "contact")) issues.push("Show a Contact section.");
 if (!d.email && !telephoneHref(d.phone)) issues.push("Add a contact email or callable phone number.");
 return issues;
}
export function publicSitePath(siteId: string) { return `/sites/${siteId}`; }
