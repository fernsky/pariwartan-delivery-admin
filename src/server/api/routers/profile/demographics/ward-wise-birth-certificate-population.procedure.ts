import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseBirthCertificatePopulation } from "@/server/db/schema/profile/demographics/ward-wise-birth-certificate-population";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseBirthCertificatePopulationSchema,
  wardWiseBirthCertificatePopulationFilterSchema,
  updateWardWiseBirthCertificatePopulationSchema,
} from "./ward-wise-birth-certificate-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise birth certificate population data with optional filtering
export const getAllWardWiseBirthCertificatePopulation = publicProcedure
  .input(wardWiseBirthCertificatePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db
          .select()
          .from(wardWiseBirthCertificatePopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseBirthCertificatePopulation.wardNumber,
              input.wardNumber,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseBirthCertificatePopulation.wardNumber,
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
            with_birth_certificate,
            without_birth_certificate,
            total_population_under_5
          FROM 
            acme_ward_wise_birth_certificate_population
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            withBirthCertificate: parseInt(String(row.with_birth_certificate || "0")),
            withoutBirthCertificate: parseInt(String(row.without_birth_certificate || "0")),
            totalPopulationUnder5: parseInt(String(row.total_population_under_5 || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise birth certificate population data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseBirthCertificatePopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseBirthCertificatePopulation)
      .where(
        eq(
          wardWiseBirthCertificatePopulation.wardNumber,
          input.wardNumber,
        ),
      );

    return data[0] || null;
  });

// Create a new ward-wise birth certificate population entry
export const createWardWiseBirthCertificatePopulation = protectedProcedure
  .input(wardWiseBirthCertificatePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise birth certificate population data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseBirthCertificatePopulation.id })
      .from(wardWiseBirthCertificatePopulation)
      .where(
        eq(
          wardWiseBirthCertificatePopulation.wardNumber,
          input.wardNumber,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardWiseBirthCertificatePopulation)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        withBirthCertificate: input.withBirthCertificate,
        withoutBirthCertificate: input.withoutBirthCertificate,
      });

    return { success: true };
  });

// Update an existing ward-wise birth certificate population entry
export const updateWardWiseBirthCertificatePopulation = protectedProcedure
  .input(updateWardWiseBirthCertificatePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise birth certificate population data",
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
      .select({ id: wardWiseBirthCertificatePopulation.id })
      .from(wardWiseBirthCertificatePopulation)
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseBirthCertificatePopulation)
      .set({
        wardNumber: input.wardNumber,
        withBirthCertificate: input.withBirthCertificate,
        withoutBirthCertificate: input.withoutBirthCertificate,
      })
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise birth certificate population entry
export const deleteWardWiseBirthCertificatePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise birth certificate population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseBirthCertificatePopulation)
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseBirthCertificatePopulationSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get total counts across all wards
      const summarySql = sql`
        SELECT 
          SUM(with_birth_certificate) as total_with_birth_certificate,
          SUM(without_birth_certificate) as total_without_birth_certificate,
          SUM(total_population_under_5) as total_population_under_5
        FROM 
          acme_ward_wise_birth_certificate_population
      `;

      const summaryData = await ctx.db.execute(summarySql);
      
      return {
        totalWithBirthCertificate: parseInt(String(summaryData[0]?.total_with_birth_certificate || "0")),
        totalWithoutBirthCertificate: parseInt(String(summaryData[0]?.total_without_birth_certificate || "0")),
        totalPopulationUnder5: parseInt(String(summaryData[0]?.total_population_under_5 || "0")),
      };
    } catch (error) {
      console.error(
        "Error in getWardWiseBirthCertificatePopulationSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise birth certificate population summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseBirthCertificatePopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseBirthCertificatePopulation,
  getByWard: getWardWiseBirthCertificatePopulationByWard,
  create: createWardWiseBirthCertificatePopulation,
  update: updateWardWiseBirthCertificatePopulation,
  delete: deleteWardWiseBirthCertificatePopulation,
  summary: getWardWiseBirthCertificatePopulationSummary,
});
