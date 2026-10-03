import type { Metadata } from "next";
import "./globals.css";
import "@/features/portfolio/collection-templates.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: "Bizoveya",
  title: { default: "Bizoveya — Your digital business workspace", template: "%s · Bizoveya" },
  description: "Create business website drafts and organize your websites in a shared digital workspace.",
  openGraph: { type: "website", siteName: "Bizoveya", title: "Bizoveya", description: "Create business website drafts and organize your websites in a shared digital workspace." },
  twitter: { card: "summary_large_image", title: "Bizoveya", description: "Business website drafts and your digital workspace." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
