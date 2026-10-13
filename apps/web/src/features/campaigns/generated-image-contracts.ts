import { z } from 'zod';

export const generatedImageInputSchema = z.object({
  id: z.uuid(),
  expectedQualificationVersion: z.number().int().min(1).max(50),
  prompt: z.string().trim().min(10).max(2000).refine(value => !/[\u0000-\u001f]/.test(value)),
  aspectRatio: z.enum(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9']),
  alt: z.string().trim().min(1).max(300).refine(value => !/[\u0000-\u001f]/.test(value)),
  reviewed: z.literal(true),
}).strict();
export type GeneratedImageInput = z.infer<typeof generatedImageInputSchema>;
