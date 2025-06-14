import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardGenderWiseEconomicallyActivePopulation } from "@/server/db/schema/profile/demographics/ward-gender-wise-economically-active-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardGenderWiseEconomicallyActivePopulationFilterSchema,
  wardGenderWiseEconomicallyActivePopulationSchema,
} from "./ward-gender-wise-economically-active-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward gender wise economically active population data with optional filtering
export const getAllWardGenderWiseEconomicallyActivePopulation = publicProcedure
  .input(wardGenderWiseEconomicallyActivePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardGenderWiseEconomicallyActivePopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardGenderWiseEconomicallyActivePopulation.wardNumber, input.wardNumber)
          );
        }

        if (input?.gender) {
          conditions.push(
            eq(wardGenderWiseEconomicallyActivePopulation.gender, input.gender)
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and gender
        data = await queryWithFilters.orderBy(
          wardGenderWiseEconomicallyActivePopulation.wardNumber,
          wardGenderWiseEconomicallyActivePopulation.gender
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
            gender,
            age_10_plus_total,
            economically_active_employed,
            economically_active_unemployed,
            household_work,
            economically_active_total,
            dependent_population
          FROM 
            acme_ward_gender_wise_economically_active_population
          ORDER BY 
            CASE 
              WHEN ward_number = 'जम्मा' THEN 999 
              ELSE CAST(ward_number AS INTEGER)
            END,
            CASE gender
              WHEN 'पुरुष' THEN 1
              WHEN 'महिला' THEN 2
              WHEN 'जम्मा' THEN 3
            END
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: String(row.ward_number),
            gender: row.gender,
            age10PlusTotal: parseInt(String(row.age_10_plus_total || "0")),
            economicallyActiveEmployed: parseInt(String(row.economically_active_employed || "0")),
            economicallyActiveUnemployed: parseInt(String(row.economically_active_unemployed || "0")),
            householdWork: parseInt(String(row.household_work || "0")),
            economicallyActiveTotal: parseInt(String(row.economically_active_total || "0")),
            dependentPopulation: parseInt(String(row.dependent_population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.gender) {
            data = data.filter((item) => item.gender === input.gender);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward gender wise economically active population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardGenderWiseEconomicallyActivePopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.string() }))
  .query(async ({ ctx, input }) => {
    try {
      const acmeSql = sql`
        SELECT 
          id,
          ward_number,
          gender,
          age_10_plus_total,
          economically_active_employed,
          economically_active_unemployed,
          household_work,
          economically_active_total,
          dependent_population
        FROM 
          acme_ward_gender_wise_economically_active_population
        WHERE 
          ward_number = ${input.wardNumber}
        ORDER BY 
          CASE gender
            WHEN 'पुरुष' THEN 1
            WHEN 'महिला' THEN 2
            WHEN 'जम्मा' THEN 3
          END
      `;
      const result = await ctx.db.execute(acmeSql);

      const data = result.map((row) => ({
        id: row.id,
        wardNumber: String(row.ward_number),
        gender: row.gender,
        age10PlusTotal: parseInt(String(row.age_10_plus_total || "0")),
        economicallyActiveEmployed: parseInt(String(row.economically_active_employed || "0")),
        economicallyActiveUnemployed: parseInt(String(row.economically_active_unemployed || "0")),
        householdWork: parseInt(String(row.household_work || "0")),
        economicallyActiveTotal: parseInt(String(row.economically_active_total || "0")),
        dependentPopulation: parseInt(String(row.dependent_population || "0")),
      }));

      return data;
    } catch (error) {
      console.error("Error fetching ward data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward data",
      });
    }
  });

// Create new ward gender wise economically active population entry
export const createWardGenderWiseEconomicallyActivePopulation = protectedProcedure
  .input(wardGenderWiseEconomicallyActivePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const newEntry = await ctx.db
        .insert(wardGenderWiseEconomicallyActivePopulation)
        .values({
          id: input.id || uuidv4(),
          wardNumber: input.wardNumber,
          gender: input.gender,
          age10PlusTotal: input.age10PlusTotal,
          economicallyActiveEmployed: input.economicallyActiveEmployed,
          economicallyActiveUnemployed: input.economicallyActiveUnemployed,
          householdWork: input.householdWork,
          economicallyActiveTotal: input.economicallyActiveTotal,
          dependentPopulation: input.dependentPopulation,
        })
        .returning();

      return newEntry[0];
    } catch (error) {
      console.error("Error creating ward gender wise economically active population:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create entry",
      });
    }
  });

// Get summary statistics
export const getWardGenderWiseEconomicallyActivePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get overall summary
      const summarySql = sql`
        SELECT 
          SUM(age_10_plus_total) as total_age_10_plus,
          SUM(economically_active_employed) as total_employed,
          SUM(economically_active_unemployed) as total_unemployed,
          SUM(household_work) as total_household_work,
          SUM(economically_active_total) as total_economically_active,
          SUM(dependent_population) as total_dependent
        FROM 
          acme_ward_gender_wise_economically_active_population
        WHERE 
          ward_number != 'जम्मा' AND gender != 'जम्मा'
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0];
    } catch (error) {
      console.error("Error in getWardGenderWiseEconomicallyActivePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardGenderWiseEconomicallyActivePopulationRouter = createTRPCRouter({
  getAll: getAllWardGenderWiseEconomicallyActivePopulation,
  getByWard: getWardGenderWiseEconomicallyActivePopulationByWard,
  create: createWardGenderWiseEconomicallyActivePopulation,
  summary: getWardGenderWiseEconomicallyActivePopulationSummary,
});
