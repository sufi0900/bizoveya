import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { businessPresets } from "@/domain/business";
import { BusinessTemplatePage } from "@/features/business/template-page";
const added=businessPresets.slice(3);
export const dynamicParams=false;
export function generateStaticParams(){return added.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=added.find(p=>p.slug===slug);return {title:p?`${p.name} — Interactive business template`:"Template unavailable",description:p?.description};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=added.find(p=>p.slug===slug);if(!p)notFound();return <BusinessTemplatePage id={p.id}/>;}
