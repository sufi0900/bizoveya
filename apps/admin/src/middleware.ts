import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseConfig, getSupabaseConfig } from "@/lib/supabase/config";
import { adminCookieOptions, adminCookieSettings } from "@/lib/supabase/cookie-options";
export async function middleware(request: NextRequest) {
 let response=NextResponse.next({request});
 if(!hasSupabaseConfig)return response;
 const {url,key}=getSupabaseConfig();
 const db=createServerClient(url,key,{cookieOptions:adminCookieOptions,cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,{...options,...adminCookieSettings}));}}});
 await db.auth.getUser();
 return response;
}
export const config={matcher:["/login","/admin/:path*","/api/admin/:path*"]};
