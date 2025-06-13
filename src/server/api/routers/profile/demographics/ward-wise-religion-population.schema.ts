import { z } from "zod";

// Define the religion type enum to match the database enum
export const ReligionTypeEnum = z.enum([
  "HINDU",
  "BUDDHIST",
  "KIRANT",
  "CHRISTIAN",
  "ISLAM",
  "NATURE",
  "BON",
  "JAIN",
  "BAHAI",
  "SIKH",
  "OTHER",
]);
export type ReligionType = z.infer<typeof ReligionTypeEnum>;

// Schema for religion population data
export const religionPopulationSchema = z.object({
  id: z.string().optional(),
  religionType: ReligionTypeEnum,
  malePopulation: z.number().nonnegative().default(0),
  femalePopulation: z.number().nonnegative().default(0),
  totalPopulation: z.number().nonnegative().default(0),
  percentage: z.number().nonnegative().optional(),
});

// Schema for filtering religion population data
export const religionPopulationFilterSchema = z.object({
  religionType: ReligionTypeEnum.optional(),
});

export const updateReligionPopulationSchema = religionPopulationSchema;

export type ReligionPopulationData = z.infer<typeof religionPopulationSchema>;
export type UpdateReligionPopulationData = ReligionPopulationData;
export type ReligionPopulationFilter = z.infer<typeof religionPopulationFilterSchema>;

// Legacy exports for backward compatibility
export const genderWiseReligionPopulationSchema = religionPopulationSchema;
export const genderWiseReligionPopulationFilterSchema = religionPopulationFilterSchema;
export const updateGenderWiseReligionPopulationSchema = updateReligionPopulationSchema;
export const wardWiseReligionPopulationSchema = religionPopulationSchema;
export const wardWiseReligionPopulationFilterSchema = religionPopulationFilterSchema;
export const updateWardWiseReligionPopulationSchema = updateReligionPopulationSchema;

export type GenderWiseReligionPopulationData = ReligionPopulationData;
export type UpdateGenderWiseReligionPopulationData = UpdateReligionPopulationData;
export type GenderWiseReligionPopulationFilter = ReligionPopulationFilter;
export type WardWiseReligionPopulationData = ReligionPopulationData;
export type UpdateWardWiseReligionPopulationData = UpdateReligionPopulationData;
export type WardWiseReligionPopulationFilter = ReligionPopulationFilter;
