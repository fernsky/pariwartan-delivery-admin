import { z } from "zod";

export const municipalityWardWiseSettlementInputSchema = z.object({
  municipalityId: z.number().int().positive(),
});

export const wardSettlementDataItemSchema = z.object({
  ward_number: z.string(),
  ward_number_english: z.string(),
  settlements: z.array(z.string()),
});

export const municipalityWardWiseSettlementResponseSchema = z.object({
  title: z.string(),
  title_english: z.string(),
  data: z.array(wardSettlementDataItemSchema),
  metadata: z.object({
    total_wards: z.number(),
    column_headers: z.object({
      nepali: z.array(z.string()),
      english: z.array(z.string()),
    }),
  }),
});

export type MunicipalityWardWiseSettlementInput = z.infer<typeof municipalityWardWiseSettlementInputSchema>;
export type MunicipalityWardWiseSettlementResponse = z.infer<typeof municipalityWardWiseSettlementResponseSchema>;
export type WardSettlementDataItem = z.infer<typeof wardSettlementDataItemSchema>;
