import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { castePopulation } from "@/server/db/schema/profile/demographics/caste-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  castePopulationSchema,
  castePopulationFilterSchema,
  updateCastePopulationSchema,
  casteOptions,
} from "./caste-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CasteTypes } from "@/server/db/schema/common/enums";

// Get all caste population data with optional filtering
export const getAllCastePopulation = publicProcedure
  .input(castePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(castePopulation);

      let conditions = [];

      if (input?.casteType) {
        conditions.push(eq(castePopulation.casteType, input.casteType as keyof typeof CasteTypes));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by total population (male + female) in descending order
      const data = await queryWithFilters.orderBy(
        desc(sql`${castePopulation.malePopulation} + ${castePopulation.femalePopulation}`),
        castePopulation.casteType,
      );

      // Transform the data to include Nepali caste names and total population
      return data.map(item => ({
        ...item,
        casteTypeDisplay: CasteTypes[item.casteType as keyof typeof CasteTypes] || item.casteType,
        totalPopulation: item.malePopulation + item.femalePopulation,
      }));
    } catch (error) {
      console.error("Error fetching caste population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get caste population data for a specific caste
export const getCastePopulation = publicProcedure
  .input(z.object({ casteType: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(castePopulation)
      .where(eq(castePopulation.casteType, input.casteType as keyof typeof CasteTypes))
      .limit(1);

    if (data.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Caste population data not found",
      });
    }

    // Transform data to include Nepali caste names and total population
    return {
      ...data[0],
      casteTypeDisplay: CasteTypes[data[0].casteType as keyof typeof CasteTypes] || data[0].casteType,
      totalPopulation: data[0].malePopulation + data[0].femalePopulation,
    };
  });

// Create a new caste population entry
export const createCastePopulation = protectedProcedure
  .input(castePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create caste population data",
      });
    }

    // Check if entry already exists for this caste type
    const existing = await ctx.db
      .select({ id: castePopulation.id })
      .from(castePopulation)
      .where(eq(castePopulation.casteType, input.casteType as keyof typeof CasteTypes))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Caste population data already exists for this caste type",
      });
    }

    // Verify caste type is valid
    if (!Object.keys(CasteTypes).includes(input.casteType)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid caste type",
      });
    }

    const processedInput = {
      id: input.id || uuidv4(),
      casteType: input.casteType as keyof typeof CasteTypes,
      malePopulation: input.malePopulation,
      femalePopulation: input.femalePopulation,
    };

    // Create new record
    await ctx.db.insert(castePopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing caste population entry
export const updateCastePopulation = protectedProcedure
  .input(updateCastePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update caste population data",
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
      .select({ id: castePopulation.id })
      .from(castePopulation)
      .where(eq(castePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Caste population data not found",
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    if (input.casteType !== undefined) {
      if (!Object.keys(CasteTypes).includes(input.casteType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid caste type",
        });
      }
      processedInput.casteType = input.casteType as keyof typeof CasteTypes;
    }
    if (input.malePopulation !== undefined) processedInput.malePopulation = input.malePopulation;
    if (input.femalePopulation !== undefined) processedInput.femalePopulation = input.femalePopulation;

    // Update the record
    await ctx.db
      .update(castePopulation)
      .set(processedInput)
      .where(eq(castePopulation.id, input.id));

    return { success: true };
  });

// Delete a caste population entry
export const deleteCastePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete caste population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(castePopulation)
      .where(eq(castePopulation.id, input.id));

    return { success: true };
  });

// Get summary of caste population across all castes
export const getCastePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      const data = await ctx.db.select().from(castePopulation);
      
      const totalMale = data.reduce((sum, item) => sum + item.malePopulation, 0);
      const totalFemale = data.reduce((sum, item) => sum + item.femalePopulation, 0);
      const totalPopulation = totalMale + totalFemale;
      
      const casteCount = data.length;
      
      // Find the most populous caste
      const mostPopulousCaste = data.reduce((prev, current) => {
        const prevTotal = prev.malePopulation + prev.femalePopulation;
        const currentTotal = current.malePopulation + current.femalePopulation;
        return prevTotal > currentTotal ? prev : current;
      });

      return {
        totalMale,
        totalFemale,
        totalPopulation,
        casteCount,
        mostPopulousCaste: {
          ...mostPopulousCaste,
          casteTypeDisplay: CasteTypes[mostPopulousCaste.casteType as keyof typeof CasteTypes] || mostPopulousCaste.casteType,
          totalPopulation: mostPopulousCaste.malePopulation + mostPopulousCaste.femalePopulation,
        },
      };
    } catch (error) {
      console.error("Error fetching caste population summary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve summary data",
      });
    }
  }
);

// Export the router with all procedures
export const castePopulationRouter = createTRPCRouter({
  getAll: getAllCastePopulation,
  getByCaste: getCastePopulation,
  create: createCastePopulation,
  update: updateCastePopulation,
  delete: deleteCastePopulation,
  summary: getCastePopulationSummary,
});
