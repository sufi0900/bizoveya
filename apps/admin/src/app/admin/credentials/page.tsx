import {AdminFrame} from "@/features/admin/frame";import {AdminNotice} from "@/features/admin/views";import {loadAdminPage} from "@/features/admin/page-data";import {loadModels} from "@/features/models/store";import {ModelsRoom} from "@/features/models/room";
export const dynamic="force-dynamic";
export default async function Page(){const s=await loadAdminPage("/admin/credentials",({db})=>loadModels(db));return <AdminFrame email={s.ready?s.email:undefined}>{s.ready?<ModelsRoom initial={s.value} mode="credentials"/>:<AdminNotice message={s.message}/>}</AdminFrame>;}
