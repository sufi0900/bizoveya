import {z} from 'zod';
export const rehearsalInput=z.object({id:z.uuid(),requestId:z.uuid(),mode:z.enum(['ollama','fixture']),reason:z.string().trim().min(10).max(300),reviewed:z.literal(true)}).strict();
export type RehearsalInput=z.infer<typeof rehearsalInput>;
export function localTestingEnabled(env:Record<string,string|undefined>){
 return env.NODE_ENV==='development'&&!env.VERCEL&&env.BIZOVEYA_ENABLE_LOCAL_TESTING==='true';
}
export function loopbackOrigin(value:string){
 try{const u=new URL(value);return u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)&&!u.username&&!u.password;}catch{return false;}
}
