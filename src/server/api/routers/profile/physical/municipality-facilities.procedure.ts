import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityFacilities } from "@/server/db/schema/profile/physical/municipality-facilities";
import { eq, sql } from "drizzle-orm";
import {
  municipalityFacilitiesSchema,
  municipalityFacilitiesFilterSchema,
  updateMunicipalityFacilitiesSchema,
} from "./municipality-facilities.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality facilities data with optional filtering
export const getAllMunicipalityFacilities = publicProcedure
  .input(municipalityFacilitiesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(municipalityFacilities);

      let query = baseQuery;

      // Sort by facility type
      const data = await query.orderBy(municipalityFacilities.facility);

      return data;
    } catch (error) {
      console.error("Error fetching municipality facilities data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific facility
export const getMunicipalityFacilitiesByType = publicProcedure
  .input(z.object({ facility: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityFacilities)
      .where(eq(municipalityFacilities.facility, input.facility as any))
      .limit(1);

    return data[0] || null;
  });

// Create a new municipality facilities entry
export const createMunicipalityFacilities = protectedProcedure
  .input(municipalityFacilitiesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality facilities data",
      });
    }

    // Check if entry already exists for this facility type
    const existing = await ctx.db
      .select({ id: municipalityFacilities.id })
      .from(municipalityFacilities)
      .where(eq(municipalityFacilities.facility, input.facility))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for facility ${input.facility} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityFacilities).values({
      id: input.id || uuidv4(),
      facility: input.facility,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing municipality facilities entry
export const updateMunicipalityFacilities = protectedProcedure
  .input(updateMunicipalityFacilitiesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality facilities data",
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
      .select({ id: municipalityFacilities.id })
      .from(municipalityFacilities)
      .where(eq(municipalityFacilities.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityFacilities)
      .set({
        facility: input.facility,
        population: input.population,
      })
      .where(eq(municipalityFacilities.id, input.id));

    return { success: true };
  });

// Delete a municipality facilities entry
export const deleteMunicipalityFacilities = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality facilities data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityFacilities)
      .where(eq(municipalityFacilities.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityFacilitiesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total population and facility counts
      const summarySql = sql`
        SELECT 
          COUNT(*) as total_facilities,
          SUM(population) as total_population
        FROM 
          municipality_facilities
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0] || { total_facilities: 0, total_population: 0 };
    } catch (error) {
      console.error("Error in getMunicipalityFacilitiesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality facilities summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityFacilitiesRouter = createTRPCRouter({
  getAll: getAllMunicipalityFacilities,
  getByType: getMunicipalityFacilitiesByType,
  create: createMunicipalityFacilities,
  update: updateMunicipalityFacilities,
  delete: deleteMunicipalityFacilities,
  summary: getMunicipalityFacilitiesSummary,
});
