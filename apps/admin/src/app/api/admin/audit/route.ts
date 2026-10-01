import { adminApi } from "@/features/admin/api";
import { loadAdminAudit } from "@/features/admin/store";
export const dynamic = "force-dynamic";
export async function GET() { return adminApi(loadAdminAudit); }
