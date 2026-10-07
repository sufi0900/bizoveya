import React from 'react';
import {visualScene,type VisualTarget} from './visual-layout';
import type {VisualDocument} from './visual-contracts';
export function VisualPreview({document,target}:{document:VisualDocument;target:VisualTarget}){
 const scene=visualScene(document,target);
 return <svg role="img" aria-label={scene.title} viewBox={`0 0 ${scene.width} ${scene.height}`} style={{display:'block',width:'100%',height:'auto',borderRadius:12}}>
  <title>{scene.title}</title>{scene.shapes.map((shape,index)=><rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.radius??0} fill={shape.fill}/>)}
  {scene.blocks.map(block=><text key={block.id} fontFamily="Arial, sans-serif" fontSize={block.size} fontWeight={block.weight} fill={block.fill}>{block.lines.slice(0,block.maxLines).map((line,index)=><tspan key={index} x={block.x} y={block.y+index*block.lineHeight}>{line}</tspan>)}</text>)}
 </svg>;
}
