import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseForeignEmploymentCountries } from "@/server/db/schema/profile/economics/ward-wise-foreign-employment-countries";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseForeignEmploymentCountriesSchema,
  wardWiseForeignEmploymentCountriesFilterSchema,
  updateWardWiseForeignEmploymentCountriesSchema,
  AgeGroupEnum,
  GenderEnum,
  CountryRegionEnum,
} from "./ward-wise-foreign-employment-countries.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise foreign employment countries data with optional filtering
export const getAllWardWiseForeignEmploymentCountries = publicProcedure
  .input(wardWiseForeignEmploymentCountriesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      let data: any[] = [];

      // Try querying the main schema table first
      try {
        const baseQuery = ctx.db.select().from(wardWiseForeignEmploymentCountries);

        let conditions = [];

        if (input?.ageGroup) {
          conditions.push(
            eq(wardWiseForeignEmploymentCountries.ageGroup, input.ageGroup),
          );
        }

        if (input?.gender) {
          conditions.push(eq(wardWiseForeignEmploymentCountries.gender, input.gender));
        }

        if (input?.country) {
          conditions.push(eq(wardWiseForeignEmploymentCountries.country, input.country));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        data = await queryWithFilters.orderBy(
          wardWiseForeignEmploymentCountries.ageGroup,
          wardWiseForeignEmploymentCountries.gender,
          wardWiseForeignEmploymentCountries.country,
        );
      } catch (mainSchemaError) {
        console.log("Main schema query failed, trying ACME table:", mainSchemaError);
        
        // Build ACME query with filters
        let acmeSql = sql`
          SELECT 
            id,
            age_group,
            gender,
            country,
            population,
            total,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_foreign_employment_countries
        `;

        // Add WHERE conditions if filters are provided
        const conditions = [];
        if (input?.ageGroup) {
          conditions.push(sql`age_group = ${input.ageGroup}`);
        }
        if (input?.gender) {
          conditions.push(sql`gender = ${input.gender}`);
        }
        if (input?.country) {
          conditions.push(sql`country = ${input.country}`);
        }

        if (conditions.length > 0) {
          acmeSql = sql`${acmeSql} WHERE ${sql.join(conditions, sql` AND `)}`;
        }

        acmeSql = sql`${acmeSql} ORDER BY age_group, gender, country`;

        try {
          const acmeResult = await ctx.db.execute(acmeSql);

          if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
            // Transform ACME data to match expected schema
            data = acmeResult.map((row) => ({
              id: row.id,
              ageGroup: row.age_group,
              gender: row.gender,
              country: row.country,
              population: parseInt(String(row.population || "0")),
              total: parseInt(String(row.total || "0")),
              updatedAt: row.updated_at,
              createdAt: row.created_at,
            }));
          }
        } catch (acmeError) {
          console.error("ACME table query also failed:", acmeError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve data from both main and ACME tables",
          });
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise foreign employment countries data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific age group and gender
export const getWardWiseForeignEmploymentCountriesByWard = publicProcedure
  .input(z.object({ 
    ageGroup: AgeGroupEnum.optional(),
    gender: GenderEnum.optional()
  }))
  .query(async ({ ctx, input }) => {
    try {
      let conditions = [];
      
      if (input.ageGroup) {
        conditions.push(eq(wardWiseForeignEmploymentCountries.ageGroup, input.ageGroup));
      }
      
      if (input.gender) {
        conditions.push(eq(wardWiseForeignEmploymentCountries.gender, input.gender));
      }

      const baseQuery = ctx.db.select().from(wardWiseForeignEmploymentCountries);
      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      const data = await queryWithFilters.orderBy(wardWiseForeignEmploymentCountries.country);

      return data;
    } catch (error) {
      // Fallback to ACME table
      let acmeSql = sql`
        SELECT 
          id,
          age_group,
          gender,
          country,
          population,
          total,
          updated_at,
          created_at
        FROM 
          acme_ward_wise_foreign_employment_countries
      `;

      const conditions = [];
      if (input.ageGroup) {
        conditions.push(sql`age_group = ${input.ageGroup}`);
      }
      if (input.gender) {
        conditions.push(sql`gender = ${input.gender}`);
      }

      if (conditions.length > 0) {
        acmeSql = sql`${acmeSql} WHERE ${sql.join(conditions, sql` AND `)}`;
      }

      acmeSql = sql`${acmeSql} ORDER BY country`;

      const acmeResult = await ctx.db.execute(acmeSql);
      return acmeResult.map((row) => ({
        id: row.id,
        ageGroup: row.age_group,
        gender: row.gender,
        country: row.country,
        population: parseInt(String(row.population || "0")),
        total: parseInt(String(row.total || "0")),
        updatedAt: row.updated_at,
        createdAt: row.created_at,
      }));
    }
  });

// Create a new entry
export const createWardWiseForeignEmploymentCountries = protectedProcedure
  .input(wardWiseForeignEmploymentCountriesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create foreign employment data",
      });
    }

    // Check if entry already exists for this combination
    const existing = await ctx.db
      .select({ id: wardWiseForeignEmploymentCountries.id })
      .from(wardWiseForeignEmploymentCountries)
      .where(
        and(
          eq(wardWiseForeignEmploymentCountries.ageGroup, input.ageGroup),
          eq(wardWiseForeignEmploymentCountries.gender, input.gender),
          eq(wardWiseForeignEmploymentCountries.country, input.country),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup}, gender ${input.gender}, and country ${input.country} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseForeignEmploymentCountries).values({
      id: input.id || uuidv4(),
      ageGroup: input.ageGroup,
      gender: input.gender,
      country: input.country,
      population: input.population,
      total: input.total,
    });

    return { success: true };
  });

