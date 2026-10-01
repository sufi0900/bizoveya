import { adminApi } from "@/features/admin/api";
import { loadAdminSummary } from "@/features/admin/store";
export const dynamic = "force-dynamic";
export async function GET() { return adminApi(loadAdminSummary); }
