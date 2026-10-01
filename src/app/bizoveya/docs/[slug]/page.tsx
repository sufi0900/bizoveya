import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Boxes, FileText, Layers3 } from "lucide-react";
import { getDocument, getDocuments } from "@/features/document-room/documents";
import { Explorer } from "@/features/document-room/explorer";
import { Markdown, headings } from "@/features/document-room/markdown";
import { DocumentSpotlight } from "@/features/document-room/visuals";
import { latestPackage } from "@/features/document-room/insights";
import { ThemeSwitch } from "@/features/document-room/theme-switch";
import "../document-room.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await getDocuments()).map((item) => ({ slug: item.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const doc = await getDocument(slug); return { title: { absolute: doc ? `${doc.title} | Bizoveya documents` : "Document not found" }, robots: { index: false, follow: false } }; }
export default async function DocumentPage({ params }: Props) {
  const { slug } = await params; const [doc, documents, registry] = await Promise.all([getDocument(slug), getDocuments(), getDocument("PACKAGE_VERSIONS")]);
  if (!doc) notFound();
  const release = latestPackage(registry?.content ?? "");
  const outline = headings(doc.content), sectionCount = outline.filter((entry) => entry.level === 2).length;
  return <main className="document-room"><div className="document-room-shell">
    <header className="doc-topbar"><Link href="/bizoveya/docs" className="doc-brand"><span className="doc-brand-symbol"><Boxes size={20} /></span><span><b>BIZOVEYA</b><small>PROJECT INTELLIGENCE</small></span></Link><div className="doc-top-actions"><Link href="/bizoveya/docs" className="doc-back"><ArrowLeft size={16} /> Overview</Link><ThemeSwitch /></div></header>
    <div className="doc-detail-layout"><aside className="doc-sidebar"><div className="doc-sidebar-sticky"><span className="doc-side-title"><BookOpen size={15} /> DOCUMENT LIBRARY</span><Link className="doc-sidebar-home" href="/bizoveya/docs">Dashboard <ArrowUpRight size={14} /></Link><Explorer documents={documents} active={slug} compact /></div></aside>
      <div className="doc-detail-main"><div className="doc-detail-banner"><span><FileText size={16} /> LIVING DOCUMENT</span><h1>{doc.title}</h1><p>{doc.excerpt}</p><div><span>{doc.category}</span><span>{sectionCount} sections</span><span>Source: {doc.filename}</span></div></div>
        <DocumentSpotlight slug={slug} content={doc.content} />
        {outline.length > 2 && <nav className="doc-reading-map" aria-label="Jump to a section"><div><span className="doc-kicker"><Layers3 size={15} /> READING MAP</span><strong>Explore this document</strong></div><div>{outline.filter((entry) => entry.level === 2).slice(0, 8).map((entry) => <a key={entry.id} href={`#${entry.id}`}>{entry.text}<ArrowUpRight size={13} /></a>)}</div></nav>}
        <article className="doc-detail"><div className="doc-detail-meta"><span>COMPLETE SOURCE</span><span>Package {release?.version ?? "—"} · Living document</span></div><Markdown content={doc.content} /><div className="doc-detail-bottom"><p>Source file: <code>docs/platform/{doc.filename}</code></p><p>Check the evidence labels before treating a planned feature as live behavior.</p><Link href="/bizoveya/docs">← Browse all documents</Link></div></article>
      </div><aside className="doc-on-this-page"><div className="doc-sidebar-sticky"><p>ON THIS PAGE</p>{outline.slice(0, 24).map((h, i) => <a key={`${h.id}-${i}`} href={`#${h.id}`} className={h.level === 3 ? "doc-toc-indent" : ""}>{h.text}</a>)}</div></aside>
    </div><footer className="doc-footer">Bizoveya · Living documentation · Public prelaunch view.</footer>
  </div></main>;
}
