import { NextResponse } from "next/server";
import { adminSession, safeAdminError } from "./access";
export async function adminApi(loader: (db: Awaited<ReturnType<typeof adminSession>>["db"]) => Promise<unknown>) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const { db } = await adminSession();
    return NextResponse.json(await loader(db), { headers });
  } catch (cause) {
    const error = safeAdminError(cause);
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status, headers });
  }
}
