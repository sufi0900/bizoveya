import { z } from "zod";

// Supabase authorization request IDs are opaque strings, not user/client UUIDs.
export const authorizationIdSchema = z.string().min(16).max(256).regex(/^[A-Za-z0-9_-]+$/);
