import { z } from "zod";

// Schema for municipality-wide agriculture representatives data
export const municipalityWideAgricultureRepresentativesSchema = z.object({
  id: z.string().optional(),
  serialNumber: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  nameEnglish: z.string().min(1, "English name is required"),
  position: z.string().min(1, "Position is required"),
  positionFull: z.string().min(1, "Full position is required"),
  positionEnglish: z.string().min(1, "English position is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  branch: z.string().min(1, "Branch is required"),
  branchEnglish: z.string().min(1, "English branch is required"),
  remarks: z.string().optional().default(""),
});

// Schema for filtering municipality-wide agriculture representatives data
export const municipalityWideAgricultureRepresentativesFilterSchema = z.object({
  serialNumber: z.number().int().positive().optional(),
  name: z.string().optional(),
  position: z.string().optional(),
  branch: z.string().optional(),
});

export const updateMunicipalityWideAgricultureRepresentativesSchema = 
  municipalityWideAgricultureRepresentativesSchema;

export type MunicipalityWideAgricultureRepresentativesData = z.infer<
  typeof municipalityWideAgricultureRepresentativesSchema
>;
export type UpdateMunicipalityWideAgricultureRepresentativesData = 
  MunicipalityWideAgricultureRepresentativesData;
export type MunicipalityWideAgricultureRepresentativesFilter = z.infer<
  typeof municipalityWideAgricultureRepresentativesFilterSchema
>;
