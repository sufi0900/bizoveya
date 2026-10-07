import {APICallError,NoObjectGeneratedError} from 'ai';
export const usageToken=(n:number|undefined)=>Number.isInteger(n)&&n!>=0&&n!<=2000000?n!:null;
// Inspect bounded provider JSON only in memory. Persist fixed labels, never messages,
// field values, raw bodies, request URLs, credentials or user text.
function rejectionDetail(error:unknown):string|null{
 if(!APICallError.isInstance(error)||!error.responseBody||error.responseBody.length>16384)return null;
 try{
  const body=JSON.parse(error.responseBody);const detail=body?.error;
  if(!detail||typeof detail!=='object')return null;
  const message=typeof detail.message==='string'?detail.message.slice(0,4096):'';
  if(error.statusCode===400){
   if(detail.status==='FAILED_PRECONDITION')return 'provider_precondition_failed';
   if(/response[_ ]?(json[_ ]?)?schema|generation_config\.response|generationConfig\.response|structured.?output/i.test(message))return 'provider_schema_rejected';
   if(/API key (?:not valid|expired|invalid)/i.test(message))return 'provider_key_invalid';
  }
  if(error.statusCode===403&&/reported as leaked/i.test(message))return 'provider_key_blocked';
 }catch{/* Unrecognized or malformed response remains generic. */}
 return null;
}
export function providerFailure(error:unknown,aborted:boolean){
 if(NoObjectGeneratedError.isInstance(error))return {output:null,error:error.finishReason==='length'?'output_limit':'structured_output_invalid',inputTokens:usageToken(error.usage?.inputTokens),outputTokens:usageToken(error.usage?.outputTokens)};
 const status=APICallError.isInstance(error)?error.statusCode:undefined;
 const code=aborted?'timeout':rejectionDetail(error)??(status===429?'rate_limited':status===402?'provider_payment_required':status===401||status===403?'provider_access_denied':status===400?'provider_request_rejected':status!==undefined&&status>=500?'provider_unavailable':'provider_or_output_error');
 return {output:null,error:code,inputTokens:null,outputTokens:null};
}
