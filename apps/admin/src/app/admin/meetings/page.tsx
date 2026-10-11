import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadMeetingDelivery} from '@/features/meetings/delivery';
import {MeetingDeliveryRoom} from '@/features/meetings/room';
export const dynamic='force-dynamic';
export default async function Page(){const state=await loadAdminPage('/admin/meetings',({db})=>loadMeetingDelivery(db));return <AdminFrame email={state.ready?state.email:undefined}>{state.ready?<MeetingDeliveryRoom initial={state.value}/>:<AdminNotice message={state.message}/>}</AdminFrame>;}
