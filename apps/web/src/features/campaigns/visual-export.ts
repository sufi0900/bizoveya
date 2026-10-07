import {visualDocumentSchema,type VisualDocument,type VisualRecord} from './visual-contracts';
import {visualScene,sceneSvg,type VisualTarget} from './visual-layout';
import {carouselPdf} from './visual-pdf';
import type {OutputRecord} from './output-contracts';

export async function renderVisualCanvas(document:VisualDocument,target:VisualTarget):Promise<HTMLCanvasElement>{
 const scene=visualScene(visualDocumentSchema.parse(document),target),svg=sceneSvg(scene);
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 try {const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error('This browser could not render the visual.'));image.src=url;});
  const canvas=window.document.createElement('canvas');canvas.width=scene.width;canvas.height=scene.height;const context=canvas.getContext('2d');if(!context)throw Error('Canvas rendering unavailable.');context.drawImage(image,0,0);return canvas;
 }finally{URL.revokeObjectURL(url);}
}
function canvasBlob(canvas:HTMLCanvasElement,type:string):Promise<Blob>{return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export unavailable.')),type,.94));}
export function downloadVisualBlob(blob:Blob,filename:string){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;try{document.body.appendChild(link);link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}}
export async function visualPng(document:VisualDocument,target:VisualTarget){return canvasBlob(await renderVisualCanvas(document,target),'image/png');}
export async function visualCarouselPdf(document:VisualDocument){const images:Uint8Array[]=[];for(let index=0;index<6;index++){const blob=await canvasBlob(await renderVisualCanvas(document,{kind:'slide',index}),'image/jpeg');images.push(new Uint8Array(await blob.arrayBuffer()));}return new Blob([carouselPdf(images).buffer as ArrayBuffer],{type:'application/pdf'});}
export function visualPacket(document:VisualDocument,source:OutputRecord,saved:VisualRecord|null,dirty:boolean){
 return JSON.stringify({schema:'bizoveya-visual-export-v1',notice:'Private visual working copy. Source text acceptance does not approve edited visuals or publish them.',generationId:source.id,campaignId:source.campaignId,campaignVersion:source.campaignVersion,sourceReviewVersion:source.reviews[0]?.version??null,savedVersion:saved?.version??null,includesUnsavedEdits:dirty,document,sourceCitations:{pinterest:source.output.stages.content.pinterest.citations,linkedin:source.output.stages.content.linkedin.citations}},null,2);
}
