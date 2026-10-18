import {describe,it,expect,vi,afterEach} from 'vitest';
vi.mock('../admin/access',async()=>{const a=await vi.importActual('../admin/access');return {...a,adminSession:vi.fn().mockResolvedValue({db:{},userId:'owner'})};});
vi.mock('./service',()=>({runLocalRehearsal:vi.fn().mockResolvedValue({status:'synthetic_workflow_checked'})}));
import {POST} from '@/app/api/admin/local-testing/route';
import {runLocalRehearsal} from './service';
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
function request(origin='http://localhost:3001',host='localhost:3001'){return new Request('http://localhost:3001/api/admin/local-testing',{method:'POST',headers:{Origin:origin,Host:host,'Content-Type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),requestId:crypto.randomUUID(),mode:'fixture',reason:'Synthetic test reason',reviewed:true})});}
describe('local route boundary',()=>{
 it('is absent from production even if opted in',async()=>{vi.stubEnv('NODE_ENV','production');vi.stubEnv('BIZOVEYA_ENABLE_LOCAL_TESTING','true');expect((await POST(request())).status).toBe(404);expect(runLocalRehearsal).not.toHaveBeenCalled();});
 it.each(['https://evil.com','http://localhost.evil.com',''])('rejects cross origin or absent origin %s',async origin=>{vi.stubEnv('NODE_ENV','development');vi.stubEnv('BIZOVEYA_ENABLE_LOCAL_TESTING','true');vi.stubEnv('VERCEL','');expect((await POST(request(origin))).status).toBe(403);expect(runLocalRehearsal).not.toHaveBeenCalled();});
 it('rejects forwarded-host substitution',async()=>{vi.stubEnv('NODE_ENV','development');vi.stubEnv('BIZOVEYA_ENABLE_LOCAL_TESTING','true');vi.stubEnv('VERCEL','');expect((await POST(request('http://localhost:3002','localhost:3002'))).status).toBe(403);});
 it('allows reviewed localhost requests only',async()=>{vi.stubEnv('NODE_ENV','development');vi.stubEnv('BIZOVEYA_ENABLE_LOCAL_TESTING','true');vi.stubEnv('VERCEL','');expect((await POST(request())).status).toBe(200);expect(runLocalRehearsal).toHaveBeenCalledTimes(1);});
});
