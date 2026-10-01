import { adminCookieOptions, adminCookieSettings } from "./cookie-options";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseConfig();
  return createServerClient(url, key, {
    cookieOptions: adminCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, { ...options, ...adminCookieSettings })); } catch {}
      },
    },
  });
}
