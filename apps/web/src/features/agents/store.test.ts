import {describe,it,expect,vi,beforeEach} from "vitest";
import type {SupabaseClient} from "@supabase/supabase-js";
const {getSite}=vi.hoisted(()=>({getSite:vi.fn()}));
vi.mock("@/features/workspaces/store",async original=>({...await original<object>(),getSite}));
import {savePreferences,previewContext} from "./store";
const id="11111111-1111-4111-8111-111111111111",document={brandVoice:"Friendly",audience:"",guidance:""};
const db=()=>({rpc:vi.fn().mockResolvedValue({data:[{site_id:id,document,version:1,updated_by:id,updated_at:"2026-10-02"}],error:null})});
describe("readiness storage",()=>{
 beforeEach(()=>{vi.clearAllMocks();getSite.mockResolvedValue({workspace:{role:"owner"}});});
 it("denies viewer edits before writing",async()=>{getSite.mockResolvedValue({workspace:{role:"viewer"}});const d=db();await expect(savePreferences(d as unknown as SupabaseClient,id,id,id,document,0)).rejects.toThrow(/Viewers/);expect(d.rpc).not.toHaveBeenCalled();});
 it("checks membership before context preview",async()=>{getSite.mockRejectedValue(Error("Membership revoked"));const d=db();await expect(previewContext(d as unknown as SupabaseClient,id,id,id,id,1,0)).rejects.toThrow(/revoked/);expect(d.rpc).not.toHaveBeenCalled();});
 it.each([['bz_conflict','Preferences changed'],['bz_agent_preview_changed','Preview approval changed']])("reports %s as a visible conflict",async(message,text)=>{const d=db();d.rpc.mockResolvedValue({data:null,error:{message}} as never);await expect(previewContext(d as unknown as SupabaseClient,id,id,id,id,1,0)).rejects.toThrow(text);});
 it("reports missing migration027 instead of empty success",async()=>{const d=db();d.rpc.mockResolvedValue({data:null,error:{code:"PGRST202"}} as never);await expect(savePreferences(d as unknown as SupabaseClient,id,id,id,document,0)).rejects.toThrow(/027/);});
});
