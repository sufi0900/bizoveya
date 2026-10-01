import type { Metadata } from "next";
import "@/features/admin/admin.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Bizoveya — Platform administration" }, robots: { index: false, follow: false } };
// Guards belong in every data loader and API, not only a persistent layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children; }
