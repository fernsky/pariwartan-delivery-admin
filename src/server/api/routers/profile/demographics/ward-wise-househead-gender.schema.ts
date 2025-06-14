import { z } from "zod";

// Schema for ward-wise house head gender data
export const wardWiseHouseHeadGenderSchema = z.object({
  id: z.string().optional(),
  wardNo: z.number().int().positive("Ward number is required"),
  maleHeads: z.number().int().nonnegative(),
  femaleHeads: z.number().int().nonnegative(),
  totalFamilies: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise house head gender data
export const wardWiseHouseHeadGenderFilterSchema = z.object({
  wardNo: z.number().int().positive().optional(),
});

export const updateWardWiseHouseHeadGenderSchema = wardWiseHouseHeadGenderSchema;

// Schema for age-group-wise house head data
export const ageGroupHouseHeadSchema = z.object({
  id: z.string().optional(),
  ageGroup: z.string().min(1, "Age group is required"),
  maleHeads: z.number().int().nonnegative(),
  femaleHeads: z.number().int().nonnegative(),
  totalFamilies: z.number().int().nonnegative()
});

// Schema for filtering age-group-wise house head data
export const ageGroupHouseHeadFilterSchema = z.object({
  ageGroup: z.string().optional(),
});

export const updateAgeGroupHouseHeadSchema = ageGroupHouseHeadSchema;

// Type definitions
export type WardWiseHouseHeadGenderData = z.infer<typeof wardWiseHouseHeadGenderSchema>;
export type UpdateWardWiseHouseHeadGenderData = WardWiseHouseHeadGenderData;
export type WardWiseHouseHeadGenderFilter = z.infer<typeof wardWiseHouseHeadGenderFilterSchema>;
export type AgeGroupHouseHeadData = z.infer<typeof ageGroupHouseHeadSchema>;
export type UpdateAgeGroupHouseHeadData = AgeGroupHouseHeadData;
export type AgeGroupHouseHeadFilter = z.infer<typeof ageGroupHouseHeadFilterSchema>;
