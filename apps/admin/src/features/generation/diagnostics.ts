import {APICallError,NoObjectGeneratedError} from 'ai';
export const usageToken=(n:number|undefined)=>Number.isInteger(n)&&n!>=0&&n!<=2000000?n!:null;
export function providerFailure(error:unknown,aborted:boolean){
 if(NoObjectGeneratedError.isInstance(error))return {output:null,error:error.finishReason==='length'?'output_limit':'structured_output_invalid',inputTokens:usageToken(error.usage?.inputTokens),outputTokens:usageToken(error.usage?.outputTokens)};
 const status=APICallError.isInstance(error)?error.statusCode:undefined;
 const code=aborted?'timeout':status===429?'rate_limited':status===401||status===403?'provider_access_denied':status===400?'provider_request_rejected':status!==undefined&&status>=500?'provider_unavailable':'provider_or_output_error';
 return {output:null,error:code,inputTokens:null,outputTokens:null};
}
