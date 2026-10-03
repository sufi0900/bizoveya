import type { Metadata } from "next";
import { BusinessTemplatePage } from "@/features/business/template-page";
export const metadata: Metadata = { title: "Creative Business — Interactive business template", description: "Explore a modular Bizoveya business template with reusable sections." };
export default function TemplatePage() { return <BusinessTemplatePage id="creative-business-v1"/>; }
