import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readPublicBusiness } from "@/features/business/public-reader";
import { BusinessPreview } from "@/features/business/preview";
import "@/features/business/business.css";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{siteId:string}>}):Promise<Metadata> {
 const {siteId}=await params;const p=await readPublicBusiness(siteId);
 if(!p) return {title:"Website unavailable",robots:{index:false,follow:false}};
 const d=p.document;return {title:{absolute:`${d.name} | ${d.headline}`},description:d.description || d.headline,openGraph:{title:d.name,description:d.description || d.headline,type:"website"},twitter:{card:"summary",title:d.name,description:d.description || d.headline},alternates:process.env.NEXT_PUBLIC_SITE_URL ? {canonical:new URL(`/sites/${siteId}`,process.env.NEXT_PUBLIC_SITE_URL).href} : undefined,robots:{index:true,follow:true}};
}
export default async function PublicBusiness({params}:{params:Promise<{siteId:string}>}) {
 const {siteId}=await params;const p=await readPublicBusiness(siteId);if(!p) notFound();
 return <main className="business-public-site"><BusinessPreview document={p.document} published /></main>;
}
