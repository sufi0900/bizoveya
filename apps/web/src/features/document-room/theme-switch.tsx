"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
const key = "bizoveya-doc-room-theme";
export function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(key); } catch { /* Storage may be disabled. */ }
    const initial = stored === "light" || stored === "dark" ? stored : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.bizoveyaDocsTheme = initial;
    setTheme(initial);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.bizoveyaDocsTheme = next;
    setTheme(next);
    window.dispatchEvent(new Event("bizoveya-doc-theme-change"));
    try { window.localStorage.setItem(key, next); } catch { /* Still switch for this visit. */ }
  };
  return <button className="doc-theme-toggle" type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
    {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}<span>{theme === "dark" ? "Light" : "Dark"}</span>
  </button>;
}
