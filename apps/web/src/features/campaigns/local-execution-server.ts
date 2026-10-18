import {z} from 'zod';
import type {SupabaseClient} from '@supabase/supabase-js';
import {getSite,WorkspaceError} from '@/features/workspaces/store';
import {localCustomerEnabled,isLocalOrigin,localRequest,localReceipt} from './local-execution-contracts';
export async function localCampaignRequest(db:SupabaseClient,userId:string,wid:string,sid:string,request:Request,input:z.infer<typeof localRequest>,transport:typeof fetch=fetch,env:Record<string,string|undefined>=process.env){
 if(!localCustomerEnabled(env))throw new WorkspaceError(404,'Local execution is disabled.');
 const origin=request.headers.get('origin'),host=request.headers.get('host')??new URL(request.url).host;
 if(!origin||!isLocalOrigin(origin)||!isLocalOrigin(request.url)||new URL(origin).host!==host||new URL(request.url).host!==host)throw new WorkspaceError(403,'Open the customer app on localhost.');
 const {workspace}=await getSite(db,userId,wid,sid);
 if(workspace.role!=='owner')throw new WorkspaceError(403,'Only the site workspace owner can use this local pilot.');
 const history=await db.rpc('bz_campaign_generation_history',{p_workspace_id:wid,p_site_id:sid});
 if(history.error||!Array.isArray(history.data)||!history.data.some(r=>r.id===input.id))throw new WorkspaceError(403,'Choose a snapshot belonging to this site.');
 const {action,...body}=input;
 // Fixed local admin, same signed-in identity via shared localhost cookies. No service key,
 // public tunnel, request-supplied endpoint or redirect. Admin rechecks MFA and ownership.
 let response:Response;
 try{response=await transport(`http://localhost:3001/api/admin/local-testing${action==='run'?'':`/${action}`}`,{method:'POST',redirect:'error',cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(45*1000)]),headers:{'Content-Type':'application/json','Origin':'http://localhost:3001','Host':'localhost:3001','Cookie':request.headers.get('cookie')??''},body:JSON.stringify(body)});}catch{throw new WorkspaceError(503,'Local admin did not acknowledge this request. The worker may still be running. Keep admin on port3001 and read the saved receipt before authorizing another run.');}
 if(!response.ok){const code=await response.json().catch(()=>({}));const messages:Record<string,string>={RECEIPT_NOT_READY:'Receipt is not available yet. Reading does not start a model.',MFA_REQUIRED:'Open localhost:3001/admin and verify your authenticator, then read the existing receipt.',SIGN_IN_REQUIRED:'Sign in to local admin with the same owner account and localhost hostname.',SNAPSHOT_UNAVAILABLE:'Snapshot is unavailable. Use an owned inactive snapshot and verify migration077.',LOCAL_BUSY:'A local run is active or interrupted. Read its receipt before starting another.',REVIEW_CONFLICT:'Review changed. Read the existing receipt before reviewing again.',QUALITY_BLOCKED:'Quality has not approved this real local draft. Request changes instead.'};throw new WorkspaceError(response.status>=400&&response.status<600?response.status:503,messages[code.code]??'Local admin rejected this request. Check local admin configuration and the saved receipt.');}
 const reader=response.body?.getReader();if(!reader)throw new WorkspaceError(503,'Local receipt is unavailable.');let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>1024*1024){await reader.cancel();throw new WorkspaceError(503,'Local receipt exceeds the display limit.');}chunks.push(r.value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let n=0;for(const c of chunks){bytes.set(c,n);n+=c.length;}
 const parsed=localReceipt.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
 if(!parsed.success||parsed.data.snapshotId!==input.id||parsed.data.requestId!==input.requestId||parsed.data.mode!==input.mode)throw new WorkspaceError(503,'Local receipt does not match this request.');
 return parsed.data;
}
