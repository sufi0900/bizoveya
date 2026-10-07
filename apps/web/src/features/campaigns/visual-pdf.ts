/** Local raster PDF: six JPEG pages from the same SVG scene used for previews. */
export function carouselPdf(images:Uint8Array[]):Uint8Array {
 if(images.length!==6||images.some(image=>image.length<4||image[0]!==0xff||image[1]!==0xd8||image[image.length-2]!==0xff||image[image.length-1]!==0xd9))throw Error('Six complete JPEG slides are required.');
 const encode=(text:string)=>new TextEncoder().encode(text),parts:Uint8Array[]=[];const offsets=[0];let size=0;
 const append=(bytes:Uint8Array)=>{parts.push(bytes);size+=bytes.length;};
 const object=(id:number,body:string|Uint8Array)=>{offsets[id]=size;append(encode(`${id} 0 obj\n`));append(typeof body==='string'?encode(body):body);append(encode('\nendobj\n'));};
 const stream=(prefix:string,bytes:Uint8Array)=>{const start=encode(`${prefix} /Length ${bytes.length} >>\nstream\n`),end=encode('\nendstream');const value=new Uint8Array(start.length+bytes.length+end.length);value.set(start);value.set(bytes,start.length);value.set(end,start.length+bytes.length);return value;};
 append(encode('%PDF-1.4\n%BIZOVEYA\n'));
 object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,`<< /Type /Pages /Count 6 /Kids [${images.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] >>`);
 images.forEach((image,index)=>{const page=3+index*3,img=page+1,content=page+2;
  object(page,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 540 675] /Resources << /XObject << /Slide ${img} 0 R >> >> /Contents ${content} 0 R >>`);
  object(img,stream('<< /Type /XObject /Subtype /Image /Width 1080 /Height 1350 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode',image));
  object(content,stream('<<',encode('q\n540 0 0 675 0 0 cm\n/Slide Do\nQ')));
 });
 const xref=size;append(encode(`xref\n0 21\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 21 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
 const result=new Uint8Array(size);let pos=0;for(const part of parts){result.set(part,pos);pos+=part.length;}return result;
}
