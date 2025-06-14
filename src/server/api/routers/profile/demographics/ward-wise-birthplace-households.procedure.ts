import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { birthplaceHouseholds } from "@/server/db/schema/profile/demographics/ward-wise-birthplace-households";
import { eq, and, sql } from "drizzle-orm";
import {
  birthplaceHouseholdsSchema,
  birthplaceHouseholdsFilterSchema,
  updateBirthplaceHouseholdsSchema,
} from "./ward-wise-birthplace-households.schema";
import { TRPCError } from "@trpc/server";
import { any, z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all birthplace households data with optional filtering
export const getAllBirthplaceHouseholds = publicProcedure
  .input(birthplaceHouseholdsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Query the ACME table directly
      const acmeSql = sql`
        SELECT 
          id,
          age_group,
          total_population,
          nepal_born,
          born_in_district_municipality,
          born_in_district_other,
          born_in_district_total,
          born_other_district,
          born_abroad,
          birth_place_unknown
        FROM 
          acme_birthplace_households
        ORDER BY 
          CASE age_group
            WHEN 'जम्मा' THEN 999
            ELSE 0
          END,
          age_group
      `;
      const acmeResult = await ctx.db.execute(acmeSql);

      let data: any[] | PromiseLike<any[]> = [];
      if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
        // Transform ACME data to match expected schema
        data = acmeResult.map((row) => ({
          id: row.id,
          ageGroup: row.age_group,
          totalPopulation: parseInt(String(row.total_population || "0")),
          nepalBorn: parseInt(String(row.nepal_born || "0")),
          bornInDistrictMunicipality: parseInt(String(row.born_in_district_municipality || "0")),
          bornInDistrictOther: parseInt(String(row.born_in_district_other || "0")),
          bornInDistrictTotal: parseInt(String(row.born_in_district_total || "0")),
          bornOtherDistrict: parseInt(String(row.born_other_district || "0")),
          bornAbroad: parseInt(String(row.born_abroad || "0")),
          birthPlaceUnknown: parseInt(String(row.birth_place_unknown || "0")),
        }));

        // Apply filters if needed
        if (input?.ageGroup) {
          data = data.filter((item) => item.ageGroup === input.ageGroup);
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching birthplace households data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific age group
export const getBirthplaceHouseholdsByAgeGroup = publicProcedure
  .input(z.object({ ageGroup: z.string() }))
  .query(async ({ ctx, input }) => {
    const acmeSql = sql`
      SELECT 
        id,
        age_group,
        total_population,
        nepal_born,
        born_in_district_municipality,
        born_in_district_other,
        born_in_district_total,
        born_other_district,
        born_abroad,
        birth_place_unknown
      FROM 
        acme_birthplace_households
      WHERE 
        age_group = ${input.ageGroup}
    `;
    const result = await ctx.db.execute(acmeSql);

    return result.map((row) => ({
      id: row.id,
      ageGroup: row.age_group,
      totalPopulation: parseInt(String(row.total_population || "0")),
      nepalBorn: parseInt(String(row.nepal_born || "0")),
      bornInDistrictMunicipality: parseInt(String(row.born_in_district_municipality || "0")),
      bornInDistrictOther: parseInt(String(row.born_in_district_other || "0")),
      bornInDistrictTotal: parseInt(String(row.born_in_district_total || "0")),
      bornOtherDistrict: parseInt(String(row.born_other_district || "0")),
      bornAbroad: parseInt(String(row.born_abroad || "0")),
      birthPlaceUnknown: parseInt(String(row.birth_place_unknown || "0")),
    }));
  });

// Create a new birthplace households entry
export const createBirthplaceHouseholds = protectedProcedure
  .input(birthplaceHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create birthplace households data",
      });
    }

    // Check if entry already exists for this age group
    const existingQuery = sql`
      SELECT id FROM acme_birthplace_households 
      WHERE age_group = ${input.ageGroup}
      LIMIT 1
    `;
    const existing = await ctx.db.execute(existingQuery);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup} already exists`,
      });
    }

    // Create new record
    const insertQuery = sql`
      INSERT INTO acme_birthplace_households (
        id, age_group, total_population, nepal_born,
        born_in_district_municipality, born_in_district_other, born_in_district_total,
        born_other_district, born_abroad, birth_place_unknown
      ) VALUES (
        ${input.id || uuidv4()}, ${input.ageGroup}, 
        ${input.totalPopulation}, ${input.nepalBorn}, ${input.bornInDistrictMunicipality},
        ${input.bornInDistrictOther}, ${input.bornInDistrictTotal}, ${input.bornOtherDistrict},
        ${input.bornAbroad}, ${input.birthPlaceUnknown}
      )
    `;
    await ctx.db.execute(insertQuery);

    return { success: true };
  });

// Update an existing birthplace households entry
export const updateBirthplaceHouseholds = protectedProcedure
  .input(updateBirthplaceHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update birthplace households data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existingQuery = sql`
      SELECT id FROM acme_birthplace_households 
      WHERE id = ${input.id}
      LIMIT 1
    `;
    const existing = await ctx.db.execute(existingQuery);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    const updateQuery = sql`
      UPDATE acme_birthplace_households 
      SET 
        age_group = ${input.ageGroup},
        total_population = ${input.totalPopulation},
        nepal_born = ${input.nepalBorn},
        born_in_district_municipality = ${input.bornInDistrictMunicipality},
        born_in_district_other = ${input.bornInDistrictOther},
        born_in_district_total = ${input.bornInDistrictTotal},
        born_other_district = ${input.bornOtherDistrict},
        born_abroad = ${input.bornAbroad},
        birth_place_unknown = ${input.birthPlaceUnknown},
        updated_at = NOW()
      WHERE id = ${input.id}
    `;
    await ctx.db.execute(updateQuery);

    return { success: true };
  });

// Delete a birthplace households entry
export const deleteBirthplaceHouseholds = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete birthplace households data",
      });
    }

    // Delete the record
    const deleteQuery = sql`
      DELETE FROM acme_birthplace_households 
      WHERE id = ${input.id}
    `;
    await ctx.db.execute(deleteQuery);

    return { success: true };
  });

// Get summary statistics
export const getBirthplaceHouseholdsSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get summary data
      const summarySql = sql`
        SELECT 
          age_group,
          total_population,
          nepal_born,
          born_in_district_municipality,
          born_in_district_other,
          born_in_district_total,
          born_other_district,
          born_abroad,
          birth_place_unknown
        FROM 
          acme_birthplace_households
        WHERE 
          age_group != 'जम्मा'
        ORDER BY 
          age_group
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getBirthplaceHouseholdsSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve birthplace households summary",
      });
    }
  });

// Export the router with all procedures
export const birthplaceHouseholdsRouter = createTRPCRouter({
  getAll: getAllBirthplaceHouseholds,
  getByAgeGroup: getBirthplaceHouseholdsByAgeGroup,
  create: createBirthplaceHouseholds,
  update: updateBirthplaceHouseholds,
  delete: deleteBirthplaceHouseholds,
  summary: getBirthplaceHouseholdsSummary,
});
       