import {describe,it,expect} from 'vitest';
import {testExplanation} from './diagnostics';
describe('safe connectivity explanations',()=>{
 it('distinguishes historical uncertainty from proven no-dispatch',()=>{expect(testExplanation('preflight_failed')).toContain('No provider request');expect(testExplanation('provider_error')).toContain('cannot establish');});
 it('never echoes unknown provider strings',()=>expect(testExplanation('secret-value')).not.toContain('secret-value'));
});
