import {describe,it,expect} from 'vitest';
import {APICallError,NoObjectGeneratedError} from 'ai';
import {providerFailure,usageToken} from './diagnostics';
import {diagnosticMessage} from './diagnostic-messages';
import {queueSchema} from './dispatch-contracts';
describe('safe generation diagnostics',()=>{
 it.each([[429,'rate_limited'],[403,'provider_access_denied'],[400,'provider_request_rejected'],[503,'provider_unavailable']])('classifies HTTP %s without leaking response', (status,code)=>{
 const error=new APICallError({message:'secret',url:'https://example.invalid',requestBodyValues:{key:'secret'},statusCode:status,responseBody:'private content'});
 const result=providerFailure(error,false);expect(result.error).toBe(code);expect(JSON.stringify(result)).not.toMatch(/secret|private content/);expect(result.inputTokens).toBeNull();
 });
 it('distinguishes timeout without inventing usage',()=>expect(providerFailure(Error('private'),true)).toMatchObject({error:'timeout',inputTokens:null,outputTokens:null}));
 it('preserves SDK usage on structured output failure',()=>{
 const error=new NoObjectGeneratedError({text:'private output',response:{id:'synthetic',timestamp:new Date(),modelId:'synthetic'},usage:{inputTokens:100,outputTokens:50} as never,finishReason:'length'});
 expect(providerFailure(error,false)).toEqual({output:null,error:'output_limit',inputTokens:100,outputTokens:50});
 });
 it('does not guess the historical generic failure cause',()=>expect(diagnosticMessage('provider_or_output_error')).toContain('cannot distinguish'));
 it('rejects invalid token counts',()=>{for(const n of [undefined,-1,Infinity,1.2,2000001])expect(usageToken(n)).toBeNull();expect(usageToken(0)).toBe(0);});
 it('allows the pre038 queue without pretending stages exist',()=>{
 const id='11111111-1111-4111-8111-111111111111';expect(queueSchema.parse([{id,campaignId:id,siteId:id,title:'test',campaignVersion:1,status:'failed',createdAt:'date',outputAvailable:false,leaseActive:false,stale:false}])[0].stages).toEqual([]);
 });
});
