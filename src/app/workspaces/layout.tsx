import type { Metadata } from "next";
import "@/features/workspaces/workspaces.css";
export const metadata: Metadata = { applicationName: "Bizoveya", title: { absolute: "Bizoveya — Your digital workspace" }, description: "A workspace for your existing websites and future business tools.", robots: { index: false, follow: false } };
export default function WorkspacesLayout({ children }: { children: React.ReactNode }) { return children; }
