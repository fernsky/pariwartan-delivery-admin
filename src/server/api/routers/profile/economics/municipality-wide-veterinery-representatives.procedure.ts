import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideVeterinaryRepresentatives } from "@/server/db/schema/profile/economics/municipality-wide-veterinery-representatives";
import { eq, and, sql, like } from "drizzle-orm";
import {
  municipalityWideVeterinaryRepresentativesSchema,
  municipalityWideVeterinaryRepresentativesFilterSchema,
  updateMunicipalityWideVeterinaryRepresentativesSchema,
} from "./municipality-wide-veterinery-representatives.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide veterinary representatives with optional filtering
export const getAllMunicipalityWideVeterinaryRepresentatives = publicProcedure
  .input(municipalityWideVeterinaryRepresentativesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(municipalityWideVeterinaryRepresentatives);

      let conditions = [];

      if (input?.serialNumber) {
        conditions.push(
          eq(municipalityWideVeterinaryRepresentatives.serialNumber, input.serialNumber),
        );
      }

      if (input?.name) {
        conditions.push(
          like(municipalityWideVeterinaryRepresentatives.name, `%${input.name}%`),
        );
      }

      if (input?.position) {
        conditions.push(
          like(municipalityWideVeterinaryRepresentatives.position, `%${input.position}%`),
        );
      }

      if (input?.branch) {
        conditions.push(
          like(municipalityWideVeterinaryRepresentatives.branch, `%${input.branch}%`),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by serial number
      const data = await queryWithFilters.orderBy(
        municipalityWideVeterinaryRepresentatives.serialNumber,
      );

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide veterinary representatives:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific representative by serial number
export const getMunicipalityWideVeterinaryRepresentativeBySerial = publicProcedure
  .input(z.object({ serialNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideVeterinaryRepresentatives)
      .where(eq(municipalityWideVeterinaryRepresentatives.serialNumber, input.serialNumber));

    return data;
  });

// Create a new municipality-wide veterinary representative entry
export const createMunicipalityWideVeterinaryRepresentative = protectedProcedure
  .input(municipalityWideVeterinaryRepresentativesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create veterinary representative data",
      });
    }

    // Check if entry already exists for this serial number
    const existing = await ctx.db
      .select({ id: municipalityWideVeterinaryRepresentatives.id })
      .from(municipalityWideVeterinaryRepresentatives)
      .where(
        eq(municipalityWideVeterinaryRepresentatives.serialNumber, input.serialNumber)
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Representative with Serial Number ${input.serialNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideVeterinaryRepresentatives).values({
      id: input.id || uuidv4(),
      serialNumber: input.serialNumber,
      name: input.name,
      nameEnglish: input.nameEnglish,
      position: input.position,
      positionEnglish: input.positionEnglish,
      contactNumber: input.contactNumber,
      branch: input.branch,
      branchEnglish: input.branchEnglish,
      remarks: input.remarks || "",
    });

    return { success: true };
  });

// Update an existing municipality-wide veterinary representative entry
export const updateMunicipalityWideVeterinaryRepresentative = protectedProcedure
  .input(updateMunicipalityWideVeterinaryRepresentativesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update veterinary representative data",
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
      .select({ id: municipalityWideVeterinaryRepresentatives.id })
      .from(municipalityWideVeterinaryRepresentatives)
      .where(eq(municipalityWideVeterinaryRepresentatives.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideVeterinaryRepresentatives)
      .set({
        serialNumber: input.serialNumber,
        name: input.name,
        nameEnglish: input.nameEnglish,
        position: input.position,
        positionEnglish: input.positionEnglish,
        contactNumber: input.contactNumber,
        branch: input.branch,
        branchEnglish: input.branchEnglish,
        remarks: input.remarks || "",
      })
      .where(eq(municipalityWideVeterinaryRepresentatives.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide veterinary representative entry
export const deleteMunicipalityWideVeterinaryRepresentative = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete veterinary representative data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideVeterinaryRepresentatives)
      .where(eq(municipalityWideVeterinaryRepresentatives.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideVeterinaryRepresentativesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get summary statistics
      const totalResult = await ctx.db
        .select({ count: sql`COUNT(*)` })
        .from(municipalityWideVeterinaryRepresentatives);

      const branchResult = await ctx.db
        .select({ 
          branch: municipalityWideVeterinaryRepresentatives.branch,
          branchEnglish: municipalityWideVeterinaryRepresentatives.branchEnglish,
          count: sql`COUNT(*)` 
        })
        .from(municipalityWideVeterinaryRepresentatives)
        .groupBy(
          municipalityWideVeterinaryRepresentatives.branch,
          municipalityWideVeterinaryRepresentatives.branchEnglish
        )
        .limit(1);

      // Get position statistics
      const positionStats = await ctx.db
        .select({ 
          position: municipalityWideVeterinaryRepresentatives.position,
          positionEnglish: municipalityWideVeterinaryRepresentatives.positionEnglish,
          count: sql`COUNT(*)` 
        })
        .from(municipalityWideVeterinaryRepresentatives)
        .groupBy(
          municipalityWideVeterinaryRepresentatives.position,
          municipalityWideVeterinaryRepresentatives.positionEnglish
        );

      return {
        total_staff: parseInt(String(totalResult[0]?.count || "0")),
        department: branchResult[0]?.branch || "पशु सेवा शाखा",
        department_english: branchResult[0]?.branchEnglish || "Animal Service Branch",
        positions: positionStats.map(stat => ({
          position: stat.position,
          position_english: stat.positionEnglish,
          count: parseInt(String(stat.count || "0"))
        }))
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideVeterinaryRepresentativesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve veterinary representatives summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideVeterinaryRepresentativesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideVeterinaryRepresentatives,
  getBySerial: getMunicipalityWideVeterinaryRepresentativeBySerial,
  create: createMunicipalityWideVeterinaryRepresentative,
  update: updateMunicipalityWideVeterinaryRepresentative,
  delete: deleteMunicipalityWideVeterinaryRepresentative,
  summary: getMunicipalityWideVeterinaryRepresentativesSummary,
});
