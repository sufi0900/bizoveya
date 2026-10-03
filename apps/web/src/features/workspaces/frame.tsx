"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, BookOpen, Building2, Globe2, LayoutDashboard, LogOut, Moon, Plus, Settings2, Sparkles, Sun, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
export function WorkspaceFrame({ children, email, workspace }: { children: ReactNode; email?: string; workspace?: { id: string; name: string; role: string } }) {
  const pathname = usePathname(); const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark"); const [message, setMessage] = useState(""); const [signingOut, setSigningOut] = useState(false);
  useEffect(() => { try { if (localStorage.getItem("bizoveya-workspace-theme") === "light") setTheme("light"); } catch { /* Theme still works for the visit. */ } }, []);
  const isStudio = pathname.endsWith("/editor"); const [navigationOverride, setNavigationOverride] = useState<boolean | null>(null); const navigationHidden = isStudio && (navigationOverride ?? true);
  const base = workspace ? `/workspaces/${workspace.id}` : "/workspaces";
  const nav = workspace ? [{ href: base, label: "Overview", icon: LayoutDashboard }, { href: `${base}/sites`, label: "Your sites", icon: Globe2 }, ...(workspace.role !== "viewer" ? [{ href: `${base}/sites/new`, label: "Add a site", icon: Plus }] : []), { href: `${base}/settings`, label: "Settings", icon: Settings2 }] : [{ href: "/workspaces", label: "Workspaces", icon: Building2 }, { href: "/workspaces/new", label: "Create workspace", icon: Plus }];
  async function signOut() { if (!window.dispatchEvent(new Event("bizoveya:before-signout", { cancelable: true }))) return; setSigningOut(true); setMessage(""); try { const result = await createSupabaseBrowserClient().auth.signOut(); if (result.error) throw result.error; router.push("/login?next=/workspaces"); router.refresh(); } catch { setMessage("Could not sign out. Please retry."); } finally { setSigningOut(false); } }
  return <div className="bz-workspace" data-theme={theme} data-studio={isStudio} data-navigation-hidden={navigationHidden}>
    <a className="bz-skip" href="#bz-main">Skip to content</a>
    <aside id="workspace-navigation" className="bz-sidebar" hidden={navigationHidden}><Link className="bz-brand" href="/workspaces"><span aria-hidden="true">B</span><div><strong>Bizoveya</strong><small>YOUR DIGITAL WORKSPACE</small></div></Link>
      <div className="bz-context"><span className="bz-kicker">{workspace ? "CURRENT WORKSPACE" : "CONNECTED BUSINESS"}</span><strong>{workspace?.name ?? "A home for your websites"}</strong>{workspace && <span className="bz-badge">{workspace.role}</span>}</div>
      <nav aria-label="Workspace navigation">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href || (label === "Your sites" && pathname.startsWith(`${href}/`) && pathname !== `${href}/new`) ? "is-active" : ""} aria-current={pathname === href ? "page" : label === "Your sites" && pathname.startsWith(`${href}/`) && pathname !== `${href}/new` ? "location" : undefined}><Icon size={19} aria-hidden="true" />{label}</Link>)}</nav>
      {workspace && <Link className="bz-switch" href="/workspaces"><Building2 size={16} aria-hidden="true" />Your workspaces</Link>}
      <div className="bz-future"><Sparkles size={19} aria-hidden="true" /><strong>Built to grow with you</strong><p>Business drafts are available. Snapshot publishing is available; private site knowledge is available. AI agents are planned.</p><span className="bz-badge">More to come</span></div>
      <div className="bz-sidebar-bottom"><Link href="/projects"><ArrowUpRight size={17} aria-hidden="true" />Portfolio Studio</Link><Link href="/bizoveya/docs"><BookOpen size={17} aria-hidden="true" />Project documents</Link></div>
    </aside>
    <div className="bz-body"><header className="bz-topbar"><div className="bz-top-label">{isStudio && <button type="button" aria-controls="workspace-navigation" aria-expanded={!navigationHidden} onClick={() => setNavigationOverride(!navigationHidden)}>{navigationHidden ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>} {navigationHidden ? "Show navigation" : "Hide navigation"}</button>}<span className="bz-dot" />Workspace foundation<span className="bz-badge">Early implementation</span></div><div className="bz-user-actions"><button type="button" onClick={() => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); try { localStorage.setItem("bizoveya-workspace-theme", next); } catch {} }} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>{email ? <><span className="bz-email">{email}</span><button type="button" disabled={signingOut} onClick={() => void signOut()} aria-label="Sign out"><LogOut size={18} /></button></> : <Link href="/login?next=/workspaces">Sign in</Link>}</div></header>
      <main id="bz-main" className="bz-main" tabIndex={-1}>{message && <p className="bz-alert" role="alert">{message}</p>}{children}</main><footer className="bz-footer">Bizoveya · Your existing websites stay in your control.</footer>
    </div>
  </div>;
}
