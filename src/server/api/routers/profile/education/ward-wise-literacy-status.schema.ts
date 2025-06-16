import { z } from "zod";

// Define the literacy type enum to match the database enum
export const LiteracyTypeEnum = z.enum([
  "BOTH_READING_AND_WRITING",
  "READING_ONLY",
  "ILLITERATE",
  "NOT_MENTIONED",
]);
export type LiteracyType = z.infer<typeof LiteracyTypeEnum>;

// Define the gender enum
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE",
  "TOTAL",
]);
export type Gender = z.infer<typeof GenderEnum>;

// Schema for ward-wise literacy status data
export const wardWiseLiteracyStatusSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  gender: GenderEnum,
  literacyType: LiteracyTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise literacy status data
export const wardWiseLiteracyStatusFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  gender: GenderEnum.optional(),
  literacyType: LiteracyTypeEnum.optional(),
});

export const updateWardWiseLiteracyStatusSchema = wardWiseLiteracyStatusSchema;

export type WardWiseLiteracyStatusData = z.infer<
  typeof wardWiseLiteracyStatusSchema
>;
export type UpdateWardWiseLiteracyStatusData = WardWiseLiteracyStatusData;
export type WardWiseLiteracyStatusFilter = z.infer<
  typeof wardWiseLiteracyStatusFilterSchema
>;

// Export the literacy types for use in UI components
export const literacyTypeOptions = [
  {
    value: "BOTH_READING_AND_WRITING",
    label: "Can both read and write (पढ्न लेख्न जानेको)",
  },
  {
    value: "READING_ONLY",
    label: "Can read but not write (पढ्न मात्र जानेको)",
  },
  { value: "ILLITERATE", label: "Cannot read or write (पढ्न लेख्न नजानेका)" },
  { value: "NOT_MENTIONED", label: "Not mentioned (उल्लेख नभएको)" },
];

// Export gender options for use in UI components
export const genderOptions = [
  { value: "MALE", label: "Male (पुरुष)" },
  { value: "FEMALE", label: "Female (महिला)" },
  { value: "TOTAL", label: "Total (जम्मा)" },
];
