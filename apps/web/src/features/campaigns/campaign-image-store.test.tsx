import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,vi,beforeEach} from 'vitest';
import {createHash} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
import {getSite} from '@/features/workspaces/store';
import {loadCampaignImages,readCampaignImageBytes,saveCampaignImages} from './campaign-image-store';
import {readPrivateMediaBytes} from './private-media-objects';
import {saveCampaignImageSchema,type CampaignImageRecord} from './media-visual-contracts';
import {starterVisuals,upgradeVisuals} from './visual-contracts';
import {visualSource,id} from './visuals.fixture';
import {MediaVisualPanel} from './media-visual-panel';
vi.mock('@/features/workspaces/store',async()=>({...await vi.importActual('@/features/workspaces/store'),getSite:vi.fn()}));
vi.mock('./private-media-objects',()=>({readPrivateMediaBytes:vi.fn()}));
const member='22222222-2222-4222-8222-222222222222',bytes=new Uint8Array([137,80,78,71,13,10,26,10]);
const descriptor={schema:'private-media-descriptor-v1' as const,mime:'image/png' as const,bytes:bytes.length,width:1,height:1,sha256:createHash('sha256').update(bytes).digest('hex'),alt:'My image',origin:'user-upload' as const,rights:{basis:'own-work' as const,evidence:'My own work',attested:true as const}};
const document={schema:'campaign-media-working-copy-v1' as const,document:upgradeVisuals(starterVisuals(visualSource(),'Brand')),attachments:[{target:'pin-1' as const,reference:{mediaId:id,version:1,sha256:descriptor.sha256},descriptor}]};
const record:CampaignImageRecord={generationId:id,version:1,baseVisualVersion:1,sourceReviewVersion:1,document,updatedAt:'now',revisions:[]};
const input=()=>saveCampaignImageSchema.parse({generationId:id,expectedVersion:0,baseVisualVersion:1,sourceReviewVersion:1,document,reviewed:true,shareReviewed:true});
function fixture(){const rpc=vi.fn().mockResolvedValue({data:record,error:null}),serviceRpc=vi.fn().mockResolvedValue({data:{path:`${id}/${id}/${id}/${id}/1/${descriptor.sha256}.png`,creatorId:id,descriptor},error:null}),download=vi.fn().mockResolvedValue({data:new Blob([bytes]),error:null}),from=vi.fn(()=>({download}));return {rpc,serviceRpc,download,from,db:{rpc} as unknown as SupabaseClient,service:{rpc:serviceRpc,storage:{from}} as unknown as SupabaseClient};}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(getSite).mockResolvedValue({workspace:{role:'owner'}} as never);vi.mocked(readPrivateMediaBytes).mockResolvedValue({bytes,descriptor});});
describe('saved campaign image server and owner/member controls',()=>{
 it('denies owner writes before any service/Storage access and requires explicit sharing',async()=>{
  const f=fixture();vi.mocked(getSite).mockResolvedValue({workspace:{role:'viewer'}} as never);
  await expect(saveCampaignImages(f.db,f.service,id,id,id,input())).rejects.toMatchObject({status:403});expect(f.serviceRpc).not.toHaveBeenCalled();expect(f.download).not.toHaveBeenCalled();expect(f.rpc).not.toHaveBeenCalled();
  expect(saveCampaignImageSchema.safeParse({...input(),shareReviewed:false}).success).toBe(false);
 });
 it('loads member-visible metadata without service credentials or Storage paths',async()=>{
  const f=fixture();expect(await loadCampaignImages(f.db,member,id,id,id)).toEqual(record);expect(f.rpc).toHaveBeenCalledWith('bz_campaign_image_draft',expect.objectContaining({p_generation_id:id}));expect(f.serviceRpc).not.toHaveBeenCalled();
 });
 it('reads a retained original-creator object for a current different member and checks actual hash',async()=>{
  const f=fixture();expect((await readCampaignImageBytes(f.db,f.service,member,id,id,id,id,1)).bytes).toEqual(bytes);expect(f.serviceRpc).toHaveBeenCalledWith('bz_campaign_image_object',expect.objectContaining({p_actor:member}));
  f.download.mockResolvedValue({data:new Blob(['changed']),error:null});await expect(readCampaignImageBytes(f.db,f.service,member,id,id,id,id,1)).rejects.toMatchObject({status:503});
 });
 it('refuses foreign paths and unavailable object resolution before Storage access',async()=>{
  const f=fixture();f.serviceRpc.mockResolvedValueOnce({data:{path:'foreign/path',creatorId:id,descriptor},error:null});await expect(readCampaignImageBytes(f.db,f.service,member,id,id,id,id,1)).rejects.toThrow('path contract');expect(f.download).not.toHaveBeenCalled();
  f.serviceRpc.mockResolvedValue({data:null,error:{message:'bz_media_unavailable'}});await expect(readCampaignImageBytes(f.db,f.service,member,id,id,id,id,1)).rejects.toMatchObject({status:404});expect(f.download).not.toHaveBeenCalled();
 });
 it('checks retained bytes then performs the atomic versioned save with sharing confirmation',async()=>{
  const f=fixture();expect(await saveCampaignImages(f.db,f.service,id,id,id,input())).toEqual(record);expect(f.download).toHaveBeenCalledTimes(1);expect(readPrivateMediaBytes).not.toHaveBeenCalled();expect(f.rpc).toHaveBeenCalledWith('bz_save_campaign_image_draft',expect.objectContaining({p_expected_version:0,p_base_visual_version:1,p_reviewed:true,p_share_reviewed:true}));
 });
 it('uses creator bytes only for a new reference and keeps setup/integrity failures from being bypassed',async()=>{
  const f=fixture();f.serviceRpc.mockResolvedValue({data:null,error:{message:'bz_media_unavailable'}});await saveCampaignImages(f.db,f.service,id,id,id,input());expect(readPrivateMediaBytes).toHaveBeenCalledTimes(1);
  vi.mocked(readPrivateMediaBytes).mockClear();f.serviceRpc.mockResolvedValue({data:null,error:{code:'PGRST202'}});await expect(saveCampaignImages(f.db,f.service,id,id,id,input())).rejects.toMatchObject({status:503});expect(readPrivateMediaBytes).not.toHaveBeenCalled();
 });
 it('refuses descriptor changes and stale saves while keeping data local',async()=>{
  const f=fixture(),changed=input();changed.document.attachments[0].descriptor.alt='Forged new alt';await expect(saveCampaignImages(f.db,f.service,id,id,id,changed)).rejects.toMatchObject({status:409});expect(f.rpc).not.toHaveBeenCalled();
  f.rpc.mockResolvedValue({data:null,error:{message:'bz_conflict'}});await expect(saveCampaignImages(f.db,f.service,id,id,id,input())).rejects.toMatchObject({status:409});
 });
 it('exposes sharing/review/save to owners and saved-load/exports to members without private inventory controls',()=>{
  const persistence={generationId:id,sourceReviewVersion:1,baseSaved:null,canEdit:true};
  const owner=renderToStaticMarkup(<MediaVisualPanel document={document.document} endpoint="/api/media" disabled={false} persistence={persistence}/>);expect(owner).toContain('I approve saving these images and rights for current site members to read.');expect(owner).toContain('Save image draft');
  const viewer=renderToStaticMarkup(<MediaVisualPanel document={document.document} endpoint="/api/media" disabled={false} persistence={{...persistence,canEdit:false}}/>);expect(viewer).toContain('Load saved image draft');expect(viewer).toContain('Download this target with image');expect(viewer).not.toContain('Load my reviewed images');expect(viewer).not.toContain('>Save image draft</button>');
 });
});
