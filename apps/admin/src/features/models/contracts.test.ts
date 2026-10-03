import {describe,it,expect} from "vitest";
import {profileDocumentSchema,credentialMutationSchema,starterProfile,presenceSchema} from "./contracts";
import {credentialPresence} from "./presence";
const doc={...starterProfile(),name:"Candidate",modelId:"operator-verified-model"};
describe("profile and credential contracts",()=>{
 it("accepts configuration without claiming provider compatibility",()=>expect(profileDocumentSchema.safeParse(doc).success).toBe(true));
 it.each(["https://evil.test","model?query=x","bad model"])("rejects URL/arbitrary identifier %s",modelId=>expect(profileDocumentSchema.safeParse({...doc,modelId}).success).toBe(false));
 it("rejects cross-provider references and unsupported fields",()=>{expect(profileDocumentSchema.safeParse({...doc,credentialRef:"platform-openai"}).success).toBe(false);expect(profileDocumentSchema.safeParse({...doc,apiKey:"secret"}).success).toBe(false);});
 it("requires explicit review on credential mutation",()=>expect(credentialMutationSchema.safeParse({id:"platform-nebius",action:"enable",expectedVersion:1,reason:"Reviewed reference",reviewed:false}).success).toBe(false));
 it("returns presence only, never secret metadata",()=>{const secret="private-provider-token";const r=credentialPresence("platform-nebius",{BIZOVEYA_NEBIUS_API_KEY:secret});expect(presenceSchema.parse(r)).toEqual({id:"platform-nebius",configured:true,scope:"current-admin-deployment",providerValidated:false,runtimeEnabled:false});expect(JSON.stringify(r)).not.toContain(secret);expect(Object.keys(r)).toHaveLength(5);});
 it("treats absent/blank as missing",()=>expect(credentialPresence("platform-openai",{BIZOVEYA_OPENAI_API_KEY:"  "}).configured).toBe(false));
});
