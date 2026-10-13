import { z } from 'zod';
import { previewAgentSchema, sitePreferencesSchema } from '@bizoveya/agent-contract';
const roleSchema=z.object({kind:z.enum(['coordinator','content','quality']),qualificationFingerprint:z.string().regex(/^[a-f0-9]{64}$/),previewCount:z.number().int().nonnegative(),qualifiedCount:z.number().int().nonnegative()}).strict();
export const onboardingSnapshotSchema=z.object({schema:z.literal('agency-onboarding-v1'),siteId:z.uuid(),mode:z.literal('deterministic-approved-context'),executionEnabled:z.literal(false),siteTeam:z.object({version:z.number().int().min(0).max(50),enabled:z.boolean().nullable()}).strict().default({version:0,enabled:null}),facts:z.array(z.object({sourceId:z.uuid(),sourceVersion:z.number().int().positive(),title:z.string(),factId:z.string(),text:z.string(),approvedAt:z.string()}).strict()).max(800),preferences:z.object({version:z.number().int().nonnegative(),document:sitePreferencesSchema}).strict(),catalog:z.array(previewAgentSchema),roles:z.array(roleSchema).length(3).refine(roles=>new Set(roles.map(r=>r.kind)).size===3)}).strict();
const hash=z.string().regex(/^[a-f0-9]{64}$/);
const summary=z.object({version:z.number().int().min(1).max(50),fingerprint:hash,note:z.string(),actorId:z.uuid(),createdAt:z.string()}).strict();
export const onboardingReportSchema=z.object({current:onboardingSnapshotSchema,fingerprint:hash,latest:summary.extend({snapshot:onboardingSnapshotSchema}).nullable(),history:z.array(summary).max(50)}).strict();
export const onboardingReviewSchema=z.object({fingerprint:hash,expectedVersion:z.number().int().min(0).max(50),note:z.string().trim().min(1).max(500).refine(s=>!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s)),reviewed:z.literal(true)}).strict();
export type OnboardingReport=z.infer<typeof onboardingReportSchema>;
export function assessOnboarding(snapshot:z.infer<typeof onboardingSnapshotSchema>){
 const blockers:string[]=[];
 if(!snapshot.facts.length)blockers.push('Approve at least one site fact in Knowledge.');
 if(snapshot.siteTeam.enabled===false)blockers.push('The owner has paused the site team. Enable a reviewed qualified team before preparing new work.');
 for(const role of snapshot.siteTeam.enabled===false?[]:snapshot.roles){
  if(role.qualifiedCount===0)blockers.push(`${role.kind}: the operator must review the approved agent version, enabled model assignment, passed connectivity test from the last 24 hours and unexpired enabled pricing policy.`);
  if(role.qualifiedCount>1)blockers.push(`${role.kind}: multiple qualified agents are eligible. The operator must resolve this ambiguity before generation preparation.`);
 }
 const recommendations:string[]=[];
 if(!snapshot.preferences.document.audience)recommendations.push('Set the intended audience in Agent readiness.');
 if(!snapshot.preferences.document.brandVoice)recommendations.push('Set the brand voice in Agent readiness.');
 return {blockers,recommendations,preparationChecksPassed:blockers.length===0,sourceCount:new Set(snapshot.facts.map(f=>f.sourceId)).size,factCount:snapshot.facts.length};
}
