// Local synthetic scene/PDF verification. This does not create hosted/customer assets.
import {createRequire} from 'node:module';
import {mkdtemp,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const appRequire=createRequire(path.join(root,'apps/web/package.json'));
// Reuse the already installed Next/Vitest tools; no runtime dependency is added.
const sharp=createRequire(appRequire.resolve('next'))('sharp');
const esbuild=createRequire(appRequire.resolve('vitest'))('esbuild');
const output=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:await mkdtemp(path.join(tmpdir(),'bizoveya-visual-render-'));
const bundle=await esbuild.build({stdin:{contents:`export {starterVisuals,upgradeVisuals,visualTemplates} from './visual-contracts';export {visualSource} from './visuals.fixture';export {visualScene,sceneSvg,visualProblems} from './visual-layout';export {carouselPdf} from './visual-pdf';`,resolveDir:path.join(root,'apps/web/src/features/campaigns'),loader:'ts'},bundle:true,platform:'node',format:'cjs',write:false});
const filename=path.join(output,'visual-fixture.cjs');await writeFile(filename,bundle.outputFiles[0].contents);const lib=appRequire(filename);
const document=lib.upgradeVisuals(lib.starterVisuals(lib.visualSource(),'Do It With AI Tools'));if(lib.visualProblems(document).length)throw Error('Synthetic starter does not fit.');
const images=[],thumbnails=[];
for(const target of [{kind:'pin',index:0},{kind:'pin',index:1},...Array.from({length:6},(_,index)=>({kind:'slide',index})),{kind:'linkedin',index:0}]){
 const scene=lib.visualScene(document,target),svg=lib.sceneSvg(scene),base=`${target.kind}-${target.index+1}`;
 await writeFile(path.join(output,`${base}.svg`),svg);
 const png=await sharp(Buffer.from(svg)).png().toBuffer();await writeFile(path.join(output,`${base}.png`),png);
 const metadata=await sharp(png).metadata();if(metadata.width!==scene.width||metadata.height!==scene.height)throw Error('Raster dimensions mismatch.');
 thumbnails.push(await sharp(png).resize(250,375,{fit:'contain',background:'#ddd'}).png().toBuffer());
 if(target.kind==='slide')images.push(new Uint8Array(await sharp(Buffer.from(svg)).flatten({background:'#fff'}).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer()));
}
await writeFile(path.join(output,'carousel.pdf'),lib.carouselPdf(images));
await sharp({create:{width:1000,height:1125,channels:3,background:'#ddd'}}).composite(thumbnails.map((input,index)=>({input,left:index%4*250,top:Math.floor(index/4)*375}))).png().toFile(path.join(output,'contact-sheet.png'));
const templateThumbnails=[];let templateScenes=0;
for(const template of lib.visualTemplates){
 const variant={...document,templates:{pins:[template.id,template.id],carousel:template.id,linkedin:template.id}};
 if(lib.visualProblems(variant).length)throw Error('Template fixture does not fit.');
 for(const target of [{kind:'pin',index:0},{kind:'pin',index:1},...Array.from({length:6},(_,index)=>({kind:'slide',index})),{kind:'linkedin',index:0}]){
  const scene=lib.visualScene(variant,target),png=await sharp(Buffer.from(lib.sceneSvg(scene))).png().toBuffer(),metadata=await sharp(png).metadata();
  if(metadata.width!==scene.width||metadata.height!==scene.height)throw Error('Template dimensions mismatch.');
  await writeFile(path.join(output,`${template.id}-${target.kind}-${target.index+1}.png`),png);templateScenes++;
  if(target.kind==='linkedin'||target.index===0)templateThumbnails.push(await sharp(png).resize(250,375,{fit:'contain',background:'#ddd'}).png().toBuffer());
 }
}
await sharp({create:{width:1000,height:1125,channels:3,background:'#ddd'}}).composite(templateThumbnails.map((input,index)=>({input,left:index%4*250,top:Math.floor(index/4)*375}))).png().toFile(path.join(output,'template-sheet.png'));
console.log(JSON.stringify({status:'passed',output,scenes:9,templateScenes,dimensions:'pins1000x1500 / slides1080x1350 / linkedin1080x1080',pdfPages:6,scope:'Shared scene SVG rasterized with local Sharp, not browser canvas/download or hosted acceptance.'}));
