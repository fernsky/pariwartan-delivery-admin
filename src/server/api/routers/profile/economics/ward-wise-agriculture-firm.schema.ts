import { z } from "zod";

// Schema for ward-wise agriculture firm count data
export const wardWiseAgricultureFirmCountSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  count: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise agriculture firm count data
export const wardWiseAgricultureFirmCountFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseAgricultureFirmCountSchema = 
  wardWiseAgricultureFirmCountSchema;

export type WardWiseAgricultureFirmCountData = z.infer<
  typeof wardWiseAgricultureFirmCountSchema
>;
export type UpdateWardWiseAgricultureFirmCountData = 
  WardWiseAgricultureFirmCountData;
export type WardWiseAgricultureFirmCountFilter = z.infer<
  typeof wardWiseAgricultureFirmCountFilterSchema
>;
