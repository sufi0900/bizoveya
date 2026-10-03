import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { publicBusinessSchema } from "@/domain/business-publication";
import { getSupabaseConfig,hasSupabaseConfig } from "@/lib/supabase/config";
export const readPublicBusiness = cache(async (siteId: string) => {
 if (!z.uuid().safeParse(siteId).success || !hasSupabaseConfig) return null;
 const {url,key}=getSupabaseConfig();
 // Anonymous client: never use member cookies or service-role credentials for visitors.
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:"no-store"})}});
 const result=await db.rpc("bz_read_public_business",{p_site_id:siteId});
 if (result.error) throw new Error("Public business storage unavailable.");
 const row=Array.isArray(result.data)?result.data[0]:null;
 return row ? publicBusinessSchema.parse(row) : null;
});
