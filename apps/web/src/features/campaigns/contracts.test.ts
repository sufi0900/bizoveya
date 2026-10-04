import {describe,it,expect} from "vitest";
import {campaignDocumentSchema,generationSummarySchema,prepareGenerationSchema,saveCampaignSchema,starterCampaign} from "./contracts";
describe("campaign boundaries",()=>{
 it("accepts a brief without claiming generated content",()=>{expect(campaignDocumentSchema.parse(starterCampaign).blog).toBe("");});
 it("rejects unknown fields and execution commands",()=>{expect(campaignDocumentSchema.safeParse({...starterCampaign,publish:true}).success).toBe(false);});
 it("bounds every output",()=>{for(const [key,max] of [["blog",24000],["pinterest",2000],["linkedin",5000]] as const)expect(campaignDocumentSchema.safeParse({...starterCampaign,[key]:"x".repeat(max+1)}).success).toBe(false);});
 it("requires a real request id and optimistic version",()=>{expect(saveCampaignSchema.safeParse({id:"new",expectedVersion:-1,document:starterCampaign}).success).toBe(false);});
 it("pins a saved campaign version before generation",()=>{expect(prepareGenerationSchema.safeParse({id:crypto.randomUUID(),campaignId:crypto.randomUUID(),expectedCampaignVersion:1}).success).toBe(true);expect(prepareGenerationSchema.safeParse({id:crypto.randomUUID(),campaignId:crypto.randomUUID(),expectedCampaignVersion:0}).success).toBe(false);});
 it("rejects blank briefs",()=>{expect(campaignDocumentSchema.safeParse({...starterCampaign,brief:"  "}).success).toBe(false);});
 it("accepts only sanitized generation stage summaries",()=>{const base={id:crypto.randomUUID(),campaignId:crypto.randomUUID(),campaignVersion:1,status:"running",createdAt:new Date().toISOString(),startedAt:new Date().toISOString(),finishedAt:null,stageCount:3,outputAvailable:false,stages:[{id:crypto.randomUUID(),kind:"coordinator",status:"succeeded",spendingState:"settled",createdAt:new Date().toISOString(),finishedAt:new Date().toISOString()}]};expect(generationSummarySchema.safeParse(base).success).toBe(true);expect(generationSummarySchema.safeParse({...base,stages:[{...base.stages[0],claim:crypto.randomUUID()}]}).success).toBe(false);});
});
