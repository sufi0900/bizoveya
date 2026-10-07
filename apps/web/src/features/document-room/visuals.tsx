import Link from "next/link";
import { Activity, ArrowUpRight, BookOpen, Check, CircleDot, Clock3, FileClock, Layers3, ListChecks, Milestone, PackageCheck, Sparkles } from "lucide-react";
import { events, phases, work } from "./insights";

export function PhaseVisual({ content, compact = false }: { content: string; compact?: boolean }) {
  const items = phases(content), accepted = items.filter((p) => p.status === "accepted").length;
  return <section className={`doc-data-panel ${compact ? "doc-data-compact" : ""}`} aria-label="Implementation phase overview">
    <div className="doc-data-head"><div><span className="doc-kicker"><Layers3 size={15} /> PHASE MAP</span><h2>From groundwork to launch</h2><p>Grand phases from the living implementation ledger. An implemented substep does not mean its parent phase has been accepted.</p></div><Link href="/bizoveya/docs/10_PHASES_AND_STATUS" className="doc-text-link">Full phase ledger <ArrowUpRight size={15} /></Link></div>
    <div className="doc-phase-summary"><div className="doc-ring" style={{ "--accepted": `${items.length ? accepted / items.length * 100 : 0}%` } as React.CSSProperties}><span><strong>{accepted}</strong><small>accepted</small></span></div><div className="doc-phase-stats"><strong>{items.length} grand phases tracked</strong><p>{items.length - accepted} await acceptance. See the phase ledger for each substep’s evidence and remaining checks.</p><div className="doc-phase-track" aria-label={`${accepted} of ${items.length} grand phases accepted`}>{items.map((item) => <span key={item.id} className={item.status} title={`${item.id}: ${item.status}`} />)}</div><span className="doc-track-label">{items[0]?.id ?? "—"} <span>{items.at(-1)?.id ?? "—"}</span></span></div></div>
    <div className="doc-phase-list">{items.map((item) => <div className="doc-phase-item" key={item.id}><span className="doc-phase-id">{item.id}</span><span className="doc-phase-title">{item.title}</span><span className={`doc-status ${item.status}`}>{item.status === "accepted" ? <Check size={12} /> : item.status === "in-progress" ? <CircleDot size={12} /> : <Clock3 size={12} />}{item.status === "in-progress" ? "In progress" : item.status === "accepted" ? "Accepted" : "Planned"}</span></div>)}</div>
  </section>;
}

export function WorkVisual({ content, compact = false }: { content: string; compact?: boolean }) {
  const items = work(content);
  return <section className={`doc-data-panel ${compact ? "doc-data-compact" : ""}`} aria-label="Completed work records"><div className="doc-data-head"><div><span className="doc-kicker"><ListChecks size={15} /> VERIFIED RECORD</span><h2>What has been delivered</h2><p>Completed records from the current work snapshot, including documentation and archive milestones. Acceptance limits remain in the source.</p></div><Link href="/bizoveya/docs/COMPLETED_WORK" className="doc-text-link">Full evidence <ArrowUpRight size={15} /></Link></div><div className="doc-work-grid">{items.slice(-4).reverse().map((item, index) => <article key={item.id} className="doc-work-card"><div><span className="doc-work-icon">{index === 0 ? <Sparkles size={18} /> : <Check size={18} />}</span><span className="doc-work-id">{item.id}</span></div><h3>{item.result}</h3><span className="doc-work-evidence">{item.evidence.slice(0, 130)}{item.evidence.length > 130 ? "…" : ""}</span></article>)}</div></section>;
}

export function ActivityVisual({ content, compact = false }: { content: string; compact?: boolean }) {
  const items = events(content).slice(-5).reverse();
  return <section className={`doc-data-panel ${compact ? "doc-data-compact" : ""}`} aria-label="Recent activity"><div className="doc-data-head"><div><span className="doc-kicker"><Activity size={15} /> ACTIVITY STREAM</span><h2>How the project evolved</h2><p>Decisions and reversals stay visible alongside deliveries.</p></div><Link href="/bizoveya/docs/ACTIVITY_LOG" className="doc-text-link">Complete history <ArrowUpRight size={15} /></Link></div><ol className="doc-activity-list">{items.map((item, index) => <li key={item.id}><span className={`doc-activity-marker ${index === 0 ? "latest" : ""}`}><Milestone size={17} /></span><div><span className="doc-activity-date"><FileClock size={13} /> {item.when}</span><strong>{item.title}</strong><small>{item.id}</small></div></li>)}</ol></section>;
}

export function DocumentSpotlight({ slug, content }: { slug: string; content: string }) {
  if (slug === "40_CAMPAIGN_DRAFTS_AND_TESTING") return <section className="doc-data-panel"><span className="doc-kicker"><Layers3 size={15}/> CAMPAIGN CHECKPOINT</span><h2>A shared brief, three private drafts</h2><div className="doc-work-grid">{["Blog draft","Pinterest copy","LinkedIn post"].map(label=><article className="doc-work-card" key={label}><h3>{label}</h3><p>Editable text · durable versions · human review</p></article>)}</div><p>Private text storage, bounded execution, review and JSON export are implemented. The visual composer adds two Pinterest layouts and a six-slide carousel after storage setup. Remaining acceptance checks are tracked separately; publishing is deferred.</p><Link href="/bizoveya/docs/49_PRIVATE_VISUAL_COMPOSITION_AND_TESTING" className="doc-text-link">Visual drafts and four testing steps <ArrowUpRight size={15} /></Link></section>;
  if (slug === "10_PHASES_AND_STATUS") return <PhaseVisual content={content} />;
  if (slug === "COMPLETED_WORK") return <WorkVisual content={content} />;
  if (slug === "ACTIVITY_LOG") return <ActivityVisual content={content} />;
  if (slug === "PACKAGE_VERSIONS") {
    const versions = [...content.matchAll(/^\| (\d+\.\d+) \/ (P\d\d\.\d+) \|/gm)];
    return <section className="doc-data-panel doc-version-panel" aria-label="Package lineage"><span className="doc-kicker"><PackageCheck size={15} /> RELEASE LINEAGE</span><h2>One ZIP for every delivery</h2><p>Historical versions remain identifiable. The current package is tracked in the Markdown source below.</p><div>{versions.map((match) => <span key={match[1]}><strong>{match[1]}</strong><small>{match[2]}</small></span>)}</div></section>;
  }
  return null;
}

export function DocumentIcon({ category }: { category: string }) {
  if (category === "Progress & records") return <Activity size={20} aria-hidden="true" />;
  if (category === "Delivery & guidance") return <ListChecks size={20} aria-hidden="true" />;
  if (category === "System & design") return <Layers3 size={20} aria-hidden="true" />;
  return <BookOpen size={20} aria-hidden="true" />;
}
