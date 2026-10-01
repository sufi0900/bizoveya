import Link from "next/link";
import { AdminFrame } from "@/features/admin/frame";
export default function NotFound() { return <AdminFrame><section className="ba-panel"><h1>Administration unavailable</h1><p>This page is unavailable to your current account. Workspace ownership does not grant platform access.</p><Link href="/login">Return to admin login</Link></section></AdminFrame>; }
