import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect,vi,afterEach} from 'vitest';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {starterVisuals,upgradeVisuals,saveVisualSchema} from './visual-contracts';
import {visualSource,id} from './visuals.fixture';
import {createPrivateMedia,reviewPrivateMedia,type PrivateMediaDescriptor} from './private-media-contracts';
import {attachReviewedMedia,mediaTarget,mediaTargetKey,mediaVisualDocumentSchema,type MediaVisualDocument} from './media-visual-contracts';
import {mediaVisualSvg,verifyMediaImage} from './media-visual-render';
import {sceneSvg,visualScene} from './visual-layout';
import {mediaVisualPdf,mediaVisualPng} from './media-visual-export';
import {MediaVisualPanel} from './media-visual-panel';
const scope={actorId:id,workspaceId:id,siteId:id},time='2026-10-11T02:00:00Z';
function document():MediaVisualDocument{return {schema:'campaign-media-working-copy-v1',document:upgradeVisuals(starterVisuals(visualSource(),'Brand')),attachments:[]};}
async function fixture(){
 const bytes=new Uint8Array(await sharp({create:{width:40,height:20,channels:3,background:'#ff0000'}}).png().toBuffer());
 const descriptor:PrivateMediaDescriptor={schema:'private-media-descriptor-v1',mime:'image/png',bytes:bytes.length,width:40,height:20,sha256:createHash('sha256').update(bytes).digest('hex'),alt:'Red owned image <script> & test',origin:'user-upload',rights:{basis:'own-work',evidence:'Local fixture only',attested:true}};
 const record=reviewPrivateMedia(createPrivateMedia(id,scope,descriptor,time),scope,1,1,'accepted','Reviewed fixture',time);
 const reference={mediaId:id,version:1,sha256:descriptor.sha256};return {bytes,descriptor,record,reference,image:await verifyMediaImage(bytes,descriptor)};
}
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('reviewed media working-copy contracts and real SVG rasterization',()=>{
 it('retains exact legacy scenes without images and rejects unsupported targets',()=>{
  const value=document();for(const target of [{kind:'pin',index:0},{kind:'slide',index:5},{kind:'linkedin',index:0}] as const)expect(mediaVisualSvg(value,target,[])).toBe(sceneSvg(visualScene(value.document,target)));
  expect(()=>mediaTargetKey({kind:'slide',index:6})).toThrow();expect(mediaTarget('pin-2')).toEqual({kind:'pin',index:1});
 });
 it('requires accepted nonarchived creator/site/hash-pinned versions and keeps campaign save boundary closed',async()=>{
  const f=await fixture(),value=document();
  expect(()=>attachReviewedMedia(value,'pin-1',f.record,{...scope,actorId:'22222222-2222-4222-8222-222222222222'},f.reference)).toThrow();
  expect(()=>attachReviewedMedia(value,'pin-1',{...f.record,archived:true},scope,f.reference)).toThrow();
  expect(()=>attachReviewedMedia(value,'pin-1',{...f.record,versions:[{...f.record.versions[0],review:null}]},scope,f.reference)).toThrow('review-required');
  expect(()=>attachReviewedMedia(value,'pin-1',f.record,scope,{...f.reference,sha256:'a'.repeat(64)})).toThrow();
  const attached=attachReviewedMedia(value,'pin-1',f.record,scope,f.reference);expect(value.attachments).toHaveLength(0);
  expect(saveVisualSchema.safeParse({generationId:id,expectedVersion:0,sourceReviewVersion:1,reviewed:true,document:attached}).success).toBe(false);
 });
 it('rejects repeated targets, too many images, URLs and inconsistent hashes',async()=>{
  const f=await fixture(),value=attachReviewedMedia(document(),'pin-1',f.record,scope,f.reference),item=value.attachments[0];
  expect(mediaVisualDocumentSchema.safeParse({...value,attachments:[item,item]}).success).toBe(false);
  expect(mediaVisualDocumentSchema.safeParse({...value,attachments:[{...item,url:'https://example.com/a.png'}]}).success).toBe(false);
  expect(mediaVisualDocumentSchema.safeParse({...value,attachments:[{...item,reference:{...item.reference,sha256:'b'.repeat(64)}}]}).success).toBe(false);
  const attachments=['pin-1','pin-2','slide-1','slide-2'].map((target,index)=>({...item,target,reference:{...item.reference,version:index+1}}));
  expect(mediaVisualDocumentSchema.safeParse({...value,attachments}).success).toBe(false);
 });
 it('verifies actual size, PNG/JPEG magic and hash and refuses fabricated admitted objects',async()=>{
  const f=await fixture();await expect(verifyMediaImage(f.bytes,{...f.descriptor,bytes:f.bytes.length-1})).rejects.toThrow('size');
  await expect(verifyMediaImage(f.bytes,{...f.descriptor,mime:'image/jpeg'})).rejects.toThrow('format');
  await expect(verifyMediaImage(f.bytes,{...f.descriptor,sha256:'a'.repeat(64)})).rejects.toThrow('hash');
  const value=attachReviewedMedia(document(),'pin-1',f.record,scope,f.reference);
  expect(()=>mediaVisualSvg(value,{kind:'pin',index:0},[{descriptor:f.descriptor,dataUrl:'https://example.com/track'}])).toThrow('verified');
  expect(()=>mediaVisualSvg(value,{kind:'pin',index:0},[{...f.image}])).toThrow('verified');
  expect(Object.isFrozen(f.image)).toBe(true);expect(Object.isFrozen(f.image.descriptor)).toBe(true);
 });
 it('renders the actual image pixels at original target dimensions with full text and escaped alt',async()=>{
  const f=await fixture();let value=document();
  for(const target of ['pin-1','slide-1','linkedin-1'] as const)value=attachReviewedMedia(value,target,f.record,scope,f.reference);
  for(const target of [{kind:'pin',index:0},{kind:'slide',index:0},{kind:'linkedin',index:0}] as const){
   const svg=mediaVisualSvg(value,target,[f.image]);expect(svg).toContain('preserveAspectRatio="xMidYMid meet"');expect(svg).toContain('&lt;script&gt; &amp; test');expect(svg).not.toContain('<script>');expect(svg).not.toContain('https://');
   const scene=visualScene(value.document,target),raster=await sharp(Buffer.from(svg)).png().toBuffer(),meta=await sharp(raster).metadata();expect(meta.width).toBe(scene.width);expect(meta.height).toBe(scene.height);
   const pixel=await sharp(raster).extract({left:Math.floor(scene.width/2),top:Math.floor(scene.height*.18),width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual([255,0,0]);
   expect(svg).toContain(scene.blocks.find(block=>block.id==='body')!.lines[0]);
  }
 });
 it('rejects missing images and overflowing words before export and exposes honest working-copy controls',async()=>{
  const f=await fixture(),value=attachReviewedMedia(document(),'slide-6',f.record,scope,f.reference);
  await expect(mediaVisualPdf(value,[])).rejects.toThrow('verified');
  value.document.slides[0].body='W'.repeat(420);await expect(mediaVisualPng(value,{kind:'slide',index:0},[f.image])).rejects.toThrow('shorten');
  const html=renderToStaticMarkup(<MediaVisualPanel document={document().document} endpoint="/api/workspaces/w/sites/s/campaigns/media" disabled={false}/>);
  expect(html).toContain('private working-copy exports');expect(html).toContain('Durable image attachments are still being implemented');expect(html).toContain('Accepted image version');expect(html).toContain('Image target');
 });
 it('exports all six image-bearing scenes through the same SVG path and cleans up object URLs',async()=>{
  const f=await fixture();let value=document();for(let index=1;index<=6;index++)value=attachReviewedMedia(value,`slide-${index}` as 'slide-1',f.record,scope,f.reference);
  const draw=vi.fn(),revoked=vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{}),created=vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:test');
  vi.stubGlobal('Image',class{onload:(()=>void)|null=null;set src(_value:string){queueMicrotask(()=>this.onload?.());}});
  vi.stubGlobal('window',{document:{createElement:()=>({width:0,height:0,getContext:()=>({drawImage:draw}),toBlob:(callback:(blob:Blob)=>void,type:string)=>callback(new Blob([new Uint8Array([255,216,255,217])],{type}))})}});
  const pdf=await mediaVisualPdf(value,[f.image]);expect(await pdf.text()).toContain('/Count 6');expect(draw).toHaveBeenCalledTimes(6);expect(created).toHaveBeenCalledTimes(6);expect(revoked).toHaveBeenCalledTimes(6);
 });
});
