import { z } from "zod";
import { adminApi } from "@/features/admin/api";
import { AdminError } from "@/features/admin/access";
import { loadHistory } from "@/features/agents/store";
export const GET=(_request:Request,{params}:{params:Promise<{id:string}>})=>adminApi(async db=>{const {id}=await params;if(!z.uuid().safeParse(id).success)throw new AdminError(400,"INVALID_REQUEST","Select a valid agent.");return loadHistory(db,id);});
