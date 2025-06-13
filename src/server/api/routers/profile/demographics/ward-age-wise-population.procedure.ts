import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ageWisePopulation } from "@/server/db/schema/profile/demographics/ward-age-wise-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  ageWisePopulationSchema,
  ageWisePopulationFilterSchema,
  updateAgeWisePopulationSchema,
  AgeGroup,
  Gender,
} from "./ward-age-wise-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all age-wise population data with optional filtering
export const getAllAgeWisePopulation = publicProcedure
  .input(ageWisePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(ageWisePopulation);

      let conditions = [];

      if (input?.ageGroup) {
        conditions.push(eq(ageWisePopulation.ageGroup, input.ageGroup));
      }

      if (input?.gender) {
        conditions.push(eq(ageWisePopulation.gender, input.gender));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by age group and gender
      const data = await queryWithFilters.orderBy(
        ageWisePopulation.ageGroup,
        ageWisePopulation.gender,
      );

      return data;
    } catch (error) {
      console.error("Error fetching age-wise population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Create a new age-wise population entry
export const createAgeWisePopulation = protectedProcedure
  .input(ageWisePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create age-wise population data",
      });
    }

    // Check if entry already exists for this age group and gender
    const existing = await ctx.db
      .select({ id: ageWisePopulation.id })
      .from(ageWisePopulation)
      .where(
        and(
          eq(ageWisePopulation.ageGroup, input.ageGroup as AgeGroup),
          eq(ageWisePopulation.gender, input.gender as Gender),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup} and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(ageWisePopulation).values({
      id: input.id || uuidv4(),
      ageGroup: input.ageGroup as AgeGroup,
      gender: input.gender as Gender,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing age-wise population entry
export const updateAgeWisePopulation = protectedProcedure
  .input(updateAgeWisePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update age-wise population data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: ageWisePopulation.id })
      .from(ageWisePopulation)
      .where(eq(ageWisePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(ageWisePopulation)
      .set({
        ageGroup: input.ageGroup as AgeGroup,
        gender: input.gender as Gender,
        population: input.population,
      })
      .where(eq(ageWisePopulation.id, input.id));

    return { success: true };
  });

// Delete an age-wise population entry
export const deleteAgeWisePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete age-wise population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(ageWisePopulation)
      .where(eq(ageWisePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getAgeWisePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get totals by age group and gender
      const summarySql = sql`
        SELECT 
          age_group,
          gender, 
          SUM(population) as total_population
        FROM 
          acme_age_wise_population
        GROUP BY 
          age_group, gender
        ORDER BY 
          age_group, gender
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get total by gender
      const genderSummarySql = sql`
        SELECT 
          gender, 
          SUM(population) as total_population
        FROM 
          acme_age_wise_population
        GROUP BY 
          gender
        ORDER BY 
          gender
      `;

      const genderSummaryData = await ctx.db.execute(genderSummarySql);

      return {
        byAgeAndGender: summaryData,
        byGender: genderSummaryData,
      };
    } catch (error) {
      console.error("Error in getAgeWisePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve age-wise population summary",
      });
    }
  },
);

// Export the router with all procedures
export const ageWisePopulationRouter = createTRPCRouter({
  getAll: getAllAgeWisePopulation,
  create: createAgeWisePopulation,
  update: updateAgeWisePopulation,
  delete: deleteAgeWisePopulation,
  summary: getAgeWisePopulationSummary,
});
