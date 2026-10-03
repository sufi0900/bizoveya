import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadSpendingRoom} from '@/features/spending/store';
import {SpendingRoom} from '@/features/spending/room';
export const dynamic='force-dynamic';
export default async function Page(){const s=await loadAdminPage('/admin/spending',({db})=>loadSpendingRoom(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<SpendingRoom initial={s.value}/>:<AdminNotice message={s.message}/>}</AdminFrame>;}
