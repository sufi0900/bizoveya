import {upgradeVisuals,type VisualDocument} from './visual-contracts';
export function visualSaveRequest(endpoint:string,document:VisualDocument,previous:VisualDocument|undefined,generationId:string,expectedVersion:number,sourceReviewVersion:number){
 const stored=previous?.schema==='campaign-visuals-v3'?previous:null;
 const applying=document.schema==='campaign-visuals-v3'&&(JSON.stringify(document.templateReference)!==JSON.stringify(stored?.templateReference)||JSON.stringify(document.templateRecipe)!==JSON.stringify(stored?.templateRecipe));
 return {url:applying&&document.schema==='campaign-visuals-v3'?`${endpoint.replace(/\/visuals$/,'/templates')}/${document.templateReference.templateId}/apply`:endpoint,body:{generationId,expectedVersion,sourceReviewVersion,document:applying?upgradeVisuals(document):document,reviewed:true,...(applying&&document.schema==='campaign-visuals-v3'?{templateVersion:document.templateReference.version}:{})}};
}
