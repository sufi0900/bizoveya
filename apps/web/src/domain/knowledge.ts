import { z } from "zod";
export const knowledgeLimits = { sources: 20, sourceCharacters: 16000, facts: 40, factCharacters: 500, fileBytes: 48000, requestBytes: 180000, revisions: 100 } as const;
const text = (max: number) => z.string().trim().min(1).max(max).refine(v => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v), "Remove unsupported control characters.");
export const knowledgeFactSchema = z.object({ id: z.string().regex(/^[a-zA-Z0-9_-]{1,60}$/), text: text(500) }).strict();
export const knowledgeDocumentSchema = z.object({ title: text(120), filename: z.string().max(120).refine(v => !/[/\\\u0000-\u001f]/.test(v), "Use a filename, not a path."), sourceText: text(16000), facts: z.array(knowledgeFactSchema).max(40) }).strict().superRefine((v,ctx) => {
  if(new Set(v.facts.map(f=>f.id)).size !== v.facts.length) ctx.addIssue({code:"custom",message:"Fact IDs must be unique.",path:["facts"]});
});
export type KnowledgeDocument = z.infer<typeof knowledgeDocumentSchema>;
export const knowledgeSourceSchema = z.object({ id: z.uuid(), site_id: z.uuid(), document: knowledgeDocumentSchema, version: z.number().int().positive(), approved: z.boolean(), approved_by: z.uuid().nullable(), approved_at: z.string().nullable(), updated_by: z.uuid().nullable(), updated_at: z.string() });
export type KnowledgeSource = z.infer<typeof knowledgeSourceSchema>;
export const knowledgeMutationSchema = z.discriminatedUnion("action",[
 z.object({action:z.literal("save"),id:z.uuid(),expectedVersion:z.number().int().min(0),document:knowledgeDocumentSchema}).strict(),
 z.object({action:z.enum(["approve","revoke","delete"]),id:z.uuid(),expectedVersion:z.number().int().positive()}).strict()
]);
export type KnowledgeMutation = z.infer<typeof knowledgeMutationSchema>;
export const approvedKnowledgeSchema = z.object({id:z.uuid(),title:z.string(),filename:z.string(),facts:z.array(knowledgeFactSchema),version:z.number().int().positive(),approved_at:z.string()});
export type ApprovedKnowledge = z.infer<typeof approvedKnowledgeSchema>;
/** Deterministic candidates, never verified facts. Explicitly capped with a visible count. */
export function extractKnowledgeCandidates(value: string) {
 const paragraphs=value.replace(/\r\n?/g,"\n").split(/\n\s*\n|\n(?=[#*-] |\d+\. )/).map(p=>p.trim()).filter(Boolean);
 const chunks=paragraphs.flatMap(p=>{const out:string[]=[];let left=p;while(left.length){let cut=left.length<=500?left.length:left.lastIndexOf(" ",500);if(cut<1)cut=Math.min(500,left.length);out.push(left.slice(0,cut).trim());left=left.slice(cut).trim();}return out;});
 return {facts:chunks.slice(0,40).map((s,i)=>({id:`fact-${i+1}`,text:s})),omitted:Math.max(0,chunks.length-40)};
}
export function readKnowledgeFile(name:string,bytes:Uint8Array) {
 if(!/\.(txt|md)$/i.test(name))throw Error("Import a .txt or .md file. PDF, DOCX and OCR are not supported in this phase.");
 if(bytes.byteLength>knowledgeLimits.fileBytes)throw Error("Use a text file no larger than 48,000 bytes.");
 let sourceText:string;try{sourceText=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}catch{throw Error("Use a UTF-8 text file.");}
 const parsed=knowledgeDocumentSchema.safeParse({title:name.replace(/\.(txt|md)$/i,""),filename:name,sourceText,facts:[]});
 if(!parsed.success)throw Error("Use non-empty UTF-8 text, at most 16,000 characters, and a filename under 121 characters.");
 return parsed.data;
}
export function knowledgeMatches(source:ApprovedKnowledge,query:string) {
 const words=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 return source.facts.filter(f=>words.every(w=>(source.title+" "+f.text).toLocaleLowerCase().includes(w))).map(f=>({sourceId:source.id,sourceVersion:source.version,factId:f.id,title:source.title,filename:source.filename,text:f.text,approvedAt:source.approved_at}));
}
