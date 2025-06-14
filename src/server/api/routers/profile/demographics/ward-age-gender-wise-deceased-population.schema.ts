import { z } from "zod";

// Define the specific age groups from the SQL data
export const deceasedAgeGroupEnum = z.enum([
  "AGE_1_YEAR",
  "AGE_1_4_YEARS",
  "AGE_5_9_YEARS",
  "AGE_10_14_YEARS",
  "AGE_15_19_YEARS",
  "AGE_20_24_YEARS",
  "AGE_25_29_YEARS",
  "AGE_30_34_YEARS",
  "AGE_35_39_YEARS",
  "AGE_40_44_YEARS",
  "AGE_45_49_YEARS",
  "AGE_50_54_YEARS",
  "AGE_55_59_YEARS",
  "AGE_60_64_YEARS",
  "AGE_65_69_YEARS",
  "AGE_70_74_YEARS",
  "AGE_75_79_YEARS",
  "AGE_80_AND_ABOVE",
]);

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export type DeceasedAgeGroup = z.infer<typeof deceasedAgeGroupEnum>;
export type Gender = z.infer<typeof genderEnum>;

export const ageGenderWiseDeceasedPopulationSchema = z.object({
  id: z.string().optional(),
  ageGroup: deceasedAgeGroupEnum,
  gender: genderEnum,
  deceasedPopulation: z
    .number()
    .int()
    .nonnegative("मृत्यु संख्या शून्य वा त्यो भन्दा बढी हुनुपर्छ"),
});

export const ageGenderWiseDeceasedPopulationFilterSchema = z.object({
  ageGroup: deceasedAgeGroupEnum.optional(),
  gender: genderEnum.optional(),
});

export const updateAgeGenderWiseDeceasedPopulationSchema =
  ageGenderWiseDeceasedPopulationSchema;

export type AgeGenderWiseDeceasedPopulationData = z.infer<
  typeof ageGenderWiseDeceasedPopulationSchema
>;
export type UpdateAgeGenderWiseDeceasedPopulationData =
  AgeGenderWiseDeceasedPopulationData;
export type AgeGenderWiseDeceasedPopulationFilter = z.infer<
  typeof ageGenderWiseDeceasedPopulationFilterSchema
>;
  
