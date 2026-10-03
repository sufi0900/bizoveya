import {slots,type CredentialRecord} from "./contracts";
// Fixed allowlist. No arbitrary environment lookup, key value, prefix, length or fingerprint is returned.
export function credentialPresence(id:CredentialRecord["id"],environment:Record<string,string|undefined>){const slot=Object.values(slots).find(s=>s.reference===id);return {id,configured:!!slot&&!!environment[slot.variable]?.trim(),scope:"current-admin-deployment" as const,providerValidated:false as const,runtimeEnabled:false as const};}
