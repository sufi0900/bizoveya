import { describe, expect, it } from "vitest";
import { authorizationIdSchema } from "./oauth-contracts";
describe("opaque OAuth request IDs", () => {
 it("accepts opaque Supabase IDs and UUIDs", () => { expect(authorizationIdSchema.safeParse("example_authorization-request12345").success).toBe(true); expect(authorizationIdSchema.safeParse("11111111-1111-4111-8111-111111111111").success).toBe(true); });
 it.each(["", "short", "a".repeat(257), "https://example.com/request", "bad/request?query=abc", "a".repeat(20)+"\n"])("rejects unsafe or unbounded input", value => { expect(authorizationIdSchema.safeParse(value).success).toBe(false); });
});
