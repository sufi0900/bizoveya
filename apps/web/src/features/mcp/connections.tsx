"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function RevokeConnection({ clientId, name }: { clientId: string; name: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function revoke() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/oauth/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision: "revoke", clientId }) });
      if (!response.ok) throw new Error("Could not revoke access. Please retry.");
      router.refresh();
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Please retry."); }
    finally { setBusy(false); }
  }
  return <div><button type="button" disabled={busy} onClick={() => void revoke()} aria-label={`Revoke ${name}`}>{busy ? "Revoking…" : "Revoke access"}</button>{message && <p role="alert">{message}</p>}</div>;
}
