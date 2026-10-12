import { z } from 'zod';
const uuid=z.string().uuid(), micros=z.number().int().min(0).max(1000000000);
export const capabilitySchema=z.enum(['image','live-voice']);
export const mediaQualificationSchema=z.object({
 provider:z.enum(['gemini','openai']),modelId:z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/),credentialRef:z.enum(['platform-gemini','platform-openai']),credentialVersion:z.number().int().min(1).max(1000000000),budgetProfileId:uuid,costMode:z.enum(['free-attested','metered']),inputTokenLimit:z.number().int().min(256).max(100000),outputTokenLimit:z.number().int().min(128).max(16000),durationSeconds:z.number().int().min(30).max(120),maxDailyRequests:z.number().int().min(1).max(50),maxConcurrent:z.number().int().min(1).max(3),inputRateMicros:micros,outputRateMicros:micros,requestFeeMicros:micros,validUntil:z.iso.datetime({offset:true}),evidenceUrl:z.string().url().max(300).regex(/^https:\/\/[^\s]+$/),apiVerified:z.literal(true),commercialReviewed:z.literal(true),
}).strict().refine(v=>v.credentialRef===`platform-${v.provider}`,'Credential must match provider').refine(v=>v.costMode!=='free-attested'||v.inputRateMicros+v.outputRateMicros+v.requestFeeMicros===0,'Free attestation requires zero rates');
const reason=z.string().trim().min(10).max(500).regex(/^[^\x00-\x1f]+$/);
const review={operationId:uuid,capability:capabilitySchema,expectedVersion:z.number().int().min(0).max(50),reason,reviewed:z.literal(true)};
export const mediaReviewSchema=z.discriminatedUnion('action',[z.object({...review,action:z.literal('qualify'),document:mediaQualificationSchema}).strict(),z.object({...review,action:z.literal('pause')}).strict()]);
export const mediaAdmissionSchema=z.discriminatedUnion('capability',[
 z.object({id:uuid,capability:z.literal('image'),expectedQualificationVersion:z.number().int().min(1).max(50),document:z.object({prompt:z.string().trim().min(10).max(2000).regex(/^[^\x00-\x1f]+$/),aspectRatio:z.enum(['1:1','2:3','3:2','3:4','4:3','9:16','16:9'])}).strict(),reviewed:z.literal(true)}).strict(),
 z.object({id:uuid,capability:z.literal('live-voice'),expectedQualificationVersion:z.number().int().min(1).max(50),document:z.object({purpose:z.literal('founder-assistant')}).strict(),reviewed:z.literal(true)}).strict(),
]);
export const mediaReceiptSchema=z.object({artifactHash:z.string().regex(/^[a-f0-9]{64}$/).optional(),mime:z.enum(['image/png','image/jpeg']).optional(),tokenExpiresAt:z.iso.datetime({offset:true}).optional()}).strict();
export const mediaRequestSchema=z.object({id:uuid,siteId:uuid,actorId:uuid,capability:capabilitySchema,qualificationVersion:z.number().int(),profileId:uuid,status:z.enum(['reserved','claimed','running','issued','succeeded','failed','cancelled']),spendingState:z.enum(['reserved','settled','unknown','overrun','reconciled']),reservedMicros:z.number().int().nonnegative(),chargedMicros:z.number().int().nonnegative(),inputTokens:z.number().int().nullable(),outputTokens:z.number().int().nullable(),providerStarted:z.boolean(),expiresAt:z.string(),createdAt:z.string(),finishedAt:z.string().nullable(),receipt:mediaReceiptSchema.nullable(),errorCode:z.string().nullable(),requestHash:z.string().regex(/^[a-f0-9]{64}$/),execute:z.boolean().optional()}).strict();
export const mediaInventorySchema=z.object({capabilities:z.array(z.object({siteId:uuid,actorId:uuid,capability:capabilitySchema,version:z.number().int(),enabled:z.boolean(),document:mediaQualificationSchema,updatedAt:z.string()}).strict()),requests:z.array(mediaRequestSchema)}).strict();
export const mediaRegistrySchema=z.object({sites:z.array(z.object({id:uuid,workspaceId:uuid,name:z.string(),inventory:mediaInventorySchema}).strict())}).strict();
export const mediaRecoverySchema=z.discriminatedUnion('action',[
 z.object({id:uuid,expectedState:z.literal('reserved'),action:z.literal('recover'),amountMicros:z.null(),reason,reviewed:z.literal(true)}).strict(),
 z.object({id:uuid,expectedState:z.enum(['unknown','overrun']),action:z.literal('reconcile'),amountMicros:micros,reason,reviewed:z.literal(true)}).strict(),
]);
export const mediaAdminInputSchema=z.discriminatedUnion('command',[
 z.object({command:z.literal('review'),workspaceId:uuid,siteId:uuid,input:mediaReviewSchema}).strict(),
 z.object({command:z.literal('recover'),input:mediaRecoverySchema}).strict(),
]);
export const mediaClaimSchema=z.discriminatedUnion('execute',[
 z.object({id:uuid,execute:z.literal(false)}).strict(),
 z.object({id:uuid,execute:z.literal(true),actorId:uuid,siteId:uuid,capability:capabilitySchema,document:z.union([mediaAdmissionSchema.options[0].shape.document,mediaAdmissionSchema.options[1].shape.document]),qualification:mediaQualificationSchema,requestHash:z.string().regex(/^[a-f0-9]{64}$/),expiresAt:z.string()}).strict(),
]);
export type MediaAdmission=z.infer<typeof mediaAdmissionSchema>;
export type MediaAdminInput=z.infer<typeof mediaAdminInputSchema>;
