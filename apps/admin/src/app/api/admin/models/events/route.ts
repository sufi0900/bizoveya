import {adminApi} from "@/features/admin/api";
import {modelEvents} from "@/features/models/store";
export const GET=()=>adminApi(modelEvents);
