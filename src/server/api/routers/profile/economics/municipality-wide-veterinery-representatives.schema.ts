import { z } from "zod";

// Schema for municipality-wide veterinary representatives data
export const municipalityWideVeterinaryRepresentativesSchema = z.object({
  id: z.string().optional(),
  serialNumber: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  nameEnglish: z.string().min(1, "English name is required"),
  position: z.string().min(1, "Position is required"),
  positionEnglish: z.string().min(1, "English position is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  branch: z.string().min(1, "Branch is required"),
  branchEnglish: z.string().min(1, "English branch is required"),
  remarks: z.string().optional().default(""),
});

// Schema for filtering municipality-wide veterinary representatives data
export const municipalityWideVeterinaryRepresentativesFilterSchema = z.object({
  serialNumber: z.number().int().positive().optional(),
  name: z.string().optional(),
  position: z.string().optional(),
  branch: z.string().optional(),
});

export const updateMunicipalityWideVeterinaryRepresentativesSchema = 
  municipalityWideVeterinaryRepresentativesSchema;

export type MunicipalityWideVeterinaryRepresentativesData = z.infer<
  typeof municipalityWideVeterinaryRepresentativesSchema
>;
export type UpdateMunicipalityWideVeterinaryRepresentativesData = 
  MunicipalityWideVeterinaryRepresentativesData;
export type MunicipalityWideVeterinaryRepresentativesFilter = z.infer<
  typeof municipalityWideVeterinaryRepresentativesFilterSchema
>;
