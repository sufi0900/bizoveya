import {describe,it,expect} from "vitest";
import {starterAgent,validateAgent,agentAdminMutationSchema,sitePreferencesSchema,contextPreviewSchema} from "@bizoveya/agent-contract";
describe("agent contracts",()=>{
 it.each(["coordinator","content","quality"] as const)("checks %s without claiming model quality",kind=>{expect(validateAgent(kind,starterAgent(kind)).valid).toBe(true);expect(validateAgent(kind,starterAgent(kind)).message).toContain("not been performed");});
 it("rejects capabilities from another role and duplicates",()=>{const d=starterAgent("quality");expect(validateAgent("quality",{...d,tools:["knowledge.read_approved","plan.prepare"]}).valid).toBe(false);expect(validateAgent("quality",{...d,tools:["knowledge.read_approved","knowledge.read_approved"]}).valid).toBe(false);});
 it("requires explicit review and version on approval",()=>{expect(agentAdminMutationSchema.safeParse({action:"approve-preview",id:crypto.randomUUID(),version:1,expectedRevision:1,reason:"Reviewed safe context",reviewed:false}).success).toBe(false);});
 it("rejects oversized and control-character guidance",()=>{expect(sitePreferencesSchema.safeParse({brandVoice:"",audience:"",guidance:"x".repeat(2001)}).success).toBe(false);expect(sitePreferencesSchema.safeParse({brandVoice:"\u0001",audience:"",guidance:""}).success).toBe(false);});
 it("rejects previews that claim runtime is enabled",()=>{expect(contextPreviewSchema.safeParse({mode:"context-preview",runtimeEnabled:true}).success).toBe(false);});
});
