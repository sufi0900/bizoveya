'use client';
import React,{useRef,useState} from 'react';
import {canComposeVisuals,starterVisuals,upgradeVisuals,visualTemplates,visualDocumentSchema,visualRecordSchema,type VisualDocument,type VisualRecord} from './visual-contracts';
import type {OutputRecord} from './output-contracts';
import {visualProblems,type VisualTarget} from './visual-layout';
import {VisualPreview} from './visual-preview';

export function VisualComposer({source,endpoint,canEdit,brandName}:{source:OutputRecord;endpoint:string;canEdit:boolean;brandName:string}){
 const [document,setDocument]=useState<VisualDocument>(()=>upgradeVisuals(starterVisuals(source,brandName)));const [saved,setSaved]=useState<VisualRecord|null>(null);
 const [loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[dirty,setDirty]=useState(true),[reviewed,setReviewed]=useState(false),[message,setMessage]=useState('');const lock=useRef(false);
 const accepted=canComposeVisuals(source),problems=visualProblems(document);const valid=visualDocumentSchema.safeParse(document).success&&!problems.length;
 const sourceReviewVersion=source.reviews[0]?.version??0,sourceChanged=saved!==null&&saved.sourceReviewVersion!==sourceReviewVersion;
 const canExport=loaded&&accepted&&valid&&saved!==null&&!dirty&&!sourceChanged;
 async function load(){if(loaded||lock.current)return;lock.current=true;setBusy(true);try{const response=await fetch(`${endpoint}?id=${encodeURIComponent(source.id)}`,{cache:'no-store'}),data=await response.json();if(!response.ok)throw Error(data.error??'Visual drafts could not be loaded.');const record=visualRecordSchema.nullable().parse(data);setSaved(record);if(record){setDocument(record.document);setDirty(false);}setLoaded(true);setMessage(record?'Saved visual drafts loaded.':'Starter excerpts ready. Check the text and layout before saving.');}catch(error){setMessage(error instanceof Error?error.message:'Load failed. Try opening the panel again.');}finally{lock.current=false;setBusy(false);}}
 function update(next:VisualDocument){setDocument(next);setDirty(true);setReviewed(false);setMessage('Unsaved visual edits.');}
 async function save(){if(lock.current||!loaded||!canEdit||!accepted||!valid||!reviewed)return;lock.current=true;setBusy(true);try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({generationId:source.id,expectedVersion:saved?.version??0,sourceReviewVersion,document,reviewed:true})}),data=await response.json();if(!response.ok)throw Error(data.error??'Visual save failed.');const record=visualRecordSchema.parse(data);setSaved(record);setDocument(record.document);setDirty(false);setReviewed(false);setMessage(`Visual draft v${record.version} saved. Text drafts and their acceptance are unchanged.`);}catch(error){setMessage(error instanceof Error?error.message:'Save failed. Your edits remain here; reload before resolving a conflict.');}finally{lock.current=false;setBusy(false);}}
 async function download(target:VisualTarget|'pdf'|'json'){if(lock.current||!canExport)return;lock.current=true;setBusy(true);try{const exporter=await import('./visual-export');const prefix=`bizoveya-visual-${source.id}-v${saved!.version}`;
  if(target==='json')exporter.downloadVisualBlob(new Blob([exporter.visualPacket(document,source,saved,false)],{type:'application/json'}),`${prefix}.json`);
  else if(target==='pdf')exporter.downloadVisualBlob(await exporter.visualCarouselPdf(document),`${prefix}-linkedin.pdf`);
  else exporter.downloadVisualBlob(await exporter.visualPng(document,target),`${prefix}-${target.kind}-${target.index+1}.png`);
  setMessage('Private visual downloaded. Nothing was published or regenerated.');
 }catch(error){setMessage(error instanceof Error?error.message:'Export unavailable. The saved visual remains intact.');}finally{lock.current=false;setBusy(false);}}
 if(!accepted)return <p>Visual drafts require a successful result with an accepted human review.</p>;
 return <details style={{marginTop:24}} onToggle={event=>{if(event.currentTarget.open)void load();}}><summary><strong>Visual drafts — Pinterest and LinkedIn</strong></summary>
  <p>Two Pinterest designs, a six-slide carousel and an optional LinkedIn post image. Choose a shared template without regenerating text. Starters arrange excerpts from the accepted text; check continuity before saving. Visual edits need their own review and do not change the original drafts.</p>
  <p role="status">{message}{busy?' Working…':''}</p>
  {!loaded?<button type="button" className="bz-button" disabled={busy} onClick={()=>void load()}>Load visual drafts</button>:<>
   <p>Visual version {saved?.version??0} · {dirty?'Unsaved edits':'Saved'}{sourceChanged?' · Source review changed: review and save again':''}</p>
   <fieldset disabled={!canEdit||busy} style={{padding:0,border:0,minWidth:0}}><legend>Brand and layout text</legend>
    <label style={{display:'block',marginTop:12}}>Brand name<input value={document.brand.name} maxLength={60} onChange={e=>update({...document,brand:{...document.brand,name:e.target.value}})} style={{display:'block',width:'100%'}}/></label>
    <label style={{display:'block',marginTop:12}}>Accent color<input value={document.brand.accent} maxLength={7} placeholder="#5271FF" onChange={e=>{if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))update({...document,brand:{...document.brand,accent:e.target.value}});}} style={{display:'block',width:'100%'}}/></label>
    <label style={{display:'block',marginTop:12}}>Footer text<input value={document.brand.footer} maxLength={100} onChange={e=>update({...document,brand:{...document.brand,footer:e.target.value}})} style={{display:'block',width:'100%'}}/></label>
    {document.schema==='campaign-visuals-v1'&&<button type="button" className="bz-button" onClick={()=>update(upgradeVisuals(document))}>Add templates and LinkedIn image</button>}
    <h4>Pinterest designs · 1000 × 1500</h4><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',gap:20}}>{document.pins.map((pin,index)=><div key={index}>
     {document.schema!=='campaign-visuals-v1'&&<label style={{display:'block',marginBottom:12}}>Pinterest {index+1} template<select value={document.templates.pins[index]} onChange={e=>update({...document,templates:{...document.templates,pins:document.templates.pins.map((id,i)=>i===index?e.target.value:id) as typeof document.templates.pins}})}>{visualTemplates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>}
     <VisualPreview document={document} target={{kind:'pin',index:index as 0|1}}/>
     <label style={{display:'block',marginTop:12}}>Pinterest {index+1} title<textarea value={pin.title} maxLength={120} rows={3} onChange={e=>update({...document,pins:document.pins.map((p,i)=>i===index?{...p,title:e.target.value}:p) as VisualDocument['pins']})} style={{display:'block',width:'100%'}}/></label>
     <label style={{display:'block',marginTop:12}}>Pinterest {index+1} body<textarea value={pin.body} maxLength={600} rows={5} onChange={e=>update({...document,pins:document.pins.map((p,i)=>i===index?{...p,body:e.target.value}:p) as VisualDocument['pins']})} style={{display:'block',width:'100%'}}/></label>
    </div>)}</div>
    {document.schema!=='campaign-visuals-v1'&&<label style={{display:'block',marginTop:20}}>Carousel template<select value={document.templates.carousel} onChange={e=>update({...document,templates:{...document.templates,carousel:e.target.value as typeof document.templates.carousel}})}>{visualTemplates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>}
    <h4>LinkedIn carousel · six slides · 1080 × 1350</h4><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',gap:20}}>{document.slides.map((slide,index)=><div key={index}>
     <VisualPreview document={document} target={{kind:'slide',index}}/>
     <label style={{display:'block',marginTop:12}}>Slide {index+1} title<textarea value={slide.title} maxLength={100} rows={2} onChange={e=>update({...document,slides:document.slides.map((s,i)=>i===index?{...s,title:e.target.value}:s)})} style={{display:'block',width:'100%'}}/></label>
     <label style={{display:'block',marginTop:12}}>Slide {index+1} body<textarea value={slide.body} maxLength={420} rows={5} onChange={e=>update({...document,slides:document.slides.map((s,i)=>i===index?{...s,body:e.target.value}:s)})} style={{display:'block',width:'100%'}}/></label>
    </div>)}</div>
    {document.schema!=='campaign-visuals-v1'&&<section><h4>LinkedIn post image · 1080 × 1080</h4><p>Starts from the first carousel excerpt. Edit and review it as a standalone image.</p>
     <label style={{display:'block',marginTop:12}}>LinkedIn image template<select value={document.templates.linkedin} onChange={e=>update({...document,templates:{...document.templates,linkedin:e.target.value as typeof document.templates.linkedin}})}>{visualTemplates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
     <div style={{maxWidth:420}}><VisualPreview document={document} target={{kind:'linkedin',index:0}}/></div>
     <label style={{display:'block',marginTop:12}}>LinkedIn image title<textarea value={document.linkedin.title} maxLength={100} rows={2} onChange={e=>update({...document,linkedin:{...document.linkedin,title:e.target.value}})} style={{display:'block',width:'100%'}}/></label>
     <label style={{display:'block',marginTop:12}}>LinkedIn image body<textarea value={document.linkedin.body} maxLength={420} rows={5} onChange={e=>update({...document,linkedin:{...document.linkedin,body:e.target.value}})} style={{display:'block',width:'100%'}}/></label>
    </section>}
    {problems.length>0&&<ul role="alert">{problems.map((problem,index)=><li key={index}>{problem}</li>)}</ul>}{!visualDocumentSchema.safeParse(document).success&&<p role="alert">Complete every field and use a six-digit hex color. If starter text is too long, shorten it before saving.</p>}
    <label style={{display:'block',marginTop:18}}><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/> I reviewed the visual text and layout for private draft use.</label>
    <button type="button" className="bz-button" disabled={!valid||!reviewed||(!dirty&&!sourceChanged)} onClick={()=>void save()}>Save visual drafts</button>
    <details><summary>Saved visual history ({saved?.revisions.length??0})</summary>{saved?.revisions.map(revision=><div key={revision.version}><p>Visual v{revision.version} · source review v{revision.sourceReviewVersion} · {new Date(revision.occurredAt).toLocaleString()}</p><button type="button" className="bz-button" onClick={()=>update(revision.document)}>Use v{revision.version} as editable copy</button></div>)}</details>
   </fieldset>
   {!canEdit&&<p>Only the workspace owner can edit or save visuals. You can preview and download saved drafts.</p>}
   <p>Save reviewed visual drafts before downloading. Files are private drafts; sharing them is your decision.</p>
   <div style={{display:'flex',flexWrap:'wrap',gap:8}}>{([0,1] as const).map(index=><button type="button" className="bz-button" key={index} disabled={!canExport||busy} onClick={()=>void download({kind:'pin',index})}>Download Pinterest {index+1} PNG</button>)}{document.schema!=='campaign-visuals-v1'&&<button type="button" className="bz-button" disabled={!canExport||busy} onClick={()=>void download({kind:'linkedin',index:0})}>Download LinkedIn image PNG</button>}<button type="button" className="bz-button" disabled={!canExport||busy} onClick={()=>void download('pdf')}>Download LinkedIn carousel PDF</button><button type="button" className="bz-button" disabled={!canExport||busy} onClick={()=>void download('json')}>Download visual working copy (JSON)</button></div>
   <details><summary>Individual slide PNGs</summary>{document.slides.map((_,index)=><button type="button" className="bz-button" key={index} disabled={!canExport||busy} onClick={()=>void download({kind:'slide',index})}>Download slide {index+1} PNG</button>)}</details>
  </>}
 </details>;
}
