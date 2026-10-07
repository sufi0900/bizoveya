import {jsonSchema} from 'ai';
import {z} from 'zod';
import type {AgentKind} from '@bizoveya/agent-contract';
import {outputSchemas} from './contracts';

// Transport guidance is intentionally smaller than the authoritative local schema.
// All lengths, UUIDs, strict objects and citation checks still apply locally.
function compact(node:Record<string,unknown>):Record<string,unknown>{
 const result:Record<string,unknown>={};
 for(const key of ['type','enum','required','additionalProperties'])if(node[key]!==undefined)result[key]=node[key];
 if(node.const!==undefined)result.enum=[node.const];
 if(node.properties)result.properties=Object.fromEntries(Object.entries(node.properties as Record<string,Record<string,unknown>>).map(([key,value])=>[key,compact(value)]));
 if(node.items)result.items=compact(node.items as Record<string,unknown>);
 return result;
}
export function geminiOutputSchema(kind:AgentKind){
 const authoritative=outputSchemas[kind];
 const wire=compact(z.toJSONSchema(authoritative,{unrepresentable:'any'}) as Record<string,unknown>);
 return jsonSchema(wire,{validate:value=>{
  const parsed=authoritative.safeParse(value);
  return parsed.success?{success:true,value:parsed.data}:{success:false,error:parsed.error};
 }});
}
