import { z } from "zod";
import { CasteTypes, casteTypeValues } from "../../../../db/schema/common/enums";

// Schema for caste population data
export const castePopulationSchema = z.object({
  id: z.string().optional(),
  casteType: z.enum(casteTypeValues as [string, ...string[]]),
  malePopulation: z.number().int().nonnegative(),
  femalePopulation: z.number().int().nonnegative(),
});

// Schema for filtering caste population data
export const castePopulationFilterSchema = z.object({
  casteType: z.enum(casteTypeValues as [string, ...string[]]).optional(),
});

export const updateCastePopulationSchema = castePopulationSchema;

export type CastePopulationData = z.infer<typeof castePopulationSchema>;
export type UpdateCastePopulationData = CastePopulationData;
export type CastePopulationFilter = z.infer<typeof castePopulationFilterSchema>;

// Export the caste types for use in UI components
export const casteOptions = Object.entries(CasteTypes).map(([key, value]) => ({
  value: key,
  label: value,
}));
