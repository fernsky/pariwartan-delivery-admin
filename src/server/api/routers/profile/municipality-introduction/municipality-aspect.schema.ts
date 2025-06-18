import { z } from "zod";

export const municipalityAspectInputSchema = z.object({
  municipalityId: z.number().int().positive(),
});

export const aspectDataItemSchema = z.object({
  direction_nepali: z.string(),
  direction_english: z.string(),
  area_sq_km: z.number(),
  area_percentage: z.number(),
});

export const municipalityAspectResponseSchema = z.object({
  title: z.string(),
  title_english: z.string(),
  data: z.array(aspectDataItemSchema),
  total: z.object({
    area_sq_km: z.number(),
    area_percentage: z.number(),
  }),
  metadata: z.object({
    column_headers: z.object({
      nepali: z.array(z.string()),
      english: z.array(z.string()),
    }),
    highest_area: z.object({
      direction: z.string(),
      direction_english: z.string(),
      area_sq_km: z.number(),
      area_percentage: z.number(),
    }),
    lowest_area: z.object({
      direction: z.string(),
      direction_english: z.string(),
      area_sq_km: z.number(),
      area_percentage: z.number(),
    }),
  }),
});

export type MunicipalityAspectInput = z.infer<typeof municipalityAspectInputSchema>;
export type MunicipalityAspectResponse = z.infer<typeof municipalityAspectResponseSchema>;
export type AspectDataItem = z.infer<typeof aspectDataItemSchema>;
