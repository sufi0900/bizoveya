import { describe,it,expect,vi,beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { newBusinessDocument } from "@/domain/business";
const {getSite}=vi.hoisted(()=>({getSite:vi.fn()}));
vi.mock("@/features/workspaces/store",async original=>({...await original<object>(),getSite}));
import {loadPublication,setPublication} from "./publication-store";
const input={publish:true,expectedDraftVersion:2,expectedPublicationVersion:0};
const row={site_id:"22222222-2222-4222-8222-222222222222",document:newBusinessDocument("Acme"),source_version:2,version:1,active:true,published_at:"2026-10-02",updated_at:"2026-10-02"};
const ctx={workspace:{role:"owner"},site:{mode:"native_business"}};
describe("publication persistence",()=>{
 beforeEach(()=>getSite.mockResolvedValue(ctx));
 it("blocks viewers before mutation",async()=>{getSite.mockResolvedValue({...ctx,workspace:{role:"viewer"}});const db={rpc:vi.fn()};await expect(setPublication(db as unknown as SupabaseClient,"u","w","s",input)).rejects.toThrow(/read-only/);expect(db.rpc).not.toHaveBeenCalled();});
 it("passes both versions and scope to transactional RPC",async()=>{const db={rpc:vi.fn().mockResolvedValue({data:[row],error:null})};expect((await setPublication(db as unknown as SupabaseClient,"u","w","s",input)).active).toBe(true);expect(db.rpc).toHaveBeenCalledWith("bz_set_business_publication",{p_workspace_id:"w",p_site_id:"s",p_expected_draft_version:2,p_expected_publication_version:0,p_publish:true});});
 it("reports readiness rather than generic service failure",async()=>{const db={rpc:vi.fn().mockResolvedValue({data:null,error:{message:"bz_publication_not_ready"}})};await expect(setPublication(db as unknown as SupabaseClient,"u","w","s",input)).rejects.toThrow(/Hero and Contact/);});
 it("does not read publication for an external site",async()=>{getSite.mockResolvedValue({...ctx,site:{mode:"external"}});const db={from:vi.fn()};await expect(loadPublication(db as unknown as SupabaseClient,"u","w","s")).rejects.toThrow(/business publishing/);expect(db.from).not.toHaveBeenCalled();});
});
