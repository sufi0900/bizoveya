import { AdminFrame } from "@/features/admin/frame";
import { AdminNotice, AdminOverview } from "@/features/admin/views";
import { loadAdminPage } from "@/features/admin/page-data";
import { loadAdminSummary } from "@/features/admin/store";
export default async function AdminPage() {
  const result = await loadAdminPage("/admin", ({ db }) => loadAdminSummary(db));
  return <AdminFrame email={result.ready ? result.email : undefined}>{result.ready ? <AdminOverview summary={result.value} /> : <AdminNotice message={result.message} />}</AdminFrame>;
}
