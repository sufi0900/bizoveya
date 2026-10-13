'use client';
import React, { useEffect, useState } from 'react';
import { useGeminiLiveVoice } from './use-gemini-live-voice';

export function FounderLiveVoice({endpoint,qualificationVersion,owner,onUseTranscript}:{endpoint:string;qualificationVersion:number|null;owner:boolean;onUseTranscript:(text:string)=>void}){
 const voice=useGeminiLiveVoice(endpoint,qualificationVersion),[corrected,setCorrected]=useState('');useEffect(()=>{if(voice.founderTranscript)setCorrected(voice.founderTranscript);},[voice.founderTranscript]);const active=['connecting','listening','speaking','stopping'].includes(voice.status);
 return <section aria-labelledby="live-voice-heading"><h3 id="live-voice-heading">Private live voice</h3><p>{voice.available?'Use the microphone to clarify a request with Gemini. The assistant has no tools and cannot save or publish. Stop, correct the founder transcript, then transfer it into the separately reviewed proposal form.':'Live voice is disabled until an owner qualifies a current Gemini Live model, API access and accounting. Typed text and pasted transcripts remain available.'}</p>
  <div className="bz-actions"><button className="bz-button" type="button" disabled={!owner||!voice.available||active} onClick={()=>void voice.start()}>{voice.status==='connecting'?'Connecting…':'Start microphone'}</button><button className="bz-button secondary" type="button" disabled={!active||voice.status==='stopping'} onClick={()=>void voice.stop()}>Stop voice</button></div>
  <p role="status" aria-live="polite">Session: {voice.status}{voice.status==='speaking'?' · playback can be interrupted by speaking':''}</p>{voice.error&&<p role="alert">{voice.error}</p>}
  {voice.items.length>0&&<div aria-label="Live transcript" aria-live="polite">{voice.items.map((item,index)=><p key={`${item.speaker}-${index}`}><strong>{item.speaker==='founder'?'Founder':'Assistant'}:</strong> {item.text}</p>)}</div>}
  <label>Corrected founder transcript<textarea maxLength={2000} value={corrected} onChange={event=>setCorrected(event.target.value)} placeholder="Example: Prepare private Blog, Pinterest and LinkedIn drafts for our verified product update. Use approved facts only." /></label>
  <button className="bz-button" type="button" disabled={!owner||!corrected.trim()||active} onClick={()=>onUseTranscript(corrected.trim())}>Use corrected transcript in proposal</button><p><small>This transfer does not save or execute anything. Review the exact text, type, channels or meeting roles, then confirm the proposal below.</small></p>
 </section>;
}
