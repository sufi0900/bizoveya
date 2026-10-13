import type { ApprovedKnowledge } from '@/domain/knowledge';

/** Only approved fact text, with a bounded budget; source bodies and filenames never leave. */
export function liveSiteContext(sources: ApprovedKnowledge[], characterLimit = 3000) {
  const facts: { sourceId: string; version: number; factId: string; text: string }[] = [];
  let used = 0;
  for (const source of sources) for (const fact of source.facts) {
    const item = { sourceId: source.id, version: source.version, factId: fact.id, text: fact.text };
    const size = JSON.stringify(item).length;
    if (used + size > characterLimit) return JSON.stringify(facts);
    facts.push(item); used += size;
  }
  return JSON.stringify(facts);
}
