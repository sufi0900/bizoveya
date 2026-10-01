import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Removed admin endpoints never depend on public authentication or redirect.
  const pathname = request.nextUrl.pathname.toLowerCase();
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|pcm-processor.js).*)"] };
