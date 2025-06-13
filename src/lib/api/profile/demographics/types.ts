

/**
 * Types specific to the demographics domain
 */

// Religion population response (updated structure without ward)
export interface WardWiseReligionPopulationResponse {
  id: string;
  religionType: ReligionType;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
  percentage: number;
  createdAt?: string;
  updatedAt?: string;
}

// Ward population summary
export interface WardPopulationSummaryResponse {
  wardNumber: number;
  totalPopulation: number;
}

// Religion population summary
export interface ReligionPopulationSummaryResponse {
  religionType: ReligionType;
  totalPopulation: number;
}

// Filter criteria for religion population
export interface WardWiseReligionPopulationFilter {
  religionType?: ReligionType;
}

// Create DTO (updated structure)
export interface CreateWardWiseReligionPopulationDto {
  religionType: ReligionType;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
  percentage: number;
}

// Update DTO (updated structure)
export interface UpdateWardWiseReligionPopulationDto {
  religionType: ReligionType;
  malePopulation: number;
  femalePopulation: number;
  totalPopulation: number;
  percentage: number;
}

// Religion enum type matching the backend
export enum ReligionType {
    HINDU = "HINDU",
    BUDDHIST = "BUDDHIST",
    KIRANT = "KIRANT",
    CHRISTIAN = "CHRISTIAN",
    ISLAM = "ISLAM",
    NATURE = "NATURE",
    BON = "BON",
    JAIN = "JAIN",
    BAHAI = "BAHAI",
    SIKH = "SIKH",
    OTHER = "OTHER",
  }
  