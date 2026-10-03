import type { Metadata } from "next";
import { BusinessTemplatePage } from "@/features/business/template-page";
export const metadata: Metadata = { title: "Professional Practice — Interactive business template", description: "Try the Service Studio business template. Edit sample details and see a live preview." };
export default function TemplatePage() { return <BusinessTemplatePage id="service-studio-v1"/>; }
