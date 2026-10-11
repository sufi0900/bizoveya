import {mediaTargetKey,mediaVisualDocumentSchema,type MediaVisualDocument} from './media-visual-contracts';
import {privateMediaDescriptorSchema,type PrivateMediaDescriptor} from './private-media-contracts';
import {sceneSvg,visualScene,type VisualTarget} from './visual-layout';

// A caller cannot turn an arbitrary URL/data string into an admitted renderer asset.
export type VerifiedMediaImage={readonly descriptor:PrivateMediaDescriptor;readonly dataUrl:string};
const admitted=new WeakSet<object>();
function base64(bytes:Uint8Array){let text='';for(let start=0;start<bytes.length;start+=16384)text+=String.fromCharCode(...bytes.subarray(start,start+16384));return btoa(text);}
export async function verifyMediaImage(input:Uint8Array,raw:unknown):Promise<VerifiedMediaImage>{
 const descriptor=privateMediaDescriptorSchema.parse(raw),bytes=new Uint8Array(input);
 if(bytes.length!==descriptor.bytes)throw Error('Image size changed. Reload the saved image.');
 const png=[137,80,78,71,13,10,26,10].every((byte,index)=>bytes[index]===byte),jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if((descriptor.mime==='image/png'&&!png)||(descriptor.mime==='image/jpeg'&&!jpeg))throw Error('Image format changed.');
 const digest=await crypto.subtle.digest('SHA-256',bytes.buffer),hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
 if(hash!==descriptor.sha256)throw Error('Image hash changed. Reload the saved image.');
 const value=Object.freeze({descriptor:Object.freeze(descriptor),dataUrl:`data:${descriptor.mime};base64,${base64(bytes)}`});admitted.add(value);return value;
}
const xml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]!));
/** Contain the complete image above a scaled text scene: no crop, overlay or hidden words. */
export function mediaVisualSvg(raw:MediaVisualDocument,target:VisualTarget,images:readonly VerifiedMediaImage[]):string {
 const value=mediaVisualDocumentSchema.parse(raw),scene=visualScene(value.document,target),original=sceneSvg(scene);
 const item=value.attachments.find(attachment=>attachment.target===mediaTargetKey(target));if(!item)return original;
 const image=images.find(candidate=>admitted.has(candidate)&&candidate.descriptor.sha256===item.reference.sha256&&candidate.descriptor.bytes===item.descriptor.bytes&&candidate.descriptor.mime===item.descriptor.mime&&candidate.descriptor.width===item.descriptor.width&&candidate.descriptor.height===item.descriptor.height);
 if(!image)throw Error('The reviewed image must be loaded and verified before preview or export.');
 const scale=.64,top=scene.height*.36,margin=24;
 const content=original.slice(original.indexOf('>')+1,original.lastIndexOf('</svg>'));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}"><title>${xml(scene.title)} with reviewed image</title><rect width="${scene.width}" height="${scene.height}" fill="#FFFFFF"/><image x="${margin}" y="${margin}" width="${scene.width-margin*2}" height="${top-margin*2}" preserveAspectRatio="xMidYMid meet" href="${image.dataUrl}"><title>${xml(item.descriptor.alt)}</title></image><g transform="translate(${scene.width*(1-scale)/2} ${top}) scale(${scale})">${content}</g></svg>`;
}
