import {describe,it,expect} from "vitest";
import {campaignDocumentSchema,saveCampaignSchema,starterCampaign} from "./contracts";
describe("campaign boundaries",()=>{
 it("accepts a brief without claiming generated content",()=>{expect(campaignDocumentSchema.parse(starterCampaign).blog).toBe("");});
 it("rejects unknown fields and execution commands",()=>{expect(campaignDocumentSchema.safeParse({...starterCampaign,publish:true}).success).toBe(false);});
 it("bounds every output",()=>{for(const [key,max] of [["blog",24000],["pinterest",2000],["linkedin",5000]] as const)expect(campaignDocumentSchema.safeParse({...starterCampaign,[key]:"x".repeat(max+1)}).success).toBe(false);});
 it("requires a real request id and optimistic version",()=>{expect(saveCampaignSchema.safeParse({id:"new",expectedVersion:-1,document:starterCampaign}).success).toBe(false);});
 it("rejects blank briefs",()=>{expect(campaignDocumentSchema.safeParse({...starterCampaign,brief:"  "}).success).toBe(false);});
});
