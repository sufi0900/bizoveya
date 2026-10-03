import {AdminFrame} from '@/features/admin/frame';import {AdminNotice} from '@/features/admin/views';import {loadAdminPage} from '@/features/admin/page-data';import {loadRoom} from '@/features/model-tests/store';import {ModelTestsRoom} from '@/features/model-tests/room';
export const dynamic='force-dynamic';
export default async function Page(){const s=await loadAdminPage('/admin/model-tests',({db})=>loadRoom(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<ModelTestsRoom initial={s.value}/>:<AdminNotice message={s.message}/>}</AdminFrame>;}
