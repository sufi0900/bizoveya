import {beforeEach,describe,it,expect,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
vi.mock('server-only',()=>({}));
vi.mock('@/features/workspaces/store',()=>({getSite:vi.fn(),WorkspaceError:class extends Error{constructor(public status:number,message:string){super(message);}}}));
import {getSite} from '@/features/workspaces/store';
import {loadMedia,admitMedia,loadOptionalMedia} from './media-store';
const id='11111111-1111-4111-8111-111111111111';
const input={id,capability:'live-voice' as const,expectedQualificationVersion:1,document:{purpose:'founder-assistant' as const},reviewed:true as const};
const fixture=(data:unknown={capabilities:[],requests:[]},error:unknown=null)=>{const rpc=vi.fn().mockResolvedValue({data,error});return {rpc,db:{rpc} as unknown as SupabaseClient};};
beforeEach(()=>{vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);});
describe('owner media admission boundary',()=>{
 it('isolates optional setup failure but does not swallow authorization or malformed responses',async()=>{expect(await loadOptionalMedia(fixture(null,{code:'PGRST202'}).db,id,id,id)).toMatchObject({inventory:{capabilities:[],requests:[]},notice:expect.stringContaining('Typed proposals')});await expect(loadOptionalMedia(fixture({}).db,id,id,id)).rejects.toThrow();await expect(loadOptionalMedia(fixture(null,{code:'42501'}).db,id,id,id)).rejects.toMatchObject({status:403});});
 it('checks site membership before reading media inventory',async()=>{const f=fixture();expect(await loadMedia(f.db,id,id,id)).toEqual({capabilities:[],requests:[]});expect(getSite).toHaveBeenCalledWith(f.db,id,id,id);});
 it('denies editors and viewers before an admission RPC',async()=>{for(const role of ['editor','viewer']){vi.mocked(getSite).mockResolvedValue({workspace:{role}} as never);const f=fixture();await expect(admitMedia(f.db,id,id,id,input)).rejects.toMatchObject({status:403});expect(f.rpc).not.toHaveBeenCalled();}});
 it('rejects unreviewed or malformed admission and never calls the provider',async()=>{const f=fixture();await expect(admitMedia(f.db,id,id,id,{...input,reviewed:false} as never)).rejects.toThrow();expect(f.rpc).not.toHaveBeenCalled();});
 it('gives a setup error without exposing SQL or retrying',async()=>{const f=fixture(null,{code:'PGRST202',message:'sensitive details'});await expect(admitMedia(f.db,id,id,id,input)).rejects.toMatchObject({status:503});expect(f.rpc).toHaveBeenCalledTimes(1);});
 it('fails closed on malformed inventory and missing access',async()=>{await expect(loadMedia(fixture({requests:[]}).db,id,id,id)).rejects.toThrow();vi.mocked(getSite).mockImplementation(()=>{throw new Error('Denied');});const f=fixture();let denied=false;try{await loadMedia(f.db,id,id,id);}catch{denied=true;}expect(denied).toBe(true);expect(f.rpc).not.toHaveBeenCalled();});
});
