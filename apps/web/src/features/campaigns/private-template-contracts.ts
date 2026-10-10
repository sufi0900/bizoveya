import {z} from 'zod';
import {upgradeVisuals,visualDocumentV2Schema,visualDocumentV3Schema,type VisualDocument} from './visual-contracts';
import {visualProblems} from './visual-layout';

// A reusable design contains no campaign wording, source IDs, URLs or executable nodes.
const name=z.string().trim().min(1).max(80).refine(value=>!/[\u0000-\u001f]/.test(value));
export const privateTemplateRecipeSchema=z.object({
 schema:z.literal('private-template-recipe-v1'),
 renderer:z.literal('campaign-scenes-v2'),
 name,
 brand:visualDocumentV2Schema.shape.brand,
 templates:visualDocumentV2Schema.shape.templates,
}).strict();
export type PrivateTemplateRecipe=z.infer<typeof privateTemplateRecipeSchema>;
export const privateTemplateReferenceSchema=z.object({
 templateId:z.uuid(),version:z.number().int().min(1).max(50),
 renderer:z.literal('campaign-scenes-v2'),
}).strict();
export const privateTemplateVersionSchema=z.object({
 templateId:z.uuid(),creatorId:z.uuid(),version:z.number().int().min(1).max(50),
 recipe:privateTemplateRecipeSchema,createdAt:z.iso.datetime(),
}).strict();
export type PrivateTemplateVersion=z.infer<typeof privateTemplateVersionSchema>;
export const privateTemplateRecordSchema=z.object({
 templateId:z.uuid(),creatorId:z.uuid(),archived:z.boolean(),
 versions:z.array(privateTemplateVersionSchema).min(1).max(50),
}).strict().superRefine((record,ctx)=>{
 record.versions.forEach((revision,index)=>{
  if(revision.templateId!==record.templateId||revision.creatorId!==record.creatorId||revision.version!==index+1)
   ctx.addIssue({code:'custom',message:'Template versions must retain identity and contiguous order.',path:['versions',index]});
 });
});
export type PrivateTemplateRecord=z.infer<typeof privateTemplateRecordSchema>;
export const privateTemplateSummarySchema=z.object({
 templateId:z.uuid(),version:z.number().int().min(1).max(50),archived:z.boolean(),name,
}).strict();
export const privateTemplateInventorySchema=z.array(privateTemplateSummarySchema).max(32);
export const savePrivateTemplateSchema=z.object({
 templateId:z.uuid(),expectedVersion:z.number().int().min(0).max(49),recipe:privateTemplateRecipeSchema,
}).strict();
export const archivePrivateTemplateSchema=z.object({expectedVersion:z.number().int().min(1).max(50)}).strict();
export const applyPrivateTemplateSchema=z.object({generationId:z.uuid(),expectedVersion:z.number().int().nonnegative(),sourceReviewVersion:z.number().int().positive(),templateVersion:z.number().int().min(1).max(50),reviewed:z.literal(true),document:visualDocumentV2Schema}).strict();

export class PrivateTemplateError extends Error {
 constructor(public readonly reason:'unavailable'|'conflict'|'limit'|'overflow') {super(`Private template ${reason}.`);}
}
// The caller supplies a server-authenticated actor, never a creator from form input.
function owned(raw:unknown,actorId:string):PrivateTemplateRecord {
 const record=privateTemplateRecordSchema.parse(raw);
 if(record.creatorId!==actorId)throw new PrivateTemplateError('unavailable');
 return record;
}
export function recipeFromVisuals(document:VisualDocument,templateName:string):PrivateTemplateRecipe {
 const parsed=visualDocumentV2Schema.parse(upgradeVisuals(document));
 return privateTemplateRecipeSchema.parse({schema:'private-template-recipe-v1',renderer:'campaign-scenes-v2',name:templateName,brand:parsed.brand,templates:parsed.templates});
}
export function createPrivateTemplate(templateId:string,actorId:string,rawRecipe:unknown,createdAt:string):PrivateTemplateRecord {
 return privateTemplateRecordSchema.parse({templateId,creatorId:actorId,archived:false,versions:[{templateId,creatorId:actorId,version:1,recipe:privateTemplateRecipeSchema.parse(rawRecipe),createdAt}]});
}
export function revisePrivateTemplate(raw:unknown,actorId:string,expectedVersion:number,rawRecipe:unknown,createdAt:string):PrivateTemplateRecord {
 const record=owned(raw,actorId);
 if(record.archived)throw new PrivateTemplateError('unavailable');
 if(record.versions.length!==expectedVersion)throw new PrivateTemplateError('conflict');
 if(record.versions.length>=50)throw new PrivateTemplateError('limit');
 const revision={templateId:record.templateId,creatorId:record.creatorId,version:expectedVersion+1,recipe:privateTemplateRecipeSchema.parse(rawRecipe),createdAt};
 return privateTemplateRecordSchema.parse({...record,versions:[...record.versions,revision]});
}
export function archivePrivateTemplate(raw:unknown,actorId:string,expectedVersion:number):PrivateTemplateRecord {
 const record=owned(raw,actorId);
 if(record.versions.length!==expectedVersion)throw new PrivateTemplateError('conflict');
 return privateTemplateRecordSchema.parse({...record,archived:true});
}
export function applyPrivateTemplate(raw:unknown,actorId:string,rawReference:unknown,document:VisualDocument) {
 const record=owned(raw,actorId),reference=privateTemplateReferenceSchema.parse(rawReference);
 if(record.archived||reference.templateId!==record.templateId)throw new PrivateTemplateError('unavailable');
 const revision=record.versions[reference.version-1];
 if(!revision)throw new PrivateTemplateError('unavailable');
 const next=visualDocumentV3Schema.parse({...upgradeVisuals(document),schema:'campaign-visuals-v3',brand:revision.recipe.brand,templates:revision.recipe.templates,templateReference:reference,templateRecipe:revision.recipe});
 if(visualProblems(next).length)throw new PrivateTemplateError('overflow');
 return {document:next,templateReference:reference};
}
