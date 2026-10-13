import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe,expect,it,vi } from 'vitest';
vi.mock('./use-gemini-live-voice',()=>({useGeminiLiveVoice:(_endpoint:string,version:number|null)=>({status:'idle',error:'',items:[],founderTranscript:'',start:vi.fn(),stop:vi.fn(),available:version!==null})}));
import { FounderLiveVoice } from './founder-live-voice';
describe('founder live voice review UI',()=>{
 it('keeps typed work available when voice is unqualified',()=>{const html=renderToStaticMarkup(createElement(FounderLiveVoice,{endpoint:'/voice',qualificationVersion:null,owner:true,onUseTranscript:vi.fn()}));expect(html).toContain('Live voice is disabled');expect(html).toContain('Typed text and pasted transcripts remain available');expect(html).toContain('Start microphone');expect(html).toContain('disabled');});
 it('explains the no-tools and separate-review boundary when qualified',()=>{const html=renderToStaticMarkup(createElement(FounderLiveVoice,{endpoint:'/voice',qualificationVersion:2,owner:true,onUseTranscript:vi.fn()}));expect(html).toContain('assistant has no tools');expect(html).toContain('cannot save or publish');expect(html).toContain('Use corrected transcript in proposal');expect(html).toContain('does not save or execute anything');});
});
