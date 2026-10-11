import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../workspaces/store', async original => ({ ...await original<typeof import('../workspaces/store')>(), getSite: vi.fn() }));
import { getSite } from '../workspaces/store';
import { commandAgency, handoffAgency, loadAgency, prepareAgencyGeneration, distributeMeetingRequest, inviteMeetingParticipants } from './agency-store';
const actor = '11111111-1111-4111-8111-111111111111', wid = '22222222-2222-4222-8222-222222222222', sid = '33333333-3333-4333-8333-333333333333';
const command = { action: 'request' as const, id: actor, instruction: 'Prepare private drafts.', channels: ['blog' as const], reviewed: true as const, inputMode: 'text' as const };
function fixture(data: unknown = [], error: unknown = null) { const rpc = vi.fn(async () => ({ data, error })); return { rpc, db: { rpc } as unknown as SupabaseClient }; }
beforeEach(() => vi.mocked(getSite).mockResolvedValue({ workspace: { role: 'owner' }, site: { id: sid } } as never));
describe('agency server authorization', () => {
  it('checks membership before reading and refuses malformed inventory', async () => {
    const f = fixture(); expect((await loadAgency(f.db, actor, wid, sid)).records).toEqual([]);
    expect(getSite).toHaveBeenCalledWith(f.db, actor, wid, sid);
    await expect(loadAgency(fixture([{}]).db, actor, wid, sid)).rejects.toThrow();
  });
  it('prevents editors from saving proposals before an RPC', async () => {
    vi.mocked(getSite).mockResolvedValue({ workspace: { role: 'editor' } } as never);
    const f = fixture(); await expect(commandAgency(f.db, actor, wid, sid, command)).rejects.toMatchObject({ status: 403 }); expect(f.rpc).not.toHaveBeenCalled();
  });
  it('keeps setup, stale revision and missing proposal failures actionable', async () => {
    for (const [error, status] of [[{ code: 'PGRST202' }, 503], [{ message: 'bz_conflict' }, 409], [{ message: 'bz_agency_unavailable' }, 404]] as const) await expect(commandAgency(fixture(null, error).db, actor, wid, sid, command)).rejects.toMatchObject({ status });
  });
});

describe('reviewed meeting request distribution', () => {
 const input={id:actor,requestId:wid,expectedVersion:2,instruction:'Prepare private drafts.',channels:['blog' as const],reviewed:true as const};
 it('denies non-owners before RPC and rejects unreviewed input',async()=>{
  for(const role of ['editor','viewer']) { vi.mocked(getSite).mockResolvedValue({workspace:{role}} as never);const f=fixture();await expect(distributeMeetingRequest(f.db,actor,wid,sid,input)).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled(); }
  vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);const f=fixture();await expect(distributeMeetingRequest(f.db,actor,wid,sid,{...input,reviewed:false} as never)).rejects.toThrow();expect(f.rpc).not.toHaveBeenCalled();
 });
 it('reports setup, missing decision, conflict and quota without retrying',async()=>{
  for(const [error,status] of [[{code:'PGRST202'},503],[{message:'bz_meeting_decision_required'},409],[{message:'bz_conflict'},409],[{message:'bz_agency_limit'},409],[{message:'bz_invalid_meeting_distribution'},400]] as const){const f=fixture(null,error);await expect(distributeMeetingRequest(f.db,actor,wid,sid,input)).rejects.toMatchObject({status});expect(f.rpc).toHaveBeenCalledTimes(1);}
 });
 it('validates both retained records and the immutable decision projection',async()=>{
  const meetingCommand={action:'meeting',id:actor,agenda:'Discuss private drafts.',mode:'announcement',participants:['content'],reviewed:true,inputMode:'text'};
  const lineage={meetingId:actor,requestId:wid,sourceVersion:2,agenda:meetingCommand,decision:'Private drafts only.',instruction:input.instruction,command:{...command,id:wid},actorId:actor,createdAt:'now'};
  const meeting={id:actor,kind:'meeting',version:3,status:'decision-recorded',document:meetingCommand,snapshot:{},createdAt:'now',events:[],meetingDistribution:lineage};
  const request={...meeting,id:wid,kind:'request',version:1,status:'proposed',document:{...command,id:wid}};
  const f=fixture({meeting,request});expect((await distributeMeetingRequest(f.db,actor,wid,sid,input)).request.meetingDistribution?.sourceVersion).toBe(2);
  expect(f.rpc).toHaveBeenCalledWith('bz_distribute_meeting_request',{p_workspace_id:wid,p_site_id:sid,p_input:input});
  await expect(distributeMeetingRequest(fixture({meeting,request:{...request,id:'invalid'}}).db,actor,wid,sid,input)).rejects.toThrow();
 });
});

