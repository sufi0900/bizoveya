import {describe,it,expect,vi,beforeEach} from 'vitest';
import {starterAgent,agentKinds} from '@bizoveya/agent-contract';
import type {Claim} from './contracts';
const transport=vi.hoisted(()=>vi.fn());
vi.mock('../model-tests/provider',()=>({restrictedFetch:transport}));
import {generateStage} from './provider';
const source='11111111-1111-4111-8111-111111111111';const citation={sourceId:source,sourceVersion:1,factId:'f1'};
const outputs={coordinator:{schema:'campaign-plan-v1',topic:'AI workflows',audience:'Freelancers',objective:'Explain a practical workflow',requiredFacts:[citation],channelNotes:{blog:'Explain workflow',pinterest:'Summarize workflow',linkedin:'Discuss workflow'}},content:{schema:'campaign-drafts-v1',blog:{title:'AI workflows',summary:'A practical introduction',body:'Use AI thoughtfully and review outputs.',citations:[citation]},pinterest:{title:'AI workflows',description:'Discover a practical approach.',altText:'Text summarizing an AI workflow',citations:[citation]},linkedin:{post:'Use AI thoughtfully and review outputs.',citations:[citation]}},quality:{schema:'campaign-quality-v1',approved:true,issues:[],checkedCitations:[citation]}};
function context():Claim{return {execute:true,inputLimit:32768,outputLimit:1500,prior:{},snapshot:{schema:'campaign-generation-input-v1',campaign:{id:source,version:1,document:{title:'AI workflows',brief:'Use approved facts only',blog:'manual text is not evidence',pinterest:'',linkedin:''}},preferences:{version:0,document:{brandVoice:'Practical',audience:'Freelancers',guidance:'Draft only'}},knowledge:[{sourceId:source,sourceVersion:1,title:'Facts',facts:[{id:'f1',text:'Our website explains AI workflows.'}],approvedAt:'2026-10-04T00:00:00Z'}],stages:agentKinds.map(kind=>({kind,agentId:source,agentVersion:1,agent:{...starterAgent(kind),modelTier:'economical'},profile:{name:'Fixture',provider:'gemini',credentialRef:'platform-gemini',modelId:'fixture-model',tier:'economical',maxOutputTokens:1500,dailyBudgetCents:100}})),limits:{maxStages:3,maxAttemptsPerStage:1,publish:false,externalTools:false}}};}

const env={BIZOVEYA_GEMINI_API_KEY:'synthetic-never-sent'};
function response(text:string,finishReason='STOP'){return new Response(JSON.stringify({candidates:[{content:{role:'model',parts:[{text}]},finishReason}],usageMetadata:{promptTokenCount:100,candidatesTokenCount:200,totalTokenCount:300}}),{status:200,headers:{'Content-Type':'application/json'}});}
describe('Gemini draft transport (synthetic only)',()=>{
 beforeEach(()=>transport.mockReset());
 it('sends content schema and returns all channels with usage',async()=>{
 transport.mockResolvedValue(response(JSON.stringify(outputs.content)));
 const result=await generateStage('content',context(),env);
 expect(result).toMatchObject({error:null,inputTokens:100,outputTokens:200,output:outputs.content});
 const body=JSON.parse(transport.mock.calls[0][1].body);
 expect(body.generationConfig.responseMimeType).toBe('application/json');
 expect(body.generationConfig.maxOutputTokens).toBe(1500);
 expect(body.generationConfig.responseJsonSchema.properties.schema.enum).toEqual(['campaign-drafts-v1']);
 expect(Object.keys(body.generationConfig.responseJsonSchema.properties)).toEqual(['schema','blog','pinterest','linkedin']);
 expect(transport).toHaveBeenCalledTimes(1);
 });
 it('retains usage when successful HTTP response has invalid output',async()=>{
 transport.mockResolvedValue(response('{"invalid":true}'));
 const result=await generateStage('content',context(),env);
 expect(result.error).toBe('structured_output_invalid');expect(result.inputTokens).toBe(100);expect(result.outputTokens).toBe(200);expect(result.output).toBeNull();expect(transport).toHaveBeenCalledTimes(1);
 });
 it('identifies truncation with usage and no retry',async()=>{
 transport.mockResolvedValue(response('{"schema":','MAX_TOKENS'));
 const result=await generateStage('content',context(),env);expect(result.error).toBe('output_limit');expect(result.inputTokens).toBe(100);expect(transport).toHaveBeenCalledTimes(1);
 });
 it('identifies quota response without fabricating usage',async()=>{
 transport.mockResolvedValue(new Response(JSON.stringify({error:{code:429,message:'synthetic quota',status:'RESOURCE_EXHAUSTED'}}),{status:429,headers:{'Content-Type':'application/json'}}));
 expect(await generateStage('content',context(),env)).toMatchObject({error:'rate_limited',inputTokens:null,outputTokens:null});expect(transport).toHaveBeenCalledTimes(1);
 });
});
