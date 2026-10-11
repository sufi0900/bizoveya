'use client';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import type {VisualDocument} from './visual-contracts';
import {privateMediaInventorySchema,privateMediaRecordSchema,type PrivateMediaRecord} from './private-media-contracts';
import {attachReviewedMedia,mediaTarget,mediaVisualTargets,type MediaVisualDocument,type MediaVisualTarget} from './media-visual-contracts';
import {mediaVisualSvg,verifyMediaImage,type VerifiedMediaImage} from './media-visual-render';

function SvgImage({svg,alt}:{svg:string;alt:string}){
 const [url,setUrl]=useState(''),[failed,setFailed]=useState(false);
 useEffect(()=>{const next=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));setUrl(next);setFailed(false);return()=>URL.revokeObjectURL(next);},[svg]);
 // Local verified SVG embeds raster bytes; the Next image optimizer must not receive it.
 // eslint-disable-next-line @next/next/no-img-element
 return <>{url&&<img src={url} alt={alt} onError={()=>setFailed(true)} style={{width:'100%',maxWidth:420,height:'auto'}}/>}{failed&&<p role="alert">This browser could not preview the image composition. Export may also be unavailable.</p>}</>;
}
/** Local reviewed exports. No campaign mutation or shared media visibility is enabled here. */
export function MediaVisualPanel({document,endpoint,disabled}:{document:VisualDocument;endpoint:string;disabled:boolean}){
 const [records,setRecords]=useState<PrivateMediaRecord[]>([]),[selected,setSelected]=useState('');
 const [target,setTarget]=useState<MediaVisualTarget>('pin-1'),[attachments,setAttachments]=useState<MediaVisualDocument['attachments']>([]);
 const [images,setImages]=useState<VerifiedMediaImage[]>([]),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const lock=useRef(false),mounted=useRef(true),bodyKey=JSON.stringify(document),[reviewKey,setReviewKey]=useState('');
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const working=useMemo(()=>({schema:'campaign-media-working-copy-v1' as const,document,attachments}),[document,attachments]);
 const preview=useMemo(()=>{try{return {svg:mediaVisualSvg(working,mediaTarget(target),images),error:''};}catch(error){return {svg:'',error:error instanceof Error?error.message:'Composition unavailable.'};}},[working,target,images]);
 const allowed=mediaVisualTargets.filter(key=>document.schema!=='campaign-visuals-v1'||key!=='linkedin-1');
 const choices=records.flatMap(record=>record.versions.filter(version=>version.review?.decision==='accepted'&&!record.archived).map(version=>({id:`${record.mediaId}:${version.version}`,record,version})));
 useEffect(()=>{
  if(!attachments.length)return;
  const unload=(event:BeforeUnloadEvent)=>event.preventDefault();
  const leave=(event:Event)=>{if(!window.confirm('Discard this unsaved image working copy?'))event.preventDefault();};
  const link=(event:MouseEvent)=>{if((event.target as HTMLElement).closest('a[href]'))leave(event);};
  window.addEventListener('beforeunload',unload);window.addEventListener('bizoveya:before-signout',leave);window.document.addEventListener('click',link,true);
  return()=>{window.removeEventListener('beforeunload',unload);window.removeEventListener('bizoveya:before-signout',leave);window.document.removeEventListener('click',link,true);};
 },[attachments.length]);
 async function run(operation:()=>Promise<void>){if(lock.current||disabled)return;lock.current=true;setBusy(true);setMessage('');try{await operation();}catch(error){if(mounted.current)setMessage(error instanceof Error?error.message:'Image operation failed.');}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 async function json(path:string){const response=await fetch(path,{cache:'no-store',signal:AbortSignal.timeout(20000)}),data=await response.json();if(!response.ok)throw Error(data.error??'Private images unavailable.');return data;}
 async function load(){
  const inventory=privateMediaInventorySchema.parse(await json(endpoint));
  // Bound concurrent detail requests; only explicit user interaction starts these reads.
  const loaded:PrivateMediaRecord[]=[];
  for(let start=0;start<inventory.length;start+=4)loaded.push(...await Promise.all(inventory.slice(start,start+4).map(item=>json(`${endpoint}/${item.mediaId}`).then(privateMediaRecordSchema.parse))));
  if(!mounted.current)return;setRecords(loaded);setSelected('');setMessage(loaded.length?'Choose an accepted image version.':'Upload and accept an image in the private image library first.');
 }
 async function add(){
  const choice=choices.find(item=>item.id===selected);if(!choice)throw Error('Choose an accepted image version first.');
  // Re-read the record immediately before admission; a stale archived/rejected choice is denied.
  const record=privateMediaRecordSchema.parse(await json(`${endpoint}/${choice.record.mediaId}`));
  const scope={actorId:record.creatorId,workspaceId:record.workspaceId,siteId:record.siteId};
  const reference={mediaId:record.mediaId,version:choice.version.version,sha256:choice.version.descriptor.sha256};
  const next=attachReviewedMedia(working,target,record,scope,reference),item=next.attachments.find(item=>item.target===target)!;
  const response=await fetch(`${endpoint}/${record.mediaId}/bytes?version=${reference.version}`,{cache:'no-store',signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error('The saved image bytes are unavailable. Check image-library setup.');
  const advertised=Number(response.headers.get('content-length'));if(advertised&&advertised!==item.descriptor.bytes)throw Error('Image size changed.');
  // The authenticated server route is capped at 5 MiB; check the actual response too.
  const bytes=new Uint8Array(await response.arrayBuffer()),image=await verifyMediaImage(bytes,item.descriptor);
  const hashes=new Set(next.attachments.map(item=>item.reference.sha256));
  if(!mounted.current)return;setAttachments(next.attachments);setImages(previous=>[...previous.filter(old=>hashes.has(old.descriptor.sha256)&&old.descriptor.sha256!==image.descriptor.sha256),image]);setReviewed(false);setMessage('Image added to an unsaved private working copy. Review it before exporting.');
 }
 async function download(pdf=false){
  if(!reviewed||reviewKey!==bodyKey||!attachments.length)throw Error('Review the current image composition first.');
  const [{mediaVisualPng,mediaVisualPdf},{downloadVisualBlob}]=await Promise.all([import('./media-visual-export'),import('./visual-export')]);
  const blob=pdf?await mediaVisualPdf(working,images):await mediaVisualPng(working,mediaTarget(target),images);
  if(!mounted.current)return;downloadVisualBlob(blob,`bizoveya-private-image-working-copy-${pdf?'carousel.pdf':`${target}.png`}`);setMessage('Private image working copy downloaded. Campaign image attachments are not saved yet.');
 }
 return <details style={{marginTop:20}}><summary><strong>Reviewed images — private working-copy exports</strong></summary>
  <p>Use your accepted image versions with the current visual text. Images appear above the complete text card. This working copy stays in this tab; campaign saves and existing downloads retain their original visuals. Durable image attachments are still being implemented.</p>
  <p role="status">{message}{busy?' Working…':''}</p>
  <fieldset disabled={disabled||busy} style={{border:0,padding:0}}><legend>Image composition</legend>
   <button type="button" className="bz-button" onClick={()=>void run(load)}>Load my reviewed images</button>
   <label style={{display:'block',marginTop:12}}>Accepted image version<select value={selected} onChange={event=>setSelected(event.target.value)}><option value="">Choose an image</option>{choices.map(choice=><option key={choice.id} value={choice.id}>{choice.version.descriptor.alt} · v{choice.version.version} · {choice.record.mediaId.slice(0,8)}</option>)}</select></label>
   <label style={{display:'block',marginTop:12}}>Image target<select value={target} onChange={event=>setTarget(event.target.value as MediaVisualTarget)}>{allowed.map(key=><option key={key} value={key}>{key.replace('-',' ')}</option>)}</select></label>
   <button type="button" className="bz-button" disabled={!selected} onClick={()=>void run(add)}>Use image on this target</button>
   <button type="button" className="bz-button" disabled={!attachments.some(item=>item.target===target)} onClick={()=>{const next=attachments.filter(item=>item.target!==target);setAttachments(next);setImages(previous=>previous.filter(image=>next.some(item=>item.reference.sha256===image.descriptor.sha256)));setReviewed(false);}}>Remove image from this target</button>
   <p>{attachments.length} image targets · up to three distinct images. Choose each target to inspect its composition.</p>
   {preview.error?<p role="alert">{preview.error}</p>:<SvgImage svg={preview.svg} alt={`Private ${target} image composition preview`}/>}
   <label style={{display:'block',marginTop:12}}><input type="checkbox" checked={reviewed&&reviewKey===bodyKey} onChange={event=>{setReviewed(event.target.checked);setReviewKey(bodyKey);}}/> I reviewed every image target, text and rights for this private working copy.</label>
   <button type="button" className="bz-button" disabled={!attachments.length||!reviewed||reviewKey!==bodyKey||Boolean(preview.error)} onClick={()=>void run(()=>download())}>Download this target with image (PNG)</button>
   <button type="button" className="bz-button" disabled={!attachments.length||!reviewed||reviewKey!==bodyKey} onClick={()=>void run(()=>download(true))}>Download image working-copy carousel (PDF)</button>
  </fieldset>
 </details>;
}
