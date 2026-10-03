import {describe,it,expect} from "vitest";
import {z} from "zod";
import {readInput} from "./input";
const request=(body:string,headers:Record<string,string>={})=>new Request('https://admin.example.com/api/admin/agents',{method:'POST',headers:{'content-type':'application/json',...headers},body});
describe('admin mutation input',()=>{
 it('rejects cross-site writes',async()=>{await expect(readInput(request('{}',{origin:'https://evil.example'}),z.object({}))).rejects.toMatchObject({status:403});});
 it('enforces actual streamed bytes',async()=>{await expect(readInput(request('"'+ 'x'.repeat(50)+'"'),z.string(),20)).rejects.toMatchObject({status:413});});
 it('rejects malformed JSON and unknown instruction fields',async()=>{await expect(readInput(request('{'),z.object({}))).rejects.toMatchObject({status:400});await expect(readInput(request('{"code":"execute"}'),z.object({}).strict())).rejects.toMatchObject({status:400});});
});
