import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {privateTemplateRecordSchema,applyPrivateTemplate} from './private-template-contracts';
import {starterVisuals} from './visual-contracts';
import {visualSource} from './visuals.fixture';

it('accepts real migrated SQL records and pins an earlier recipe after save/archive',()=>{
 const directory=mkdtempSync(join(tmpdir(),'bizoveya-template-contract-'));
 try {
  const file=join(directory,'records.json'),root=resolve(process.cwd(),'../..');
  execFileSync(process.execPath,[join(root,'tools/phase1-verification/run-visual-sql.mjs'),'--contracts',file],{cwd:root,timeout:30000,stdio:'pipe'});
  const records=(JSON.parse(readFileSync(file,'utf8')) as unknown[]).map(value=>privateTemplateRecordSchema.parse(value));
  expect(records.length).toBeGreaterThanOrEqual(4);
  const latest=records.find(record=>!record.archived&&record.versions.length===2)!;
  expect(latest).toBeDefined();
  const draft=starterVisuals(visualSource(),'Source brand');
  const applied=applyPrivateTemplate(latest,latest.creatorId,{templateId:latest.templateId,version:1,renderer:'campaign-scenes-v2'},draft);
  expect(applied.document.brand.accent).toBe('#5271FF');
  expect(latest.versions[1].recipe.brand.accent).toBe('#ff0000');
  expect(applied.document.pins).toEqual(draft.pins);
  const archived=records.find(record=>record.archived)!;
  expect(archived.versions).toEqual(latest.versions);
  expect(()=>applyPrivateTemplate(archived,archived.creatorId,applied.templateReference,draft)).toThrow('unavailable');
 } finally {rmSync(directory,{recursive:true,force:true});}
},35000);
