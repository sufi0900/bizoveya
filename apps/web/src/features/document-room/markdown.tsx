import type { ReactNode } from "react";
import Link from "next/link";
import { Diagram } from "./diagram";

const inline = (value: string, keyBase = "t"): ReactNode[] => {
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
  const parts: ReactNode[] = []; let pos = 0; let match: RegExpExecArray | null; let i = 0;
  while ((match = pattern.exec(value))) {
    if (match.index > pos) parts.push(value.slice(pos, match.index));
    const key = `${keyBase}-${i++}`;
    if (match[2] && match[3]) {
      const target = match[3];
      if (/^https?:\/\//.test(target)) parts.push(<a key={key} href={target} target="_blank" rel="noopener noreferrer">{match[2]}</a>);
      else if (/^(?!\/|#)[\w./-]+\.md$/.test(target)) {
        const file = target.replace(/^\.\//, "").replace(/^decisions\//, "decisions--").replace(/\.md$/, "");
        if (!file.startsWith("..")) parts.push(<Link key={key} href={`/bizoveya/docs/${encodeURIComponent(file)}`}>{match[2]}</Link>);
        else parts.push(<span key={key}>{match[2]}</span>);
      } else if (target.startsWith("#")) parts.push(<a key={key} href={target}>{match[2]}</a>);
      else parts.push(<span key={key}>{match[2]}</span>);
    } else if (match[4]) parts.push(<strong key={key}>{match[4]}</strong>);
    else if (match[5]) parts.push(<code key={key}>{match[5]}</code>);
    pos = pattern.lastIndex;
  }
  if (pos < value.length) parts.push(value.slice(pos));
  return parts;
};

const idFor = (value: string) => value.toLowerCase().replace(/[`*]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

export function headings(content: string) {
  return content.split("\n").filter((line) => /^#{2,3} /.test(line)).map((line) => ({ level: line.match(/^#+/)![0].length, text: line.replace(/^#+\s+/, ""), id: idFor(line.replace(/^#+\s+/, "")) }));
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n"); const nodes: ReactNode[] = []; let index = 0;
  while (index < lines.length) {
    const line = lines[index]; if (!line.trim()) { index++; continue; }
    const key = `block-${index}`;
    if (line.startsWith("```")) {
      const language = line.slice(3).trim(); const code: string[] = []; index++;
      while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
      index++;
      nodes.push(language === "mermaid" ? <Diagram key={key} source={code.join("\n")} /> : <div className="doc-code" key={key}><span>{language || "Code"}</span><pre><code>{code.join("\n")}</code></pre></div>); continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length; const id = idFor(heading[2]);
      const Tag = `h${Math.min(level, 4)}` as "h1" | "h2" | "h3" | "h4";
      nodes.push(<Tag id={id} key={key}>{inline(heading[2], key)}</Tag>); index++; continue;
    }
    if (line.startsWith("| ") && lines[index + 1]?.match(/^\|\s*:?-{2,}/)) {
      const rows: string[][] = []; while (index < lines.length && lines[index].startsWith("|")) { rows.push(lines[index].split("|").slice(1, -1).map((cell) => cell.trim())); index++; }
      const [header, , ...body] = rows;
      nodes.push(<div className="doc-table-wrap" key={key}><table><thead><tr>{header.map((cell, i) => <th key={i}>{inline(cell, `${key}-h${i}`)}</th>)}</tr></thead><tbody>{body.map((cells, row) => <tr key={row}>{cells.map((cell, col) => <td key={col}>{inline(cell, `${key}-${row}-${col}`)}</td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (/^\s*[-*] /.test(line) || /^\s*\d+\. /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line); const items: string[] = [];
      while (index < lines.length && (ordered ? /^\s*\d+\. /.test(lines[index]) : /^\s*[-*] /.test(lines[index]))) items.push(lines[index++].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      const children = items.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>);
      nodes.push(ordered ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>); continue;
    }
    if (line.startsWith(">")) { const items: string[] = []; while (index < lines.length && lines[index].startsWith(">")) items.push(lines[index++].replace(/^>\s?/, "")); nodes.push(<blockquote key={key}>{inline(items.join(" "), key)}</blockquote>); continue; }
    if (/^---+$/.test(line)) { nodes.push(<hr key={key} />); index++; continue; }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(#{1,6} |```|\| |[-*] |\d+\. |>)/.test(lines[index])) paragraph.push(lines[index++]);
    if (paragraph.length) nodes.push(<p key={key}>{inline(paragraph.join(" ").replace(/\s{2,}/g, " "), key)}</p>);
    else index++;
  }
  return <div className="doc-markdown">{nodes}</div>;
}
