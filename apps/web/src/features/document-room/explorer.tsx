"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DocumentEntry } from "./documents";
import { DocumentIcon } from "./visuals";
import { ArrowUpRight, Search } from "lucide-react";

type Props = { documents: DocumentEntry[]; active?: string; compact?: boolean };
export function Explorer({ documents, active, compact = false }: Props) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(documents.map((doc) => doc.category))];
  const shown = useMemo(() => documents.filter((doc) => (category === "All" || doc.category === category) && (!query.trim() || doc.searchText.includes(query.trim().toLowerCase()))), [documents, category, query]);
  return <section className={`doc-explorer ${compact ? "doc-explorer-compact" : ""}`} aria-label="Browse platform documents">
    <div className="doc-search"><label htmlFor={`docs-query-${compact ? "side" : "main"}`}>Find a document or topic</label><input id={`docs-query-${compact ? "side" : "main"}`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all current documents" /><Search size={18} aria-hidden="true" /></div>
    {!compact && <div className="doc-filters" aria-label="Document category filters">{categories.map((name) => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>}
    <p className="doc-result-count">{shown.length} of {documents.length} documents</p>
    <div className="doc-grid">{shown.map((doc) => <Link className={`doc-card ${active === doc.slug ? "doc-card-active" : ""}`} href={`/bizoveya/docs/${encodeURIComponent(doc.slug)}`} key={doc.slug} aria-current={active === doc.slug ? "page" : undefined}>
      <span className="doc-card-icon"><DocumentIcon category={doc.category} /></span><span className="doc-card-category">{doc.category}</span><strong>{doc.title}</strong>{!compact && <span className="doc-card-description">{doc.excerpt}</span>}<span className="doc-card-file">{doc.filename} <ArrowUpRight size={15} aria-hidden="true" /></span>
    </Link>)}</div>
    {shown.length === 0 && <p className="doc-empty">No documents match this search. Try a broader term.</p>}
  </section>;
}
