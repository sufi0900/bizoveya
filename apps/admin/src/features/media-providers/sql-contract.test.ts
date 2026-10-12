import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {mediaInventorySchema} from '@bizoveya/agent-contract';
it('validates the actual SQL qualification and sanitized receipts against shared app contracts',()=>{
 const directory=mkdtempSync(path.join(tmpdir(),'bz-media-contract-'));
 try{const output=path.join(directory,'fixture.json');execFileSync(process.execPath,['tools/phase1-verification/run-visual-sql.mjs','--media-contract',output],{cwd:path.resolve(process.cwd(),'../..'),timeout:60000});const result=mediaInventorySchema.parse(JSON.parse(readFileSync(output,'utf8')));expect(result.capabilities).toHaveLength(2);expect(result.requests.some(r=>r.providerStarted&&r.spendingState==='reconciled')).toBe(true);expect(result.requests.some(r=>r.status==='cancelled'&&r.chargedMicros===0)).toBe(true);expect(JSON.stringify(result)).not.toContain('"claim"');}finally{rmSync(directory,{recursive:true,force:true});}
},60000);
