import {describe,it,expect} from 'vitest';
import {visualSaveRequest} from './visual-save-request';
import {starterVisuals,upgradeVisuals} from './visual-contracts';
import {visualSource,id} from './visuals.fixture';
import {createPrivateTemplate,applyPrivateTemplate,recipeFromVisuals,privateTemplateInventorySchema} from './private-template-contracts';
const base=()=>upgradeVisuals(starterVisuals(visualSource(),'Brand'));
const pinned=()=>applyPrivateTemplate(createPrivateTemplate(id,id,recipeFromVisuals(base(),'Private'),'2026-10-10T12:00:00Z'),id,{templateId:id,version:1,renderer:'campaign-scenes-v2'},base()).document;
describe('reviewed template save routing',()=>{
 it('uses atomic apply for a new reference without accepting client provenance',()=>{const document=pinned(),before=JSON.stringify(document),request=visualSaveRequest('/private/visuals',document,base(),id,3,2);expect(request.url).toBe(`/private/templates/${id}/apply`);expect(request.body).toMatchObject({expectedVersion:3,sourceReviewVersion:2,templateVersion:1,reviewed:true,document:{schema:'campaign-visuals-v2'}});expect(request.body.document).not.toHaveProperty('templateReference');expect(JSON.stringify(document)).toBe(before);});
 it('preserves provenance on ordinary edits after application',()=>{const previous=pinned(),document={...previous,pins:[{...previous.pins[0],title:'Edited title'},previous.pins[1]] as typeof previous.pins};const request=visualSaveRequest('/private/visuals',document,previous,id,4,2);expect(request.url).toBe('/private/visuals');expect(request.body.document).toEqual(document);expect(request.body).not.toHaveProperty('templateVersion');});
 it('uses atomic apply when restoring a different pinned version',()=>{const previous=pinned(),document={...previous,templateReference:{...previous.templateReference,version:2}};expect(visualSaveRequest('/private/visuals',document,previous,id,4,2).url).toContain('/apply');});
 it('accepts the complete SQL inventory quota and rejects overflow',()=>{const summary={templateId:id,version:1,archived:false,name:'Private'};expect(privateTemplateInventorySchema.safeParse(Array(32).fill(summary)).success).toBe(true);expect(privateTemplateInventorySchema.safeParse(Array(33).fill(summary)).success).toBe(false);});
});
