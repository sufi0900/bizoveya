import { redirect, notFound } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WorkspaceError } from "./store";
export type WorkspacePageData<T> = { ready: true; value: T; email: string } | { ready: false; message: string };
export async function loadWorkspacePage<T>(path: string, loader: (db: SupabaseClient, userId: string) => Promise<T>): Promise<WorkspacePageData<T>> {
  if (!hasSupabaseConfig) return { ready: false, message: "Connect Supabase to save workspaces. Configure your existing Supabase URL and anonymous key, then apply migration 018 after checking the applied migration history." };
  let db: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  let user: { id: string; email?: string } | null;
  try {
    db = await createSupabaseServerClient();
    const result = await db.auth.getUser();
    if (result.error) user = null; else user = result.data.user;
  } catch { return { ready: false, message: "Sign-in storage is temporarily unavailable. Please reload and try again." }; }
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  try { return { ready: true, value: await loader(db, user.id), email: user.email ?? "Signed in" }; }
  catch (cause) {
    if (cause instanceof WorkspaceError && cause.status === 404) notFound();
    return { ready: false, message: cause instanceof WorkspaceError ? cause.message : "Workspace data could not be loaded. Please reload and try again." };
  }
}
