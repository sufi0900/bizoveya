"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
type Factor = { id: string; friendly_name?: string };
type Enrollment = { id: string; qr: string; secret: string };
export function AdminMfa({ verified }: { verified: boolean }) {
  const router = useRouter(); const lock = useRef(false);
  const [factors, setFactors] = useState<Factor[]>([]); const [selected, setSelected] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null); const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (verified) { setLoading(false); return; }
    let active = true; setLoading(true); setLoaded(false); setError("");
    void (async () => { try {
      const { data, error } = await createSupabaseBrowserClient().auth.mfa.listFactors();
      if (error) throw error;
      if (active) { setFactors(data.totp); setSelected(data.totp[0]?.id ?? ""); setLoaded(true); }
    } catch { if (active) setError("Could not load authenticators. Check your connection and retry."); }
    finally { if (active) setLoading(false); } })();
    return () => { active = false; };
  }, [verified, attempt]);
  async function enroll() {
    if (lock.current) return; lock.current = true; setBusy(true); setError("");
    try {
      const auth = createSupabaseBrowserClient().auth;
      const result = await auth.mfa.listFactors(); if (result.error) throw result.error;
      if (result.data.totp.length) { setFactors(result.data.totp); setSelected(result.data.totp[0].id); return; }
      // Clean only our own abandoned, unverified setup, never another or a verified factor.
      for (const factor of result.data.all.filter(f => f.factor_type === "totp" && f.status === "unverified" && f.friendly_name === "Bizoveya admin")) {
        const removed = await auth.mfa.unenroll({ factorId: factor.id }); if (removed.error) throw removed.error;
      }
      const resultEnroll = await auth.mfa.enroll({ factorType: "totp", friendlyName: "Bizoveya admin", issuer: "Bizoveya" });
      if (resultEnroll.error) throw resultEnroll.error;
      const { id, totp } = resultEnroll.data;
      // Normalize the SDK's raw SVG data URL so # and other URI characters cannot truncate it.
      const svg = totp.qr_code.startsWith("data:image/svg+xml") ? decodeURIComponent(totp.qr_code.slice(totp.qr_code.indexOf(",") + 1)) : totp.qr_code;
      const qr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      setEnrollment({ id, qr, secret: totp.secret }); setSelected(id); setCode("");
    } catch { setError("Authenticator setup failed. Please retry. If you are locked out, contact the database operator."); }
    finally { lock.current = false; setBusy(false); }
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); if (lock.current || !selected || !/^\d{6}$/.test(code)) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const { error } = await createSupabaseBrowserClient().auth.mfa.challengeAndVerify({ factorId: selected, code });
      if (error) throw error;
      setEnrollment(null); setCode(""); router.replace("/admin"); router.refresh();
    } catch { setCode(""); setError("Verification failed. Use a fresh code and retry; check your authenticator clock if it persists."); }
    finally { lock.current = false; setBusy(false); }
  }
  if (verified) return <section className="ba-panel ba-mfa"><p className="ba-kicker">AUTHENTICATOR</p><h1>This session has MFA verification.</h1><p>Your platform-admin grant is also checked on every protected request.</p><Link className="ba-button" href="/admin">Open platform overview</Link><p className="ba-muted">Factor removal and recovery are handled through the operator procedure. No recovery codes are issued by this screen.</p></section>;
  return <section className="ba-panel ba-mfa"><p className="ba-kicker">SECOND STEP</p><h1>Secure your admin session.</h1><p>Verify with an authenticator app before accessing platform records.</p>{error && <p className="ba-notice" role="alert">{error}</p>}{loading ? <p role="status">Loading authenticators…</p> : !loaded ? <button onClick={() => setAttempt(a => a + 1)} className="ba-button">Retry loading</button> : <>
    {!factors.length && !enrollment && <><p>Set up a time-based authenticator for this account. Keep the setup key private.</p><button className="ba-button" disabled={busy} onClick={() => void enroll()}>{busy ? "Setting up…" : "Set up authenticator"}</button></>}
    {enrollment && <div className="ba-enrollment"><Image unoptimized src={enrollment.qr} alt="Scan this private setup QR code with your authenticator" width={208} height={208} /><details><summary>Enter setup key manually</summary><code>{enrollment.secret}</code></details><p className="ba-muted">Do not share or screenshot this key. It disappears after verification. Leaving now abandons this setup; restarting creates a new key.</p></div>}
    {(factors.length > 0 || enrollment) && <form onSubmit={verify}>{factors.length > 1 && <label>Authenticator<select disabled={busy} value={selected} onChange={e => { setSelected(e.target.value); setCode(""); }}>{factors.map((f, i) => <option key={f.id} value={f.id}>{f.friendly_name ?? `Authenticator ${i + 1}`}</option>)}</select></label>}<label htmlFor="mfa-code">Six-digit code<input id="mfa-code" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required disabled={busy} /></label><button className="ba-button" disabled={busy || code.length !== 6}>{busy ? "Verifying…" : "Verify and continue"}</button></form>}
  </>}<p className="ba-muted">Lost access? Contact the database operator. Signing up or owning a workspace never grants platform-admin access.</p></section>;
}
