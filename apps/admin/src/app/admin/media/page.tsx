import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadMediaRegistry} from '@/features/media-providers/store';
import {MediaRoom} from '@/features/media-providers/room';
export const dynamic='force-dynamic';
export default async function Page(){const s=await loadAdminPage('/admin/media',({db})=>loadMediaRegistry(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<MediaRoom initial={s.value}/>:<AdminNotice message={s.message}/>}</AdminFrame>;}
