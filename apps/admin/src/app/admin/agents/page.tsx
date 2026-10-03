import {AdminFrame} from "@/features/admin/frame";
import {AdminNotice} from "@/features/admin/views";
import {loadAdminPage} from "@/features/admin/page-data";
import {loadRegistry} from "@/features/agents/store";
import {AgentRegistry} from "@/features/agents/registry";
export const dynamic="force-dynamic";
export default async function Page(){const state=await loadAdminPage("/admin/agents",({db})=>loadRegistry(db));return <AdminFrame email={state.ready?state.email:undefined}>{state.ready?<AgentRegistry initial={state.value}/>:<AdminNotice message={state.message}/>}</AdminFrame>;}
