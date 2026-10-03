"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import "./marketing.css";
export function MarketingShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const [account, setAccount] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(!hasSupabaseConfig);
  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let alive = true;
    const client = createSupabaseBrowserClient();
    const show = (user: { email?: string; user_metadata?: { full_name?: string; name?: string } } | null) => {
      if (!alive) return;
      setAccount(user ? user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Your account" : null);
      setAuthReady(true);
    };
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => show(session?.user ?? null));
    void client.auth.getUser().then(({ data }) => show(data.user)).catch(() => show(null));
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  useEffect(() => { try { setTheme(localStorage.getItem("bizoveya-public-theme") === "light" ? "light" : "dark"); } catch {} }, []);
  function toggle() { const next = theme === "dark" ? "light" : "dark"; setTheme(next); try { localStorage.setItem("bizoveya-public-theme", next); } catch {} }
  return <div className="biz-public" data-theme={theme}><a className="biz-skip" href="#public-content">Skip to content</a><header className="biz-nav"><Link className="biz-logo" href="/"><span aria-hidden="true">B</span>Bizoveya</Link><nav aria-label="Main navigation"><Link href="/templates">Templates</Link><Link href="/workspaces">Workspace</Link><Link href="/bizoveya/docs">Docs</Link></nav><div className="biz-nav-actions"><button onClick={toggle} type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>{!authReady ? <span role="status">Checking account…</span> : <Link className="biz-btn small biz-account" href={account ? "/workspaces" : "/login?next=/workspaces"} title={account ?? undefined}>{account || "Sign in"} <ArrowUpRight size={15} aria-hidden="true" /></Link>}</div></header><main id="public-content">{children}</main><footer className="biz-footer"><Link className="biz-logo" href="/">Bizoveya</Link><p>A workspace for your business on the web.</p><div><Link href="/portfolio">Portfolio editor</Link><Link href="/bizoveya/docs">Project documents</Link></div><small>Early product preview · business drafts and snapshot publishing available; AI workflows are being developed.</small></footer></div>;
}
