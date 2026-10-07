import {describe,it,expect,vi,afterEach} from 'vitest';
import type {OutputRecord} from './output-contracts';
import {starterCampaign} from './contracts';
import {campaignDownload,generatedDownload,downloadDraft} from './export';
const id='11111111-1111-4111-8111-111111111111',citation={sourceId:id,sourceVersion:1,factId:'f1'};
function record():OutputRecord{return {id,campaignId:id,campaignVersion:1,status:'succeeded',reviews:[],output:{schema:'campaign-generation-output-v1',stages:{coordinator:{schema:'campaign-plan-v1',topic:'AI workflow',audience:'Founders',objective:'Explain workflow',requiredFacts:[citation],channelNotes:{blog:'Explain',pinterest:'Summarize',linkedin:'Discuss'}},content:{schema:'campaign-drafts-v1',blog:{title:'Draft',summary:'Summary',body:'<script>alert("unsafe")</script>',citations:[citation]},pinterest:{title:'Pin',description:'Pin description',altText:'Suggested alt text',citations:[citation]},linkedin:{post:'LinkedIn draft',citations:[citation]}},quality:{schema:'campaign-quality-v1',approved:true,issues:[],checkedCitations:[citation]}}}};}
describe('private draft downloads',()=>{
 afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
 it('labels unsaved text without claiming a saved revision or AI generation',()=>{
  const packet=campaignDownload({...starterCampaign,blog:'Edited locally'},'',0,true),data=JSON.parse(packet.text);
  expect(data.campaignId).toBeNull();expect(data.savedVersion).toBeNull();expect(data.includesUnsavedEdits).toBe(true);
  expect(data.document.blog).toBe('Edited locally');expect(packet.filename).toBe('bizoveya-campaign-unsaved-v0-unsaved.json');
 });
 it('preserves saved campaign version and all three channels',()=>{
  const doc={...starterCampaign,blog:'Blog text',pinterest:'Pin text',linkedin:'LinkedIn text'};
  const data=JSON.parse(campaignDownload(doc,id,5,false).text);
  expect(data.document).toEqual(doc);expect(data.savedVersion).toBe(5);expect(data.includesUnsavedEdits).toBe(false);
 });
 it('exports generated provenance, citations, QA and history but no unlisted secret properties',()=>{
  const r=record();r.reviews=[{version:1,decision:'changes_requested',reason:'Review unsupported claims',occurredAt:'2026-10-07T10:00:00Z'}];
  const data=JSON.parse(generatedDownload({...r,apiKey:'private-secret'} as OutputRecord).text);
  expect(data.snapshotId).toBe(id);expect(data.output).toEqual(r.output);expect(data.reviews).toEqual(r.reviews);
  expect(data.apiKey).toBeUndefined();expect(data.status).toBe('succeeded');expect(data.notice).toContain('do not publish');
 });
 it('creates a local JSON file and releases the temporary object URL',()=>{
  vi.useFakeTimers();const click=vi.fn(),remove=vi.fn(),appendChild=vi.fn(),revokeObjectURL=vi.fn();
  const link={href:'',download:'',click,remove};
  vi.stubGlobal('document',{createElement:vi.fn(()=>link),body:{appendChild}});
  vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:private-draft'),revokeObjectURL});
  downloadDraft({filename:'draft.json',text:'{}'});
  expect(link.download).toBe('draft.json');expect(link.href).toBe('blob:private-draft');expect(click).toHaveBeenCalledOnce();expect(remove).toHaveBeenCalledOnce();
  vi.runAllTimers();expect(revokeObjectURL).toHaveBeenCalledWith('blob:private-draft');
 });
 it('cleans up even if the browser rejects the download',()=>{
  vi.useFakeTimers();const remove=vi.fn(),revokeObjectURL=vi.fn();
  vi.stubGlobal('document',{createElement:()=>({click:()=>{throw Error('blocked');},remove}),body:{appendChild:vi.fn()}});
  vi.stubGlobal('URL',{createObjectURL:()=> 'blob:private-draft',revokeObjectURL});
  expect(()=>downloadDraft({filename:'draft.json',text:'{}'})).toThrow('blocked');expect(remove).toHaveBeenCalledOnce();vi.runAllTimers();expect(revokeObjectURL).toHaveBeenCalledOnce();
 });
});
