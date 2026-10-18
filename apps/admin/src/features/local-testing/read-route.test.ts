import {describe,it,expect,vi,afterEach} from 'vitest';
import {createHash} from 'node:crypto';
vi.mock('../admin/access',async()=>{const a=await vi.importActual('../admin/access');return {...a,adminSession:vi.fn()};});
vi.mock('node:fs/promises',()=>({readFile:vi.fn()}));
import {readFile} from 'node:fs/promises';import {adminSession} from '../admin/access';
import {POST} from '@/app/api/admin/local-testing/read/route';
const input={id:'11111111-1111-4111-8111-111111111111',requestId:'22222222-2222-4222-8222-222222222222',mode:'ollama',reason:'Read without rerunning the model',reviewed:true};
function request(origin='http://localhost:3001'){return new Request('http://localhost:3001/api/admin/local-testing/read',{method:'POST',headers:{Origin:origin,Host:'localhost:3001','Content-Type':'application/json'},body:JSON.stringify(input)});}
function setup(){vi.stubEnv('NODE_ENV','development');vi.stubEnv('VERCEL','');vi.stubEnv('BIZOVEYA_ENABLE_LOCAL_TESTING','true');vi.mocked(adminSession).mockResolvedValue({db:{rpc:vi.fn().mockResolvedValue({error:null,data:{}})},userId:'owner'} as never);}
afterEach(()=>{vi.unstubAllEnvs();vi.resetAllMocks();});
describe('read-only receipt recovery endpoint',()=>{
 it('returns a saved checkpoint without importing or invoking the runner',async()=>{setup();vi.mocked(readFile).mockResolvedValue(JSON.stringify({status:'running',fingerprint:createHash('sha256').update(JSON.stringify(input)).digest('hex')}));expect((await POST(request())).status).toBe(200);expect(readFile).toHaveBeenCalledTimes(1);});
 it('returns not-ready for a missing receipt, never starting a new run',async()=>{setup();vi.mocked(readFile).mockRejectedValue(Error('ENOENT'));const r=await POST(request());expect(r.status).toBe(404);expect(await r.json()).toMatchObject({code:'RECEIPT_NOT_READY'});});
 it('rejects a changed request fingerprint',async()=>{setup();vi.mocked(readFile).mockResolvedValue(JSON.stringify({fingerprint:'changed'}));expect((await POST(request())).status).toBe(409);});
 it('is disabled in production before touching identity or disk',async()=>{setup();vi.stubEnv('NODE_ENV','production');expect((await POST(request())).status).toBe(404);expect(adminSession).not.toHaveBeenCalled();expect(readFile).not.toHaveBeenCalled();});
 it('rejects a foreign origin',async()=>{setup();expect((await POST(request('https://evil.example'))).status).toBe(403);expect(readFile).not.toHaveBeenCalled();});
});
