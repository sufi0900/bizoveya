"use client";
import { AdminFrame } from "@/features/admin/frame";
export default function AdminError({ reset }: { reset: () => void }) { return <AdminFrame><section className="ba-panel"><h1>Administration could not load</h1><p>Please retry. No private error details are displayed.</p><button className="ba-button" onClick={reset}>Retry</button></section></AdminFrame>; }
