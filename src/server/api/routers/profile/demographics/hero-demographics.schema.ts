import { z } from "zod";

export const wardDemographicSchema = z.object({
  id: z.string().uuid(),
  municipalityId: z.string().uuid(),
  wardNo: z.number().int().positive(),
  includedVdcOrMunicipality: z.string().min(1),
  population: z.number().int().nonnegative(),
  areaSqKm: z.string().or(z.number()),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const wardDemographicSummarySchema = z.object({
  totalPopulation: z.number().int().nonnegative(),
  totalAreaSqKm: z.number().nonnegative(),
  totalWards: z.number().int().positive(),
  averageWardPopulation: z.number().nonnegative(),
  averageWardArea: z.number().nonnegative(),
  wards: z.array(wardDemographicSchema),
});

export const getheroDemographicsInputSchema = z.object({
  municipalityId: z.string().uuid(),
});

export const heroDemographicsResponseSchema = z.object({
  totalPopulation: z.number().int().nonnegative(),
  totalAreaSqKm: z.number().nonnegative(),
  totalWards: z.number().int().positive(),
  totalHouseholds: z.number().int().nonnegative().nullable().optional(),
  populationDensity: z.number().nonnegative().optional(),
  wards: z.array(
    z.object({
      wardNo: z.number().int().positive(),
      includedVdcOrMunicipality: z.string(),
      population: z.number().int().nonnegative(),
      areaSqKm: z.number().nonnegative(),
    }),
  ),
});

export const wardTableSchema = z.object({
  id: z.string(),
  wardNo: z.number().int().positive(),
  includedVdcOrMunicipality: z.string(),
  population: z.number().int().nonnegative(),
  areaSqKm: z.number().nonnegative(),
  estimatedHouseholds: z.number().int().nonnegative(),
  populationDensity: z.number().nonnegative(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const wardTableResponseSchema = z.object({
  wards: z.array(wardTableSchema),
  totals: z.object({
    totalWards: z.number().int().positive(),
    totalPopulation: z.number().int().nonnegative(),
    totalAreaSqKm: z.number().nonnegative(),
    totalEstimatedHouseholds: z.number().int().nonnegative(),
    averagePopulationDensity: z.number().nonnegative(),
  }),
});

export type WardDemographic = z.infer<typeof wardDemographicSchema>;
export type WardDemographicSummary = z.infer<typeof wardDemographicSummarySchema>;
export type GetheroDemographicsInput = z.infer<typeof getheroDemographicsInputSchema>;
export type HeroDemographicsResponse = z.infer<typeof heroDemographicsResponseSchema>;
export type WardTable = z.infer<typeof wardTableSchema>;
export type WardTableResponse = z.infer<typeof wardTableResponseSchema>;
