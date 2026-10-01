"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { adminReturnPath } from "@/features/admin/login-policy";
export function AdminLoginForm({nextPath}: {nextPath: string}) {
 const router=useRouter(); const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 async function submit(event: FormEvent){event.preventDefault();setBusy(true);setError("");try{const db=createSupabaseBrowserClient();const result=await db.auth.signInWithPassword({email,password});if(result.error)throw result.error;router.replace(adminReturnPath(nextPath));router.refresh();}catch{setError("Sign-in failed. Check your credentials or contact the operator.");}finally{setBusy(false);}}
 return <form onSubmit={submit}><label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label>{error&&<p role="alert" className="ba-notice">{error}</p>}<button className="ba-button" disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form>;
}
