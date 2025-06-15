import { z } from "zod";

// Define age group enum to match the database
export const AgeGroupEnum = z.enum([
  "0-14",
  "15-24",
  "25-34", 
  "35-44",
  "45-54",
  "55-64",
  "65_PLUS",
  "NOT_MENTIONED",
  "TOTAL"
]);

// Define gender enum to match the database
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE",
  "TOTAL"
]);

// Define country region enum to match the actual SQL data
export const CountryRegionEnum = z.enum([
  "INDIA",
  "SAARC", 
  "ASIAN",
  "MIDDLE_EAST",
  "OTHER_ASIAN",
  "EUROPE",
  "OTHER_EUROPE",
  "NORTH_AMERICA", 
  "AFRICA",
  "PACIFIC",
  "OTHER",
  "NOT_DISCLOSED"
]);

export type AgeGroupType = z.infer<typeof AgeGroupEnum>;
export type GenderType = z.infer<typeof GenderEnum>;
export type CountryRegionType = z.infer<typeof CountryRegionEnum>;

// Schema for ward-wise foreign employment countries data (keeping name for UI compatibility)
export const wardWiseForeignEmploymentCountriesSchema = z.object({
  id: z.string().optional(),
  ageGroup: AgeGroupEnum,
  gender: GenderEnum,
  country: CountryRegionEnum,
  population: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

// Schema for filtering the data
export const wardWiseForeignEmploymentCountriesFilterSchema = z.object({
  ageGroup: AgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
  country: CountryRegionEnum.optional(),
});

export const updateWardWiseForeignEmploymentCountriesSchema = wardWiseForeignEmploymentCountriesSchema;

export type WardWiseForeignEmploymentCountriesData = z.infer<
  typeof wardWiseForeignEmploymentCountriesSchema
>;
export type UpdateWardWiseForeignEmploymentCountriesData = WardWiseForeignEmploymentCountriesData;
export type WardWiseForeignEmploymentCountriesFilter = z.infer<
  typeof wardWiseForeignEmploymentCountriesFilterSchema
>;

// Export the country region options for use in UI components
export const foreignEmploymentCountryOptions = [
  { value: "INDIA", label: "भारत" },
  { value: "SAARC", label: "सार्क" },
  { value: "ASIAN", label: "एशियाली" },
  { value: "MIDDLE_EAST", label: "मध्य पूर्व" },
  { value: "OTHER_ASIAN", label: "अन्य एशियाली" },
  { value: "EUROPE", label: "युरोप" },
  { value: "OTHER_EUROPE", label: "अन्य युरोपेली" },
  { value: "NORTH_AMERICA", label: "उत्तर अमेरिका" },
  { value: "AFRICA", label: "अफ्रिका" },
  { value: "PACIFIC", label: "प्रशान्त" },
  { value: "OTHER", label: "अन्य" },
  { value: "NOT_DISCLOSED", label: "खुलाइएको छैन" },
];

// Export age group options
export const ageGroupOptions = [
  { value: "0-14", label: "०-१४ वर्ष" },
  { value: "15-24", label: "१५-२४ वर्ष" },
  { value: "25-34", label: "२५-३४ वर्ष" },
  { value: "35-44", label: "३५-४४ वर्ष" },
  { value: "45-54", label: "४५-५४ वर्ष" },
  { value: "55-64", label: "५५-६४ वर्ष" },
  { value: "65_PLUS", label: "६५+ वर्ष" },
  { value: "NOT_MENTIONED", label: "उल्लेख नगरिएको" },
  { value: "TOTAL", label: "कुल" },
];

// Export gender options
export const genderOptions = [
  { value: "MALE", label: "पुरुष" },
  { value: "FEMALE", label: "महिला" },
  { value: "TOTAL", label: "कुल" },
];
 
export type ForeignEmploymentCountryType = z.infer<typeof CountryRegionEnum>;


