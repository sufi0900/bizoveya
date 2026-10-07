import {beforeEach,describe,it,expect,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('../workspaces/store',async original=>({...await original<typeof import('../workspaces/store')>(),getSite:vi.fn()}));
import {getSite} from '../workspaces/store';
import {loadVisual,saveVisual} from './visual-store';
import {starterVisuals} from './visual-contracts';
import {visualSource} from './visuals.fixture';
const id='11111111-1111-4111-8111-111111111111';
beforeEach(()=>vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'},site:{id}} as never));
const input=()=>({generationId:id,expectedVersion:0,sourceReviewVersion:1,reviewed:true as const,document:starterVisuals(visualSource(),'Site brand')});
function fixture(data:unknown=null,error:unknown=null){const rpc=vi.fn(async()=>({data,error}));return {rpc,db:{rpc} as unknown as SupabaseClient};}
describe('visual storage authorization and fail-closed handling',()=>{
 it('rejects non-owner mutations before SQL',async()=>{vi.mocked(getSite).mockResolvedValueOnce({workspace:{role:'editor'},site:{id}} as never);const f=fixture();await expect(saveVisual(f.db,id,id,id,input())).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();});
 it('does not report missing migration or forbidden reads as empty saved visuals',async()=>{const missing=fixture(null,{code:'PGRST202'});await expect(loadVisual(missing.db,id,id,id,id)).rejects.toMatchObject({status:503});const denied=fixture(null,{code:'42501'});await expect(loadVisual(denied.db,id,id,id,id)).rejects.toMatchObject({status:403});});
 it('rejects text overflow before any RPC and keeps source-review conflicts actionable',async()=>{const f=fixture(),value=input();value.document.slides[0].body='W'.repeat(420);await expect(saveVisual(f.db,id,id,id,value)).rejects.toMatchObject({status:400});expect(f.rpc).not.toHaveBeenCalled();const stale=fixture(null,{message:'bz_visual_source_unaccepted'});await expect(saveVisual(stale.db,id,id,id,input())).rejects.toMatchObject({status:409});});
 it('pins source review and expected visual version in the only mutation RPC',async()=>{const value=input(),record={generationId:id,version:1,sourceReviewVersion:1,document:value.document,updatedAt:'now',revisions:[]},f=fixture(record);expect(await saveVisual(f.db,id,id,id,value)).toEqual(record);expect(f.rpc).toHaveBeenCalledWith('bz_save_campaign_visual',expect.objectContaining({p_generation_id:id,p_expected_version:0,p_source_review_version:1,p_reviewed:true}));expect(f.rpc).toHaveBeenCalledTimes(1);});
});
