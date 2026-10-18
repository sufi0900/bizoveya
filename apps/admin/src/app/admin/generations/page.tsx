import {AdminFrame} from '@/features/admin/frame';
import {AdminNotice} from '@/features/admin/views';
import {loadAdminPage} from '@/features/admin/page-data';
import {loadGenerationRoom} from '@/features/generation/dispatch';
import {GenerationRoom} from '@/features/generation/room';
import Link from 'next/link';
import {localTestingEnabled} from '@/features/local-testing/contracts';
export const dynamic='force-dynamic';
export default async function Page(){const s=await loadAdminPage('/admin/generations',({db})=>loadGenerationRoom(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<>{localTestingEnabled(process.env)&&<p><Link href="/admin/local-testing">Open local agent rehearsal</Link> — test Ollama without changing production runs.</p>}<GenerationRoom initial={s.value}/></>:<AdminNotice message={s.message}/>}</AdminFrame>;}
