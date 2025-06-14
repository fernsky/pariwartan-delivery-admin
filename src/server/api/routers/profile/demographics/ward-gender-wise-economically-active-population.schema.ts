import { z } from "zod";

// Define the gender enum for validation
export const GenderEnum = z.enum([
  "पुरुष",
  "महिला", 
  "जम्मा",
]);
export type Gender = z.infer<typeof GenderEnum>;

// Define Nepali gender labels for display
export const genderLabels: Record<string, string> = {
  "पुरुष": "पुरुष",
  "महिला": "महिला",
  "जम्मा": "जम्मा",
};

// Define English gender labels for SEO
export const genderLabelsEn: Record<string, string> = {
  "पुरुष": "Male",
  "महिला": "Female", 
  "जम्मा": "Total",
};

// Schema for ward gender wise economically active population data
export const wardGenderWiseEconomicallyActivePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.string(), // Using string to handle "जम्मा" for totals
  gender: GenderEnum,
  age10PlusTotal: z.number().int().nonnegative(),
  economicallyActiveEmployed: z.number().int().nonnegative(),
  economicallyActiveUnemployed: z.number().int().nonnegative(),
  householdWork: z.number().int().nonnegative(),
  economicallyActiveTotal: z.number().int().nonnegative(),
  dependentPopulation: z.number().int().nonnegative(),
});

// Schema for filtering ward gender wise economically active population data
export const wardGenderWiseEconomicallyActivePopulationFilterSchema = z.object({
  wardNumber: z.string().optional(),
  gender: GenderEnum.optional(),
});

export const updateWardGenderWiseEconomicallyActivePopulationSchema = 
  wardGenderWiseEconomicallyActivePopulationSchema;

export type WardGenderWiseEconomicallyActivePopulationData = z.infer<
  typeof wardGenderWiseEconomicallyActivePopulationSchema
>;
export type UpdateWardGenderWiseEconomicallyActivePopulationData = 
  WardGenderWiseEconomicallyActivePopulationData;
