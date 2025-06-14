import { z } from "zod";

// Schema for disability statistics by age group
export const disabilityByAgeSchema = z.object({
  id: z.string().optional(),
  ageGroup: z.string(),
  physicalDisability: z.number().int().nonnegative(),
  visualImpairment: z.number().int().nonnegative(),
  hearingImpairment: z.number().int().nonnegative(),
  deafMute: z.number().int().nonnegative(),
  speechHearingCombined: z.number().int().nonnegative(),
  intellectualDisability: z.number().int().nonnegative(),
  mentalPsychosocial: z.number().int().nonnegative(),
  autism: z.number().int().nonnegative(),
  multipleDisabilities: z.number().int().nonnegative(),
  otherDisabilities: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

// Schema for filtering disability data
export const disabilityByAgeFilterSchema = z.object({
  ageGroup: z.string().optional(),
});

export const updateDisabilityByAgeSchema = disabilityByAgeSchema;

export type DisabilityByAgeData = z.infer<typeof disabilityByAgeSchema>;
export type UpdateDisabilityByAgeData = DisabilityByAgeData;
export type DisabilityByAgeFilter = z.infer<typeof disabilityByAgeFilterSchema>;
