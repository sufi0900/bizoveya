import type {CampaignDocument} from './contracts';
import type {OutputRecord} from './output-contracts';

export interface DraftDownload {filename:string; text:string}
export function campaignDownload(document:CampaignDocument, id:string, version:number, dirty:boolean):DraftDownload {
 return {filename:`bizoveya-campaign-${id || 'unsaved'}-v${version}${dirty ? '-unsaved' : ''}.json`,text:JSON.stringify({schema:'bizoveya-editable-draft-export-v1',notice:'Private working copy. Not AI generation, acceptance or publication.',campaignId:id || null,savedVersion:version || null,includesUnsavedEdits:dirty,document},null,2)};
}
export function generatedDownload(record:OutputRecord):DraftDownload {
 // Explicit projection: do not export future server-only properties added to a record.
 return {filename:`bizoveya-generated-${record.id}.json`,text:JSON.stringify({schema:'bizoveya-generated-draft-export-v1',notice:'Private generated text for human review. QA and human acceptance do not publish or guarantee factual correctness.',snapshotId:record.id,campaignId:record.campaignId,campaignVersion:record.campaignVersion,status:record.status,output:record.output,reviews:record.reviews},null,2)};
}
export function downloadDraft(packet:DraftDownload):void {
 const url=URL.createObjectURL(new Blob([packet.text],{type:'application/json;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=packet.filename;
 try { document.body.appendChild(link);link.click(); }
 finally { link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); }
}
