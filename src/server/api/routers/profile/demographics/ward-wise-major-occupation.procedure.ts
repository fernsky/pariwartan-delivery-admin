import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { familyMainOccupation } from "@/server/db/schema/profile/demographics/ward-wise-major-occupation";
import { eq, desc, sql } from "drizzle-orm";
import {
  familyMainOccupationFilterSchema,
  familyMainOccupationSchema,
  FamilyMainOccupationType,
} from "./ward-wise-major-occupation.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all family main occupation data with optional filtering
export const getAllFamilyMainOccupation = publicProcedure
  .input(familyMainOccupationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(familyMainOccupation);

        const queryWithFilters = input?.occupation
          ? baseQuery.where(eq(familyMainOccupation.occupation, input.occupation))
          : baseQuery;

        // Sort by total population descending
        data = await queryWithFilters.orderBy(desc(familyMainOccupation.totalPopulation));
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            occupation,
            age_15_19,
            age_20_24,
            age_25_29,
            age_30_34,
            age_35_39,
            age_40_44,
            age_45_49,
            total_population,
            percentage
          FROM 
            acme_family_main_occupation
          ORDER BY 
            total_population DESC
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            occupation: row.occupation,
            age15_19: parseInt(String(row.age_15_19 || "0")),
            age20_24: parseInt(String(row.age_20_24 || "0")),
            age25_29: parseInt(String(row.age_25_29 || "0")),
            age30_34: parseInt(String(row.age_30_34 || "0")),
            age35_39: parseInt(String(row.age_35_39 || "0")),
            age40_44: parseInt(String(row.age_40_44 || "0")),
            age45_49: parseInt(String(row.age_45_49 || "0")),
            totalPopulation: parseInt(String(row.total_population || "0")),
            percentage: parseFloat(String(row.percentage || "0")),
          }));

          // Apply filters if needed
          if (input?.occupation) {
            data = data.filter((item) => item.occupation === input.occupation);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching family main occupation data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Create new family main occupation entry
export const createFamilyMainOccupation = protectedProcedure
  .input(familyMainOccupationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const newEntry = await ctx.db
        .insert(familyMainOccupation)
        .values({
          id: input.id || uuidv4(),
          occupation: input.occupation,
          age15_19: input.age15_19,
          age20_24: input.age20_24,
          age25_29: input.age25_29,
          age30_34: input.age30_34,
          age35_39: input.age35_39,
          age40_44: input.age40_44,
          age45_49: input.age45_49,
          totalPopulation: input.totalPopulation,
          percentage: input.percentage.toString(),
        })
        .returning();

      return newEntry[0];
    } catch (error) {
      console.error("Error creating family main occupation:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create entry",
      });
    }
  });

// Get summary statistics
export const getFamilyMainOccupationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total population and percentage summary
      const summarySql = sql`
        SELECT 
          SUM(total_population) as total_population,
          SUM(age_15_19) as total_age_15_19,
          SUM(age_20_24) as total_age_20_24,
          SUM(age_25_29) as total_age_25_29,
          SUM(age_30_34) as total_age_30_34,
          SUM(age_35_39) as total_age_35_39,
          SUM(age_40_44) as total_age_40_44,
          SUM(age_45_49) as total_age_45_49
        FROM 
          acme_family_main_occupation
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0];
    } catch (error) {
      console.error("Error in getFamilyMainOccupationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve family main occupation summary",
      });
    }
  },
);


// Export the router with all procedures
export const familyMainOccupationRouter = createTRPCRouter({
  getAll: getAllFamilyMainOccupation,
  create: createFamilyMainOccupation,
  summary: getFamilyMainOccupationSummary,
});