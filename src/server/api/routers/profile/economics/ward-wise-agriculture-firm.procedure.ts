import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseAgricultureFirmCount } from "@/server/db/schema/profile/economics/ward-wise-agriculture-firm-count";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseAgricultureFirmCountSchema,
  wardWiseAgricultureFirmCountFilterSchema,
  updateWardWiseAgricultureFirmCountSchema,
} from "./ward-wise-agriculture-firm.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise agriculture firm count data with optional filtering
export const getAllWardWiseAgricultureFirmCount = publicProcedure
  .input(wardWiseAgricultureFirmCountFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseAgricultureFirmCount);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseAgricultureFirmCount.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseAgricultureFirmCount.wardNumber,
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
            count,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_agriculture_firm_count
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            count: parseInt(String(row.count || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise agriculture firm count data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseAgricultureFirmCountByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseAgricultureFirmCount)
      .where(eq(wardWiseAgricultureFirmCount.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise agriculture firm count entry
export const createWardWiseAgricultureFirmCount = protectedProcedure
  .input(wardWiseAgricultureFirmCountSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise agriculture firm count data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseAgricultureFirmCount.id })
      .from(wardWiseAgricultureFirmCount)
      .where(
        eq(wardWiseAgricultureFirmCount.wardNumber, input.wardNumber)
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseAgricultureFirmCount).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      count: input.count,
    });

    return { success: true };
  });

// Update an existing ward-wise agriculture firm count entry
export const updateWardWiseAgricultureFirmCount = protectedProcedure
  .input(updateWardWiseAgricultureFirmCountSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise agriculture firm count data",
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
      .select({ id: wardWiseAgricultureFirmCount.id })
      .from(wardWiseAgricultureFirmCount)
      .where(eq(wardWiseAgricultureFirmCount.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseAgricultureFirmCount)
      .set({
        wardNumber: input.wardNumber,
        count: input.count,
      })
      .where(eq(wardWiseAgricultureFirmCount.id, input.id));

    return { success: true };
  });

// Delete a ward-wise agriculture firm count entry
export const deleteWardWiseAgricultureFirmCount = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise agriculture firm count data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseAgricultureFirmCount)
      .where(eq(wardWiseAgricultureFirmCount.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseAgricultureFirmCountSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get summary statistics
      const summarySql = sql`
        SELECT 
          COUNT(*) as total_wards,
          SUM(count) as total_agricultural_groups,
          MAX(count) as highest_count,
          MIN(count) as lowest_count
        FROM 
          acme_ward_wise_agriculture_firm_count
      `;

      const summaryResult = await ctx.db.execute(summarySql);
      const summary = summaryResult[0];

      // Get ward with highest count
      const highestWardSql = sql`
        SELECT ward_number
        FROM acme_ward_wise_agriculture_firm_count
        WHERE count = (SELECT MAX(count) FROM acme_ward_wise_agriculture_firm_count)
        LIMIT 1
      `;

      const highestWardResult = await ctx.db.execute(highestWardSql);

      // Get ward with lowest count
      const lowestWardSql = sql`
        SELECT ward_number
        FROM acme_ward_wise_agriculture_firm_count
        WHERE count = (SELECT MIN(count) FROM acme_ward_wise_agriculture_firm_count)
        LIMIT 1
      `;

      const lowestWardResult = await ctx.db.execute(lowestWardSql);

      return {
        total_wards: parseInt(String(summary?.total_wards || "0")),
        total_agricultural_groups: parseInt(String(summary?.total_agricultural_groups || "0")),
        highest_count_ward: `वडा नं ${highestWardResult[0]?.ward_number}`,
        highest_count: parseInt(String(summary?.highest_count || "0")),
        lowest_count_ward: `वडा नं ${lowestWardResult[0]?.ward_number}`,
        lowest_count: parseInt(String(summary?.lowest_count || "0")),
      };
    } catch (error) {
      console.error("Error in getWardWiseAgricultureFirmCountSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise agriculture firm count summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseAgricultureFirmCountRouter = createTRPCRouter({
  getAll: getAllWardWiseAgricultureFirmCount,
  getByWard: getWardWiseAgricultureFirmCountByWard,
  create: createWardWiseAgricultureFirmCount,
  update: updateWardWiseAgricultureFirmCount,
  delete: deleteWardWiseAgricultureFirmCount,
  summary: getWardWiseAgricultureFirmCountSummary,
});
