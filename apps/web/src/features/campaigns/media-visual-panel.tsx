'use client';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import type {VisualDocument,VisualRecord} from './visual-contracts';
import {privateMediaInventorySchema,privateMediaRecordSchema,type PrivateMediaRecord} from './private-media-contracts';
import {attachReviewedMedia,campaignImageRecordSchema,mediaTarget,mediaVisualTargets,type CampaignImageRecord,type MediaVisualDocument,type MediaVisualTarget} from './media-visual-contracts';
import {mediaVisualSvg,verifyMediaImage,type VerifiedMediaImage} from './media-visual-render';

function SvgImage({svg,alt}:{svg:string;alt:string}){
 const [url,setUrl]=useState(''),[failed,setFailed]=useState(false);
 useEffect(()=>{const next=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));setUrl(next);setFailed(false);return()=>URL.revokeObjectURL(next);},[svg]);
 // Local verified SVG embeds raster bytes; the Next image optimizer must not receive it.
 // eslint-disable-next-line @next/next/no-img-element
 return <>{url&&<img src={url} alt={alt} onError={()=>setFailed(true)} style={{width:'100%',maxWidth:420,height:'auto'}}/>}{failed&&<p role="alert">This browser could not preview the image composition. Export may also be unavailable.</p>}</>;
}
type Persistence={generationId:string;sourceReviewVersion:number;baseSaved:VisualRecord|null;canEdit:boolean};
/** Images retain their own immutable saved history; base text/template saves stay separate. */
export function MediaVisualPanel({document,endpoint,disabled,persistence}:{document:VisualDocument;endpoint:string;disabled:boolean;persistence?:Persistence}){
 const [records,setRecords]=useState<PrivateMediaRecord[]>([]),[selected,setSelected]=useState('');
 const [target,setTarget]=useState<MediaVisualTarget>('pin-1'),[attachments,setAttachments]=useState<MediaVisualDocument['attachments']>([]);
 const [images,setImages]=useState<VerifiedMediaImage[]>([]),[reviewed,setReviewed]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [saved,setSaved]=useState<CampaignImageRecord|null>(null),[activeVersion,setActiveVersion]=useState<number|null>(null),[snapshot,setSnapshot]=useState<VisualDocument|null>(null),[snapshotReview,setSnapshotReview]=useState<number|null>(null),[savedLoaded,setSavedLoaded]=useState(false),[shareReviewed,setShareReviewed]=useState(false);
 const lock=useRef(false),mounted=useRef(true),[reviewKey,setReviewKey]=useState('');
 const owner=persistence?.canEdit??true,renderDocument=snapshot??document,bodyKey=JSON.stringify(renderDocument);
 const draftEndpoint=endpoint.replace(/\/media$/,'/image-drafts');
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const working=useMemo(()=>({schema:'campaign-media-working-copy-v1' as const,document:renderDocument,attachments}),[renderDocument,attachments]);
 const dirty=owner&&(saved?JSON.stringify(working)!==JSON.stringify(saved.document)||activeVersion!==saved.version||snapshotReview!==saved.sourceReviewVersion:attachments.length>0);
 const baseMatches=Boolean(persistence?.baseSaved&&JSON.stringify(persistence.baseSaved.document)===bodyKey&&persistence.baseSaved.sourceReviewVersion===persistence.sourceReviewVersion);
 const sourceMatches=!persistence||(snapshotReview??persistence.sourceReviewVersion)===persistence.sourceReviewVersion;
 const preview=useMemo(()=>{try{return {svg:mediaVisualSvg(working,mediaTarget(target),images),error:''};}catch(error){return {svg:'',error:error instanceof Error?error.message:'Composition unavailable.'};}},[working,target,images]);
 const allowed=mediaVisualTargets.filter(key=>renderDocument.schema!=='campaign-visuals-v1'||key!=='linkedin-1');
 const choices=records.flatMap(record=>record.versions.filter(version=>version.review?.decision==='accepted'&&!record.archived).map(version=>({id:`${record.mediaId}:${version.version}`,record,version})));
 useEffect(()=>{
  if(!dirty)return;
  const unload=(event:BeforeUnloadEvent)=>event.preventDefault();
  const leave=(event:Event)=>{if(!window.confirm('Discard this unsaved image working copy?'))event.preventDefault();};
  const link=(event:MouseEvent)=>{if((event.target as HTMLElement).closest('a[href]'))leave(event);};
  window.addEventListener('beforeunload',unload);window.addEventListener('bizoveya:before-signout',leave);window.document.addEventListener('click',link,true);
  return()=>{window.removeEventListener('beforeunload',unload);window.removeEventListener('bizoveya:before-signout',leave);window.document.removeEventListener('click',link,true);};
 },[dirty]);
 async function run(operation:()=>Promise<void>){if(lock.current||disabled)return;lock.current=true;setBusy(true);setMessage('');try{await operation();}catch(error){if(mounted.current)setMessage(error instanceof Error?error.message:'Image operation failed.');}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 async function json(path:string){const response=await fetch(path,{cache:'no-store',signal:AbortSignal.timeout(20000)}),data=await response.json();if(!response.ok)throw Error(data.error??'Private images unavailable.');return data;}
 async function restoreSaved(value:CampaignImageRecord['revisions'][number]){
  if(!persistence)return;
  const unique=[...new Map(value.document.attachments.map(item=>[`${item.reference.mediaId}:${item.reference.version}`,item])).values()];
  const loaded=await Promise.all(unique.map(async item=>{
   const ref=item.reference,response=await fetch(`${draftEndpoint}/${persistence.generationId}/${ref.mediaId}/bytes?version=${ref.version}`,{cache:'no-store',signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw Error('A retained campaign image is unavailable. Check setup and access.');
   return verifyMediaImage(new Uint8Array(await response.arrayBuffer()),item.descriptor);
  }));
  if(!mounted.current)return;setActiveVersion(value.version);setSnapshot(value.document.document);setSnapshotReview(value.sourceReviewVersion);setAttachments(value.document.attachments);setImages(loaded);setReviewed(true);setReviewKey(JSON.stringify(value.document.document));setShareReviewed(false);
 }
 async function loadSaved(){
  if(!persistence)return;if(dirty&&!window.confirm('Discard the unsaved image draft and reload its saved version?'))return;
  const record=campaignImageRecordSchema.nullable().parse(await json(`${draftEndpoint}?id=${persistence.generationId}`));
  if(record)await restoreSaved({...record,occurredAt:record.updatedAt});
  else if(mounted.current){setActiveVersion(null);setSnapshot(null);setSnapshotReview(null);setAttachments([]);setImages([]);setReviewed(false);setShareReviewed(false);}
  if(!mounted.current)return;setSaved(record);setSavedLoaded(true);setMessage(record?`Image draft v${record.version} loaded with text/layout visual v${record.baseVisualVersion}.`:'No saved image draft. Compose images, then review and save explicitly.');
 }
 async function save(){
  if(!persistence||!owner||!savedLoaded||!baseMatches||!reviewed||reviewKey!==bodyKey||!sourceMatches||!shareReviewed)throw Error('Save the text/layout visual first, then confirm the current image draft and sharing.');
  const response=await fetch(draftEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),body:JSON.stringify({generationId:persistence.generationId,expectedVersion:saved?.version??0,baseVisualVersion:persistence.baseSaved!.version,sourceReviewVersion:persistence.sourceReviewVersion,document:working,reviewed:true,shareReviewed:true})});
  const data=await response.json();if(!response.ok)throw Error(data.error??'Image save failed. Your local draft remains here.');
  const record=campaignImageRecordSchema.parse(data);if(!mounted.current)return;setSaved(record);setActiveVersion(record.version);setSnapshot(record.document.document);setSnapshotReview(record.sourceReviewVersion);setShareReviewed(false);setMessage(`Image draft v${record.version} saved for current site members. Source text, templates and their history are unchanged.`);
 }
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
  if(!mounted.current)return;setAttachments(next.attachments);setImages(previous=>[...previous.filter(old=>hashes.has(old.descriptor.sha256)&&old.descriptor.sha256!==image.descriptor.sha256),image]);setReviewed(false);setShareReviewed(false);setMessage('Image added to an unsaved private working copy. Review it before exporting or saving.');
 }
 async function download(pdf=false){
  if(!reviewed||reviewKey!==bodyKey||!attachments.length||!sourceMatches)throw Error('Review the current image composition and source acceptance first.');
  const [{mediaVisualPng,mediaVisualPdf},{downloadVisualBlob}]=await Promise.all([import('./media-visual-export'),import('./visual-export')]);
  const blob=pdf?await mediaVisualPdf(working,images):await mediaVisualPng(working,mediaTarget(target),images);
  if(!mounted.current)return;downloadVisualBlob(blob,`bizoveya-private-image-${dirty?'working-copy':`v${activeVersion??0}`}-${pdf?'carousel.pdf':`${target}.png`}`);setMessage(dirty?'Unsaved private image working copy downloaded.':'Saved private image draft downloaded.');
 }
 return <details style={{marginTop:20}} onToggle={event=>{if(event.currentTarget.open&&persistence&&!savedLoaded)void run(loadSaved);}}><summary><strong>Reviewed images — saved drafts and private exports</strong></summary>
  <p>Images appear above the complete text card. Save image drafts separately after saving the reviewed text/layout visual. Saved images and rights are readable by current site members; your other library images stay creator-private. Original text/template visual saves and downloads retain their own history.</p>
  <p role="status">{message}{busy?' Working…':''}</p>
  {persistence&&<><button type="button" className="bz-button" disabled={disabled||busy} onClick={()=>void run(loadSaved)}>Load saved image draft</button><p>Image draft v{activeVersion??0} · latest saved v{saved?.version??0} · {dirty?'Unsaved changes':'Saved or empty'}{!sourceMatches?' · Source review changed; owner must review and save again':''}</p></>}
  <fieldset disabled={disabled||busy} style={{border:0,padding:0}}><legend>Image composition</legend>
   {owner&&<>
   <button type="button" className="bz-button" onClick={()=>void run(load)}>Load my reviewed images</button>
   <label style={{display:'block',marginTop:12}}>Accepted image version<select value={selected} onChange={event=>setSelected(event.target.value)}><option value="">Choose an image</option>{choices.map(choice=><option key={choice.id} value={choice.id}>{choice.version.descriptor.alt} · v{choice.version.version} · {choice.record.mediaId.slice(0,8)}</option>)}</select></label>
   </>}
   <label style={{display:'block',marginTop:12}}>Image target<select value={target} onChange={event=>setTarget(event.target.value as MediaVisualTarget)}>{allowed.map(key=><option key={key} value={key}>{key.replace('-',' ')}</option>)}</select></label>
   {owner&&<>
   <button type="button" className="bz-button" disabled={!selected} onClick={()=>void run(add)}>Use image on this target</button>
   <button type="button" className="bz-button" disabled={!attachments.some(item=>item.target===target)} onClick={()=>{const next=attachments.filter(item=>item.target!==target);setAttachments(next);setImages(previous=>previous.filter(image=>next.some(item=>item.reference.sha256===image.descriptor.sha256)));setReviewed(false);setShareReviewed(false);}}>Remove image from this target</button>
   {persistence&&<button type="button" className="bz-button" onClick={()=>{setSnapshot(null);setSnapshotReview(null);setReviewed(false);setShareReviewed(false);setMessage('Current text/layout selected. Save that visual first if it has unsaved edits.');}}>Use current text/layout visual</button>}
   </>}
   <p>{attachments.length} image targets · up to three distinct images. Choose each target to inspect its composition.</p>
   {preview.error?<p role="alert">{preview.error}</p>:<SvgImage svg={preview.svg} alt={`Private ${target} image composition preview`}/>}
   {owner&&<><label style={{display:'block',marginTop:12}}><input type="checkbox" checked={reviewed&&reviewKey===bodyKey&&sourceMatches} onChange={event=>{setReviewed(event.target.checked);setReviewKey(bodyKey);if(event.target.checked)setSnapshotReview(persistence?.sourceReviewVersion??null);}}/> I reviewed every image target, text and rights for this private working copy.</label>
   {persistence&&<><label style={{display:'block',marginTop:12}}><input type="checkbox" checked={shareReviewed} onChange={event=>setShareReviewed(event.target.checked)}/> I approve saving these images and rights for current site members to read.</label><p>{baseMatches?'Text/layout matches the saved visual.':'Save your text/layout visual first, then choose Use current text/layout visual.'}</p><button type="button" className="bz-button" disabled={!savedLoaded||!baseMatches||!reviewed||reviewKey!==bodyKey||!sourceMatches||!shareReviewed} onClick={()=>void run(save)}>Save image draft</button></>}
   </>}
   <button type="button" className="bz-button" disabled={!attachments.length||!reviewed||reviewKey!==bodyKey||!sourceMatches||Boolean(preview.error)} onClick={()=>void run(()=>download())}>Download this target with image (PNG)</button>
   <button type="button" className="bz-button" disabled={!attachments.length||!reviewed||reviewKey!==bodyKey||!sourceMatches} onClick={()=>void run(()=>download(true))}>Download image carousel (PDF)</button>
   {saved&&<details><summary>Saved image history ({saved.revisions.length})</summary>{saved.revisions.map(revision=><p key={revision.version}>Image draft v{revision.version} · text/layout v{revision.baseVisualVersion} <button type="button" className="bz-button" onClick={()=>void run(async()=>{if(dirty&&!window.confirm('Discard unsaved images and load this historical version?'))return;await restoreSaved(revision);setMessage(`Historical image draft v${revision.version} loaded. Latest saved draft remains v${saved.version}.`);})}>Preview v{revision.version}</button></p>)}</details>}
  </fieldset>
 </details>;
}
