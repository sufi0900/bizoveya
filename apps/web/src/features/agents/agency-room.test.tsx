import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgencyRoom } from './agency-room';
import { agencyRecordSchema } from './agency-contracts';
const id='11111111-1111-4111-8111-111111111111';
const base={id,kind:'request',version:2,status:'proposed',document:{instruction:'Approved facts only.',channels:['pinterest']},snapshot:{},createdAt:'now',events:[]};
const endpoint='/api/workspaces/w/sites/s/agency';
describe('meeting decision distribution presentation',()=>{
 const meeting={...base,kind:'meeting',status:'decision-recorded',document:{action:'meeting',id,agenda:'Discuss private drafts.',mode:'announcement',participants:['content'],reviewed:true,inputMode:'text'}};
 it('requires a recorded decision and explicit version review before distribution',()=>{
  const render=(status:string)=>renderToStaticMarkup(createElement(AgencyRoom,{initial:[agencyRecordSchema.parse({...meeting,status})],owner:true,endpoint}));
  expect(render('decision-recorded')).toContain('Distribution instruction');expect(render('decision-recorded')).toContain('I reviewed meeting v2');expect(render('decision-recorded')).toContain('Create request from decision');
  for(const status of ['proposed','deferred','cancelled']) expect(render(status)).not.toContain('Create request from decision');
 });
 it('projects immutable lineage after refresh without another distribution control',()=>{
  const requestId='22222222-2222-4222-8222-222222222222';
  const record=agencyRecordSchema.parse({...meeting,version:3,meetingDistribution:{meetingId:id,requestId,sourceVersion:2,agenda:meeting.document,decision:'Private drafts only.',instruction:'Approved private drafts.',command:{action:'request',id:requestId,instruction:'Approved private drafts.',channels:['blog'],reviewed:true,inputMode:'text'},actorId:id,createdAt:'now'}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[record],owner:false,endpoint}));
  expect(html).toContain('Reviewed meeting v2 linked to private request');expect(html).toContain(requestId);expect(html).toContain('No agent attendance or acknowledgement is inferred');expect(html).not.toContain('Create request from decision');
 });
 it('offers reviewed invitations after distribution and projects only recorded receipt states',()=>{
  const requestId='22222222-2222-4222-8222-222222222222';
  const lineage={meetingId:id,requestId,sourceVersion:2,agenda:meeting.document,decision:'Private drafts only.',instruction:'Approved private drafts.',command:{action:'request',id:requestId,instruction:'Approved private drafts.',channels:['blog'],reviewed:true,inputMode:'text'},actorId:id,createdAt:'now'};
  const prepared=agencyRecordSchema.parse({...meeting,version:3,meetingDistribution:lineage});
  expect(renderToStaticMarkup(createElement(AgencyRoom,{initial:[prepared],owner:true,endpoint}))).toContain('Prepare participant invitations');
  const invited=agencyRecordSchema.parse({...prepared,version:4,meetingInvitations:{meetingId:id,requestId,sourceVersion:3,rosterVersion:2,actorId:id,createdAt:'now',participants:[{role:'content',agentId:requestId,agentVersion:5,state:'acknowledged',claimExpiresAt:'later',respondedAt:'now',note:'Packet received.'}]}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[invited],owner:false,endpoint}));
  expect(html).toContain('content · acknowledged');expect(html).toContain('not attendance, understanding or task completion');expect(html).not.toContain('No agent attendance or acknowledgement recorded');expect(html).not.toContain('Prepare participant invitations');
 });
});
describe('bounded deliberation presentation',()=>{
 it('offers limits only after every pinned participant acknowledged and labels a saved plan as non-execution',()=>{
  const requestId='22222222-2222-4222-8222-222222222222';
  const document={action:'meeting',id,agenda:'Compare safe private options.',mode:'deliberation',participants:['content'],reviewed:true,inputMode:'text'};
  const meetingDistribution={meetingId:id,requestId,sourceVersion:2,agenda:document,decision:'Prepare options only.',instruction:'Use approved context.',command:{action:'request',id:requestId,instruction:'Use approved context.',channels:['blog'],reviewed:true,inputMode:'text'},actorId:id,createdAt:'now'};
  const meetingInvitations={meetingId:id,requestId,sourceVersion:3,rosterVersion:2,actorId:id,createdAt:'now',participants:[{role:'content',agentId:requestId,agentVersion:5,state:'acknowledged',claimExpiresAt:'later',respondedAt:'now',note:'Packet received.'}]};
  const ready=agencyRecordSchema.parse({...base,kind:'meeting',version:4,status:'decision-recorded',document,meetingDistribution,meetingInvitations});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[ready],owner:true,endpoint}));
  expect(html).toContain('Prepare bounded deliberation plan');expect(html).toContain('Future execution cost ceiling');expect(html).toContain('makes no model call');
  const plan={id:requestId,meetingId:id,requestId,sourceVersion:4,rosterVersion:2,rounds:1,maxInputTokensPerTurn:1200,maxOutputTokensPerTurn:600,maxTotalCostCents:5,actorId:id,createdAt:'now',turns:[{ordinal:1,round:1,role:'content',agentId:requestId,agentVersion:5,purpose:'Propose an approved-context draft direction.',state:'planned'}]};
  const saved=agencyRecordSchema.parse({...ready,version:5,meetingDeliberation:plan});
  const projected=renderToStaticMarkup(createElement(AgencyRoom,{initial:[saved],owner:false,endpoint}));
  expect(projected).toContain('1 planned turns');expect(projected).toContain('$0.05');expect(projected).toContain('Planned is not participation or execution');expect(projected).not.toContain('Prepare bounded deliberation plan');
 });
});
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
 it('projects the durable assistant task and expired-dispatch warning without execution controls',()=>{
  const record=agencyRecordSchema.parse({...base,handoff,execution:{sourceVersion:2,actorId:id,createdAt:'now',run:{id,campaignId:id,campaignVersion:1,status:'running',createdAt:'now',startedAt:'then',finishedAt:null,stageCount:3,outputAvailable:false}},executionTask:{recordId:id,runId:id,version:2,state:'recovery_required',lastReason:'Provider reconciliation is required.',createdAt:'now',updatedAt:'now',leaseActive:false,leaseExpired:true,events:[]}});
  const html=renderToStaticMarkup(createElement(AgencyRoom,{initial:[record],owner:false,endpoint}));
  expect(html).toContain('Assistant task: recovery_required');expect(html).toContain('expired dispatch requires admin inspection');expect(html).toContain('Provider reconciliation is required.');expect(html).not.toContain('Reconcile interrupted task');
 });
});
