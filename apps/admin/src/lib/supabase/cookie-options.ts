// No Domain attribute: host-only. Name belongs to the storage key, not individual chunk options.
export const adminCookieSettings = { path: "/", sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };
export const adminCookieOptions = { ...adminCookieSettings, name: "bizoveya-admin-auth" };
