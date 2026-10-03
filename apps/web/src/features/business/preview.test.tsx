import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { sampleBusiness } from "@/domain/business";
import { BusinessPreview } from "./preview";
describe("business preview", () => {
  it("labels demo content and does not invent an email or customer evidence", () => { const html = renderToStaticMarkup(<BusinessPreview document={sampleBusiness} demo />); expect(html).toContain("Fictional sample"); expect(html).not.toContain("mailto:"); expect(html).not.toContain("testimonial"); });
  it("escapes user content rather than executing markup", () => { const html = renderToStaticMarkup(<BusinessPreview document={{ ...sampleBusiness, headline: '<script>alert("x")</script>', about: '<img src=x onerror=alert(1)>' }} />); expect(html).toContain("&lt;script&gt;"); expect(html).not.toContain("<script>"); expect(html).not.toContain("<img"); });
  it("renders approved contact details and a constrained accent", () => { const html = renderToStaticMarkup(<BusinessPreview document={{ ...sampleBusiness, email: "contact@acme.com", accent: "blue" }} />); expect(html).toContain('href="mailto:contact@acme.com"'); expect(html).toContain('data-accent="blue"'); });
});

describe("modular rendering", () => {
  it("respects section order and hides disabled sections", () => { const sections = [...sampleBusiness.sections].reverse().map(s => s.type === "services" ? {...s,visible:false} : s); const html = renderToStaticMarkup(<BusinessPreview document={{...sampleBusiness,sections}}/>); expect(html.indexOf('data-section-type="contact"')).toBeLessThan(html.indexOf('data-section-type="hero"')); expect(html).not.toContain('data-section-type="services"'); });
  it("uses one shared contact value and never links to a removed section", () => { const d = {...sampleBusiness,email:"approved@example.com",sections:sampleBusiness.sections.filter(s => s.type !== "contact")}; const html = renderToStaticMarkup(<BusinessPreview document={d}/>); expect(html).toContain('mailto:approved@example.com'); expect(html).not.toContain('href="#section-contact"'); });
  it("labels a services fallback honestly when contact is removed", () => { const d = {...sampleBusiness,email:"",sections:sampleBusiness.sections.filter(s => s.type !== "contact")}; const html = renderToStaticMarkup(<BusinessPreview document={d}/>); expect(html).toContain("Explore services"); expect(html).not.toContain("Get in touch"); });
  it("keeps FAQ semantic and quotes escaped", () => { const html = renderToStaticMarkup(<BusinessPreview document={{...sampleBusiness,sections:[{id:"faq",type:"faq",layout:"accordion",visible:true,tone:"base",heading:"",body:"",image:"",items:[{title:"Question?",body:"Answer",image:""}]},{id:"reviews",type:"testimonials",layout:"slider",visible:true,tone:"base",heading:"",body:"",image:"",items:[{title:"Person",body:"<script>bad()</script>",image:""},{title:"Other",body:"Quote",image:""}]}]}}/>); expect(html).toContain("<details>"); expect(html).toContain("<summary>Question?</summary>"); expect(html).toContain("&lt;script&gt;"); expect(html).toContain("Next testimonial"); expect(html).not.toContain("<script>"); });
});

describe("published business rendering", () => {
  it("offers phone-only contact in both Studio preview and visitor page", () => {
    const d = { ...sampleBusiness, email: "", phone: "+92 300 1234567" };
    for (const published of [false, true]) {
      const html = renderToStaticMarkup(<BusinessPreview document={d} published={published} />);
      expect(html).toContain('href="tel:+923001234567"');
      expect(html).not.toContain("Add your contact email in the editor");
    }
  });
  it("omits empty author sections and draft labels from visitor rendering", () => {
    const d = { ...sampleBusiness, about: "", sections: sampleBusiness.sections.map(s => ["about", "faq"].includes(s.type) ? { ...s, visible: true, items: [] } : s) };
    const html = renderToStaticMarkup(<BusinessPreview document={d} published />);
    expect(html).not.toContain('data-section-type="about"');
    expect(html).not.toContain('data-section-type="faq"');
    expect(html).not.toContain("Business website draft");
    expect(html).not.toContain("Edit section");
  });
  it("uses exactly one H1 even with multiple visible hero sections", () => {
    const hero = sampleBusiness.sections.find(s => s.type === "hero")!;
    const html = renderToStaticMarkup(<BusinessPreview document={{ ...sampleBusiness, sections: [...sampleBusiness.sections, { ...hero, id: "second-hero" }] }} published />);
    expect(html.match(/<h1>/g)).toHaveLength(1);
  });
});
