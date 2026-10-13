import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
const mocks = vi.hoisted(() => ({ save: vi.fn(), knowledge: vi.fn(), preferences: vi.fn(), onboarding: vi.fn(), business: vi.fn() }));
vi.mock("@/features/campaigns/store", async original => ({ ...await original<typeof import("@/features/campaigns/store")>(), saveCampaign: mocks.save }));
vi.mock("@/features/knowledge/store", async original => ({ ...await original<typeof import("@/features/knowledge/store")>(), mutateKnowledge: mocks.knowledge }));
vi.mock("@/features/agents/store", async original => ({ ...await original<typeof import("@/features/agents/store")>(), savePreferences: mocks.preferences }));
vi.mock("@/features/agents/onboarding-store", () => ({ loadOnboarding: mocks.onboarding }));
vi.mock("@/features/business/store", async original => ({ ...await original<typeof import("@/features/business/store")>(), saveBusinessDraft: mocks.business }));
import { callMcpTool, mcpTools } from "./tools";
const context = { db: {} as SupabaseClient, userId: "user" };
const workspaceId = "11111111-1111-4111-8111-111111111111", siteId = "22222222-2222-4222-8222-222222222222", id = "33333333-3333-4333-8333-333333333333";
describe("plugin tool boundary", () => {
  it("advertises valid schemas and excludes publication, deletion and generation", () => { const tools = mcpTools(true); expect(tools).toHaveLength(14); expect(tools.every(t => t.inputSchema.type === "object")).toBe(true); expect(tools.some(t => /publish|delete|generate|approve/.test(t.name))).toBe(false); });
  it("blocks direct writes when disabled, even if the caller knows the tool name", async () => { await expect(callMcpTool("save_campaign_draft", {}, context, false)).rejects.toMatchObject({ status: 400 }); expect(mocks.save).not.toHaveBeenCalled(); });
  it("rejects injected identity fields and invalid IDs", async () => { await expect(callMcpTool("list_workspaces", { userId: "other-user" }, context, false)).rejects.toMatchObject({ status: 400 }); await expect(callMcpTool("list_sites", { workspaceId: "bad" }, context, false)).rejects.toMatchObject({ status: 400 }); });
  it("forwards expected version to the existing campaign permission adapter", async () => { const input = { id, expectedVersion: 4, document: { title: "Draft", brief: "Approved brief", blog: "", pinterest: "", linkedin: "" } }; mocks.save.mockResolvedValue({ ...input, version: 5 }); await callMcpTool("save_campaign_draft", { workspaceId, siteId, ...input }, context, true); expect(mocks.save).toHaveBeenCalledWith(context.db, "user", workspaceId, siteId, input); });
  it("can only save knowledge drafts and never pass an approval action", async () => { const input = { id, expectedVersion: 0, document: { title: "Knowledge", filename: "notes.txt", sourceText: "User supplied fact", facts: [] } }; await callMcpTool("save_knowledge_draft", { workspaceId, siteId, ...input }, context, true); expect(mocks.knowledge).toHaveBeenCalledWith(context.db, "user", workspaceId, siteId, { ...input, action: "save" }); await expect(callMcpTool("save_knowledge_draft", { workspaceId, siteId, ...input, action: "approve" }, context, true)).rejects.toMatchObject({ status: 400 }); });
});

describe("context-based setup tools", () => {
  it("saves site preferences with the verified actor and current version", async () => {
    const document = { brandVoice: "Clear and practical", audience: "Small businesses", guidance: "Use confirmed facts only." };
    await callMcpTool("save_agent_preferences", { workspaceId, siteId, document, expectedVersion: 3 }, context, true);
    expect(mocks.preferences).toHaveBeenCalledWith(context.db, "user", workspaceId, siteId, document, 3);
  });
  it("rejects invented permission fields and disabled preference saves", async () => {
    const document = { brandVoice: "", audience: "", guidance: "", publishPermission: true };
    await expect(callMcpTool("save_agent_preferences", { workspaceId, siteId, document, expectedVersion: 0 }, context, true)).rejects.toMatchObject({ status: 400 });
    await expect(callMcpTool("save_agent_preferences", {}, context, false)).rejects.toMatchObject({ status: 400 });
  });
  it("reports genuine operator and knowledge blockers after fields are filled", async () => {
    mocks.onboarding.mockResolvedValue({ current: { facts: [], siteTeam: { enabled: null }, roles: [{ kind: "coordinator", qualifiedCount: 0 }, { kind: "content", qualifiedCount: 1 }, { kind: "quality", qualifiedCount: 1 }], preferences: { document: { audience: "Customers", brandVoice: "Clear", guidance: "Confirmed facts" } } } });
    const result = await callMcpTool("read_setup_status", { workspaceId, siteId }, context, true) as { assessment: { preparationChecksPassed: boolean; blockers: string[] }; humanReviewRequired: boolean };
    expect(result.assessment.preparationChecksPassed).toBe(false);
    expect(result.assessment.blockers).toHaveLength(2);
    expect(result.humanReviewRequired).toBe(true);
  });
  it("does not expose platform agent creation or human approval tools", () => {
    const names = mcpTools(true).map(tool => tool.name);
    expect(names).not.toContain("create_agent"); expect(names).not.toContain("approve_agent"); expect(names).not.toContain("save_agent_team");
  });
});
