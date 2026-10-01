import type { Metadata } from "next";
import "@/features/admin/admin.css";
import "./globals.css";
export const metadata: Metadata = { title: "Bizoveya administration", robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
