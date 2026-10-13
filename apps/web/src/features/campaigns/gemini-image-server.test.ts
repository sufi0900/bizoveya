import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import { generateGeminiImage } from './gemini-image-server';
const png=Buffer.from([137,80,78,71,13,10,26,10]);
afterEach(()=>vi.restoreAllMocks());
describe('Gemini image transport',()=>{
 it('makes one bounded image-only request and reports total-minus-input output usage',async()=>{process.env.GEMINI_API_KEY='synthetic';const request=vi.spyOn(globalThis,'fetch').mockResolvedValue(Response.json({candidates:[{finishReason:'STOP',content:{parts:[{inlineData:{mimeType:'image/png',data:png.toString('base64')}}]}}],usageMetadata:{promptTokenCount:12,totalTokenCount:40}}));const result=await generateGeminiImage('gemini-3.1-flash-lite-image','A private blue assistant illustration','2:3');expect(result).toMatchObject({mime:'image/png',inputTokens:12,outputTokens:28});expect(request).toHaveBeenCalledTimes(1);const init=request.mock.calls[0][1] as RequestInit;expect(JSON.parse(String(init.body)).generationConfig).toMatchObject({responseModalities:['IMAGE'],imageConfig:{aspectRatio:'2:3',imageSize:'1K'}});});
 it('rejects invalid media signatures and never retries',async()=>{process.env.GEMINI_API_KEY='synthetic';const request=vi.spyOn(globalThis,'fetch').mockResolvedValue(Response.json({candidates:[{finishReason:'STOP',content:{parts:[{inlineData:{mimeType:'image/png',data:Buffer.from('not png').toString('base64')}}]}}]}));await expect(generateGeminiImage('gemini-image','A sufficiently long prompt','1:1')).rejects.toThrow('signature');expect(request).toHaveBeenCalledTimes(1);});
});
