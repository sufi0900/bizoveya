import { AdminFrame } from '@/features/admin/frame';
import { AdminNotice } from '@/features/admin/views';
import { loadAdminPage } from '@/features/admin/page-data';
import { loadMeetingExecutionConsents } from '@/features/meetings/consent-store';
import { MeetingConsentRoom } from '@/features/meetings/consent-room';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const state = await loadAdminPage('/admin/deliberations', ({ db }) => loadMeetingExecutionConsents(db));
  return <AdminFrame email={state.ready ? state.email : undefined}>{state.ready ? <MeetingConsentRoom initial={state.value} /> : <AdminNotice message={state.message} />}</AdminFrame>;
}
