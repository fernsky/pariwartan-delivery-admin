import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { disabilityByAge } from "@/server/db/schema/profile/demographics/ward-wise-disability-cause";
import { eq, sql } from "drizzle-orm";
import {
  disabilityByAgeSchema,
  disabilityByAgeFilterSchema,
  updateDisabilityByAgeSchema,
} from "./ward-wise-disability-cause.schema";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all disability data with optional filtering
export const getAllDisabilityByAge = publicProcedure
  .input(disabilityByAgeFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(disabilityByAge);

        const queryWithFilters = input?.ageGroup
          ? baseQuery.where(eq(disabilityByAge.ageGroup, input.ageGroup))
          : baseQuery;

        data = await queryWithFilters.orderBy(disabilityByAge.ageGroup);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            age_group,
            physical_disability,
            visual_impairment,
            hearing_impairment,
            deaf_mute,
            speech_hearing_combined,
            intellectual_disability,
            mental_psychosocial,
            autism,
            multiple_disabilities,
            other_disabilities,
            total
          FROM 
            acme_disability_by_age
          ORDER BY 
            age_group
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            ageGroup: row.age_group,
            physicalDisability: parseInt(String(row.physical_disability || "0")),
            visualImpairment: parseInt(String(row.visual_impairment || "0")),
            hearingImpairment: parseInt(String(row.hearing_impairment || "0")),
            deafMute: parseInt(String(row.deaf_mute || "0")),
            speechHearingCombined: parseInt(String(row.speech_hearing_combined || "0")),
            intellectualDisability: parseInt(String(row.intellectual_disability || "0")),
            mentalPsychosocial: parseInt(String(row.mental_psychosocial || "0")),
            autism: parseInt(String(row.autism || "0")),
            multipleDisabilities: parseInt(String(row.multiple_disabilities || "0")),
            otherDisabilities: parseInt(String(row.other_disabilities || "0")),
            total: parseInt(String(row.total || "0")),
          }));

          // Apply filters if needed
          if (input?.ageGroup) {
            data = data.filter((item) => item.ageGroup === input.ageGroup);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching disability by age data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific age group
export const getDisabilityByAgeGroup = publicProcedure
  .input(z.object({ ageGroup: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(disabilityByAge)
      .where(eq(disabilityByAge.ageGroup, input.ageGroup));

    return data;
  });

// Create a new disability by age entry
export const createDisabilityByAge = protectedProcedure
  .input(disabilityByAgeSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create disability data",
      });
    }

    // Check if entry already exists for this age group
    const existing = await ctx.db
      .select({ id: disabilityByAge.id })
      .from(disabilityByAge)
      .where(eq(disabilityByAge.ageGroup, input.ageGroup))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for age group ${input.ageGroup} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(disabilityByAge).values({
      id: input.id || uuidv4(),
      ageGroup: input.ageGroup,
      physicalDisability: input.physicalDisability,
      visualImpairment: input.visualImpairment,
      hearingImpairment: input.hearingImpairment,
      deafMute: input.deafMute,
      speechHearingCombined: input.speechHearingCombined,
      intellectualDisability: input.intellectualDisability,
      mentalPsychosocial: input.mentalPsychosocial,
      autism: input.autism,
      multipleDisabilities: input.multipleDisabilities,
      otherDisabilities: input.otherDisabilities,
      total: input.total,
    });

    return { success: true };
  });

// Update an existing disability by age entry
export const updateDisabilityByAge = protectedProcedure
  .input(updateDisabilityByAgeSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update disability data",
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
      .select({ id: disabilityByAge.id })
      .from(disabilityByAge)
      .where(eq(disabilityByAge.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(disabilityByAge)
      .set({
        ageGroup: input.ageGroup,
        physicalDisability: input.physicalDisability,
        visualImpairment: input.visualImpairment,
        hearingImpairment: input.hearingImpairment,
        deafMute: input.deafMute,
        speechHearingCombined: input.speechHearingCombined,
        intellectualDisability: input.intellectualDisability,
        mentalPsychosocial: input.mentalPsychosocial,
        autism: input.autism,
        multipleDisabilities: input.multipleDisabilities,
        otherDisabilities: input.otherDisabilities,
        total: input.total,
      })
      .where(eq(disabilityByAge.id, input.id));

    return { success: true };
  });

// Delete a disability by age entry
export const deleteDisabilityByAge = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete disability data",
      });
    }

    await ctx.db
      .delete(disabilityByAge)
      .where(eq(disabilityByAge.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getDisabilityByAgeSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      const summarySql = sql`
        SELECT 
          SUM(physical_disability) as total_physical_disability,
          SUM(visual_impairment) as total_visual_impairment,
          SUM(hearing_impairment) as total_hearing_impairment,
          SUM(deaf_mute) as total_deaf_mute,
          SUM(speech_hearing_combined) as total_speech_hearing_combined,
          SUM(intellectual_disability) as total_intellectual_disability,
          SUM(mental_psychosocial) as total_mental_psychosocial,
          SUM(autism) as total_autism,
          SUM(multiple_disabilities) as total_multiple_disabilities,
          SUM(other_disabilities) as total_other_disabilities,
          SUM(total) as grand_total
        FROM 
          acme_disability_by_age
        WHERE 
          age_group != 'जम्मा'
      `;

      const summaryData = await ctx.db.execute(summarySql);
      return summaryData;
    } catch (error) {
      console.error("Error in getDisabilityByAgeSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve disability summary",
      });
    }
  });

// Export the router with all procedures
export const disabilityByAgeRouter = createTRPCRouter({
  getAll: getAllDisabilityByAge,
  getByAgeGroup: getDisabilityByAgeGroup,
  create: createDisabilityByAge,
  update: updateDisabilityByAge,
  delete: deleteDisabilityByAge,
  summary: getDisabilityByAgeSummary,
});
      