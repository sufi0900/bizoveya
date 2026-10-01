import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "../../docs/platform");

export type DocumentEntry = {
  slug: string;
  filename: string;
  title: string;
  category: string;
  excerpt: string;
  searchText: string;
};

const group = (name: string) => {
  if (/^\d\d_/.test(name)) return Number(name.slice(0, 2)) <= 3 ? "Product & experience" : Number(name.slice(0, 2)) <= 9 ? "System & design" : "Delivery & guidance";
  if (name.startsWith("ADR-")) return "Decisions";
  return "Progress & records";
};

export async function getDocuments(): Promise<DocumentEntry[]> {
  const top = (await readdir(root)).filter((name) => name.endsWith(".md"));
  const decisions = (await readdir(path.join(root, "decisions"))).filter((name) => name.endsWith(".md")).map((name) => `decisions/${name}`);
  const files = [...top, ...decisions];
  const entries = await Promise.all(files.map(async (filename) => {
    const content = await readFile(path.join(root, filename), "utf8");
    const title = content.match(/^#\s+(.+)$/m)?.[1]?.replace(/[`*]/g, "") ?? filename;
    const excerpt = content.split("\n").find((line) => line.trim() && !line.startsWith("#") && !line.startsWith("|") && !line.startsWith("-"))?.replace(/[*`]/g, "").slice(0, 170) ?? "Living platform document";
    return { slug: filename.replace("decisions/", "decisions--").replace(/\.md$/, ""), filename, title, category: group(path.basename(filename)), excerpt, searchText: `${title} ${filename} ${content}`.toLowerCase() };
  }));
  return entries.sort((a, b) => a.filename.localeCompare(b.filename, "en", { numeric: true }));
}

export async function getDocument(slug: string) {
  const entries = await getDocuments();
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) return null;
  return { ...entry, content: await readFile(path.join(root, entry.filename), "utf8") };
}
