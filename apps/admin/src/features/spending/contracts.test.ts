import {describe,it,expect} from 'vitest';
import {toMicros,pricingSchema,spendingInputSchema,reservationMicros} from './contracts';
import {checkSpending} from './store';
describe('spending controls',()=>{
 it('converts money exactly',()=>{expect(toMicros('0.000001')).toBe(1);expect(toMicros('1.25')).toBe(1250000)});
 it.each(['-1','1e2','0.0000001','1000.01','NaN'])('rejects ambiguous amount %s',v=>expect(()=>toMicros(v)).toThrow());
 const document={enabled:true,inputRateMicros:1,outputRateMicros:1,requestFeeMicros:0,dailyLimitMicros:100,runLimitMicros:10,validUntil:'2026-10-10T00:00:00Z',source:'https://example.com',reviewed:true as const};
 it('matches SQL conservative reservation',()=>expect(reservationMicros({...document,inputRateMicros:1000000,outputRateMicros:1000000})).toBe(5280));
 it('rejects inverted budgets',()=>expect(pricingSchema.safeParse({...document,runLimitMicros:101}).success).toBe(false));
 it('requires reviewed consent and immutable revision inputs',()=>{expect(spendingInputSchema.safeParse({action:'save',profileId:'11111111-1111-4111-8111-111111111111',profileRevision:1,expectedVersion:0,document,reason:'Confirmed pricing evidence',reviewed:false}).success).toBe(false)});
 it('rejects unknown command fields',()=>expect(pricingSchema.safeParse({...document,apiKey:'secret'}).success).toBe(false));
 it('maps budget denial and missing setup',()=>{expect(()=>checkSpending({message:'bz_daily_budget'})).toThrow('remaining daily allowance');expect(()=>checkSpending({code:'PGRST202'})).toThrow('migration 032')});
});
