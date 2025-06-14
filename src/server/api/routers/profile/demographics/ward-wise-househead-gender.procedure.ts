import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { ageGroupHousehead } from "@/server/db/schema/profile/demographics/ward-wise-househead-gender";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  ageGroupHouseHeadSchema,
  ageGroupHouseHeadFilterSchema,
  updateAgeGroupHouseHeadSchema,
} from "./ward-wise-househead-gender.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all age-group-wise house head data with optional filtering
export const getAllAgeGroupHouseHead = publicProcedure
  .input(ageGroupHouseHeadFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(ageGroupHousehead);

      let conditions = [];

      if (input?.ageGroup) {
        conditions.push(eq(ageGroupHousehead.ageGroup, input.ageGroup));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by age group (custom order)
      const data = await queryWithFilters.orderBy(ageGroupHousehead.ageGroup);

      return data;
    } catch (error) {
      console.error("Error fetching age-group house head data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific age group
export const getAgeGroupHouseHeadByGroup = publicProcedure
  .input(z.object({ ageGroup: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(ageGroupHousehead)
      .where(eq(ageGroupHousehead.ageGroup, input.ageGroup))
      .limit(1);

    return data[0] || null;
  });

// Create a new age-group house head entry
export const createAgeGroupHouseHead = protectedProcedure
  .input(ageGroupHouseHeadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create age-group house head data",
      });
    }

    // Check if entry already exists for this age group
    const existing = await ctx.db
      .select({ id: ageGroupHousehead.id })
      .from(ageGroupHousehead)
      .where(eq(ageGroupHousehead.ageGroup, input.ageGroup))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(ageGroupHousehead).values({
      id: input.id || uuidv4(),
      ageGroup: input.ageGroup,
      maleHeads: input.maleHeads,
      femaleHeads: input.femaleHeads,
      totalFamilies: input.totalFamilies,
    });

    return { success: true };
  });

// Update an existing age-group house head entry
export const updateAgeGroupHouseHead = protectedProcedure
  .input(updateAgeGroupHouseHeadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update age-group house head data",
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
      .select({ id: ageGroupHousehead.id })
      .from(ageGroupHousehead)
      .where(eq(ageGroupHousehead.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(ageGroupHousehead)
      .set({
        ageGroup: input.ageGroup,
        maleHeads: input.maleHeads,
        femaleHeads: input.femaleHeads,
        totalFamilies: input.totalFamilies,
      })
      .where(eq(ageGroupHousehead.id, input.id));

    return { success: true };
  });

// Delete an age-group house head entry
export const deleteAgeGroupHouseHead = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete age-group house head data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(ageGroupHousehead)
      .where(eq(ageGroupHousehead.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getAgeGroupHouseHeadSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get totals (excluding the 'जम्मा' row to avoid double counting)
      const summarySql = sql`
        SELECT 
          SUM(male_heads) as total_male_heads,
          SUM(female_heads) as total_female_heads,
          SUM(total_families) as total_families
        FROM 
          acme_age_group_househead
        WHERE 
          age_group != 'जम्मा'
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getAgeGroupHouseHeadSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve age-group house head summary",
      });
    }
  },
);

// Export the router with the correct name to match the page usage
export const ageHouseHeadGenderRouter = createTRPCRouter({
  getAll: getAllAgeGroupHouseHead,
  getByGroup: getAgeGroupHouseHeadByGroup,
  create: createAgeGroupHouseHead,
  update: updateAgeGroupHouseHead,
  delete: deleteAgeGroupHouseHead,
  summary: getAgeGroupHouseHeadSummary,
});
