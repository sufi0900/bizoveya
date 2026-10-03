import Link from "next/link";
import {notFound} from "next/navigation";
import {loadCampaigns} from "@/features/campaigns/store";
import {CampaignRoom} from "@/features/campaigns/room";
import {loadWorkspacePage} from "@/features/workspaces/page-data";
import {WorkspaceFrame} from "@/features/workspaces/frame";
import {SetupNotice,WorkspaceHeading} from "@/features/workspaces/views";
import {canWriteWorkspace} from "@/domain/workspaces";
export const dynamic="force-dynamic";
export const metadata={title:"Private campaign drafts",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{workspaceId:string;siteId:string;campaignId?:string}>}){
 const {workspaceId,siteId,campaignId}=await params;const base=`/workspaces/${workspaceId}/sites/${siteId}/campaigns`;
 const state=await loadWorkspacePage(base,(db,userId)=>loadCampaigns(db,userId,workspaceId,siteId));
 if(!state.ready)return <WorkspaceFrame><SetupNotice message={state.message}/></WorkspaceFrame>;
 const v=state.value;if(campaignId&&!v.campaigns.some(c=>c.id===campaignId))notFound();
 return <WorkspaceFrame email={state.email} workspace={v.workspace}><WorkspaceHeading eyebrow="PRIVATE CONTENT CAMPAIGNS" title={`${v.site.name} · Draft room`} description="Prepare a shared brief and save blog, Pinterest and LinkedIn text for review." action={<Link className="bz-button" href={`/workspaces/${workspaceId}/sites/${siteId}/knowledge`}>Site knowledge</Link>}/><CampaignRoom key={campaignId??"new"} records={v.campaigns} history={v.history} generations={v.generations} endpoint={`/api/workspaces/${workspaceId}/sites/${siteId}/campaigns`} base={base} selectedId={campaignId} canWrite={canWriteWorkspace(v.workspace.role)}/></WorkspaceFrame>;
}
