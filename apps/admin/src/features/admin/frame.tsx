"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ShieldCheck, LayoutDashboard, History, KeyRound, Moon, Sun, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
export function AdminFrame({ children, email, loginOnly = false }: { children: ReactNode; email?: string; loginOnly?: boolean }) {
  const pathname = usePathname(); const router = useRouter();
  const [theme, setTheme] = useState("dark"); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useEffect(() => { try { if (localStorage.getItem("bizoveya-admin-theme") === "light") setTheme("light"); } catch {} }, []);
  async function signOut() {
    if(!window.dispatchEvent(new Event("bizoveya:before-admin-signout",{cancelable:true})))return;
    setBusy(true); setError("");
    try { const { error } = await createSupabaseBrowserClient().auth.signOut({ scope: "local" }); if (error) throw error; router.replace("/login?next=/admin"); router.refresh(); }
    catch { setError("Sign out failed. Please retry."); } finally { setBusy(false); }
  }
  return <div className="bz-admin" data-theme={theme}><a className="ba-skip" href="#admin-main">Skip to content</a>
    <aside className="ba-sidebar"><Link className="ba-brand" href="/admin"><span>B</span><div>Bizoveya<small>PLATFORM CONTROL</small></div></Link><div className="ba-zone"><ShieldCheck size={20} /><div>Operator workspace<small>Restricted administration</small></div></div>
      {!loginOnly && <nav aria-label="Administration">{[{ href: "/admin", label: "Overview", icon: LayoutDashboard }, { href: "/admin/agents", label: "Agent configuration", icon: ShieldCheck }, { href: "/admin/bindings", label: "Model assignments", icon: ShieldCheck }, { href: "/admin/model-tests", label: "Model tests", icon: KeyRound }, { href: "/admin/generations", label: "Draft runs", icon: ShieldCheck }, { href: "/admin/spending", label: "Spending controls", icon: KeyRound }, { href: "/admin/models", label: "Model profiles", icon: ShieldCheck }, { href: "/admin/credentials", label: "Credential references", icon: KeyRound }, { href: "/admin/audit", label: "Access history", icon: History }, { href: "/admin/security", label: "Authenticator", icon: KeyRound }].map(({ href, label, icon: Icon }) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}><Icon size={18} />{label}</Link>)}</nav>}
      {!loginOnly && <div className="ba-sidebar-note"><strong>Foundation release</strong><p>Agent and model defaults are configurable. Optional model connectivity tests are available. Customer agent execution and key entry remain planned.</p></div>}
    </aside><div className="ba-body"><header className="ba-topbar"><span>ADMINISTRATION <b>EARLY ACCESS</b></span><div><button type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={() => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); try { localStorage.setItem("bizoveya-admin-theme", next); } catch {} }}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>{email && <><span className="ba-email">{email}</span><button type="button" aria-label="Sign out" disabled={busy} onClick={() => void signOut()}><LogOut size={18} /></button></>}</div></header><main id="admin-main" tabIndex={-1}>{error && <p role="alert" className="ba-notice">{error}</p>}{children}</main><footer>Bizoveya · Platform access is separate from workspace membership.</footer></div>
  </div>;
}
