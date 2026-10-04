import React from 'react';
import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {GeneratedDrafts} from './outputs';
import {canAcceptOutput,type OutputRecord} from './output-contracts';
import {reviewGenerationSchema} from './contracts';
const id='11111111-1111-4111-8111-111111111111',citation={sourceId:id,sourceVersion:1,factId:'f1'};
function record():OutputRecord{return {id,campaignId:id,campaignVersion:1,status:'succeeded',reviews:[],output:{schema:'campaign-generation-output-v1',stages:{coordinator:{schema:'campaign-plan-v1',topic:'AI workflow',audience:'Founders',objective:'Explain workflow',requiredFacts:[citation],channelNotes:{blog:'Explain',pinterest:'Summarize',linkedin:'Discuss'}},content:{schema:'campaign-drafts-v1',blog:{title:'Draft',summary:'Summary',body:'<script>alert("unsafe")</script>',citations:[citation]},pinterest:{title:'Pin',description:'Pin description',altText:'Suggested alt text',citations:[citation]},linkedin:{post:'LinkedIn draft',citations:[citation]}},quality:{schema:'campaign-quality-v1',approved:true,issues:[],checkedCitations:[citation]}}}};}
describe('private generated output review',()=>{
 it('distinguishes empty snapshots from generated output',()=>{expect(renderToStaticMarkup(<GeneratedDrafts records={[]} endpoint="/private/reviews" canReview/>)).toContain('Snapshot preparation alone does not generate content');});
 it('renders all channels as escaped text with references and human-review boundary',()=>{const html=renderToStaticMarkup(<GeneratedDrafts records={[record()]} endpoint="/private/reviews" canReview/>);expect(html).toContain('Copy blog');expect(html).toContain('Copy Pinterest text');expect(html).toContain('Copy LinkedIn post');expect(html).toContain('&lt;script&gt;');expect(html).not.toContain('<script>');expect(html).toContain('fact f1');expect(html).toContain('human review required');});
 it('disables owner-only review controls for read-only users',()=>{const html=renderToStaticMarkup(<GeneratedDrafts records={[record()]} endpoint="/private/reviews" canReview={false}/>);expect(html).toContain('<fieldset disabled=""');expect(html).toContain('Only the workspace owner');});
 it('blocks human acceptance of failed QA or blockers',()=>{const r=record();expect(canAcceptOutput(r)).toBe(true);r.output.stages.quality.approved=false;expect(canAcceptOutput(r)).toBe(false);r.output.stages.quality.approved=true;r.output.stages.quality.issues=[{channel:'blog',severity:'blocker',message:'Unsupported claim'}];expect(canAcceptOutput(r)).toBe(false);});
 it('requires versioned reason and rejects hidden publish/actor options',()=>{const v={id,expectedVersion:0,decision:'accepted',reason:'Reviewed claims and brand suitability'};expect(reviewGenerationSchema.safeParse(v).success).toBe(true);expect(reviewGenerationSchema.safeParse({...v,publish:true}).success).toBe(false);expect(reviewGenerationSchema.safeParse({...v,expectedVersion:-1}).success).toBe(false);});
});
