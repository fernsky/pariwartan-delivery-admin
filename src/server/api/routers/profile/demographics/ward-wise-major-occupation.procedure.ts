import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMajorOccupation } from "@/server/db/schema/profile/demographics/ward-wise-major-occupation";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseMajorOccupationSchema,
  wardWiseMajorOccupationFilterSchema,
  updateWardWiseMajorOccupationSchema,
  OccupationTypeEnum,
} from "./ward-wise-major-occupation.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise major occupation data with optional filtering
export const getAllWardWiseMajorOccupation = publicProcedure
  .input(wardWiseMajorOccupationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseMajorOccupation);

        let conditions = [];

        if (input?.wardNumber !== undefined) {
          conditions.push(
            eq(wardWiseMajorOccupation.wardNumber, input.wardNumber),
          );
        }

        if (input?.occupation) {
          conditions.push(
            eq(wardWiseMajorOccupation.occupation, input.occupation),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and occupation
        data = await queryWithFilters.orderBy(
          wardWiseMajorOccupation.wardNumber,
          wardWiseMajorOccupation.occupation,
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            occupation,
            population
          FROM 
            acme_ward_wise_major_occupation
          ORDER BY 
            ward_number, occupation
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            occupation: row.occupation,
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber !== undefined) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.occupation) {
            data = data.filter((item) => item.occupation === input.occupation);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise major occupation data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseMajorOccupationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMajorOccupation)
      .where(eq(wardWiseMajorOccupation.wardNumber, input.wardNumber))
      .orderBy(wardWiseMajorOccupation.occupation);

    return data;
  });

// Create a new ward-wise major occupation entry
export const createWardWiseMajorOccupation = protectedProcedure
  .input(wardWiseMajorOccupationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise major occupation data",
      });
    }

    // Check if entry already exists for this ward and occupation type
    const existing = await ctx.db
      .select({ id: wardWiseMajorOccupation.id })
      .from(wardWiseMajorOccupation)
      .where(
        and(
          eq(wardWiseMajorOccupation.wardNumber, input.wardNumber),
          eq(wardWiseMajorOccupation.occupation, input.occupation),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and occupation ${input.occupation} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseMajorOccupation).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      occupation: input.occupation,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise major occupation entry
export const updateWardWiseMajorOccupation = protectedProcedure
  .input(updateWardWiseMajorOccupationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise major occupation data",
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
      .select({ id: wardWiseMajorOccupation.id })
      .from(wardWiseMajorOccupation)
      .where(eq(wardWiseMajorOccupation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMajorOccupation)
      .set({
        wardNumber: input.wardNumber,
        occupation: input.occupation,
        population: input.population,
      })
      .where(eq(wardWiseMajorOccupation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise major occupation entry
export const deleteWardWiseMajorOccupation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise major occupation data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMajorOccupation)
      .where(eq(wardWiseMajorOccupation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseMajorOccupationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by occupation type across all wards
      const summarySql = sql`
        SELECT 
          occupation, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_major_occupation
        GROUP BY 
          occupation
        ORDER BY 
          occupation
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseMajorOccupationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise major occupation summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseMajorOccupationRouter = createTRPCRouter({
  getAll: getAllWardWiseMajorOccupation,
  getByWard: getWardWiseMajorOccupationByWard,
  create: createWardWiseMajorOccupation,
  update: updateWardWiseMajorOccupation,
  delete: deleteWardWiseMajorOccupation,
  summary: getWardWiseMajorOccupationSummary,
});
