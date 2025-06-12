import { z } from "zod";

// Define the occupation type enum for validation
export const OccupationTypeEnum = z.enum([
  "GOVERNMENTAL_JOB",
  "NON_GOVERNMENTAL_JOB",
  "LABOUR",
  "FOREIGN_EMPLOYMENT",
  "BUSINESS",
  "OTHER_EMPLOYMENT",
  "STUDENT",
  "HOUSEHOLDER",
  "OTHER_UNEMPLOYMENT",
  "INDUSTRY",
  "ANIMAL_HUSBANDRY",
  "OTHER_SELF_EMPLOYMENT",
]);
export type OccupationType = z.infer<typeof OccupationTypeEnum>;

// Define Nepali occupation labels for display
export const occupationLabels: Record<string, string> = {
  GOVERNMENTAL_JOB: "सरकारी नोकरी / जागिर",
  NON_GOVERNMENTAL_JOB: "गैरसरकारी नोकरी / जागिर",
  LABOUR: "ज्याला/ मजदुरी",
  FOREIGN_EMPLOYMENT: "वैदेशिक रोजगारी",
  BUSINESS: "व्यापार",
  OTHER_EMPLOYMENT: "अन्य रोजगारी",
  STUDENT: "विद्यार्थी",
  HOUSEHOLDER: "गृहणी",
  OTHER_UNEMPLOYMENT: "अन्य बेरोजगार",
  INDUSTRY: "उद्योग, व्यापार, कृषि",
  ANIMAL_HUSBANDRY: "पशुपालन",
  OTHER_SELF_EMPLOYMENT: "अन्य स्वरोजगार",
};

// Schema for ward-wise major occupation data
export const wardWiseMajorOccupationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().nonnegative(),
  occupation: OccupationTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major occupation data
export const wardWiseMajorOccupationFilterSchema = z.object({
  wardNumber: z.number().int().nonnegative().optional(),
  occupation: OccupationTypeEnum.optional(),
});

export const updateWardWiseMajorOccupationSchema =
  wardWiseMajorOccupationSchema;

export type WardWiseMajorOccupationData = z.infer<
  typeof wardWiseMajorOccupationSchema
>;
export type UpdateWardWiseMajorOccupationData = WardWiseMajorOccupationData;
export type WardWiseMajorOccupationFilter = z.infer<
  typeof wardWiseMajorOccupationFilterSchema
>;
