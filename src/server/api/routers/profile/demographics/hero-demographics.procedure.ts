import { eq, sum, count, avg } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { heroDemographics } from "@/server/db/schema/profile/demographics/hero-demographics";
import {
    getheroDemographicsInputSchema,
    heroDemographicsResponseSchema,
  } from "./hero-demographics.schema";

export const heroDemographicsRouter = createTRPCRouter({
  getheroDemographics: publicProcedure
    .input(getheroDemographicsInputSchema)
    .output(heroDemographicsResponseSchema)
    .query(async ({ ctx, input }) => {
      const { municipalityId } = input;

      // Fetch all ward demographics for the municipality
      const wards = await ctx.db
        .select()
        .from(heroDemographics)
        .where(eq(heroDemographics.municipalityId, municipalityId))
        .orderBy(heroDemographics.wardNo);

      if (wards.length === 0) {
        // Return default data if no wards found
        return {
          totalPopulation: 21671,
          totalAreaSqKm: 163.01,
          totalWards: 6,
          populationDensity: 133.0,
          wards: [],
        };
      }

      // Calculate totals and averages
      const totalPopulation = wards.reduce((sum, ward) => sum + ward.population, 0);
      const totalAreaSqKm = wards.reduce(
        (sum, ward) => sum + parseFloat(ward.areaSqKm.toString()),
        0,
      );
      const totalWards = wards.length;
      const populationDensity = totalAreaSqKm > 0 ? totalPopulation / totalAreaSqKm : 0;

      // Format wards data
      const formattedWards = wards.map((ward) => ({
        wardNo: ward.wardNo,
        includedVdcOrMunicipality: ward.includedVdcOrMunicipality,
        population: ward.population,
        areaSqKm: parseFloat(ward.areaSqKm.toString()),
      }));

      return {
        totalPopulation,
        totalAreaSqKm: Math.round(totalAreaSqKm * 100) / 100, // Round to 2 decimal places
        totalWards,
        populationDensity: Math.round(populationDensity * 100) / 100,
        wards: formattedWards,
      };
    }),

  getheroDemographicsSummary: publicProcedure
    .input(getheroDemographicsInputSchema)
    .query(async ({ ctx, input }) => {
      const { municipalityId } = input;

      // Get summary statistics using aggregation
      const summaryResult = await ctx.db
        .select({
          totalPopulation: sum(heroDemographics.population),
          totalAreaSqKm: sum(heroDemographics.areaSqKm),
          totalWards: count(heroDemographics.id),
          averagePopulation: avg(heroDemographics.population),
          averageArea: avg(heroDemographics.areaSqKm),
        })
        .from(heroDemographics)
        .where(eq(heroDemographics.municipalityId, municipalityId));

      const summary = summaryResult[0];

      return {
        totalPopulation: Number(summary?.totalPopulation) || 0,
        totalAreaSqKm: Number(summary?.totalAreaSqKm) || 0,
        totalWards: Number(summary?.totalWards) || 0,
        averageWardPopulation: Number(summary?.averagePopulation) || 0,
        averageWardArea: Number(summary?.averageArea) || 0,
        populationDensity: 
          Number(summary?.totalAreaSqKm) > 0 
            ? Number(summary?.totalPopulation) / Number(summary?.totalAreaSqKm)
            : 0,
      };
    }),

  getWardTable: publicProcedure
    .input(getheroDemographicsInputSchema)
    .query(async ({ ctx, input }) => {
      const { municipalityId } = input;

      // Fetch all ward demographics for the municipality
      const wards = await ctx.db
        .select({
          id: heroDemographics.id,
          wardNo: heroDemographics.wardNo,
          includedVdcOrMunicipality: heroDemographics.includedVdcOrMunicipality,
          population: heroDemographics.population,
          areaSqKm: heroDemographics.areaSqKm,
          createdAt: heroDemographics.createdAt,
          updatedAt: heroDemographics.updatedAt,
        })
        .from(heroDemographics)
        .where(eq(heroDemographics.municipalityId, municipalityId))
        .orderBy(heroDemographics.wardNo);

      if (wards.length === 0) {
        // Return default/sample data if no wards found
        return {
          wards: [
            {
              id: "sample-1",
              wardNo: 1,
              includedVdcOrMunicipality: "कुरेली (१–९)",
              population: 2939,
              areaSqKm: 47.76,
              estimatedHouseholds: Math.round(2939 / 2.87),
              populationDensity: Math.round((2939 / 47.76) * 100) / 100,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "sample-2",
              wardNo: 2,
              includedVdcOrMunicipality: "राडसी (१–९)",
              population: 4928,
              areaSqKm: 32.69,
              estimatedHouseholds: Math.round(4928 / 2.87),
              populationDensity: Math.round((4928 / 32.69) * 100) / 100,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            // Add more default wards...
          ],
          totals: {
            totalWards: 6,
            totalPopulation: 21671,
            totalAreaSqKm: 163.01,
            totalEstimatedHouseholds: Math.round(21671 / 2.87),
            averagePopulationDensity: Math.round((21671 / 163.01) * 100) / 100,
          },
        };
      }

      // Process the actual data
      const processedWards = wards.map((ward) => {
        const areaSqKm = parseFloat(ward.areaSqKm.toString());
        const estimatedHouseholds = Math.round(ward.population / 2.87);
        const populationDensity = areaSqKm > 0 ? Math.round((ward.population / areaSqKm) * 100) / 100 : 0;

        return {
          id: ward.id,
          wardNo: ward.wardNo,
          includedVdcOrMunicipality: ward.includedVdcOrMunicipality,
          population: ward.population,
          areaSqKm,
          estimatedHouseholds,
          populationDensity,
          createdAt: ward.createdAt?.toISOString() || null,
          updatedAt: ward.updatedAt?.toISOString() || null,
        };
      });

      // Calculate totals
      const totalPopulation = processedWards.reduce((sum, ward) => sum + ward.population, 0);
      const totalAreaSqKm = processedWards.reduce((sum, ward) => sum + ward.areaSqKm, 0);
      const totalEstimatedHouseholds = processedWards.reduce((sum, ward) => sum + ward.estimatedHouseholds, 0);
      const averagePopulationDensity = totalAreaSqKm > 0 ? Math.round((totalPopulation / totalAreaSqKm) * 100) / 100 : 0;

      return {
        wards: processedWards,
        totals: {
          totalWards: processedWards.length,
          totalPopulation,
          totalAreaSqKm: Math.round(totalAreaSqKm * 100) / 100,
          totalEstimatedHouseholds,
          averagePopulationDensity,
        },
      };
    }),
});
