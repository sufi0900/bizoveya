import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { WorkspaceError } from '@/features/workspaces/store';

// Dedicated trusted Storage client. Never import this module into a client component.
export function createMediaServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.BIZOVEYA_MEDIA_SERVICE_KEY;
  if (!url || !key) throw new WorkspaceError(503, 'Private media uploads need the server-only BIZOVEYA_MEDIA_SERVICE_KEY. Existing drafts are unchanged.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000) }) },
  });
}
