import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideAgricultureRepresentatives } from "@/server/db/schema/profile/economics/municipality-wide-agriculture-representatives";
import { eq, and, sql, like } from "drizzle-orm";
import {
  municipalityWideAgricultureRepresentativesSchema,
  municipalityWideAgricultureRepresentativesFilterSchema,
  updateMunicipalityWideAgricultureRepresentativesSchema,
} from "./municipality-wide-agriculture-representatives.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide agriculture representatives with optional filtering
export const getAllMunicipalityWideAgricultureRepresentatives = publicProcedure
  .input(municipalityWideAgricultureRepresentativesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(municipalityWideAgricultureRepresentatives);

      let conditions = [];

      if (input?.serialNumber) {
        conditions.push(
          eq(municipalityWideAgricultureRepresentatives.serialNumber, input.serialNumber),
        );
      }

      if (input?.name) {
        conditions.push(
          like(municipalityWideAgricultureRepresentatives.name, `%${input.name}%`),
        );
      }

      if (input?.position) {
        conditions.push(
          like(municipalityWideAgricultureRepresentatives.position, `%${input.position}%`),
        );
      }

      if (input?.branch) {
        conditions.push(
          like(municipalityWideAgricultureRepresentatives.branch, `%${input.branch}%`),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by serial number
      const data = await queryWithFilters.orderBy(
        municipalityWideAgricultureRepresentatives.serialNumber,
      );

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide agriculture representatives:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific representative by serial number
export const getMunicipalityWideAgricultureRepresentativeBySerial = publicProcedure
  .input(z.object({ serialNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideAgricultureRepresentatives)
      .where(eq(municipalityWideAgricultureRepresentatives.serialNumber, input.serialNumber));

    return data;
  });

// Create a new municipality-wide agriculture representative entry
export const createMunicipalityWideAgricultureRepresentative = protectedProcedure
  .input(municipalityWideAgricultureRepresentativesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create agriculture representative data",
      });
    }

    // Check if entry already exists for this serial number
    const existing = await ctx.db
      .select({ id: municipalityWideAgricultureRepresentatives.id })
      .from(municipalityWideAgricultureRepresentatives)
      .where(
        eq(municipalityWideAgricultureRepresentatives.serialNumber, input.serialNumber)
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Representative with Serial Number ${input.serialNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideAgricultureRepresentatives).values({
      id: input.id || uuidv4(),
      serialNumber: input.serialNumber,
      name: input.name,
      nameEnglish: input.nameEnglish,
      position: input.position,
      positionFull: input.positionFull,
      positionEnglish: input.positionEnglish,
      contactNumber: input.contactNumber,
      branch: input.branch,
      branchEnglish: input.branchEnglish,
      remarks: input.remarks || "",
    });

    return { success: true };
  });

// Update an existing municipality-wide agriculture representative entry
export const updateMunicipalityWideAgricultureRepresentative = protectedProcedure
  .input(updateMunicipalityWideAgricultureRepresentativesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update agriculture representative data",
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
      .select({ id: municipalityWideAgricultureRepresentatives.id })
      .from(municipalityWideAgricultureRepresentatives)
      .where(eq(municipalityWideAgricultureRepresentatives.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideAgricultureRepresentatives)
      .set({
        serialNumber: input.serialNumber,
        name: input.name,
        nameEnglish: input.nameEnglish,
        position: input.position,
        positionFull: input.positionFull,
        positionEnglish: input.positionEnglish,
        contactNumber: input.contactNumber,
        branch: input.branch,
        branchEnglish: input.branchEnglish,
        remarks: input.remarks || "",
      })
      .where(eq(municipalityWideAgricultureRepresentatives.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide agriculture representative entry
export const deleteMunicipalityWideAgricultureRepresentative = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete agriculture representative data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideAgricultureRepresentatives)
      .where(eq(municipalityWideAgricultureRepresentatives.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideAgricultureRepresentativesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get summary statistics
      const totalResult = await ctx.db
        .select({ count: sql`COUNT(*)` })
        .from(municipalityWideAgricultureRepresentatives);

      const branchResult = await ctx.db
        .select({ 
          branch: municipalityWideAgricultureRepresentatives.branch,
          branchEnglish: municipalityWideAgricultureRepresentatives.branchEnglish,
          count: sql`COUNT(*)` 
        })
        .from(municipalityWideAgricultureRepresentatives)
        .groupBy(
          municipalityWideAgricultureRepresentatives.branch,
          municipalityWideAgricultureRepresentatives.branchEnglish
        )
        .limit(1);

      const positionResult = await ctx.db
        .select({ 
          positionFull: municipalityWideAgricultureRepresentatives.positionFull,
          positionEnglish: municipalityWideAgricultureRepresentatives.positionEnglish,
          count: sql`COUNT(*)` 
        })
        .from(municipalityWideAgricultureRepresentatives)
        .groupBy(
          municipalityWideAgricultureRepresentatives.positionFull,
          municipalityWideAgricultureRepresentatives.positionEnglish
        )
        .limit(1);

      return {
        total_employees: parseInt(String(totalResult[0]?.count || "0")),
        department: branchResult[0]?.branch || "कृषि",
        department_english: branchResult[0]?.branchEnglish || "Agriculture",
        position_type: positionResult[0]?.positionFull || "नायब प्रशासन सहायक",
        position_type_english: positionResult[0]?.positionEnglish || "Assistant Administration Officer",
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideAgricultureRepresentativesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve agriculture representatives summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideAgricultureRepresentativesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideAgricultureRepresentatives,
  getBySerial: getMunicipalityWideAgricultureRepresentativeBySerial,
  create: createMunicipalityWideAgricultureRepresentative,
  update: updateMunicipalityWideAgricultureRepresentative,
  delete: deleteMunicipalityWideAgricultureRepresentative,
  summary: getMunicipalityWideAgricultureRepresentativesSummary,
});
