import { z } from "zod";

// Define transformers for handling both string and number inputs for decimal values
const decimalTransformer = z.union([
  z.string().transform((val) => parseFloat(val) || null),
  z.number(),
]);

// Schema for demographic summary data (simplified without ward-wise features)
export const demographicSummarySchema = z.object({
  id: z.string().optional().default("singleton"),
  
  // Basic population statistics
  totalPopulation: z.number().int().nonnegative().optional(),
  populationMale: z.number().int().nonnegative().optional(),
  populationFemale: z.number().int().nonnegative().optional(),
  
  // Demographic ratios and rates
  sexRatio: decimalTransformer.optional(), // Males per 100 females
  annualGrowthRate: decimalTransformer.optional(), // Annual population growth rate
  literacyRate: decimalTransformer.optional(), // Literacy rate for 5+ years
  
  // Household data
  totalHouseholds: z.number().int().nonnegative().optional(),
  averageHouseholdSize: decimalTransformer.optional(),
  
  // Geographic data
  populationDensity: decimalTransformer.optional(), // Per sq km
  
  // Data year information
  dataYear: z.string().optional(), // BS year like "२०६१"
  dataYearEnglish: z.string().optional(), // English year like "2061 BS (2004-2005 AD)"
});

// Schema for filtering demographic summary data (simplified since no ward filtering needed)
export const demographicSummaryFilterSchema = z.object({
  dataYear: z.string().optional(),
});

// Use the same schema for updates
export const updateDemographicSummarySchema = demographicSummarySchema;

// Export TypeScript types for use in the application
export type DemographicSummaryData = z.infer<typeof demographicSummarySchema>;
export type UpdateDemographicSummaryData = DemographicSummaryData;
export type DemographicSummaryFilter = z.infer<typeof demographicSummaryFilterSchema>;

// Keep old exports for backward compatibility
export const wardWiseDemographicSummarySchema = demographicSummarySchema;
export const wardWiseDemographicSummaryFilterSchema = demographicSummaryFilterSchema;
export const updateWardWiseDemographicSummarySchema = updateDemographicSummarySchema;
export type WardWiseDemographicSummaryData = DemographicSummaryData;
export type UpdateWardWiseDemographicSummaryData = UpdateDemographicSummaryData;
export type WardWiseDemographicSummaryFilter = DemographicSummaryFilter;
