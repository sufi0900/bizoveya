import { z } from "zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWorkspaceSchema } from "@/domain/workspaces";
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), configured: true }));
vi.mock("@/lib/supabase/config", () => ({ get hasSupabaseConfig() { return mocks.configured; } }));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient: async () => ({ auth: { getUser: mocks.getUser } }) }));
import { readInput, workspaceApi, workspaceJson } from "./api";
const request = (body: string, headers: Record<string, string> = {}) => new Request("https://bizoveya.test/api/workspaces", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body });
beforeEach(() => { mocks.configured = true; mocks.getUser.mockResolvedValue({ data: { user: { id: "user" } }, error: null }); });
describe("direct workspace API boundary", () => {
  it("permits a bounded business-size body without loosening the default or origin gate", async () => {
    const schema = z.object({ text: z.string().max(60000) }).strict();
    const body = JSON.stringify({ text: "x".repeat(20000) });
    await expect(readInput(request(body),schema)).rejects.toMatchObject({status:413});
    expect((await readInput(request(body),schema,65536)).text).toHaveLength(20000);
    await expect(readInput(request(JSON.stringify({text:"x".repeat(65536)})),schema,65536)).rejects.toMatchObject({status:413});
    await expect(readInput(request(body,{Origin:"https://attacker.test"}),schema,65536)).rejects.toMatchObject({status:403});
  });
  it("accepts the routed local browser host while rejecting a foreign origin", async () => {
    const local = new Request("http://localhost:3190/api/workspaces", { method: "POST", headers: { Host: "127.0.0.1:3190", Origin: "http://127.0.0.1:3190", "Content-Type": "application/json" }, body: '{"name":"Business"}' });
    expect(await readInput(local, createWorkspaceSchema)).toEqual({ name: "Business" });
    await expect(readInput(request('{"name":"Business"}', { Host: "bizoveya.test", Origin: "https://attacker.test", "X-Forwarded-Host": "attacker.test" }), createWorkspaceSchema)).rejects.toMatchObject({ status: 403 });
  });
  it("requires a verified session and skips the handler when unauthorized", async () => { mocks.getUser.mockResolvedValue({ data: { user: null }, error: null }); const handler = vi.fn(); const response = await workspaceApi(handler); expect(response.status).toBe(401); expect(handler).not.toHaveBeenCalled(); });
  it("returns a setup failure rather than fake success when unconfigured", async () => { mocks.configured = false; const handler = vi.fn(); expect((await workspaceApi(handler)).status).toBe(503); expect(handler).not.toHaveBeenCalled(); });
  it("sets no-store on success and redacts unknown backend exceptions", async () => { const response = await workspaceApi(async () => workspaceJson({ ok: true })); expect(response.headers.get("cache-control")).toContain("no-store"); const failed = await workspaceApi(async () => { throw new Error("secret"); }); expect(failed.status).toBe(503); expect(await failed.text()).not.toContain("secret"); });
  it("rejects cross-origin JSON and cross-site metadata", async () => { await expect(readInput(request('{"name":"Business"}', { Origin: "https://attacker.test" }), createWorkspaceSchema)).rejects.toMatchObject({ status: 403 }); await expect(readInput(request('{"name":"Business"}', { "Sec-Fetch-Site": "cross-site" }), createWorkspaceSchema)).rejects.toMatchObject({ status: 403 }); });
  it("rejects non-JSON, malformed and oversized payloads", async () => { await expect(readInput(request("name=x", { "Content-Type": "text/plain" }), createWorkspaceSchema)).rejects.toMatchObject({ status: 415 }); await expect(readInput(request("{"), createWorkspaceSchema)).rejects.toMatchObject({ status: 400 }); await expect(readInput(request(JSON.stringify({ name: "x".repeat(17000) })), createWorkspaceSchema)).rejects.toMatchObject({ status: 413 }); });
  it("accepts trimmed, strictly validated same-origin input", async () => { expect(await readInput(request('{"name":" Business "}', { Origin: "https://bizoveya.test" }), createWorkspaceSchema)).toEqual({ name: "Business" }); await expect(readInput(request('{"name":"Business","owner_id":"attacker"}'), createWorkspaceSchema)).rejects.toMatchObject({ status: 400 }); });
});
