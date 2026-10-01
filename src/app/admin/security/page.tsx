import { AdminFrame } from "@/features/admin/frame";
import { AdminNotice } from "@/features/admin/views";
import { AdminMfa } from "@/features/admin/mfa";
import { loadAdminPage } from "@/features/admin/page-data";
export default async function AdminSecurityPage() {
  const result = await loadAdminPage("/admin/security", async ({ identity }) => identity, false);
  return <AdminFrame email={result.ready ? result.email : undefined}>{result.ready ? <AdminMfa verified={result.value.aal2} /> : <AdminNotice message={result.message} />}</AdminFrame>;
}
