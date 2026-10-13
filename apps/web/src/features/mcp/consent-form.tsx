"use client";
import { useState } from "react";
export function ConsentForm({ authorizationId }: { authorizationId: string }) {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function decide(decision: "approve" | "deny") {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/oauth/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ authorizationId, decision }) });
      const data = await response.json();
      if (!response.ok || typeof data.redirectUrl !== "string") throw new Error(data.error ?? "Could not complete authorization.");
      window.location.assign(data.redirectUrl);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Please retry."); setBusy(false); }
  }
  return <div>{message && <p role="alert">{message}</p>}<div className="bz-actions"><button className="primary-action" disabled={busy} onClick={() => void decide("approve")}>Allow access</button><button className="secondary-action" disabled={busy} onClick={() => void decide("deny")}>Deny</button></div></div>;
}
