import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {renderVisualCanvas,visualPng,visualCarouselPdf,downloadVisualBlob,visualPacket} from './visual-export';
import {starterVisuals,type VisualRecord} from './visual-contracts';
import {visualSource} from './visuals.fixture';
const create=vi.fn(),draw=vi.fn(),click=vi.fn(),remove=vi.fn(),append=vi.fn();
const canvas=()=>({width:0,height:0,getContext:()=>({drawImage:draw}),toBlob:(callback:(b:Blob)=>void,type:string)=>callback(new Blob([new Uint8Array([0xff,0xd8,0xff,0xd9])],{type}))});
const draft=()=>starterVisuals(visualSource(),'Do It With AI Tools');
beforeEach(()=>{
 vi.clearAllMocks();
 vi.stubGlobal('Image',class {onload:(()=>void)|null=null;onerror:(()=>void)|null=null;set src(_value:string){queueMicrotask(()=>this.onload?.());}});
 const dom={createElement:create,body:{appendChild:append}};create.mockImplementation((tag:string)=>tag==='canvas'?canvas():{href:'',download:'',click,remove});
 vi.stubGlobal('document',dom);vi.stubGlobal('window',{document:dom});
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:local-test');vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{});
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
describe('browser-local visual export boundaries with mocked Canvas',()=>{
 it('draws fixed-size PNG scenes and revokes SVG URLs',async()=>{const rendered=await renderVisualCanvas(draft(),{kind:'pin',index:0});expect(rendered.width).toBe(1000);expect(rendered.height).toBe(1500);expect(draw).toHaveBeenCalledTimes(1);expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:local-test');const blob=await visualPng(draft(),{kind:'slide',index:5});expect(blob.type).toBe('image/png');});
 it('revokes object URLs when an image fails to decode',async()=>{vi.stubGlobal('Image',class{onerror:(()=>void)|null=null;set src(_value:string){queueMicrotask(()=>this.onerror?.());}});await expect(renderVisualCanvas(draft(),{kind:'pin',index:0})).rejects.toThrow('could not render');expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);expect(draw).not.toHaveBeenCalled();});
 it('renders six slides sequentially into a PDF and rejects unfitting text before drawing',async()=>{const blob=await visualCarouselPdf(draft());expect(blob.type).toBe('application/pdf');expect(await blob.text()).toContain('/Count 6');expect(draw).toHaveBeenCalledTimes(6);const bad=draft();bad.slides[0].body='W'.repeat(420);await expect(visualPng(bad,{kind:'slide',index:0})).rejects.toThrow('shorten');expect(draw).toHaveBeenCalledTimes(6);});
 it('cleans up failed download links and retains version/citation provenance in JSON',()=>{vi.spyOn(globalThis,'setTimeout').mockImplementation(((callback:()=>void)=>{callback();return 0;}) as unknown as typeof setTimeout);click.mockImplementationOnce(()=>{throw Error('download blocked');});expect(()=>downloadVisualBlob(new Blob(['private']),'test.png')).toThrow('download blocked');expect(remove).toHaveBeenCalled();expect(URL.revokeObjectURL).toHaveBeenCalled();const source=visualSource(),document=draft(),saved={generationId:source.id,version:2,sourceReviewVersion:1,document,updatedAt:'now',revisions:[]} satisfies VisualRecord;const packet=JSON.parse(visualPacket(document,source,saved,false));expect(packet.savedVersion).toBe(2);expect(packet.sourceReviewVersion).toBe(1);expect(packet.sourceCitations.linkedin).toEqual(source.output.stages.content.linkedin.citations);expect(packet).not.toHaveProperty('publish');});
});
