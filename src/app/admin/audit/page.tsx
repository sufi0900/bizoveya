import { AdminFrame } from "@/features/admin/frame";
import { AdminNotice, AuditTimeline } from "@/features/admin/views";
import { loadAdminPage } from "@/features/admin/page-data";
import { loadAdminAudit } from "@/features/admin/store";
export default async function AdminAuditPage() {
  const result = await loadAdminPage("/admin/audit", ({ db }) => loadAdminAudit(db));
  return <AdminFrame email={result.ready ? result.email : undefined}>{result.ready ? <AuditTimeline events={result.value} /> : <AdminNotice message={result.message} />}</AdminFrame>;
}
