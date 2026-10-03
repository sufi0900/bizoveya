import {describe,it,expect,vi,beforeEach} from "vitest";
import type {SupabaseClient} from "@supabase/supabase-js";
const {getSite}=vi.hoisted(()=>({getSite:vi.fn()}));
vi.mock("@/features/workspaces/store",async original=>({...await original<object>(),getSite}));
import {mutateKnowledge,approvedKnowledge,knowledgeHistory} from "./store";
const id="11111111-1111-4111-8111-111111111111";
const doc={title:"Policy",filename:"",sourceText:"Approved source",facts:[{id:"a",text:"Reviewed fact"}]};
const source={id,site_id:id,document:doc,version:1,approved:false,approved_at:null,approved_by:null,updated_by:id,updated_at:"2026-10-02T00:00:00Z"};
const db=()=>({rpc:vi.fn().mockResolvedValue({data:[source],error:null}),from:vi.fn()});
describe("knowledge storage authorization",()=>{
 beforeEach(()=>{vi.clearAllMocks();getSite.mockResolvedValue({workspace:{role:"owner"},site:{id,mode:"external"}});});
 it("prepares external-site knowledge without fetching its website",async()=>{const d=db();await mutateKnowledge(d as unknown as SupabaseClient,id,id,id,{action:"save",id,expectedVersion:0,document:doc});expect(d.rpc).toHaveBeenCalledWith("bz_mutate_knowledge",expect.objectContaining({p_site_id:id,p_workspace_id:id,p_expected_version:0}));expect(d.from).not.toHaveBeenCalled();});
 it.each(["approve","revoke","delete"] as const)("blocks editor %s before RPC",async action=>{getSite.mockResolvedValue({workspace:{role:"editor"},site:{id}});const d=db();await expect(mutateKnowledge(d as unknown as SupabaseClient,id,id,id,{action,id,expectedVersion:1})).rejects.toThrow(/Only an owner/);expect(d.rpc).not.toHaveBeenCalled();});
 it("blocks viewer draft changes",async()=>{getSite.mockResolvedValue({workspace:{role:"viewer"},site:{id}});const d=db();await expect(mutateKnowledge(d as unknown as SupabaseClient,id,id,id,{action:"save",id,expectedVersion:0,document:doc})).rejects.toThrow(/Only an owner/);expect(d.rpc).not.toHaveBeenCalled();});
 it("propagates revoked membership before retrieval",async()=>{getSite.mockRejectedValue(Error("unavailable"));const d=db();await expect(approvedKnowledge(d as unknown as SupabaseClient,id,id,id)).rejects.toThrow(/unavailable/);expect(d.rpc).not.toHaveBeenCalled();});
 it("reports missing migration026 precisely",async()=>{const d=db();d.rpc.mockResolvedValue({data:null,error:{code:"PGRST202"}} as never);await expect(mutateKnowledge(d as unknown as SupabaseClient,id,id,id,{action:"save",id,expectedVersion:0,document:doc})).rejects.toThrow(/026/);});
 it("does not invent empty success when DB reports conflict",async()=>{const d=db();d.rpc.mockResolvedValue({data:null,error:{message:"bz_conflict"}} as never);await expect(mutateKnowledge(d as unknown as SupabaseClient,id,id,id,{action:"approve",id,expectedVersion:1})).rejects.toThrow(/another session/);});
 it("does not read history for malformed source identifiers",async()=>{const d=db();await expect(knowledgeHistory(d as unknown as SupabaseClient,id,id,id,"bad")).rejects.toThrow(/unavailable/);expect(d.from).not.toHaveBeenCalled();});
});
