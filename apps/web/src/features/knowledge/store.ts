import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { approvedKnowledgeSchema, knowledgeDocumentSchema, knowledgeSourceSchema, type KnowledgeMutation } from "@/domain/knowledge";
import { canWriteWorkspace } from "@/domain/workspaces";
import { checkDatabaseError, getSite, requireId, WorkspaceError } from "@/features/workspaces/store";
function check(error:{code?:string;message?:string}|null) {
 if(["42P01","42703","PGRST202","PGRST205"].includes(error?.code??""))throw new WorkspaceError(503,"Knowledge storage needs migration 026. Ask the platform operator to complete setup.");
 if(error?.message==="bz_knowledge_duplicate")throw new WorkspaceError(409,"This source text already exists for this site. Open the existing source to correct it.");
 if(error?.message==="bz_knowledge_limit")throw new WorkspaceError(400,"This phase supports 20 sources per site and 100 revisions per source. Export your knowledge before removing obsolete sources.");
 if(error?.message==="bz_knowledge_empty")throw new WorkspaceError(400,"Review at least one fact before approval.");
 if(error?.message==="bz_invalid_knowledge")throw new WorkspaceError(400,"Check the source title, text, filename and reviewed fact limits.");
 checkDatabaseError(error);
}
export async function loadKnowledge(db:SupabaseClient,userId:string,workspaceId:string,siteId:string) {
 const context=await getSite(db,userId,workspaceId,siteId);
 const result=await db.from("bizoveya_knowledge_sources").select("*").eq("site_id",siteId).order("updated_at",{ascending:false});check(result.error);
 return {...context,sources:z.array(knowledgeSourceSchema).parse(result.data??[])};
}
export async function mutateKnowledge(db:SupabaseClient,userId:string,workspaceId:string,siteId:string,input:KnowledgeMutation) {
 const {workspace}=await getSite(db,userId,workspaceId,siteId);
 if(!canWriteWorkspace(workspace.role)||input.action!=="save"&&workspace.role!=="owner")throw new WorkspaceError(403,"Only an owner can approve, revoke or remove knowledge. Editors may prepare drafts; viewers are read-only.");
 const result=await db.rpc("bz_mutate_knowledge",{p_workspace_id:workspaceId,p_site_id:siteId,p_source_id:input.id,p_action:input.action,p_document:input.action==="save"?input.document:null,p_expected_version:input.expectedVersion});check(result.error);
 if(input.action==="delete")return {deleted:true,id:input.id};
 return {source:knowledgeSourceSchema.parse(Array.isArray(result.data)?result.data[0]:result.data)};
}
export async function approvedKnowledge(db:SupabaseClient,userId:string,workspaceId:string,siteId:string) {
 await getSite(db,userId,workspaceId,siteId);
 const result=await db.rpc("bz_read_approved_knowledge",{p_workspace_id:workspaceId,p_site_id:siteId});check(result.error);
 return z.array(approvedKnowledgeSchema).parse(result.data??[]);
}
export async function knowledgeHistory(db:SupabaseClient,userId:string,workspaceId:string,siteId:string,sourceId:string) {
 await getSite(db,userId,workspaceId,siteId);requireId(sourceId);
 const result=await db.from("bizoveya_knowledge_revisions").select("source_id,version,document,approved,actor_id,occurred_at,action").eq("source_id",sourceId).eq("site_id",siteId).order("version",{ascending:false});check(result.error);
 return z.array(z.object({source_id:z.uuid(),version:z.number().int().positive(),document:knowledgeDocumentSchema,approved:z.boolean(),actor_id:z.uuid().nullable(),occurred_at:z.string(),action:z.string()})).parse(result.data??[]);
}
