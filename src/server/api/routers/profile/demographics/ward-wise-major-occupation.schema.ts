import { z } from "zod";

// Define the family main occupation type enum for validation
export const FamilyMainOccupationTypeEnum = z.enum([
  "MILITARY_OFFICERS",
  "MANAGERS", 
  "PROFESSIONALS",
  "TECHNICIANS_AND_ASSOCIATE_PROFESSIONALS",
  "CLERICAL_SUPPORT_WORKERS",
  "SERVICE_AND_SALES_WORKERS",
  "SKILLED_AGRICULTURAL_WORKERS",
  "CRAFT_AND_RELATED_TRADES_WORKERS",
  "PLANT_AND_MACHINE_OPERATORS",
  "ELEMENTARY_OCCUPATIONS",
  "NOT_SPECIFIED",
  "ECONOMICALLY_INACTIVE",
]);
export type FamilyMainOccupationType = z.infer<typeof FamilyMainOccupationTypeEnum>;

// Define Nepali occupation labels for display
export const familyMainOccupationLabels: Record<string, string> = {
  MILITARY_OFFICERS: "दैनिक अधिकारीहरू",
  MANAGERS: "व्यवस्थापकहरु",
  PROFESSIONALS: "पेशाविदहरू",
  TECHNICIANS_AND_ASSOCIATE_PROFESSIONALS: "प्राविधिक तथा सहायक पेशागतहरू",
  CLERICAL_SUPPORT_WORKERS: "कार्यालय सहायकहरू",
  SERVICE_AND_SALES_WORKERS: "सेवा तथा वस्तु बिक्री गर्ने कामदारहरू",
  SKILLED_AGRICULTURAL_WORKERS: "कृषि कार्यसँग सम्बन्धित रोजगारहरू",
  CRAFT_AND_RELATED_TRADES_WORKERS: "शिल्पकला तथा कालिगढ र यससँग सम्बन्धी व्यापार गर्नेहरू",
  PLANT_AND_MACHINE_OPERATORS: "यन्त्र तथा मेशिन अपरेटर र जडान गर्ने कामदारहरू",
  ELEMENTARY_OCCUPATIONS: "सामान्य वा प्राथमिक पेशाका कामदारहरू",
  NOT_SPECIFIED: "उल्लेख नगरेका",
  ECONOMICALLY_INACTIVE: "आर्थिक रूपमा सक्रिय नभएकाहरू",
};

// Schema for family main occupation data
export const familyMainOccupationSchema = z.object({
  id: z.string().optional(),
  occupation: FamilyMainOccupationTypeEnum,
  age15_19: z.number().int().nonnegative(),
  age20_24: z.number().int().nonnegative(),
  age25_29: z.number().int().nonnegative(),
  age30_34: z.number().int().nonnegative(),
  age35_39: z.number().int().nonnegative(),
  age40_44: z.number().int().nonnegative(),
  age45_49: z.number().int().nonnegative(),
  totalPopulation: z.number().int().nonnegative(),
  percentage: z.number().nonnegative(),
});

// Schema for filtering family main occupation data
export const familyMainOccupationFilterSchema = z.object({
  occupation: FamilyMainOccupationTypeEnum.optional(),
});

export const updateFamilyMainOccupationSchema = familyMainOccupationSchema;

export type FamilyMainOccupationData = z.infer<typeof familyMainOccupationSchema>;
export type UpdateFamilyMainOccupationData = FamilyMainOccupationData;
