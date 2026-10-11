import type {MediaVisualDocument} from './media-visual-contracts';
import {mediaVisualSvg,type VerifiedMediaImage} from './media-visual-render';
import {visualScene,type VisualTarget} from './visual-layout';
import {renderSvgCanvas,canvasBlob} from './visual-export';
import {carouselPdf} from './visual-pdf';
async function canvas(document:MediaVisualDocument,target:VisualTarget,images:readonly VerifiedMediaImage[]){
 const svg=mediaVisualSvg(document,target,images),scene=visualScene(document.document,target);
 return renderSvgCanvas(svg,scene.width,scene.height);
}
export async function mediaVisualPng(document:MediaVisualDocument,target:VisualTarget,images:readonly VerifiedMediaImage[]){return canvasBlob(await canvas(document,target,images),'image/png');}
export async function mediaVisualPdf(document:MediaVisualDocument,images:readonly VerifiedMediaImage[]){
 // Validate every scene before drawing; a missing later asset cannot leave a partial download.
 for(let index=0;index<6;index++)mediaVisualSvg(document,{kind:'slide',index},images);
 const pages:Uint8Array[]=[];
 for(let index=0;index<6;index++)pages.push(new Uint8Array(await (await canvasBlob(await canvas(document,{kind:'slide',index},images),'image/jpeg')).arrayBuffer()));
 return new Blob([carouselPdf(pages).buffer as ArrayBuffer],{type:'application/pdf'});
}
