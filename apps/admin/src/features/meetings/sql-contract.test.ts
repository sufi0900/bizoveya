import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {deliveryInputSchema,deliveryQueueSchema,packetSchema,receiptSchema} from './contracts';
import {receivePacket} from './delivery';
it('receives the actual migrated SQL packet and validates its durable receipt and queue',()=>{
 const directory=mkdtempSync(path.join(tmpdir(),'bizoveya-meeting-contract-')),output=path.join(directory,'fixture.json');
 try{
  execFileSync(process.execPath,['tools/phase1-verification/run-visual-sql.mjs','--meeting-contract',output],{cwd:path.resolve(process.cwd(),'../..'),timeout:60000});
  const fixture=JSON.parse(readFileSync(output,'utf8')),input=deliveryInputSchema.parse(fixture.input),packet=packetSchema.parse(fixture.packet),receipt=receiptSchema.parse(fixture.receipt),queue=deliveryQueueSchema.parse(fixture.queue);
  expect(receivePacket(packet,input,Date.parse(packet.claimExpiresAt)-1)).toBe('acknowledged');expect(receivePacket(packet,input,Date.parse(packet.claimExpiresAt))).toBe('declined');expect(receipt.participants[0].state).toBe('acknowledged');expect(queue[0].participants[0].claimId).toBe(input.claimId);
 }finally{rmSync(output,{force:true});rmdirSync(directory);}
},60000);
