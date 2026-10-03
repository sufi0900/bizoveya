import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadBindingRoom} from '@/features/bindings/store';
import {BindingsRoom} from '@/features/bindings/room';
export const dynamic='force-dynamic';
export default async function Page(){const s=await loadAdminPage('/admin/bindings',({db})=>loadBindingRoom(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<BindingsRoom initial={s.value}/>:<AdminNotice message={s.message}/>}</AdminFrame>;}
