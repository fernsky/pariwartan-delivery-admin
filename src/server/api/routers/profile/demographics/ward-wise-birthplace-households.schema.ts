import { z } from "zod";

// Schema for birthplace households data by age group
export const birthplaceHouseholdsSchema = z.object({
  id: z.string().optional(),
  ageGroup: z.string(),
  totalPopulation: z.number().int().nonnegative(),
  nepalBorn: z.number().int().nonnegative(),
  bornInDistrictMunicipality: z.number().int().nonnegative(),
  bornInDistrictOther: z.number().int().nonnegative(),
  bornInDistrictTotal: z.number().int().nonnegative(),
  bornOtherDistrict: z.number().int().nonnegative(),
  bornAbroad: z.number().int().nonnegative(),
  birthPlaceUnknown: z.number().int().nonnegative(),
});

// Schema for filtering birthplace households data
export const birthplaceHouseholdsFilterSchema = z.object({
  ageGroup: z.string().optional(),
});

export const updateBirthplaceHouseholdsSchema = 
  birthplaceHouseholdsSchema;

export type BirthplaceHouseholdsData = z.infer<
  typeof birthplaceHouseholdsSchema
>;
export type UpdateBirthplaceHouseholdsData =
  BirthplaceHouseholdsData;
export type BirthplaceHouseholdsFilter = z.infer<
  typeof birthplaceHouseholdsFilterSchema
>;

// Define the birth place categories for UI mapping
export const BIRTH_PLACE_CATEGORIES = {
  SAME_MUNICIPALITY: "bornInDistrictMunicipality",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "bornInDistrictOther", 
  ANOTHER_DISTRICT: "bornOtherDistrict",
  ABROAD: "bornAbroad",
} as const;

export type BirthPlaceCategory = keyof typeof BIRTH_PLACE_CATEGORIES;
