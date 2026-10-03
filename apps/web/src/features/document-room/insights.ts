/** Lightweight projections of the living Markdown records. The .md files stay canonical. */
export type Phase = { id: string; title: string; status: "accepted" | "in-progress" | "planned"; scope: string };
export type Work = { id: string; result: string; evidence: string };
export type Event = { id: string; when: string; title: string };

const cells = (line: string) => line.split("|").slice(1, -1).map((cell) => cell.trim());
const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");

export function phases(markdown: string): Phase[] {
  return markdown.split("\n").filter((line) => /^\| \[[ x~]\] P\d\d (?!\.)/.test(line)).map((line) => {
    const [label, scope] = cells(line);
    const match = label.match(/^\[([ x~])\] (P\d\d) (.+)$/);
    return { id: match?.[2] ?? "", title: match?.[3] ?? "", status: match?.[1] === "x" ? "accepted" : match?.[1] === "~" ? "in-progress" : "planned", scope: plain(scope ?? "") };
  });
}
export function work(markdown: string): Work[] {
  return markdown.split("\n").filter((line) => /^\| CW-\d+ \|/.test(line)).map((line) => {
    const [id, result, evidence] = cells(line);
    return { id, result: plain(result), evidence: plain(evidence) };
  });
}
export function events(markdown: string): Event[] {
  return [...markdown.matchAll(/^### (BZ-\d+) — ([^—\n]+) — ([^\n]+)/gm)].map((match) => ({ id: match[1], when: match[2].trim(), title: match[3].trim() }));
}

/** Only recorded table rows count as deliveries; prose about a future ZIP does not. */
export function latestPackage(markdown: string): { version: string; filename: string; title: string } | null {
  const releases = markdown.split("\n").flatMap(line => {
    if (!/^\| \d+\.\d+ \/ P\d\d(?:\.\d+)+ \|/.test(line)) return [];
    const [label, evidence] = cells(line);
    const version = label.split(" / ")[0];
    const filename = evidence?.match(/`([^`]+\.zip)`/)?.[1] ?? evidence?.match(/`(GitHub:[^`]+)`/)?.[1];
    if (!filename) return [];
    const title = filename.startsWith("GitHub:") ? "GitHub phase checkpoint" : filename.replace(/^Bizoveya_\d+\.\d+_/, "").replace(/\.zip$/, "").replace(/[-_]/g, " ");
    return [{ version, filename, title }];
  });
  releases.sort((a, b) => { const [am, an] = a.version.split(".").map(Number), [bm, bn] = b.version.split(".").map(Number); return bm - am || bn - an; });
  return releases[0] ?? null;
}
