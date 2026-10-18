import {notFound} from 'next/navigation';
import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadGenerationRoom} from '@/features/generation/dispatch';
import {localTestingEnabled} from '@/features/local-testing/contracts';
import {LocalTestingRoom} from '@/features/local-testing/room';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!localTestingEnabled(process.env))notFound();
 const s=await loadAdminPage('/admin/local-testing',({db})=>loadGenerationRoom(db));
 return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<LocalTestingRoom runs={s.value.runs} model={process.env.BIZOVEYA_OLLAMA_MODEL??''}/>:<AdminNotice message={s.message}/>}</AdminFrame>;
}
