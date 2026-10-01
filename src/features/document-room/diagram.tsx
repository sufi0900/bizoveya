"use client";

import { useEffect, useId, useState } from "react";

export function Diagram({ source }: { source: string }) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const render = async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: document.documentElement.dataset.bizoveyaDocsTheme === "dark" ? "dark" : "neutral" });
        const result = await mermaid.render(`bizoveya-${reactId}-${Date.now()}`, source.trim());
        if (active) { setSvg(result.svg); setError(false); }
      } catch { if (active) setError(true); }
    };
    void render();
    window.addEventListener("bizoveya-doc-theme-change", render);
    return () => { active = false; window.removeEventListener("bizoveya-doc-theme-change", render); };
  }, [reactId, source]);
  if (error) return <div className="doc-code"><span>Diagram source</span><pre><code>{source}</code></pre></div>;
  return <figure className="doc-diagram" aria-label="Diagram from this document">{svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <p>Rendering diagram…</p>}</figure>;
}
