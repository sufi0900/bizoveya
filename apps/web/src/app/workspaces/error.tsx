"use client";
import Link from "next/link";
export default function WorkspaceErrorPage({ reset }: { reset: () => void }) { return <main className="bz-loading"><span className="bz-kicker">BIZOVEYA</span><h1>We could not open this view</h1><p>Retry, or return to your workspace list.</p><div className="bz-actions"><button className="bz-button" onClick={reset}>Try again</button><Link className="bz-button secondary" href="/workspaces">Workspace list</Link></div></main>; }