// Update an existing entry
export const updateWardWiseForeignEmploymentCountries = protectedProcedure
  .input(updateWardWiseForeignEmploymentCountriesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update foreign employment data",
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
      .select({ id: wardWiseForeignEmploymentCountries.id })
      .from(wardWiseForeignEmploymentCountries)
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseForeignEmploymentCountries)
      .set({
        ageGroup: input.ageGroup,
        gender: input.gender,
        country: input.country,
        population: input.population,
        total: input.total,
      })
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id));

    return { success: true };
  });

// Delete a ward-wise foreign employment countries entry
export const deleteWardWiseForeignEmploymentCountries = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise foreign employment countries data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseForeignEmploymentCountries)
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseForeignEmploymentCountriesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Try main schema first, then fall back to ACME
      let summaryData: any[] = [];

      try {
        const mainSummary = await ctx.db
          .select({
            country: wardWiseForeignEmploymentCountries.country,
            totalPopulation: sql<number>`SUM(${wardWiseForeignEmploymentCountries.population})`,
          })
          .from(wardWiseForeignEmploymentCountries)
          .where(eq(wardWiseForeignEmploymentCountries.ageGroup, 'TOTAL'))
          .groupBy(wardWiseForeignEmploymentCountries.country)
          .orderBy(desc(sql`SUM(${wardWiseForeignEmploymentCountries.population})`));

        summaryData = mainSummary.map(row => ({
          country: row.country,
          total_population: row.totalPopulation,
        }));
      } catch (mainError) {
        console.log("Main schema summary failed, trying ACME:", mainError);
        
        const acmeSummarySql = sql`
          SELECT 
            country, 
            SUM(population) as total_population
          FROM 
            acme_ward_wise_foreign_employment_countries
          WHERE
            age_group = 'TOTAL' AND gender = 'TOTAL'
          GROUP BY 
            country
          ORDER BY 
            total_population DESC
        `;

        summaryData = await ctx.db.execute(acmeSummarySql);
      }

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseForeignEmploymentCountriesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve foreign employment summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseForeignEmploymentCountriesRouter = createTRPCRouter({
  getAll: getAllWardWiseForeignEmploymentCountries,
  getByWard: getWardWiseForeignEmploymentCountriesByWard,
  create: createWardWiseForeignEmploymentCountries,
  update: updateWardWiseForeignEmploymentCountries,
  delete: deleteWardWiseForeignEmploymentCountries,
  summary: getWardWiseForeignEmploymentCountriesSummary,
});
