import Link from "next/link";
export default function WorkspaceNotFound() { return <main className="bz-loading"><span className="bz-kicker">BIZOVEYA</span><h1>This workspace or site is unavailable</h1><p>It may have been removed, or your account may not have access.</p><Link className="bz-button" href="/workspaces">Back to your workspaces</Link></main>; }
