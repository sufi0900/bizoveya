import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../workspaces/store',async original=>({...await original<typeof import('../workspaces/store')>(),getSite:vi.fn()}));
import { getSite } from '../workspaces/store';
import { loadOnboarding, reviewOnboarding } from './onboarding-store';
import { assessOnboarding, onboardingReportSchema, onboardingReviewSchema } from './onboarding-contracts';
import { OnboardingPanel } from './onboarding-panel';
const id='11111111-1111-4111-8111-111111111111',hash='a'.repeat(64);
const current={schema:'agency-onboarding-v1',siteId:id,mode:'deterministic-approved-context',executionEnabled:false,facts:[{sourceId:id,sourceVersion:2,title:'Approved',factId:'f1',text:'Private drafts.',approvedAt:'now'}],preferences:{version:1,document:{brandVoice:'Practical',audience:'Founders',guidance:''}},catalog:[],roles:['coordinator','content','quality'].map(kind=>({kind,qualificationFingerprint:hash,previewCount:1,qualifiedCount:1}))};
const report=onboardingReportSchema.parse({current,fingerprint:hash,latest:null,history:[]});
const input={fingerprint:hash,expectedVersion:0,note:'Reviewed evidence only.',reviewed:true as const};
function fixture(data:unknown=report,error:unknown=null){const rpc=vi.fn(async()=>({data,error}));return{rpc,db:{rpc} as unknown as SupabaseClient};}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);});
describe('grounded onboarding assessment',()=>{
 it('distinguishes preparation eligibility from activation and exposes missing/ambiguous roles',()=>{
  expect(assessOnboarding(report.current)).toMatchObject({preparationChecksPassed:true,sourceCount:1,factCount:1});
  const missing=assessOnboarding({...report.current,facts:[],roles:report.current.roles.map((r,i)=>({...r,qualifiedCount:i===0?2:0}))});
  expect(missing.preparationChecksPassed).toBe(false);expect(missing.blockers).toHaveLength(4);expect(missing.blockers.join(' ')).toContain('ambiguity');
  expect(missing.blockers.join(' ')).toContain('last 24 hours');expect(missing.blockers.join(' ')).toContain('unexpired enabled pricing policy');
 });
 it('rejects execution flags, duplicate role records and unreviewed commands',()=>{
  expect(onboardingReviewSchema.safeParse({...input,reviewed:false}).success).toBe(false);
  expect(onboardingReviewSchema.safeParse({...input,activate:true}).success).toBe(false);
  expect(onboardingReportSchema.safeParse({...report,current:{...current,roles:[current.roles[0],current.roles[0],current.roles[0]]}}).success).toBe(false);
 });
 it('checks membership before reading and blocks non-owner mutation before the RPC',async()=>{
  const f=fixture();await loadOnboarding(f.db,id,id,id);expect(getSite).toHaveBeenCalledWith(f.db,id,id,id);
  for(const role of ['editor','viewer']){vi.mocked(getSite).mockResolvedValue({workspace:{role}} as never);const f=fixture();await expect(reviewOnboarding(f.db,id,id,id,input)).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();}
 });
 it('returns actionable setup, stale-context and quota failures',async()=>{
  for(const [error,status] of [[{code:'PGRST202'},503],[{message:'bz_onboarding_changed'},409],[{message:'bz_onboarding_limit'},409],[{message:'bz_onboarding_snapshot_limit'},409]] as const)await expect(reviewOnboarding(fixture(null,error).db,id,id,id,input)).rejects.toMatchObject({status});
 });
 it('forwards only the reviewed hash/version/note and validates returned snapshots',async()=>{
  const f=fixture();expect(await reviewOnboarding(f.db,id,id,id,input)).toEqual(report);expect(f.rpc).toHaveBeenCalledWith('bz_review_agency_onboarding',{p_workspace_id:id,p_site_id:id,p_input:input});
  await expect(loadOnboarding(fixture({...report,current:{...current,executionEnabled:true}}).db,id,id,id)).rejects.toThrow();
 });
 it('explains the deterministic boundary without loading credentials or pretending an analyst response',()=>{
  const html=renderToStaticMarkup(createElement(OnboardingPanel,{owner:false,endpoint:'/api/agency/onboarding',sitePath:'/workspaces/w/sites/s'}));
  expect(html).toContain('Load current assessment');expect(html).toContain('does not generate an analyst response');expect(html).not.toContain('Agent activated');
 });
});
