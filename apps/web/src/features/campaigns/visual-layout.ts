import type {VisualDocument} from './visual-contracts';
export type VisualTarget={kind:'pin';index:0|1}|{kind:'slide';index:number}|{kind:'linkedin';index:0};
export type TextBlock={id:string;text:string;lines:string[];x:number;y:number;size:number;lineHeight:number;maxLines:number;fill:string;weight:number;overflow:boolean};
export type Shape={x:number;y:number;width:number;height:number;fill:string;radius?:number};
export type VisualScene={width:number;height:number;title:string;shapes:Shape[];blocks:TextBlock[]};

// Conservative glyph widths leave space for the browser's local Arial/sans fallback.
function glyphWidth(char:string,size:number){return size*(/[MW@%]/.test(char)?1:/[ilI.,' :;!|]/.test(char)?.35:/[^\x20-\x7e]/.test(char)?1:.72);}
export function wrapVisualText(text:string,width:number,size:number):string[]{
 const lines:string[]=[];let line='';let used=0;
 for(const word of text.trim().split(/\s+/).filter(Boolean)){
  const wordWidth=[...word].reduce((sum,char)=>sum+glyphWidth(char,size),0);
  if(line&&used+glyphWidth(' ',size)+wordWidth>width){lines.push(line);line='';used=0;}
  for(const char of word){const w=glyphWidth(char,size);if(used+w>width&&line){lines.push(line);line='';used=0;}line+=char;used+=w;}
  // A space belongs between words, never after a broken line.
  line+=' ';used+=glyphWidth(' ',size);
 }
 if(line.trim())lines.push(line.trim());return lines.map(value=>value.trimEnd());
}
function block(id:string,text:string,x:number,y:number,size:number,width:number,maxLines:number,lineHeight:number,fill:string,weight=400):TextBlock {
 const lines=wrapVisualText(text,width,size);return {id,text,lines,x,y,size,maxLines,lineHeight,fill,weight,overflow:lines.length>maxLines};
}
function classicScene(document:VisualDocument,target:VisualTarget):VisualScene {
 const accent=document.brand.accent;
 if(target.kind==='linkedin'){
  if(document.schema!=='campaign-visuals-v2')throw Error('Add the LinkedIn image before exporting it.');
  const title=block('title',document.linkedin.title,100,260,52,880,4,68,'#101A34',700);
  const bodyY=260+(Math.max(1,Math.min(title.lines.length,4))-1)*68+90;
  return {width:1080,height:1080,title:'LinkedIn post image',shapes:[{x:0,y:0,width:1080,height:1080,fill:'#F4F6FF'},{x:0,y:0,width:1080,height:24,fill:accent},{x:64,y:180,width:952,height:744,fill:'#FFFFFF',radius:32}],blocks:[block('brand',document.brand.name,84,100,30,912,2,42,'#101A34',700),title,block('body',document.linkedin.body,100,bodyY,34,880,9,44,'#34415D'),block('footer',document.brand.footer,84,1000,24,912,2,32,'#34415D')]};
 }

 if(target.kind==='pin'){
  const content=document.pins[target.index];const dark=target.index===1;
  const title=block('title',content.title,100,330,64,800,6,84,dark?'#FFFFFF':'#101A34',700);
  const bodyY=330+(Math.max(1,Math.min(title.lines.length,6))-1)*84+110;
  return {width:1000,height:1500,title:`Pinterest design ${target.index+1}`,shapes:[{x:0,y:0,width:1000,height:1500,fill:dark?'#101A34':'#F4F6FF'},{x:0,y:0,width:1000,height:24,fill:accent},{x:68,y:210,width:864,height:1040,fill:dark?'#192745':'#FFFFFF',radius:32},{x:84,y:1360,width:140,height:8,fill:accent}],blocks:[
   block('brand',document.brand.name,84,110,32,832,2,44,dark?'#FFFFFF':'#101A34',700),
   title,
   block('body',content.body,100,bodyY,40,800,8,48,dark?'#E1E7F7':'#34415D'),
   block('footer',document.brand.footer,84,1412,24,832,2,32,dark?'#E1E7F7':'#34415D'),
  ]};
 }
 const slide=document.slides[target.index];if(!slide)throw Error('Unknown slide.');
 const title=block('title',slide.title,100,290,60,880,4,80,'#101A34',700);
 const bodyY=290+(Math.max(1,Math.min(title.lines.length,4))-1)*80+110;
 return {width:1080,height:1350,title:`LinkedIn slide ${target.index+1}`,shapes:[{x:0,y:0,width:1080,height:1350,fill:'#F4F6FF'},{x:0,y:0,width:1080,height:24,fill:accent},{x:64,y:192,width:952,height:948,fill:'#FFFFFF',radius:32},{x:84,y:1200,width:140,height:8,fill:accent}],blocks:[
  block('brand',document.brand.name,84,100,30,800,2,42,'#101A34',700),
  block('number',`${target.index+1} / 6`,914,100,24,90,1,32,'#34415D'),
  title,
  block('body',slide.body,100,bodyY,46,880,8,64,'#34415D'),
  block('footer',document.brand.footer,84,1260,24,912,2,32,'#34415D'),
 ]};
}
/** Fixed allowlisted templates share text geometry; v1 retains its exact scenes. */
export function visualScene(document:VisualDocument,target:VisualTarget):VisualScene {
 const scene=classicScene(document,target);
 if(document.schema==='campaign-visuals-v1')return scene;
 const id=target.kind==='pin'?document.templates.pins[target.index]:target.kind==='slide'?document.templates.carousel:document.templates.linkedin;
 const w=scene.width,h=scene.height,a=document.brand.accent;
 // Normalize the legacy dark second pin before applying an explicitly selected template.
 const light=()=>scene.blocks.forEach(b=>{b.fill=b.weight===700?'#101A34':'#34415D';});
 if(id==='classic'){light();scene.shapes[0].fill='#F4F6FF';if(scene.shapes[2])scene.shapes[2].fill='#FFFFFF';}
 if(id==='midnight'){scene.shapes[0].fill='#101A34';if(scene.shapes[2])scene.shapes[2].fill='#192745';scene.blocks.forEach(b=>{b.fill=b.weight===700?'#FFFFFF':'#E1E7F7';});}
 if(id==='editorial'){light();scene.shapes=[{x:0,y:0,width:w,height:h,fill:'#FFF9ED'},{x:48,y:48,width:8,height:h-96,fill:a},{x:w-56,y:48,width:8,height:h-96,fill:a},{x:84,y:175,width:w-168,height:4,fill:'#101A34'},{x:84,y:h-150,width:w-168,height:4,fill:'#101A34'}];scene.blocks.filter(b=>b.id==='title').forEach(b=>{b.weight=400;});}
 if(id==='headline'){light();scene.shapes=[{x:0,y:0,width:w,height:h,fill:'#FFFFFF'},{x:0,y:0,width:w,height:185,fill:'#101A34'},{x:0,y:185,width:28,height:h-185,fill:a},{x:84,y:h-160,width:160,height:8,fill:a}];scene.blocks.filter(b=>b.id==='brand'||b.id==='number').forEach(b=>{b.fill='#FFFFFF';});}
 return scene;
}
export function visualProblems(document:VisualDocument):string[]{
 const targets:VisualTarget[]=[{kind:'pin',index:0},{kind:'pin',index:1},...Array.from({length:6},(_,index)=>({kind:'slide' as const,index})),...(document.schema==='campaign-visuals-v2'?[{kind:'linkedin' as const,index:0 as const}]:[])];
 return targets.flatMap(target=>{const scene=visualScene(document,target);return scene.blocks.filter(b=>b.overflow||!b.text.trim()).map(b=>`${scene.title}: shorten or complete ${b.id} text so it fits.`);});
}
const xml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]!));
export function sceneSvg(scene:VisualScene):string {
 if(scene.blocks.some(block=>block.overflow||!block.text.trim()))throw Error('Complete or shorten the visual text before exporting.');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}"><title>${xml(scene.title)}</title>${scene.shapes.map(s=>`<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="${s.radius??0}" fill="${xml(s.fill)}"/>`).join('')}${scene.blocks.map(b=>`<text font-family="Arial, sans-serif" font-size="${b.size}" font-weight="${b.weight}" fill="${xml(b.fill)}">${b.lines.map((line,index)=>`<tspan x="${b.x}" y="${b.y+index*b.lineHeight}">${xml(line)}</tspan>`).join('')}</text>`).join('')}</svg>`;
}
