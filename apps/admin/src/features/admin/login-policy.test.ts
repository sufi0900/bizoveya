import {describe,it,expect} from "vitest";
import {adminReturnPath} from "./login-policy";
import {adminCookieOptions,adminCookieSettings} from "@/lib/supabase/cookie-options";
describe("admin origin boundary",()=>{it("allows only known local admin return paths",()=>{for(const value of [undefined,"//evil.example","https://evil.example","/workspaces","/admin?next=https://evil.example","/admin/../login"])expect(adminReturnPath(value)).toBe("/admin");expect(adminReturnPath("/admin/audit")).toBe("/admin/audit");});it("uses a distinct host-only session cookie",()=>{expect(adminCookieOptions.name).toBe("bizoveya-admin-auth");expect(adminCookieOptions).not.toHaveProperty("domain");expect(adminCookieOptions.sameSite).toBe("lax");expect(adminCookieSettings).not.toHaveProperty("name");});});
