import Link from "next/link";
import {loadReadiness} from "@/features/agents/store";
import {ReadinessRoom} from "@/features/agents/room";
import {loadWorkspacePage} from "@/features/workspaces/page-data";
import {WorkspaceFrame} from "@/features/workspaces/frame";
import {SetupNotice,WorkspaceHeading} from "@/features/workspaces/views";
export const dynamic="force-dynamic";
export const metadata={title:"Site agent readiness",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{workspaceId:string;siteId:string}>}){const {workspaceId,siteId}=await params;const path=`/workspaces/${workspaceId}/sites/${siteId}/agents`;const state=await loadWorkspacePage(path,(db,userId)=>loadReadiness(db,userId,workspaceId,siteId));if(!state.ready)return <WorkspaceFrame><SetupNotice message={state.message}/></WorkspaceFrame>;const v=state.value;return <WorkspaceFrame email={state.email} workspace={v.workspace}><WorkspaceHeading eyebrow="PRIVATE AGENT READINESS" title={`${v.site.name} · Agent readiness`} description="Prepare site preferences and inspect the approved context. No model runs or external actions occur." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/knowledge`}>Site knowledge</Link>}/><ReadinessRoom initial={v.document} initialVersion={v.version} agents={v.agents} role={v.workspace.role} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/agents`}/></WorkspaceFrame>;}
