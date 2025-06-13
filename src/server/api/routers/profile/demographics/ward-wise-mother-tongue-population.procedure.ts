import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { motherTonguePopulation } from "@/server/db/schema/profile/demographics/ward-wise-mother-tongue-population";
import { eq, desc, sql } from "drizzle-orm";
import {
  motherTonguePopulationSchema,
  motherTonguePopulationFilterSchema,
  updateMotherTonguePopulationSchema,
} from "./ward-wise-mother-tongue-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all mother tongue population data with optional filtering
export const getAllMotherTonguePopulation = publicProcedure
  .input(motherTonguePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Log database URL for debugging
      console.log("Database URL:", process.env.DATABASE_URL);
      console.log("Database connection attempt starting...");

      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);
      console.log("Database encoding set to UTF8");

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(motherTonguePopulation);

        const queryWithFilters = input?.languageType
          ? baseQuery.where(eq(motherTonguePopulation.languageType, input.languageType))
          : baseQuery;

        // Sort by population descending
        data = await queryWithFilters.orderBy(desc(motherTonguePopulation.population));
        console.log("Successfully queried main schema table, records found:", data.length);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        console.log("Attempting to query ACME table...");
        const acmeSql = sql`
          SELECT 
            id,
            language_type,
            population,
            percentage,
            updated_at,
            created_at
          FROM 
            acme_mother_tongue_population
          ORDER BY 
            population DESC
        `;
        const acmeResult = await ctx.db.execute(acmeSql);
        console.log("ACME table query result:", acmeResult);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            languageType: row.language_type,
            population: parseInt(String(row.population || "0")),
            percentage: row.percentage ? parseFloat(String(row.percentage)) : null,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.languageType) {
            data = data.filter(
              (item) => item.languageType === input.languageType,
            );
          }
          console.log("Successfully transformed ACME data, records:", data.length);
        }
      }

      console.log("Final data returned:", data);
      return data;
    } catch (error) {
      console.error("Error fetching mother tongue population data:", error);
      console.error("Database URL being used:", process.env.DATABASE_URL);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Create a new mother tongue population entry
export const createMotherTonguePopulation = protectedProcedure
  .input(motherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("Creating mother tongue population entry:", input);

    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create mother tongue population data",
      });
    }

    // Check if entry already exists for this language type
    const existing = await ctx.db
      .select({ id: motherTonguePopulation.id })
      .from(motherTonguePopulation)
      .where(eq(motherTonguePopulation.languageType, input.languageType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for language ${input.languageType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(motherTonguePopulation).values({
      id: input.id || uuidv4(),
      languageType: input.languageType,
      population: input.population,
      percentage: input.percentage ? String(input.percentage) : null,
    });

    console.log("Successfully created mother tongue population entry");
    return { success: true };
  });

// Update an existing mother tongue population entry
export const updateMotherTonguePopulation = protectedProcedure
  .input(updateMotherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    console.log("Updating mother tongue population entry:", input);

    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update mother tongue population data",
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
      .select({ id: motherTonguePopulation.id })
      .from(motherTonguePopulation)
      .where(eq(motherTonguePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(motherTonguePopulation)
      .set({
        languageType: input.languageType,
        population: input.population,
        percentage: input.percentage ? String(input.percentage) : null,
      })
      .where(eq(motherTonguePopulation.id, input.id));

    console.log("Successfully updated mother tongue population entry");
    return { success: true };
  });

// Delete a mother tongue population entry
export const deleteMotherTonguePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    console.log("Deleting mother tongue population entry:", input.id);

    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete mother tongue population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(motherTonguePopulation)
      .where(eq(motherTonguePopulation.id, input.id));

    console.log("Successfully deleted mother tongue population entry");
    return { success: true };
  });

// Get summary statistics
export const getMotherTonguePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      console.log("Getting mother tongue population summary...");

      const summarySql = sql`
        SELECT 
          COUNT(*) as total_languages,
          SUM(population) as total_population,
          AVG(percentage) as average_percentage
        FROM 
          acme_mother_tongue_population
      `;

      const summaryData = await ctx.db.execute(summarySql);
      console.log("Summary data:", summaryData);

      return summaryData;
    } catch (error) {
      console.error("Error in getMotherTonguePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve mother tongue population summary",
      });
    }
  },
);

// Export the router with all procedures
export const motherTonguePopulationRouter = createTRPCRouter({
  getAll: getAllMotherTonguePopulation,
  create: createMotherTonguePopulation,
  update: updateMotherTonguePopulation,
  delete: deleteMotherTonguePopulation,
  summary: getMotherTonguePopulationSummary,
});
