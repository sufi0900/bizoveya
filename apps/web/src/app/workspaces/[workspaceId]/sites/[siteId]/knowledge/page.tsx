import Link from "next/link";
import type {Metadata} from "next";
import {loadKnowledge} from "@/features/knowledge/store";
import {KnowledgeRoom} from "@/features/knowledge/room";
import {loadWorkspacePage} from "@/features/workspaces/page-data";
import {WorkspaceFrame} from "@/features/workspaces/frame";
import {SetupNotice,WorkspaceHeading} from "@/features/workspaces/views";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Private site knowledge",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{workspaceId:string;siteId:string}>}){
 const {workspaceId,siteId}=await params;const state=await loadWorkspacePage(`/workspaces/${workspaceId}/sites/${siteId}/knowledge`,(db,userId)=>loadKnowledge(db,userId,workspaceId,siteId));
 if(!state.ready)return <WorkspaceFrame><SetupNotice message={state.message}/></WorkspaceFrame>;
 const {workspace,site,sources}=state.value;
 return <WorkspaceFrame email={state.email} workspace={workspace}><WorkspaceHeading eyebrow="PRIVATE BUSINESS KNOWLEDGE" title={`${site.name} · Knowledge`} description="Prepare source material, review facts, and approve what future agents may use. Knowledge does not publish to your website." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}`}>Site record</Link>}/><p><Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/agents`}>Agent readiness</Link></p><KnowledgeRoom initialSources={sources} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/knowledge`} role={workspace.role} siteId={siteId}/></WorkspaceFrame>;
}
