import { describe,it,expect } from "vitest";
import { newBusinessDocument } from "./business";
import { telephoneHref,publicationIssues,publicationInput } from "./business-publication";
describe("publication readiness",()=>{
 it("requires contact details and visible contact/hero sections",()=>{const d=newBusinessDocument("Acme");expect(publicationIssues(d)).toHaveLength(1);expect(publicationIssues({...d,email:"hello@example.com"})).toEqual([]);expect(publicationIssues({...d,email:"hello@example.com",sections:d.sections.map(s=>({...s,visible:false}))})).toHaveLength(2);});
 it("makes safe telephone links without URL scheme injection",()=>{expect(telephoneHref("+92 (300) 123-4567")).toBe("tel:+923001234567");expect(telephoneHref("javascript:alert()" )).toBeNull();});
 it("requires explicit action and both nonnegative concurrency versions",()=>{expect(publicationInput.safeParse({publish:true,expectedDraftVersion:2,expectedPublicationVersion:0}).success).toBe(true);expect(publicationInput.safeParse({publish:true,expectedDraftVersion:-1,expectedPublicationVersion:0}).success).toBe(false);expect(publicationInput.safeParse({publish:true,document:{}}).success).toBe(false);});
});
