import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
vi.mock('../workspaces/store', async original => ({ ...await original<typeof import('../workspaces/store')>(), getSite: vi.fn() }));
import { getSite } from '../workspaces/store';
import { commandAgency, handoffAgency, loadAgency } from './agency-store';
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
