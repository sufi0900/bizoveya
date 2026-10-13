import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
const mocks = vi.hoisted(() => ({ save: vi.fn(), knowledge: vi.fn() }));
vi.mock("@/features/campaigns/store", async original => ({ ...await original<typeof import("@/features/campaigns/store")>(), saveCampaign: mocks.save }));
vi.mock("@/features/knowledge/store", async original => ({ ...await original<typeof import("@/features/knowledge/store")>(), mutateKnowledge: mocks.knowledge }));
import { callMcpTool, mcpTools } from "./tools";
const context = { db: {} as SupabaseClient, userId: "user" };
const workspaceId = "11111111-1111-4111-8111-111111111111", siteId = "22222222-2222-4222-8222-222222222222", id = "33333333-3333-4333-8333-333333333333";
describe("plugin tool boundary", () => {
  it("advertises valid schemas and excludes publication, deletion and generation", () => { const tools = mcpTools(true); expect(tools).toHaveLength(7); expect(tools.every(t => t.inputSchema.type === "object")).toBe(true); expect(tools.some(t => /publish|delete|generate|approve/.test(t.name))).toBe(false); });
  it("blocks direct writes when disabled, even if the caller knows the tool name", async () => { await expect(callMcpTool("save_campaign_draft", {}, context, false)).rejects.toMatchObject({ status: 400 }); expect(mocks.save).not.toHaveBeenCalled(); });
  it("rejects injected identity fields and invalid IDs", async () => { await expect(callMcpTool("list_workspaces", { userId: "other-user" }, context, false)).rejects.toMatchObject({ status: 400 }); await expect(callMcpTool("list_sites", { workspaceId: "bad" }, context, false)).rejects.toMatchObject({ status: 400 }); });
  it("forwards expected version to the existing campaign permission adapter", async () => { const input = { id, expectedVersion: 4, document: { title: "Draft", brief: "Approved brief", blog: "", pinterest: "", linkedin: "" } }; mocks.save.mockResolvedValue({ ...input, version: 5 }); await callMcpTool("save_campaign_draft", { workspaceId, siteId, ...input }, context, true); expect(mocks.save).toHaveBeenCalledWith(context.db, "user", workspaceId, siteId, input); });
  it("can only save knowledge drafts and never pass an approval action", async () => { const input = { id, expectedVersion: 0, document: { title: "Knowledge", filename: "notes.txt", sourceText: "User supplied fact", facts: [] } }; await callMcpTool("save_knowledge_draft", { workspaceId, siteId, ...input }, context, true); expect(mocks.knowledge).toHaveBeenCalledWith(context.db, "user", workspaceId, siteId, { ...input, action: "save" }); await expect(callMcpTool("save_knowledge_draft", { workspaceId, siteId, ...input, action: "approve" }, context, true)).rejects.toMatchObject({ status: 400 }); });
});
