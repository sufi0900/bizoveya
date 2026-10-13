import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ getClaims: vi.fn(), getUser: vi.fn(), createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
import { authenticateMcp } from "./auth";
const uid = "11111111-1111-4111-8111-111111111111";
const clientId = "22222222-2222-4222-8222-222222222222";
const claims = { sub: uid, iss: "https://example.supabase.co/auth/v1", aud: "authenticated", role: "authenticated", client_id: clientId };
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-key"); vi.stubEnv("BIZOVEYA_MCP_ALLOWED_CLIENT_IDS", clientId);
  mocks.createClient.mockReturnValue({ auth: { getClaims: mocks.getClaims, getUser: mocks.getUser } });
  mocks.getClaims.mockResolvedValue({ data: { claims }, error: null }); mocks.getUser.mockResolvedValue({ data: { user: { id: uid } }, error: null });
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
const request = (authorization?: string) => new Request("https://bizoveya.vercel.app/mcp", { headers: authorization ? { Authorization: authorization } : { Cookie: "fake-browser-session" } });
describe("MCP authentication boundary", () => {
  it("fails closed before a client is configured", async () => { vi.stubEnv("BIZOVEYA_MCP_ALLOWED_CLIENT_IDS", ""); await expect(authenticateMcp(request("Bearer token"))).rejects.toMatchObject({ status: 503 }); expect(mocks.createClient).not.toHaveBeenCalled(); });
  it("never accepts browser cookies as plugin authentication", async () => { await expect(authenticateMcp(request())).rejects.toMatchObject({ status: 401 }); expect(mocks.createClient).not.toHaveBeenCalled(); });
  it.each([{ ...claims, client_id: "unknown" }, { ...claims, client_id: undefined }, { ...claims, iss: "https://evil.example/auth/v1" }, { ...claims, role: "service_role" }, { ...claims, aud: "another-resource" }, { ...claims, is_anonymous: true }])("rejects unauthorized verified claims %j", async value => { mocks.getClaims.mockResolvedValue({ data: { claims: value }, error: null }); await expect(authenticateMcp(request("Bearer token"))).rejects.toMatchObject({ status: 401 }); });
  it("rejects invalid or expired JWTs and mismatched user IDs", async () => { mocks.getClaims.mockResolvedValueOnce({ data: null, error: { message: "expired" } }); await expect(authenticateMcp(request("Bearer token"))).rejects.toMatchObject({ status: 401 }); mocks.getUser.mockResolvedValueOnce({ data: { user: { id: clientId } }, error: null }); await expect(authenticateMcp(request("Bearer token"))).rejects.toMatchObject({ status: 401 }); });
  it("uses a caller-scoped client and freshly verifies identity", async () => { expect((await authenticateMcp(request("Bearer token"))).userId).toBe(uid); expect(mocks.createClient).toHaveBeenCalledWith("https://example.supabase.co", "public-key", expect.objectContaining({ global: { headers: { Authorization: "Bearer token" } } })); expect(mocks.getUser).toHaveBeenCalledWith("token"); });
});
