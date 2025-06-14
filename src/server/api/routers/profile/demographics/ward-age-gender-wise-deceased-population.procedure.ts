import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ageGenderWiseDeceasedPopulation } from "@/server/db/schema/profile/demographics/ward-age-gender-wise-deceased-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  ageGenderWiseDeceasedPopulationSchema,
  ageGenderWiseDeceasedPopulationFilterSchema,
  updateAgeGenderWiseDeceasedPopulationSchema,
  DeceasedAgeGroup,
  Gender,
} from "./ward-age-gender-wise-deceased-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all age-gender-wise deceased population data with optional filtering
export const getAllAgeGenderWiseDeceasedPopulation = publicProcedure
  .input(ageGenderWiseDeceasedPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(ageGenderWiseDeceasedPopulation);

      let conditions = [];

      if (input?.ageGroup) {
        conditions.push(
          eq(ageGenderWiseDeceasedPopulation.ageGroup, input.ageGroup)
        );
      }

      if (input?.gender) {
        conditions.push(
          eq(ageGenderWiseDeceasedPopulation.gender, input.gender)
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by age group and gender
      const data = await queryWithFilters.orderBy(
        ageGenderWiseDeceasedPopulation.ageGroup,
        ageGenderWiseDeceasedPopulation.gender
      );

      return data;
    } catch (error) {
      console.error("Error fetching age-gender-wise deceased population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Create a new age-gender-wise deceased population entry
export const createAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(ageGenderWiseDeceasedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create age-gender-wise deceased population data",
      });
    }

    // Check if entry already exists for this age group and gender
    const existing = await ctx.db
      .select({ id: ageGenderWiseDeceasedPopulation.id })
      .from(ageGenderWiseDeceasedPopulation)
      .where(
        and(
          eq(ageGenderWiseDeceasedPopulation.ageGroup, input.ageGroup as DeceasedAgeGroup),
          eq(ageGenderWiseDeceasedPopulation.gender, input.gender as Gender)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup} and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(ageGenderWiseDeceasedPopulation).values({
      id: input.id || uuidv4(),
      ageGroup: input.ageGroup as DeceasedAgeGroup,
      gender: input.gender as Gender,
      deceasedPopulation: input.deceasedPopulation,
    });

    return { success: true };
  });

// Update an existing age-gender-wise deceased population entry
export const updateAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(updateAgeGenderWiseDeceasedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update age-gender-wise deceased population data",
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
      .select({ id: ageGenderWiseDeceasedPopulation.id })
      .from(ageGenderWiseDeceasedPopulation)
      .where(eq(ageGenderWiseDeceasedPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(ageGenderWiseDeceasedPopulation)
      .set({
        ageGroup: input.ageGroup as DeceasedAgeGroup,
        gender: input.gender as Gender,
        deceasedPopulation: input.deceasedPopulation,
      })
      .where(eq(ageGenderWiseDeceasedPopulation.id, input.id));

    return { success: true };
  });

// Delete an age-gender-wise deceased population entry
export const deleteAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete age-gender-wise deceased population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(ageGenderWiseDeceasedPopulation)
      .where(eq(ageGenderWiseDeceasedPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getAgeGenderWiseDeceasedPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get totals by age group and gender
      const summarySql = sql`
        SELECT 
          age_group,
          gender, 
          SUM(deceased_population) as total_deceased
        FROM 
          acme_age_gender_wise_deceased_population
        GROUP BY 
          age_group, gender
        ORDER BY 
          age_group, gender
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get overall totals by gender
      const totalByGenderSql = sql`
        SELECT 
          gender,
          SUM(deceased_population) as total_deceased
        FROM 
          acme_age_gender_wise_deceased_population
        GROUP BY 
          gender
      `;

      const totalByGender = await ctx.db.execute(totalByGenderSql);

      return {
        byAgeAndGender: summaryData,
        byGender: totalByGender,
      };
    } catch (error) {
      console.error("Error in getAgeGenderWiseDeceasedPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve age-gender-wise deceased population summary",
      });
    }
  }
);

// Export the router with all procedures
export const ageGenderWiseDeceasedPopulationRouter = createTRPCRouter({
  getAll: getAllAgeGenderWiseDeceasedPopulation,
  create: createAgeGenderWiseDeceasedPopulation,
  summary: getAgeGenderWiseDeceasedPopulationSummary,
});


