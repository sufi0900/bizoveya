import { redirect, notFound } from "next/navigation";
import { adminSession, safeAdminError } from "./access";
export async function loadAdminPage<T>(path: string, loader: (session: Awaited<ReturnType<typeof adminSession>>) => Promise<T>, requireMfa = true): Promise<{ ready: true; value: T; email: string } | { ready: false; message: string }> {
  try {
    const session = await adminSession(requireMfa);
    return { ready: true, value: await loader(session), email: session.email };
  } catch (cause) {
    const error = safeAdminError(cause);
    if (error.status === 401) redirect(`/login?next=${encodeURIComponent(path)}`);
    if (error.code === "MFA_REQUIRED") redirect("/admin/security");
    if (error.status === 403) notFound();
    return { ready: false, message: error.message };
  }
}
