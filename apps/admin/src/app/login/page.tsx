import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminFrame } from "@/features/admin/frame";
import { AdminLoginForm } from "./login-form";
import { adminReturnPath } from "@/features/admin/login-policy";
export const dynamic = "force-dynamic";
export default async function Login({searchParams}: {searchParams: Promise<{next?:string}>}) {
 const next=adminReturnPath((await searchParams).next);
 if(hasSupabaseConfig){ const db=await createSupabaseServerClient(); const {data:{user}}=await db.auth.getUser(); if(user)redirect(next); }
 return <AdminFrame loginOnly><section className="ba-panel ba-login"><p className="ba-kicker">OPERATOR ACCESS</p><h1>Sign in to administration</h1><p>Use an operator-approved account. Authenticator verification is required before viewing platform data.</p>{hasSupabaseConfig?<AdminLoginForm nextPath={next}/>:<p role="status">Admin sign-in is unavailable until Supabase is configured for this application.</p>}</section></AdminFrame>;
}
