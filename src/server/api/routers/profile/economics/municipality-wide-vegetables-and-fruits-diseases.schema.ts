import { z } from "zod";

// Define the vegetable and fruit type enum to match the database enum
export const VegetableFruitTypeEnum = z.enum([
  "TOMATO", // गोलभेँडा
  "CAULIFLOWER", // काउली
  "CABBAGE", // बन्दा
  "POTATO", // आलु
  "WALNUT", // ओखर
  "CITRUS", // सुन्तला/कागती
  "KIWI", // किवी
  "APPLE", // स्याउ
  "MUSTARD", // रायो
  "OTHER", // अन्य
]);
export type VegetableFruitType = z.infer<typeof VegetableFruitTypeEnum>;

// Schema for municipality-wide vegetables and fruits diseases data
export const municipalityWideVegetablesAndFruitsDiseasesSchema = z.object({
  id: z.string().optional(),
  crop: VegetableFruitTypeEnum,
  majorPests: z.string().min(1, "Major pests information is required"),
  majorDiseases: z.string().min(1, "Major diseases information is required"),
});

// Schema for filtering municipality-wide vegetables and fruits diseases data
export const municipalityWideVegetablesAndFruitsDiseasesFilterSchema = z.object({
  crop: VegetableFruitTypeEnum.optional(),
});

export const updateMunicipalityWideVegetablesAndFruitsDiseasesSchema =
  municipalityWideVegetablesAndFruitsDiseasesSchema;

export type MunicipalityWideVegetablesAndFruitsDiseasesData = z.infer<
  typeof municipalityWideVegetablesAndFruitsDiseasesSchema
>;
export type UpdateMunicipalityWideVegetablesAndFruitsDiseasesData =
  MunicipalityWideVegetablesAndFruitsDiseasesData;
export type MunicipalityWideVegetablesAndFruitsDiseasesFilter = z.infer<
  typeof municipalityWideVegetablesAndFruitsDiseasesFilterSchema
>;

// Export the vegetable and fruit type options for use in UI components
export const vegetableFruitTypeOptions = [
  { value: "TOMATO", label: "गोलभेँडा" },
  { value: "CAULIFLOWER", label: "काउली" },
  { value: "CABBAGE", label: "बन्दा" },
  { value: "POTATO", label: "आलु" },
  { value: "WALNUT", label: "ओखर" },
  { value: "CITRUS", label: "सुन्तला/कागती" },
  { value: "KIWI", label: "किवी" },
  { value: "APPLE", label: "स्याउ" },
  { value: "MUSTARD", label: "रायो" },
  { value: "OTHER", label: "अन्य" },
];