describe('meeting participant invitation preparation', () => {
 const input={id:actor,expectedVersion:3,reviewed:true as const};
 it('denies non-owners before RPC',async()=>{vi.mocked(getSite).mockResolvedValue({workspace:{role:'viewer'}} as never);const f=fixture();await expect(inviteMeetingParticipants(f.db,actor,wid,sid,input)).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();});
 it('maps setup and admission failures',async()=>{for(const [error,status] of [[{code:'PGRST202'},503],[{message:'bz_meeting_distribution_required'},409],[{message:'bz_site_roster_paused'},409],[{message:'bz_site_roster_changed'},409],[{message:'bz_invalid_meeting_invitation'},400]] as const){const f=fixture(null,error);await expect(inviteMeetingParticipants(f.db,actor,wid,sid,input)).rejects.toMatchObject({status});expect(f.rpc).toHaveBeenCalledTimes(1);}});
});

describe('reviewed campaign handoff boundary', () => {
 const input = { id: actor, campaignId: wid, expectedVersion: 1, title: 'Private handoff', reviewed: true as const };
 it('refuses non-owners before invoking the handoff RPC', async () => {
  for (const role of ['editor', 'viewer']) {
   vi.mocked(getSite).mockResolvedValue({ workspace: { role } } as never);
   const f = fixture(); await expect(handoffAgency(f.db, actor, wid, sid, input)).rejects.toMatchObject({status:403}); expect(f.rpc).not.toHaveBeenCalled();
  }
 });
 it('reports migration, conflict and capacity failures without another RPC', async () => {
  for (const [error, status] of [[{code:'PGRST202'},503],[{message:'bz_conflict'},409],[{message:'bz_campaign_limit'},409],[{message:'bz_invalid_agency_handoff'},400]] as const) {
   const f=fixture(null,error); await expect(handoffAgency(f.db,actor,wid,sid,input)).rejects.toMatchObject({status}); expect(f.rpc).toHaveBeenCalledTimes(1);
  }
 });
 it('passes a reviewed version-bound command and validates retained lineage', async () => {
  const record={id:actor,kind:'request',version:2,status:'proposed',document:command,snapshot:{},createdAt:'now',events:[],handoff:{campaignId:wid,sourceVersion:1,title:input.title,document:{title:input.title,brief:'Approved-source brief',blog:'',pinterest:'',linkedin:''},actorId:actor,createdAt:'now'}};
  const f=fixture(record); expect((await handoffAgency(f.db,actor,wid,sid,input)).handoff?.campaignId).toBe(wid);
  expect(f.rpc).toHaveBeenCalledWith('bz_handoff_agency_campaign',{p_workspace_id:wid,p_site_id:sid,p_input:input});
  await expect(handoffAgency(fixture({...record,handoff:{...record.handoff,campaignId:'bad'}}).db,actor,wid,sid,input)).rejects.toThrow();
 });
});

describe('request generation preparation', () => {
 const input = { id: actor, runId: wid, expectedVersion: 2, expectedCampaignVersion: 1, reviewed: true as const };
 it('denies editors and viewers before accessing generation admission', async () => {
  for (const role of ['editor', 'viewer']) {
   vi.mocked(getSite).mockResolvedValue({ workspace: { role } } as never);
   const f = fixture(); await expect(prepareAgencyGeneration(f.db, actor, wid, sid, input)).rejects.toMatchObject({ status: 403 }); expect(f.rpc).not.toHaveBeenCalled();
  }
 });
 it('reports readiness, paused team, stale, quota and missing setup without retrying', async () => {
  for (const [error, status] of [[{code:'PGRST202'},503],[{message:'bz_generation_not_ready'},409],[{message:'bz_site_roster_paused'},409],[{message:'bz_conflict'},409],[{message:'bz_generation_limit'},409],[{message:'bz_agency_campaign_required'},409],[{message:'bz_invalid_agency_generation'},400]] as const) {
   const f=fixture(null,error); await expect(prepareAgencyGeneration(f.db,actor,wid,sid,input)).rejects.toMatchObject({status}); expect(f.rpc).toHaveBeenCalledTimes(1);
  }
 });
 it('validates confirmation before RPC and validates the returned run projection', async () => {
  const f=fixture(); await expect(prepareAgencyGeneration(f.db,actor,wid,sid,{...input,reviewed:false} as never)).rejects.toThrow(); expect(f.rpc).not.toHaveBeenCalled();
  const record={id:actor,kind:'request',version:3,status:'proposed',document:command,snapshot:{},createdAt:'now',events:[],executionPreparation:{campaignVersion:1,campaignTitle:'Private'},execution:{sourceVersion:2,actorId:actor,createdAt:'now',run:{id:wid,campaignId:sid,campaignVersion:1,status:'prepared',createdAt:'now',startedAt:null,finishedAt:null,stageCount:3,outputAvailable:false}}};
  const ok=fixture(record); expect((await prepareAgencyGeneration(ok.db,actor,wid,sid,input)).execution?.run.status).toBe('prepared');
  expect(ok.rpc).toHaveBeenCalledWith('bz_prepare_agency_generation',{p_workspace_id:wid,p_site_id:sid,p_input:input});
  await expect(prepareAgencyGeneration(fixture({...record,execution:{...record.execution,run:{...record.execution.run,status:'invented'}}}).db,actor,wid,sid,input)).rejects.toThrow();
 });
});
