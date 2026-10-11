import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {beforeEach,describe,expect,it,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('../workspaces/store',async original=>({...await original<typeof import('../workspaces/store')>(),getSite:vi.fn()}));
import {getSite} from '../workspaces/store';
import {loadRoster,saveRoster} from './roster-store';
import {rosterKinds,rosterDocumentSchema,rosterReviewSchema} from './roster-contracts';
import {RosterPanel} from './roster-panel';
import {assessOnboarding,onboardingSnapshotSchema} from './onboarding-contracts';
const id='11111111-1111-4111-8111-111111111111';
const agents=rosterKinds.map((kind,i)=>({kind,agentId:`11111111-1111-4111-8111-11111111111${i+1}`,agentVersion:1}));
const input={document:{enabled:true,agents},expectedVersion:0,reason:'Enable this reviewed site team only.',reviewed:true as const};
const record={version:1,document:input.document,catalog:[],history:[]};
function fixture(data:unknown=record,error:unknown=null){const rpc=vi.fn(async()=>({data,error}));return{rpc,db:{rpc} as unknown as SupabaseClient};}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);});
describe('site-scoped team controls',()=>{
 it('requires three distinct role-pinned agents for enable and permits an empty pause',()=>{
  expect(rosterDocumentSchema.safeParse(input.document).success).toBe(true);expect(rosterDocumentSchema.safeParse({enabled:false,agents:[]}).success).toBe(true);
  for(const document of [{enabled:true,agents:[]},{enabled:false,agents:[agents[0]]},{enabled:true,agents:[agents[0],agents[0],agents[2]]},{enabled:true,agents:agents.map(a=>({...a,agentId:id}))}])expect(rosterDocumentSchema.safeParse(document).success).toBe(false);
 });
 it('rejects unreviewed enable and injected generation permissions',()=>{
  expect(rosterReviewSchema.safeParse({...input,reviewed:false}).success).toBe(false);expect(rosterReviewSchema.safeParse({...input,startGeneration:true}).success).toBe(false);
 });
 it('checks site membership and denies editor/viewer changes before invoking SQL',async()=>{
  const f=fixture();await loadRoster(f.db,id,id,id);expect(getSite).toHaveBeenCalledWith(f.db,id,id,id);
  for(const role of ['editor','viewer']){vi.mocked(getSite).mockResolvedValue({workspace:{role}} as never);const f=fixture();await expect(saveRoster(f.db,id,id,id,input)).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();}
 });
 it('reports missing setup, stale team, unqualified selections and quota errors',async()=>{
  for(const [error,status] of [[{code:'PGRST202'},503],[{message:'bz_site_roster_changed'},409],[{message:'bz_site_roster_not_ready'},409],[{message:'bz_site_roster_limit'},409]] as const)await expect(saveRoster(fixture(null,error).db,id,id,id,input)).rejects.toMatchObject({status});
 });
 it('forwards the version-bound reviewed document and parses returned history',async()=>{
  const f=fixture();expect(await saveRoster(f.db,id,id,id,input)).toEqual(record);expect(f.rpc).toHaveBeenCalledWith('bz_save_site_agent_roster',{p_workspace_id:id,p_site_id:id,p_input:input});
  await expect(loadRoster(fixture({...record,document:{enabled:true,agents:[]}}).db,id,id,id)).rejects.toThrow();
 });
 it('treats an explicitly paused site as blocked without claiming its qualified models expired',()=>{
  const snapshot=onboardingSnapshotSchema.parse({schema:'agency-onboarding-v1',siteId:id,mode:'deterministic-approved-context',executionEnabled:false,siteTeam:{version:1,enabled:false},facts:[],preferences:{version:0,document:{brandVoice:'',audience:'',guidance:''}},catalog:[],roles:rosterKinds.map(kind=>({kind,qualificationFingerprint:'a'.repeat(64),previewCount:1,qualifiedCount:1}))});
  const result=assessOnboarding(snapshot);expect(result.preparationChecksPassed).toBe(false);expect(result.blockers.join(' ')).toContain('owner has paused');expect(result.blockers.join(' ')).not.toContain('operator must');
 });
 it('explains activation and pause boundaries without exposing admin controls or loading a provider',()=>{
  const html=renderToStaticMarkup(createElement(RosterPanel,{owner:false,endpoint:'/api/team'}));expect(html).toContain('Load site team');expect(html).toContain('Enabling does not start work');expect(html).not.toContain('/admin/');
 });
});
