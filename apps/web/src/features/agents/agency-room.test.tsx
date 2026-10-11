import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgencyRoom } from './agency-room';
import { agencyRecordSchema } from './agency-contracts';
const id='11111111-1111-4111-8111-111111111111';
const base={id,kind:'request',version:2,status:'proposed',document:{instruction:'Approved facts only.',channels:['pinterest']},snapshot:{},createdAt:'now',events:[]};
const endpoint='/api/workspaces/w/sites/s/agency';
describe('saved campaign handoff presentation',()=>{
 it('links to the saved campaign and displays immutable source lineage for a read-only member',()=>{
  const record=agencyRecordSchema.parse({...base,handoff:{campaignId:id,sourceVersion:1,title:'Private',document:{title:'Private',brief:'Approved',blog:'',pinterest:'',linkedin:''},actorId:id,createdAt:'now'}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[record],owner:false,endpoint}));
  expect(html).toContain(`/workspaces/w/sites/s/campaigns/${id}`);expect(html).toContain('Campaign prepared from request v1');expect(html).not.toContain('Prepare campaign from this request');expect(html).toContain('<fieldset disabled=""');
 });
 it('offers only proposed requests for preparation and explains the separate execution gate',()=>{
  const render=(status:string)=>renderToStaticMarkup(createElement(AgencyRoom,{initial:[agencyRecordSchema.parse({...base,status})],owner:true,endpoint}));
  expect(render('proposed')).toContain('Prepare campaign from this request');
  expect(render('cancelled')).not.toContain('Prepare campaign from this request');
  expect(render('deferred')).not.toContain('Prepare campaign from this request');
  expect(render('proposed')).toContain('Preparing a campaign does not run agents');
 });
});

describe('linked generation presentation',()=>{
 const handoff={campaignId:id,sourceVersion:1,title:'Private',document:{title:'Private',brief:'Approved',blog:'',pinterest:'',linkedin:''},actorId:id,createdAt:'now'};
 it('requires review of the displayed current campaign version and keeps dispatch separate',()=>{
  const record=agencyRecordSchema.parse({...base,handoff,executionPreparation:{campaignVersion:4,campaignTitle:'Edited private brief'}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[record],owner:true,endpoint}));
  expect(html).toContain('Edited private brief');expect(html).toContain('linked campaign v4');expect(html).toContain('Prepare linked generation snapshot');expect(html).toContain('keep execution separately authorized');
 });
 it('shows actual persisted run state for read-only members without another preparation button',()=>{
  const record=agencyRecordSchema.parse({...base,handoff,execution:{sourceVersion:2,actorId:id,createdAt:'now',run:{id,campaignId:id,campaignVersion:1,status:'failed',createdAt:'now',startedAt:'then',finishedAt:'now',stageCount:3,outputAvailable:false}}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[record],owner:false,endpoint}));
  expect(html).toContain('failed');expect(html).toContain('Cancelling this proposal does not cancel this run');expect(html).not.toContain('Prepare linked generation snapshot');
 });
});
