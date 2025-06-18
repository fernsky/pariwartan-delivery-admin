import { z } from "zod";

export const municipalitySlopeInputSchema = z.object({
  municipalityId: z.number().int().positive(),
});

export const slopeDataItemSchema = z.object({
  slope_range_nepali: z.string(),
  slope_range_english: z.string(),
  area_sq_km: z.number(),
  area_percentage: z.number(),
});

export const municipalitySlopeResponseSchema = z.object({
  title: z.string(),
  title_english: z.string(),
  data: z.array(slopeDataItemSchema),
  total: z.object({
    total_area_sq_km: z.number(),
    total_percentage: z.number(),
  }),
  metadata: z.object({
    column_headers: z.object({
      nepali: z.array(z.string()),
      english: z.array(z.string()),
    }),
    summary: z.string(),
  }),
});

export type MunicipalitySlopeInput = z.infer<typeof municipalitySlopeInputSchema>;
export type MunicipalitySlopeResponse = z.infer<typeof municipalitySlopeResponseSchema>;
export type SlopeDataItem = z.infer<typeof slopeDataItemSchema>;
