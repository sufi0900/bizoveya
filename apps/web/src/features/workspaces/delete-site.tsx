"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteRecord } from "@/domain/workspaces";
export function DeleteSite({ site }: { site: SiteRecord }) {
 const router = useRouter(); const lock = useRef(false); const [name, setName] = useState(""); const [confirmed, setConfirmed] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
 async function remove() {
  if (lock.current || name !== site.name || !confirmed) return;
  lock.current = true; setBusy(true); setError("");
  try { const response = await fetch(`/api/workspaces/${site.workspace_id}/sites/${site.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expectedVersion: site.version, confirmationName: name }), cache: "no-store" }); const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Deletion failed. Retry after reloading."); router.replace(`/workspaces/${site.workspace_id}/sites?removed=1`);  }
  catch (cause) { setError(cause instanceof Error ? cause.message : "Deletion failed."); lock.current = false; setBusy(false); }
 }
 return <section className="bz-delete-site"><h3>Delete site record</h3><p>{site.mode === "native_business" ? "Permanently removes this business draft, public snapshot and publication history, site knowledge and its revisions, and site agent preferences." : "Removes this Bizoveya record, site knowledge and its revisions, and site agent preferences. The external website or original portfolio remains intact."} A content-free deletion event remains. Download anything you want to keep first. Previous exports and provider backups are outside this action.</p><label htmlFor="delete-site-name">Type {site.name} to confirm<input id="delete-site-name" value={name} disabled={busy} onChange={e => setName(e.target.value)} autoComplete="off"/></label><label className="bz-check"><input type="checkbox" disabled={busy} checked={confirmed} onChange={e => setConfirmed(e.target.checked)}/>I understand this site record and the listed Bizoveya data cannot be restored here.</label>{error && <p className="bz-alert" role="alert">{error}</p>}<button type="button" className="bz-button" disabled={busy || name !== site.name || !confirmed} onClick={() => void remove()}>{busy ? "Deleting…" : "Permanently delete site record"}</button></section>;
}
