// Optional operator maintenance; no deployment settings or schedule are installed by this tool.
// Dry run performs no request. --apply claims at most eight tracked orphan paths and removes them via Storage API.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.BIZOVEYA_MEDIA_SERVICE_KEY;
if (!process.argv.includes('--apply')) { console.log('Dry run: no requests. Use --apply only with authorized maintenance credentials after migration046.'); process.exit(0); }
if (!url || !key) throw new Error('Configure NEXT_PUBLIC_SUPABASE_URL and server-only BIZOVEYA_MEDIA_SERVICE_KEY.');
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
async function request(path, method, body) {
 const response = await fetch(new URL(path, url), { method, headers, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
 if (!response.ok) throw new Error(`Maintenance request failed (${response.status}); credentials and paths are not logged.`);
 const text = await response.text(); return text ? JSON.parse(text) : null;
}
const attempts = await request('/rest/v1/rpc/bz_claim_media_cleanup_global', 'POST', {});
if (!Array.isArray(attempts) || attempts.length > 8) throw new Error('Invalid cleanup claim.');
let removed = 0;
for (const item of attempts) {
 if (!/^[0-9a-f-]{36}$/.test(item.id) || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\/[1-9][0-9]?\/[a-f0-9]{64}\.(png|jpg)$/.test(item.path)) throw new Error('Invalid cleanup contract.');
 await request('/storage/v1/object/campaign-private-media', 'DELETE', { prefixes: [item.path] });
 await request('/rest/v1/rpc/bz_finish_media_cleanup_global', 'POST', { p_attempt: item.id }); removed++;
}
console.log(JSON.stringify({ removed, scope: 'Tracked orphan bytes only. Saved references retained. Repeat maintenance if a later batch remains.' }));
