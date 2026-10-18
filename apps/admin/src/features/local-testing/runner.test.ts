import {describe,it,expect,vi} from 'vitest';
import {context} from './fixture';
import {fixtureStage,ollamaStage,rehearse} from './runner';
import {localTestingEnabled,loopbackOrigin} from './contracts';
const signal=()=>new AbortController().signal;
describe('local testing isolation',()=>{
 it('cannot be enabled on production, Vercel or without explicit opt-in',()=>{
  expect(localTestingEnabled({NODE_ENV:'development',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'})).toBe(true);
  for(const env of [{NODE_ENV:'production',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'},{NODE_ENV:'development',VERCEL:'1',BIZOVEYA_ENABLE_LOCAL_TESTING:'true'},{NODE_ENV:'development'}])expect(localTestingEnabled(env)).toBe(false);
 });
 it.each(['https://localhost:3001','http://localhost.evil.com','http://user:pass@localhost','http://169.254.169.254','http://example.com'])('rejects nonlocal origin %s',url=>expect(loopbackOrigin(url)).toBe(false));
 it.each(['http://localhost:3001','http://127.0.0.1:3001','http://[::1]:3001'])('permits loopback %s',url=>expect(loopbackOrigin(url)).toBe(true));
});
describe('local real transport and shared validation',()=>{
 it('passes outputs to subsequent stages with schema guidance and no remote provider',async()=>{
  const snapshot=context().snapshot;const transport=vi.fn().mockImplementation(async(url,options)=>{
   expect(url).toBe('http://127.0.0.1:11434/api/chat');expect(options.redirect).toBe('error');
   const body=JSON.parse(options.body);expect(body.model).toBe('qwen3:8b');expect(body.stream).toBe(false);expect(body.tools).toBeUndefined();expect(body.format.type).toBe('object');
   const kind=['coordinator','content','quality'][transport.mock.calls.length-1] as 'coordinator'|'content'|'quality';
   if(kind==='content')expect(JSON.parse(body.messages[1].content).prior.coordinator).toBeDefined();
   const output=fixtureStage(kind,snapshot).output;
   return new Response(JSON.stringify({model:'qwen3:8b',done:true,done_reason:'stop',message:{content:JSON.stringify(output)},prompt_eval_count:100,eval_count:50}));
  });
  const result=await rehearse(snapshot,'ollama','qwen3:8b',signal(),transport);
  expect(result.status).toBe('local_outputs_for_review');expect(result.stages).toHaveLength(3);expect(transport).toHaveBeenCalledTimes(3);
 });
 it('stops after one rejected request without retry or fallback',async()=>{
  const transport=vi.fn().mockResolvedValue(new Response('',{status:500}));
  const result=await rehearse(context().snapshot,'ollama','qwen3:8b',signal(),transport);
  expect(result.status).toBe('failed');expect(transport).toHaveBeenCalledTimes(1);expect(result.stages[0].inputTokens).toBeNull();
 });
 it('rejects forged citations while retaining reported usage',async()=>{
  const transport=vi.fn().mockResolvedValue(new Response(JSON.stringify({model:'qwen3:8b',done:true,done_reason:'stop',message:{content:JSON.stringify({...fixtureStage('coordinator',context().snapshot).output as object,requiredFacts:[{sourceId:crypto.randomUUID(),sourceVersion:1,factId:'x'}]})},prompt_eval_count:100,eval_count:50})));
  expect(await ollamaStage('coordinator',context().snapshot,{},'qwen3:8b',signal(),transport)).toMatchObject({error:'local_output_invalid',output:null,inputTokens:100,outputTokens:50});
 });
 it('identifies output truncation and missing model',async()=>{
  const t=vi.fn().mockResolvedValue(new Response(JSON.stringify({done:true,done_reason:'length',prompt_eval_count:5,eval_count:1500})));
  expect(await ollamaStage('content',context().snapshot,{},'qwen3:8b',signal(),t)).toMatchObject({error:'output_limit',outputTokens:1500});
  t.mockResolvedValue(new Response('',{status:404}));expect(await ollamaStage('content',context().snapshot,{},'qwen3:8b',signal(),t)).toMatchObject({error:'local_model_missing'});
 });
 it('labels fixtures synthetic and never claims AI quality approval',async()=>{
  const t=vi.fn();const r=await rehearse(context().snapshot,'fixture','',signal(),t);expect(t).not.toHaveBeenCalled();expect(r.status).toBe('synthetic_workflow_checked');expect(r.stages[2].output).toMatchObject({approved:false});expect(r.stages[2].inputTokens).toBeNull();
 });
 it('does not call a provider when cancelled',async()=>{const c=new AbortController();c.abort();const t=vi.fn();expect((await rehearse(context().snapshot,'ollama','qwen3:8b',c.signal,t)).status).toBe('cancelled');expect(t).not.toHaveBeenCalled();});
 it('bounds response bytes and stops malformed JSON',async()=>{for(const body of ['broken','x'.repeat(262145)]){const t=vi.fn().mockResolvedValue(new Response(body));expect((await rehearse(context().snapshot,'ollama','qwen3:8b',signal(),t)).status).toBe('failed');expect(t).toHaveBeenCalledTimes(1);}});
});
